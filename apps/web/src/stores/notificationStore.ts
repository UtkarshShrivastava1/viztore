import { create } from 'zustand';

export interface INotificationItem {
  id: string;
  type: 'price_drop' | 'offer' | 'order_update' | 'new_store' | 'review';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  orderId?: string; // e.g. '#ORD-125680' (NEVER '#VZ...')
  targetUrl?: string;
  imageUrl?: string;
}

interface NotificationState {
  notifications: INotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (item: INotificationItem) => void;
  setNotifications: (items: INotificationItem[]) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  markAsRead: (id) =>
    set((state) => {
      const updatedNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.isRead).length,
      };
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  addNotification: (item) =>
    set((state) => {
      const updatedNotifications = [item, ...state.notifications];
      return {
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.isRead).length,
      };
    }),
  setNotifications: (items) =>
    set(() => ({
      notifications: items,
      unreadCount: items.filter((n) => !n.isRead).length,
    })),
}));
