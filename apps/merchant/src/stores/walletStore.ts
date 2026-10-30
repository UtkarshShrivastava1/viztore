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

const initialTransactions: WalletTransaction[] = [];
const initialBankAccounts: BankAccount[] = [];

export const useWalletStore = create<WalletState>((set) => ({
  currentBalance: 0,
  usedThisMonth: 0,
  usedChangePercent: 0,
  totalAdded: 0,
  totalUsed: 0,
  transactions: [],
  bankAccounts: [],

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
