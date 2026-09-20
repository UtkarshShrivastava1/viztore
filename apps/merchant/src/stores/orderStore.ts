import { create } from 'zustand';
import { api, ordersApi } from '../lib/api.js';

export type OrderTab =
  | 'new_orders'
  | 'accepted'
  | 'ready_to_ship'
  | 'shipped'
  | 'delivered'
  | 'all_orders'
  | 'cancelled'
  | 'returns';

export type OrderStatus =
  | 'new'
  | 'accepted'
  | 'ready_to_ship'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned';

export interface OrderItemDetail {
  id: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface MerchantOrderRecord {
  id: string;
  orderNumber: string;
  orderType: 'Online Order' | 'Manual In-Store' | 'Express Delivery';
  status: OrderStatus;
  customer: {
    name: string;
    email: string;
    phone: string;
    avatarInitials?: string;
  };
  deliveryAddress: {
    street: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
    fullText: string;
  };
  items: OrderItemDetail[];
  itemsSummary: {
    count: number;
    title: string;
    extraCount?: number;
    categoryIconType: 'tshirt' | 'kurti' | 'jeans' | 'saree' | 'dress' | 'shorts';
  };
  pricing: {
    itemsTotal: number;
    packagingFee: number;
    deliveryFee: number;
    discount?: number;
    totalAmount: number;
  };
  payment: {
    status: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
    paymentMethod: 'Online Paid' | 'Cash on Delivery' | 'Card / POS';
    mode: 'UPI' | 'Card' | 'Cash' | 'NetBanking';
  };
  otp: string; // 4-digit runner verification code
  timestamps: {
    createdAt: string; // e.g. "19 May 2024 09:42 AM"
    acceptedAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
    returnRequestedAt?: string;
  };
  courier?: {
    partner: string;
    trackingId: string;
    trackingUrl?: string;
  };
  cancellation?: {
    reason: string;
    refundStatus: string;
  };
  returns?: {
    returnStatus: string;
    refundStatus: string;
    returnReason: string;
  };
  currentStageName?: string;
  notes?: {
    customerInstructions?: string;
    merchantNotes?: string;
  };
}

interface OrderStoreState {
  orders: MerchantOrderRecord[];
  isLoading: boolean;
  error: string | null;
  activeTab: OrderTab;
  searchQuery: string;
  paymentStatusFilter: string;
  orderStatusFilter: string;
  fulfillmentTypeFilter: string;
  dateRange: string;
  selectedOrderIds: string[];

  // Actions
  fetchOrders: (storeId?: string) => Promise<void>;
  setActiveTab: (tab: OrderTab) => void;
  setSearchQuery: (query: string) => void;
  setPaymentStatusFilter: (status: string) => void;
  setOrderStatusFilter: (status: string) => void;
  setFulfillmentTypeFilter: (type: string) => void;
  setDateRange: (range: string) => void;
  toggleOrderSelection: (orderId: string) => void;
  selectAllOrders: (orderIds: string[]) => void;
  clearSelection: () => void;

