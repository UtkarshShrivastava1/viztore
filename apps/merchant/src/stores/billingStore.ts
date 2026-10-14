import { create } from 'zustand';
import { useInventoryStore } from './inventoryStore.js';
import { DEFAULT_INDIAN_STATE } from '@repo/shared-types';
import { billingApi } from '../lib/api.js';

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired' | 'converted' | 'cancelled';
export type NoteStatus = 'draft' | 'issued' | 'used' | 'partially_used' | 'expired' | 'cancelled';

export type BillingSubTab = 'invoices' | 'quotes' | 'pos';
export type BillingViewMode = 'list' | 'create_quote' | 'settings' | 'pos_counter';

export interface BillingSettings {
  defaultCurrency: string;
  billingAddress: string;
  useCustomerBillingAddress: boolean;
  autoInvoiceGeneration: boolean;
  invoiceTemplate: string;
  invoicePrefix: string;
  startingSequenceNumber: number;
  gstEnabled: boolean;
  gstin: string;
  state: string;
  taxCalculationType: 'inclusive' | 'exclusive';
  categoryTaxEnabled: boolean;
  allowDiscounts: boolean;
  discountType: 'percentage' | 'fixed';
  maxDiscountLimit: number;
}

export interface IInvoiceItem {
  id: string;
  productId: string;
  name: string;
  hsnSac: string;
  quantity: number;
  rate: number;
  discountPercent: number;
  taxPercent: number;
  amount: number;
  unit?: string;
  description?: string;
}

export interface IInvoice {
  id: string;
  invoiceNo: string; // e.g. 'INV-1248'
  date: string;
  dueDate: string;
  customerName: string;
  customerPhone: string;
  customerGstin?: string;
  customerAddress?: string;
  state?: string;
  placeOfSupply?: string;
  paymentTerms?: string;
  notes?: string;
  type: 'Tax Invoice' | 'Bill of Supply';
  items: IInvoiceItem[];
  subTotal: number;
  discountTotal: number;
  taxTotal: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: InvoiceStatus;
  settlementMode?: 'upi' | 'cash' | 'card' | 'bank_transfer' | 'credit';
}

export interface IQuote {
  id: string;
  quoteNo: string; // e.g. 'Q-1025'
  date: string;
  validUntil: string;
  validDaysText?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerGstin?: string;
  customerAddress?: string;
  placeOfSupply?: string;
  referenceNo?: string;
  currency?: string;
  paymentTerms?: string;
  salesPerson?: string;
  notes?: string;
  terms?: string;
  items: IInvoiceItem[];
  subTotal: number;
  discountTotal: number;
  taxTotal: number;
  totalAmount: number;
  status: QuoteStatus;
  createdBy: string;
}

export interface INoteItem extends IInvoiceItem {
  invoicedQty: number;
  returnedQty: number;
}

export interface ICreditNote {
  id: string;
  noteNo: string; // e.g. 'CN-1003'
  invoiceNo: string; // e.g. 'INV-1456'
  date: string;
  originalInvoiceDate?: string;
  expiryDate: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerGstin?: string;
  customerAddress?: string;
  placeOfSupply?: string;
  reason: string;
  salesPerson?: string;
  paymentTerms?: string;
  notes?: string;
  terms?: string;
  items: INoteItem[];
  subTotal: number;
  discountTotal: number;
  taxTotal: number;
  totalAmount: number;
  usedAmount: number;
  unusedAmount: number;
  status: NoteStatus;
}

export interface IDebitNote {
  id: string;
  noteNo: string; // e.g. 'DN-1038'
  invoiceNo: string; // e.g. 'INV-1456'
  date: string;
  expiryDate: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerGstin?: string;
  customerAddress?: string;
  placeOfSupply?: string;
  reason?: string;
  referenceNo?: string;
  salesPerson?: string;
  paymentTerms?: string;
  notes?: string;
  terms?: string;
  items: INoteItem[];
  subTotal: number;
  discountTotal: number;
  taxTotal: number;
  totalAmount: number;
  usedAmount: number;
  unusedAmount: number;
  status: NoteStatus;
}

export function normalizeBackendInvoice(raw: any): IInvoice {
  if (!raw) return raw;
  if (raw.invoiceNo && typeof raw.totalAmount === 'number' && raw.items && raw.customerName) {
    return raw;
  }

  const dateFormatted = raw.createdAt
    ? new Date(raw.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : (raw.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));

  const subTotal = raw.pricing?.subTotal ?? raw.subTotal ?? 0;
  const discountTotal = raw.pricing?.totalDiscount ?? raw.discountTotal ?? 0;
  const taxTotal = raw.pricing
    ? ((raw.pricing.cgstTotal || 0) + (raw.pricing.sgstTotal || 0) + (raw.pricing.igstTotal || 0))
    : (raw.taxTotal ?? 0);
  const totalAmount = raw.pricing?.grandTotal ?? raw.totalAmount ?? 0;
  const paidAmount = raw.payment?.paidAmount ?? raw.paidAmount ?? (raw.payment?.status === 'paid' || raw.status === 'paid' ? totalAmount : 0);
  const dueAmount = raw.payment?.dueAmount ?? raw.dueAmount ?? Math.max(0, totalAmount - paidAmount);

  return {
    id: raw.id || raw._id || ('inv-' + Date.now()),
    invoiceNo: raw.invoiceNumber || raw.invoiceNo || 'INV-1001',
    date: dateFormatted,
    dueDate: raw.dueDate || dateFormatted,
    customerName: raw.customer?.name || raw.customerName || 'Walk-in Retail Customer',
    customerPhone: raw.customer?.phone || raw.customerPhone || '',
    customerGstin: raw.customer?.gstin || raw.customerGstin,
    customerAddress: raw.customer?.billingAddress || raw.customerAddress || 'Counter Sale',
    state: raw.customer?.state || raw.state || DEFAULT_INDIAN_STATE,
    placeOfSupply: raw.customer?.state || raw.placeOfSupply || DEFAULT_INDIAN_STATE,
    paymentTerms: raw.paymentTerms || 'Immediate',
    type: raw.type === 'retail_bill' || raw.type === 'Bill of Supply' ? 'Bill of Supply' : 'Tax Invoice',
    items: Array.isArray(raw.items)
      ? raw.items.map((it: any, idx: number) => ({
          id: it.id || it._id || `it-${idx}`,
          productId: it.productId || '',
          name: it.title || it.name || 'Item',
          hsnSac: it.hsnCode || it.hsnSac || '0000',
          quantity: it.quantity || 1,
          rate: it.unitPrice || it.rate || 0,
          discountPercent: it.discountPercent || 0,
          taxPercent: it.taxRate || it.taxPercent || 18,
          amount: it.totalAmount || ((it.quantity || 1) * (it.unitPrice || it.rate || 0)),
          unit: it.unit || 'Pcs',
        }))
      : [],
    subTotal,
    discountTotal,
    taxTotal,
    totalAmount,
    paidAmount,
    dueAmount,
    status: (raw.payment?.status || raw.status || 'paid') as InvoiceStatus,
    settlementMode: (raw.payment?.settlementMode || raw.settlementMode || 'cash') as any,
  };
}

