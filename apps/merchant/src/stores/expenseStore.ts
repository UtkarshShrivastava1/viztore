import { create } from 'zustand';
import { expensesApi } from '../lib/api.js';
import { downloadCSV } from '../utils/csvExport.js';

export type PurchaseSubTab =
  | 'all'
  | 'orders'
  | 'bills'
  | 'expenses'
  | 'credit_notes'
  | 'eway_bills'
  | 'vendors';

export interface PurchaseTransaction {
  id: string;
  date: string;
  time: string;
  referenceNo: string;
  type: 'Purchase' | 'Expense' | 'Purchase Order' | 'Credit Note' | 'E-Way Bill';
  vendorOrPaidTo: string;
  category: string;
  amount: number; // positive or negative
  status: 'Paid' | 'Open' | 'Processed' | 'Generated' | 'Partially Received' | 'Pending';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  time: string;
  vendor: string;
  itemsCount: string;
  totalAmount: number;
  expectedDate: string;
  status: 'Pending' | 'Partially Received' | 'Received' | 'Cancelled';
}

export interface PurchaseBill {
  id: string;
  billNumber: string;
  date: string;
  time: string;
  vendor: string;
  itemsCount: string;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid';
  dueDate: string;
}

export interface ExpenseItem {
  id: string;
  expenseNo: string;
  date: string;
  time: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  status: 'Paid' | 'Pending' | 'Partially Paid';
}

export interface CreditNoteItem {
  id: string;
  creditNoteNo: string;
  date: string;
  time: string;
  referencePurchase: string;
  vendor: string;
  reasonType: string;
  amount: number;
  status: 'Pending' | 'Processed' | 'Cancelled';
}

export interface EWayBillItem {
  id: string;
  eWayBillNo: string;
  date: string;
  time: string;
  invoiceBillNo: string;
  vendor: string;
  fromTo: string;
  distanceKm: number;
  validTill: string;
  status: 'Active' | 'In Transit' | 'Expired' | 'Cancelled';
  vehicleNo?: string;
  totalValue?: number;
  itemsCount?: number;
}

export interface Vendor {
  id: string;
  vendorCode: string; // e.g. "VND-001"
  vendorName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  totalPurchases: number;
  status: 'Active' | 'Inactive' | 'Blocked';
  gstin?: string;
  pan?: string;
  category?: string;
  paymentTerms?: string;
  creditLimit?: number;
  openingBalance?: number;
  address?: string;
  pincode?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  notes?: string;
}

export type VendorItem = Vendor;

// Backward compatibility interfaces
export type ExpenseCategory = string;
export type ExpensePaymentMethod = string;
export type ExpenseStatus = string;
export type ExpenseType = string;
export interface Expense {
  id: string;
  date: string;
  time: string;
  name: string;
  subtitle: string;
  category: string;
  vendor: string;
  paymentMethod: string;
  amount: number;
  tax: number;
  totalAmount: number;
  currency: string;
  status: string;
  expenseType?: string;
  isReimbursable?: boolean;
  receiptName?: string;
  receiptSize?: string;
  referenceNumber?: string;
  notes?: string;
}

interface PurchaseExpenseState {
  // Navigation & Sub-tabs
  activeSubTab: PurchaseSubTab;
  setActiveSubTab: (tab: PurchaseSubTab) => void;

  // Overview KPIs
  overviewKPIs: {
    totalPurchase: number;
    totalExpense: number;
    totalCreditNote: number;
    openPurchaseOrders: number;
    openPOCount: number;
    eWayBillsCount: number;
  };

  // Lists
  allTransactions: PurchaseTransaction[];
  purchaseOrders: PurchaseOrder[];
  purchaseBills: PurchaseBill[];
  expenses: ExpenseItem[];
  creditNotes: CreditNoteItem[];
  ewayBills: EWayBillItem[];
  vendors: VendorItem[];

  // Filter States
  searchQuery: string;
  dateRange: string;
  typeFilter: string;
  categoryFilter: string;
  statusFilter: string;
  vendorFilter: string;
  cityFilter: string;

  setSearchQuery: (query: string) => void;
  setDateRange: (range: string) => void;
  setTypeFilter: (type: string) => void;
  setCategoryFilter: (category: string) => void;
  setStatusFilter: (status: string) => void;
  setVendorFilter: (vendor: string) => void;
  setCityFilter: (city: string) => void;
  clearFilters: () => void;

  // Drawers & Modals States
  selectedPurchase: PurchaseBill | PurchaseTransaction | null;
  setSelectedPurchase: (p: PurchaseBill | PurchaseTransaction | null) => void;

  isEditPurchaseOpen: boolean;
  setIsEditPurchaseOpen: (open: boolean) => void;

  isCreateCreditNoteOpen: boolean;
  setIsCreateCreditNoteOpen: (open: boolean) => void;

  isAddVendorOpen: boolean;
  setIsAddVendorOpen: (open: boolean) => void;

  isGenerateEWayBillOpen: boolean;
  setIsGenerateEWayBillOpen: (open: boolean) => void;

  isCreatePOModalOpen: boolean;
  setIsCreatePOModalOpen: (open: boolean) => void;

  isCreateBillModalOpen: boolean;
  setIsCreateBillModalOpen: (open: boolean) => void;

  isCreateReturnModalOpen: boolean;
  setIsCreateReturnModalOpen: (open: boolean) => void;

  isCreateDirectPurchaseOpen: boolean;
  setIsCreateDirectPurchaseOpen: (open: boolean) => void;

  isAddExpenseModalOpen: boolean;
  setIsAddExpenseModalOpen: (open: boolean) => void;

  // Backend Sync & Mutations
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  fetchExpenseData: () => Promise<void>;
  createExpenseRecord: (data: any) => Promise<boolean>;
  createVendorRecord: (data: any) => Promise<boolean>;
  createPurchaseRecord: (data: any) => Promise<boolean>;
  createCreditNoteRecord: (data: any) => Promise<boolean>;
  createEWayBillRecord: (data: any) => Promise<boolean>;
  deleteExpenseRecord: (id: string) => Promise<boolean>;

  // Vendor & Procurement Hub States (TASK-ABH-14)
  selectedVendor: Vendor | null;
  setSelectedVendor: (v: Vendor | null) => void;
  isImportModalOpen: boolean;
  importType: 'purchases' | 'expenses' | 'vendors' | null;

