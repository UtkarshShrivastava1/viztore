import { create } from 'zustand';
import { useInventoryStore } from './inventoryStore.js';

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired' | 'converted' | 'cancelled';
export type NoteStatus = 'draft' | 'issued' | 'used' | 'partially_used' | 'expired' | 'cancelled';

export type BillingSubTab = 'invoices' | 'quotes' | 'credit_notes' | 'debit_notes';
export type BillingViewMode = 'list' | 'create_quote' | 'create_credit_note' | 'create_debit_note';

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
}

// Initial Mock Invoices from 5.0.png / 5.1.png
const initialInvoices: IInvoice[] = [
  {
    id: 'inv-1',
    invoiceNo: 'INV-1248',
    date: '11 May 2024',
    dueDate: '25 May 2024',
    customerName: 'Ramesh Stores',
    customerPhone: '9876543210',
    customerGstin: '23ABCDE1234F1Z5',
    customerAddress: '12, MG Road, Commercial Area, Indore, Madhya Pradesh - 452001, India',
    state: 'Madhya Pradesh (23)',
    placeOfSupply: 'Madhya Pradesh (23)',
    paymentTerms: '15 Days',
    type: 'Tax Invoice',
    items: [
      {
        id: 'item-1',
        productId: 'PRD-101',
        name: 'Cotton T-Shirt (M)',
        hsnSac: '61091000',
        quantity: 15,
        rate: 450,
        discountPercent: 5,
        taxPercent: 18,
        amount: 8450.0,
      },
    ],
    subTotal: 8000.0,
    discountTotal: 400.0,
    taxTotal: 850.0,
    totalAmount: 8450.0,
    paidAmount: 8450.0,
    dueAmount: 0.0,
    status: 'paid',
    settlementMode: 'upi',
  },
  {
    id: 'inv-2',
    invoiceNo: 'INV-1247',
    date: '10 May 2024',
    dueDate: '24 May 2024',
    customerName: 'Sharma Garments',
    customerPhone: '8765432109',
    customerGstin: '23BCDEF2345G2Z6',
    customerAddress: '45, Cloth Market, Indore, Madhya Pradesh - 452002',
    state: 'Madhya Pradesh (23)',
    placeOfSupply: 'Madhya Pradesh (23)',
    paymentTerms: '15 Days',
    type: 'Tax Invoice',
    items: [
      {
        id: 'item-2',
        productId: 'PRD-102',
        name: 'Denim Jeans (32)',
        hsnSac: '62034200',
        quantity: 15,
        rate: 850,
        discountPercent: 0,
        taxPercent: 18,
        amount: 15230.0,
      },
    ],
    subTotal: 12906.78,
    discountTotal: 0.0,
    taxTotal: 2323.22,
    totalAmount: 15230.0,
    paidAmount: 10230.0,
    dueAmount: 5000.0,
    status: 'partially_paid',
    settlementMode: 'card',
  },
  {
    id: 'inv-3',
    invoiceNo: 'INV-1246',
    date: '09 May 2024',
    dueDate: '23 May 2024',
    customerName: 'Kiran Collection',
    customerPhone: '7654321098',
    customerGstin: '23CDEFG3456H3Z7',
    customerAddress: '88, Jail Road, Indore, Madhya Pradesh',
    type: 'Tax Invoice',
    items: [
      {
        id: 'item-3',
        productId: 'PRD-103',
        name: 'Sneakers (9)',
        hsnSac: '64039990',
        quantity: 5,
        rate: 1200,
        discountPercent: 10,
        taxPercent: 18,
        amount: 6780.0,
      },
    ],
    subTotal: 5745.76,
    discountTotal: 600.0,
    taxTotal: 1034.24,
    totalAmount: 6780.0,
    paidAmount: 0.0,
    dueAmount: 6780.0,
    status: 'overdue',
  },
  {
    id: 'inv-4',
    invoiceNo: 'INV-1245',
    date: '08 May 2024',
    dueDate: '22 May 2024',
    customerName: 'New Look Fashion',
    customerPhone: '6543210987',
    type: 'Tax Invoice',
    items: [
      {
        id: 'item-4',
        productId: 'PRD-101',
        name: 'Cotton T-Shirt (L)',
        hsnSac: '61091000',
        quantity: 25,
        rate: 450,
        discountPercent: 0,
        taxPercent: 18,
        amount: 12500.0,
      },
    ],
    subTotal: 10593.22,
    discountTotal: 0.0,
    taxTotal: 1906.78,
    totalAmount: 12500.0,
    paidAmount: 12500.0,
    dueAmount: 0.0,
    status: 'paid',
    settlementMode: 'bank_transfer',
  },
  {
    id: 'inv-5',
    invoiceNo: 'INV-1244',
    date: '07 May 2024',
    dueDate: '21 May 2024',
    customerName: 'Manoj Collection',
    customerPhone: '5432109876',
    type: 'Tax Invoice',
    items: [
      {
        id: 'item-5',
        productId: 'PRD-104',
        name: 'Polo T-Shirt',
        hsnSac: '61091000',
        quantity: 5,
        rate: 650,
        discountPercent: 0,
        taxPercent: 18,
        amount: 3250.0,
      },
    ],
    subTotal: 2754.24,
    discountTotal: 0.0,
    taxTotal: 495.76,
    totalAmount: 3250.0,
    paidAmount: 0.0,
    dueAmount: 3250.0,
    status: 'overdue',
  },
  {
    id: 'inv-6',
    invoiceNo: 'INV-1243',
    date: '06 May 2024',
    dueDate: '20 May 2024',
    customerName: 'Goyal Textiles',
    customerPhone: '4321098765',
    type: 'Tax Invoice',
    items: [
      {
        id: 'item-6',
        productId: 'PRD-102',
        name: 'Denim Jeans (34)',
        hsnSac: '62034200',
        quantity: 10,
        rate: 850,
        discountPercent: 0,
        taxPercent: 18,
        amount: 9900.0,
      },
    ],
    subTotal: 8389.83,
    discountTotal: 0.0,
    taxTotal: 1510.17,
    totalAmount: 9900.0,
    paidAmount: 9900.0,
    dueAmount: 0.0,
    status: 'paid',
    settlementMode: 'cash',
  },
  {
    id: 'inv-7',
    invoiceNo: 'INV-1242',
    date: '05 May 2024',
    dueDate: '19 May 2024',
    customerName: 'Ajay Traders',
    customerPhone: '3210987654',
    type: 'Tax Invoice',
    items: [
      {
        id: 'item-7',
        productId: 'PRD-105',
        name: 'Casual Shirt (M)',
        hsnSac: '62052000',
        quantity: 5,
        rate: 850,
        discountPercent: 0,
        taxPercent: 18,
        amount: 4750.0,
      },
    ],
    subTotal: 4025.42,
    discountTotal: 0.0,
    taxTotal: 724.58,
    totalAmount: 4750.0,
    paidAmount: 2750.0,
    dueAmount: 2000.0,
    status: 'partially_paid',
    settlementMode: 'upi',
  },
  {
    id: 'inv-8',
    invoiceNo: 'INV-1241',
    date: '04 May 2024',
    dueDate: '18 May 2024',
    customerName: 'Pooja Boutique',
    customerPhone: '2109876543',
    type: 'Tax Invoice',
    items: [
      {
        id: 'item-8',
        productId: 'PRD-106',
        name: 'Kurti (Free Size)',
        hsnSac: '62044220',
        quantity: 3,
        rate: 700,
        discountPercent: 0,
        taxPercent: 18,
        amount: 2300.0,
      },
    ],
    subTotal: 1949.15,
    discountTotal: 0.0,
    taxTotal: 350.85,
    totalAmount: 2300.0,
    paidAmount: 0.0,
    dueAmount: 2300.0,
    status: 'overdue',
  },
  {
    id: 'inv-9',
    invoiceNo: 'INV-1240',
    date: '03 May 2024',
    dueDate: '17 May 2024',
    customerName: 'Style Corner',
    customerPhone: '9988776655',
    type: 'Tax Invoice',
    items: [
      {
        id: 'item-9',
        productId: 'PRD-101',
        name: 'Cotton T-Shirt (XL)',
        hsnSac: '61091000',
        quantity: 16,
        rate: 450,
        discountPercent: 0,
        taxPercent: 18,
        amount: 8600.0,
      },
    ],
    subTotal: 7288.14,
    discountTotal: 0.0,
    taxTotal: 1311.86,
    totalAmount: 8600.0,
    paidAmount: 8600.0,
    dueAmount: 0.0,
    status: 'paid',
    settlementMode: 'upi',
  },
  {
    id: 'inv-10',
    invoiceNo: 'INV-1238',
    date: '01 May 2024',
    dueDate: '15 May 2024',
    customerName: 'Modern Fabrics',
    customerPhone: '8877665544',
    type: 'Tax Invoice',
    items: [
      {
        id: 'item-10',
        productId: 'PRD-107',
        name: 'Formal Trousers (32)',
        hsnSac: '62034200',
        quantity: 5,
        rate: 980,
        discountPercent: 0,
        taxPercent: 18,
        amount: 5450.0,
      },
    ],
    subTotal: 4618.64,
    discountTotal: 0.0,
    taxTotal: 831.36,
    totalAmount: 5450.0,
    paidAmount: 0.0,
    dueAmount: 5000.0,
    status: 'partially_paid',
  },
];

