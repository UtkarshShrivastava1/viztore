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

const initialInvoices: IInvoice[] = [];
const initialQuotes: IQuote[] = [];
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
      if (res && res.data && Array.isArray(res.data.invoices)) {
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
      if (res && res.data && Array.isArray(res.data.quotes)) {
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