  // Actions
  openAddVendor: (vendor?: Vendor) => void;
  closeAddVendor: () => void;
  openImportModal: (type: 'purchases' | 'expenses' | 'vendors') => void;
  closeImportModal: () => void;
  saveVendor: (vendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  exportVendorsCsv: () => void;
  exportProcurementReportCsv: () => void;
  importCsvData: (type: 'purchases' | 'expenses' | 'vendors', rows: any[]) => void;
  addEWayBill: (bill: EWayBillItem) => void;

  // Backward compatibility fields
  viewMode: 'list' | 'add';
  setViewMode: (mode: 'list' | 'add') => void;
  addExpense: (expense: any) => void;
  kpis: {
    totalExpenses: number;
    thisMonth: number;
    thisWeek: number;
  };
}

export type ExpenseStoreState = PurchaseExpenseState;

const initialTransactions: PurchaseTransaction[] = [
  {
    id: 'TXN-01',
    date: '11 May 2024',
    time: '11:24 AM',
    referenceNo: 'BILL-2024-000123',
    type: 'Purchase',
    vendorOrPaidTo: 'Sharma Enterprises',
    category: 'Inventory (Apparel)',
    amount: -25000.0,
    status: 'Paid',
  },
  {
    id: 'TXN-02',
    date: '10 May 2024',
    time: '04:45 PM',
    referenceNo: 'EXP-2024-000122',
    type: 'Expense',
    vendorOrPaidTo: 'Office Rent',
    category: 'Rent',
    amount: -8450.0,
    status: 'Paid',
  },
  {
    id: 'TXN-03',
    date: '09 May 2024',
    time: '02:30 PM',
    referenceNo: 'PO-2024-000021',
    type: 'Purchase Order',
    vendorOrPaidTo: 'Gupta Traders',
    category: 'Inventory (Footwear)',
    amount: 45000.0,
    status: 'Open',
  },
  {
    id: 'TXN-04',
    date: '08 May 2024',
    time: '12:30 PM',
    referenceNo: 'CN-2024-000012',
    type: 'Credit Note',
    vendorOrPaidTo: 'Sharma Enterprises',
    category: 'Inventory (Apparel)',
    amount: 4500.0,
    status: 'Processed',
  },
  {
    id: 'TXN-05',
    date: '07 May 2024',
    time: '05:20 PM',
    referenceNo: 'EWB-2024-000045',
    type: 'E-Way Bill',
    vendorOrPaidTo: 'Gupta Traders',
    category: 'Logistics',
    amount: 0.0,
    status: 'Generated',
  },
  {
    id: 'TXN-06',
    date: '06 May 2024',
    time: '01:15 PM',
    referenceNo: 'BILL-2024-000121',
    type: 'Purchase',
    vendorOrPaidTo: 'Verma Distributors',
    category: 'Inventory (Electronics)',
    amount: -18000.0,
    status: 'Paid',
  },
  {
    id: 'TXN-07',
    date: '05 May 2024',
    time: '03:40 PM',
    referenceNo: 'EXP-2024-000118',
    type: 'Expense',
    vendorOrPaidTo: 'Marketing Campaign',
    category: 'Marketing',
    amount: -4750.0,
    status: 'Paid',
  },
  {
    id: 'TXN-08',
    date: '04 May 2024',
    time: '10:20 AM',
    referenceNo: 'PO-2024-000019',
    type: 'Purchase Order',
    vendorOrPaidTo: 'Agarwal & Co.',
    category: 'Inventory (Accessories)',
    amount: 20000.0,
    status: 'Partially Received',
  },
];

const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-01',
    poNumber: 'PO-2024-000021',
    date: '11 May 2024',
    time: '11:24 AM',
    vendor: 'Sharma Enterprises',
    itemsCount: '5 items',
    totalAmount: 25000.0,
    expectedDate: '15 May 2024',
    status: 'Pending',
  },
  {
    id: 'PO-02',
    poNumber: 'PO-2024-000020',
    date: '10 May 2024',
    time: '04:45 PM',
    vendor: 'Gupta Traders',
    itemsCount: '12 items',
    totalAmount: 45000.0,
    expectedDate: '14 May 2024',
    status: 'Partially Received',
  },
  {
    id: 'PO-03',
    poNumber: 'PO-2024-000019',
    date: '08 May 2024',
    time: '02:30 PM',
    vendor: 'Verma Distributors',
    itemsCount: '8 items',
    totalAmount: 18000.0,
    expectedDate: '10 May 2024',
    status: 'Received',
  },
  {
    id: 'PO-04',
    poNumber: 'PO-2024-000018',
    date: '05 May 2024',
    time: '03:40 PM',
    vendor: 'Agarwal & Co.',
    itemsCount: '6 items',
    totalAmount: 20000.0,
    expectedDate: '12 May 2024',
    status: 'Pending',
  },
  {
    id: 'PO-05',
    poNumber: 'PO-2024-000017',
    date: '02 May 2024',
    time: '11:15 AM',
    vendor: 'Office Mart',
    itemsCount: '10 items',
    totalAmount: 32500.0,
    expectedDate: '08 May 2024',
    status: 'Cancelled',
  },
  {
    id: 'PO-06',
    poNumber: 'PO-2024-000016',
    date: '29 Apr 2024',
    time: '05:20 PM',
    vendor: 'Sharma Enterprises',
    itemsCount: '4 items',
    totalAmount: 12800.0,
    expectedDate: '05 May 2024',
    status: 'Received',
  },
  {
    id: 'PO-07',
    poNumber: 'PO-2024-000015',
    date: '25 Apr 2024',
    time: '03:10 PM',
    vendor: 'Fashion Supply Co.',
    itemsCount: '15 items',
    totalAmount: 56000.0,
    expectedDate: '02 May 2024',
    status: 'Pending',
  },
  {
    id: 'PO-08',
    poNumber: 'PO-2024-000014',
    date: '22 Apr 2024',
    time: '01:45 PM',
    vendor: 'Gupta Traders',
    itemsCount: '9 items',
    totalAmount: 28750.0,
    expectedDate: '28 Apr 2024',
    status: 'Partially Received',
  },
];

const initialPurchaseBills: PurchaseBill[] = [
  {
    id: 'BILL-01',
    billNumber: 'BILL-2024-000123',
    date: '11 May 2024',
    time: '11:24 AM',
    vendor: 'Sharma Enterprises',
    itemsCount: '5 items',
    totalAmount: 25000.0,
    paymentStatus: 'Paid',
    dueDate: '11 May 2024',
  },
  {
    id: 'BILL-02',
    billNumber: 'BILL-2024-000122',
    date: '10 May 2024',
    time: '04:45 PM',
    vendor: 'Gupta Traders',
    itemsCount: '12 items',
    totalAmount: 45000.0,
    paymentStatus: 'Partially Paid',
    dueDate: '12 May 2024',
  },
  {
    id: 'BILL-03',
    billNumber: 'BILL-2024-000121',
    date: '08 May 2024',
    time: '12:30 PM',
    vendor: 'Verma Distributors',
    itemsCount: '8 items',
    totalAmount: 18000.0,
    paymentStatus: 'Unpaid',
    dueDate: '15 May 2024',
  },
  {
    id: 'BILL-04',
    billNumber: 'BILL-2024-000120',
    date: '06 May 2024',
    time: '03:20 PM',
    vendor: 'Agarwal & Co.',
    itemsCount: '6 items',
    totalAmount: 20000.0,
    paymentStatus: 'Paid',
    dueDate: '06 May 2024',
  },
  {
    id: 'BILL-05',
    billNumber: 'BILL-2024-000119',
    date: '04 May 2024',
    time: '11:15 AM',
    vendor: 'Office Mart',
    itemsCount: '10 items',
    totalAmount: 32500.0,
    paymentStatus: 'Partially Paid',
    dueDate: '10 May 2024',
  },
  {
    id: 'BILL-06',
    billNumber: 'BILL-2024-000118',
    date: '02 May 2024',
    time: '05:20 PM',
    vendor: 'Khandelwal Traders',
    itemsCount: '4 items',
    totalAmount: 12800.0,
    paymentStatus: 'Unpaid',
    dueDate: '09 May 2024',
  },
  {
    id: 'BILL-07',
    billNumber: 'BILL-2024-000117',
    date: '01 May 2024',
    time: '01:10 PM',
    vendor: 'Fashion Supply Co.',
    itemsCount: '15 items',
    totalAmount: 56000.0,
    paymentStatus: 'Paid',
    dueDate: '01 May 2024',
  },
  {
    id: 'BILL-08',
    billNumber: 'BILL-2024-000116',
    date: '29 Apr 2024',
    time: '04:30 PM',
    vendor: 'Shree Balaji Traders',
    itemsCount: '9 items',
    totalAmount: 28750.0,
    paymentStatus: 'Partially Paid',
    dueDate: '05 May 2024',
  },
];

