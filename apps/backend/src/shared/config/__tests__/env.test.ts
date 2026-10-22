import { describe, it, expect } from 'vitest';
import { env } from '../env.config.js';

describe('Environment Variables Lockdown & Validation (Task D-02)', () => {
  it('should have sanitized, production-ready environment properties loaded', () => {
    expect(env).toBeDefined();
    expect(env.PORT).toBeTypeOf('number');
    expect(env.API_VERSION).toBe('v1');
    expect(env.MONGODB_URI).toBeDefined();
    expect(typeof env.ENABLE_REDIS).toBe('boolean');
  });

  it('should enforce default database connection pool limits', () => {
    expect(env.MONGO_MAX_POOL_SIZE).toBeGreaterThanOrEqual(5);
    expect(env.MONGO_MIN_POOL_SIZE).toBeGreaterThanOrEqual(1);
    expect(env.MONGO_MAX_POOL_SIZE).toBeGreaterThanOrEqual(env.MONGO_MIN_POOL_SIZE);
  });

  it('should enforce minimum length on JWT secrets for security hardening', () => {
    expect(env.JWT_ACCESS_SECRET.length).toBeGreaterThanOrEqual(16);
    expect(env.JWT_REFRESH_SECRET.length).toBeGreaterThanOrEqual(16);
  });

  it('should provide default test and dev CORS allowed origins', () => {
    expect(env.CLIENT_WEB_URL).toBeDefined();
    expect(env.CLIENT_MERCHANT_URL).toBeDefined();
    expect(typeof env.ADDITIONAL_ALLOWED_ORIGINS).toBe('string');
  });

  it('should have optional Meta WhatsApp configuration keys present as strings', () => {
    expect(typeof env.WHATSAPP_PHONE_NUMBER_ID).toBe('string');
    expect(typeof env.WHATSAPP_ACCESS_TOKEN).toBe('string');
    expect(typeof env.WHATSAPP_BUSINESS_ACCOUNT_ID).toBe('string');
    expect(typeof env.WHATSAPP_API_VERSION).toBe('string');
  });
});
