import { z } from 'zod';

export type ReturnStatus =
  | 'Pending'
  | 'Approved'
  | 'Refunded'
  | 'Rejected'
  | 'Exchange Initiated';

export type ReturnType = 'Return' | 'Exchange' | 'Refund Only';

export interface IReturnItem {
  productId: string;
  name: string;
  variant?: string;
  sku?: string;
  price: number;
  quantity: number;
  returnQuantity: number;
  imageUrl?: string;
}

export interface IReturnCustomer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface IReturn {
  _id?: string;
  id?: string;
  returnNumber: string;
  orderId: string;
  orderNumber: string;
  storeId: string;
  customerId?: string;
  customer: IReturnCustomer;
  product: IReturnItem;
  items?: IReturnItem[];
  returnType: ReturnType;
  reason: string;
  amount: number;
  status: ReturnStatus;
  returnDate: string;
  returnTime?: string;
  refundMethod: string;
  refundAmount: number;
  pickupDate?: string;
  pickupTime?: string;
  pickupAddress?: string;
  rejectionReason?: string;
  comments?: string;
  internalNote?: string;
  notifyCustomer?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IReturnsSummary {
  totalReturns: number;
  pendingReturns: number;
  approvedReturns: number;
  refundedCount: number;
  rejectedCount: number;
  totalRefundAmount: number;
  pendingRefundAmount: number;
}

export const createReturnInputSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  orderNumber: z.string().min(1, 'Order Number is required'),
  storeId: z.string().optional(),
  returnType: z.enum(['Return', 'Exchange', 'Refund Only']).default('Return'),
  reason: z.string().min(2, 'Return reason is required'),
  amount: z.number().nonnegative(),
  customer: z.object({
    name: z.string().min(1),
    phone: z.string().min(10),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
  }),
  product: z.object({
    productId: z.string().optional(),
    name: z.string().min(1),
    variant: z.string().optional().default('Standard'),
    sku: z.string().optional().default('SKU-001'),
    price: z.number().nonnegative(),
    quantity: z.number().int().positive().default(1),
    returnQuantity: z.number().int().positive().default(1),
    imageUrl: z.string().optional(),
  }),
  refundMethod: z.string().optional().default('Original Payment'),
  pickupAddress: z.string().optional(),
  comments: z.string().optional(),
});

export type CreateReturnInput = z.infer<typeof createReturnInputSchema>;