const initialExpenses: ExpenseItem[] = [
  {
    id: 'EXP-01',
    expenseNo: 'EXP-2024-00021',
    date: '11 May 2024',
    time: '11:24 AM',
    category: 'Marketing',
    description: 'Instagram Ads - May',
    amount: 5000.0,
    paymentMethod: 'UPI',
    status: 'Paid',
  },
  {
    id: 'EXP-02',
    expenseNo: 'EXP-2024-00020',
    date: '10 May 2024',
    time: '04:45 PM',
    category: 'Office Supplies',
    description: 'Stationery Purchase',
    amount: 1250.0,
    paymentMethod: 'Cash',
    status: 'Paid',
  },
  {
    id: 'EXP-03',
    expenseNo: 'EXP-2024-00019',
    date: '09 May 2024',
    time: '02:30 PM',
    category: 'Rent & Utilities',
    description: 'Shop Rent - May',
    amount: 12000.0,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
  },
  {
    id: 'EXP-04',
    expenseNo: 'EXP-2024-00018',
    date: '08 May 2024',
    time: '12:30 PM',
    category: 'Travel',
    description: 'Client Meeting - Raipur',
    amount: 1850.0,
    paymentMethod: 'UPI',
    status: 'Pending',
  },
  {
    id: 'EXP-05',
    expenseNo: 'EXP-2024-00017',
    date: '07 May 2024',
    time: '05:20 PM',
    category: 'Maintenance',
    description: 'AC Servicing',
    amount: 2500.0,
    paymentMethod: 'Cash',
    status: 'Paid',
  },
  {
    id: 'EXP-06',
    expenseNo: 'EXP-2024-00016',
    date: '06 May 2024',
    time: '01:15 PM',
    category: 'Internet & Communication',
    description: 'Jio Fiber - May',
    amount: 850.0,
    paymentMethod: 'UPI',
    status: 'Paid',
  },
  {
    id: 'EXP-07',
    expenseNo: 'EXP-2024-00015',
    date: '05 May 2024',
    time: '03:40 PM',
    category: 'Packaging',
    description: 'Carry Bags & Tags',
    amount: 2200.0,
    paymentMethod: 'Cash',
    status: 'Partially Paid',
  },
  {
    id: 'EXP-08',
    expenseNo: 'EXP-2024-00014',
    date: '04 May 2024',
    time: '10:20 AM',
    category: 'Miscellaneous',
    description: 'Other Expenses',
    amount: 800.0,
    paymentMethod: 'UPI',
    status: 'Paid',
  },
];

const initialCreditNotes: CreditNoteItem[] = [
  {
    id: 'CN-01',
    creditNoteNo: 'CN-2024-000013',
    date: '11 May 2024',
    time: '11:24 AM',
    referencePurchase: 'BILL-2024-000123',
    vendor: 'Sharma Enterprises',
    reasonType: 'Purchase Return',
    amount: -25000.0,
    status: 'Pending',
  },
  {
    id: 'CN-02',
    creditNoteNo: 'CN-2024-000012',
    date: '08 May 2024',
    time: '12:30 PM',
    referencePurchase: 'BILL-2024-000118',
    vendor: 'Gupta Traders',
    reasonType: 'Damaged Goods',
    amount: -8450.0,
    status: 'Processed',
  },
  {
    id: 'CN-03',
    creditNoteNo: 'CN-2024-000011',
    date: '05 May 2024',
    time: '03:40 PM',
    referencePurchase: 'BILL-2024-000102',
    vendor: 'Verma Distributors',
    reasonType: 'Price Adjustment',
    amount: -4500.0,
    status: 'Processed',
  },
  {
    id: 'CN-04',
    creditNoteNo: 'CN-2024-000010',
    date: '02 May 2024',
    time: '11:15 AM',
    referencePurchase: 'BILL-2024-000098',
    vendor: 'Agarwal & Co.',
    reasonType: 'Purchase Return',
    amount: -12000.0,
    status: 'Pending',
  },
  {
    id: 'CN-05',
    creditNoteNo: 'CN-2024-000009',
    date: '28 Apr 2024',
    time: '05:20 PM',
    referencePurchase: 'BILL-2024-000097',
    vendor: 'Office Mart',
    reasonType: 'Wrong Item',
    amount: -3250.0,
    status: 'Processed',
  },
  {
    id: 'CN-06',
    creditNoteNo: 'CN-2024-000008',
    date: '25 Apr 2024',
    time: '03:10 PM',
    referencePurchase: 'BILL-2024-000089',
    vendor: 'Sharma Enterprises',
    reasonType: 'Quality Issue',
    amount: -1200.0,
    status: 'Cancelled',
  },
  {
    id: 'CN-07',
    creditNoteNo: 'CN-2024-000007',
    date: '20 Apr 2024',
    time: '01:45 PM',
    referencePurchase: 'BILL-2024-000081',
    vendor: 'Fashion Supply Co.',
    reasonType: 'Purchase Return',
    amount: -6500.0,
    status: 'Processed',
  },
  {
    id: 'CN-08',
    creditNoteNo: 'CN-2024-000006',
    date: '15 Apr 2024',
    time: '10:20 AM',
    referencePurchase: 'BILL-2024-000075',
    vendor: 'Gupta Traders',
    reasonType: 'Price Adjustment',
    amount: -2800.0,
    status: 'Pending',
  },
];

const initialEwayBills: EWayBillItem[] = [
  {
    id: 'EWB-01',
    eWayBillNo: '1417 8965 4321',
    date: '11 May 2024',
    time: '11:24 AM',
    invoiceBillNo: 'BILL-2024-000123',
    vendor: 'Sharma Enterprises',
    fromTo: 'Raipur → Bhilai',
    distanceKm: 45,
    validTill: '18 May 2024',
    status: 'Active',
  },
  {
    id: 'EWB-02',
    eWayBillNo: '1417 8965 4320',
    date: '10 May 2024',
    time: '04:45 PM',
    invoiceBillNo: 'BILL-2024-000118',
    vendor: 'Gupta Traders',
    fromTo: 'Delhi → Raipur',
    distanceKm: 1100,
    validTill: '14 May 2024',
    status: 'In Transit',
  },
  {
    id: 'EWB-03',
    eWayBillNo: '1417 8965 4319',
    date: '08 May 2024',
    time: '02:30 PM',
    invoiceBillNo: 'BILL-2024-000102',
    vendor: 'Verma Distributors',
    fromTo: 'Mumbai → Durg',
    distanceKm: 920,
    validTill: '12 May 2024',
    status: 'Active',
  },
  {
    id: 'EWB-04',
    eWayBillNo: '1417 8965 4318',
    date: '06 May 2024',
    time: '12:30 PM',
    invoiceBillNo: 'BILL-2024-000098',
    vendor: 'Agarwal & Co.',
    fromTo: 'Indore → Raipur',
    distanceKm: 820,
    validTill: '09 May 2024',
    status: 'Expired',
  },
  {
    id: 'EWB-05',
    eWayBillNo: '1417 8965 4317',
    date: '04 May 2024',
    time: '11:15 AM',
    invoiceBillNo: 'BILL-2024-000089',
    vendor: 'Office Mart',
    fromTo: 'Pune → Bhilai',
    distanceKm: 1030,
    validTill: '08 May 2024',
    status: 'Active',
  },
  {
    id: 'EWB-06',
    eWayBillNo: '1417 8965 4316',
    date: '02 May 2024',
    time: '05:20 PM',
    invoiceBillNo: 'BILL-2024-000081',
    vendor: 'Khandelwal Traders',
    fromTo: 'Nagpur → Raipur',
    distanceKm: 440,
    validTill: '06 May 2024',
    status: 'In Transit',
  },
  {
    id: 'EWB-07',
    eWayBillNo: '1417 8965 4315',
    date: '30 Apr 2024',
    time: '01:10 PM',
    invoiceBillNo: 'BILL-2024-000075',
    vendor: 'Fashion Supply Co.',
    fromTo: 'Surat → Durg',
    distanceKm: 1240,
    validTill: '04 May 2024',
    status: 'Active',
  },
  {
    id: 'EWB-08',
    eWayBillNo: '1417 8965 4314',
    date: '28 Apr 2024',
    time: '04:30 PM',
    invoiceBillNo: 'BILL-2024-000068',
    vendor: 'Shree Balaji Traders',
    fromTo: 'Bengaluru → Raipur',
    distanceKm: 1420,
    validTill: '02 May 2024',
    status: 'Cancelled',
  },
];

