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
  totalAdded: number;
  totalUsed: number;
  pendingRefund: number;
  creditLimit: number;
  transactions: WalletTransaction[];
  bankAccounts: BankAccount[];

  // Filter states
  activeTab: 'all' | 'added' | 'used' | 'refunds';
  searchQuery: string;
  dateRange: string;
  typeFilter: string;
  methodFilter: string;
  statusFilter: string;

  // Modals & Drawers
  isAddMoneyModalOpen: boolean;
  isWithdrawModalOpen: boolean;
  isBankAccountsModalOpen: boolean;
  selectedTransaction: WalletTransaction | null;

  // Actions
  setActiveTab: (tab: 'all' | 'added' | 'used' | 'refunds') => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (range: string) => void;
  setTypeFilter: (type: string) => void;
  setMethodFilter: (method: string) => void;
  setStatusFilter: (status: string) => void;
  clearFilters: () => void;
  setIsAddMoneyModalOpen: (open: boolean) => void;
  setIsWithdrawModalOpen: (open: boolean) => void;
  setIsBankAccountsModalOpen: (open: boolean) => void;
  setSelectedTransaction: (txn: WalletTransaction | null) => void;

  addMoney: (amount: number, method: string, methodType: 'razorpay' | 'hdfc' | 'upi' | 'wallet' | 'bank') => void;
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
    referenceId: 'pay_Nz82Kx92109',
    notes: 'Direct merchant portal top-up',
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
    notes: 'Order fulfillment payment deduction',
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
    referenceId: 'HDFC-NETB-48190',
  },
  {
    id: 'INV-1246',
    dateTime: '08 May 2024 11:10 AM',
    date: '08 May 2024',
    time: '11:10 AM',
    type: 'Used',
    description: 'Payment for Invoice INV-1246',
    paymentMethod: 'Wallet Balance',
    methodType: 'wallet',
    amount: -6780.0,
    status: 'Success',
    closingBalance: 5900.0,
    referenceId: 'INV-1246',
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
    notes: 'Item damaged during logistics transit - verified by QA',
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
    referenceId: 'UPI-TXN-8201948',
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
  },
];

const initialBankAccounts: BankAccount[] = [
  {
    id: 'BANK-01',
    bankName: 'HDFC Bank',
    accountNumberMasked: '•••• •••• 4567',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Apex Fashion Stores Ltd',
    isPrimary: true,
    verified: true,
  },
  {
    id: 'BANK-02',
    bankName: 'ICICI Bank',
    accountNumberMasked: '•••• •••• 8912',
    ifscCode: 'ICIC0005678',
    accountHolderName: 'Apex Fashion Stores Ltd',
    isPrimary: false,
    verified: true,
  },
];

export const useWalletStore = create<WalletState>((set) => ({
  currentBalance: 32450.0,
  totalAdded: 185600.0,
  totalUsed: 153150.0,
  pendingRefund: 2350.0,
  creditLimit: 50000.0,
  transactions: initialTransactions,
  bankAccounts: initialBankAccounts,

  activeTab: 'all',
  searchQuery: '',
  dateRange: '',
  typeFilter: 'All Types',
  methodFilter: 'All Methods',
  statusFilter: 'All Statuses',

  isAddMoneyModalOpen: false,
  isWithdrawModalOpen: false,
  isBankAccountsModalOpen: false,
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
      dateRange: '',
      typeFilter: 'All Types',
      methodFilter: 'All Methods',
      statusFilter: 'All Statuses',
    }),

  setIsAddMoneyModalOpen: (isAddMoneyModalOpen) => set({ isAddMoneyModalOpen }),
  setIsWithdrawModalOpen: (isWithdrawModalOpen) => set({ isWithdrawModalOpen }),
  setIsBankAccountsModalOpen: (isBankAccountsModalOpen) => set({ isBankAccountsModalOpen }),
  setSelectedTransaction: (selectedTransaction) => set({ selectedTransaction }),

  addMoney: (amount, method, methodType) =>
    set((state) => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const nextId = `WLT-2026-000${state.transactions.length + 120}`;
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
        referenceId: `TXN-${Date.now().toString().slice(-6)}`,
      };

      return {
        currentBalance: newBal,
        totalAdded: state.totalAdded + amount,
        transactions: [newTxn, ...state.transactions],
        isAddMoneyModalOpen: false,
      };
    }),

  withdrawMoney: (amount, bankAccountId, notes) =>
    set((state) => {
      if (amount > state.currentBalance) return state;
      const bank = state.bankAccounts.find((b) => b.id === bankAccountId) || state.bankAccounts[0];
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const nextId = `WLT-2026-000${state.transactions.length + 120}`;
      const newBal = state.currentBalance - amount;

      const newTxn: WalletTransaction = {
        id: nextId,
        dateTime: `${dateStr} ${timeStr}`,
        date: dateStr,
        time: timeStr,
        type: 'Used',
        description: `Settlement withdrawal to ${bank?.bankName || 'Bank'}`,
        paymentMethod: bank?.bankName || 'Bank Transfer',
        methodType: 'bank',
        amount: -amount,
        status: 'Success',
        closingBalance: newBal,
        referenceId: `UTR-${Date.now().toString().slice(-8)}`,
        notes,
      };

      return {
        currentBalance: newBal,
        totalUsed: state.totalUsed + amount,
        transactions: [newTxn, ...state.transactions],
        isWithdrawModalOpen: false,
      };
    }),
}));
