import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

// Load .env
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  API_VERSION: z.string().default('v1'),

  // Database
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  // Redis
  ENABLE_REDIS: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        if (val.toLowerCase() === 'false' || val === '0') return false;
        if (val.toLowerCase() === 'true' || val === '1') return true;
      }
      return val;
    }, z.boolean())
    .default(true),
  REDIS_URL: z.string().default('redis://127.0.0.1:6379'),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 chars'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 chars'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Client URLs for CORS
  CLIENT_WEB_URL: z.string().default('http://localhost:3000'),
  CLIENT_MERCHANT_URL: z.string().default('http://localhost:3001'),
  ADDITIONAL_ALLOWED_ORIGINS: z.string().optional().default(''),

  // Storage
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

const isTestEnv = process.env.NODE_ENV === 'test';

const testDefaults = {
  NODE_ENV: 'test' as const,
  PORT: 5000,
  API_VERSION: 'v1',
  MONGODB_URI: 'mongodb://localhost:27017/platform-db-test',
  ENABLE_REDIS: false,
  REDIS_URL: 'redis://127.0.0.1:6379',
  JWT_ACCESS_SECRET: 'test_access_secret_1234567890123456',
  JWT_REFRESH_SECRET: 'test_refresh_secret_1234567890123456',
  JWT_ACCESS_EXPIRY: '15m',
  JWT_REFRESH_EXPIRY: '7d',
  CLIENT_WEB_URL: 'http://localhost:3000',
  CLIENT_MERCHANT_URL: 'http://localhost:3001',
  ADDITIONAL_ALLOWED_ORIGINS: '',
};

const rawEnv = isTestEnv ? { ...testDefaults, ...process.env } : process.env;
const parsedEnv = envSchema.safeParse(rawEnv);

if (!parsedEnv.success) {
  logger.error('❌ Invalid environment variables configuration:', parsedEnv.error.format());
  if (!isTestEnv) {
    process.exit(1);
  }
}

export const env = (parsedEnv.success ? parsedEnv.data : {
  NODE_ENV: 'test',
  PORT: 5000,
  API_VERSION: 'v1',
  MONGODB_URI: 'mongodb://localhost:27017/platform-db-test',
  ENABLE_REDIS: false,
  REDIS_URL: 'redis://127.0.0.1:6379',
  JWT_ACCESS_SECRET: 'test_access_secret_1234567890123456',
  JWT_REFRESH_SECRET: 'test_refresh_secret_1234567890123456',
  JWT_ACCESS_EXPIRY: '15m',
  JWT_REFRESH_EXPIRY: '7d',
  CLIENT_WEB_URL: 'http://localhost:3000',
  CLIENT_MERCHANT_URL: 'http://localhost:3001',
  ADDITIONAL_ALLOWED_ORIGINS: '',
}) as z.infer<typeof envSchema>;
