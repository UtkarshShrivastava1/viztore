import type { Document } from 'mongoose';
import { OrderStatus } from '@repo/shared-types';
export { OrderStatus };



export interface OrderItemDTO {
  productId: string;
  sku?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  storeId: string;
}

export interface ShippingAddressDTO {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface CreateOrderDTO {
  storeId: string;
  items: OrderItemDTO[];
  shippingAddress: ShippingAddressDTO;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  deliveryOtp?: string; // Required when transitioning to DELIVERED
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  userId: string;
  storeId: string;
  items: OrderItemDTO[];
  shippingAddress: ShippingAddressDTO;
  subtotal: number;
  tax: number;
  shippingFee: number;
  grandTotal: number;
  status: OrderStatus;
  deliveryOtp?: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderDocument extends Document {
  userId: string;
  storeId: string;
  orderNumber: string;
  items: OrderItemDTO[];
  shippingAddress: ShippingAddressDTO;
  subtotal: number;
  tax: number;
  shippingFee: number;
  grandTotal: number;
  status: OrderStatus;
  deliveryOtp: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Page<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

export interface IOrderRepository {
  create(dto: CreateOrderDTO & { userId: string }): Promise<OrderResponse>;
  findById(id: string): Promise<OrderResponse | null>;
  findByOrderNumber(orderNumber: string): Promise<OrderResponse | null>;
  findByUserId(userId: string, page: number, limit: number): Promise<Page<OrderResponse>>;
  findByStoreId(storeId: string, page: number, limit: number): Promise<Page<OrderResponse>>;
  findAll(page: number, limit: number): Promise<Page<OrderResponse>>;
  updateStatus(id: string, status: OrderStatus): Promise<OrderResponse | null>;
}

export interface OrderInvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  orderId: string;
  date: string;
  status: OrderStatus;
  seller: {
    name: string;
    address: string;
    phone: string;
    gstin?: string;
  };
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    taxableAmount: number;
    lineTotal: number;
  }>;
  pricing: {
    subtotal: number;
    tax: number;
    cgst: number;
    sgst: number;
    shippingFee: number;
    grandTotal: number;
  };
  deliveryOtp: string;
}

export interface IOrderService {
  createOrder(userId: string, dto: CreateOrderDTO, correlationId?: string): Promise<OrderResponse>;
  getOrderById(id: string, userId: string, isAdminOrMerchant: boolean): Promise<OrderResponse | null>;
  getOrderInvoice(id: string, userId: string, isAdminOrMerchant: boolean): Promise<OrderInvoiceData>;
  getOrdersByUserId(userId: string, page?: number, limit?: number): Promise<Page<OrderResponse>>;
  getOrdersByStoreId(storeId: string, page?: number, limit?: number): Promise<Page<OrderResponse>>;
  getAllOrders(page?: number, limit?: number): Promise<Page<OrderResponse>>;
  updateOrderStatus(
    id: string,
    status: OrderStatus,
    actorUserId: string,
    otp?: string
  ): Promise<OrderResponse | null>;
  verifyDeliveryOtp(id: string, otp: string): Promise<boolean>;
  cancelOrder(id: string, userId: string, isAdmin: boolean): Promise<OrderResponse | null>;
}

export interface IOrderFacade {
  getOrderById(id: string): Promise<OrderResponse | null>;
  getOrdersByUserId(userId: string): Promise<Page<OrderResponse>>;
  markAsDelivered(orderId: string, otp: string): Promise<OrderResponse | null>;
  cancelOrder(orderId: string, reason: string): Promise<OrderResponse | null>;
}
