import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createApp } from './app.js';
import { env } from './shared/config/env.config.js';
import { connectDatabase, disconnectDatabase } from './shared/database/connection.js';
import { connectRedis, disconnectRedis, getRedisClient, checkRedisHealth } from './shared/redis/client.js';
import { eventBus } from './shared/events/eventBus.js';
import { EVENTS } from './shared/events/eventTypes.js';
import { logger } from './shared/utils/logger.js';
import { isOriginAllowed } from './shared/utils/cors.js';


async function bootstrap() {
  try {
    logger.info('🚀 Bootstrapping backend services...');

    // 1. Connect MongoDB
    await connectDatabase();

    // 2. Connect Redis
    await connectRedis();

    // 3. Create Express App
    const app = createApp();
    const server = http.createServer(app);

    // 4. Attach Socket.io
    const io = new SocketIOServer(server, {
      cors: {
        origin: (origin, callback) => {
          if (isOriginAllowed(origin)) {
            return callback(null, true);
          }
          return callback(new Error(`Origin ${origin} not permitted by Socket.io CORS`));
        },
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Wire Redis Adapter for cross-instance Socket.io if Redis is active
    if (checkRedisHealth()) {
      try {
        const pubClient = getRedisClient();
        if (pubClient) {
          const subClient = pubClient.duplicate();
          io.adapter(createAdapter(pubClient, subClient));
          logger.info('⚡ Socket.io configured with Redis adapter');
        }
      } catch (err) {
        logger.warn('⚠️ Socket.io Redis adapter setup skipped, using in-memory adapter');
      }
    }

    io.on('connection', (socket) => {
      logger.debug(`🔌 New Socket client connected: ${socket.id}`);

      // Allow clients to join rooms for scoped real-time updates (store:<storeId>, user:<userId>, order:<orderId>)
      socket.on('join_room', (room: string) => {
        if (typeof room === 'string' && room.length < 100) {
          socket.join(room);
          logger.debug(`🔌 Socket ${socket.id} joined room: ${room}`);
        }
      });

      socket.on('leave_room', (room: string) => {
        if (typeof room === 'string' && room.length < 100) {
          socket.leave(room);
          logger.debug(`🔌 Socket ${socket.id} left room: ${room}`);
        }
      });

      socket.on('disconnect', (reason) => {
        logger.debug(`🔌 Socket client disconnected: ${socket.id} (${reason})`);
      });
    });

    // Wire in-process EventBus to Socket.io & Redis Adapter for distributed real-time sync (structure.md Section 5 & 6.2)
    eventBus.on(EVENTS.ORDER_PLACED, (payload) => {
      io.to(`store:${payload.storeId}`).emit(EVENTS.ORDER_PLACED, payload);
      io.to(`user:${payload.userId}`).emit(EVENTS.ORDER_PLACED, payload);
      logger.debug(`📡 Socket broadcast ${EVENTS.ORDER_PLACED} to store:${payload.storeId} & user:${payload.userId}`);
    });

    eventBus.on(EVENTS.ORDER_CONFIRMED, (payload) => {
      io.to(`order:${payload.orderId}`).emit(EVENTS.ORDER_CONFIRMED, payload);
      logger.debug(`📡 Socket broadcast ${EVENTS.ORDER_CONFIRMED} to order:${payload.orderId}`);
    });

    eventBus.on(EVENTS.ORDER_CANCELLED, (payload) => {
      io.to(`order:${payload.orderId}`).emit(EVENTS.ORDER_CANCELLED, payload);
      logger.debug(`📡 Socket broadcast ${EVENTS.ORDER_CANCELLED} to order:${payload.orderId}`);
    });

    eventBus.on(EVENTS.ORDER_DELIVERED, (payload) => {
      io.to(`order:${payload.orderId}`).emit(EVENTS.ORDER_DELIVERED, payload);
      logger.debug(`📡 Socket broadcast ${EVENTS.ORDER_DELIVERED} to order:${payload.orderId}`);
    });

    eventBus.on(EVENTS.DELIVERY_ASSIGNED, (payload) => {
      io.to(`order:${payload.orderId}`).emit(EVENTS.DELIVERY_ASSIGNED, payload);
      logger.debug(`📡 Socket broadcast ${EVENTS.DELIVERY_ASSIGNED} to order:${payload.orderId}`);
    });

    eventBus.on(EVENTS.DELIVERY_COMPLETED, (payload) => {
      io.to(`order:${payload.orderId}`).emit(EVENTS.DELIVERY_COMPLETED, payload);
      logger.debug(`📡 Socket broadcast ${EVENTS.DELIVERY_COMPLETED} to order:${payload.orderId}`);
    });

    eventBus.on(EVENTS.NOTIFICATION_CREATED, (payload) => {
      const room = payload.recipientRole === 'merchant' ? `store:${payload.recipientId}` : `user:${payload.recipientId}`;
      io.to(room).emit(EVENTS.NOTIFICATION_CREATED, payload);
      logger.debug(`📡 Socket broadcast ${EVENTS.NOTIFICATION_CREATED} to room ${room}`);
    });

    // Make io accessible across app if needed

    app.set('io', io);


    // 5. Start HTTP Listener
    server.listen(env.PORT, () => {
      logger.info(`✨ Server running on http://localhost:${env.PORT}`);
      logger.info(`📡 API Version: /api/${env.API_VERSION}`);
      logger.info(`🌍 Environment: ${env.NODE_ENV}`);
    });

    // 6. Graceful Shutdown Traps
    const handleShutdown = async (signal: string) => {
      logger.info(`🛑 Received ${signal}. Initiating graceful shutdown...`);

      server.close(async () => {
        logger.info('🛑 HTTP server closed.');
        await disconnectRedis();
        await disconnectDatabase();
        logger.info('🛑 All connections terminated. Exiting process.');
        process.exit(0);
      });

      // Force terminate after 10s if hung
      setTimeout(() => {
        logger.error('⚠️ Forcefully terminating process after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('💥 Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (err: Error) => {
      logger.error('💥 Uncaught Exception:', err);
      process.exit(1);
    });
  } catch (error) {
    logger.error('❌ Critical startup failure:', error);
    process.exit(1);
  }
}

bootstrap();