export function normalizeBackendQuote(raw: any): IQuote {
  if (!raw) return raw;
  if (raw.quoteNo && typeof raw.totalAmount === 'number' && raw.items && raw.customerName) {
    return raw;
  }

  const dateFormatted = raw.createdAt
    ? new Date(raw.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : (raw.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));

  const validUntilFormatted = raw.validUntil
    ? new Date(raw.validUntil).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : (raw.validUntil || '30 Days');

  const subTotal = raw.pricing?.subTotal ?? raw.subTotal ?? 0;
  const discountTotal = raw.pricing?.totalDiscount ?? raw.discountTotal ?? 0;
  const taxTotal = raw.pricing
    ? ((raw.pricing.cgstTotal || 0) + (raw.pricing.sgstTotal || 0) + (raw.pricing.igstTotal || 0))
    : (raw.taxTotal ?? 0);
  const totalAmount = raw.pricing?.grandTotal ?? raw.totalAmount ?? 0;

  return {
    id: raw.id || raw._id || ('quote-' + Date.now()),
    quoteNo: raw.quoteNumber || raw.quoteNo || 'Q-1001',
    date: dateFormatted,
    validUntil: validUntilFormatted,
    customerName: raw.customer?.name || raw.customerName || 'Customer',
    customerPhone: raw.customer?.phone || raw.customerPhone || '',
    customerEmail: raw.customer?.email || raw.customerEmail,
    customerGstin: raw.customer?.gstin || raw.customerGstin,
    customerAddress: raw.customer?.billingAddress || raw.customerAddress,
    items: Array.isArray(raw.items)
      ? raw.items.map((it: any, idx: number) => ({
          id: it.id || it._id || `qit-${idx}`,
          productId: it.productId || '',
          name: it.title || it.name || 'Item',
          hsnSac: it.hsnCode || it.hsnSac || '0000',
          quantity: it.quantity || 1,
          rate: it.unitPrice || it.rate || 0,
          discountPercent: 0,
          taxPercent: it.taxRate || 18,
          amount: it.totalAmount || ((it.quantity || 1) * (it.unitPrice || it.rate || 0)),
        }))
      : [],
    subTotal,
    discountTotal,
    taxTotal,
    totalAmount,
    status: (raw.status || 'draft') as QuoteStatus,
    createdBy: raw.createdBy || 'Store Manager',
  };
}

interface BillingStoreState {
  // Navigation & Sub-views
  activeSubTab: BillingSubTab;
  activeView: BillingViewMode;
  setActiveSubTab: (tab: BillingSubTab) => void;
  setActiveView: (view: BillingViewMode) => void;

  // Invoices State
  invoices: IInvoice[];
  isLoadingInvoices: boolean;
  invoiceSearchQuery: string;
  invoiceDateRange: string;
  invoiceTypeFilter: string;
  invoiceStatusFilter: string;
  invoicePaymentFilter: string;
  invoiceCurrentTab: string; // 'All Invoices' | 'Draft' | ...
  isCreateInvoiceModalOpen: boolean;
  activeInvoiceForModal: Partial<IInvoice> | null;

  // Quotes State
  quotes: IQuote[];
  isLoadingQuotes: boolean;
  quoteSearchQuery: string;
  quoteDateRange: string;
  quoteStatusFilter: string;
  quoteExpirationFilter: string;
  quoteCustomerFilter: string;
  quoteCurrentTab: string;

  // Credit Notes State
  creditNotes: ICreditNote[];
  creditNoteSearchQuery: string;
  creditNoteStatusFilter: string;
  creditNoteDateRange: string;
  creditNoteCurrentTab: string;

  // Debit Notes State
  debitNotes: IDebitNote[];
  debitNoteSearchQuery: string;
  debitNoteStatusFilter: string;
  debitNoteDateRange: string;
  debitNoteCurrentTab: string;

  // Live API Fetch Actions
  fetchInvoices: () => Promise<void>;
  fetchQuotes: () => Promise<void>;
  fetchSettings: () => Promise<void>;

  // High-Speed POS Counter Sale
  completePOSSale: (posData: {
    customerName?: string;
    customerPhone?: string;
    customerGstin?: string;
    items: IInvoiceItem[];
    settlementMode: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'credit';
    tenderedCashAmount?: number;
    changeReturnAmount?: number;
    paperSize?: '80mm' | '58mm' | 'a4';
    discountPercent?: number;
  }) => Promise<{ invoice: IInvoice; receiptData?: any }>;

  // Invoice Actions
  setInvoiceSearchQuery: (q: string) => void;
  setInvoiceDateRange: (range: string) => void;
  setInvoiceTypeFilter: (type: string) => void;
  setInvoiceStatusFilter: (status: string) => void;
  setInvoicePaymentFilter: (payment: string) => void;
  setInvoiceCurrentTab: (tab: string) => void;
  clearInvoiceFilters: () => void;
  setInvoices: (invoices: any[]) => void;
  setQuotes: (quotes: any[]) => void;
  openCreateInvoiceModal: (draft?: Partial<IInvoice>) => void;
  closeCreateInvoiceModal: () => void;
  createInvoice: (invoice: Omit<IInvoice, 'id'>) => IInvoice;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  duplicateInvoice: (id: string) => void;
  recordPayment: (id: string, amount: number, mode: 'upi' | 'cash' | 'card' | 'bank_transfer') => void;
  cancelInvoice: (id: string, reason?: string) => Promise<void>;

