import mongoose, { Document, Model, Schema } from 'mongoose';
import {
  IExpenseItem,
  IVendorItem,
  IPurchaseBill,
  ICreditNoteItem,
  IEWayBillItem,
} from '@repo/shared-types';

export interface IExpenseDocument extends Document, Omit<IExpenseItem, 'id'> {
  storeId: mongoose.Types.ObjectId;
  notes?: string;
}

export interface IVendorDocument extends Document, Omit<IVendorItem, 'id'> {
  storeId: mongoose.Types.ObjectId;
}

export interface IPurchaseBillDocument extends Document, Omit<IPurchaseBill, 'id'> {
  storeId: mongoose.Types.ObjectId;
  type: string;
}

export interface ICreditNoteDocument extends Document, Omit<ICreditNoteItem, 'id'> {
  storeId: mongoose.Types.ObjectId;
}

export interface IEWayBillDocument extends Document, Omit<IEWayBillItem, 'id'> {
  storeId: mongoose.Types.ObjectId;
}

// 1. Operating Expense Schema
const expenseSchema = new Schema<IExpenseDocument>(
  {
    storeId: { type: Schema.Types.ObjectId as any, ref: 'Store', required: true, index: true },
    expenseNo: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, default: 'Cash' },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Partially Paid'],
      default: 'Paid',
    },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id?.toString();
        delete ret.__v;
        return ret;
      },
    },
  },
);

expenseSchema.index({ storeId: 1, createdAt: -1 });

// 2. Vendor Schema
const vendorSchema = new Schema<IVendorDocument>(
  {
    storeId: { type: Schema.Types.ObjectId as any, ref: 'Store', required: true, index: true },
    vendorCode: { type: String, required: true, trim: true },
    vendorName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    city: { type: String, required: true, trim: true },
    totalPurchases: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Blocked'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id?.toString();
        delete ret.__v;
        return ret;
      },
    },
  },
);

vendorSchema.index({ storeId: 1, vendorName: 1 });

// 3. Purchase Bill & Order Schema
const purchaseBillSchema = new Schema<IPurchaseBillDocument>(
  {
    storeId: { type: Schema.Types.ObjectId as any, ref: 'Store', required: true, index: true },
    billNumber: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    vendor: { type: String, required: true, trim: true },
    itemsCount: { type: String, default: '1 item' },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Partially Paid', 'Unpaid'],
      default: 'Unpaid',
    },
    dueDate: { type: String, default: '' },
    type: { type: String, default: 'Purchase' },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id?.toString();
        delete ret.__v;
        return ret;
      },
    },
  },
);

purchaseBillSchema.index({ storeId: 1, createdAt: -1 });

// 4. Credit Note Schema
const creditNoteSchema = new Schema<ICreditNoteDocument>(
  {
    storeId: { type: Schema.Types.ObjectId as any, ref: 'Store', required: true, index: true },
    creditNoteNo: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    referencePurchase: { type: String, required: true },
    vendor: { type: String, required: true },
    reasonType: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Processed', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id?.toString();
        delete ret.__v;
        return ret;
      },
    },
  },
);

// 5. E-Way Bill Schema
const eWayBillSchema = new Schema<IEWayBillDocument>(
  {
    storeId: { type: Schema.Types.ObjectId as any, ref: 'Store', required: true, index: true },
    eWayBillNo: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    invoiceBillNo: { type: String, required: true },
    vendor: { type: String, required: true },
    fromTo: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    validTill: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Active', 'In Transit', 'Expired', 'Cancelled'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id?.toString();
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const ExpenseModel: Model<IExpenseDocument> = mongoose.model<IExpenseDocument>('Expense', expenseSchema);
export const VendorModel: Model<IVendorDocument> = mongoose.model<IVendorDocument>('Vendor', vendorSchema);
export const PurchaseBillModel: Model<IPurchaseBillDocument> = mongoose.model<IPurchaseBillDocument>('PurchaseBill', purchaseBillSchema);
export const CreditNoteModel: Model<ICreditNoteDocument> = mongoose.model<ICreditNoteDocument>('CreditNote', creditNoteSchema);
export const EWayBillModel: Model<IEWayBillDocument> = mongoose.model<IEWayBillDocument>('EWayBill', eWayBillSchema);
