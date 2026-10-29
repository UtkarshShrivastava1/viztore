import { z } from 'zod';

export type SettlementStatus = 'Pending' | 'Processing' | 'In Transit' | 'Settled' | 'Failed';

export interface ISettlement {
  _id?: string;
  id?: string;
  settlementId: string;
  storeId: string;
  settlementDate: string;
  period: string;
  startDate?: string;
  endDate?: string;
  orderCount: number;
  grossAmount: number;
  commissionFee: number;
  deliveryFeeSplit: number;
  tdsAmount: number;
  deductions: number;
  netPayoutAmount: number;
  status: SettlementStatus;
  bankAccount: string;
  utrNumber?: string;
  settledAt?: string;
  orderIds?: string[];
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISettlementOverview {
  availableForPayout: number;
  pendingBalance: number;
  onHold: number;
  totalSettledAllTime: number;
  totalPayoutsMonth: number;
  currentCycle: {
    period: string;
    grossAmount: number;
    commissionFee: number;
    deliveryFees: number;
    taxes: number;
    netPayoutAmount: number;
  };
  recentPayouts: ISettlement[];
}

export interface ISettlementBankAccount {
  _id?: string;
  storeId: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
  branch?: string;
  upiId?: string;
  isVerified: boolean;
  payoutMode: 'NEFT / RTGS' | 'UPI';
  payoutFrequency: 'Daily' | 'Weekly' | 'Bi-weekly' | 'Monthly';
  payoutDay: string;
  enableThreshold: boolean;
  thresholdAmount: number;
}

export const saveBankAccountSchema = z.object({
  accountName: z.string().min(2, 'Account holder name is required'),
  bankName: z.string().min(2, 'Bank name is required'),
  accountNumber: z.string().min(6, 'Valid bank account number is required'),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid Indian IFSC code format'),
  accountType: z.string().default('Current Account'),
  branch: z.string().optional(),
  upiId: z.string().optional(),
  payoutMode: z.enum(['NEFT / RTGS', 'UPI']).default('NEFT / RTGS'),
  payoutFrequency: z.enum(['Daily', 'Weekly', 'Bi-weekly', 'Monthly']).default('Weekly'),
  payoutDay: z.string().default('Wednesday'),
  enableThreshold: z.boolean().default(false),
  thresholdAmount: z.number().nonnegative().default(5000),
});

export const requestPayoutSchema = z.object({
  amount: z.number().positive('Payout request amount must be greater than zero'),
  remarks: z.string().optional(),
});

