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

// ── Indian States & Union Territories (GST Compliant) ───────────────────

export interface IIndianState {
  code: string;
  name: string;
  label: string;
}

export const DEFAULT_INDIAN_STATE = 'Chhattisgarh (22)';

export const INDIAN_STATES: IIndianState[] = [
  // Primary Launch State at top for instant 1-click access
  { code: '22', name: 'Chhattisgarh', label: 'Chhattisgarh (22)' },

  // All other Indian States & Union Territories (alphabetical)
  { code: '35', name: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands (35)' },
  { code: '37', name: 'Andhra Pradesh', label: 'Andhra Pradesh (37)' },
  { code: '12', name: 'Arunachal Pradesh', label: 'Arunachal Pradesh (12)' },
  { code: '18', name: 'Assam', label: 'Assam (18)' },
  { code: '10', name: 'Bihar', label: 'Bihar (10)' },
  { code: '04', name: 'Chandigarh', label: 'Chandigarh (04)' },
  { code: '26', name: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu (26)' },
  { code: '07', name: 'Delhi', label: 'Delhi (07)' },
  { code: '30', name: 'Goa', label: 'Goa (30)' },
  { code: '24', name: 'Gujarat', label: 'Gujarat (24)' },
  { code: '06', name: 'Haryana', label: 'Haryana (06)' },
  { code: '02', name: 'Himachal Pradesh', label: 'Himachal Pradesh (02)' },
  { code: '01', name: 'Jammu and Kashmir', label: 'Jammu and Kashmir (01)' },
  { code: '20', name: 'Jharkhand', label: 'Jharkhand (20)' },
  { code: '29', name: 'Karnataka', label: 'Karnataka (29)' },
  { code: '32', name: 'Kerala', label: 'Kerala (32)' },
  { code: '38', name: 'Ladakh', label: 'Ladakh (38)' },
  { code: '31', name: 'Lakshadweep', label: 'Lakshadweep (31)' },
  { code: '23', name: 'Madhya Pradesh', label: 'Madhya Pradesh (23)' },
  { code: '27', name: 'Maharashtra', label: 'Maharashtra (27)' },
  { code: '14', name: 'Manipur', label: 'Manipur (14)' },
  { code: '17', name: 'Meghalaya', label: 'Meghalaya (17)' },
  { code: '15', name: 'Mizoram', label: 'Mizoram (15)' },
  { code: '13', name: 'Nagaland', label: 'Nagaland (13)' },
  { code: '21', name: 'Odisha', label: 'Odisha (21)' },
  { code: '34', name: 'Puducherry', label: 'Puducherry (34)' },
  { code: '03', name: 'Punjab', label: 'Punjab (03)' },
  { code: '08', name: 'Rajasthan', label: 'Rajasthan (08)' },
  { code: '11', name: 'Sikkim', label: 'Sikkim (11)' },
  { code: '33', name: 'Tamil Nadu', label: 'Tamil Nadu (33)' },
  { code: '36', name: 'Telangana', label: 'Telangana (36)' },
  { code: '16', name: 'Tripura', label: 'Tripura (16)' },
  { code: '09', name: 'Uttar Pradesh', label: 'Uttar Pradesh (09)' },
  { code: '05', name: 'Uttarakhand', label: 'Uttarakhand (05)' },
  { code: '19', name: 'West Bengal', label: 'West Bengal (19)' },
  { code: '97', name: 'Other Territory', label: 'Other Territory (97)' },
];