  // Pipeline transitions
  acceptOrder: (orderId: string) => void;
  acceptAllNewOrders: () => void;
  rejectOrder: (orderId: string) => void;
  markReadyToShip: (orderId: string) => void;
  dispatchOrder: (orderId: string) => void;
  addManualOrder: (newOrder: Partial<MerchantOrderRecord>) => void;
}

export function mapApiOrderToMerchantRecord(apiOrder: any): MerchantOrderRecord {
  let mappedStatus: OrderStatus = 'new';
  const raw = String(apiOrder.status || '').toUpperCase();
  if (raw === 'CONFIRMED' || raw === 'ACCEPTED' || raw === 'PROCESSING') mappedStatus = 'accepted';
  else if (raw === 'PACKED' || raw === 'READY_TO_SHIP') mappedStatus = 'ready_to_ship';
  else if (raw === 'SHIPPED' || raw === 'OUT_FOR_DELIVERY') mappedStatus = 'shipped';
  else if (raw === 'DELIVERED') mappedStatus = 'delivered';
  else if (raw === 'CANCELLED') mappedStatus = 'cancelled';
  else if (raw === 'RETURN_REQUESTED') mappedStatus = 'return_requested';
  else if (raw === 'RETURNED') mappedStatus = 'returned';
  else mappedStatus = 'new';

  const items: OrderItemDetail[] = (apiOrder.items || []).map((it: any, idx: number) => ({
    id: it.productId || `item-${idx}`,
    name: it.name || 'Product Item',
    variant: it.sku || undefined,
    price: it.unitPrice || 0,
    quantity: it.quantity || 1,
    imageUrl: it.imageUrl,
  }));

  const firstItemName = items[0]?.name || 'Standard Item';
  const customerName = apiOrder.shippingAddress?.fullName || 'Customer';
  const initials = customerName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return {
    id: apiOrder._id || apiOrder.id,
    orderNumber: apiOrder.orderNumber || `#ORD-${(apiOrder._id || '').slice(-5)}`,
    orderType: 'Online Order',
    status: mappedStatus,
    customer: {
      name: customerName,
      email: apiOrder.customerEmail || 'customer@example.com',
      phone: apiOrder.shippingAddress?.phone || '+91 98765 43210',
      avatarInitials: initials || 'CS',
    },
    deliveryAddress: {
      street: apiOrder.shippingAddress?.street || '',
      locality: apiOrder.shippingAddress?.city || '',
      city: apiOrder.shippingAddress?.city || '',
      state: apiOrder.shippingAddress?.state || '',
      pincode: apiOrder.shippingAddress?.postalCode || '',
      fullText: `${apiOrder.shippingAddress?.street || ''}, ${apiOrder.shippingAddress?.city || ''}, ${apiOrder.shippingAddress?.state || ''} - ${apiOrder.shippingAddress?.postalCode || ''}`,
    },
    items,
    itemsSummary: {
      count: items.reduce((acc: number, curr: OrderItemDetail) => acc + curr.quantity, 0) || 1,
      title: firstItemName,
      extraCount: items.length > 1 ? items.length - 1 : undefined,
      categoryIconType: 'tshirt',
    },
    pricing: {
      itemsTotal: apiOrder.subtotal || 0,
      packagingFee: 20,
      deliveryFee: apiOrder.shippingFee || 0,
      totalAmount: apiOrder.grandTotal || 0,
    },
    payment: {
      status:
        apiOrder.status === 'delivered' ||
        apiOrder.status === 'confirmed' ||
        apiOrder.status === 'packed' ||
        apiOrder.status === 'out_for_delivery'
          ? 'Paid'
          : 'Pending',
      paymentMethod: 'Online Paid',
      mode: 'UPI',
    },
    otp: apiOrder.deliveryOtp || '0000',
    timestamps: {
      createdAt: apiOrder.createdAt
        ? new Date(apiOrder.createdAt).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Recent',
      deliveredAt: apiOrder.deliveredAt
        ? new Date(apiOrder.deliveredAt).toLocaleString('en-IN')
        : undefined,
    },
    currentStageName:
      mappedStatus === 'new'
        ? 'New Order'
        : mappedStatus === 'accepted'
        ? 'Accepted'
        : mappedStatus === 'ready_to_ship'
        ? 'Ready to Ship'
        : mappedStatus === 'shipped'
        ? 'Shipped'
        : mappedStatus === 'delivered'
        ? 'Delivered'
        : 'Cancelled',
  };
}

export const useOrderStore = create<OrderStoreState>((set, get) => {
  const getInitialTab = (): OrderTab => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('merchant_active_order_tab') as OrderTab | null;
      if (saved) return saved;
    }
    return 'new_orders';
  };