  // Quote Actions
  setQuoteSearchQuery: (q: string) => void;
  setQuoteDateRange: (range: string) => void;
  setQuoteStatusFilter: (status: string) => void;
  setQuoteExpirationFilter: (exp: string) => void;
  setQuoteCustomerFilter: (cust: string) => void;
  setQuoteCurrentTab: (tab: string) => void;
  clearQuoteFilters: () => void;
  updateQuoteStatus: (id: string, status: QuoteStatus) => void;
  createQuote: (quote: Omit<IQuote, 'id'>) => IQuote;
  convertQuoteToInvoice: (quoteId: string) => void;

  // Credit Note Actions
  setCreditNoteSearchQuery: (q: string) => void;
  setCreditNoteStatusFilter: (status: string) => void;
  setCreditNoteDateRange: (range: string) => void;
  setCreditNoteCurrentTab: (tab: string) => void;
  clearCreditNoteFilters: () => void;
  createCreditNote: (note: Omit<ICreditNote, 'id'>) => ICreditNote;
  updateCreditNoteStatus: (id: string, status: NoteStatus) => void;

  // Debit Note Actions
  setDebitNoteSearchQuery: (q: string) => void;
  setDebitNoteStatusFilter: (status: string) => void;
  setDebitNoteDateRange: (range: string) => void;
  setDebitNoteCurrentTab: (tab: string) => void;
  clearDebitNoteFilters: () => void;
  createDebitNote: (note: Omit<IDebitNote, 'id'>) => IDebitNote;
  updateDebitNoteStatus: (id: string, status: NoteStatus) => void;

  // Settings State & Actions
  settings: BillingSettings;
  updateBillingSettings: (settings: Partial<BillingSettings>) => void;
}

export const initialBillingSettings: BillingSettings = {
  defaultCurrency: 'INR - Indian Rupee (₹)',
  billingAddress: '',
  useCustomerBillingAddress: true,
  autoInvoiceGeneration: true,
  invoiceTemplate: 'Classic Tax Invoice',
  invoicePrefix: 'INV-',
  startingSequenceNumber: 1001,
  gstEnabled: true,
  gstin: '',
  state: DEFAULT_INDIAN_STATE,
  taxCalculationType: 'exclusive',
  categoryTaxEnabled: false,
  allowDiscounts: true,
  discountType: 'percentage',
  maxDiscountLimit: 20,
};

