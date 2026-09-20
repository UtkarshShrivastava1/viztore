import { create } from 'zustand';
import { useInventoryStore } from './inventoryStore.js';

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired' | 'converted' | 'cancelled';
export type NoteStatus = 'draft' | 'issued' | 'used' | 'partially_used' | 'expired' | 'cancelled';

export type BillingSubTab = 'invoices' | 'quotes';
export type BillingViewMode = 'list' | 'create_quote' | 'settings';

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
  settlementMode?: 'upi' | 'cash' | 'card' | 'bank_transfer';
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

interface BillingStoreState {
  // Navigation & Sub-views
  activeSubTab: BillingSubTab;
  activeView: BillingViewMode;
  setActiveSubTab: (tab: BillingSubTab) => void;
  setActiveView: (view: BillingViewMode) => void;

  // Invoices State
  invoices: IInvoice[];
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

  // Invoice Actions
  setInvoiceSearchQuery: (q: string) => void;
  setInvoiceDateRange: (range: string) => void;
  setInvoiceTypeFilter: (type: string) => void;
  setInvoiceStatusFilter: (status: string) => void;
  setInvoicePaymentFilter: (payment: string) => void;
  setInvoiceCurrentTab: (tab: string) => void;
  clearInvoiceFilters: () => void;
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
  billingAddress: '12, MG Road, Commercial Area, Indore, Madhya Pradesh - 452001, India',
  useCustomerBillingAddress: true,
  autoInvoiceGeneration: true,
  invoiceTemplate: 'Classic Tax Invoice',
  invoicePrefix: 'INV-',
  startingSequenceNumber: 1249,
  gstEnabled: true,
  gstin: '27ABCDE1234F1Z5',
  state: 'Maharashtra (27)',
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
  creditNoteDateRange: '01 May 2024 - 31 May 2024',
  creditNoteCurrentTab: 'All',

  // Debit Notes State
  debitNotes: initialDebitNotes,
  debitNoteSearchQuery: '',
  debitNoteStatusFilter: 'All Status',
  debitNoteDateRange: '01 May 2024 - 31 May 2024',
  debitNoteCurrentTab: 'All',

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
    const newInvoiceNo = 'INV-' + (1248 + get().invoices.length + 1);
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
      invoiceNo: 'INV-' + (1248 + get().invoices.length + 1),
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
    const newQuoteNo = 'Q-' + (1025 + get().quotes.length);
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
      items: quote.items.length > 0 ? quote.items : [
        {
          id: 'item-converted-1',
          productId: 'PRD-101',
          name: 'Cotton T-Shirt (M)',
          hsnSac: '61091000',
          quantity: 1,
          rate: quote.totalAmount,
          discountPercent: 0,
          taxPercent: 18,
          amount: quote.totalAmount,
        }
      ],
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
      creditNoteDateRange: '01 May 2024 - 31 May 2024',
      creditNoteCurrentTab: 'All',
    }),
  createCreditNote: (noteData) => {
    const newId = 'cn-' + Date.now();
    const newNoteNo = 'CN-' + (1004 + get().creditNotes.length);
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
      debitNoteDateRange: '01 May 2024 - 31 May 2024',
      debitNoteCurrentTab: 'All',
    }),
  createDebitNote: (noteData) => {
    const newId = 'dn-' + Date.now();
    const newNoteNo = 'DN-' + (1039 + get().debitNotes.length);
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
