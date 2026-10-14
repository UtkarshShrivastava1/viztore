import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { env } from '../shared/config/env.config.js';
import { UserModel } from '../modules/auth/auth.model.js';
import { StoreModel } from '../modules/stores/store.model.js';
import { StoreRatingModel } from '../modules/stores/store-rating.model.js';
import { ProductModel } from '../modules/catalog/product.model.js';
import { OrderModel } from '../modules/orders/order.model.js';
import { DeliveryModel } from '../modules/delivery/delivery.model.js';
import { NotificationModel } from '../modules/notifications/notification.model.js';
import { InvoiceModel, QuoteModel, BillingSettingsModel } from '../modules/billing/billing.model.js';
import { OutboxModel } from '../shared/database/outbox.model.js';
import { getRedisClient, connectRedis, disconnectRedis } from '../shared/redis/client.js';

async function purgeDatabase(): Promise<void> {
  console.log('====================================================');
  console.log('⚡ [DB PURGE] INITIATING COMPLETE DATABASE WIPE...');
  console.log('====================================================');

  console.log(`Connecting to MongoDB URI: ${env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}...`);
  await mongoose.connect(env.MONGODB_URI);
  console.log('✅ Connected to MongoDB.');

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection object is undefined.');
  }

  // 1. Get initial collection counts
  console.log('\n--- [PRE-PURGE COUNTS] ---');
  const userCountBefore = await UserModel.countDocuments();
  const storeCountBefore = await StoreModel.countDocuments();
  const storeRatingCountBefore = await StoreRatingModel.countDocuments();
  const productCountBefore = await ProductModel.countDocuments();
  const orderCountBefore = await OrderModel.countDocuments();
  const deliveryCountBefore = await DeliveryModel.countDocuments();
  const notificationCountBefore = await NotificationModel.countDocuments();
  const invoiceCountBefore = await InvoiceModel.countDocuments();
  const quoteCountBefore = await QuoteModel.countDocuments();
  const billingSettingsCountBefore = await BillingSettingsModel.countDocuments();
  const outboxCountBefore = await OutboxModel.countDocuments();

  console.log(`  Users (Customers/Merchants): ${userCountBefore}`);
  console.log(`  Stores:                     ${storeCountBefore}`);
  console.log(`  Store Ratings:              ${storeRatingCountBefore}`);
  console.log(`  Products:                   ${productCountBefore}`);
  console.log(`  Orders:                     ${orderCountBefore}`);
  console.log(`  Deliveries:                 ${deliveryCountBefore}`);
  console.log(`  Notifications:              ${notificationCountBefore}`);
  console.log(`  Invoices:                   ${invoiceCountBefore}`);
  console.log(`  Quotes:                     ${quoteCountBefore}`);
  console.log(`  Billing Settings:           ${billingSettingsCountBefore}`);
  console.log(`  Outbox Events:              ${outboxCountBefore}`);

  // 2. Perform deletion on all known models
  console.log('\n--- [DELETING ALL DOCUMENTS] ---');
  const resOrders = await OrderModel.deleteMany({});
  const resDeliveries = await DeliveryModel.deleteMany({});
  const resInvoices = await InvoiceModel.deleteMany({});
  const resQuotes = await QuoteModel.deleteMany({});
  const resBillingSettings = await BillingSettingsModel.deleteMany({});
  const resProducts = await ProductModel.deleteMany({});
  const resStoreRatings = await StoreRatingModel.deleteMany({});
  const resStores = await StoreModel.deleteMany({});
  const resNotifications = await NotificationModel.deleteMany({});
  const resOutbox = await OutboxModel.deleteMany({});
  const resUsers = await UserModel.deleteMany({});

  console.log(`  Deleted Orders:             ${resOrders.deletedCount}`);
  console.log(`  Deleted Deliveries:         ${resDeliveries.deletedCount}`);
  console.log(`  Deleted Invoices:           ${resInvoices.deletedCount}`);
  console.log(`  Deleted Quotes:             ${resQuotes.deletedCount}`);
  console.log(`  Deleted Billing Settings:   ${resBillingSettings.deletedCount}`);
  console.log(`  Deleted Products:           ${resProducts.deletedCount}`);
  console.log(`  Deleted Store Ratings:      ${resStoreRatings.deletedCount}`);
  console.log(`  Deleted Stores:             ${resStores.deletedCount}`);
  console.log(`  Deleted Notifications:      ${resNotifications.deletedCount}`);
  console.log(`  Deleted Outbox Events:      ${resOutbox.deletedCount}`);
  console.log(`  Deleted Users:              ${resUsers.deletedCount}`);

  // 3. Scan all collections in DB and ensure any stray/extra collections are also wiped
  const allCollections = await db.listCollections().toArray();
  console.log(`\n--- [SCANNING ALL ${allCollections.length} MONGODB COLLECTIONS] ---`);
  for (const collInfo of allCollections) {
    if (collInfo.name.startsWith('system.')) continue;
    const coll = db.collection(collInfo.name);
    const count = await coll.countDocuments();
    if (count > 0) {
      console.log(`  Clearing remaining documents in collection "${collInfo.name}" (${count} docs)...`);
      await coll.deleteMany({});
    }
    const finalCount = await coll.countDocuments();
    console.log(`  Collection "${collInfo.name}": ${finalCount} documents remaining.`);
  }

  // 4. Redis cache flush if active
  if (env.ENABLE_REDIS) {
    try {
      console.log('\n--- [FLUSHING REDIS CACHE] ---');
      await connectRedis();
      const redis = getRedisClient();
      if (redis) {
        await redis.flushdb();
        console.log('✅ Redis FLUSHDB executed successfully.');
      }
      await disconnectRedis();
    } catch (redisErr) {
      console.warn('⚠️ Redis flush skipped or unavailable:', (redisErr as Error).message);
    }
  }

  // 5. Verification
  console.log('\n--- [POST-PURGE VERIFICATION] ---');
  const userCountAfter = await UserModel.countDocuments();
  const storeCountAfter = await StoreModel.countDocuments();
  const productCountAfter = await ProductModel.countDocuments();
  const orderCountAfter = await OrderModel.countDocuments();
  const invoiceCountAfter = await InvoiceModel.countDocuments();

  console.log(`  Final Users:    ${userCountAfter}`);
  console.log(`  Final Stores:   ${storeCountAfter}`);
  console.log(`  Final Products: ${productCountAfter}`);
  console.log(`  Final Orders:   ${orderCountAfter}`);
  console.log(`  Final Invoices: ${invoiceCountAfter}`);

  if (
    userCountAfter === 0 &&
    storeCountAfter === 0 &&
    productCountAfter === 0 &&
    orderCountAfter === 0 &&
    invoiceCountAfter === 0
  ) {
    console.log('\n🎉 SUCCESS: Database is 100% clean and pristine! 0 customers, 0 stores.');
  } else {
    console.error('\n⚠️ WARNING: Some documents still remain in the database.');
  }

  await mongoose.disconnect();
  console.log('MongoDB disconnected cleanly.\n');
}

purgeDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Database purge failed:', err);
    process.exit(1);
  });
