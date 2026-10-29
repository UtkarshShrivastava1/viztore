import { returnsApi } from '../lib/api.js';
import { create } from 'zustand';

export interface ReturnCustomer {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface ReturnProduct {
  name: string;
  variant: string;
  sku: string;
  price: number;
  quantity: number;
  returnQuantity: number;
  imageUrl: string;
}

export type ReturnStatus =
  | 'Pending'
  | 'Approved'
  | 'Refunded'
  | 'Rejected'
  | 'Exchange Initiated';

export type ReturnType = 'Return' | 'Exchange' | 'Refund Only';

export interface ReturnRecord {
  id: string;
  returnNumber: string;
  orderNumber: string;
  customer: ReturnCustomer;
  product: ReturnProduct;
  returnType: ReturnType;
  reason: string;
  amount: number;
  status: ReturnStatus;
  returnDate: string;
  returnTime?: string;
  refundMethod: string;
  refundAmount: number;
  pickupDate?: string;
  pickupTime?: string;
  pickupAddress?: string;
  comments?: string;
  internalNote?: string;
  notifyCustomer?: boolean;
  rejectionReason?: string;
}

export interface OrderLookupOption {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  orderDate: string;
  amount: number;
  paymentMethod: string;
  product: {
    name: string;
    variant: string;
    sku: string;
    price: number;
    quantity: number;
    imageUrl: string;
  };
}

export const initialAvailableOrders: OrderLookupOption[] = [
  {
    orderNumber: '#ORD10045',
    customerName: 'Rohan Verma',
    customerEmail: 'rohan@email.com',
    customerPhone: '9876543210',
    customerAddress: '12, Green Park, South Extension, New Delhi - 110049',
    orderDate: '18 May 2024, 10:30 AM',
    amount: 1049.0,
    paymentMethod: 'Prepaid',
    product: {
      name: 'Men Solid Cotton Shirt',
      variant: 'Blue, M',
      sku: 'MCS-001',
      price: 1049.0,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&auto=format&fit=crop&q=80',
    },
  },
];

export const mockReturnsList: ReturnRecord[] = [
  {
    id: 'rtn-10025',
    returnNumber: '#RTN10025',
    orderNumber: '#ORD10045',
    customer: {
      name: 'Rohan Verma',
      email: 'rohan@email.com',
      phone: '+91 98765 43210',
      address: '12, Green Park, South Extension, New Delhi - 110049',
    },
    product: {
      name: 'Men Solid Cotton Shirt',
      variant: 'Blue, M',
      sku: 'MCS-001',
      price: 1049.0,
      quantity: 1,
      returnQuantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&auto=format&fit=crop&q=80',
    },
    returnType: 'Return',
    reason: 'Size issue',
    amount: 1049.0,
    status: 'Pending',
    returnDate: '18 May 2024',
    returnTime: '10:30 AM',
    refundMethod: 'Original Payment (UPI)',
    refundAmount: 1049.0,
    pickupDate: '19 May 2024',
    pickupTime: '10:00 AM - 01:00 PM',
    pickupAddress: '12, Green Park, South Extension, New Delhi - 110049',
    comments: 'The size is smaller than expected. Please arrange a return.',
  },
  {
    id: 'rtn-10024',
    returnNumber: '#RTN10024',
    orderNumber: '#ORD10042',
    customer: {
      name: 'Sneha Kapoor',
      email: 'sneha@email.com',
      phone: '+91 98765 43211',
      address: '45, Rosewood Lane, Indiranagar, Bengaluru - 560038',
    },
    product: {
      name: 'Women Floral Dress',
      variant: 'Red, M',
      sku: 'WFD-002',
      price: 1849.0,
      quantity: 1,
      returnQuantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=120&auto=format&fit=crop&q=80',
    },
    returnType: 'Return',
    reason: 'Product not as described',
    amount: 1849.0,
    status: 'Approved',
    returnDate: '18 May 2024',
    returnTime: '09:15 AM',
    refundMethod: 'Original Payment (UPI)',
    refundAmount: 1849.0,
    pickupDate: '19 May 2024',
    pickupTime: '02:00 PM - 05:00 PM',
    pickupAddress: '45, Rosewood Lane, Indiranagar, Bengaluru - 560038',
    comments: 'Fabric pattern differs significantly from the product photos.',
  },
  {
    id: 'rtn-10023',
    returnNumber: '#RTN10023',
    orderNumber: '#ORD10041',
    customer: {
      name: 'Arjun Mehta',
      email: 'arjun@email.com',
      phone: '+91 98765 43212',
      address: '88, Sector 14, Gurugram - 122001',
    },
    product: {
      name: 'Men Polo T-shirt',
      variant: 'Black, L',
      sku: 'MPT-003',
      price: 899.0,
      quantity: 1,
      returnQuantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=120&auto=format&fit=crop&q=80',
    },
    returnType: 'Return',
    reason: 'Size issue',
    amount: 899.0,
    status: 'Refunded',
    returnDate: '17 May 2024',
    returnTime: '06:20 PM',
    refundMethod: 'Original Payment (Credit Card)',
    refundAmount: 899.0,
    comments: 'Fit is too tight around shoulders.',
  },
  {
    id: 'rtn-10022',
    returnNumber: '#RTN10022',
    orderNumber: '#ORD10039',
    customer: {
      name: 'Neha Singh',
      email: 'neha@email.com',
      phone: '+91 98765 43213',
      address: '14, Bandra Kurla Complex, Mumbai - 400051',
    },
    product: {
      name: 'Men Graphic Print T-shirt',
      variant: 'White, L',
      sku: 'MGT-004',
      price: 699.0,
      quantity: 1,
      returnQuantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80',
    },
    returnType: 'Return',
    reason: 'Fabric quality',
    amount: 699.0,
    status: 'Rejected',
    returnDate: '17 May 2024',
    returnTime: '03:10 PM',
    refundMethod: 'Original Payment',
    refundAmount: 699.0,
    comments: 'Material is very thin.',
    rejectionReason: 'Security tag removed and item washed.',
  },
  {
    id: 'rtn-10021',
    returnNumber: '#RTN10021',
    orderNumber: '#ORD10038',
    customer: {
      name: 'Rahul Sharma',
      email: 'rahul@email.com',
      phone: '+91 98765 43214',
      address: '22A, Model Town, Jalandhar - 144003',
    },
    product: {
      name: 'Olive Green Cargo Pants',
      variant: '32',
      sku: 'OGC-005',
      price: 1299.0,
      quantity: 1,
      returnQuantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=120&auto=format&fit=crop&q=80',
    },
    returnType: 'Return',
    reason: 'Received wrong item',
    amount: 1299.0,
    status: 'Pending',
    returnDate: '16 May 2024',
    returnTime: '11:05 AM',
    refundMethod: 'Original Payment (Net Banking)',
    refundAmount: 1299.0,
    comments: 'Received different color than ordered.',
  },
  {
    id: 'rtn-10020',
    returnNumber: '#RTN10020',
    orderNumber: '#ORD10037',
    customer: {
      name: 'Priya Patel',
      email: 'priya@email.com',
      phone: '+91 98765 43215',
      address: '101, Navrangpura, Ahmedabad - 380009',
    },
    product: {
      name: 'Men Checked Shirt',
      variant: 'Red, M',
      sku: 'MCS-006',
      price: 1199.0,
      quantity: 1,
      returnQuantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=120&auto=format&fit=crop&q=80',
    },
    returnType: 'Return',
    reason: 'Too large',
    amount: 1199.0,
    status: 'Approved',
    returnDate: '16 May 2024',
    returnTime: '10:40 AM',
    refundMethod: 'Original Payment (UPI)',
    refundAmount: 1199.0,
    comments: 'Size does not fit properly.',
  },
  {
    id: 'rtn-10019',
    returnNumber: '#RTN10019',
    orderNumber: '#ORD10035',
    customer: {
      name: 'Karan Joshi',
      email: 'karan@email.com',
      phone: '+91 98765 43216',
      address: '502, Skyline Towers, Jaipur - 302001',
    },
    product: {
      name: 'Men Solid Polo T-shirt',
      variant: 'Navy, M',
      sku: 'MSP-007',
      price: 949.0,
      quantity: 1,
      returnQuantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=120&auto=format&fit=crop&q=80',
    },
    returnType: 'Return',
    reason: 'Need different size',
    amount: 949.0,
    status: 'Refunded',
    returnDate: '15 May 2024',
    returnTime: '04:25 PM',
    refundMethod: 'Original Payment (UPI)',
    refundAmount: 949.0,
    comments: 'Required size L instead.',
  },
];

export type ReturnFilterTab =
  | 'All Returns'
  | 'Pending'
  | 'Approved'
  | 'Refunded'
  | 'Rejected';

export interface RaiseRequestPayload {
  returnId: string;
  requestType: 'Complaint' | 'Request';
  reason: string;
  description: string;
  files: string[];
}

interface ReturnsState {
  returns: ReturnRecord[];
  activeTab: ReturnFilterTab;
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  dateRange: string;
  selectedReturnIds: string[];
  selectedReturn: ReturnRecord | null;
  activeView: 'overview' | 'new_return';

