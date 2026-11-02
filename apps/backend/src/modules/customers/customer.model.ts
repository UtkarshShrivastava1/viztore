import mongoose, { Document, Model, Schema } from 'mongoose';
import { CustomerType, CustomerStatus, CustomerTier } from '@repo/shared-types';

export interface ICustomerDocument extends Document {
  storeId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  name: string;
  displayName?: string;
  customerType: CustomerType;
  phone: string;
  email?: string;
  gstin?: string;
  pan?: string;
  customerCode: string;
  creditLimit: number;
  paymentTerms: string;
  creditPeriodDays: number;
  outstandingAmount: number;
  totalSales: number;
  storeCredit: number;
  loyaltyPoints: number;
  totalOrders: number;
  returnsCount: number;
  status: CustomerStatus;
  tier: CustomerTier;
  lastOrderDate?: Date;
  location?: string;
  billingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    sameAsShipping: boolean;
  };
  notes?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomerDocument>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    customerType: {
      type: String,
      enum: Object.values(CustomerType),
      default: CustomerType.INDIVIDUAL,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
    },
    pan: {
      type: String,
      trim: true,
      uppercase: true,
    },
    customerCode: {
      type: String,
      required: true,
    },
    creditLimit: {
      type: Number,
      default: 10000,
      min: 0,
    },
    paymentTerms: {
      type: String,
      default: '15 Days',
    },
    creditPeriodDays: {
      type: Number,
      default: 15,
      min: 0,
    },
    outstandingAmount: {
      type: Number,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
      min: 0,
    },
    storeCredit: {
      type: Number,
      default: 0,
      min: 0,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
    returnsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(CustomerStatus),
      default: CustomerStatus.ACTIVE,
      index: true,
    },
    tier: {
      type: String,
      enum: Object.values(CustomerTier),
      default: CustomerTier.NEW,
    },
    lastOrderDate: {
      type: Date,
    },
    location: {
      type: String,
      default: 'Local Area',
    },
    billingAddress: {
      addressLine1: { type: String, default: 'In-store' },
      addressLine2: { type: String },
      city: { type: String, default: 'Local' },
      state: { type: String, default: 'Delhi' },
      pincode: { type: String, default: '' },
      country: { type: String, default: 'India' },
      sameAsShipping: { type: Boolean, default: true },
    },
    notes: {
      type: String,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

CustomerSchema.index({ storeId: 1, phone: 1 });
CustomerSchema.index({ storeId: 1, name: 1 });
CustomerSchema.index({ storeId: 1, customerCode: 1 }, { unique: true });

export const CustomerModel: Model<ICustomerDocument> =
  mongoose.models.Customer || mongoose.model<ICustomerDocument>('Customer', CustomerSchema);

// ── Customer Khata Ledger Transactions ────────────────────────────────────

export interface ICustomerTransactionDocument extends Document {
  storeId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  type: 'Invoice' | 'Payment' | 'Credit_Adjustment';
  referenceNo: string;
  amount: number;
  balanceAfter: number;
  date: Date;
  notes?: string;
  createdAt: Date;
}

const CustomerTransactionSchema = new Schema<ICustomerTransactionDocument>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['Invoice', 'Payment', 'Credit_Adjustment'],
      required: true,
    },
    referenceNo: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

CustomerTransactionSchema.index({ customerId: 1, date: -1 });

export const CustomerTransactionModel: Model<ICustomerTransactionDocument> =
  mongoose.models.CustomerTransaction ||
  mongoose.model<ICustomerTransactionDocument>('CustomerTransaction', CustomerTransactionSchema);