const initialInvoices: IInvoice[] = [
  {
    id: 'inv-1248',
    invoiceNo: 'INV-1248',
    date: '11 May 2024',
    dueDate: '26 May 2024',
    customerName: 'Ramesh Stores',
    customerPhone: '9876543210',
    customerGstin: '27AABCR1234F1Z1',
    customerAddress: 'Shop 4, MG Road Market, Mumbai, Maharashtra - 400001',
    state: DEFAULT_INDIAN_STATE,
    placeOfSupply: DEFAULT_INDIAN_STATE,
    paymentTerms: 'Immediate',
    type: 'Tax Invoice',
    items: [
      {
        id: 'it-1248-1',
        productId: 'PRD-1001',
        name: "Men's Cotton Casual Shirt (M)",
        hsnSac: '6205',
        quantity: 2,
        rate: 2500,
        discountPercent: 0,
        taxPercent: 18,
        amount: 5000,
        unit: 'Pcs',
      },
      {
        id: 'it-1248-2',
        productId: 'PRD-1002',
        name: "Women's Embroidered Kurti (L)",
        hsnSac: '6204',
        quantity: 1,
        rate: 2161.02,
        discountPercent: 0,
        taxPercent: 18,
        amount: 2161.02,
        unit: 'Pcs',
      },
    ],
    subTotal: 7161.02,
    discountTotal: 0,
    taxTotal: 1288.98,
    totalAmount: 8450.0,
    paidAmount: 8450.0,
    dueAmount: 0.0,
    status: 'paid',
    settlementMode: 'upi',
    notes: 'Paid via UPI QR at counter checkout',
  },
  {
    id: 'inv-1247',
    invoiceNo: 'INV-1247',
    date: '10 May 2024',
    dueDate: '25 May 2024',
    customerName: 'Sharma Garments',
    customerPhone: '8765432109',
    customerGstin: '27AABCS5678G2Z2',
    customerAddress: '12, Gandhi Square, Pune, Maharashtra - 411001',
    state: DEFAULT_INDIAN_STATE,
    placeOfSupply: DEFAULT_INDIAN_STATE,
    paymentTerms: '15 Days',
    type: 'Tax Invoice',
    items: [
      {
        id: 'it-1247-1',
        productId: 'PRD-1003',
        name: 'Denim Slim Fit Jeans (Size 32)',
        hsnSac: '6203',
        quantity: 3,
        rate: 4302.26,
        discountPercent: 0,
        taxPercent: 18,
        amount: 12906.78,
        unit: 'Pcs',
      },
    ],
    subTotal: 12906.78,
    discountTotal: 0,
    taxTotal: 2323.22,
    totalAmount: 15230.0,
    paidAmount: 10230.0,
    dueAmount: 5000.0,
    status: 'partially_paid',
    settlementMode: 'cash',
    notes: 'Advance paid in Cash ₹10,230, balance ₹5,000 due by 25 May',
  },
  {
    id: 'inv-1246',
    invoiceNo: 'INV-1246',
    date: '09 May 2024',
    dueDate: '24 May 2024',
    customerName: 'Kiran Collection',
    customerPhone: '7654321098',
    customerGstin: '27AABCK9012H3Z3',
    customerAddress: 'Bazaar Road, Thane, Maharashtra - 400601',
    state: DEFAULT_INDIAN_STATE,
    placeOfSupply: DEFAULT_INDIAN_STATE,
    paymentTerms: '15 Days',
    type: 'Tax Invoice',
    items: [
      {
        id: 'it-1246-1',
        productId: 'PRD-1004',
        name: 'Pure Banarasi Silk Saree',
        hsnSac: '5007',
        quantity: 1,
        rate: 5745.76,
        discountPercent: 0,
        taxPercent: 18,
        amount: 5745.76,
        unit: 'Pcs',
      },
    ],
    subTotal: 5745.76,
    discountTotal: 0,
    taxTotal: 1034.24,
    totalAmount: 6780.0,
    paidAmount: 0.0,
    dueAmount: 6780.0,
    status: 'overdue',
    settlementMode: 'credit',
    notes: 'Khata Store Credit bill overdue for 30+ days',
  },
  {
    id: 'inv-1245',
    invoiceNo: 'INV-1245',
    date: '08 May 2024',
    dueDate: '23 May 2024',
    customerName: 'New Look Fashion',
    customerPhone: '6543210987',
    customerGstin: '27AABCN3456J4Z4',
    customerAddress: 'Station Road, Nagpur, Maharashtra - 440001',
    state: DEFAULT_INDIAN_STATE,
    placeOfSupply: DEFAULT_INDIAN_STATE,
    paymentTerms: 'Immediate',
    type: 'Tax Invoice',
    items: [
      {
        id: 'it-1245-1',
        productId: 'PRD-1005',
        name: 'Formal Blazer Navy Blue',
        hsnSac: '6203',
        quantity: 2,
        rate: 5296.61,
        discountPercent: 0,
        taxPercent: 18,
        amount: 10593.22,
        unit: 'Pcs',
      },
    ],
    subTotal: 10593.22,
    discountTotal: 0,
    taxTotal: 1906.78,
    totalAmount: 12500.0,
    paidAmount: 12500.0,
    dueAmount: 0.0,
    status: 'paid',
    settlementMode: 'bank_transfer',
    notes: 'Paid via IMPS Bank Transfer Ref #992810',
  },
  {
    id: 'inv-1244',
    invoiceNo: 'INV-1244',
    date: '07 May 2024',
    dueDate: '22 May 2024',
    customerName: 'Manoj Collection',
    customerPhone: '5432109876',
    customerAddress: 'Main Market, Nashik, Maharashtra - 422001',
    state: DEFAULT_INDIAN_STATE,
    placeOfSupply: DEFAULT_INDIAN_STATE,
    paymentTerms: '15 Days',
    type: 'Tax Invoice',
    items: [
      {
        id: 'it-1244-1',
        productId: 'PRD-1006',
        name: 'Round Neck Casual Tees (Pack of 5)',
        hsnSac: '6109',
        quantity: 1,
        rate: 2754.24,
        discountPercent: 0,
        taxPercent: 18,
        amount: 2754.24,
        unit: 'Pcs',
      },
    ],
    subTotal: 2754.24,
    discountTotal: 0,
    taxTotal: 495.76,
    totalAmount: 3250.0,
    paidAmount: 0.0,
    dueAmount: 3250.0,
    status: 'overdue',
    settlementMode: 'credit',
    notes: 'Billed to customer Khata ledger',
  },
  {
    id: 'inv-1243',
    invoiceNo: 'INV-1243',
    date: '06 May 2024',
    dueDate: '21 May 2024',
    customerName: 'Goyal Textiles',
    customerPhone: '4321098765',
    customerGstin: '27AABCG7890K5Z5',
    customerAddress: 'Laxmi Road, Kolhapur, Maharashtra - 416001',
    state: DEFAULT_INDIAN_STATE,
    placeOfSupply: DEFAULT_INDIAN_STATE,
    paymentTerms: 'Immediate',
    type: 'Tax Invoice',
    items: [
      {
        id: 'it-1243-1',
        productId: 'PRD-1007',
        name: 'Designer Anarkali Gown (Pink)',
        hsnSac: '6204',
        quantity: 1,
        rate: 8389.83,
        discountPercent: 0,
        taxPercent: 18,
        amount: 8389.83,
        unit: 'Pcs',
      },
    ],
    subTotal: 8389.83,
    discountTotal: 0,
    taxTotal: 1510.17,
    totalAmount: 9900.0,
    paidAmount: 9900.0,
    dueAmount: 0.0,
    status: 'paid',
    settlementMode: 'card',
    notes: 'Paid via POS Terminal Card Swipe Ref #10398',
  },
  {
    id: 'inv-1242',
    invoiceNo: 'INV-1242',
    date: '05 May 2024',
    dueDate: '20 May 2024',
    customerName: 'Ajay Traders',
    customerPhone: '3210987654',
    customerAddress: 'Ring Road, Solapur, Maharashtra - 413001',
    state: DEFAULT_INDIAN_STATE,
    placeOfSupply: DEFAULT_INDIAN_STATE,
    paymentTerms: '15 Days',
    type: 'Tax Invoice',
    items: [
      {
        id: 'it-1242-1',
        productId: 'PRD-1008',
        name: 'Pure Leather Belt & Wallet Set',
        hsnSac: '4203',
        quantity: 3,
        rate: 1341.81,
        discountPercent: 0,
        taxPercent: 18,
        amount: 4025.42,
        unit: 'Pcs',
      },
    ],
    subTotal: 4025.42,
    discountTotal: 0,
    taxTotal: 724.58,
    totalAmount: 4750.0,
    paidAmount: 2750.0,
    dueAmount: 2000.0,
    status: 'partially_paid',
    settlementMode: 'cash',
    notes: 'Partial Cash tender ₹2,750 recorded at counter',
  },
  {
    id: 'inv-1241',
    invoiceNo: 'INV-1241',
    date: '04 May 2024',
    dueDate: '19 May 2024',
    customerName: 'Pooja Boutique',
    customerPhone: '2109876543',
    customerAddress: 'Tilak Nagar, Aurangabad, Maharashtra - 431001',
    state: DEFAULT_INDIAN_STATE,
    placeOfSupply: DEFAULT_INDIAN_STATE,
    paymentTerms: '15 Days',
    type: 'Tax Invoice',
    items: [
      {
        id: 'it-1241-1',
        productId: 'PRD-1009',
        name: 'Handcrafted Printed Stoles',
        hsnSac: '6214',
        quantity: 2,
        rate: 974.58,
        discountPercent: 0,
        taxPercent: 18,
        amount: 1949.15,
        unit: 'Pcs',
      },
    ],
    subTotal: 1949.15,
    discountTotal: 0,
    taxTotal: 350.85,
    totalAmount: 2300.0,
    paidAmount: 0.0,
    dueAmount: 2300.0,
    status: 'overdue',
    settlementMode: 'credit',
    notes: 'Outstanding retail credit khata',
  },
];

