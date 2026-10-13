import { create } from 'zustand';
import { downloadCSV } from '../utils/csvExport.js';

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

export const mockPayoutsList: PayoutRecord[] = [
  {
    id: 'pay-1234',
    payoutId: '#PAYOUT1234',
    date: '15 May 2024, 10:30 AM',
    dateTime: '15 May 2024, 10:30 AM',
    orderCount: 12,
    payoutAccount: 'HDFC Bank ••••5678',
    bankAccount: 'HDFC Bank ••••5678',
    amount: 12450.0,
    status: 'Paid',
    utr: 'AXIS123456789012',
    utrNumber: 'AXIS123456789012',
  },
  {
    id: 'pay-1233',
    payoutId: '#PAYOUT1233',
    date: '08 May 2024, 09:15 AM',
    dateTime: '08 May 2024, 09:15 AM',
    orderCount: 8,
    payoutAccount: 'HDFC Bank ••••5678',
    bankAccount: 'HDFC Bank ••••5678',
    amount: 9850.0,
    status: 'Paid',
    utr: 'HDFC987654321098',
    utrNumber: 'HDFC987654321098',
  },
  {
    id: 'pay-1232',
    payoutId: '#PAYOUT1232',
    date: '01 May 2024, 11:20 AM',
    dateTime: '01 May 2024, 11:20 AM',
    orderCount: 11,
    payoutAccount: 'HDFC Bank ••••5678',
    bankAccount: 'HDFC Bank ••••5678',
    amount: 11200.0,
    status: 'Paid',
    utr: 'SBIN234567890123',
    utrNumber: 'SBIN234567890123',
  },
  {
    id: 'pay-1231',
    payoutId: '#PAYOUT1231',
    date: '24 Apr 2024, 02:45 PM',
    dateTime: '24 Apr 2024, 02:45 PM',
    orderCount: 9,
    payoutAccount: 'HDFC Bank ••••5678',
    bankAccount: 'HDFC Bank ••••5678',
    amount: 8750.0,
    status: 'Paid',
    utr: 'ICIC123456789012',
    utrNumber: 'ICIC123456789012',
  },
  {
    id: 'pay-1230',
    payoutId: '#PAYOUT1230',
    date: '17 Apr 2024, 11:10 AM',
    dateTime: '17 Apr 2024, 11:10 AM',
    orderCount: 7,
    payoutAccount: 'HDFC Bank ••••5678',
    bankAccount: 'HDFC Bank ••••5678',
    amount: 7650.0,
    status: 'Failed',
    utr: '-',
    utrNumber: '-',
    remarks: 'Bank server timeout, retrying in next cycle',
  },
  {
    id: 'pay-1229',
    payoutId: '#PAYOUT1229',
    date: '10 Apr 2024, 10:35 AM',
    dateTime: '10 Apr 2024, 10:35 AM',
    orderCount: 10,
    payoutAccount: 'HDFC Bank ••••5678',
    bankAccount: 'HDFC Bank ••••5678',
    amount: 9420.0,
    status: 'Paid',
    utr: 'AXIS567890123456',
    utrNumber: 'AXIS567890123456',
  },
  {
    id: 'pay-1228',
    payoutId: '#PAYOUT1228',
    date: '03 Apr 2024, 09:10 AM',
    dateTime: '03 Apr 2024, 09:10 AM',
    orderCount: 6,
    payoutAccount: 'HDFC Bank ••••5678',
    bankAccount: 'HDFC Bank ••••5678',
    amount: 6300.0,
    status: 'Paid',
    utr: 'HDFC456789012345',
    utrNumber: 'HDFC456789012345',
  },
  {
    id: 'pay-1227',
    payoutId: '#PAYOUT1227',
    date: '27 Mar 2024, 04:20 PM',
    dateTime: '27 Mar 2024, 04:20 PM',
    orderCount: 14,
    payoutAccount: 'HDFC Bank ••••5678',
    bankAccount: 'HDFC Bank ••••5678',
    amount: 13850.0,
    status: 'Paid',
    utr: 'SBIN678901234567',
    utrNumber: 'SBIN678901234567',
  },
  {
    id: 'pay-1226',
    payoutId: '#PAYOUT1226',
    date: '20 Mar 2024, 12:05 PM',
    dateTime: '20 Mar 2024, 12:05 PM',
    orderCount: 9,
    payoutAccount: 'HDFC Bank ••••5678',
    bankAccount: 'HDFC Bank ••••5678',
    amount: 9100.0,
    status: 'Paid',
    utr: 'ICIC789012345678',
    utrNumber: 'ICIC789012345678',
  },
  {
    id: 'pay-1225',
    payoutId: '#PAYOUT1225',
    date: '13 Mar 2024, 10:50 AM',
    dateTime: '13 Mar 2024, 10:50 AM',
    orderCount: 8,
    payoutAccount: 'HDFC Bank ••••5678',
    bankAccount: 'HDFC Bank ••••5678',
    amount: 8420.0,
    status: 'Paid',
    utr: 'KKBK345678901234',
    utrNumber: 'KKBK345678901234',
  },
];