  // Modals & Drawers
  isDetailsModalOpen: boolean;
  isDetailsDrawerOpen: boolean;
  isRaiseModalOpen: boolean;
  returnForRaise: ReturnRecord | null;
  isRejectModalOpen: boolean;
  returnToReject: ReturnRecord | null;
  isSlipModalOpen: boolean;

  // Actions
  setActiveTab: (tab: ReturnFilterTab) => void;
  setSearchQuery: (q: string) => void;
  setStatusFilter: (s: string) => void;
  setTypeFilter: (t: string) => void;
  setDateRange: (d: string) => void;
  clearFilters: () => void;
  toggleSelectReturn: (id: string) => void;
  selectAllReturns: () => void;
  deselectAllReturns: () => void;
  setSelectedReturn: (ret: ReturnRecord | null) => void;
  setActiveView: (view: 'overview' | 'new_return') => void;
  setIsDetailsModalOpen: (open: boolean) => void;
  setIsDetailsDrawerOpen: (open: boolean) => void;
  setIsRejectModalOpen: (open: boolean) => void;
  setReturnToReject: (ret: ReturnRecord | null) => void;
  setIsSlipModalOpen: (open: boolean) => void;
  openRaiseModal: (ret: ReturnRecord) => void;
  closeRaiseModal: () => void;
  submitRaiseRequest: (payload: RaiseRequestPayload) => void;

