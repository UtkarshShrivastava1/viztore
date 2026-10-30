import { settlementsApi } from '../lib/api.js';
import { create } from 'zustand';
import { downloadCSV } from '../utils/csvExport.js';

function getRelativeDateStr(daysAgo: number, timeStr = '10:30 AM'): string {
  const d = new Date(Date.now() - daysAgo * 86400000);
  return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${timeStr}`;
}
function getRelativePeriodStr(endDaysAgo: number, startDaysAgo: number): string {
  const d1 = new Date(Date.now() - startDaysAgo * 86400000);
  const d2 = new Date(Date.now() - endDaysAgo * 86400000);
  return `${d1.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${d2.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
}


export interface PayoutRecord {
  id: string;
  payoutId: string;
  date: string;
  dateTime: string;
  orderCount: number;
  payoutAccount: string;
  bankAccount: string;
  amount: number;
  status: 'Paid' | 'Failed' | 'Success' | 'In Process' | 'Reversed';
  utr: string;
  utrNumber?: string;
  processedOn?: string;
  remarks?: string;
}

export interface SettlementRecord {
  id: string;
  settlementId: string;
  settlementDate: string;
  period: string;
  orderCount: number;
  grossAmount: number;
  deductions: number;
  settlementAmount: number;
  netAmount: number;
  payoutAccount: string;
  orderRange?: string;
  status: 'Settled' | 'In Transit';
  utr: string;
  utrNumber?: string;
}

export interface PayoutTransaction {
  id: string;
  dateTime: string;
  transactionId: string;
  orderId: string;
  customer: string;
  type:
    | 'Order Payment'
    | 'Shipping Charge'
    | 'Commission'
    | 'Refund'
    | 'Payout'
    | 'Fee Deduction'
    | 'Chargeback'
    | 'TDS Deducted'
    | 'Tax Collected'
    | 'Order Credit'
    | 'Payout Initiated';
  paymentMethod: string;
  description: string;
  referenceId: string;
  amount: number;
  debit?: number;
  credit?: number;
  fee: number | null;
  netAmount: number;
  balance: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface PayoutRequest {
  id: string;
  requestId: string;
  requestDateTime: string;
  payoutAccount: string;
  requestedAmount: number;
  approvedAmount?: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  requestedOn: string;
  processedOn?: string;
  remarks?: string;
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountType: string;
  };
  timeline: {
    created: string;
    approved?: string;
    approvedBy?: string;
    processed?: string;
    utr?: string;
  };
}

export interface PayoutSettingsData {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
  branch: string;
  upiId?: string;
  isVerified: boolean;
  payoutMode: 'NEFT / RTGS' | 'UPI';
  payoutFrequency: 'Daily' | 'Weekly' | 'Bi-weekly' | 'Monthly';
  payoutDay: string;
  enableThreshold: boolean;
  thresholdAmount: number;
}

export type PayoutTab =
  | 'overview'
  | 'payment_history'
  | 'settlements'
  | 'transactions'
  | 'payout_requests'
  | 'payout_settings';

export const mockPayoutsList: PayoutRecord[] = [];
export const mockSettlementsList: SettlementRecord[] = [];
export const mockTransactionsList: PayoutTransaction[] = [];

interface PayoutsState {
  activeTab: PayoutTab;
  availableForPayout: number;
  pendingBalance: number;
  onHold: number;
  totalPayoutsMonth: number;
  totalSettlementsAllTime: number;

  payoutAccountFilter: string;
  dateRangeFilter: string;

  payouts: PayoutRecord[];
  settlements: SettlementRecord[];
  transactions: PayoutTransaction[];
  requests: PayoutRequest[];
  settings: PayoutSettingsData;

  selectedPayout: PayoutRecord | null;
  selectedSettlement: SettlementRecord | null;
  selectedTransaction: PayoutTransaction | null;

  isPayoutDrawerOpen: boolean;
  isSettlementDrawerOpen: boolean;
  isTransactionDrawerOpen: boolean;

  selectedRequest: PayoutRequest | null;
  isRequestDrawerOpen: boolean;
  isNewRequestModalOpen: boolean;

  isLoading: boolean;
  error: string | null;
  fetchOverview: () => Promise<void>;

  // Actions
  setActiveTab: (tab: PayoutTab) => void;
  setPayoutAccountFilter: (val: string) => void;
  setDateRangeFilter: (val: string) => void;

  setSelectedPayout: (p: PayoutRecord | null) => void;
  setIsPayoutDrawerOpen: (open: boolean) => void;

  setSelectedSettlement: (s: SettlementRecord | null) => void;
  setIsSettlementDrawerOpen: (open: boolean) => void;

  setSelectedTransaction: (t: PayoutTransaction | null) => void;
  setIsTransactionDrawerOpen: (open: boolean) => void;

  setSelectedRequest: (req: PayoutRequest | null) => void;
  setIsRequestDrawerOpen: (open: boolean) => void;
  setIsNewRequestModalOpen: (open: boolean) => void;
  updateSettings: (newSettings: Partial<PayoutSettingsData>) => void;
  createPayoutRequest: (amount: number, remarks?: string) => void;
  cancelPayoutRequest: (id: string) => void;
  downloadStatement: (format: 'Payment History' | 'Settlements' | 'Transactions') => void;
}

export const usePayoutsStore = create<PayoutsState>((set, get) => ({
  activeTab: 'overview',
  isLoading: false,
  error: null,
  availableForPayout: 0.0,
  pendingBalance: 0.0,
  onHold: 0.0,
  totalPayoutsMonth: 0.0,
  totalSettlementsAllTime: 0.0,

  payoutAccountFilter: '',
  dateRangeFilter: '',

  payouts: [],
  settlements: [],
  transactions: [],
  requests: [],
  settings: {
    accountName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'Current Account',
    branch: '',
    isVerified: false,
    payoutMode: 'NEFT / RTGS',
    payoutFrequency: 'Weekly',
    payoutDay: 'Wednesday',
    enableThreshold: false,
    thresholdAmount: 5000,
  },

  selectedPayout: null,
  selectedSettlement: null,
  selectedTransaction: null,

  isPayoutDrawerOpen: false,
  isSettlementDrawerOpen: false,
  isTransactionDrawerOpen: false,

  selectedRequest: null,
  isRequestDrawerOpen: false,
  isNewRequestModalOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setPayoutAccountFilter: (val) => set({ payoutAccountFilter: val }),
  setDateRangeFilter: (val) => set({ dateRangeFilter: val }),

  setSelectedPayout: (p) => set({ selectedPayout: p }),
  setIsPayoutDrawerOpen: (open) => set({ isPayoutDrawerOpen: open }),

  setSelectedSettlement: (s) => set({ selectedSettlement: s }),
  setIsSettlementDrawerOpen: (open) => set({ isSettlementDrawerOpen: open }),

  setSelectedTransaction: (t) => set({ selectedTransaction: t }),
  setIsTransactionDrawerOpen: (open) => set({ isTransactionDrawerOpen: open }),

  setSelectedRequest: (req) => set({ selectedRequest: req }),
  setIsRequestDrawerOpen: (open) => set({ isRequestDrawerOpen: open }),
  setIsNewRequestModalOpen: (open) => set({ isNewRequestModalOpen: open }),

  fetchOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const [overviewRes, bankRes] = await Promise.all([
        settlementsApi.getOverview().catch(() => null),
        settlementsApi.getBankAccount().catch(() => null),
      ]);

      const patch: any = { isLoading: false };

      if (overviewRes?.data?.success && overviewRes.data.data) {
        const d = overviewRes.data.data;
        patch.availableForPayout = d.availableForPayout ?? 0;
        patch.pendingBalance = d.pendingBalance ?? 0;
        patch.onHold = d.onHold ?? 0;
        patch.totalPayoutsMonth = d.totalPayoutsMonth ?? 0;
        patch.totalSettlementsAllTime = d.totalSettledAllTime ?? 0;

        if (Array.isArray(d.recentPayouts) && d.recentPayouts.length > 0) {
          patch.payouts = d.recentPayouts.map((p: any) => ({
            id: p._id || p.id,
            payoutId: p.settlementId,
            date: p.settlementDate,
            dateTime: p.settlementDate + ', 10:30 AM',
            orderCount: p.orderCount || 1,
            payoutAccount: p.bankAccount,
            bankAccount: p.bankAccount,
            amount: p.netPayoutAmount,
            status: p.status === 'Settled' ? 'Paid' : p.status,
            utr: p.utrNumber || 'AXIS123456789012',
            utrNumber: p.utrNumber || 'AXIS123456789012',
          }));
        }
      }

      if (bankRes?.data?.success && bankRes.data.data) {
        const b = bankRes.data.data;
        patch.settings = {
          accountName: b.accountName || '',
          bankName: b.bankName || '',
          accountNumber: b.accountNumber || '',
          ifscCode: b.ifscCode || '',
          accountType: b.accountType || 'Current Account',
          branch: b.branch || '',
          upiId: b.upiId || '',
          isVerified: b.isVerified ?? true,
          payoutMode: b.payoutMode || 'NEFT / RTGS',
          payoutFrequency: b.payoutFrequency || 'Weekly',
          payoutDay: b.payoutDay || 'Wednesday',
          enableThreshold: b.enableThreshold ?? false,
          thresholdAmount: b.thresholdAmount || 5000,
        };
      }

      set(patch);
    } catch (err: any) {
      console.warn('Live API fetchOverview failed:', err);
      set({ isLoading: false, error: err.message || 'Failed to fetch payout overview' });
    }
  },

  updateSettings: async (newSettings) => {
    set((state) => ({ settings: { ...state.settings, ...newSettings } }));
    try {
      await settlementsApi.saveBankAccount({ ...get().settings, ...newSettings });
    } catch (err) {
      console.warn('Live API saveBankAccount failed:', err);
    }
  },

  createPayoutRequest: async (amount, remarks) => {
    const newReq: PayoutRequest = {
      id: `req-${Date.now()}`,
      requestId: `#REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      requestDateTime: 'Just now',
      payoutAccount: get().settings.bankName + ' ••••' + (get().settings.accountNumber.slice(-4) || '5678'),
      requestedAmount: amount,
      status: 'Pending',
      requestedOn: new Date().toISOString().slice(0, 10),
      remarks: remarks || 'Merchant settlement withdrawal',
      bankDetails: {
        accountHolderName: get().settings.accountName,
        accountNumber: get().settings.accountNumber,
        ifscCode: get().settings.ifscCode,
        bankName: get().settings.bankName,
        accountType: get().settings.accountType,
      },
      timeline: {
        created: 'Just now',
      },
    };
    set((state) => ({
      requests: [newReq, ...state.requests],
      availableForPayout: Math.max(0, state.availableForPayout - amount),
      pendingBalance: state.pendingBalance + amount,
      isNewRequestModalOpen: false,
    }));

    try {
      await settlementsApi.requestPayout({ amount, remarks });
    } catch (err) {
      console.warn('Live API requestPayout failed:', err);
    }
  },

  cancelPayoutRequest: (id) => {
    set((state) => {
      const target = state.requests.find((r) => r.id === id);
      const refundedAmt = target ? target.requestedAmount : 0;
      return {
        requests: state.requests.map((r) =>
          r.id === id ? { ...r, status: 'Rejected' as const } : r
        ),
        availableForPayout: state.availableForPayout + refundedAmt,
        pendingBalance: Math.max(0, state.pendingBalance - refundedAmt),
      };
    });
  },

  downloadStatement: (format) => {
    const today = new Date().toISOString().slice(0, 10);
    if (format === 'Payment History') {
      downloadCSV(
        `payouts_payment_history_${today}.csv`,
        ['Payout ID', 'Date & Time', 'Orders', 'Account', 'Amount', 'Status', 'UTR Number'],
        get().payouts.map((p) => [
          p.payoutId,
          p.dateTime || p.date,
          p.orderCount,
          p.bankAccount || p.payoutAccount,
          p.amount,
          p.status,
          p.utrNumber || p.utr,
        ])
      );
    } else if (format === 'Settlements') {
      downloadCSV(
        `settlements_${today}.csv`,
        ['Settlement ID', 'Date', 'Period', 'Orders', 'Gross Amount', 'Deductions', 'Net Settled', 'Status'],
        get().settlements.map((s) => [
          s.settlementId,
          s.settlementDate,
          s.period,
          s.orderCount,
          s.grossAmount,
          s.deductions,
          s.settlementAmount,
          s.status,
        ])
      );
    } else {
      downloadCSV(
        `transactions_${today}.csv`,
        ['Transaction ID', 'Date & Time', 'Type', 'Reference / Order', 'Description', 'Amount', 'Status'],
        get().transactions.map((t) => [
          t.transactionId,
          t.dateTime,
          t.type,
          t.orderId || t.referenceId || '',
          t.description,
          t.amount,
          t.status,
        ])
      );
    }
  },
}));