export const mockSettlementsList: SettlementRecord[] = [
  {
    id: 'sett-00128',
    settlementId: '#SETT00128',
    settlementDate: '15 May 2024, 10:30 AM',
    period: '08 May - 14 May 2024',
    orderCount: 42,
    grossAmount: 48520.0,
    deductions: 2425.0,
    settlementAmount: 46095.0,
    netAmount: 46095.0,
    payoutAccount: 'HDFC Bank - 50200012345678',
    status: 'Settled',
    utr: 'AXIS123456789012',
  },
  {
    id: 'sett-00127',
    settlementId: '#SETT00127',
    settlementDate: '08 May 2024, 09:15 AM',
    period: '01 May - 07 May 2024',
    orderCount: 37,
    grossAmount: 39850.0,
    deductions: 1992.5,
    settlementAmount: 37857.5,
    netAmount: 37857.5,
    payoutAccount: 'HDFC Bank - 50200012345678',
    status: 'Settled',
    utr: 'HDFC987654321098',
  },
  {
    id: 'sett-00126',
    settlementId: '#SETT00126',
    settlementDate: '01 May 2024, 11:20 AM',
    period: '24 Apr - 30 Apr 2024',
    orderCount: 32,
    grossAmount: 35620.0,
    deductions: 1781.0,
    settlementAmount: 33839.0,
    netAmount: 33839.0,
    payoutAccount: 'HDFC Bank - 50200012345678',
    status: 'Settled',
    utr: 'SBIN234567890123',
  },
  {
    id: 'sett-00125',
    settlementId: '#SETT00125',
    settlementDate: '24 Apr 2024, 02:45 PM',
    period: '17 Apr - 23 Apr 2024',
    orderCount: 28,
    grossAmount: 28750.0,
    deductions: 1437.5,
    settlementAmount: 27312.5,
    netAmount: 27312.5,
    payoutAccount: 'HDFC Bank - 50200012345678',
    status: 'Settled',
    utr: 'ICIC123456789012',
  },
  {
    id: 'sett-00124',
    settlementId: '#SETT00124',
    settlementDate: '17 Apr 2024, 11:10 AM',
    period: '10 Apr - 16 Apr 2024',
    orderCount: 26,
    grossAmount: 24630.0,
    deductions: 1231.5,
    settlementAmount: 23398.5,
    netAmount: 23398.5,
    payoutAccount: 'HDFC Bank - 50200012345678',
    status: 'Settled',
    utr: 'UTIB987654321098',
  },
  {
    id: 'sett-00123',
    settlementId: '#SETT00123',
    settlementDate: '10 Apr 2024, 10:35 AM',
    period: '03 Apr - 09 Apr 2024',
    orderCount: 21,
    grossAmount: 19420.0,
    deductions: 971.0,
    settlementAmount: 18449.0,
    netAmount: 18449.0,
    payoutAccount: 'HDFC Bank - 50200012345678',
    status: 'Settled',
    utr: 'AXIS567890123456',
  },
  {
    id: 'sett-00122',
    settlementId: '#SETT00122',
    settlementDate: '03 Apr 2024, 09:10 AM',
    period: '27 Mar - 02 Apr 2024',
    orderCount: 19,
    grossAmount: 16300.0,
    deductions: 815.0,
    settlementAmount: 15485.0,
    netAmount: 15485.0,
    payoutAccount: 'HDFC Bank - 50200012345678',
    status: 'Settled',
    utr: 'HDFC456789012345',
  },
  {
    id: 'sett-00121',
    settlementId: '#SETT00121',
    settlementDate: '27 Mar 2024, 04:20 PM',
    period: '20 Mar - 26 Mar 2024',
    orderCount: 17,
    grossAmount: 13850.0,
    deductions: 692.5,
    settlementAmount: 13157.5,
    netAmount: 13157.5,
    payoutAccount: 'HDFC Bank - 50200012345678',
    status: 'Settled',
    utr: 'SBIN678901234567',
  },
  {
    id: 'sett-00120',
    settlementId: '#SETT00120',
    settlementDate: '20 Mar 2024, 12:05 PM',
    period: '13 Mar - 19 Mar 2024',
    orderCount: 14,
    grossAmount: 11900.0,
    deductions: 595.0,
    settlementAmount: 11305.0,
    netAmount: 11305.0,
    payoutAccount: 'HDFC Bank - 50200012345678',
    status: 'Settled',
    utr: 'ICIC789012345678',
  },
  {
    id: 'sett-00119',
    settlementId: '#SETT00119',
    settlementDate: '13 Mar 2024, 10:50 AM',
    period: '06 Mar - 12 Mar 2024',
    orderCount: 11,
    grossAmount: 8420.0,
    deductions: 421.0,
    settlementAmount: 7999.0,
    netAmount: 7999.0,
    payoutAccount: 'HDFC Bank - 50200012345678',
    status: 'Settled',
    utr: 'KKBK345678901234',
  },
];

