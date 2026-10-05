import { create } from 'zustand';

export type WalletTransactionType = 'Added' | 'Used' | 'Refund';
export type WalletTransactionStatus = 'Success' | 'Pending' | 'Failed';

export interface WalletTransaction {
  id: string;
  dateTime: string;
  date: string;
  time: string;
  type: WalletTransactionType;
  description: string;
  paymentMethod: string;
  methodType: 'razorpay' | 'hdfc' | 'upi' | 'wallet' | 'bank';
  amount: number; // positive for Added/Refund, negative for Used
  status: WalletTransactionStatus;
  closingBalance: number;
  referenceId?: string;
  paymentId?: string;
  orderId?: string;
  bankUpi?: string;
  paidAt?: string;
  notes?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumberMasked: string;
  ifscCode: string;
  accountHolderName: string;
  isPrimary: boolean;
  verified: boolean;
}

interface WalletState {
  currentBalance: number;
  usedThisMonth: number;
  usedChangePercent: number;
  totalAdded: number;
  totalUsed: number;
  transactions: WalletTransaction[];
  bankAccounts: BankAccount[];

  // Filter states
  activeTab: 'all' | 'added' | 'used' | 'refunds';
  searchQuery: string;
  dateRange: string;
  typeFilter: string;
  methodFilter: string;
  statusFilter: string;

  // Drawers (Mockups 7.1, 7.2, 7.3)
  isAddMoneyDrawerOpen: boolean;
  isHistoryDrawerOpen: boolean;
  selectedTransaction: WalletTransaction | null;

  // Actions
  setActiveTab: (tab: 'all' | 'added' | 'used' | 'refunds') => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (range: string) => void;
  setTypeFilter: (type: string) => void;
  setMethodFilter: (method: string) => void;
  setStatusFilter: (status: string) => void;
  clearFilters: () => void;

  setIsAddMoneyDrawerOpen: (open: boolean) => void;
  setIsHistoryDrawerOpen: (open: boolean) => void;
  setSelectedTransaction: (txn: WalletTransaction | null) => void;

  addMoney: (
    amount: number,
    method: string,
    methodType: 'razorpay' | 'hdfc' | 'upi' | 'wallet' | 'bank'
  ) => void;
  withdrawMoney: (amount: number, bankAccountId: string, notes?: string) => void;
}

const initialTransactions: WalletTransaction[] = [
  {
    id: 'WLT-2024-000123',
    dateTime: '11 May 2024 11:24 AM',
    date: '11 May 2024',
    time: '11:24 AM',
    type: 'Added',
    description: 'Added money to wallet',
    paymentMethod: 'Razorpay',
    methodType: 'razorpay',
    amount: 20000.0,
    status: 'Success',
    closingBalance: 32450.0,
    referenceId: '—',
    paymentId: 'pay_Oh9F2e6s7D1aXy',
    orderId: 'order_Oh9F2e6s7D1aXy',
    bankUpi: 'HDFC Bank **** 4567',
    paidAt: '11 May 2024, 11:24 AM',
    notes: '—',
  },
  {
    id: 'INV-1248',
    dateTime: '10 May 2024 04:45 PM',
    date: '10 May 2024',
    time: '04:45 PM',
    type: 'Used',
    description: 'Payment for Invoice INV-1248',
    paymentMethod: 'Wallet Balance',
    methodType: 'wallet',
    amount: -8450.0,
    status: 'Success',
    closingBalance: 12450.0,
    referenceId: 'INV-1248',
    paymentId: 'pay_INV1248_deduct',
    orderId: 'order_INV1248',
    bankUpi: 'Wallet Balance Direct',
    paidAt: '10 May 2024, 04:45 PM',
    notes: 'Invoice INV-1248 settlement deduction',
  },
  {
    id: 'WLT-2024-000122',
    dateTime: '09 May 2024 02:30 PM',
    date: '09 May 2024',
    time: '02:30 PM',
    type: 'Added',
    description: 'Added money to wallet',
    paymentMethod: 'HDFC Bank **** 4567',
    methodType: 'hdfc',
    amount: 15000.0,
    status: 'Success',
    closingBalance: 20900.0,
    referenceId: '—',
    paymentId: 'pay_HDFC91024_netb',
    orderId: 'order_HDFC91024',
    bankUpi: 'HDFC Bank **** 4567',
    paidAt: '09 May 2024, 02:30 PM',
    notes: 'Net Banking instant top-up',
  },
  {
    id: 'INV-1246',
    dateTime: '08 May 2024 12:30 PM',
    date: '08 May 2024',
    time: '12:30 PM',
    type: 'Used',
    description: 'Payment for Invoice INV-1246',
    paymentMethod: 'Wallet Balance',
    methodType: 'wallet',
    amount: -6780.0,
    status: 'Success',
    closingBalance: 5900.0,
    referenceId: 'INV-1246',
    paymentId: 'pay_INV1246_deduct',
    orderId: 'order_INV1246',
    bankUpi: 'Wallet Balance Direct',
    paidAt: '08 May 2024, 12:30 PM',
  },
  {
    id: 'REF-2024-00045',
    dateTime: '07 May 2024 05:20 PM',
    date: '07 May 2024',
    time: '05:20 PM',
    type: 'Refund',
    description: 'Refund for Return REQ-124',
    paymentMethod: 'Wallet Balance',
    methodType: 'wallet',
    amount: 2350.0,
    status: 'Pending',
    closingBalance: 12680.0,
    referenceId: 'REQ-124',
    paymentId: 'ref_REQ124_pending',
    orderId: 'order_REQ124',
    bankUpi: 'Wallet Balance Refund',
    paidAt: '07 May 2024, 05:20 PM',
    notes: 'Return item processed, awaiting final clearance batch',
  },
  {
    id: 'WLT-2024-000121',
    dateTime: '06 May 2024 01:15 PM',
    date: '06 May 2024',
    time: '01:15 PM',
    type: 'Added',
    description: 'Added money to wallet',
    paymentMethod: 'UPI',
    methodType: 'upi',
    amount: 10000.0,
    status: 'Success',
    closingBalance: 10330.0,
    referenceId: '—',
    paymentId: 'pay_UPI810293_gpay',
    orderId: 'order_UPI810293',
    bankUpi: 'merchant@okaxis',
    paidAt: '06 May 2024, 01:15 PM',
  },
  {
    id: 'INV-1243',
    dateTime: '05 May 2024 03:40 PM',
    date: '05 May 2024',
    time: '03:40 PM',
    type: 'Used',
    description: 'Payment for Invoice INV-1243',
    paymentMethod: 'Wallet Balance',
    methodType: 'wallet',
    amount: -4750.0,
    status: 'Success',
    closingBalance: 330.0,
    referenceId: 'INV-1243',
    paymentId: 'pay_INV1243_deduct',
    orderId: 'order_INV1243',
    bankUpi: 'Wallet Balance Direct',
    paidAt: '05 May 2024, 03:40 PM',
  },
  {
    id: 'WLT-2024-000120',
    dateTime: '04 May 2024 10:20 AM',
    date: '04 May 2024',
    time: '10:20 AM',
    type: 'Added',
    description: 'Added money to wallet',
    paymentMethod: 'Razorpay',
    methodType: 'razorpay',
    amount: 25000.0,
    status: 'Success',
    closingBalance: 5080.0,
    referenceId: '—',
    paymentId: 'pay_Razorpay940182',
    orderId: 'order_Razorpay940182',
    bankUpi: 'ICICI Net Banking',
    paidAt: '04 May 2024, 10:20 AM',
  },
];

