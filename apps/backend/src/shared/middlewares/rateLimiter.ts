import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env.config.js';
import type { Request, Response } from 'express';

export interface RateLimiterConfig {
  windowMs?: number;
  max?: number;
  code: string;
  message: string;
}

/**
 * Factory for creating hardened, enterprise-grade strict rate limiters.
 * Standardizes the platform error response envelope and headers.
 */
export function createStrictLimiter(config: RateLimiterConfig) {
  const windowMs = config.windowMs ?? 15 * 60 * 1000;
  const max = config.max ?? (env.NODE_ENV === 'production' ? 5 : 50);

  return rateLimit({
    windowMs,
    max: (req: Request) => {
      // In automated test environments, allow strict enforcement when requested via header,
      // otherwise relax threshold so concurrent integration test suites are not throttled.
      if (env.NODE_ENV === 'test' && !req.headers['x-enforce-rate-limit']) {
        return 1000;
      }
      return max;
    },
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429,
    message: {
      success: false,
      error: {
        code: config.code,
        message: config.message,
      },
    },
    handler: (_req: Request, res: Response, _next, options) => {
      res.status(options.statusCode).json(options.message);
    },
  });
}

/**
 * Strict rate limiter for authentication endpoints (e.g., /auth/login, /auth/merchant/login).
 * Prevents credential stuffing, dictionary attacks, and password brute-forcing (10 reqs / 15 min).
 */
export const authRateLimiter = createStrictLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  code: 'AUTH_RATE_LIMIT_EXCEEDED',
  message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
});

/**
 * Strict rate limiter for sensitive OTP generation & phone verification endpoints.
 * Mitigates SMS/WhatsApp flooding and OTP enumeration (5 reqs / 15 min).
 */
export const otpRateLimiter = createStrictLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  code: 'OTP_RATE_LIMIT_EXCEEDED',
  message: 'Too many OTP requests from this connection. Please try again after 15 minutes.',
});

/**
 * High-security rate limiter for physical 4-digit Delivery Handshake OTP verification (/orders/:id/verify-otp).
 * Rendering brute-force attacks on 4-digit PINs (10,000 combinations) mathematically infeasible
 * by locking down after 5 attempts per 15 minutes.
 */
export const deliveryOtpRateLimiter = createStrictLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  code: 'DELIVERY_OTP_RATE_LIMIT_EXCEEDED',
  message: 'Too many delivery OTP verification attempts. Order handoff verification is locked for 15 minutes.',
});
