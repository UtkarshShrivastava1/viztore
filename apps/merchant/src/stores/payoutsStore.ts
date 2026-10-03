import { create } from 'zustand';

export interface PayoutRecord {
  id: string;
  payoutId: string;
  date: string;
  payoutAccount: string;
  amount: number;
  status: 'Success' | 'In Process' | 'Failed' | 'Reversed';
  utrNumber?: string;
  processedOn?: string;
  remarks?: string;
}

export interface SettlementRecord {
  id: string;
  settlementId: string;
  settlementDate: string;
  payoutAccount: string;
  orderRange: string;
  settlementAmount: number;
  deductions: number;
  netAmount: number;
  status: 'Settled' | 'In Transit';
  utrNumber?: string;
}

export interface PayoutTransaction {
  id: string;
  transactionId: string;
  dateTime: string;
  type:
    | 'Payout'
    | 'TDS Deducted'
    | 'Tax Collected'
    | 'Refund'
    | 'Commission'
    | 'Shipping Charge'
    | 'Order Credit'
    | 'Payout Initiated';
  description: string;
  referenceId: string;
  debit?: number;
  credit?: number;
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

interface PayoutsState {
  activeTab: PayoutTab;
  availableForPayout: number;
  pendingBalance: number;
  onHold: number;
  totalPayoutsMonth: number;
  totalSettlementsAllTime: number;

  payouts: PayoutRecord[];
  settlements: SettlementRecord[];
  transactions: PayoutTransaction[];
  requests: PayoutRequest[];
  settings: PayoutSettingsData;

  selectedRequest: PayoutRequest | null;
  isRequestDrawerOpen: boolean;
  isNewRequestModalOpen: boolean;

