import { z } from 'zod';

export enum CustomerType {
  INDIVIDUAL = 'Individual',
  BUSINESS = 'Business',
  RETAILER = 'Retailer',
  WHOLESALER = 'Wholesaler',
}

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum CustomerTier {
  VIP = 'VIP',
  REGULAR = 'Regular',
  NEW = 'New',
}

export enum CustomerTransactionType {
  INVOICE = 'Invoice',
  PAYMENT = 'Payment',
  CREDIT_ADJUSTMENT = 'Credit_Adjustment',
}

// ── Zod Schemas ──────────────────────────────────────────────────────────

export const CustomerBillingAddressSchema = z.object({
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().optional().default(''),
  country: z.string().default('India'),
  sameAsShipping: z.boolean().default(true),
});

export const CreateCustomerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  displayName: z.string().optional(),
  customerType: z.nativeEnum(CustomerType).default(CustomerType.INDIVIDUAL),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  gstin: z.string().optional().or(z.literal('')),
  pan: z.string().optional().or(z.literal('')),
  creditLimit: z.number().min(0).default(10000),
  paymentTerms: z.string().default('15 Days'),
  creditPeriodDays: z.number().min(0).default(15),
  location: z.string().optional(),
  billingAddress: CustomerBillingAddressSchema.optional(),
  openingBalance: z.number().optional().default(0),
  notes: z.string().optional(),
  status: z.nativeEnum(CustomerStatus).default(CustomerStatus.ACTIVE),
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export const AdjustCustomerCreditSchema = z.object({
  amount: z.number().positive('Credit adjustment amount must be greater than 0'),
  type: z.enum(['add', 'deduct']),
  reason: z.string().min(1, 'Reason for credit adjustment is required'),
});

export const RecordCustomerPaymentSchema = z.object({
  amount: z.number().positive('Payment amount must be greater than 0'),
  paymentMethod: z.string().default('cash'),
  notes: z.string().optional(),
  referenceNo: z.string().optional(),
});

// ── Inferred DTO Types ──────────────────────────────────────────────────

export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>;
export type AdjustCustomerCreditDto = z.infer<typeof AdjustCustomerCreditSchema>;
export type RecordCustomerPaymentDto = z.infer<typeof RecordCustomerPaymentSchema>;

// ── Interfaces ──────────────────────────────────────────────────────────

export interface ICustomerBillingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  sameAsShipping: boolean;
}

export interface ICustomerTransaction {
  id: string;
  customerId: string;
  storeId: string;
  date: string;
  type: 'Invoice' | 'Payment' | 'Credit_Adjustment';
  referenceNo: string;
  amount: number;
  balanceAfter: number;
  notes?: string;
  createdAt?: string;
}

export interface ICustomer {
  id: string;
  storeId: string;
  userId?: string;
  name: string;
  displayName?: string;
  customerType: 'Individual' | 'Business' | 'Retailer' | 'Wholesaler';
  phone: string;
  email: string;
  gstin?: string;
  pan?: string;
  customerCode: string;
  creditLimit: number;
  paymentTerms: string;
  creditPeriodDays: number;
  outstandingAmount: number;
  totalSales: number;
  storeCredit: number;
  loyaltyPoints: number;
  totalOrders: number;
  returnsCount: number;
  status: 'active' | 'inactive';
  tier: 'VIP' | 'Regular' | 'New';
  lastOrderDate?: string;
  location: string;
  billingAddress: ICustomerBillingAddress;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICustomerKPIs {
  totalCustomers: number;
  totalCustomersGrowth: number;
  totalSales: number;
  totalSalesGrowth: number;
  totalOutstanding: number;
  totalOutstandingChange: number;
}

export interface ICustomerListResponse {
  customers: ICustomer[];
  kpis: ICustomerKPIs;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

