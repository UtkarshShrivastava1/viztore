import { io, Socket } from 'socket.io-client';
import { playOrderAlertChime } from './audioAlert.js';
import { useOrderStore } from '../stores/orderStore.js';

export interface OrderPlacedSocketPayload {
  orderId: string;
  orderNumber: string;
  userId?: string;
  storeId?: string;
  grandTotal: number;
  itemsCount: number;
  customerPhone?: string;
  deliveryOtp?: string;
  timestamp?: string;
}

type OrderPlacedCallback = (order: OrderPlacedSocketPayload) => void;

class MerchantSocketClient {
  private socket: Socket | null = null;
  private currentStoreId: string | null = null;
  private orderPlacedListeners: Set<OrderPlacedCallback> = new Set();
  private isConnecting: boolean = false;

  private getSocketUrl(): string {
    const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');
    // Strip trailing /api/v1 if present to target base Socket.io server
    return import.meta.env.VITE_WS_URL || rawApiUrl.replace(/\/api\/v1\/?$/, '') || 'http://localhost:5000';
  }

  public connect(storeId?: string): Socket | null {
    if (typeof window === 'undefined') return null;

    if (storeId) {
      this.currentStoreId = storeId;
    }

    if (this.socket?.connected) {
      if (this.currentStoreId) {
        this.socket.emit('join_room', `store:${this.currentStoreId}`);
      }
      return this.socket;
    }

    if (this.isConnecting) return this.socket;
    this.isConnecting = true;

    try {
      const url = this.getSocketUrl();
      const token = localStorage.getItem('access_token');

      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        auth: { token: token || undefined },
        reconnectionAttempts: 10,
        reconnectionDelay: 1500,
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        this.isConnecting = false;
        if (this.currentStoreId) {
          this.socket?.emit('join_room', `store:${this.currentStoreId}`);
        }
      });

      this.socket.on('disconnect', () => {
        this.isConnecting = false;
      });

      this.socket.on('connect_error', () => {
        this.isConnecting = false;
      });

      // Handle Order Placed event (matching both dot and colon format)
      const handleOrderPlaced = (payload: OrderPlacedSocketPayload) => {
        // 1. Play audible arrival chime
        playOrderAlertChime();

        // 2. Refresh active orders in store
        if (this.currentStoreId) {
          useOrderStore.getState().fetchOrders(this.currentStoreId);
        } else {
          useOrderStore.getState().fetchOrders();
        }

        // 3. Dispatch to all registered UI subscribers
        this.orderPlacedListeners.forEach((callback) => {
          try {
            callback(payload);
          } catch {
            // Safe listener execution
          }
        });
      };

      this.socket.on('order.placed', handleOrderPlaced);
      this.socket.on('order:placed', handleOrderPlaced);
      this.socket.on('ORDER_PLACED', handleOrderPlaced);

      return this.socket;
    } catch {
      this.isConnecting = false;
      return null;
    }
  }

  public setStoreId(storeId: string): void {
    const previous = this.currentStoreId;
    this.currentStoreId = storeId;

    if (this.socket?.connected && storeId) {
      if (previous && previous !== storeId) {
        this.socket.emit('leave_room', `store:${previous}`);
      }
      this.socket.emit('join_room', `store:${storeId}`);
    }
  }

  public onOrderPlaced(callback: OrderPlacedCallback): () => void {
    this.orderPlacedListeners.add(callback);
    return () => {
      this.orderPlacedListeners.delete(callback);
    };
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  public isConnected(): boolean {
    return Boolean(this.socket?.connected);
  }

  public triggerTestArrival(testPayload?: Partial<OrderPlacedSocketPayload>): void {
    const simulated: OrderPlacedSocketPayload = {
      orderId: `test-${Date.now()}`,
      orderNumber: testPayload?.orderNumber || `#ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      grandTotal: testPayload?.grandTotal || 1250,
      itemsCount: testPayload?.itemsCount || 2,
      customerPhone: '+91 98765 43210',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      ...testPayload,
    };

    playOrderAlertChime();
    this.orderPlacedListeners.forEach((cb) => cb(simulated));
  }
}

export const merchantSocket = new MerchantSocketClient();
