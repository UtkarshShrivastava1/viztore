import { create } from 'zustand';

export type ExpenseCategory =
  | 'Rent'
  | 'Utilities'
  | 'Office Supplies'
  | 'Meals & Entertainment'
  | 'Marketing'
  | 'Software'
  | 'Travel'
  | 'Salaries'
  | 'Packaging'
  | 'Miscellaneous';

export type ExpensePaymentMethod = 'Bank Transfer' | 'UPI' | 'Cash' | 'Card';
export type ExpenseStatus = 'Paid' | 'Needs Review' | 'Pending';
export type ExpenseType = 'Business Expense' | 'Personal Expense';

export interface Expense {
  id: string;
  date: string;
  time: string;
  name: string;
  subtitle: string;
  category: ExpenseCategory;
  vendor: string;
  paymentMethod: ExpensePaymentMethod;
  amount: number;
  tax: number;
  totalAmount: number;
  currency: string;
  status: ExpenseStatus;
  expenseType: ExpenseType;
  isReimbursable: boolean;
  receiptName?: string;
  receiptSize?: string;
  project?: string;
  costCenter?: string;
  referenceNumber?: string;
  notes?: string;
}

export interface ExpenseKPIs {
  totalExpenses: number;
  thisMonth: number;
  thisWeek: number;
  highestCategory: {
    name: string;
    amount: number;
    percentage: number;
  };
  pendingReimbursement: {
    amount: number;
    count: number;
  };
}

interface ExpenseState {
  expenses: Expense[];
  kpis: ExpenseKPIs;
  viewMode: 'list' | 'add';
  activeTab: 'all' | 'business' | 'personal' | 'reimbursable' | 'non_reimbursable';

  // Filters
  searchQuery: string;
  dateRange: string;
  categoryFilter: string;
  methodFilter: string;
  statusFilter: string;

  // Selected item
  selectedExpense: Expense | null;

  // Actions
  setViewMode: (mode: 'list' | 'add') => void;
  setActiveTab: (tab: 'all' | 'business' | 'personal' | 'reimbursable' | 'non_reimbursable') => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (range: string) => void;
  setCategoryFilter: (category: string) => void;
  setMethodFilter: (method: string) => void;
  setStatusFilter: (status: string) => void;
  clearFilters: () => void;
  setSelectedExpense: (exp: Expense | null) => void;

  addExpense: (expenseData: Omit<Expense, 'id'>) => void;
  updateExpenseStatus: (id: string, status: ExpenseStatus) => void;
}

