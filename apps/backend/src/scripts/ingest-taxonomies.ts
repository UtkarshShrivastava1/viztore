import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { TaxonomyModel } from '../modules/catalog/taxonomy.model.js';
import { resolveHSNAndGST } from '../modules/catalog/hsn.service.js';
import { logger } from '../shared/logger.js';

export async function ingestTaxonomies(mongoUri?: string): Promise<{ total: number; inserted: number; updated: number }> {
  const uri = mongoUri || process.env.MONGODB_URI || 'mongodb://localhost:27017/platform-db';
  const shouldDisconnect = mongoose.connection.readyState === 0;

  if (shouldDisconnect) {
    await mongoose.connect(uri);
    logger.info('Connected to MongoDB for taxonomy ingestion');
  }

  const jsonPath = path.resolve(__dirname, '../modules/catalog/taxonomies.data.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Taxonomies data file not found at: ${jsonPath}`);
  }

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const items: Array<{
    category: string;
    subcategory: string;
    productType: string;
    attributes: Array<{ name: string; values: string[]; isMultiSelect: boolean; isRequired: boolean }>;
  }> = JSON.parse(raw);

  let inserted = 0;
  let updated = 0;

  for (const item of items) {
    const hsn = resolveHSNAndGST(item.category, item.subcategory, item.productType);
    const slug = `${item.category}-${item.subcategory}-${item.productType}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const res = await TaxonomyModel.updateOne(
      {
        category: item.category,
        subcategory: item.subcategory,
        productType: item.productType,
      },
      {
        $set: {
          category: item.category,
          subcategory: item.subcategory,
          productType: item.productType,
          slug,
          hsnCode: hsn.hsnCode,
          gstRate: hsn.gstRate,
          attributes: item.attributes,
        },
      },
      { upsert: true },
    );

    if (res.upsertedCount > 0) inserted++;
    else if (res.modifiedCount > 0) updated++;
  }

  logger.info(`Taxonomy ingestion completed: ${items.length} total, ${inserted} inserted, ${updated} updated`);

  if (shouldDisconnect) {
    await mongoose.disconnect();
  }

  return { total: items.length, inserted, updated };
}

// Allow direct CLI execution
if (require.main === module) {
  ingestTaxonomies()
    .then((stats) => {
      console.log('Taxonomy Ingestion Stats:', stats);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Taxonomy Ingestion Failed:', err);
      process.exit(1);
    });
}
