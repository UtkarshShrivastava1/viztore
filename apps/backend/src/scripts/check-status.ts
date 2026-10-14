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

async function check() {
  await mongoose.connect(env.MONGODB_URI);
  const users = await UserModel.find().lean();
  const stores = await StoreModel.find().lean();
  console.log('--- DB INSPECTION ---');
  console.log(`Users count: ${users.length}`);
  console.log(JSON.stringify(users.map(u => ({ id: u._id, email: u.email, phone: u.phone, role: u.role, isVerified: u.isVerified })), null, 2));
  console.log(`Stores count: ${stores.length}`);
  console.log(JSON.stringify(stores.map(s => ({ id: s._id, name: s.name, slug: s.slug, status: s.approvalStatus, ownerId: s.ownerId, category: s.category })), null, 2));
  await mongoose.disconnect();
}

check().catch(console.error);
