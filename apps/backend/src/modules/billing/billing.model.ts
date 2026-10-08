import mongoose, { Schema, Document } from 'mongoose';
import {
  InvoiceStatus,
  InvoiceType,
  SettlementMode,
  QuoteStatus,
  TaxCalculationType,
  IInvoiceItemComputed,
  IInvoicePricing,
  IPaymentRecord,
} from '@repo/shared-types';

// ── 1. Invoice Document & Schema ─────────────────────────────────────────

export interface IInvoiceDocument extends Document {
  storeId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  type: InvoiceType;
  idempotencyKey?: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    billingAddress?: string;
    state: string;
    gstin?: string;
  };
  items: IInvoiceItemComputed[];
  pricing: IInvoicePricing;
  payment: {
    status: InvoiceStatus;
    paidAmount: number;
    dueAmount: number;
    settlementMode: SettlementMode;
    paymentDate: Date;
    paymentHistory: IPaymentRecord[];
  };
  dates: {
    invoiceDate: Date;
    dueDate: Date;
  };
  placeOfSupply: string;
  paymentTerms?: string;
  notes?: string;
  isInventoryDeducted: boolean;
  version: number; // OCC Version Counter (Rajesh Pillar 1)
  createdAt: Date;
  updatedAt: Date;
}

const invoiceItemSchema = new Schema<IInvoiceItemComputed>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    variantId: { type: String },
    title: { type: String, required: true },
    hsnCode: { type: String, default: '0000' },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'Pcs' },
    unitPrice: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    taxableAmount: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, required: true, min: 0, max: 100 },
    cgst: { type: Number, default: 0, min: 0 },
    sgst: { type: Number, default: 0, min: 0 },
    igst: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const paymentRecordSchema = new Schema<IPaymentRecord>(
  {
    amount: { type: Number, required: true, min: 0 },
    mode: { type: String, enum: Object.values(SettlementMode), required: true },
    date: { type: Date, default: Date.now },
    reference: { type: String },
    recordedBy: { type: String },
  },
  { _id: false },
);

const invoiceSchema = new Schema<IInvoiceDocument>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    invoiceNumber: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: Object.values(InvoiceType),
      default: InvoiceType.TAX_INVOICE,
    },
    idempotencyKey: { type: String, sparse: true, index: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      billingAddress: { type: String },
      state: { type: String, default: 'Delhi' },
      gstin: { type: String },
    },
    items: { type: [invoiceItemSchema], required: true },
    pricing: {
      subTotal: { type: Number, required: true },
      totalDiscount: { type: Number, default: 0 },
      taxableAmount: { type: Number, required: true },
      cgstTotal: { type: Number, default: 0 },
      sgstTotal: { type: Number, default: 0 },
      igstTotal: { type: Number, default: 0 },
      roundOff: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true },
    },
    payment: {
      status: {
        type: String,
        enum: Object.values(InvoiceStatus),
        default: InvoiceStatus.PAID,
        index: true,
      },
      paidAmount: { type: Number, default: 0 },
      dueAmount: { type: Number, default: 0 },
      settlementMode: {
        type: String,
        enum: Object.values(SettlementMode),
        default: SettlementMode.CASH,
      },
      paymentDate: { type: Date, default: Date.now },
      paymentHistory: { type: [paymentRecordSchema], default: [] },
    },
    dates: {
      invoiceDate: { type: Date, default: Date.now },
      dueDate: { type: Date, default: Date.now },
    },
    placeOfSupply: { type: String, default: 'Delhi' },
    paymentTerms: { type: String },
    notes: { type: String },
    isInventoryDeducted: { type: Boolean, default: false },
    version: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      index: true,
    },
  },
  { timestamps: true },
);

invoiceSchema.index({ storeId: 1, invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ storeId: 1, 'payment.status': 1, createdAt: -1 });
invoiceSchema.index({ storeId: 1, 'dates.invoiceDate': -1 });