const initialExpenses: Expense[] = [
  {
    id: 'EXP-2024-000123',
    date: '11 May 2024',
    time: '11:24 AM',
    name: 'Office Rent - May 2024',
    subtitle: 'May rent payment',
    category: 'Rent',
    vendor: 'Property Owners',
    paymentMethod: 'Bank Transfer',
    amount: 65000.0,
    tax: 0.0,
    totalAmount: 65000.0,
    currency: 'INR',
    status: 'Paid',
    expenseType: 'Business Expense',
    isReimbursable: false,
    referenceNumber: 'REF-RENT-MAY24',
    notes: 'Monthly corporate premises lease',
  },
  {
    id: 'EXP-2024-000122',
    date: '10 May 2024',
    time: '04:45 PM',
    name: 'Office Electricity Bill',
    subtitle: 'April electricity bill',
    category: 'Utilities',
    vendor: 'State Electricity Board',
    paymentMethod: 'UPI',
    amount: 3450.0,
    tax: 180.0,
    totalAmount: 3630.0,
    currency: 'INR',
    status: 'Paid',
    expenseType: 'Business Expense',
    isReimbursable: false,
    referenceNumber: 'MPPKVVCL-920184',
  },
  {
    id: 'EXP-2024-000121',
    date: '09 May 2024',
    time: '02:30 PM',
    name: 'Internet Bill',
    subtitle: 'May internet bill',
    category: 'Utilities',
    vendor: 'Airtel Business',
    paymentMethod: 'UPI',
    amount: 1299.0,
    tax: 233.82,
    totalAmount: 1532.82,
    currency: 'INR',
    status: 'Paid',
    expenseType: 'Business Expense',
    isReimbursable: false,
    referenceNumber: 'AIRTEL-FIBER-4910',
  },
  {
    id: 'EXP-2024-000120',
    date: '08 May 2024',
    time: '01:15 PM',
    name: 'Printing & Stationery',
    subtitle: 'Visiting cards & prints',
    category: 'Office Supplies',
    vendor: 'Printo Press',
    paymentMethod: 'Cash',
    amount: 850.0,
    tax: 0.0,
    totalAmount: 850.0,
    currency: 'INR',
    status: 'Paid',
    expenseType: 'Business Expense',
    isReimbursable: true,
    receiptName: 'printo_receipt_08may.pdf',
    receiptSize: '412 KB',
  },
  {
    id: 'EXP-2024-000119',
    date: '07 May 2024',
    time: '12:05 PM',
    name: 'Staff Lunch',
    subtitle: 'Team lunch meeting',
    category: 'Meals & Entertainment',
    vendor: 'The Food Corner',
    paymentMethod: 'Card',
    amount: 2350.0,
    tax: 117.5,
    totalAmount: 2467.5,
    currency: 'INR',
    status: 'Needs Review',
    expenseType: 'Business Expense',
    isReimbursable: true,
    receiptName: 'food_corner_bill.jpg',
    receiptSize: '1.2 MB',
    notes: 'Q2 planning session lunch',
  },
  {
    id: 'EXP-2024-000118',
    date: '06 May 2024',
    time: '10:40 AM',
    name: 'Marketing Campaign',
    subtitle: 'Facebook ads - Apr',
    category: 'Marketing',
    vendor: 'Facebook',
    paymentMethod: 'Card',
    amount: 4750.0,
    tax: 855.0,
    totalAmount: 5605.0,
    currency: 'INR',
    status: 'Paid',
    expenseType: 'Business Expense',
    isReimbursable: false,
    referenceNumber: 'FB-ADS-INV-9921',
  },
  {
    id: 'EXP-2024-000117',
    date: '05 May 2024',
    time: '09:20 AM',
    name: 'Software Subscription',
    subtitle: 'TallyPrime - May',
    category: 'Software',
    vendor: 'Tally Solutions',
    paymentMethod: 'Bank Transfer',
    amount: 18000.0,
    tax: 3240.0,
    totalAmount: 21240.0,
    currency: 'INR',
    status: 'Paid',
    expenseType: 'Business Expense',
    isReimbursable: false,
    referenceNumber: 'TALLY-ANNUAL-LIC-01',
  },
  {
    id: 'EXP-2024-000116',
    date: '04 May 2024',
    time: '06:15 PM',
    name: 'Travel - Local',
    subtitle: 'Client meeting',
    category: 'Travel',
    vendor: 'Auto Rickshaw',
    paymentMethod: 'Cash',
    amount: 420.0,
    tax: 0.0,
    totalAmount: 420.0,
    currency: 'INR',
    status: 'Paid',
    expenseType: 'Business Expense',
    isReimbursable: true,
    notes: 'Transportation for catalog vendor negotiation',
  },
];

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: initialExpenses,
  kpis: {
    totalExpenses: 185600.0,
    thisMonth: 28450.0,
    thisWeek: 6250.0,
    highestCategory: {
      name: 'Rent',
      amount: 65000.0,
      percentage: 35,
    },
    pendingReimbursement: {
      amount: 12450.0,
      count: 3,
    },
  },
  viewMode: 'list',
  activeTab: 'all',

  searchQuery: '',
  dateRange: 'This Month',
  categoryFilter: 'All Categories',
  methodFilter: 'All Methods',
  statusFilter: 'All Statuses',

  selectedExpense: null,

  setViewMode: (viewMode) => set({ viewMode }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setDateRange: (dateRange) => set({ dateRange }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setMethodFilter: (methodFilter) => set({ methodFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  clearFilters: () =>
    set({
      searchQuery: '',
      dateRange: 'This Month',
      categoryFilter: 'All Categories',
      methodFilter: 'All Methods',
      statusFilter: 'All Statuses',
    }),
  setSelectedExpense: (selectedExpense) => set({ selectedExpense }),

  addExpense: (expenseData) =>
    set((state) => {
      const nextId = `EXP-2024-000${state.expenses.length + 124}`;
      const newExp: Expense = {
        id: nextId,
        ...expenseData,
      };

      return {
        expenses: [newExp, ...state.expenses],
        viewMode: 'list',
        kpis: {
          ...state.kpis,
          totalExpenses: state.kpis.totalExpenses + newExp.amount,
          thisMonth: state.kpis.thisMonth + newExp.amount,
        },
      };
    }),

  updateExpenseStatus: (id, status) =>
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? { ...e, status } : e)),
    })),
}));