  isLoading: boolean;
  error: string | null;
  fetchReturns: () => Promise<void>;

  // Workflow actions
  addReturn: (data: any) => Promise<void>;
  approveReturn: (id: string, data?: { pickupDate?: string; pickupTime?: string; internalNote?: string }) => Promise<void>;
  rejectReturn: (id: string, reason: string) => Promise<void>;
  initiateRefund: (id: string, data?: { refundAmount?: number; refundMethod?: string }) => Promise<void>;
  markAsRefunded: (id: string) => Promise<void>;
}

export const useReturnsStore = create<ReturnsState>((set, get) => ({
  returns: mockReturnsList,
  activeTab: 'All Returns',
  searchQuery: '',
  statusFilter: 'All Statuses',
  typeFilter: 'All Types',
  dateRange: 'All Time',
  selectedReturnIds: [],
  selectedReturn: null,
  activeView: 'overview',
  isLoading: false,
  error: null,

  isDetailsModalOpen: false,
  isDetailsDrawerOpen: false,
  isRaiseModalOpen: false,
  returnForRaise: null,
  isRejectModalOpen: false,
  returnToReject: null,
  isSlipModalOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTypeFilter: (type) => set({ typeFilter: type }),
  setDateRange: (range) => set({ dateRange: range }),
  clearFilters: () =>
    set({
      searchQuery: '',
      statusFilter: 'All Statuses',
      typeFilter: 'All Types',
      dateRange: 'All Time',
      activeTab: 'All Returns',
    }),

  toggleSelectReturn: (id) =>
    set((state) => ({
      selectedReturnIds: state.selectedReturnIds.includes(id)
        ? state.selectedReturnIds.filter((item) => item !== id)
        : [...state.selectedReturnIds, id],
    })),

  selectAllReturns: () =>
    set((state) => ({
      selectedReturnIds: state.returns.map((r) => r.id),
    })),

  deselectAllReturns: () => set({ selectedReturnIds: [] }),

  setSelectedReturn: (ret) => set({ selectedReturn: ret }),
  setActiveView: (view) => set({ activeView: view }),
  setIsDetailsModalOpen: (open) => set({ isDetailsModalOpen: open }),
  setIsDetailsDrawerOpen: (open) => set({ isDetailsDrawerOpen: open }),
  setIsRejectModalOpen: (open) => set({ isRejectModalOpen: open }),
  setReturnToReject: (ret) => set({ returnToReject: ret }),
  setIsSlipModalOpen: (open) => set({ isSlipModalOpen: open }),

  openRaiseModal: (ret) =>
    set({
      returnForRaise: ret,
      isRaiseModalOpen: true,
    }),

  closeRaiseModal: () =>
    set({
      returnForRaise: null,
      isRaiseModalOpen: false,
    }),

  submitRaiseRequest: (payload) => {
    set((state) => ({
      returns: state.returns.map((r) =>
        r.id === payload.returnId
          ? {
              ...r,
              internalNote: `[${payload.requestType}] ${payload.reason}: ${payload.description}`,
            }
          : r
      ),
      isRaiseModalOpen: false,
      returnForRaise: null,
    }));
  },

  fetchReturns: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await returnsApi.getReturns();
      if (res.data?.success && res.data.data?.returns && Array.isArray(res.data.data.returns)) {
        const liveItems: ReturnRecord[] = res.data.data.returns.map((raw: any) => ({
          id: raw._id || raw.id,
          returnNumber: raw.returnNumber,
          orderNumber: raw.orderNumber,
          customer: {
            name: raw.customer?.name || 'Customer',
            email: raw.customer?.email || '',
            phone: raw.customer?.phone || '',
            address: raw.customer?.address || '',
          },
          product: {
            name: raw.product?.name || 'Item',
            variant: raw.product?.variant || 'Standard',
            sku: raw.product?.sku || 'SKU-001',
            price: raw.product?.price || raw.amount || 0,
            quantity: raw.product?.quantity || 1,
            returnQuantity: raw.product?.returnQuantity || 1,
            imageUrl: raw.product?.imageUrl || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&auto=format&fit=crop&q=80',
          },
          returnType: raw.returnType || 'Return',
          reason: raw.reason || 'General Return',
          amount: raw.amount || 0,
          status: raw.status || 'Pending',
          returnDate: raw.returnDate || new Date(raw.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          returnTime: raw.returnTime || '10:30 AM',
          refundMethod: raw.refundMethod || 'Original Payment',
          refundAmount: raw.refundAmount || raw.amount || 0,
          pickupDate: raw.pickupDate || '',
          pickupTime: raw.pickupTime || '',
          pickupAddress: raw.pickupAddress || '',
          comments: raw.comments || '',
          internalNote: raw.internalNote || '',
          rejectionReason: raw.rejectionReason || '',
        }));

        if (liveItems.length > 0) {
          set({ returns: liveItems, isLoading: false });
          return;
        }
      }
      set({ isLoading: false });
    } catch (err: any) {
      console.warn('Live API fetchReturns failed, falling back to cached list:', err);
      set({ isLoading: false, error: err.message || 'Failed to fetch returns' });
    }
  },

  addReturn: async (data) => {
    const nextNum = Math.floor(10026 + Math.random() * 900);
    const now = new Date();
    const returnDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const returnTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newRecord: ReturnRecord = {
      ...data,
      id: `rtn-${nextNum}`,
      returnNumber: `#RTN${nextNum}`,
      returnDate,
      returnTime,
    };

    set((state) => ({
      returns: [newRecord, ...state.returns],
      activeView: 'overview',
    }));

    try {
      const res = await returnsApi.createReturn({
        orderId: data.orderNumber || `ORD-${nextNum}`,
        orderNumber: data.orderNumber || `#ORD${nextNum}`,
        customer: data.customer,
        product: data.product,
        returnType: data.returnType || 'Return',
        reason: data.reason || 'Return requested',
        amount: data.amount || 0,
        refundMethod: data.refundMethod || 'Original Payment',
        comments: data.comments,
      });

      if (res.data?.success && res.data.data) {
        const saved = res.data.data;
        set((state) => ({
          returns: state.returns.map((r) =>
            r.id === newRecord.id ? { ...r, id: saved._id, returnNumber: saved.returnNumber } : r
          ),
        }));
      }
    } catch (err) {
      console.warn('Failed to persist return to live backend:', err);
    }
  },

  approveReturn: async (id, data) => {
    set((state) => ({
      returns: state.returns.map((r) =>
        r.id === id ? { ...r, status: 'Approved', pickupDate: data?.pickupDate || r.pickupDate, pickupTime: data?.pickupTime || r.pickupTime } : r
      ),
      selectedReturn: state.selectedReturn?.id === id
        ? { ...state.selectedReturn, status: 'Approved', pickupDate: data?.pickupDate || state.selectedReturn.pickupDate }
        : state.selectedReturn,
    }));

    try {
      await returnsApi.approveReturn(id, data);
    } catch (err) {
      console.warn('Live API approveReturn failed:', err);
    }
  },

  rejectReturn: async (id, reason) => {
    set((state) => ({
      returns: state.returns.map((r) =>
        r.id === id ? { ...r, status: 'Rejected', rejectionReason: reason } : r
      ),
      selectedReturn: state.selectedReturn?.id === id
        ? { ...state.selectedReturn, status: 'Rejected', rejectionReason: reason }
        : state.selectedReturn,
      isRejectModalOpen: false,
      returnToReject: null,
    }));

    try {
      await returnsApi.rejectReturn(id, reason);
    } catch (err) {
      console.warn('Live API rejectReturn failed:', err);
    }
  },

  initiateRefund: async (id, data) => {
    set((state) => ({
      returns: state.returns.map((r) =>
        r.id === id ? { ...r, status: 'Refunded', refundAmount: data?.refundAmount || r.refundAmount } : r
      ),
      selectedReturn: state.selectedReturn?.id === id
        ? { ...state.selectedReturn, status: 'Refunded' }
        : state.selectedReturn,
    }));

    try {
      await returnsApi.processRefund(id, data);
    } catch (err) {
      console.warn('Live API processRefund failed:', err);
    }
  },

  markAsRefunded: async (id) => {
    set((state) => ({
      returns: state.returns.map((r) =>
        r.id === id ? { ...r, status: 'Refunded' } : r
      ),
      selectedReturn: state.selectedReturn?.id === id
        ? { ...state.selectedReturn, status: 'Refunded' }
        : state.selectedReturn,
    }));

    try {
      await returnsApi.processRefund(id);
    } catch (err) {
      console.warn('Live API markAsRefunded failed:', err);
    }
  },
}));
