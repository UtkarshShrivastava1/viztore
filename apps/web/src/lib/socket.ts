import { io, Socket } from 'socket.io-client';

export interface CustomerSocketNotificationPayload {
  notificationId: string;
  recipientId: string;
  recipientRole: string;
  category: 'order' | 'inventory' | 'system' | 'promo';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  createdAt?: string;
}

export interface CustomerSocketOrderPayload {
  orderId: string;
  orderNumber?: string;
  status?: string;
  newStatus?: string;
  riderName?: string;
  deliveryOtp?: string;
  grandTotal?: number;
  itemsCount?: number;
}

type NotificationListener = (payload: CustomerSocketNotificationPayload) => void;
type OrderListener = (payload: CustomerSocketOrderPayload) => void;

function getSocketBaseUrl(): string {
  if (typeof window === 'undefined') return 'http://localhost:5000';
  
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }

  const host = window.location.hostname;
  const isProd =
    host === 'viztore.com' ||
    host.endsWith('.viztore.com') ||
    host.endsWith('.vercel.app') ||
    (!host.includes('localhost') && !host.includes('127.0.0.1'));

  if (isProd) {
    return 'https://api.viztore.com';
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  return apiUrl.replace(/\/api\/v1\/?$/, '');
}

class CustomerSocketClient {
  private socket: Socket | null = null;
  private currentUserId: string | null = null;
  private notificationListeners = new Set<NotificationListener>();
  private orderListeners = new Set<OrderListener>();
  private isConnecting = false;

  public connect(userId?: string): Socket | null {
    if (typeof window === 'undefined') return null;

    if (userId) {
      this.currentUserId = userId;
    }

    if (this.socket?.connected) {
      if (this.currentUserId) {
        this.socket.emit('join_room', `user:${this.currentUserId}`);
      }
      return this.socket;
    }

    if (this.isConnecting) return this.socket;
    this.isConnecting = true;

    try {
      const url = getSocketBaseUrl();
      const token = localStorage.getItem('token');

      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        auth: { token: token || undefined },
        reconnectionAttempts: 15,
        reconnectionDelay: 1500,
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        this.isConnecting = false;
        if (this.currentUserId) {
          this.socket?.emit('join_room', `user:${this.currentUserId}`);
        }
      });

      this.socket.on('disconnect', () => {
        this.isConnecting = false;
      });

      this.socket.on('notification.created', (payload: CustomerSocketNotificationPayload) => {
        this.notificationListeners.forEach((listener) => {
          try {
            listener(payload);
          } catch (e) {
            void e;
          }
        });
      });

      const orderEvents = [
        'order.placed',
        'order.confirmed',
        'order.cancelled',
        'order.delivered',
        'delivery.assigned',
        'delivery.pickup_verified',
        'delivery.completed',
      ];

      orderEvents.forEach((evt) => {
        this.socket?.on(evt, (payload: CustomerSocketOrderPayload) => {
          this.orderListeners.forEach((listener) => {
            try {
              listener(payload);
            } catch (e) {
              void e;
            }
          });
        });
      });

      return this.socket;
    } catch {
      this.isConnecting = false;
      return null;
    }
  }

  public joinUserRoom(userId: string): void {
    this.currentUserId = userId;
    if (this.socket?.connected) {
      this.socket.emit('join_room', `user:${userId}`);
    } else {
      this.connect(userId);
    }
  }

  public joinOrderRoom(orderId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join_room', `order:${orderId}`);
    }
  }

  public leaveOrderRoom(orderId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_room', `order:${orderId}`);
    }
  }

  public onNotification(listener: NotificationListener): () => void {
    this.notificationListeners.add(listener);
    return () => this.notificationListeners.delete(listener);
  }

  public onOrderUpdate(listener: OrderListener): () => void {
    this.orderListeners.add(listener);
    return () => this.orderListeners.delete(listener);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }
}

export const customerSocket = new CustomerSocketClient();