export const InvoiceModel = mongoose.model<IInvoiceDocument>('Invoice', invoiceSchema);

// ── 2. Quote Document & Schema ───────────────────────────────────────────

export interface IQuoteDocument extends Document {
  storeId: mongoose.Types.ObjectId;
  quoteNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    billingAddress?: string;
    state: string;
    gstin?: string;
  };
  items: IInvoiceItemComputed[];
  pricing: IInvoicePricing;
  status: QuoteStatus;
  validUntil: Date;
  referenceNumber?: string;
  salesPerson?: string;
  termsAndConditions: string[];
  convertedInvoiceId?: mongoose.Types.ObjectId;
  notes?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const quoteSchema = new Schema<IQuoteDocument>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
    quoteNumber: { type: String, required: true, index: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      billingAddress: { type: String },
      state: { type: String, default: 'Delhi' },
      gstin: { type: String },
    },
    items: { type: [invoiceItemSchema], required: true },
    pricing: {
      subTotal: { type: Number, required: true },
      totalDiscount: { type: Number, default: 0 },
      taxableAmount: { type: Number, required: true },
      cgstTotal: { type: Number, default: 0 },
      sgstTotal: { type: Number, default: 0 },
      igstTotal: { type: Number, default: 0 },
      roundOff: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: Object.values(QuoteStatus),
      default: QuoteStatus.DRAFT,
      index: true,
    },
    validUntil: { type: Date, required: true },
    referenceNumber: { type: String },
    salesPerson: { type: String },
    termsAndConditions: {
      type: [String],
      default: [
        'Quote valid for 14 days from date of issue.',
        'Prices subject to inventory availability.',
        'Goods once sold will not be taken back without original invoice.',
      ],
    },
    convertedInvoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
    notes: { type: String },
    version: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      index: true,
    },
  },
  { timestamps: true },
);

quoteSchema.index({ storeId: 1, quoteNumber: 1 }, { unique: true });
quoteSchema.index({ storeId: 1, status: 1, createdAt: -1 });

export const QuoteModel = mongoose.model<IQuoteDocument>('Quote', quoteSchema);

// ── 3. Billing Settings Document & Schema ────────────────────────────────

export interface IBillingSettingsDocument extends Document {
  storeId: mongoose.Types.ObjectId;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  quotePrefix: string;
  nextQuoteNumber: number;
  defaultCurrency: string;
  gstEnabled: boolean;
  gstin?: string;
  state: string;
  taxCalculationType: TaxCalculationType;
  allowDiscounts: boolean;
  maxDiscountPercent: number;
  termsAndConditions: string[];
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const billingSettingsSchema = new Schema<IBillingSettingsDocument>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, unique: true, index: true },
    invoicePrefix: { type: String, default: 'INV-' },
    nextInvoiceNumber: { type: Number, default: 1001 },
    quotePrefix: { type: String, default: 'Q-' },
    nextQuoteNumber: { type: Number, default: 1001 },
    defaultCurrency: { type: String, default: 'INR' },
    gstEnabled: { type: Boolean, default: true },
    gstin: { type: String },
    state: { type: String, default: 'Delhi' },
    taxCalculationType: {
      type: String,
      enum: Object.values(TaxCalculationType),
      default: TaxCalculationType.EXCLUSIVE,
    },
    allowDiscounts: { type: Boolean, default: true },
    maxDiscountPercent: { type: Number, default: 20 },
    termsAndConditions: {
      type: [String],
      default: [
        'Interest @ 18% p.a. will be charged if bill is not paid within due date.',
        'Subject to local jurisdiction only.',
      ],
    },
    version: { type: Number, required: true, default: 1, min: 1 },
  },
  { timestamps: true },
);

export const BillingSettingsModel = mongoose.model<IBillingSettingsDocument>(
  'BillingSettings',
  billingSettingsSchema,
);