  return {
    orders: [],
    isLoading: false,
    error: null,
    activeTab: getInitialTab(),
    searchQuery: '',
    paymentStatusFilter: 'all',
    orderStatusFilter: 'all',
    fulfillmentTypeFilter: 'all',
    dateRange: 'Recent Orders',
    selectedOrderIds: [],

    fetchOrders: async (storeId?: string) => {
      set({ isLoading: true, error: null });
      try {
        const endpoint = storeId ? `/orders/store/${storeId}` : '/orders/all';
        const rawData = await api.get<any[]>(endpoint).catch(async () => {
          // Fallback to my-orders if /orders/all is forbidden
          return await api.get<any[]>('/orders');
        });
        const orderList = Array.isArray(rawData) ? rawData : (rawData as any)?.data || [];
        const mapped = orderList.map(mapApiOrderToMerchantRecord);
        set({ orders: mapped, isLoading: false });
      } catch (err: any) {
        console.warn('Could not fetch orders from API:', err?.message || err);
        set({ orders: [], isLoading: false, error: err?.message || 'Failed to fetch orders' });
      }
    },

    setActiveTab: (tab) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('merchant_active_order_tab', tab);
      }
      set({ activeTab: tab, selectedOrderIds: [] });
    },
    setSearchQuery: (query) => set({ searchQuery: query }),
    setPaymentStatusFilter: (status) => set({ paymentStatusFilter: status }),
    setOrderStatusFilter: (status) => set({ orderStatusFilter: status }),
    setFulfillmentTypeFilter: (type) => set({ fulfillmentTypeFilter: type }),
    setDateRange: (range) => set({ dateRange: range }),

    toggleOrderSelection: (orderId) =>
      set((state) => ({
        selectedOrderIds: state.selectedOrderIds.includes(orderId)
          ? state.selectedOrderIds.filter((id) => id !== orderId)
          : [...state.selectedOrderIds, orderId],
      })),

    selectAllOrders: (orderIds) => set({ selectedOrderIds: orderIds }),
    clearSelection: () => set({ selectedOrderIds: [] }),

    acceptOrder: async (orderId) => {
      try {
        await ordersApi.updateOrderStatus(orderId, 'CONFIRMED');
      } catch (err) {
        console.warn('API update order status error:', err);
      }
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId
            ? { ...o, status: 'accepted', currentStageName: 'Accepted (Just now)' }
            : o
        ),
      }));
    },

    acceptAllNewOrders: async () => {
      const newOrders = get().orders.filter((o) => o.status === 'new');
      for (const order of newOrders) {
        try {
          await ordersApi.updateOrderStatus(order.id, 'CONFIRMED');
        } catch (err) {
          console.warn('API update order status error:', err);
        }
      }
      set((state) => ({
        orders: state.orders.map((o) =>
          o.status === 'new'
            ? { ...o, status: 'accepted', currentStageName: 'Accepted (Just now)' }
            : o
        ),
      }));
    },

    rejectOrder: async (orderId) => {
      try {
        await ordersApi.updateOrderStatus(orderId, 'CANCELLED');
      } catch (err) {
        console.warn('API update order status error:', err);
      }
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: 'cancelled',
                cancellation: {
                  reason: 'Rejected by Merchant',
                  refundStatus: 'Refund Initiated',
                },
                currentStageName: 'Cancelled (Just now)',
              }
            : o
        ),
      }));
    },

    markReadyToShip: async (orderId) => {
      try {
        await ordersApi.updateOrderStatus(orderId, 'PACKED');
      } catch (err) {
        console.warn('API update order status error:', err);
      }
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId
            ? { ...o, status: 'ready_to_ship', currentStageName: 'Ready to Ship (Just now)' }
            : o
        ),
      }));
    },

    dispatchOrder: async (orderId) => {
      try {
        await ordersApi.updateOrderStatus(orderId, 'OUT_FOR_DELIVERY');
      } catch (err) {
        console.warn('API update order status error:', err);
      }
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: 'shipped',
                courier: {
                  partner: 'Local Express Delivery',
                  trackingId: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
                  trackingUrl: '#track',
                },
                timestamps: {
                  ...o.timestamps,
                  shippedAt: 'Just now',
                },
                currentStageName: 'Shipped (Just now)',
              }
            : o
        ),
      }));
    },

    addManualOrder: (newOrder) => {
    const nextNum = Math.floor(10330 + Math.random() * 50);
    const fullOrder: MerchantOrderRecord = {
      id: `ord-man-${Date.now()}`,
      orderNumber: `#ORD-${nextNum}`,
      orderType: newOrder.orderType || 'Manual In-Store',
      status: newOrder.status || 'new',
      customer: newOrder.customer || {
        name: 'Walk-in Customer',
        email: 'customer@example.com',
        phone: '+91 99999 00000',
        avatarInitials: 'WC',
      },
      deliveryAddress: newOrder.deliveryAddress || {
        street: 'Store Self-Pickup',
        locality: 'In-Store',
        city: 'Local Store',
        state: 'Local',
        pincode: '000000',
        fullText: 'In-Store Customer Pickup',
      },
      items: newOrder.items || [],
      itemsSummary: newOrder.itemsSummary || {
        count: newOrder.items?.length || 1,
        title: newOrder.items?.[0]?.name || 'Manual Item',
        categoryIconType: 'tshirt',
      },
      pricing: newOrder.pricing || {
        itemsTotal: 1000,
        packagingFee: 20,
        deliveryFee: 40,
        totalAmount: 1060,
      },
      payment: newOrder.payment || {
        status: 'Paid',
        paymentMethod: 'Online Paid',
        mode: 'UPI',
      },
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      timestamps: {
        createdAt: 'Just now',
      },
      currentStageName: 'New Order (Just now)',
      notes: newOrder.notes,
    };

    set((state) => ({
      orders: [fullOrder, ...state.orders],
      activeTab: 'new_orders',
    }));
  },
  };
});
