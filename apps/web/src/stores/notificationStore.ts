import { useAuthStore } from '@/stores/auth.store';
import { create } from 'zustand';
import { notificationsApi, type ICustomerNotification } from '@/lib/api/notifications';
import { playNotificationChimeSound } from '@/lib/notificationSound';

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
  activeFilter: 'all' | 'order' | 'promo' | 'system';
  setActiveFilter: (filter: 'all' | 'order' | 'promo' | 'system') => void;
  fetchNotifications: (category?: string) => Promise<void>;
  fetchUnreadSummary: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (item: INotificationItem) => void;
  addLiveNotification: (item: Partial<INotificationItem> & { title: string; description: string }) => void;
  setNotifications: (items: INotificationItem[]) => void;
  clearAll: () => void;
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return useAuthStore.getState().token || localStorage.getItem('token');
}

export function mapApiNotification(n: ICustomerNotification): INotificationItem {
  const typeMap: Record<string, INotificationItem['type']> = {
    order: 'order_update',
    promo: 'offer',
    inventory: 'price_drop',
    system: 'review',
  };

  const id = n._id || n.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const orderNumber = (n.data?.orderNumber as string) || (n.data?.orderId as string) || undefined;
  const orderId = (n.data?.orderId as string) || orderNumber;
  const targetUrl = n.data?.orderId
    ? `/account/orders/${n.data.orderId}`
    : orderNumber
      ? `/account/orders/${orderNumber}`
      : undefined;

  return {
    id,
    type: typeMap[n.category] || 'order_update',
    category: n.category,
    title: n.title,
    description: n.message,
    timestamp: n.createdAt
      ? formatRelativeTime(n.createdAt)
      : 'Just now',
    createdAt: n.createdAt,
    isRead: Boolean(n.isRead),
    orderId: orderNumber || orderId,
    targetUrl,
  };
}

function formatRelativeTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;

    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return 'Recent';
  }
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  activeFilter: 'all',

  setActiveFilter: (filter) => {
    set({ activeFilter: filter });
  },

  fetchNotifications: async (category?: string) => {
    const token = getStoredToken();
    if (!token) return;

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
    const token = getStoredToken();
    if (!token) return;

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
    const current = get().notifications;
    // Prevent duplicate entries by id
    if (current.some((n) => n.id === item.id)) return;

    const updated = [item, ...current];
    set({
      notifications: updated,
      unreadCount: updated.filter((n) => !n.isRead).length,
    });
  },

  addLiveNotification: (item) => {
    const current = get().notifications;
    const id = item.id || `live_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (current.some((n) => n.id === id)) return;

    const newNotification: INotificationItem = {
      id,
      type: item.type || (item.category === 'promo' ? 'offer' : 'order_update'),
      category: item.category || 'order',
      title: item.title,
      description: item.description,
      timestamp: 'Just now',
      isRead: false,
      orderId: item.orderId,
      targetUrl: item.targetUrl || (item.orderId ? `/account/orders/${item.orderId}` : undefined),
      createdAt: item.createdAt || new Date().toISOString(),
    };

    set({
      notifications: [newNotification, ...current],
      unreadCount: get().unreadCount + 1,
    });

    // Play subtle audio alert for customer
    playNotificationChimeSound();
  },

  setNotifications: (items: INotificationItem[]) => {
    set({
      notifications: items,
      unreadCount: items.filter((n) => !n.isRead).length,
    });
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