// Initial Mock Quotes from 5.4.png
const initialQuotes: IQuote[] = [
  {
    id: 'quote-1',
    quoteNo: 'Q-1024',
    date: '11 May 2024',
    validUntil: '25 May 2024',
    validDaysText: '(2 days left)',
    customerName: 'Ramesh Stores',
    customerPhone: '9876543210',
    customerGstin: '23ABCDE1234F1Z5',
    customerAddress: '12, MG Road, Commercial Area, Indore, Madhya Pradesh - 452001',
    placeOfSupply: 'Madhya Pradesh (23)',
    totalAmount: 8450.0,
    subTotal: 8000.0,
    discountTotal: 400.0,
    taxTotal: 850.0,
    status: 'sent',
    createdBy: 'Harish Kumar',
    items: [
      {
        id: 'qi-1',
        productId: 'PRD-101',
        name: 'Cotton T-Shirt (M)',
        hsnSac: '61091000',
        quantity: 50,
        rate: 450,
        discountPercent: 5,
        taxPercent: 18,
        amount: 51975.0,
        unit: 'Pcs',
        description: '100% Cotton T-Shirt Size: M, Color: Blue',
      },
    ],
  },
  {
    id: 'quote-2',
    quoteNo: 'Q-1023',
    date: '10 May 2024',
    validUntil: '24 May 2024',
    validDaysText: '(1 day left)',
    customerName: 'Sharma Garments',
    customerPhone: '8765432109',
    totalAmount: 15230.0,
    subTotal: 12906.78,
    discountTotal: 0.0,
    taxTotal: 2323.22,
    status: 'accepted',
    createdBy: 'Sujal Verma',
    items: [
      {
        id: 'qi-2',
        productId: 'PRD-102',
        name: 'Denim Jeans (32)',
        hsnSac: '62034200',
        quantity: 20,
        rate: 850,
        discountPercent: 0,
        taxPercent: 18,
        amount: 20060.0,
        unit: 'Pcs',
        description: 'Denim Jeans Size: 32',
      },
    ],
  },
  {
    id: 'quote-3',
    quoteNo: 'Q-1022',
    date: '09 May 2024',
    validUntil: '19 May 2024',
    validDaysText: '(4 days left)',
    customerName: 'Kiran Collection',
    customerPhone: '7654321098',
    totalAmount: 6780.0,
    subTotal: 5745.76,
    discountTotal: 600.0,
    taxTotal: 1034.24,
    status: 'converted',
    createdBy: 'Harish Kumar',
    items: [],
  },
  {
    id: 'quote-4',
    quoteNo: 'Q-1021',
    date: '08 May 2024',
    validUntil: '18 May 2024',
    validDaysText: '(3 days left)',
    customerName: 'New Look Fashion',
    customerPhone: '6543210987',
    totalAmount: 12500.0,
    subTotal: 10593.22,
    discountTotal: 0.0,
    taxTotal: 1906.78,
    status: 'declined',
    createdBy: 'Harish Kumar',
    items: [],
  },
  {
    id: 'quote-5',
    quoteNo: 'Q-1020',
    date: '07 May 2024',
    validUntil: '07 May 2024',
    validDaysText: '(Expired)',
    customerName: 'Manoj Collection',
    customerPhone: '5432109876',
    totalAmount: 3250.0,
    subTotal: 2754.24,
    discountTotal: 0.0,
    taxTotal: 495.76,
    status: 'expired',
    createdBy: 'Sujal Verma',
    items: [],
  },
  {
    id: 'quote-6',
    quoteNo: 'Q-1019',
    date: '06 May 2024',
    validUntil: '16 May 2024',
    validDaysText: '(1 day left)',
    customerName: 'Goyal Textiles',
    customerPhone: '4321098765',
    totalAmount: 9900.0,
    subTotal: 8389.83,
    discountTotal: 0.0,
    taxTotal: 1510.17,
    status: 'sent',
    createdBy: 'Harish Kumar',
    items: [],
  },
  {
    id: 'quote-7',
    quoteNo: 'Q-1018',
    date: '05 May 2024',
    validUntil: '15 May 2024',
    validDaysText: '(Today)',
    customerName: 'Ajay Traders',
    customerPhone: '3210987654',
    totalAmount: 4750.0,
    subTotal: 4025.42,
    discountTotal: 0.0,
    taxTotal: 724.58,
    status: 'sent',
    createdBy: 'Sujal Verma',
    items: [],
  },
  {
    id: 'quote-8',
    quoteNo: 'Q-1017',
    date: '04 May 2024',
    validUntil: '14 May 2024',
    validDaysText: '(Expired)',
    customerName: 'Pooja Boutique',
    customerPhone: '2109876543',
    totalAmount: 2300.0,
    subTotal: 1949.15,
    discountTotal: 0.0,
    taxTotal: 350.85,
    status: 'expired',
    createdBy: 'Harish Kumar',
    items: [],
  },
];