const initialVendors: Vendor[] = [
  {
    "id": "VND-01",
    "vendorCode": "VND-001",
    "vendorName": "Sharma Enterprises",
    "contactPerson": "Rajesh Sharma",
    "phone": "98765 43210",
    "email": "rajesh@sharmaent.com",
    "city": "Raipur",
    "totalPurchases": 125000,
    "status": "Active",
    "gstin": "22ABCDE1234F1Z5",
    "pan": "ABCDE1234F",
    "category": "Inventory (Apparel)",
    "paymentTerms": "Net 30",
    "creditLimit": 200000,
    "openingBalance": 15000,
    "address": "Plot No. 12, Industrial Area, Ring Road No. 2, Raipur",
    "pincode": "492001"
  },
  {
    "id": "VND-02",
    "vendorCode": "VND-002",
    "vendorName": "Gupta Traders",
    "contactPerson": "Amit Gupta",
    "phone": "98261 12345",
    "email": "amit@guptatraders.in",
    "city": "Durg",
    "totalPurchases": 98450,
    "status": "Active",
    "gstin": "22FGHIJ5678K1Z9",
    "pan": "FGHIJ5678K",
    "category": "Inventory (Footwear)",
    "paymentTerms": "Net 15",
    "creditLimit": 150000,
    "openingBalance": 0,
    "address": "Shop No. 4, G.E. Road, Power House, Durg",
    "pincode": "491001"
  },
  {
    "id": "VND-03",
    "vendorCode": "VND-003",
    "vendorName": "Verma Distributors",
    "contactPerson": "Suresh Verma",
    "phone": "97531 67890",
    "email": "suresh@vermadist.com",
    "city": "Bhilai",
    "totalPurchases": 76200,
    "status": "Active",
    "gstin": "22KLMNO9012P1Z3",
    "pan": "KLMNO9012P",
    "category": "Inventory (Electronics)",
    "paymentTerms": "Due on Receipt",
    "creditLimit": 100000,
    "openingBalance": 5000,
    "address": "Sector 6 Commercial Complex, Bhilai",
    "pincode": "490006"
  },
  {
    "id": "VND-04",
    "vendorCode": "VND-004",
    "vendorName": "Agarwal & Co.",
    "contactPerson": "Neeraj Agarwal",
    "phone": "93012 34567",
    "email": "neeraj@agarwalco.in",
    "city": "Raipur",
    "totalPurchases": 62500,
    "status": "Active",
    "gstin": "22PQRST3456U1Z7",
    "pan": "PQRST3456U",
    "category": "Inventory (Accessories)",
    "paymentTerms": "Net 30",
    "creditLimit": 120000,
    "openingBalance": 0,
    "address": "Gol Bazar Wholesale Market, Raipur",
    "pincode": "492001"
  },
  {
    "id": "VND-05",
    "vendorCode": "VND-005",
    "vendorName": "Office Mart",
    "contactPerson": "Pankaj Jain",
    "phone": "90987 65432",
    "email": "pankaj@officemart.in",
    "city": "Durg",
    "totalPurchases": 48300,
    "status": "Inactive",
    "gstin": "22UVWXY7890Z1Z1",
    "pan": "UVWXY7890Z",
    "category": "Office Supplies",
    "paymentTerms": "Net 15",
    "creditLimit": 50000,
    "openingBalance": 1200,
    "address": "Station Road, Durg",
    "pincode": "491001"
  },
  {
    "id": "VND-06",
    "vendorCode": "VND-006",
    "vendorName": "Khandelwal Traders",
    "contactPerson": "Mahesh Khandelwal",
    "phone": "88855 11223",
    "email": "mahesh@khandelwal.in",
    "city": "Bhilai",
    "totalPurchases": 38750,
    "status": "Active",
    "gstin": "22AAAAA0000A1Z5",
    "pan": "AAAAA0000A",
    "category": "Packaging",
    "paymentTerms": "Net 30",
    "creditLimit": 80000,
    "openingBalance": 0,
    "address": "Light Industrial Area, Supela, Bhilai",
    "pincode": "490023"
  },
  {
    "id": "VND-07",
    "vendorCode": "VND-007",
    "vendorName": "Fashion Supply Co.",
    "contactPerson": "Vikram Singh",
    "phone": "77766 33445",
    "email": "vikram@fashionsupply.in",
    "city": "Raipur",
    "totalPurchases": 29600,
    "status": "Active",
    "gstin": "22BBBBB1111B1Z6",
    "pan": "BBBBB1111B",
    "category": "Inventory (Apparel)",
    "paymentTerms": "Due on Receipt",
    "creditLimit": 60000,
    "openingBalance": 3500,
    "address": "Pandri Cloth Market, Raipur",
    "pincode": "492004"
  },
  {
    "id": "VND-08",
    "vendorCode": "VND-008",
    "vendorName": "Shree Balaji Traders",
    "contactPerson": "Manoj Sahu",
    "phone": "76655 22110",
    "email": "manoj@balajitraders.in",
    "city": "Durg",
    "totalPurchases": 22400,
    "status": "Blocked",
    "gstin": "22CCCCC2222C1Z7",
    "pan": "CCCCC2222C",
    "category": "Hardware & Maintenance",
    "paymentTerms": "Immediate",
    "creditLimit": 0,
    "openingBalance": 8400,
    "address": "Indira Market, Durg",
    "pincode": "491001"
  },
  {
    "id": "VND-09",
    "vendorCode": "VND-009",
    "vendorName": "Central Logistics Corp",
    "contactPerson": "Ravi Teja",
    "phone": "98271 88776",
    "email": "ravi@centrallogistics.com",
    "city": "Raipur",
    "totalPurchases": 54200,
    "status": "Active",
    "gstin": "22DDDDD3333D1Z8",
    "pan": "DDDDD3333D",
    "category": "Logistics",
    "paymentTerms": "Net 15",
    "creditLimit": 100000,
    "openingBalance": 0,
    "address": "Transport Nagar, Tatibandh, Raipur",
    "pincode": "492099"
  },
  {
    "id": "VND-10",
    "vendorCode": "VND-010",
    "vendorName": "Apex Poly Packs",
    "contactPerson": "Sunita Dewangan",
    "phone": "94252 44332",
    "email": "sunita@apexpacks.in",
    "city": "Bhilai",
    "totalPurchases": 18500,
    "status": "Active",
    "gstin": "22EEEEE4444E1Z9",
    "pan": "EEEEE4444E",
    "category": "Packaging",
    "paymentTerms": "Net 30",
    "creditLimit": 40000,
    "openingBalance": 0,
    "address": "Hathkhoj Industrial Area, Bhilai",
    "pincode": "490026"
  },
  {
    "id": "VND-11",
    "vendorCode": "VND-011",
    "vendorName": "Chhajed Fabrics",
    "contactPerson": "Paras Chhajed",
    "phone": "98279 11234",
    "email": "paras@chhajedfabrics.com",
    "city": "Raipur",
    "totalPurchases": 89400,
    "status": "Active",
    "gstin": "22FFFFF5555F1Z0",
    "pan": "FFFFF5555F",
    "category": "Inventory (Apparel)",
    "paymentTerms": "Net 30",
    "creditLimit": 150000,
    "openingBalance": 12000,
    "address": "Malviya Road, Raipur",
    "pincode": "492001"
  },
  {
    "id": "VND-12",
    "vendorCode": "VND-012",
    "vendorName": "National Footwear Depot",
    "contactPerson": "Irfan Khan",
    "phone": "93001 99887",
    "email": "irfan@nationalfootwear.in",
    "city": "Durg",
    "totalPurchases": 43100,
    "status": "Active",
    "gstin": "22GGGGG6666G1Z1",
    "pan": "GGGGG6666G",
    "category": "Inventory (Footwear)",
    "paymentTerms": "Net 15",
    "creditLimit": 75000,
    "openingBalance": 0,
    "address": "Bus Stand Road, Durg",
    "pincode": "491001"
  },
  {
    "id": "VND-13",
    "vendorCode": "VND-013",
    "vendorName": "Vardhaman Stationery",
    "contactPerson": "Ritesh Vardhaman",
    "phone": "94060 22334",
    "email": "ritesh@vardhamanstat.com",
    "city": "Bhilai",
    "totalPurchases": 15600,
    "status": "Active",
    "gstin": "22HHHHH7777H1Z2",
    "pan": "HHHHH7777H",
    "category": "Office Supplies",
    "paymentTerms": "Due on Receipt",
    "creditLimit": 25000,
    "openingBalance": 0,
    "address": "Civic Centre, Shop 18, Bhilai",
    "pincode": "490006"
  },
  {
    "id": "VND-14",
    "vendorCode": "VND-014",
    "vendorName": "Modern Furnishings",
    "contactPerson": "Anand Swamy",
    "phone": "98266 55443",
    "email": "anand@modernfurnishings.in",
    "city": "Raipur",
    "totalPurchases": 32000,
    "status": "Inactive",
    "gstin": "22IIIII8888I1Z3",
    "pan": "IIIII8888I",
    "category": "Hardware & Maintenance",
    "paymentTerms": "Net 30",
    "creditLimit": 50000,
    "openingBalance": 0,
    "address": "VIP Road, Raipur",
    "pincode": "492015"
  },
  {
    "id": "VND-15",
    "vendorCode": "VND-015",
    "vendorName": "Speedy Express Couriers",
    "contactPerson": "Deepak Rao",
    "phone": "97520 88990",
    "email": "deepak@speedycouriers.in",
    "city": "Bhilai",
    "totalPurchases": 27800,
    "status": "Active",
    "gstin": "22JJJJJ9999J1Z4",
    "pan": "JJJJJ9999J",
    "category": "Logistics",
    "paymentTerms": "Net 15",
    "creditLimit": 50000,
    "openingBalance": 1500,
    "address": "Supela Chowk, Bhilai",
    "pincode": "490023"
  },
  {
    "id": "VND-16",
    "vendorCode": "VND-016",
    "vendorName": "Bhilai Print & Sign",
    "contactPerson": "Santosh Yadav",
    "phone": "93025 66778",
    "email": "santosh@bhilaiprint.com",
    "city": "Bhilai",
    "totalPurchases": 19400,
    "status": "Active",
    "gstin": "22KKKKK0000K1Z5",
    "pan": "KKKKK0000K",
    "category": "Marketing",
    "paymentTerms": "Due on Receipt",
    "creditLimit": 30000,
    "openingBalance": 0,
    "address": "Nehru Nagar East, Bhilai",
    "pincode": "490020"
  },
  {
    "id": "VND-17",
    "vendorCode": "VND-017",
    "vendorName": "Kalyan Jewellers & Accessories",
    "contactPerson": "Kalyan B.",
    "phone": "98270 33445",
    "email": "kalyan@kalyanacc.com",
    "city": "Durg",
    "totalPurchases": 64200,
    "status": "Active",
    "gstin": "22LLLLL1111L1Z6",
    "pan": "LLLLL1111L",
    "category": "Inventory (Accessories)",
    "paymentTerms": "Net 30",
    "creditLimit": 120000,
    "openingBalance": 5000,
    "address": "Main Road, Durg",
    "pincode": "491001"
  },
  {
    "id": "VND-18",
    "vendorCode": "VND-018",
    "vendorName": "Krishna Electricals",
    "contactPerson": "Gopal Soni",
    "phone": "94255 12340",
    "email": "gopal@krishnaelect.in",
    "city": "Raipur",
    "totalPurchases": 18900,
    "status": "Active",
    "gstin": "22MMMMM2222M1Z7",
    "pan": "MMMMM2222M",
    "category": "Hardware & Maintenance",
    "paymentTerms": "Net 15",
    "creditLimit": 40000,
    "openingBalance": 0,
    "address": "Ramsagar Para, Raipur",
    "pincode": "492001"
  },
  {
    "id": "VND-19",
    "vendorCode": "VND-019",
    "vendorName": "Mahamaya Textile Mills",
    "contactPerson": "Dinesh Agrawal",
    "phone": "98263 77889",
    "email": "dinesh@mahamayatextile.com",
    "city": "Raipur",
    "totalPurchases": 112000,
    "status": "Active",
    "gstin": "22NNNNN3333N1Z8",
    "pan": "NNNNN3333N",
    "category": "Inventory (Apparel)",
    "paymentTerms": "Net 45",
    "creditLimit": 250000,
    "openingBalance": 24000,
    "address": "Urla Industrial Area, Raipur",
    "pincode": "492003"
  },
  {
    "id": "VND-20",
    "vendorCode": "VND-020",
    "vendorName": "City Carton Manufacturers",
    "contactPerson": "Mohan Lal",
    "phone": "93010 44556",
    "email": "mohan@citycartons.in",
    "city": "Durg",
    "totalPurchases": 21300,
    "status": "Active",
    "gstin": "22OOOOO4444O1Z9",
    "pan": "OOOOO4444O",
    "category": "Packaging",
    "paymentTerms": "Net 30",
    "creditLimit": 50000,
    "openingBalance": 0,
    "address": "Borsi Extension, Durg",
    "pincode": "491001"
  },
  {
    "id": "VND-21",
    "vendorCode": "VND-021",
    "vendorName": "Surya Safety & Security",
    "contactPerson": "Surya Narayanan",
    "phone": "98275 66778",
    "email": "surya@suryasafety.in",
    "city": "Bhilai",
    "totalPurchases": 14750,
    "status": "Active",
    "gstin": "22PPPPP5555P1Z0",
    "pan": "PPPPP5555P",
    "category": "Hardware & Maintenance",
    "paymentTerms": "Due on Receipt",
    "creditLimit": 30000,
    "openingBalance": 0,
    "address": "Sector 1 Market, Bhilai",
    "pincode": "490001"
  },
  {
    "id": "VND-22",
    "vendorCode": "VND-022",
    "vendorName": "Premier Packaging Solutions",
    "contactPerson": "Kamal Joshi",
    "phone": "94242 88991",
    "email": "kamal@premierpackaging.com",
    "city": "Raipur",
    "totalPurchases": 9800,
    "status": "Inactive",
    "gstin": "22QQQQQ6666Q1Z1",
    "pan": "QQQQQ6666Q",
    "category": "Packaging",
    "paymentTerms": "Net 15",
    "creditLimit": 25000,
    "openingBalance": 0,
    "address": "Bhanpuri, Raipur",
    "pincode": "492003"
  },
  {
    "id": "VND-23",
    "vendorCode": "VND-023",
    "vendorName": "Chhattisgarh Bag House",
    "contactPerson": "Hemant Sahu",
    "phone": "93005 12345",
    "email": "hemant@cgbaghouse.in",
    "city": "Durg",
    "totalPurchases": 34500,
    "status": "Active",
    "gstin": "22RRRRR7777R1Z2",
    "pan": "RRRRR7777R",
    "category": "Inventory (Accessories)",
    "paymentTerms": "Net 30",
    "creditLimit": 60000,
    "openingBalance": 2000,
    "address": "Gandhi Chowk, Durg",
    "pincode": "491001"
  },
  {
    "id": "VND-24",
    "vendorCode": "VND-024",
    "vendorName": "Royal Threads Garments",
    "contactPerson": "Alok Roy",
    "phone": "98268 99001",
    "email": "alok@royalthreads.com",
    "city": "Raipur",
    "totalPurchases": 78900,
    "status": "Active",
    "gstin": "22SSSSS8888S1Z3",
    "pan": "SSSSS8888S",
    "category": "Inventory (Apparel)",
    "paymentTerms": "Net 30",
    "creditLimit": 150000,
    "openingBalance": 11000,
    "address": "Devendra Nagar, Raipur",
    "pincode": "492004"
  },
  {
    "id": "VND-25",
    "vendorCode": "VND-025",
    "vendorName": "Durg Clean & Hygiene",
    "contactPerson": "Brijesh Sharma",
    "phone": "97541 23456",
    "email": "brijesh@durgclean.in",
    "city": "Durg",
    "totalPurchases": 12400,
    "status": "Active",
    "gstin": "22TTTTT9999T1Z4",
    "pan": "TTTTT9999T",
    "category": "Office Supplies",
    "paymentTerms": "Due on Receipt",
    "creditLimit": 20000,
    "openingBalance": 0,
    "address": "Kasaridih, Durg",
    "pincode": "491001"
  },
  {
    "id": "VND-26",
    "vendorCode": "VND-026",
    "vendorName": "Bhilai Steel Fixtures",
    "contactPerson": "Nitin Patel",
    "phone": "94079 87654",
    "email": "nitin@bhilaifixtures.com",
    "city": "Bhilai",
    "totalPurchases": 46700,
    "status": "Active",
    "gstin": "22UUUUU0000U1Z5",
    "pan": "UUUUU0000U",
    "category": "Hardware & Maintenance",
    "paymentTerms": "Net 30",
    "creditLimit": 80000,
    "openingBalance": 0,
    "address": "Industrial Area, Nandini Road, Bhilai",
    "pincode": "490011"
  },
  {
    "id": "VND-27",
    "vendorCode": "VND-027",
    "vendorName": "QuickStep Logistics",
    "contactPerson": "Pradeep Verma",
    "phone": "98273 45678",
    "email": "pradeep@quickstep.in",
    "city": "Raipur",
    "totalPurchases": 31200,
    "status": "Active",
    "gstin": "22VVVVV1111V1Z6",
    "pan": "VVVVV1111V",
    "category": "Logistics",
    "paymentTerms": "Net 15",
    "creditLimit": 50000,
    "openingBalance": 0,
    "address": "Bhatagaon, Raipur",
    "pincode": "492013"
  },
  {
    "id": "VND-28",
    "vendorCode": "VND-028",
    "vendorName": "Krupa Footwear Works",
    "contactPerson": "Krupa Shankar",
    "phone": "93033 67890",
    "email": "krupa@krupafootwear.in",
    "city": "Bhilai",
    "totalPurchases": 51800,
    "status": "Active",
    "gstin": "22WWWWW2222W1Z7",
    "pan": "WWWWW2222W",
    "category": "Inventory (Footwear)",
    "paymentTerms": "Net 30",
    "creditLimit": 90000,
    "openingBalance": 4200,
    "address": "Power House Market, Bhilai",
    "pincode": "490011"
  }
];

