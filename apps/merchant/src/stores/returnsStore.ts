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

export const initialAvailableOrders: OrderLookupOption[] = [];
export const mockReturnsList: ReturnRecord[] = [];

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
  returns: [],
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
      const res: any = await returnsApi.getReturns();
      const payload = res?.data?.data || res?.data || res;
      const rawList = Array.isArray(payload?.returns)
        ? payload.returns
        : Array.isArray(payload)
        ? payload
        : [];

      const liveItems: ReturnRecord[] = rawList.map((raw: any) => ({
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

      set({ returns: liveItems, isLoading: false, error: null });
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
      const res: any = await returnsApi.createReturn({
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

      const saved = res?.data?.data || res?.data || res;
      if (saved && (saved._id || saved.id || saved.returnNumber)) {
        set((state) => ({
          returns: state.returns.map((r) =>
            r.id === newRecord.id ? { ...r, id: saved._id || saved.id, returnNumber: saved.returnNumber || r.returnNumber } : r
          ),
        }));
        await get().fetchReturns();
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
      await get().fetchReturns();
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
      await get().fetchReturns();
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
      await get().fetchReturns();
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
      await get().fetchReturns();
    } catch (err) {
      console.warn('Live API markAsRefunded failed:', err);
    }
  },
}));
