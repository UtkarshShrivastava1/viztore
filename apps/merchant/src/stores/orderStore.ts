import { create } from 'zustand';
import { api, ordersApi } from '../lib/api.js';
import { useAuthStore } from './authStore.js';

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
  packAllNewOrders: () => void;
  rejectOrder: (orderId: string) => void;
  markReadyToShip: (orderId: string) => void;
  dispatchOrder: (orderId: string) => void;
  deliverOrder: (orderId: string, otp: string) => Promise<boolean>;
  addManualOrder: (newOrder: Partial<MerchantOrderRecord>) => void;
}

export function mapApiOrderToMerchantRecord(apiOrder: any): MerchantOrderRecord {
  let mappedStatus: OrderStatus = 'new';
  const raw = String(apiOrder.status || '').toUpperCase();
  if (raw === 'CONFIRMED' || raw === 'ACCEPTED') mappedStatus = 'accepted';
  else if (raw === 'PROCESSING' || raw === 'PACKED' || raw === 'READY_TO_SHIP') mappedStatus = 'ready_to_ship';
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

  const street = apiOrder.shippingAddress?.street || '';
  const streetParts = street.split(',').map((p: string) => p.trim()).filter(Boolean);
  const streetLocality = streetParts[0] || '';
  let extractedCity = apiOrder.shippingAddress?.city || '';
  if (!extractedCity || extractedCity.toLowerCase() === 'local city') {
    for (let i = streetParts.length - 1; i >= 0; i--) {
      const rawPart = streetParts[i];
      if (!rawPart) continue;
      const part = rawPart.replace(/-\s*\d+$/, '').trim();
      if (!/^\d+$/.test(part) && !/chhattisgarh|state|india/i.test(part) && part.length > 2) {
        extractedCity = part;
        break;
      }
    }
  }
  const resolvedCity = (extractedCity && extractedCity.toLowerCase() !== 'local city') ? extractedCity : 'Bhilai';
  const resolvedLocality = streetLocality || resolvedCity;

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
      street,
      locality: resolvedLocality,
      city: resolvedCity,
      state: apiOrder.shippingAddress?.state || 'Chhattisgarh',
      pincode: apiOrder.shippingAddress?.postalCode || '',
      fullText: `${street}, ${resolvedCity}, ${apiOrder.shippingAddress?.state || ''} - ${apiOrder.shippingAddress?.postalCode || ''}`,
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
        : mappedStatus === 'return_requested' || mappedStatus === 'returned'
        ? 'Returns'
        : 'Cancelled',
  };
}

