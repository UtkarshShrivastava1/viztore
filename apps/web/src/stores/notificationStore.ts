import { useAuthStore } from '@/stores/auth.store';
import { create } from 'zustand';
import { notificationsApi, type ICustomerNotification } from '@/lib/api/notifications';

export interface INotificationItem {
  id: string;
  type: 'price_drop' | 'offer' | 'order_update' | 'new_store' | 'review';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  orderId?: string; // e.g. '#ORD-125680'
  targetUrl?: string;
  imageUrl?: string;
  category?: 'order' | 'inventory' | 'system' | 'promo';
  createdAt?: string;
}

interface NotificationState {
  notifications: INotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: (category?: string) => Promise<void>;
  fetchUnreadSummary: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (item: INotificationItem) => void;
  setNotifications: (items: INotificationItem[]) => void;
}

function mapApiNotification(n: ICustomerNotification): INotificationItem {
  const typeMap: Record<string, INotificationItem['type']> = {
    order: 'order_update',
    promo: 'offer',
    inventory: 'price_drop',
    system: 'review',
  };

  const id = n._id || n.id || '';
  const orderId = (n.data?.orderNumber as string) || (n.data?.orderId as string) || undefined;
  const targetUrl = n.data?.orderId
    ? `/account/orders/${n.data.orderId}`
    : orderId
      ? `/account/orders/${orderId}`
      : undefined;

  return {
    id,
    type: typeMap[n.category] || 'order_update',
    category: n.category,
    title: n.title,
    description: n.message,
    timestamp: n.createdAt
      ? new Date(n.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
      : 'Recent',
    createdAt: n.createdAt,
    isRead: Boolean(n.isRead),
    orderId,
    targetUrl,
  };
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (category?: string) => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) return;
    try {
      set({ isLoading: true });
      const apiCategory = category === 'all' ? undefined : category;
      const data = await notificationsApi.getNotifications({ category: apiCategory });
      const mapped = (data || []).map(mapApiNotification);
      const unread = mapped.filter((n) => !n.isRead).length;
      set({
        notifications: mapped,
        unreadCount: unread,
        isLoading: false,
      });
    } catch (err) {
      const isAuth = (err as { statusCode?: number })?.statusCode === 401;
      if (isAuth && typeof window !== 'undefined') {
        try { useAuthStore.getState().logout(); } catch (e) { void e; }
      }
      set({ isLoading: false });
    }
  },

  fetchUnreadSummary: async () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) return;
    try {
      const summary = await notificationsApi.getUnreadSummary();
      set({ unreadCount: summary?.unreadCount || 0 });
    } catch {
      // ignore
    }
  },

  markAsRead: async (id: string) => {
    if (!id) return;
    const current = get().notifications;
    const updated = current.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    set({
      notifications: updated,
      unreadCount: updated.filter((n) => !n.isRead).length,
    });

    try {
      await notificationsApi.markAsRead(id);
    } catch (err) {
      console.warn('Failed to sync markAsRead to backend:', err);
    }
  },

  markAllAsRead: async () => {
    const current = get().notifications;
    const updated = current.map((n) => ({ ...n, isRead: true }));
    set({
      notifications: updated,
      unreadCount: 0,
    });

    try {
      await notificationsApi.markAllAsRead();
    } catch (err) {
      console.warn('Failed to sync markAllAsRead to backend:', err);
    }
  },

  addNotification: (item: INotificationItem) => {
    const updated = [item, ...get().notifications];
    set({
      notifications: updated,
      unreadCount: updated.filter((n) => !n.isRead).length,
    });
  },

  setNotifications: (items: INotificationItem[]) => {
    set({
      notifications: items,
      unreadCount: items.filter((n) => !n.isRead).length,
    });
  },
}));
