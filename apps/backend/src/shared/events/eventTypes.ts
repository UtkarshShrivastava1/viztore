export const EVENTS = {
  USER_REGISTERED: 'user.registered',
  ORDER_PLACED: 'order.placed',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_DELIVERED: 'order.delivered',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  DELIVERY_ASSIGNED: 'delivery.assigned',
  DELIVERY_COMPLETED: 'delivery.completed',
  PRODUCT_OUT_OF_STOCK: 'product.outOfStock',
  NOTIFICATION_CREATED: 'notification.created',
} as const;

export type EventName = typeof EVENTS[keyof typeof EVENTS];

export interface UserRegisteredPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export interface OrderPlacedPayload {
  orderId: string;
  orderNumber: string;
  userId: string;
  storeId: string;
  grandTotal: number;
  itemsCount: number;
  customerPhone?: string;
  deliveryOtp?: string;
  correlationId?: string;
}

export interface OrderStatusChangedPayload {
  orderId: string;
  orderNumber: string;
  previousStatus: string;
  newStatus: string;
  actorUserId?: string;
  customerPhone?: string;
}

export interface PaymentSucceededPayload {
  orderId: string;
  paymentId: string;
  amount: number;
}

export interface DeliveryAssignedPayload {
  orderId: string;
  riderId: string;
  estimatedMinutes: number;
  riderPhone?: string;
  riderName?: string;
  dispatchMessage?: string;
  customerPhone?: string;
  deliveryOtp?: string;
}

export interface ProductOutOfStockPayload {
  productId: string;
  sku: string;
  storeId: string;
}

export interface NotificationCreatedPayload {
  notificationId: string;
  recipientId: string;
  recipientRole: string;
  category: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  createdAt: Date | string;
}

export interface EventPayloadMap {
  [EVENTS.USER_REGISTERED]: UserRegisteredPayload;
  [EVENTS.ORDER_PLACED]: OrderPlacedPayload;
  [EVENTS.ORDER_CONFIRMED]: OrderStatusChangedPayload;
  [EVENTS.ORDER_CANCELLED]: OrderStatusChangedPayload;
  [EVENTS.ORDER_DELIVERED]: OrderStatusChangedPayload;
  [EVENTS.PAYMENT_SUCCEEDED]: PaymentSucceededPayload;
  [EVENTS.DELIVERY_ASSIGNED]: DeliveryAssignedPayload;
  [EVENTS.DELIVERY_COMPLETED]: OrderStatusChangedPayload;
  [EVENTS.PRODUCT_OUT_OF_STOCK]: ProductOutOfStockPayload;
  [EVENTS.NOTIFICATION_CREATED]: NotificationCreatedPayload;
}