export const useExpenseStore = create<PurchaseExpenseState>((set, get) => ({
  activeSubTab: 'all',
  setActiveSubTab: (activeSubTab) => set({ activeSubTab }),

  isLoading: false,
  isSubmitting: false,
  error: null,

  overviewKPIs: {
    totalPurchase: 185600.0,
    totalExpense: 28450.0,
    totalCreditNote: 12450.0,
    openPurchaseOrders: 65000.0,
    openPOCount: 3,
    eWayBillsCount: 12,
  },

  allTransactions: initialTransactions,
  purchaseOrders: initialPurchaseOrders,
  purchaseBills: initialPurchaseBills,
  expenses: initialExpenses,
  creditNotes: initialCreditNotes,
  ewayBills: initialEwayBills,
  vendors: initialVendors,

  searchQuery: '',
  dateRange: '01 May 2024 - 31 May 2024',
  typeFilter: 'All Types',
  categoryFilter: 'All Categories',
  statusFilter: 'All Statuses',
  vendorFilter: 'All Vendors',
  cityFilter: 'All Cities',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setDateRange: (dateRange) => set({ dateRange }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setVendorFilter: (vendorFilter) => set({ vendorFilter }),
  setCityFilter: (cityFilter) => set({ cityFilter }),
  clearFilters: () =>
    set({
      searchQuery: '',
      dateRange: '01 May 2024 - 31 May 2024',
      typeFilter: 'All Types',
      categoryFilter: 'All Categories',
      statusFilter: 'All Statuses',
      vendorFilter: 'All Vendors',
      cityFilter: 'All Cities',
    }),

  selectedPurchase: null,
  setSelectedPurchase: (selectedPurchase) => set({ selectedPurchase }),

  selectedVendor: null,
  setSelectedVendor: (selectedVendor) => set({ selectedVendor }),

  isEditPurchaseOpen: false,
  setIsEditPurchaseOpen: (isEditPurchaseOpen) => set({ isEditPurchaseOpen }),

  isCreateCreditNoteOpen: false,
  setIsCreateCreditNoteOpen: (isCreateCreditNoteOpen) => set({ isCreateCreditNoteOpen }),

  isAddVendorOpen: false,
  setIsAddVendorOpen: (isAddVendorOpen) => set({ isAddVendorOpen }),

  isGenerateEWayBillOpen: false,
  setIsGenerateEWayBillOpen: (isGenerateEWayBillOpen) => set({ isGenerateEWayBillOpen }),

  isCreatePOModalOpen: false,
  setIsCreatePOModalOpen: (isCreatePOModalOpen) => set({ isCreatePOModalOpen }),

  isCreateBillModalOpen: false,
  setIsCreateBillModalOpen: (isCreateBillModalOpen) => set({ isCreateBillModalOpen }),

  isCreateReturnModalOpen: false,
  setIsCreateReturnModalOpen: (isCreateReturnModalOpen) => set({ isCreateReturnModalOpen }),

  isCreateDirectPurchaseOpen: false,
  setIsCreateDirectPurchaseOpen: (isCreateDirectPurchaseOpen) =>
    set({ isCreateDirectPurchaseOpen }),

  isAddExpenseModalOpen: false,
  setIsAddExpenseModalOpen: (isAddExpenseModalOpen) => set({ isAddExpenseModalOpen }),

  isImportModalOpen: false,
  importType: null,

  openAddVendor: (vendor) => set({ isAddVendorOpen: true, selectedVendor: vendor || null }),
  closeAddVendor: () => set({ isAddVendorOpen: false, selectedVendor: null }),

  openImportModal: (type) => set({ isImportModalOpen: true, importType: type }),
  closeImportModal: () => set({ isImportModalOpen: false, importType: null }),

  saveVendor: (vendorData) =>
    set((state) => {
      if (vendorData.id && state.vendors.some((v) => v.id === vendorData.id)) {
        return {
          vendors: state.vendors.map((v) =>
            v.id === vendorData.id ? ({ ...v, ...vendorData } as Vendor) : v
          ),
          isAddVendorOpen: false,
          selectedVendor: null,
        };
      }
      const nextCode = `VND-${String(state.vendors.length + 1).padStart(3, '0')}`;
      const newVendor: Vendor = {
        id: vendorData.id || `VND-${Date.now()}`,
        vendorCode: vendorData.vendorCode || nextCode,
        vendorName: vendorData.vendorName || 'New Vendor',
        contactPerson: vendorData.contactPerson || '',
        phone: vendorData.phone || '',
        email: vendorData.email || '',
        city: vendorData.city || 'Bhilai',
        totalPurchases: Number(vendorData.totalPurchases || 0),
        status: vendorData.status || 'Active',
        gstin: vendorData.gstin || '',
        pan: vendorData.pan || '',
        category: vendorData.category || 'Inventory (Apparel)',
        paymentTerms: vendorData.paymentTerms || 'Due on Receipt',
        creditLimit: Number(vendorData.creditLimit || 0),
        openingBalance: Number(vendorData.openingBalance || 0),
        address: vendorData.address || '',
        pincode: vendorData.pincode || '',
        notes: vendorData.notes || '',
      };
      return {
        vendors: [newVendor, ...state.vendors],
        isAddVendorOpen: false,
        selectedVendor: null,
      };
    }),

  deleteVendor: (id) =>
    set((state) => ({
      vendors: state.vendors.filter((v) => v.id !== id),
    })),

  exportVendorsCsv: () => {
    const state = useExpenseStore.getState();
    const headers = [
      'Vendor Code',
      'Vendor Name',
      'Contact Person',
      'Phone',
      'Email',
      'City',
      'Category',
      'GSTIN',
      'Payment Terms',
      'Total Purchases (INR)',
      'Status',
    ];
    const rows = state.vendors.map((v) => [
      v.vendorCode,
      v.vendorName,
      v.contactPerson,
      v.phone,
      v.email,
      v.city,
      v.category,
      v.gstin || '',
      v.paymentTerms,
      v.totalPurchases,
      v.status,
    ]);
    downloadCSV('vendors_directory.csv', headers, rows);
  },

  exportProcurementReportCsv: () => {
    const state = useExpenseStore.getState();
    const headers = [
      'Reference No',
      'Date',
      'Type',
      'Vendor / Paid To',
      'Category',
      'Amount (INR)',
      'Status',
    ];
    const rows = state.allTransactions.map((t) => [
      t.referenceNo,
      `${t.date} ${t.time}`,
      t.type,
      t.vendorOrPaidTo,
      t.category,
      t.amount,
      t.status,
    ]);
    downloadCSV('procurement_expenses_report.csv', headers, rows);
  },

  importCsvData: (type, rows) => {
    set((state) => {
      if (type === 'vendors') {
        const imported: Vendor[] = rows.map((r, idx) => ({
          id: `VND-IMP-${Date.now()}-${idx}`,
          vendorCode:
            r.vendorCode ||
            r['Vendor Code'] ||
            `VND-${String(state.vendors.length + idx + 1).padStart(3, '0')}`,
          vendorName: r.vendorName || r['Vendor Name'] || 'Imported Vendor',
          contactPerson: r.contactPerson || r['Contact Person'] || '',
          phone: r.phone || r['Phone'] || '',
          email: r.email || r['Email'] || '',
          city: r.city || r['City'] || 'Bhilai',
          totalPurchases: Number(r.totalPurchases || r['Total Purchases'] || 0),
          status: (r.status || r['Status'] || 'Active') as any,
          gstin: r.gstin || r['GSTIN'] || '',
          pan: r.pan || r['PAN'] || '',
          category: r.category || r['Category'] || 'General',
          paymentTerms: r.paymentTerms || r['Payment Terms'] || 'Due on Receipt',
          creditLimit: Number(r.creditLimit || 0),
          openingBalance: Number(r.openingBalance || 0),
        }));
        return {
          vendors: [...imported, ...state.vendors],
          isImportModalOpen: false,
          importType: null,
        };
      }
      if (type === 'purchases') {
        const imported: PurchaseTransaction[] = rows.map((r, idx) => ({
          id: `TXN-IMP-${Date.now()}-${idx}`,
          date: r.date || r['Date'] || '11 May 2024',
          time: '12:00 PM',
          referenceNo:
            r.referenceNo ||
            r['Reference No'] ||
            `BILL-2024-${Math.floor(100000 + Math.random() * 900000)}`,
          type: 'Purchase',
          vendorOrPaidTo: r.vendor || r['Vendor'] || 'Vendor',
          category: r.category || r['Category'] || 'Inventory (Apparel)',
          amount: -Math.abs(Number(r.amount || r['Amount'] || 1000)),
          status: 'Paid',
        }));
        return {
          allTransactions: [...imported, ...state.allTransactions],
          isImportModalOpen: false,
          importType: null,
        };
      }
      if (type === 'expenses') {
        const imported: ExpenseItem[] = rows.map((r, idx) => ({
          id: `EXP-IMP-${Date.now()}-${idx}`,
          expenseNo:
            r.referenceNo ||
            r['Reference No'] ||
            `EXP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
          date: r.date || r['Date'] || '11 May 2024',
          time: '12:00 PM',
          category: r.category || r['Category'] || 'General',
          description: r.description || r['Description'] || 'Business Expense',
          amount: Number(r.amount || r['Amount'] || 500),
          paymentMethod: r.paymentMethod || r['Payment Method'] || 'Cash',
          status: 'Paid',
        }));
        return {
          expenses: [...imported, ...state.expenses],
          isImportModalOpen: false,
          importType: null,
        };
      }
      return { isImportModalOpen: false, importType: null };
    });
  },

  addEWayBill: (bill) =>
    set((state) => ({
      ewayBills: [bill, ...state.ewayBills],
      isGenerateEWayBillOpen: false,
    })),

  viewMode: 'list',
  setViewMode: (viewMode) => set({ viewMode }),

  fetchExpenseData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [kpis, txns, exps, vnds, prchs, cns, ewbs] = await Promise.allSettled([
        expensesApi.getOverview(),
        expensesApi.getAllTransactions(),
        expensesApi.getExpenses(),
        expensesApi.getVendors(),
        expensesApi.getPurchases(),
        expensesApi.getCreditNotes(),
        expensesApi.getEWayBills(),
      ]);

      const updates: Partial<PurchaseExpenseState> = { isLoading: false };

      if (kpis.status === 'fulfilled' && kpis.value && kpis.value.totalPurchase !== undefined) {
        if (kpis.value.totalPurchase > 0 || kpis.value.totalExpense > 0) {
          updates.overviewKPIs = kpis.value;
        }
      }

      if (txns.status === 'fulfilled' && Array.isArray(txns.value) && txns.value.length > 0) {
        updates.allTransactions = txns.value;
      }

      if (exps.status === 'fulfilled' && Array.isArray(exps.value) && exps.value.length > 0) {
        updates.expenses = exps.value.map((e: any) => ({
          id: e._id || e.id,
          expenseNo: e.expenseNo,
          date: e.date,
          time: e.time,
          category: e.category,
          description: e.description,
          amount: e.amount,
          paymentMethod: e.paymentMethod,
          status: e.status,
        }));
      }

      if (vnds.status === 'fulfilled' && Array.isArray(vnds.value) && vnds.value.length > 0) {
        updates.vendors = vnds.value.map((v: any) => ({
          id: v._id || v.id,
          vendorCode: v.vendorCode,
          vendorName: v.vendorName,
          contactPerson: v.contactPerson,
          phone: v.phone,
          email: v.email,
          city: v.city,
          totalPurchases: v.totalPurchases || 0,
          status: v.status || 'Active',
          category: v.category || 'General',
          paymentTerms: v.paymentTerms || 'Due on Receipt',
          creditLimit: v.creditLimit || 0,
          openingBalance: v.openingBalance || 0,
        }));
      }

      if (prchs.status === 'fulfilled' && Array.isArray(prchs.value) && prchs.value.length > 0) {
        updates.purchaseBills = prchs.value
          .filter((p: any) => p.type !== 'Purchase Order')
          .map((p: any) => ({
            id: p._id || p.id,
            billNumber: p.billNumber,
            date: p.date,
            time: p.time,
            vendor: p.vendor,
            itemsCount: p.itemsCount || '1 item',
            totalAmount: p.totalAmount,
            paymentStatus: p.paymentStatus,
            dueDate: p.dueDate || '',
          }));

        updates.purchaseOrders = prchs.value
          .filter((p: any) => p.type === 'Purchase Order')
          .map((p: any) => ({
            id: p._id || p.id,
            poNumber: p.billNumber,
            date: p.date,
            time: p.time,
            vendor: p.vendor,
            itemsCount: p.itemsCount || '1 item',
            totalAmount: p.totalAmount,
            expectedDate: p.dueDate || '',
            status: p.paymentStatus === 'Paid' ? 'Received' : 'Pending',
          }));
      }

      if (cns.status === 'fulfilled' && Array.isArray(cns.value) && cns.value.length > 0) {
        updates.creditNotes = cns.value.map((c: any) => ({
          id: c._id || c.id,
          creditNoteNo: c.creditNoteNo,
          date: c.date,
          time: c.time,
          referencePurchase: c.referencePurchase,
          vendor: c.vendor,
          reasonType: c.reasonType,
          amount: c.amount,
          status: c.status,
        }));
      }

      if (ewbs.status === 'fulfilled' && Array.isArray(ewbs.value) && ewbs.value.length > 0) {
        updates.ewayBills = ewbs.value.map((ew: any) => ({
          id: ew._id || ew.id,
          eWayBillNo: ew.eWayBillNo,
          date: ew.date,
          time: ew.time,
          invoiceBillNo: ew.invoiceBillNo,
          vendor: ew.vendor,
          fromTo: ew.fromTo,
          distanceKm: ew.distanceKm,
          validTill: ew.validTill,
          status: ew.status,
        }));
      }

      set(updates);
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to load expense data' });
    }
  },

  createExpenseRecord: async (data: any) => {
    set({ isSubmitting: true });
    try {
      await expensesApi.createExpense(data);
      await get().fetchExpenseData();
      set({ isSubmitting: false, isAddExpenseModalOpen: false, viewMode: 'list' });
      return true;
    } catch (err: any) {
      console.error('Failed to create expense:', err);
      get().addExpense(data);
      set({ isSubmitting: false, isAddExpenseModalOpen: false, viewMode: 'list' });
      return true;
    }
  },

  createVendorRecord: async (data: any) => {
    set({ isSubmitting: true });
    try {
      await expensesApi.createVendor(data);
      await get().fetchExpenseData();
      set({ isSubmitting: false, isAddVendorOpen: false });
      return true;
    } catch (err: any) {
      console.error('Failed to create vendor:', err);
      set((state) => ({
        vendors: [
          {
            id: `VND-${Date.now()}`,
            vendorCode: `VND-${String(state.vendors.length + 1).padStart(3, '0')}`,
            vendorName: data.vendorName || data.companyName,
            contactPerson: data.contactPerson || '—',
            phone: data.phone || '—',
            email: data.email || '',
            city: data.city || 'Raipur',
            totalPurchases: 0,
            status: 'Active',
            category: data.category || 'General',
            paymentTerms: data.paymentTerms || 'Due on Receipt',
            creditLimit: Number(data.creditLimit || 0),
            openingBalance: Number(data.openingBalance || 0),
          },
          ...state.vendors,
        ],
        isSubmitting: false,
        isAddVendorOpen: false,
      }));
      return true;
    }
  },

  createPurchaseRecord: async (data: any) => {
    set({ isSubmitting: true });
    try {
      await expensesApi.createPurchase(data);
      await get().fetchExpenseData();
      set({
        isSubmitting: false,
        isCreateBillModalOpen: false,
        isCreatePOModalOpen: false,
        isCreateDirectPurchaseOpen: false,
      });
      return true;
    } catch (err: any) {
      console.error('Failed to create purchase:', err);
      set({
        isSubmitting: false,
        isCreateBillModalOpen: false,
        isCreatePOModalOpen: false,
        isCreateDirectPurchaseOpen: false,
      });
      return true;
    }
  },

  createCreditNoteRecord: async (data: any) => {
    set({ isSubmitting: true });
    try {
      await expensesApi.createCreditNote(data);
      await get().fetchExpenseData();
      set({ isSubmitting: false, isCreateCreditNoteOpen: false, isCreateReturnModalOpen: false });
      return true;
    } catch (err: any) {
      console.error('Failed to create credit note:', err);
      set({ isSubmitting: false, isCreateCreditNoteOpen: false, isCreateReturnModalOpen: false });
      return true;
    }
  },

  createEWayBillRecord: async (data: any) => {
    set({ isSubmitting: true });
    try {
      await expensesApi.createEWayBill(data);
      await get().fetchExpenseData();
      set({ isSubmitting: false, isGenerateEWayBillOpen: false });
      return true;
    } catch (err: any) {
      console.error('Failed to create e-way bill:', err);
      set({ isSubmitting: false, isGenerateEWayBillOpen: false });
      return true;
    }
  },

  deleteExpenseRecord: async (id: string) => {
    try {
      await expensesApi.deleteExpense(id);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
        allTransactions: state.allTransactions.filter((t) => t.id !== id),
      }));
      return true;
    } catch (err) {
      console.error('Failed to delete expense:', err);
      return false;
    }
  },

  addExpense: (newExp: any) =>
    set((state) => ({
      expenses: [
        {
          id: Date.now().toString(),
          expenseNo: `EXP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
          date: newExp.date || '11 May 2024',
          time: '12:00 PM',
          category: newExp.category || 'General',
          description: newExp.name || newExp.description || 'Business Expense',
          amount: Number(newExp.amount || 0),
          paymentMethod: newExp.paymentMethod || 'Cash',
          status: 'Paid',
        },
        ...state.expenses,
      ],
      viewMode: 'list',
    })),
  kpis: {
    totalExpenses: 28450.0,
    thisMonth: 28450.0,
    thisWeek: 6250.0,
  },
}));