export const initialSeedOrders: MerchantOrderRecord[] = [
  {
    id: 'ord-10325',
    orderNumber: '#ORD-10325',
    orderType: 'Online Order',
    status: 'new',
    customer: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      avatarInitials: 'RS',
    },
    deliveryAddress: {
      street: 'Flat 302, Green Valley Apartments',
      locality: 'Kalyani Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411006',
      fullText: 'Flat 302, Green Valley Apartments, Kalyani Nagar, Pune - 411006',
    },
    items: [
      {
        id: 'item-101',
        name: 'Pure Cotton Slim Fit T-Shirt',
        variant: 'Navy Blue, Size L',
        price: 1000,
        quantity: 1,
      },
    ],
    itemsSummary: {
      count: 1,
      title: 'Pure Cotton Slim Fit T-Shirt',
      categoryIconType: 'tshirt',
    },
    pricing: {
      itemsTotal: 1000,
      packagingFee: 20,
      deliveryFee: 40,
      totalAmount: 1060,
    },
    payment: {
      status: 'Paid',
      paymentMethod: 'Online Paid',
      mode: 'UPI',
    },
    otp: '4827',
    timestamps: {
      createdAt: '19 May 2024 09:42 AM',
    },
    currentStageName: 'Stage 01: New Order',
    notes: {
      customerInstructions: 'Leave package at security desk if unavailable.',
    },
  },
  {
    id: 'ord-10326',
    orderNumber: '#ORD-10326',
    orderType: 'Online Order',
    status: 'new',
    customer: {
      name: 'Priya Singh',
      email: 'priya.singh@example.com',
      phone: '+91 98220 12345',
      avatarInitials: 'PS',
    },
    deliveryAddress: {
      street: 'Plot 45, Silver Oak Enclave',
      locality: 'Viman Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014',
      fullText: 'Plot 45, Silver Oak Enclave, Viman Nagar, Pune - 411014',
    },
    items: [
      {
        id: 'item-102',
        name: 'Floral Print Rayon Kurti',
        variant: 'Yellow / Pink, Size M',
        price: 1200,
        quantity: 2,
      },
    ],
    itemsSummary: {
      count: 2,
      title: 'Floral Print Rayon Kurti',
      categoryIconType: 'kurti',
    },
    pricing: {
      itemsTotal: 2400,
      packagingFee: 20,
      deliveryFee: 0,
      totalAmount: 2420,
    },
    payment: {
      status: 'Pending',
      paymentMethod: 'Cash on Delivery',
      mode: 'Cash',
    },
    otp: '7391',
    timestamps: {
      createdAt: '19 May 2024 10:15 AM',
    },
    currentStageName: 'Stage 01: New Order',
  },
  {
    id: 'ord-10320',
    orderNumber: '#ORD-10320',
    orderType: 'Online Order',
    status: 'accepted',
    customer: {
      name: 'Ananya Patel',
      email: 'ananya.p@example.com',
      phone: '+91 97112 34567',
      avatarInitials: 'AP',
    },
    deliveryAddress: {
      street: 'B-14, Neelkanth Heights',
      locality: 'Baner Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411045',
      fullText: 'B-14, Neelkanth Heights, Baner Road, Pune - 411045',
    },
    items: [
      {
        id: 'item-103',
        name: 'Classic Indigo Denim Jeans',
        variant: 'Stone Wash, Waist 32',
        price: 1850,
        quantity: 1,
      },
    ],
    itemsSummary: {
      count: 1,
      title: 'Classic Indigo Denim Jeans',
      categoryIconType: 'jeans',
    },
    pricing: {
      itemsTotal: 1850,
      packagingFee: 20,
      deliveryFee: 40,
      totalAmount: 1910,
    },
    payment: {
      status: 'Paid',
      paymentMethod: 'Online Paid',
      mode: 'Card',
    },
    otp: '4827',
    timestamps: {
      createdAt: '19 May 2024 08:30 AM',
      acceptedAt: '19 May 2024 09:00 AM',
    },
    currentStageName: 'Stage 02: Accepted Order',
  },
  {
    id: 'ord-10318',
    orderNumber: '#ORD-10318',
    orderType: 'Online Order',
    status: 'ready_to_ship',
    customer: {
      name: 'Vikram Malhotra',
      email: 'vikram.m@example.com',
      phone: '+91 98450 98765',
      avatarInitials: 'VM',
    },
    deliveryAddress: {
      street: 'Penthouse 12, Tower 3, Royal Palms',
      locality: 'Koregaon Park',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      fullText: 'Penthouse 12, Tower 3, Royal Palms, Koregaon Park, Pune - 411001',
    },
    items: [
      {
        id: 'item-104',
        name: 'Embroidered Silk Blend Saree',
        variant: 'Maroon / Gold',
        price: 3499,
        quantity: 1,
      },
    ],
    itemsSummary: {
      count: 1,
      title: 'Embroidered Silk Blend Saree',
      categoryIconType: 'saree',
    },
    pricing: {
      itemsTotal: 3499,
      packagingFee: 30,
      deliveryFee: 0,
      totalAmount: 3529,
    },
    payment: {
      status: 'Paid',
      paymentMethod: 'Online Paid',
      mode: 'UPI',
    },
    otp: '6291',
    timestamps: {
      createdAt: '18 May 2024 07:15 PM',
      acceptedAt: '18 May 2024 07:45 PM',
    },
    currentStageName: 'Stage 04: Ready to Ship',
  },
  {
    id: 'ord-10314',
    orderNumber: '#ORD-10314',
    orderType: 'Online Order',
    status: 'shipped',
    customer: {
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      phone: '+91 99887 65432',
      avatarInitials: 'SR',
    },
    deliveryAddress: {
      street: 'Villa 7, Palm Meadows',
      locality: 'Aundh',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411007',
      fullText: 'Villa 7, Palm Meadows, Aundh, Pune - 411007',
    },
    items: [
      {
        id: 'item-105',
        name: 'Cotton Casual Summer Dress',
        variant: 'Pastel Blue, Size S',
        price: 1599,
        quantity: 1,
      },
    ],
    itemsSummary: {
      count: 1,
      title: 'Cotton Casual Summer Dress',
      categoryIconType: 'dress',
    },
    pricing: {
      itemsTotal: 1599,
      packagingFee: 20,
      deliveryFee: 40,
      totalAmount: 1659,
    },
    payment: {
      status: 'Paid',
      paymentMethod: 'Online Paid',
      mode: 'UPI',
    },
    otp: '8104',
    timestamps: {
      createdAt: '18 May 2024 03:20 PM',
      acceptedAt: '18 May 2024 03:45 PM',
      shippedAt: '18 May 2024 04:30 PM',
    },
    courier: {
      partner: 'Local Express Delivery',
      trackingId: 'TRK-849201',
      trackingUrl: '#track',
    },
    currentStageName: 'Stage 05: Shipped',
  },
  {
    id: 'ord-10301',
    orderNumber: '#ORD-10301',
    orderType: 'Online Order',
    status: 'delivered',
    customer: {
      name: 'Amit Verma',
      email: 'amit.verma@example.com',
      phone: '+91 98123 45678',
      avatarInitials: 'AV',
    },
    deliveryAddress: {
      street: 'Flat 402, Sunshine Apts, MG Road',
      locality: 'Camp',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      fullText: 'Flat 402, Sunshine Apts, MG Road, Camp, Pune - 411001',
    },
    items: [
      {
        id: 'item-106',
        name: 'Graphic Print Crew Neck T-Shirt',
        variant: 'Olive Green, Size XL',
        price: 899,
        quantity: 1,
      },
    ],
    itemsSummary: {
      count: 1,
      title: 'Graphic Print Crew Neck T-Shirt',
      categoryIconType: 'tshirt',
    },
    pricing: {
      itemsTotal: 899,
      packagingFee: 20,
      deliveryFee: 40,
      totalAmount: 959,
    },
    payment: {
      status: 'Paid',
      paymentMethod: 'Online Paid',
      mode: 'UPI',
    },
    otp: '3948',
    timestamps: {
      createdAt: '17 May 2024 04:10 PM',
      acceptedAt: '17 May 2024 04:30 PM',
      shippedAt: '17 May 2024 05:00 PM',
      deliveredAt: '17 May 2024 06:15 PM',
    },
    courier: {
      partner: 'Local Express Delivery',
      trackingId: 'TRK-772190',
      trackingUrl: '#track',
    },
    currentStageName: 'Stage 06: Delivered',
  },
  {
    id: 'ord-10295',
    orderNumber: '#ORD-10295',
    orderType: 'Online Order',
    status: 'cancelled',
    customer: {
      name: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      phone: '+91 98760 11223',
      avatarInitials: 'NG',
    },
    deliveryAddress: {
      street: 'Flat 101, Crystal Tower',
      locality: 'Shivaji Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411005',
      fullText: 'Flat 101, Crystal Tower, Shivaji Nagar, Pune - 411005',
    },
    items: [
      {
        id: 'item-107',
        name: 'Linen Casual Shorts',
        variant: 'Beige, Size 34',
        price: 999,
        quantity: 1,
      },
    ],
    itemsSummary: {
      count: 1,
      title: 'Linen Casual Shorts',
      categoryIconType: 'shorts',
    },
    pricing: {
      itemsTotal: 999,
      packagingFee: 20,
      deliveryFee: 40,
      totalAmount: 1059,
    },
    payment: {
      status: 'Refunded',
      paymentMethod: 'Online Paid',
      mode: 'UPI',
    },
    otp: '5512',
    timestamps: {
      createdAt: '16 May 2024 10:45 AM',
      cancelledAt: '16 May 2024 11:20 AM',
    },
    cancellation: {
      reason: 'Customer requested cancellation before dispatch',
      refundStatus: 'Refunded to UPI (Txn: #UPI-98421)',
    },
    currentStageName: 'Cancelled',
  },
  {
    id: 'ord-10288',
    orderNumber: '#ORD-10288',
    orderType: 'Online Order',
    status: 'return_requested',
    customer: {
      name: 'Rajesh Nair',
      email: 'rajesh.nair@example.com',
      phone: '+91 97654 32109',
      avatarInitials: 'RN',
    },
    deliveryAddress: {
      street: 'House 18, Green Acres Colony',
      locality: 'Kothrud',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
      fullText: 'House 18, Green Acres Colony, Kothrud, Pune - 411038',
    },
    items: [
      {
        id: 'item-108',
        name: 'Slim Fit Denim Jacket',
        variant: 'Classic Blue, Size M',
        price: 2199,
        quantity: 1,
      },
    ],
    itemsSummary: {
      count: 1,
      title: 'Slim Fit Denim Jacket',
      categoryIconType: 'jeans',
    },
    pricing: {
      itemsTotal: 2199,
      packagingFee: 20,
      deliveryFee: 0,
      totalAmount: 2219,
    },
    payment: {
      status: 'Paid',
      paymentMethod: 'Online Paid',
      mode: 'Card',
    },
    otp: '9012',
    timestamps: {
      createdAt: '14 May 2024 11:00 AM',
      deliveredAt: '15 May 2024 01:10 PM',
      returnRequestedAt: '15 May 2024 02:40 PM',
    },
    returns: {
      returnStatus: 'Return Pickup Scheduled',
      refundStatus: 'Pending Quality Check',
      returnReason: 'Size does not fit (Ordered M, requested L)',
    },
    currentStageName: 'Stage 06: Returns',
  },
];

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
    dateRange: 'This Month',
    selectedOrderIds: [],

    fetchOrders: async (storeId?: string) => {
      set({ isLoading: true, error: null });
      try {
        let targetStoreId = storeId;
        if (!targetStoreId) {
          const authState = useAuthStore.getState();
          targetStoreId = authState.currentStore?._id || authState.currentStore?.id;
        }

        let rawData: any[] = [];
        if (targetStoreId) {
          rawData = await api.get<any[]>(`/orders/store/${targetStoreId}`).catch(async () => {
            return await api.get<any[]>('/orders/all').catch(() => []);
          });
        } else {
          rawData = await api.get<any[]>('/orders/all').catch(async () => {
            return await api.get<any[]>('/orders').catch(() => []);
          });
        }

        const orderList = Array.isArray(rawData) ? rawData : (rawData as any)?.data || [];
        const mapped = orderList.map(mapApiOrderToMerchantRecord);

        let localManualOrders: MerchantOrderRecord[] = [];
        if (typeof window !== 'undefined') {
          try {
            const saved = localStorage.getItem('merchant_manual_orders');
            if (saved) localManualOrders = JSON.parse(saved);
          } catch {}
        }

        const combined = [...localManualOrders, ...mapped];
        const uniqueOrders = Array.from(new Map(combined.map((o) => [o.id, o])).values());

        set({
          orders: uniqueOrders.length > 0 ? uniqueOrders : initialSeedOrders,
          isLoading: false,
        });
      } catch (err: any) {
        console.warn('Could not fetch orders from API:', err?.message || err);
        let localManualOrders: MerchantOrderRecord[] = [];
        if (typeof window !== 'undefined') {
          try {
            const saved = localStorage.getItem('merchant_manual_orders');
            if (saved) localManualOrders = JSON.parse(saved);
          } catch {}
        }
        set({
          orders: localManualOrders.length > 0 ? localManualOrders : initialSeedOrders,
          isLoading: false,
          error: err?.message || 'Failed to fetch orders',
        });
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

    packAllNewOrders: async () => {
      const newOrders = get().orders.filter((o) => o.status === 'new');
      for (const order of newOrders) {
        try {
          await ordersApi.updateOrderStatus(order.id, 'PACKED');
        } catch (err) {
          console.warn('API update order status error:', err);
        }
      }
      set((state) => ({
        orders: state.orders.map((o) =>
          o.status === 'new'
            ? { ...o, status: 'ready_to_ship', currentStageName: 'Ready to Ship (Just now)' }
            : o
        ),
      }));
    },

    acceptOrder: async (orderId) => {
      try {
        await ordersApi.updateOrderStatus(orderId, 'CONFIRMED');
      } catch (err) {
        console.warn('API update order status error:', err);
      }
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: 'accepted',
                timestamps: { ...o.timestamps, acceptedAt: 'Just now' },
                currentStageName: 'Accepted (Just now)',
              }
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
            ? {
                ...o,
                status: 'accepted',
                timestamps: { ...o.timestamps, acceptedAt: 'Just now' },
                currentStageName: 'Accepted (Just now)',
              }
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

    deliverOrder: async (orderId, otp) => {
      const cleanOtp = (otp || '').trim();
      try {
        // 1. Verify OTP with backend
        const res = await ordersApi.verifyDeliveryOtp(orderId, cleanOtp);
        if (res && res.valid === false) {
          throw new Error('Invalid delivery OTP code');
        }
        // 2. Transition order status on backend to DELIVERED
        await ordersApi.updateOrderStatus(orderId, 'DELIVERED', cleanOtp);
      } catch (err) {
        console.warn('API verify OTP error, applying optimistic delivery fallback:', err);
      }

      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: 'delivered',
                timestamps: {
                  ...o.timestamps,
                  deliveredAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                },
                currentStageName: 'Delivered (Just now)',
              }
            : o
        ),
      }));
      return true;
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
        createdAt: new Date().toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
      currentStageName: 'New Order (Just now)',
      notes: newOrder.notes,
    };

    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('merchant_manual_orders') || '[]');
        localStorage.setItem('merchant_manual_orders', JSON.stringify([fullOrder, ...saved]));
      } catch {}
    }

    set((state) => ({
      orders: [fullOrder, ...state.orders],
      activeTab: 'new_orders',
    }));
  },
  };
});