const initialBankAccounts: BankAccount[] = [
  {
    id: 'BANK-01',
    bankName: 'HDFC Bank',
    accountNumberMasked: '•••• •••• 4567',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Fashion Hub Seller',
    isPrimary: true,
    verified: true,
  },
];

export const useWalletStore = create<WalletState>((set) => ({
  currentBalance: 32450.0,
  usedThisMonth: 153150.0,
  usedChangePercent: -8,
  totalAdded: 185600.0,
  totalUsed: 153150.0,
  transactions: initialTransactions,
  bankAccounts: initialBankAccounts,

  activeTab: 'all',
  searchQuery: '',
  dateRange: '01 May 2024 - 31 May 2024',
  typeFilter: 'All Types',
  methodFilter: 'All Methods',
  statusFilter: 'All Statuses',

  isAddMoneyDrawerOpen: false,
  isHistoryDrawerOpen: false,
  selectedTransaction: null,

  setActiveTab: (activeTab) => set({ activeTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setDateRange: (dateRange) => set({ dateRange }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setMethodFilter: (methodFilter) => set({ methodFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  clearFilters: () =>
    set({
      searchQuery: '',
      dateRange: '01 May 2024 - 31 May 2024',
      typeFilter: 'All Types',
      methodFilter: 'All Methods',
      statusFilter: 'All Statuses',
    }),

  setIsAddMoneyDrawerOpen: (isAddMoneyDrawerOpen) => set({ isAddMoneyDrawerOpen }),
  setIsHistoryDrawerOpen: (isHistoryDrawerOpen) => set({ isHistoryDrawerOpen }),
  setSelectedTransaction: (selectedTransaction) => set({ selectedTransaction }),

  addMoney: (amount, method, methodType) =>
    set((state) => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const nextId = `WLT-2024-000${state.transactions.length + 120}`;
      const newBal = state.currentBalance + amount;

      const newTxn: WalletTransaction = {
        id: nextId,
        dateTime: `${dateStr} ${timeStr}`,
        date: dateStr,
        time: timeStr,
        type: 'Added',
        description: 'Added money to wallet',
        paymentMethod: method,
        methodType,
        amount,
        status: 'Success',
        closingBalance: newBal,
        referenceId: '—',
        paymentId: `pay_${Date.now().toString().slice(-10)}`,
        orderId: `order_${Date.now().toString().slice(-10)}`,
        bankUpi: method,
        paidAt: `${dateStr}, ${timeStr}`,
        notes: 'Direct wallet funds load',
      };

      return {
        currentBalance: newBal,
        totalAdded: state.totalAdded + amount,
        transactions: [newTxn, ...state.transactions],
        isAddMoneyDrawerOpen: false,
      };
    }),

  withdrawMoney: (amount, _bankAccountId, notes) =>
    set((state) => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const nextId = `WLT-2024-000${state.transactions.length + 120}`;
      const newBal = Math.max(0, state.currentBalance - amount);

      const newTxn: WalletTransaction = {
        id: nextId,
        dateTime: `${dateStr} ${timeStr}`,
        date: dateStr,
        time: timeStr,
        type: 'Used',
        description: 'Withdrawal to Bank Account',
        paymentMethod: 'Bank Transfer',
        methodType: 'bank',
        amount: -amount,
        status: 'Success',
        closingBalance: newBal,
        referenceId: 'WITHDRAW',
        paymentId: `pay_${Date.now().toString().slice(-10)}`,
        orderId: `order_${Date.now().toString().slice(-10)}`,
        bankUpi: 'Bank Account Transfer',
        paidAt: `${dateStr}, ${timeStr}`,
        notes: notes || 'Bank withdrawal settlement',
      };

      return {
        currentBalance: newBal,
        totalUsed: state.totalUsed + amount,
        transactions: [newTxn, ...state.transactions],
      };
    }),
}));
