/**
 * ORDERS MODULE — Public Facade
 * ONLY file other modules and app.ts may import from orders/
 */
import { createOrderModule } from './order.module.js';
import type { IOrderFacade, OrderResponse, Page } from './order.types.js';

// Module instance instantiated with defaults
const defaultModule = createOrderModule();

export const orderRouter = defaultModule.router;
export const orderService = defaultModule.service;
export const orderRepository = defaultModule.repository;

import { logger } from '../../shared/utils/logger.js';

export const orderModule: IOrderFacade = {
  getOrderById: async (id: string): Promise<OrderResponse | null> => {
    try {
      return await orderService.getOrderById(id, '__internal__', true);
    } catch (err: any) {
      if (err?.statusCode === 404) return null;
      logger.error('OrderFacade getOrderById failed', { error: err, orderId: id });
      throw err;
    }
  },
  getOrdersByUserId: async (userId: string): Promise<Page<OrderResponse>> => {
    return orderService.getOrdersByUserId(userId);
  },
  markAsDelivered: async (orderId: string, otp: string): Promise<OrderResponse | null> => {
    try {
      return await orderService.updateOrderStatus(orderId, 'DELIVERED' as any, '__internal__', otp);
    } catch (err: any) {
      logger.error('OrderFacade markAsDelivered failed', { error: err, orderId });
      throw err;
    }
  },
  cancelOrder: async (orderId: string, _reason: string): Promise<OrderResponse | null> => {
    try {
      return await orderService.cancelOrder(orderId, '__internal__', true);
    } catch (err: any) {
      logger.error('OrderFacade cancelOrder failed', { error: err, orderId });
      throw err;
    }
  },
};

export { createOrderModule };
export type {
  IOrderFacade,
  IOrderService,
  IOrderRepository,
  OrderResponse,
  OrderItemDTO,
  ShippingAddressDTO,
  CreateOrderDTO,
  UpdateOrderStatusDTO,
} from './order.types.js';
export { OrderStatus } from './order.types.js';
