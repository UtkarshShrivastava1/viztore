import mongoose from 'mongoose';
import { env } from '../config/env.config.js';
import { logger } from '../utils/logger.js';

export async function connectDatabase(): Promise<typeof mongoose> {
  try {
    mongoose.connection.on('connected', () => {
      logger.info('📦 MongoDB connection established successfully');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB connection lost');
    });

    const conn = await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: env.MONGO_MAX_POOL_SIZE,
      minPoolSize: env.MONGO_MIN_POOL_SIZE,
      maxIdleTimeMS: 60_000,
      waitQueueTimeoutMS: 5_000,
      serverSelectionTimeoutMS: 5_000,
      socketTimeoutMS: 30_000,
      retryWrites: true,
      autoIndex: env.NODE_ENV !== 'production',
    });

    return conn;
  } catch (error) {
    logger.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
  logger.info('📦 MongoDB connection closed');
}