  setActiveTab: (tab: PayoutTab) => void;
  setSelectedRequest: (req: PayoutRequest | null) => void;
  setIsRequestDrawerOpen: (open: boolean) => void;
  setIsNewRequestModalOpen: (open: boolean) => void;
  updateSettings: (newSettings: Partial<PayoutSettingsData>) => void;
  createPayoutRequest: (amount: number, remarks?: string) => void;
  cancelPayoutRequest: (id: string) => void;
}

const mockPayoutsList: PayoutRecord[] = [
  {
    id: 'pay-0045',
    payoutId: '#PAYOUT00045',
    date: '18 May 2024, 02:15 PM',
    payoutAccount: 'HDFC Bank 50200012345678',
    amount: 12450.0,
    status: 'Success',
    utrNumber: 'UTR: 4158669215632',
    processedOn: '18 May 2024, 02:16 PM',
    remarks: '-',
  },
  {
    id: 'pay-0044',
    payoutId: '#PAYOUT00044',
    date: '11 May 2024, 01:40 PM',
    payoutAccount: 'HDFC Bank 50200012345678',
    amount: 9850.0,
    status: 'Success',
    utrNumber: 'UTR: 4123658741126',
    processedOn: '11 May 2024, 01:41 PM',
    remarks: '-',
  },
  {
    id: 'pay-0043',
    payoutId: '#PAYOUT00043',
    date: '04 May 2024, 12:25 PM',
    payoutAccount: 'HDFC Bank 50200012345678',
    amount: 15000.0,
    status: 'Success',
    utrNumber: 'UTR: 409856321478',
    processedOn: '04 May 2024, 12:26 PM',
    remarks: '-',
  },
  {
    id: 'pay-0042',
    payoutId: '#PAYOUT00042',
    date: '27 Apr 2024, 11:10 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    amount: 8750.0,
    status: 'Success',
    utrNumber: 'UTR: 406325874512',
    processedOn: '27 Apr 2024, 11:11 AM',
    remarks: '-',
  },
  {
    id: 'pay-0041',
    payoutId: '#PAYOUT00041',
    date: '20 Apr 2024, 10:05 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    amount: 7650.0,
    status: 'Success',
    utrNumber: 'UTR: 403258745123',
    processedOn: '20 Apr 2024, 10:06 AM',
    remarks: '-',
  },
  {
    id: 'pay-0040',
    payoutId: '#PAYOUT00040',
    date: '13 Apr 2024, 09:20 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    amount: 10150.0,
    status: 'Success',
    utrNumber: 'UTR: 401236985741',
    processedOn: '13 Apr 2024, 09:21 AM',
    remarks: '-',
  },
  {
    id: 'pay-0039',
    payoutId: '#PAYOUT00039',
    date: '06 Apr 2024, 08:50 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    amount: 9950.0,
    status: 'Success',
    utrNumber: 'UTR: 396145698745',
    processedOn: '06 Apr 2024, 08:51 AM',
    remarks: '-',
  },
  {
    id: 'pay-0038',
    payoutId: '#PAYOUT00038',
    date: '30 Mar 2024, 10:40 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    amount: 6300.0,
    status: 'In Process',
    remarks: 'Bank processing',
  },
  {
    id: 'pay-0037',
    payoutId: '#PAYOUT00037',
    date: '23 Mar 2024, 09:00 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    amount: 8500.0,
    status: 'In Process',
    remarks: 'Bank processing',
  },
  {
    id: 'pay-0036',
    payoutId: '#PAYOUT00036',
    date: '09 Mar 2024, 08:45 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    amount: 5200.0,
    status: 'Failed',
    processedOn: '09 Mar 2024, 08:50 AM',
    remarks: 'Insufficient balance',
  },
];

const mockSettlementsList: SettlementRecord[] = [
  {
    id: 'set-0045',
    settlementId: '#SETLTS00045',
    settlementDate: '18 May 2024, 02:15 PM',
    payoutAccount: 'HDFC Bank 50200012345678',
    orderRange: '10 May 2024 - 16 May 2024',
    settlementAmount: 12450.0,
    deductions: 210.0,
    netAmount: 12240.0,
    status: 'Settled',
    utrNumber: 'UTR: 415869215632',
  },
  {
    id: 'set-0044',
    settlementId: '#SETLTS00044',
    settlementDate: '11 May 2024, 01:40 PM',
    payoutAccount: 'HDFC Bank 50200012345678',
    orderRange: '03 May 2024 - 09 May 2024',
    settlementAmount: 9850.0,
    deductions: 185.0,
    netAmount: 9665.0,
    status: 'Settled',
    utrNumber: 'UTR: 412365874126',
  },
  {
    id: 'set-0043',
    settlementId: '#SETLTS00043',
    settlementDate: '04 May 2024, 12:25 PM',
    payoutAccount: 'HDFC Bank 50200012345678',
    orderRange: '26 Apr 2024 - 02 May 2024',
    settlementAmount: 15000.0,
    deductions: 220.0,
    netAmount: 14780.0,
    status: 'Settled',
    utrNumber: 'UTR: 409856321478',
  },
  {
    id: 'set-0042',
    settlementId: '#SETLTS00042',
    settlementDate: '27 Apr 2024, 11:10 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    orderRange: '19 Apr 2024 - 25 Apr 2024',
    settlementAmount: 8750.0,
    deductions: 160.0,
    netAmount: 8590.0,
    status: 'Settled',
    utrNumber: 'UTR: 406325874512',
  },
  {
    id: 'set-0041',
    settlementId: '#SETLTS00041',
    settlementDate: '20 Apr 2024, 10:05 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    orderRange: '12 Apr 2024 - 18 Apr 2024',
    settlementAmount: 7650.0,
    deductions: 120.0,
    netAmount: 7530.0,
    status: 'Settled',
    utrNumber: 'UTR: 403258745123',
  },
  {
    id: 'set-0040',
    settlementId: '#SETLTS00040',
    settlementDate: '13 Apr 2024, 09:20 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    orderRange: '05 Apr 2024 - 11 Apr 2024',
    settlementAmount: 10150.0,
    deductions: 175.0,
    netAmount: 9975.0,
    status: 'Settled',
    utrNumber: 'UTR: 401236985741',
  },
  {
    id: 'set-0037',
    settlementId: '#SETLTS00037',
    settlementDate: '23 Mar 2024, 09:15 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    orderRange: '15 Mar 2024 - 21 Mar 2024',
    settlementAmount: 12000.0,
    deductions: 200.0,
    netAmount: 11800.0,
    status: 'In Transit',
  },
  {
    id: 'set-0036',
    settlementId: '#SETLTS00036',
    settlementDate: '16 Mar 2024, 09:00 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    orderRange: '08 Mar 2024 - 14 Mar 2024',
    settlementAmount: 8500.0,
    deductions: 150.0,
    netAmount: 8350.0,
    status: 'In Transit',
  },
];

const mockTransactionsList: PayoutTransaction[] = [
  {
    id: 'txn-7501',
    transactionId: '#TXN1287501',
    dateTime: '18 May 2024, 10:30 AM',
    type: 'Payout',
    description: 'Payout to HDFC Bank - 50200012345678',
    referenceId: '#PAYOUT1234',
    credit: 12450.0,
    balance: 12450.0,
    status: 'Completed',
  },
  {
    id: 'txn-7500',
    transactionId: '#TXN1287500',
    dateTime: '18 May 2024, 10:30 AM',
    type: 'TDS Deducted',
    description: 'TDS deduction on payout',
    referenceId: '#PAYOUT1234',
    debit: 115.39,
    balance: 0.0,
    status: 'Completed',
  },
  {
    id: 'txn-7499',
    transactionId: '#TXN1287499',
    dateTime: '18 May 2024, 10:30 AM',
    type: 'Tax Collected',
    description: 'Tax collected (GST)',
    referenceId: '#PAYOUT1234',
    debit: 2300.0,
    balance: 0.0,
    status: 'Completed',
  },
  {
    id: 'txn-7498',
    transactionId: '#TXN1287498',
    dateTime: '18 May 2024, 10:30 AM',
    type: 'Refund',
    description: 'Refund for Order #ORD10041',
    referenceId: '#ORD10041',
    credit: 899.0,
    balance: 14865.39,
    status: 'Completed',
  },
  {
    id: 'txn-7497',
    transactionId: '#TXN1287497',
    dateTime: '18 May 2024, 10:30 AM',
    type: 'Commission',
    description: 'Platform commission for Order #ORD10045',
    referenceId: '#ORD10045',
    debit: 115.39,
    balance: 13966.39,
    status: 'Completed',
  },
  {
    id: 'txn-7496',
    transactionId: '#TXN1287496',
    dateTime: '18 May 2024, 10:30 AM',
    type: 'Shipping Charge',
    description: 'Shipping charge for Order #ORD10045',
    referenceId: '#ORD10045',
    debit: 50.0,
    balance: 13851.0,
    status: 'Completed',
  },
  {
    id: 'txn-7495',
    transactionId: '#TXN1287495',
    dateTime: '18 May 2024, 10:30 AM',
    type: 'Order Credit',
    description: 'Order amount for Order #ORD10045',
    referenceId: '#ORD10045',
    credit: 1049.0,
    balance: 13901.0,
    status: 'Completed',
  },
];

const mockRequestsList: PayoutRequest[] = [
  {
    id: 'prq-0025',
    requestId: '#PRQ00025',
    requestDateTime: '18 May 2024, 11:20 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    requestedAmount: 12450.0,
    approvedAmount: 12450.0,
    status: 'Approved',
    requestedOn: '18 May 2024, 11:20 AM',
    processedOn: '18 May 2024, 02:15 PM',
    remarks: '-',
    bankDetails: {
      accountHolderName: 'Fashion Hub',
      accountNumber: '50200012345678',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      accountType: 'Current Account',
    },
    timeline: {
      created: '18 May 2024, 11:20 AM',
      approved: '18 May 2024, 01:50 PM',
      approvedBy: 'Admin User',
      processed: '18 May 2024, 02:15 PM',
      utr: '418569215632',
    },
  },
  {
    id: 'prq-0024',
    requestId: '#PRQ00024',
    requestDateTime: '15 May 2024, 09:45 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    requestedAmount: 9850.0,
    approvedAmount: 9850.0,
    status: 'Approved',
    requestedOn: '15 May 2024, 09:45 AM',
    processedOn: '15 May 2024, 12:10 PM',
    remarks: '-',
    bankDetails: {
      accountHolderName: 'Fashion Hub',
      accountNumber: '50200012345678',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      accountType: 'Current Account',
    },
    timeline: {
      created: '15 May 2024, 09:45 AM',
      approved: '15 May 2024, 11:00 AM',
      approvedBy: 'Admin User',
      processed: '15 May 2024, 12:10 PM',
      utr: '4123658741126',
    },
  },
  {
    id: 'prq-0023',
    requestId: '#PRQ00023',
    requestDateTime: '12 May 2024, 04:30 PM',
    payoutAccount: 'HDFC Bank 50200012345678',
    requestedAmount: 15000.0,
    approvedAmount: 15000.0,
    status: 'Pending',
    requestedOn: '12 May 2024, 04:30 PM',
    remarks: 'Under review',
    bankDetails: {
      accountHolderName: 'Fashion Hub',
      accountNumber: '50200012345678',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      accountType: 'Current Account',
    },
    timeline: {
      created: '12 May 2024, 04:30 PM',
    },
  },
  {
    id: 'prq-0022',
    requestId: '#PRQ00022',
    requestDateTime: '10 May 2024, 10:05 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    requestedAmount: 8500.0,
    status: 'Pending',
    requestedOn: '10 May 2024, 10:05 AM',
    remarks: '-',
    bankDetails: {
      accountHolderName: 'Fashion Hub',
      accountNumber: '50200012345678',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      accountType: 'Current Account',
    },
    timeline: {
      created: '10 May 2024, 10:05 AM',
    },
  },
  {
    id: 'prq-0021',
    requestId: '#PRQ00021',
    requestDateTime: '08 May 2024, 02:25 PM',
    payoutAccount: 'HDFC Bank 50200012345678',
    requestedAmount: 7200.0,
    approvedAmount: 7200.0,
    status: 'Approved',
    requestedOn: '08 May 2024, 02:25 PM',
    processedOn: '08 May 2024, 04:05 PM',
    remarks: '-',
    bankDetails: {
      accountHolderName: 'Fashion Hub',
      accountNumber: '50200012345678',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      accountType: 'Current Account',
    },
    timeline: {
      created: '08 May 2024, 02:25 PM',
      approved: '08 May 2024, 03:15 PM',
      approvedBy: 'Admin User',
      processed: '08 May 2024, 04:05 PM',
      utr: '408562145632',
    },
  },
  {
    id: 'prq-0020',
    requestId: '#PRQ00020',
    requestDateTime: '06 May 2024, 11:10 AM',
    payoutAccount: 'HDFC Bank 50200012345678',
    requestedAmount: 5250.0,
    status: 'Rejected',
    requestedOn: '06 May 2024, 11:10 AM',
    processedOn: '06 May 2024, 11:45 AM',
    remarks: 'Insufficient balance',
    bankDetails: {
      accountHolderName: 'Fashion Hub',
      accountNumber: '50200012345678',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      accountType: 'Current Account',
    },
    timeline: {
      created: '06 May 2024, 11:10 AM',
      approved: '06 May 2024, 11:45 AM',
      approvedBy: 'System Auto-Reject',
    },
  },
];

export const usePayoutsStore = create<PayoutsState>((set, get) => ({
  activeTab: 'overview',
  availableForPayout: 12450.0,
  pendingBalance: 3250.0,
  onHold: 1100.0,
  totalPayoutsMonth: 28750.0,
  totalSettlementsAllTime: 128450.0,

  payouts: mockPayoutsList,
  settlements: mockSettlementsList,
  transactions: mockTransactionsList,
  requests: mockRequestsList,

  settings: {
    accountName: 'Fashion Hub',
    bankName: 'HDFC Bank',
    accountNumber: '50200012345678',
    ifscCode: 'HDFC0001234',
    accountType: 'Current Account',
    branch: 'Connaught Place, New Delhi',
    upiId: 'fashionhub@hdfcbank',
    isVerified: true,
    payoutMode: 'NEFT / RTGS',
    payoutFrequency: 'Weekly',
    payoutDay: 'Monday',
    enableThreshold: false,
    thresholdAmount: 1000,
  },

  selectedRequest: mockRequestsList[0] || null,
  isRequestDrawerOpen: false,
  isNewRequestModalOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedRequest: (req) => set({ selectedRequest: req }),
  setIsRequestDrawerOpen: (open) => set({ isRequestDrawerOpen: open }),
  setIsNewRequestModalOpen: (open) => set({ isNewRequestModalOpen: open }),

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  createPayoutRequest: (amount, remarks) => {
    const nextNum = Math.floor(26 + Math.random() * 80);
    const reqId = `#PRQ000${nextNum}`;
    const now = new Date();
    const formatted = `${now.getDate()} ${now.toLocaleString('default', {
      month: 'short',
    })} ${now.getFullYear()}, ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newReq: PayoutRequest = {
      id: `prq-${nextNum}`,
      requestId: reqId,
      requestDateTime: formatted,
      payoutAccount: 'HDFC Bank 50200012345678',
      requestedAmount: amount,
      status: 'Pending',
      requestedOn: formatted,
      remarks: remarks || 'Under review',
      bankDetails: {
        accountHolderName: get().settings.accountName,
        accountNumber: get().settings.accountNumber,
        ifscCode: get().settings.ifscCode,
        bankName: get().settings.bankName,
        accountType: get().settings.accountType,
      },
      timeline: {
        created: formatted,
      },
    };

    set((state) => ({
      requests: [newReq, ...state.requests],
      availableForPayout: Math.max(0, state.availableForPayout - amount),
      pendingBalance: state.pendingBalance + amount,
      isNewRequestModalOpen: false,
    }));
  },

  cancelPayoutRequest: (id) =>
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id ? { ...r, status: 'Rejected', remarks: 'Cancelled by merchant' } : r
      ),
    })),
}));
