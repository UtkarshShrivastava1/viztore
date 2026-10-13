import { describe, it, expect } from 'vitest';
import express, { Request, Response } from 'express';
import request from 'supertest';
import {
  createStrictLimiter,
  authRateLimiter,
  otpRateLimiter,
  deliveryOtpRateLimiter,
} from '../rateLimiter.js';

describe('High-Security Brute-Force Rate Limiter (Task B-04)', () => {
  describe('createStrictLimiter factory behavior', () => {
    it('allows requests within limit and throttles with 429 once threshold exceeded', async () => {
      const app = express();
      const testLimiter = createStrictLimiter({
        windowMs: 60 * 1000,
        max: 3,
        code: 'TEST_RATE_LIMIT_EXCEEDED',
        message: 'Too many test requests.',
      });

      app.post('/test-endpoint', testLimiter, (_req: Request, res: Response) => {
        res.status(200).json({ success: true, message: 'ok' });
      });

      // 3 successful requests with x-enforce-rate-limit header
      for (let i = 0; i < 3; i++) {
        const res = await request(app)
          .post('/test-endpoint')
          .set('x-enforce-rate-limit', 'true');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      }

      // 4th request must be throttled with HTTP 429
      const throttledRes = await request(app)
        .post('/test-endpoint')
        .set('x-enforce-rate-limit', 'true');
      expect(throttledRes.status).toBe(429);
      expect(throttledRes.body).toEqual({
        success: false,
        error: {
          code: 'TEST_RATE_LIMIT_EXCEEDED',
          message: 'Too many test requests.',
        },
      });
      expect(throttledRes.headers['ratelimit-limit']).toBeDefined();
    });
  });

  describe('authRateLimiter configuration', () => {
    it('throttles excessive authentication attempts with AUTH_RATE_LIMIT_EXCEEDED code', async () => {
      const app = express();
      app.post('/auth/login', authRateLimiter, (_req: Request, res: Response) => {
        res.status(200).json({ success: true });
      });

      // Issue requests exceeding the strict threshold (10 reqs)
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/auth/login')
          .set('x-enforce-rate-limit', 'true');
      }

      const res = await request(app)
        .post('/auth/login')
        .set('x-enforce-rate-limit', 'true');
      expect(res.status).toBe(429);
      expect(res.body.error.code).toBe('AUTH_RATE_LIMIT_EXCEEDED');
      expect(res.body.error.message).toContain('Too many authentication attempts');
    });
  });

  describe('otpRateLimiter configuration', () => {
    it('throttles sensitive OTP generation / verification with OTP_RATE_LIMIT_EXCEEDED code', async () => {
      const app = express();
      app.post('/auth/otp/verify', otpRateLimiter, (_req: Request, res: Response) => {
        res.status(200).json({ success: true });
      });

      // Strict limit is 5 reqs
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/auth/otp/verify')
          .set('x-enforce-rate-limit', 'true');
      }

      const res = await request(app)
        .post('/auth/otp/verify')
        .set('x-enforce-rate-limit', 'true');
      expect(res.status).toBe(429);
      expect(res.body.error.code).toBe('OTP_RATE_LIMIT_EXCEEDED');
    });
  });

  describe('deliveryOtpRateLimiter configuration', () => {
    it('locks physical delivery handshake OTP endpoint after 5 attempts with DELIVERY_OTP_RATE_LIMIT_EXCEEDED code', async () => {
      const app = express();
      app.post('/orders/:id/verify-otp', deliveryOtpRateLimiter, (_req: Request, res: Response) => {
        res.status(200).json({ success: true });
      });

      // Strict limit is 5 reqs
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/orders/ord-123/verify-otp')
          .set('x-enforce-rate-limit', 'true');
      }

      const res = await request(app)
        .post('/orders/ord-123/verify-otp')
        .set('x-enforce-rate-limit', 'true');
      expect(res.status).toBe(429);
      expect(res.body.error.code).toBe('DELIVERY_OTP_RATE_LIMIT_EXCEEDED');
      expect(res.body.error.message).toContain('Too many delivery OTP verification attempts');
    });
  });
});
