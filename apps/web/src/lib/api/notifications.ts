import { api } from './client.js';

export interface ICustomerNotification {
  _id: string;
  id?: string;
  recipientId: string;
  recipientRole: string;
  category: 'order' | 'inventory' | 'system' | 'promo';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  /**
   * Fetch customer notifications with optional category filter
   */
  getNotifications: async (params?: { category?: string; page?: number; limit?: number }): Promise<ICustomerNotification[]> => {
    try {
      const res = await api.get<ICustomerNotification[]>('/notifications', params);
      return res.data || [];
    } catch (err) {
      console.warn('Failed to fetch notifications:', err);
      return [];
    }
  },

  /**
   * Fetch unread notifications count
   */
  getUnreadSummary: async (): Promise<{ unreadCount: number }> => {
    try {
      const res = await api.get<{ unreadCount: number }>('/notifications/unread-summary');
      return res.data || { unreadCount: 0 };
    } catch (err) {
      return { unreadCount: 0 };
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ updatedCount: number }> => {
    const res = await api.patch<{ updatedCount: number }>('/notifications/read-all');
    return res.data;
  },

  /**
   * Mark a single notification as read
   */
  markAsRead: async (id: string): Promise<ICustomerNotification> => {
    const res = await api.patch<ICustomerNotification>(`/notifications/${id}/read`);
    return res.data;
  },
};
