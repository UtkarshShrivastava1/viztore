import { z } from 'zod';

/**
 * Order Domain Types & Zod Schemas
 */

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}


export enum FulfilmentMode {
  DELIVER = 'deliver',
  PICKUP = 'pickup',
  RESERVE = 'reserve',
}

export enum PaymentMethod {
  UPI = 'upi',
  CARD = 'card',
  NET_BANKING = 'net_banking',
  CASH_ON_DELIVERY = 'cod',
}

// ── Zod Schemas ────────────────────────────────────────────────────────

export const createOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  sku: z.string().optional(),
  name: z.string().min(1, 'Product name is required'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  unitPrice: z.number().nonnegative('Unit price must be non-negative'),
  storeId: z.string().min(1, 'Store ID is required'),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().default('IN'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
});

export const createOrderSchema = z.object({
  storeId: z.string().min(1, 'Store ID is required'),
  items: z.array(createOrderItemSchema).min(1, 'Order must contain at least one item'),
  shippingAddress: shippingAddressSchema,
});

export const updateOrderStatusSchema = z.object({
  status: z.preprocess(
    (val) => (typeof val === 'string' ? val.toUpperCase() : val),
    z.nativeEnum(OrderStatus),
  ),
  deliveryOtp: z.string().length(4, 'Delivery OTP must be 4 digits').optional(),
});

export const verifyOtpSchema = z.object({
  otp: z.string().length(4, 'OTP must be 4 digits'),
});

export const orderPaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// ── Inferred DTO Types ─────────────────────────────────────────────────

export type CreateOrderItemDto = z.infer<typeof createOrderItemSchema>;
export type ShippingAddressDto = z.infer<typeof shippingAddressSchema>;
export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;
export type OrderPaginationDto = z.infer<typeof orderPaginationSchema>;

export interface IOrderItem {
  productId: string;
  sku?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  storeId: string;
}

export interface IOrder {
  _id?: string;
  id?: string;
  orderNumber: string;
  userId: string;
  storeId: string;
  items: IOrderItem[];
  shippingAddress: ShippingAddressDto;
  subtotal: number;
  tax: number;
  shippingFee: number;
  grandTotal: number;
  status: OrderStatus;
  deliveryOtp?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

