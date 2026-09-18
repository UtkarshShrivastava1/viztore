import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import mongoSanitize from 'mongo-sanitize';
import { StatusCodes } from 'http-status-codes';
import { env } from './shared/config/env.config.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';
import { AppError } from './shared/utils/AppError.js';
import { ApiResponse } from './shared/utils/ApiResponse.js';
import { logger } from './shared/utils/logger.js';

import mongoose from 'mongoose';
import { checkRedisHealth } from './shared/redis/client.js';

// Import domain module routes
import { authRouter } from './modules/auth/index.js';
import { storeRouter } from './modules/stores/index.js';
import { catalogRouter } from './modules/catalog/index.js';
import { orderRouter } from './modules/orders/index.js';
import { deliveryRouter } from './modules/delivery/index.js';
import { notificationRouter } from './modules/notifications/index.js';



export function createApp(): Express {
  const app: Express = express();

  // Security Headers
  app.use(helmet());

  // CORS Configuration
  const allowedOrigins = [
    env.CLIENT_WEB_URL,
    env.CLIENT_MERCHANT_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new AppError(StatusCodes.FORBIDDEN, 'CORS_ERROR', `Origin ${origin} not permitted by CORS`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }),
  );

  // Request Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: env.NODE_ENV === 'production' ? 300 : 1500, // relaxed for dev/testing
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests from this IP, please try again after 15 minutes',
      },
    },
  });
  app.use('/api', limiter);

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Sanitize NoSQL injection attempts in body/query/params
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.body) req.body = mongoSanitize(req.body);
    if (req.params) req.params = mongoSanitize(req.params);
    next();
  });

  // Request Logging in dev
  if (env.NODE_ENV === 'development') {
    app.use((req: Request, _res: Response, next: NextFunction) => {
      logger.debug(`📥 ${req.method} ${req.originalUrl}`);
      next();
    });
  }

  // Health & Liveness / Readiness Probes (structure.md Section 6.4)
  // Liveness probe: Is the node process alive and responsive?
  app.get(['/health', '/healthz'], (_req: Request, res: Response) => {
    ApiResponse.success(res, {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: env.API_VERSION,
    });
  });

  // Readiness probe: Are database, redis, and system resources ready to accept traffic?
  app.get('/readyz', (_req: Request, res: Response) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    const isRedisHealthy = checkRedisHealth();
    const memory = process.memoryUsage();

    const checks = {
      database: isDbConnected ? 'connected' : 'disconnected',
      redis: isRedisHealthy ? 'connected' : (env.ENABLE_REDIS ? 'unreachable' : 'disabled_in_memory'),
      memory: {
        heapUsedMB: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
        heapTotalMB: Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100,
        rssMB: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };

    if (!isDbConnected) {
      res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Database connection is not ready to serve traffic',
          details: checks,
        },
      });
      return;
    }

    ApiResponse.success(res, checks, 'Service is ready to accept traffic');
  });


  // API Domain Routes (Versioned under /api/v1)
  const apiV1 = express.Router();
  apiV1.use('/auth', authRouter);
  apiV1.use('/users', authRouter);
  apiV1.use('/stores', storeRouter);
  apiV1.use('/catalog', catalogRouter);
  apiV1.use('/orders', orderRouter);
  apiV1.use('/delivery', deliveryRouter);
  apiV1.use('/notifications', notificationRouter);


  app.use(`/api/${env.API_VERSION}`, apiV1);

  // 404 Route Handler
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(AppError.notFound(`Endpoint ${req.method} ${req.originalUrl} not found on this server`, 'ROUTE_NOT_FOUND'));
  });

  // Centralized Global Error Handler
  app.use(errorHandler);

  return app;
}
