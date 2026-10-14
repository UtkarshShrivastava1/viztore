import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { env } from '../shared/config/env.config.js';
import { UserModel } from '../modules/auth/auth.model.js';
import { StoreModel } from '../modules/stores/store.model.js';
import { ProductModel } from '../modules/catalog/product.model.js';

async function check() {
  await mongoose.connect(env.MONGODB_URI);
  const users = await UserModel.find().lean();
  const stores = await StoreModel.find().lean();
  const products = await ProductModel.find().lean();
  console.log('--- DB INSPECTION ---');
  console.log(`Users count: ${users.length}`);
  console.log(`Stores count: ${stores.length}`);
  console.log(`Products count: ${products.length}`);
  console.log(JSON.stringify(products.map(p => ({ id: p._id, name: p.name, storeId: p.storeId, basePrice: p.basePrice, totalStock: p.totalStock, variantsCount: p.variants?.length })), null, 2));
  await mongoose.disconnect();
}

check().catch(console.error);
