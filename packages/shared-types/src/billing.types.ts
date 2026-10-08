import { z } from 'zod';

// ── Billing Enums ───────────────────────────────────────────────────────

export enum InvoiceStatus {
  DRAFT = 'draft',
  ISSUED = 'issued',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export enum InvoiceType {
  TAX_INVOICE = 'tax_invoice',
  RETAIL_BILL = 'retail_bill',
  PROFORMA = 'proforma',
}

export enum SettlementMode {
  CASH = 'cash',
  UPI = 'upi',
  CARD = 'card',
  NET_BANKING = 'net_banking',
  SPLIT = 'split',
}

export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  CONVERTED = 'converted',
  CANCELLED = 'cancelled',
}

export enum TaxCalculationType {
  INCLUSIVE = 'inclusive',
  EXCLUSIVE = 'exclusive',
}

// ── Zod Schemas ─────────────────────────────────────────────────────────

export const InvoiceItemSchema = z.object({
  productId: z.string().optional(),
  variantId: z.string().optional(),
  title: z.string().min(1, 'Item title is required'),
  hsnCode: z.string().default('0000'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unit: z.enum(['Pcs', 'Pair', 'Kg', 'Mtr', 'Box', 'Units']).default('Pcs'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative'),
  discountAmount: z.number().min(0).default(0),
  taxRate: z.number().min(0).max(100).default(0),
});

export const CustomerInfoSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  phone: z.string().min(10, 'Valid contact phone is required'),
  email: z.string().email().optional().or(z.literal('')),
  billingAddress: z.string().optional(),
  state: z.string().default('Delhi'),
  gstin: z.string().optional().or(z.literal('')),
});

export const CreateInvoiceSchema = z.object({
  type: z.nativeEnum(InvoiceType).default(InvoiceType.TAX_INVOICE),
  customer: CustomerInfoSchema,
  items: z.array(InvoiceItemSchema).min(1, 'At least one item is required'),
  placeOfSupply: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  payment: z
    .object({
      status: z.nativeEnum(InvoiceStatus).default(InvoiceStatus.PAID),
      settlementMode: z.nativeEnum(SettlementMode).default(SettlementMode.CASH),
      paidAmount: z.number().min(0).optional(),
    })
    .default({
      status: InvoiceStatus.PAID,
      settlementMode: SettlementMode.CASH,
    }),
  dates: z
    .object({
      invoiceDate: z.string().or(z.date()).optional(),
      dueDate: z.string().or(z.date()).optional(),
    })
    .optional(),
  idempotencyKey: z.string().optional(),
});

export const RecordPaymentSchema = z.object({
  amount: z.number().positive('Payment amount must be greater than 0'),
  mode: z.nativeEnum(SettlementMode),
  reference: z.string().optional(),
  recordedBy: z.string().optional(),
});

export const CreateQuoteSchema = z.object({
  customer: CustomerInfoSchema,
  items: z.array(InvoiceItemSchema).min(1, 'At least one item is required'),
  validUntil: z.string().or(z.date()).optional(),
  referenceNumber: z.string().optional(),
  salesPerson: z.string().optional(),
  termsAndConditions: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const UpdateQuoteStatusSchema = z.object({
  status: z.enum([
    QuoteStatus.DRAFT,
    QuoteStatus.SENT,
    QuoteStatus.ACCEPTED,
    QuoteStatus.DECLINED,
    QuoteStatus.EXPIRED,
    QuoteStatus.CANCELLED,
  ]),
});

export const UpdateBillingSettingsSchema = z.object({
  invoicePrefix: z.string().min(1).max(10).optional(),
  startingSequenceNumber: z.number().min(1).optional(),
  quotePrefix: z.string().min(1).max(10).optional(),
  nextQuoteNumber: z.number().min(1).optional(),
  defaultCurrency: z.string().default('INR').optional(),
  gstEnabled: z.boolean().optional(),
  gstin: z.string().optional(),
  state: z.string().optional(),
  taxCalculationType: z.nativeEnum(TaxCalculationType).optional(),
  allowDiscounts: z.boolean().optional(),
  maxDiscountPercent: z.number().min(0).max(100).optional(),
  termsAndConditions: z.array(z.string()).optional(),
});

// ── Inferred Types & Interfaces ─────────────────────────────────────────

export type CreateInvoiceDto = z.infer<typeof CreateInvoiceSchema>;
export type RecordPaymentDto = z.infer<typeof RecordPaymentSchema>;
export type CreateQuoteDto = z.infer<typeof CreateQuoteSchema>;
export type UpdateQuoteStatusDto = z.infer<typeof UpdateQuoteStatusSchema>;
export type UpdateBillingSettingsDto = z.infer<typeof UpdateBillingSettingsSchema>;

export interface IInvoiceItemComputed extends z.infer<typeof InvoiceItemSchema> {
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
}

export interface IInvoicePricing {
  subTotal: number;
  totalDiscount: number;
  taxableAmount: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  roundOff: number;
  grandTotal: number;
}

export interface IPaymentRecord {
  amount: number;
  mode: SettlementMode;
  date: Date;
  reference?: string;
  recordedBy?: string;
}

export interface IInvoice {
  id: string;
  storeId: string;
  invoiceNumber: string;
  type: InvoiceType;
  idempotencyKey?: string;
  customer: z.infer<typeof CustomerInfoSchema>;
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
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface IQuote {
  id: string;
  storeId: string;
  quoteNumber: string;
  customer: z.infer<typeof CustomerInfoSchema>;
  items: IInvoiceItemComputed[];
  pricing: IInvoicePricing;
  status: QuoteStatus;
  validUntil: Date;
  referenceNumber?: string;
  salesPerson?: string;
  termsAndConditions: string[];
  convertedInvoiceId?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface IBillingSettings {
  storeId: string;
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
}

export interface IInvoiceKPIs {
  totalInvoices: number;
  totalSales: number;
  paidAmount: number;
  outstandingAmount: number;
  overdueAmount: number;
}

export interface IInvoiceListResponse {
  invoices: IInvoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  kpis: IInvoiceKPIs;
}

export interface IQuoteKPIs {
  totalQuotes: number;
  totalValue: number;
  acceptedQuotes: number;
  convertedQuotes: number;
  expiredQuotes: number;
}

export interface IQuoteListResponse {
  quotes: IQuote[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  kpis: IQuoteKPIs;
}
