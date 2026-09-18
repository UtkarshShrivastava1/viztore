import { api } from './client.js';
import type {
  CreateOrderDto,
  IOrder,
} from '@repo/shared-types';

export const ordersApi = {
  /**
   * Fetch customer's own order history
   */
  getMyOrders: async (): Promise<IOrder[]> => {
    const res = await api.get<IOrder[]>('/orders/my-orders');
    return res.data;
  },

  /**
   * Fetch details of a single order by ID
   */
  getOrderById: async (orderId: string): Promise<IOrder> => {
    const res = await api.get<IOrder>(`/orders/${orderId}`);
    return res.data;
  },

  /**
   * Create a new order (checkout submission)
   */
  createOrder: async (dto: CreateOrderDto): Promise<IOrder> => {
    const res = await api.post<IOrder>('/orders', dto);
    return res.data;
  },
};
