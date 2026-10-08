import { create } from 'zustand';

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
}

export interface VendorItem {
  id: string;
  vendorCode: string;
  vendorName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  totalPurchases: number;
  status: 'Active' | 'Inactive' | 'Blocked';
}

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

const initialVendors: VendorItem[] = [
  {
    id: 'VND-01',
    vendorCode: 'VND-001',
    vendorName: 'Sharma Enterprises',
    contactPerson: 'Rajesh Sharma',
    phone: '98765 43210',
    email: 'rajesh@sharmaent.com',
    city: 'Raipur',
    totalPurchases: 125000.0,
    status: 'Active',
  },
  {
    id: 'VND-02',
    vendorCode: 'VND-002',
    vendorName: 'Gupta Traders',
    contactPerson: 'Amit Gupta',
    phone: '98261 12345',
    email: 'amit@guptatraders.in',
    city: 'Durg',
    totalPurchases: 98450.0,
    status: 'Active',
  },
  {
    id: 'VND-03',
    vendorCode: 'VND-003',
    vendorName: 'Verma Distributors',
    contactPerson: 'Suresh Verma',
    phone: '97531 67890',
    email: 'suresh@vermadist.com',
    city: 'Bhilai',
    totalPurchases: 76200.0,
    status: 'Active',
  },
  {
    id: 'VND-04',
    vendorCode: 'VND-004',
    vendorName: 'Agarwal & Co.',
    contactPerson: 'Neeraj Agarwal',
    phone: '93012 34567',
    email: 'neeraj@agarwalco.in',
    city: 'Raipur',
    totalPurchases: 62500.0,
    status: 'Active',
  },
  {
    id: 'VND-05',
    vendorCode: 'VND-005',
    vendorName: 'Office Mart',
    contactPerson: 'Pankaj Jain',
    phone: '90987 65432',
    email: 'pankaj@officemart.in',
    city: 'Durg',
    totalPurchases: 48300.0,
    status: 'Inactive',
  },
  {
    id: 'VND-06',
    vendorCode: 'VND-006',
    vendorName: 'Khandelwal Traders',
    contactPerson: 'Mahesh Khandelwal',
    phone: '88855 11223',
    email: 'mahesh@khandelwal.in',
    city: 'Bhilai',
    totalPurchases: 38750.0,
    status: 'Active',
  },
  {
    id: 'VND-07',
    vendorCode: 'VND-007',
    vendorName: 'Fashion Supply Co.',
    contactPerson: 'Vikram Singh',
    phone: '77766 33445',
    email: 'vikram@fashionsupply.in',
    city: 'Raipur',
    totalPurchases: 29600.0,
    status: 'Active',
  },
  {
    id: 'VND-08',
    vendorCode: 'VND-008',
    vendorName: 'Shree Balaji Traders',
    contactPerson: 'Manoj Sahu',
    phone: '76655 22110',
    email: 'manoj@balajitraders.in',
    city: 'Durg',
    totalPurchases: 22400.0,
    status: 'Blocked',
  },
];

export const useExpenseStore = create<PurchaseExpenseState>((set) => ({
  activeSubTab: 'all',
  setActiveSubTab: (activeSubTab) => set({ activeSubTab }),

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

  viewMode: 'list',
  setViewMode: (viewMode) => set({ viewMode }),
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
