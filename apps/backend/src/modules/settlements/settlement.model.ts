import mongoose, { Document, Schema } from 'mongoose';
import type { ISettlement, ISettlementBankAccount, SettlementStatus } from '@repo/shared-types';

export interface ISettlementDoc extends Omit<ISettlement, '_id' | 'id'>, Document {}
export interface IBankAccountDoc extends Omit<ISettlementBankAccount, '_id'>, Document {}

const SettlementSchema = new Schema<ISettlementDoc>(
  {
    settlementId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    storeId: {
      type: String,
      required: true,
      index: true,
    },
    settlementDate: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
    orderCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    grossAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    commissionFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryFeeSplit: {
      type: Number,
      default: 0,
      min: 0,
    },
    tdsAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deductions: {
      type: Number,
      default: 0,
      min: 0,
    },
    netPayoutAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'In Transit', 'Settled', 'Failed'],
      default: 'Pending',
      index: true,
    },
    bankAccount: {
      type: String,
      required: true,
    },
    utrNumber: {
      type: String,
      default: '',
    },
    settledAt: {
      type: String,
      default: '',
    },
    orderIds: {
      type: [String],
      default: [],
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

SettlementSchema.index({ storeId: 1, status: 1 });
SettlementSchema.index({ storeId: 1, createdAt: -1 });

export const SettlementModel: mongoose.Model<ISettlementDoc> =
  mongoose.models.Settlement ||
  mongoose.model<ISettlementDoc>('Settlement', SettlementSchema);

const BankAccountSchema = new Schema<IBankAccountDoc>(
  {
    storeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    ifscCode: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      default: 'Current Account',
    },
    branch: {
      type: String,
      default: '',
    },
    upiId: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    payoutMode: {
      type: String,
      enum: ['NEFT / RTGS', 'UPI'],
      default: 'NEFT / RTGS',
    },
    payoutFrequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'],
      default: 'Weekly',
    },
    payoutDay: {
      type: String,
      default: 'Wednesday',
    },
    enableThreshold: {
      type: Boolean,
      default: false,
    },
    thresholdAmount: {
      type: Number,
      default: 5000,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const BankAccountModel: mongoose.Model<IBankAccountDoc> =
  mongoose.models.BankAccount ||
  mongoose.model<IBankAccountDoc>('BankAccount', BankAccountSchema);

