import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { env } from '../shared/config/env.config.js';
import { InvoiceModel, QuoteModel, BillingSettingsModel } from '../modules/billing/billing.model.js';
import { logger } from '../shared/utils/logger.js';

async function purgeBilling(): Promise<void> {
  console.log('[Purge] Connecting to MongoDB to purge billing collections...');
  await mongoose.connect(env.MONGODB_URI);

  try {
    const invoiceCount = await InvoiceModel.countDocuments();
    const quoteCount = await QuoteModel.countDocuments();
    const settingsCount = await BillingSettingsModel.countDocuments();

    console.log(`[Purge] Current counts — Invoices: ${invoiceCount}, Quotes: ${quoteCount}, BillingSettings: ${settingsCount}`);

    const resInvoices = await InvoiceModel.deleteMany({});
    const resQuotes = await QuoteModel.deleteMany({});
    const resSettings = await BillingSettingsModel.deleteMany({});

    console.log(`[Purge] Successfully deleted:`);
    console.log(`  - Invoices: ${resInvoices.deletedCount}`);
    console.log(`  - Quotes: ${resQuotes.deletedCount}`);
    console.log(`  - BillingSettings: ${resSettings.deletedCount}`);
    console.log('[Purge] Billing collections are now completely empty and pristine.');
  } catch (err) {
    console.error('[Purge] Error during billing purge:', err);
    throw err;
  } finally {
    await mongoose.disconnect();
    console.log('[Purge] MongoDB disconnected cleanly.');
  }
}

purgeBilling()
  .then(() => {
    console.log('[Purge] Billing purge completed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[Purge] Billing purge failed:', err);
    process.exit(1);
  });
