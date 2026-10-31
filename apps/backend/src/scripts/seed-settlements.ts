import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/platform-db';

async function seed() {
  await mongoose.connect(uri);
  const db = mongoose.connection;
  const storeId = '6ae599715657140ca9c03ab2'; // Urban Vogue Studio

  // 1. Seed Bank Account
  await db.collection('bankaccounts').updateOne(
    { storeId },
    {
      $set: {
        storeId,
        accountName: 'Urban Vogue Studio',
        bankName: 'HDFC Bank',
        accountNumber: '50200012345678',
        ifscCode: 'HDFC0001234',
        accountType: 'Current Account',
        branch: 'Civic Centre Branch, Bhilai',
        upiId: 'urbanvogue@hdfcbank',
        isVerified: true,
        payoutMode: 'NEFT / RTGS',
        payoutFrequency: 'Weekly',
        payoutDay: 'Wednesday',
        enableThreshold: false,
        thresholdAmount: 5000,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );
  console.log('Bank account seeded successfully');

  // 2. Seed Settlements
  const settlements = [
    {
      settlementId: '#SETT-00128',
      storeId,
      settlementDate: '29 Oct 2026',
      period: '22 Oct - 28 Oct 2026',
      startDate: '2026-10-22',
      endDate: '2026-10-28',
      orderCount: 14,
      grossAmount: 16850.0,
      commissionFee: 842.5,
      deliveryFeeSplit: 140.0,
      tdsAmount: 168.5,
      deductions: 1011.0,
      netPayoutAmount: 15839.0,
      status: 'Settled',
      bankAccount: 'HDFC Bank - 50200012345678',
      utrNumber: 'HDFC982103847291',
      settledAt: '2026-10-29T10:30:00.000Z',
      remarks: 'Automated weekly cycle reconciliation',
      createdAt: new Date('2026-10-29T10:30:00.000Z'),
      updatedAt: new Date('2026-10-29T10:30:00.000Z'),
    },
    {
      settlementId: '#SETT-00127',
      storeId,
      settlementDate: '22 Oct 2026',
      period: '15 Oct - 21 Oct 2026',
      startDate: '2026-10-15',
      endDate: '2026-10-21',
      orderCount: 11,
      grossAmount: 12450.0,
      commissionFee: 622.5,
      deliveryFeeSplit: 110.0,
      tdsAmount: 124.5,
      deductions: 747.0,
      netPayoutAmount: 11703.0,
      status: 'Settled',
      bankAccount: 'HDFC Bank - 50200012345678',
      utrNumber: 'HDFC871920394812',
      settledAt: '2026-10-22T10:30:00.000Z',
      remarks: 'Automated weekly cycle reconciliation',
      createdAt: new Date('2026-10-22T10:30:00.000Z'),
      updatedAt: new Date('2026-10-22T10:30:00.000Z'),
    },
    {
      settlementId: '#SETT-00126',
      storeId,
      settlementDate: '15 Oct 2026',
      period: '08 Oct - 14 Oct 2026',
      startDate: '2026-10-08',
      endDate: '2026-10-14',
      orderCount: 9,
      grossAmount: 9800.0,
      commissionFee: 490.0,
      deliveryFeeSplit: 90.0,
      tdsAmount: 98.0,
      deductions: 588.0,
      netPayoutAmount: 9212.0,
      status: 'Settled',
      bankAccount: 'HDFC Bank - 50200012345678',
      utrNumber: 'HDFC761829304918',
      settledAt: '2026-10-15T10:30:00.000Z',
      remarks: 'Automated weekly cycle reconciliation',
      createdAt: new Date('2026-10-15T10:30:00.000Z'),
      updatedAt: new Date('2026-10-15T10:30:00.000Z'),
    },
    {
      settlementId: '#SETT-00125',
      storeId,
      settlementDate: '08 Oct 2026',
      period: '01 Oct - 07 Oct 2026',
      startDate: '2026-10-01',
      endDate: '2026-10-07',
      orderCount: 8,
      grossAmount: 8900.0,
      commissionFee: 445.0,
      deliveryFeeSplit: 80.0,
      tdsAmount: 89.0,
      deductions: 534.0,
      netPayoutAmount: 8366.0,
      status: 'Settled',
      bankAccount: 'HDFC Bank - 50200012345678',
      utrNumber: 'HDFC650918273645',
      settledAt: '2026-10-08T10:30:00.000Z',
      remarks: 'Automated weekly cycle reconciliation',
      createdAt: new Date('2026-10-08T10:30:00.000Z'),
      updatedAt: new Date('2026-10-08T10:30:00.000Z'),
    },
    {
      settlementId: '#SETT-00129',
      storeId,
      settlementDate: '31 Oct 2026',
      period: 'Current Active Transit',
      startDate: '2026-10-29',
      endDate: '2026-10-31',
      orderCount: 3,
      grossAmount: 4200.0,
      commissionFee: 210.0,
      deliveryFeeSplit: 30.0,
      tdsAmount: 42.0,
      deductions: 252.0,
      netPayoutAmount: 3948.0,
      status: 'In Transit',
      bankAccount: 'HDFC Bank - 50200012345678',
      utrNumber: 'IN_TRANSIT_PENDING',
      settledAt: '',
      remarks: 'Dispatched to bank batch processing',
      createdAt: new Date('2026-10-31T08:00:00.000Z'),
      updatedAt: new Date('2026-10-31T08:00:00.000Z'),
    },
  ];

  for (const s of settlements) {
    await db.collection('settlements').updateOne(
      { settlementId: s.settlementId },
      { $set: s },
      { upsert: true }
    );
  }
  console.log(`Seeded ${settlements.length} settlements in Atlas for store ${storeId}`);
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
