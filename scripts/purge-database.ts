import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../apps/backend/.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

async function purgeAll() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not found in apps/backend/.env');

  console.log('🔌 Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  const db = mongoose.connection.db!;
  console.log(`Connected to database: ${db.databaseName}`);

  const collections = await db.listCollections().toArray();
  console.log(`Found ${collections.length} collection(s) in ${db.databaseName}.\n`);

  const purgeSummary: { collection: string; deletedCount: number }[] = [];

  for (const col of collections) {
    // Skip system collections
    if (col.name.startsWith('system.')) continue;

    const collection = db.collection(col.name);
    const countBefore = await collection.countDocuments();
    const result = await collection.deleteMany({});
    
    purgeSummary.push({
      collection: col.name,
      deletedCount: result.deletedCount,
    });
    console.log(`🧹 Purged [${col.name}]: ${result.deletedCount} documents removed (was: ${countBefore})`);
  }

  console.log('\n========================================');
  console.log('✅ DATABASE PURGE SUMMARY (100% BLANK SLATE)');
  console.log('========================================');
  let totalDeleted = 0;
  for (const s of purgeSummary) {
    console.log(`  • ${s.collection.padEnd(25)}: ${s.deletedCount} deleted`);
    totalDeleted += s.deletedCount;
  }
  console.log(`\n🎉 Total Documents Removed: ${totalDeleted}`);
  console.log('Database is now completely blank and ready for fresh end-to-end testing.');

  await mongoose.disconnect();
  process.exit(0);
}

purgeAll().catch((err) => {
  console.error('❌ Failed to purge database:', err);
  process.exit(1);
});