const initialQuotes: IQuote[] = [
  {
    id: 'q-1024',
    quoteNo: 'Q-1024',
    date: '11 May 2024',
    validUntil: '25 May 2024',
    validDaysText: '2 days left',
    customerName: 'Ramesh Stores',
    customerPhone: '9876543210',
    customerGstin: '27AABCR1234F1Z1',
    customerAddress: 'Shop 4, MG Road Market, Mumbai, Maharashtra - 400001',
    placeOfSupply: DEFAULT_INDIAN_STATE,
    referenceNo: 'PO-4587',
    paymentTerms: '30 Days',
    salesPerson: 'Harish Kumar',
    createdBy: 'Harish Kumar',
    items: [
      {
        id: 'qit-1',
        productId: 'PRD-1001',
        name: "Cotton T-Shirt (M)",
        hsnSac: '61091000',
        quantity: 50,
        unit: 'Pcs',
        rate: 450.0,
        discountPercent: 5,
        taxPercent: 18,
        amount: 21375.0,
        description: '100% Cotton T-Shirt Size: M, Color: Blue',
      },
      {
        id: 'qit-2',
        productId: 'PRD-1003',
        name: 'Denim Jeans (32)',
        hsnSac: '62034200',
        quantity: 20,
        unit: 'Pcs',
        rate: 850.0,
        discountPercent: 0,
        taxPercent: 18,
        amount: 17000.0,
        description: 'Denim Jeans Size: 32',
      },
      {
        id: 'qit-3',
        productId: 'PRD-1010',
        name: 'Sports Sneakers',
        hsnSac: '64039990',
        quantity: 10,
        unit: 'Pair',
        rate: 1200.0,
        discountPercent: 10,
        taxPercent: 18,
        amount: 10800.0,
        description: 'Sports Sneakers Size: 9',
      },
    ],
    subTotal: 49175.0,
    discountTotal: 2975.0,
    taxTotal: 9688.5,
    totalAmount: 55888.5,
    status: 'sent',
    terms: '1. This is an estimate/quote only and not a final invoice.\n2. Prices are valid till the expiry date mentioned above.\n3. Goods once sold will not be taken back.\n4. Payment to be made as per the agreed payment terms.',
  },
  {
    id: 'q-1023',
    quoteNo: 'Q-1023',
    date: '10 May 2024',
    validUntil: '24 May 2024',
    validDaysText: '1 day left',
    customerName: 'Sharma Garments',
    customerPhone: '8765432109',
    customerGstin: '27AABCS5678G2Z2',
    createdBy: 'Sujal Verma',
    items: [],
    subTotal: 12906.78,
    discountTotal: 0,
    taxTotal: 2323.22,
    totalAmount: 15230.0,
    status: 'draft',
  },
  {
    id: 'q-1022',
    quoteNo: 'Q-1022',
    date: '09 May 2024',
    validUntil: '19 May 2024',
    validDaysText: '4 days left',
    customerName: 'Kiran Collection',
    customerPhone: '7654321098',
    createdBy: 'Harish Kumar',
    items: [],
    subTotal: 5745.76,
    discountTotal: 0,
    taxTotal: 1034.24,
    totalAmount: 6780.0,
    status: 'accepted',
  },
  {
    id: 'q-1021',
    quoteNo: 'Q-1021',
    date: '08 May 2024',
    validUntil: '18 May 2024',
    validDaysText: '3 days left',
    customerName: 'New Look Fashion',
    customerPhone: '6543210987',
    createdBy: 'Harish Kumar',
    items: [],
    subTotal: 10593.22,
    discountTotal: 0,
    taxTotal: 1906.78,
    totalAmount: 12500.0,
    status: 'sent',
  },
  {
    id: 'q-1020',
    quoteNo: 'Q-1020',
    date: '07 May 2024',
    validUntil: '07 May 2024',
    validDaysText: 'Expired',
    customerName: 'Manoj Collection',
    customerPhone: '5432109876',
    createdBy: 'Sujal Verma',
    items: [],
    subTotal: 2754.24,
    discountTotal: 0,
    taxTotal: 495.76,
    totalAmount: 3250.0,
    status: 'expired',
  },
  {
    id: 'q-1019',
    quoteNo: 'Q-1019',
    date: '06 May 2024',
    validUntil: '16 May 2024',
    validDaysText: '1 day left',
    customerName: 'Goyal Textiles',
    customerPhone: '4321098765',
    createdBy: 'Harish Kumar',
    items: [],
    subTotal: 8389.83,
    discountTotal: 0,
    taxTotal: 1510.17,
    totalAmount: 9900.0,
    status: 'draft',
  },
  {
    id: 'q-1018',
    quoteNo: 'Q-1018',
    date: '05 May 2024',
    validUntil: '15 May 2024',
    validDaysText: 'Today',
    customerName: 'Ajay Traders',
    customerPhone: '3210987654',
    createdBy: 'Sujal Verma',
    items: [],
    subTotal: 4025.42,
    discountTotal: 0,
    taxTotal: 724.58,
    totalAmount: 4750.0,
    status: 'converted',
  },
  {
    id: 'q-1017',
    quoteNo: 'Q-1017',
    date: '04 May 2024',
    validUntil: '14 May 2024',
    validDaysText: 'Expired',
    customerName: 'Pooja Boutique',
    customerPhone: '2109876543',
    createdBy: 'Harish Kumar',
    items: [],
    subTotal: 1949.15,
    discountTotal: 0,
    taxTotal: 350.85,
    totalAmount: 2300.0,
    status: 'declined',
  },
];