// Initial Mock Credit Notes from 5.6.png
const initialCreditNotes: ICreditNote[] = [
  {
    id: 'cn-1',
    noteNo: 'CN-1003',
    invoiceNo: 'INV-1456',
    date: '05 May 2024',
    originalInvoiceDate: '05 May 2024',
    expiryDate: '04 Nov 2024',
    customerName: 'Ramesh Stores',
    customerPhone: '9876543210',
    customerGstin: '23ABCDE1234F1Z5',
    customerAddress: '12, MG Road, Commercial Area, Indore, Madhya Pradesh - 452001',
    placeOfSupply: 'Madhya Pradesh (23)',
    reason: 'Goods Returned',
    totalAmount: 17773.6,
    usedAmount: 17773.6,
    unusedAmount: 0.0,
    status: 'used',
    subTotal: 15895.0,
    discountTotal: 690.0,
    taxTotal: 2568.6,
    items: [
      {
        id: 'cni-1',
        productId: 'PRD-101',
        name: 'Cotton T-Shirt (M)',
        hsnSac: '61091000',
        description: '100% Cotton T-Shirt Size: M, Color: Blue',
        invoicedQty: 100,
        returnedQty: 20,
        quantity: 20,
        unit: 'Pcs',
        rate: 450,
        discountPercent: 5,
        taxPercent: 18,
        amount: 8478.0,
      },
      {
        id: 'cni-2',
        productId: 'PRD-102',
        name: 'Denim Jeans (32)',
        hsnSac: '62034200',
        description: 'Denim Jeans Size: 32',
        invoicedQty: 20,
        returnedQty: 5,
        quantity: 5,
        unit: 'Pcs',
        rate: 850,
        discountPercent: 0,
        taxPercent: 18,
        amount: 4465.0,
      },
      {
        id: 'cni-3',
        productId: 'PRD-103',
        name: 'Sneakers',
        hsnSac: '64039990',
        description: 'Sports Sneakers Size: 9',
        invoicedQty: 10,
        returnedQty: 2,
        quantity: 2,
        unit: 'Pair',
        rate: 1200,
        discountPercent: 10,
        taxPercent: 18,
        amount: 2025.6,
      },
    ],
  },
  {
    id: 'cn-2',
    noteNo: 'CN-1002',
    invoiceNo: 'INV-1455',
    date: '02 May 2024',
    expiryDate: '01 Nov 2024',
    customerName: 'Sharma Electronics',
    reason: 'Defective Product',
    totalAmount: 8500.0,
    usedAmount: 4250.0,
    unusedAmount: 4250.0,
    status: 'partially_used',
    subTotal: 7203.39,
    discountTotal: 0.0,
    taxTotal: 1296.61,
    items: [],
  },
  {
    id: 'cn-3',
    noteNo: 'CN-1001',
    invoiceNo: 'INV-1454',
    date: '30 Apr 2024',
    expiryDate: '29 Oct 2024',
    customerName: 'Kiran Mart',
    reason: 'Billing Adjustment',
    totalAmount: 5000.0,
    usedAmount: 0.0,
    unusedAmount: 5000.0,
    status: 'issued',
    subTotal: 4237.29,
    discountTotal: 0.0,
    taxTotal: 762.71,
    items: [],
  },
  {
    id: 'cn-4',
    noteNo: 'CN-1000',
    invoiceNo: 'INV-1453',
    date: '28 Apr 2024',
    expiryDate: '27 Oct 2024',
    customerName: 'Super Store',
    reason: 'Goods Returned',
    totalAmount: 12750.0,
    usedAmount: 12750.0,
    unusedAmount: 0.0,
    status: 'used',
    subTotal: 10805.08,
    discountTotal: 0.0,
    taxTotal: 1944.92,
    items: [],
  },
  {
    id: 'cn-5',
    noteNo: 'CN-0999',
    invoiceNo: 'INV-1452',
    date: '25 Apr 2024',
    expiryDate: '24 Oct 2024',
    customerName: 'Fashion Hub (Walk-in)',
    reason: 'Size Exchange Return',
    totalAmount: 3200.0,
    usedAmount: 0.0,
    unusedAmount: 3200.0,
    status: 'issued',
    subTotal: 2711.86,
    discountTotal: 0.0,
    taxTotal: 488.14,
    items: [],
  },
  {
    id: 'cn-6',
    noteNo: 'CN-0998',
    invoiceNo: 'INV-1451',
    date: '22 Apr 2024',
    expiryDate: '21 Oct 2024',
    customerName: 'Maa Enterprises',
    reason: 'Price Match Discount',
    totalAmount: 6600.0,
    usedAmount: 1100.0,
    unusedAmount: 5500.0,
    status: 'partially_used',
    subTotal: 5593.22,
    discountTotal: 0.0,
    taxTotal: 1006.78,
    items: [],
  },
  {
    id: 'cn-7',
    noteNo: 'CN-0997',
    invoiceNo: 'INV-1450',
    date: '20 Apr 2024',
    expiryDate: '-',
    customerName: 'Ramesh Stores',
    reason: 'Pending Approval',
    totalAmount: 2400.0,
    usedAmount: 0.0,
    unusedAmount: 2400.0,
    status: 'draft',
    subTotal: 2033.9,
    discountTotal: 0.0,
    taxTotal: 366.1,
    items: [],
  },
  {
    id: 'cn-8',
    noteNo: 'CN-0996',
    invoiceNo: 'INV-1449',
    date: '18 Apr 2024',
    expiryDate: '17 Oct 2024',
    customerName: 'Sharma Electronics',
    reason: 'Goods Returned',
    totalAmount: 9800.0,
    usedAmount: 9800.0,
    unusedAmount: 0.0,
    status: 'used',
    subTotal: 8305.08,
    discountTotal: 0.0,
    taxTotal: 1494.92,
    items: [],
  },
  {
    id: 'cn-9',
    noteNo: 'CN-0995',
    invoiceNo: 'INV-1448',
    date: '15 Apr 2024',
    expiryDate: '14 Oct 2024',
    customerName: 'Kiran Mart',
    reason: 'Order Cancellation',
    totalAmount: 1950.0,
    usedAmount: 0.0,
    unusedAmount: 1950.0,
    status: 'issued',
    subTotal: 1652.54,
    discountTotal: 0.0,
    taxTotal: 297.46,
    items: [],
  },
  {
    id: 'cn-10',
    noteNo: 'CN-0994',
    invoiceNo: 'INV-1447',
    date: '12 Apr 2024',
    expiryDate: '11 Oct 2024',
    customerName: 'Super Store',
    reason: 'Damaged Goods',
    totalAmount: 4750.0,
    usedAmount: 2375.0,
    unusedAmount: 2375.0,
    status: 'partially_used',
    subTotal: 4025.42,
    discountTotal: 0.0,
    taxTotal: 724.58,
    items: [],
  },
  {
    id: 'cn-11',
    noteNo: 'CN-0993',
    invoiceNo: 'INV-1446',
    date: '10 Apr 2024',
    expiryDate: '09 May 2024',
    customerName: 'Lookwell Retail',
    reason: 'Expired Voucher',
    totalAmount: 2100.0,
    usedAmount: 0.0,
    unusedAmount: 2100.0,
    status: 'expired',
    subTotal: 1779.66,
    discountTotal: 0.0,
    taxTotal: 320.34,
    items: [],
  },
  {
    id: 'cn-12',
    noteNo: 'CN-0992',
    invoiceNo: 'INV-1445',
    date: '08 Apr 2024',
    expiryDate: '-',
    customerName: 'Quick Shop',
    reason: 'Disputed Claim',
    totalAmount: 3000.0,
    usedAmount: 0.0,
    unusedAmount: 3000.0,
    status: 'cancelled',
    subTotal: 2542.37,
    discountTotal: 0.0,
    taxTotal: 457.63,
    items: [],
  },
];