export const mockTransactionsList: PayoutTransaction[] = [
  {
    id: 'txn-123456',
    transactionId: '#TXN123456',
    orderId: '#ORD10045',
    customer: 'Rahul Sharma',
    dateTime: '15 May 2024, 10:30 AM',
    type: 'Order Payment',
    paymentMethod: 'UPI (PhonePe)',
    description: 'Order amount for #ORD10045',
    referenceId: '#ORD10045',
    amount: 1299.0,
    fee: 38.97,
    netAmount: 1260.03,
    credit: 1049.0,
    balance: 12450.0,
    status: 'Completed',
  },
  {
    id: 'txn-123455',
    transactionId: '#TXN123455',
    orderId: '#ORD10044',
    customer: 'Priya Verma',
    dateTime: '15 May 2024, 09:15 AM',
    type: 'Order Payment',
    paymentMethod: 'UPI (Google Pay)',
    description: 'Order amount for #ORD10044',
    referenceId: '#ORD10044',
    amount: 899.0,
    fee: 26.97,
    netAmount: 872.03,
    credit: 899.0,
    balance: 11189.97,
    status: 'Completed',
  },
  {
    id: 'txn-123454',
    transactionId: '#TXN123454',
    orderId: '#ORD10043',
    customer: 'Amit Kumar',
    dateTime: '14 May 2024, 08:45 PM',
    type: 'Refund',
    paymentMethod: 'Original Payment',
    description: 'Refund for order #ORD10043',
    referenceId: '#ORD10043',
    amount: -499.0,
    debit: 499.0,
    fee: 0.0,
    netAmount: -499.0,
    balance: 10317.94,
    status: 'Completed',
  },
  {
    id: 'txn-123453',
    transactionId: '#TXN123453',
    orderId: '#ORD10042',
    customer: 'Sneha Patel',
    dateTime: '14 May 2024, 06:20 PM',
    type: 'Order Payment',
    paymentMethod: 'Credit Card',
    description: 'Order amount for #ORD10042',
    referenceId: '#ORD10042',
    amount: 2499.0,
    fee: 74.97,
    netAmount: 2424.03,
    credit: 2499.0,
    balance: 10816.94,
    status: 'Completed',
  },
  {
    id: 'txn-123452',
    transactionId: '#TXN123452',
    orderId: '#ORD10041',
    customer: 'Vikram Singh',
    dateTime: '13 May 2024, 01:10 PM',
    type: 'Order Payment',
    paymentMethod: 'Net Banking',
    description: 'Order amount for #ORD10041',
    referenceId: '#ORD10041',
    amount: 1199.0,
    fee: 23.98,
    netAmount: 1175.02,
    credit: 1199.0,
    balance: 8392.91,
    status: 'Completed',
  },
  {
    id: 'txn-123451',
    transactionId: '#TXN123451',
    orderId: '#ORD10040',
    customer: 'Neha Jain',
    dateTime: '12 May 2024, 11:05 AM',
    type: 'Order Payment',
    paymentMethod: 'UPI (Paytm)',
    description: 'Order amount for #ORD10040',
    referenceId: '#ORD10040',
    amount: 749.0,
    fee: 22.47,
    netAmount: 726.53,
    credit: 749.0,
    balance: 7217.89,
    status: 'Completed',
  },
  {
    id: 'txn-123450',
    transactionId: '#TXN123450',
    orderId: '#ORD10039',
    customer: 'Karan Mehta',
    dateTime: '11 May 2024, 07:30 PM',
    type: 'Fee Deduction',
    paymentMethod: 'Platform Fee',
    description: 'Platform commission for #ORD10039',
    referenceId: '#ORD10039',
    amount: -115.39,
    debit: 115.39,
    fee: null,
    netAmount: -115.39,
    balance: 6491.36,
    status: 'Completed',
  },
  {
    id: 'txn-123449',
    transactionId: '#TXN123449',
    orderId: '#ORD10038',
    customer: 'Anjali Nair',
    dateTime: '11 May 2024, 06:15 PM',
    type: 'Order Payment',
    paymentMethod: 'UPI (PhonePe)',
    description: 'Order amount for #ORD10038',
    referenceId: '#ORD10038',
    amount: 1850.0,
    fee: 55.5,
    netAmount: 1794.5,
    credit: 1850.0,
    balance: 6606.75,
    status: 'Completed',
  },
  {
    id: 'txn-123448',
    transactionId: '#TXN123448',
    orderId: '#ORD10037',
    customer: 'Rohit Yadav',
    dateTime: '10 May 2024, 04:20 PM',
    type: 'Chargeback',
    paymentMethod: 'Original Payment',
    description: 'Customer dispute chargeback for #ORD10037',
    referenceId: '#ORD10037',
    amount: -1199.0,
    debit: 1199.0,
    fee: 0.0,
    netAmount: -1199.0,
    balance: 4812.25,
    status: 'Completed',
  },
  {
    id: 'txn-123447',
    transactionId: '#TXN123447',
    orderId: '#ORD10036',
    customer: 'Meera Iyer',
    dateTime: '10 May 2024, 12:05 PM',
    type: 'Order Payment',
    paymentMethod: 'UPI (Google Pay)',
    description: 'Order amount for #ORD10036',
    referenceId: '#ORD10036',
    amount: 910.0,
    fee: 27.3,
    netAmount: 882.7,
    credit: 910.0,
    balance: 6011.25,
    status: 'Completed',
  },
];

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
  availableForPayout: 12450.0,
  pendingBalance: 3250.0,
  onHold: 1100.0,
  totalPayoutsMonth: 28750.0,
  totalSettlementsAllTime: 124560.0,

  payoutAccountFilter: 'HDFC Bank - 50200012345678',
  dateRangeFilter: '10 May 2024 - 16 May 2024',

  payouts: mockPayoutsList,
  settlements: mockSettlementsList,
  transactions: mockTransactionsList,
  requests: [],
  settings: {
    accountName: 'Fashion Hub Retailers Pvt Ltd',
    bankName: 'HDFC Bank',
    accountNumber: '50200012345678',
    ifscCode: 'HDFC0001234',
    accountType: 'Current Account',
    branch: 'Indiranagar, Bengaluru',
    isVerified: true,
    payoutMode: 'NEFT / RTGS',
    payoutFrequency: 'Weekly',
    payoutDay: 'Wednesday',
    enableThreshold: true,
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

  updateSettings: (newSettings) =>
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),

  createPayoutRequest: (amount, remarks) => {
    alert(`Payout request for ₹ ${amount} submitted successfully!`);
  },

  cancelPayoutRequest: (id) => {
    alert(`Payout request cancelled.`);
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
