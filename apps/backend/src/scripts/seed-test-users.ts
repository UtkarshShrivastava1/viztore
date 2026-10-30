import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function seedUsers() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not found');

  await mongoose.connect(uri);
  console.log('Connected to DB');

  const usersCol = mongoose.connection.db!.collection('users');
  const storesCol = mongoose.connection.db!.collection('stores');

  const hashedPassword = await bcrypt.hash('Password@123', 10);

  // Find a store to link to merchant
  const store = await storesCol.findOne({});
  const storeId = store ? store._id : new mongoose.Types.ObjectId();

  const testAccounts = [
    {
      email: 'arjun.customer@example.com',
      fullName: 'Arjun Customer',
      phone: '9876543299',
      password: hashedPassword,
      role: 'customer',
      isVerified: true,
      isActive: true,
    },
    {
      email: 'rahul.merchant@example.com',
      fullName: 'Rahul Merchant',
      phone: '9876543210',
      password: hashedPassword,
      role: 'merchant',
      storeId: storeId,
      isVerified: true,
      isActive: true,
    },
    {
      email: 'admin@example.com',
      fullName: 'Super Administrator',
      phone: '9876500000',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      isActive: true,
    },
    {
      email: 'rider@example.com',
      fullName: 'Rider Pilot',
      phone: '9876511111',
      password: hashedPassword,
      role: 'rider',
      isVerified: true,
      isActive: true,
    }
  ];

  for (const acc of testAccounts) {
    // Delete any conflicting users with the same phone or email
    await usersCol.deleteMany({
      $or: [{ email: acc.email }, { phone: acc.phone }]
    });

    await usersCol.insertOne({
      ...acc,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`Created test account: ${acc.email} (${acc.role}, phone: ${acc.phone})`);
  }

  // Update store to link to merchant
  if (store) {
    const merchantUser = await usersCol.findOne({ email: 'rahul.merchant@example.com' });
    if (merchantUser) {
      await storesCol.updateOne(
        { _id: store._id },
        { $set: { merchantId: merchantUser._id } }
      );
      console.log(`Linked store ${store.slug || store._id} to merchant ${merchantUser.email}`);
    }
  }

  console.log('Seeding test accounts completed successfully.');
  process.exit(0);
}

seedUsers().catch(err => {
  console.error(err);
  process.exit(1);
});