// Initial Mock Debit Notes from 5.8.png
const initialDebitNotes: IDebitNote[] = [
  {
    id: 'dn-1',
    noteNo: 'DN-1038',
    invoiceNo: 'INV-1456',
    date: '05 May 2024',
    expiryDate: '04 Nov 2024',
    customerName: 'Ramesh Stores',
    customerPhone: '9876543210',
    customerGstin: '23ABCDE1234F1Z5',
    customerAddress: '12, MG Road, Commercial Area, Indore, Madhya Pradesh - 452001',
    placeOfSupply: 'Madhya Pradesh (23)',
    reason: 'Additional Freight & Shipping Charge',
    referenceNo: 'PO-4587',
    totalAmount: 12500.0,
    usedAmount: 12500.0,
    unusedAmount: 0.0,
    status: 'used',
    subTotal: 10593.22,
    discountTotal: 0.0,
    taxTotal: 1906.78,
    items: [
      {
        id: 'dni-1',
        productId: 'PRD-101',
        name: 'Cotton T-Shirt (M)',
        hsnSac: '61091000',
        description: '100% Cotton T-Shirt Size: M, Color: Blue',
        invoicedQty: 100,
        returnedQty: 20,
        quantity: 20,
        unit: 'Pcs',
        rate: 450,
        discountPercent: 5,
        taxPercent: 18,
        amount: 8478.0,
      },
    ],
  },
  {
    id: 'dn-2',
    noteNo: 'DN-1037',
    invoiceNo: 'INV-1455',
    date: '03 May 2024',
    expiryDate: '01 Nov 2024',
    customerName: 'Sharma Electronics',
    reason: 'Tax Rate Difference',
    totalAmount: 8750.0,
    usedAmount: 4250.0,
    unusedAmount: 4500.0,
    status: 'partially_used',
    subTotal: 7415.25,
    discountTotal: 0.0,
    taxTotal: 1334.75,
    items: [],
  },
  {
    id: 'dn-3',
    noteNo: 'DN-1036',
    invoiceNo: 'INV-1454',
    date: '30 Apr 2024',
    expiryDate: '29 Oct 2024',
    customerName: 'Kiran Mart',
    reason: 'Price Escalation Recovery',
    totalAmount: 5000.0,
    usedAmount: 0.0,
    unusedAmount: 5000.0,
    status: 'issued',
    subTotal: 4237.29,
    discountTotal: 0.0,
    taxTotal: 762.71,
    items: [],
  },
  {
    id: 'dn-4',
    noteNo: 'DN-1035',
    invoiceNo: 'INV-1453',
    date: '28 Apr 2024',
    expiryDate: '27 Oct 2024',
    customerName: 'Super Store',
    reason: 'Express Delivery Fee',
    totalAmount: 7250.0,
    usedAmount: 7250.0,
    unusedAmount: 0.0,
    status: 'used',
    subTotal: 6144.07,
    discountTotal: 0.0,
    taxTotal: 1105.93,
    items: [],
  },
  {
    id: 'dn-5',
    noteNo: 'DN-1034',
    invoiceNo: 'INV-1452',
    date: '25 Apr 2024',
    expiryDate: '24 Oct 2024',
    customerName: 'Fashion Hub (Walk-in)',
    reason: 'Custom Alteration Charges',
    totalAmount: 3200.0,
    usedAmount: 1600.0,
    unusedAmount: 1600.0,
    status: 'partially_used',
    subTotal: 2711.86,
    discountTotal: 0.0,
    taxTotal: 488.14,
    items: [],
  },
  {
    id: 'dn-6',
    noteNo: 'DN-1033',
    invoiceNo: 'INV-1451',
    date: '22 Apr 2024',
    expiryDate: '-',
    customerName: 'Maa Enterprises',
    reason: 'Packaging Material Costs',
    totalAmount: 6600.0,
    usedAmount: 0.0,
    unusedAmount: 6600.0,
    status: 'draft',
    subTotal: 5593.22,
    discountTotal: 0.0,
    taxTotal: 1006.78,
    items: [],
  },
  {
    id: 'dn-7',
    noteNo: 'DN-1032',
    invoiceNo: 'INV-1450',
    date: '20 Apr 2024',
    expiryDate: '-',
    customerName: 'Ramesh Stores',
    reason: 'Special Handling Charge',
    totalAmount: 2400.0,
    usedAmount: 2400.0,
    unusedAmount: 0.0,
    status: 'used',
    subTotal: 2033.9,
    discountTotal: 0.0,
    taxTotal: 366.1,
    items: [],
  },
  {
    id: 'dn-8',
    noteNo: 'DN-1031',
    invoiceNo: 'INV-1449',
    date: '18 Apr 2024',
    expiryDate: '17 Oct 2024',
    customerName: 'Sharma Electronics',
    reason: 'Post-Dispatch Insurance',
    totalAmount: 9800.0,
    usedAmount: 3800.0,
    unusedAmount: 6000.0,
    status: 'partially_used',
    subTotal: 8305.08,
    discountTotal: 0.0,
    taxTotal: 1494.92,
    items: [],
  },
  {
    id: 'dn-9',
    noteNo: 'DN-1030',
    invoiceNo: 'INV-1448',
    date: '15 Apr 2024',
    expiryDate: '14 Oct 2024',
    customerName: 'Kiran Mart',
    reason: 'Warehouse Restocking Fee',
    totalAmount: 1950.0,
    usedAmount: 0.0,
    unusedAmount: 1950.0,
    status: 'issued',
    subTotal: 1652.54,
    discountTotal: 0.0,
    taxTotal: 297.46,
    items: [],
  },
  {
    id: 'dn-10',
    noteNo: 'DN-1029',
    invoiceNo: 'INV-1447',
    date: '12 Apr 2024',
    expiryDate: '11 Oct 2024',
    customerName: 'Super Store',
    reason: 'Additional Quantity Added',
    totalAmount: 4750.0,
    usedAmount: 4750.0,
    unusedAmount: 0.0,
    status: 'used',
    subTotal: 4025.42,
    discountTotal: 0.0,
    taxTotal: 724.58,
    items: [],
  },
  {
    id: 'dn-11',
    noteNo: 'DN-1028',
    invoiceNo: 'INV-1446',
    date: '10 Apr 2024',
    expiryDate: '09 May 2024',
    customerName: 'Lookwell Retail',
    reason: 'Late Settlement Penalty',
    totalAmount: 2100.0,
    usedAmount: 0.0,
    unusedAmount: 2100.0,
    status: 'expired',
    subTotal: 1779.66,
    discountTotal: 0.0,
    taxTotal: 320.34,
    items: [],
  },
  {
    id: 'dn-12',
    noteNo: 'DN-1027',
    invoiceNo: 'INV-1445',
    date: '08 Apr 2024',
    expiryDate: '-',
    customerName: 'Quick Shop',
    reason: 'Administrative Fee',
    totalAmount: 3000.0,
    usedAmount: 0.0,
    unusedAmount: 3000.0,
    status: 'cancelled',
    subTotal: 2542.37,
    discountTotal: 0.0,
    taxTotal: 457.63,
    items: [],
  },
];

export const useBillingStore = create<BillingStoreState>((set, get) => ({
  // Sub navigation & View state
  activeSubTab: 'invoices',
  activeView: 'list',
  setActiveSubTab: (tab) => set({ activeSubTab: tab, activeView: 'list' }),
  setActiveView: (view) => set({ activeView: view }),

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
