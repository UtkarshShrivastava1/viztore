import mongoose, { type ClientSession } from 'mongoose';

/**
 * Executes a callback within a MongoDB ACID transaction using snapshot read isolation
 * and majority write concern.
 * 
 * If running in a test or non-replica environment where transactions are unsupported,
 * gracefully falls back to executing the callback without a transaction session.
 */
export async function withTransaction<T>(
  work: (session?: ClientSession) => Promise<T>,
): Promise<T> {
  // If not connected to MongoDB or startSession is unavailable (e.g. unit tests without active Mongo connection)
  if (mongoose.connection.readyState !== 1) {
    return work();
  }

  let session: ClientSession;
  try {
    session = await mongoose.startSession();
  } catch {
    // If sessions are unsupported in current driver/mongod instance
    return work();
  }

  try {
    let result!: T;
    await session.withTransaction(
      async () => {
        result = await work(session);
      },
      {
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
        readPreference: 'primary',
      },
    );
    return result;
  } catch (error: any) {
    // Graceful fallback for standalone MongoDB deployments where replica sets are not configured
    if (
      error?.message?.includes('replica set member or mongos') ||
      error?.code === 20 ||
      error?.codeName === 'IllegalOperation'
    ) {
      return work();
    }
    throw error;
  } finally {
    await session.endSession();
  }
}