const initialCreditNotes: ICreditNote[] = [];
const initialDebitNotes: IDebitNote[] = [];

export const useBillingStore = create<BillingStoreState>((set, get) => ({
  // Sub navigation & View state
  activeSubTab: 'invoices',
  activeView: 'list',
  setActiveSubTab: (tab) => set({ activeSubTab: tab, activeView: 'list' }),
  setActiveView: (view) => set({ activeView: view }),

  // Settings State
  settings: initialBillingSettings,
  updateBillingSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  // Invoices State
  invoices: initialInvoices,
  isLoadingInvoices: false,
  invoiceSearchQuery: '',
  invoiceDateRange: 'This Month',
  invoiceTypeFilter: 'All Types',
  invoiceStatusFilter: 'All Statuses',
  invoicePaymentFilter: 'All',
  invoiceCurrentTab: 'All Invoices',
  isCreateInvoiceModalOpen: false,
  activeInvoiceForModal: null,

  // Quotes State
  quotes: initialQuotes,
  isLoadingQuotes: false,
  quoteSearchQuery: '',
  quoteDateRange: 'This Month',
  quoteStatusFilter: 'All Statuses',
  quoteExpirationFilter: 'All',
  quoteCustomerFilter: 'All',
  quoteCurrentTab: 'All Quotes',

  // Credit Notes State
  creditNotes: initialCreditNotes,
  creditNoteSearchQuery: '',
  creditNoteStatusFilter: 'All Status',
  creditNoteDateRange: 'This Month',
  creditNoteCurrentTab: 'All',

  // Debit Notes State
  debitNotes: initialDebitNotes,
  debitNoteSearchQuery: '',
  debitNoteStatusFilter: 'All Status',
  debitNoteDateRange: 'This Month',
  debitNoteCurrentTab: 'All',

  // Live Backend API Fetch Actions
  fetchInvoices: async () => {
    set({ isLoadingInvoices: true });
    try {
      const res = await billingApi.getInvoices();
      if (res && res.data && Array.isArray(res.data.invoices) && res.data.invoices.length > 0) {
        set({ invoices: res.data.invoices.map(normalizeBackendInvoice) });
      }
    } catch (err) {
      console.warn('Live invoices fetch error (using cache/local):', err);
    } finally {
      set({ isLoadingInvoices: false });
    }
  },

  fetchQuotes: async () => {
    set({ isLoadingQuotes: true });
    try {
      const res = await billingApi.getQuotes();
      if (res && res.data && Array.isArray(res.data.quotes) && res.data.quotes.length > 0) {
        set({ quotes: res.data.quotes.map(normalizeBackendQuote) });
      }
    } catch (err) {
      console.warn('Live quotes fetch error (using cache/local):', err);
    } finally {
      set({ isLoadingQuotes: false });
    }
  },

  fetchSettings: async () => {
    try {
      const res = await billingApi.getSettings();
      if (res && res.data) {
        set((state) => ({
          settings: { ...state.settings, ...res.data },
        }));
      }
    } catch (err) {
      console.warn('Live billing settings fetch error:', err);
    }
  },

  // High-Speed POS Counter Sale Execution
  completePOSSale: async (posData) => {
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const subTotal = posData.items.reduce((sum, it) => sum + it.quantity * it.rate, 0);
    const discountPercent = posData.discountPercent || 0;
    const discountAmount = Math.round(((subTotal * discountPercent) / 100) * 100) / 100;
    const taxableAmount = Math.max(0, subTotal - discountAmount);
    const taxTotal = Math.round(taxableAmount * 0.18 * 100) / 100;
    const grandTotal = Math.round((taxableAmount + taxTotal) * 100) / 100;

    const tenderedCash = posData.settlementMode === 'cash' ? (posData.tenderedCashAmount ?? grandTotal) : undefined;
    const changeReturn = posData.settlementMode === 'cash' ? Math.max(0, (tenderedCash ?? grandTotal) - grandTotal) : undefined;

    const idempotencyKey = `pos-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    let responseInvoice: IInvoice | null = null;
    let receiptData: any = null;

    // 1. Attempt Atomic POS checkout via backend Tier 2 API
    try {
      const res = await billingApi.createPOSSale({
        customer: {
          name: posData.customerName || 'Walk-in Retail Customer',
          phone: posData.customerPhone ? posData.customerPhone.replace(/\D/g, '') || '9999999999' : '9999999999',
          gstin: posData.customerGstin || undefined,
        },
        items: posData.items.map((it) => ({
          productId: it.productId,
          title: it.name,
          quantity: it.quantity,
          unit: (it.unit as any) || 'Pcs',
          unitPrice: it.rate,
          discountAmount: it.discountPercent ? Math.round((it.rate * it.quantity * it.discountPercent) / 100) : 0,
          taxRate: it.taxPercent ?? 18,
          hsnCode: it.hsnSac || '0000',
        })),
        settlementMode: posData.settlementMode === 'bank_transfer' ? 'credit' : posData.settlementMode,
        tenderedCashAmount: tenderedCash,
        changeReturnAmount: changeReturn,
        paperSize: posData.paperSize === '58mm' ? '58mm' : '80mm',
        kickCashDrawer: true,
        idempotencyKey,
      }, idempotencyKey);

      if (res && res.data && res.data.invoice) {
        responseInvoice = normalizeBackendInvoice(res.data.invoice);
        receiptData = res.data.receiptData;
      }
    } catch (apiErr) {
      console.warn('Backend POS API non-blocking fallback to local state:', apiErr);
    }

    // 2. Synchronize inventory store: decrement stock for purchased items & record audit transaction
    try {
      const inventoryStore = useInventoryStore.getState();
      inventoryStore.recordSaleDeduction(
        posData.items.map((it) => ({
          productId: it.productId,
          sku: it.productId,
          quantity: it.quantity,
        })),
        responseInvoice?.invoiceNo || `POS-${Date.now()}`,
        'pos',
        'In-store counter checkout'
      );
    } catch (e) {
      console.warn('POS Inventory stock decrement notice:', e);
    }

    // 3. Fallback to local invoice creation if backend was offline
    if (!responseInvoice) {
      const newInvoiceNo = (get().settings.invoicePrefix || 'INV-') + (get().settings.startingSequenceNumber + get().invoices.length);
      responseInvoice = {
        id: 'pos-' + Date.now(),
        invoiceNo: newInvoiceNo,
        date: today,
        dueDate: today,
        customerName: posData.customerName || 'Walk-in Retail Customer',
        customerPhone: posData.customerPhone || '',
        customerGstin: posData.customerGstin,
        customerAddress: 'Counter Sale',
        state: DEFAULT_INDIAN_STATE,
        placeOfSupply: DEFAULT_INDIAN_STATE,
        paymentTerms: 'Immediate',
        type: 'Tax Invoice',
        items: posData.items,
        subTotal,
        discountTotal: discountAmount,
        taxTotal,
        totalAmount: grandTotal,
        paidAmount: grandTotal,
        dueAmount: 0,
        status: 'paid',
        settlementMode: posData.settlementMode,
      };
    }

    // 4. Prepend invoice to active list
    set((state) => ({
      invoices: [responseInvoice!, ...state.invoices],
    }));

    return { invoice: responseInvoice as IInvoice, receiptData };
  },

  // Invoice Filters & Modals
  setInvoiceSearchQuery: (q) => set({ invoiceSearchQuery: q }),
  setInvoiceDateRange: (range) => set({ invoiceDateRange: range }),
  setInvoiceTypeFilter: (type) => set({ invoiceTypeFilter: type }),
  setInvoiceStatusFilter: (status) => set({ invoiceStatusFilter: status }),
  setInvoicePaymentFilter: (payment) => set({ invoicePaymentFilter: payment }),
  setInvoiceCurrentTab: (tab) => set({ invoiceCurrentTab: tab }),
  clearInvoiceFilters: () =>
    set({
      invoiceSearchQuery: '',
      invoiceDateRange: 'This Month',
      invoiceTypeFilter: 'All Types',
      invoiceStatusFilter: 'All Statuses',
      invoicePaymentFilter: 'All',
      invoiceCurrentTab: 'All Invoices',
    }),
  setInvoices: (invoices) => set({ invoices: invoices.map(normalizeBackendInvoice) }),
  setQuotes: (quotes) => set({ quotes: quotes.map(normalizeBackendQuote) }),
  openCreateInvoiceModal: (draft) =>
    set({
      isCreateInvoiceModalOpen: true,
      activeInvoiceForModal: draft || null,
    }),
  closeCreateInvoiceModal: () =>
    set({
      isCreateInvoiceModalOpen: false,
      activeInvoiceForModal: null,
    }),

  createInvoice: (invoiceData) => {
    const newId = 'inv-' + Date.now();
    const newInvoiceNo = (get().settings.invoicePrefix || 'INV-') + (get().settings.startingSequenceNumber + get().invoices.length);
    const newInvoice: IInvoice = {
      ...invoiceData,
      id: newId,
      invoiceNo: invoiceData.invoiceNo || newInvoiceNo,
    };

    // Live inventory synchronization: decrement stock for invoiced items
    try {
      const inventoryStore = useInventoryStore.getState();
      invoiceData.items.forEach((item) => {
        if (item.productId && item.quantity > 0) {
          const invItem = inventoryStore.items.find(
            (i) => i.id === item.productId || i.sku === item.productId
          );
          if (invItem) {
            inventoryStore.adjustStock(
              invItem.id,
              'decrease',
              item.quantity,
              `Invoiced in ${newInvoice.invoiceNo}`,
              newInvoice.invoiceNo,
              `Deducted upon invoice creation`
            );
          }
        }
      });
    } catch (e) {
      console.warn('Inventory sync error:', e);
    }

    set((state) => ({
      invoices: [newInvoice, ...state.invoices],
      isCreateInvoiceModalOpen: false,
      activeInvoiceForModal: null,
    }));
    return newInvoice;
  },

  updateInvoiceStatus: (id, status) => {
    set((state) => ({
      invoices: state.invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv)),
    }));
  },

  duplicateInvoice: (id) => {
    const inv = get().invoices.find((i) => i.id === id);
    if (!inv) return;
    const duplicated: IInvoice = {
      ...inv,
      id: 'inv-' + Date.now(),
      invoiceNo: (get().settings.invoicePrefix || 'INV-') + (get().settings.startingSequenceNumber + get().invoices.length),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'draft',
      paidAmount: 0,
      dueAmount: inv.totalAmount,
    };
    set((state) => ({
      invoices: [duplicated, ...state.invoices],
    }));
  },

  recordPayment: (id, amount, mode) => {
    set((state) => ({
      invoices: state.invoices.map((inv) => {
        if (inv.id !== id) return inv;
        const newPaid = Math.min(inv.totalAmount, inv.paidAmount + amount);
        const newDue = Math.max(0, inv.totalAmount - newPaid);
        const newStatus: InvoiceStatus =
          newDue === 0 ? 'paid' : newPaid > 0 ? 'partially_paid' : inv.status;
        return {
          ...inv,
          paidAmount: newPaid,
          dueAmount: newDue,
          status: newStatus,
          settlementMode: mode,
        };
      }),
    }));
  },

  cancelInvoice: async (id, reason) => {
    const inv = get().invoices.find((i) => i.id === id);
    if (!inv || inv.status === 'cancelled') return;

    try {
      await billingApi.cancelInvoice(id);
    } catch (e) {
      console.warn('Backend cancel API fallback to local:', e);
    }

    // Re-increment stock in inventoryStore
    try {
      const inventoryStore = useInventoryStore.getState();
      inv.items.forEach((item) => {
        if (item.productId && item.quantity > 0) {
          inventoryStore.adjustStock(
            item.productId,
            'increase',
            item.quantity,
            `Cancelled Invoice ${inv.invoiceNo} (${reason || 'Merchant Cancellation'})`,
            inv.invoiceNo,
            'Restocked from cancelled invoice'
          );
        }
      });
    } catch (invErr) {
      console.warn('Inventory restock notice on cancel:', invErr);
    }

    set((state) => ({
      invoices: state.invoices.map((i) =>
        i.id === id ? { ...i, status: 'cancelled' as InvoiceStatus } : i
      ),
    }));
  },

  // Quotes Actions
  setQuoteSearchQuery: (q) => set({ quoteSearchQuery: q }),
  setQuoteDateRange: (range) => set({ quoteDateRange: range }),
  setQuoteStatusFilter: (status) => set({ quoteStatusFilter: status }),
  setQuoteExpirationFilter: (exp) => set({ quoteExpirationFilter: exp }),
  setQuoteCustomerFilter: (cust) => set({ quoteCustomerFilter: cust }),
  setQuoteCurrentTab: (tab) => set({ quoteCurrentTab: tab }),
  clearQuoteFilters: () =>
    set({
      quoteSearchQuery: '',
      quoteDateRange: 'This Month',
      quoteStatusFilter: 'All Statuses',
      quoteExpirationFilter: 'All',
      quoteCustomerFilter: 'All',
      quoteCurrentTab: 'All Quotes',
    }),
  updateQuoteStatus: (id, status) => {
    set((state) => ({
      quotes: state.quotes.map((q) => (q.id === id ? { ...q, status } : q)),
    }));
  },
  createQuote: (quoteData) => {
    const newId = 'quote-' + Date.now();
    const newQuoteNo = 'Q-' + (1001 + get().quotes.length);
    const newQuote: IQuote = {
      ...quoteData,
      id: newId,
      quoteNo: quoteData.quoteNo || newQuoteNo,
    };
    set((state) => ({
      quotes: [newQuote, ...state.quotes],
      activeView: 'list',
    }));
    return newQuote;
  },
  convertQuoteToInvoice: (quoteId) => {
    const quote = get().quotes.find((q) => q.id === quoteId);
    if (!quote) return;
    // Mark quote as converted
    get().updateQuoteStatus(quoteId, 'converted');

    // Prepopulate invoice draft and open modal
    const invoiceDraft: Partial<IInvoice> = {
      customerName: quote.customerName,
      customerPhone: quote.customerPhone,
      customerGstin: quote.customerGstin,
      customerAddress: quote.customerAddress,
      placeOfSupply: quote.placeOfSupply,
      type: 'Tax Invoice',
      items: quote.items,
      subTotal: quote.subTotal,
      discountTotal: quote.discountTotal,
      taxTotal: quote.taxTotal,
      totalAmount: quote.totalAmount,
      paidAmount: 0,
      dueAmount: quote.totalAmount,
      status: 'draft',
    };

    set({
      activeSubTab: 'invoices',
      activeView: 'list',
      isCreateInvoiceModalOpen: true,
      activeInvoiceForModal: invoiceDraft,
    });
  },

  // Credit Note Actions
  setCreditNoteSearchQuery: (q) => set({ creditNoteSearchQuery: q }),
  setCreditNoteStatusFilter: (status) => set({ creditNoteStatusFilter: status }),
  setCreditNoteDateRange: (range) => set({ creditNoteDateRange: range }),
  setCreditNoteCurrentTab: (tab) => set({ creditNoteCurrentTab: tab }),
  clearCreditNoteFilters: () =>
    set({
      creditNoteSearchQuery: '',
      creditNoteStatusFilter: 'All Status',
      creditNoteDateRange: 'This Month',
      creditNoteCurrentTab: 'All',
    }),
  createCreditNote: (noteData) => {
    const newId = 'cn-' + Date.now();
    const newNoteNo = 'CN-' + (1001 + get().creditNotes.length);
    const newNote: ICreditNote = {
      ...noteData,
      id: newId,
      noteNo: noteData.noteNo || newNoteNo,
    };

    // Live inventory synchronization: re-increment returned items back into stock
    try {
      const inventoryStore = useInventoryStore.getState();
      noteData.items.forEach((item) => {
        if (item.productId && item.returnedQty > 0) {
          const invItem = inventoryStore.items.find(
            (i) => i.id === item.productId || i.sku === item.productId
          );
          if (invItem) {
            inventoryStore.adjustStock(
              invItem.id,
              'increase',
              item.returnedQty,
              `Returned in Credit Note ${newNote.noteNo} (${newNote.reason})`,
              newNote.noteNo,
              `Restocked from returned invoice items`
            );
          }
        }
      });
    } catch (e) {
      console.warn('Inventory restock sync error:', e);
    }

    set((state) => ({
      creditNotes: [newNote, ...state.creditNotes],
      activeView: 'list',
    }));
    return newNote;
  },
  updateCreditNoteStatus: (id, status) => {
    set((state) => ({
      creditNotes: state.creditNotes.map((cn) => (cn.id === id ? { ...cn, status } : cn)),
    }));
  },

  // Debit Note Actions
  setDebitNoteSearchQuery: (q) => set({ debitNoteSearchQuery: q }),
  setDebitNoteStatusFilter: (status) => set({ debitNoteStatusFilter: status }),
  setDebitNoteDateRange: (range) => set({ debitNoteDateRange: range }),
  setDebitNoteCurrentTab: (tab) => set({ debitNoteCurrentTab: tab }),
  clearDebitNoteFilters: () =>
    set({
      debitNoteSearchQuery: '',
      debitNoteStatusFilter: 'All Status',
      debitNoteDateRange: 'This Month',
      debitNoteCurrentTab: 'All',
    }),
  createDebitNote: (noteData) => {
    const newId = 'dn-' + Date.now();
    const newNoteNo = 'DN-' + (1001 + get().debitNotes.length);
    const newNote: IDebitNote = {
      ...noteData,
      id: newId,
      noteNo: noteData.noteNo || newNoteNo,
    };
    set((state) => ({
      debitNotes: [newNote, ...state.debitNotes],
      activeView: 'list',
    }));
    return newNote;
  },
  updateDebitNoteStatus: (id, status) => {
    set((state) => ({
      debitNotes: state.debitNotes.map((dn) => (dn.id === id ? { ...dn, status } : dn)),
    }));
  },
}));
