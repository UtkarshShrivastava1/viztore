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

  // Workflow actions
  addReturn: (data: any) => void;
  approveReturn: (id: string) => void;
  rejectReturn: (id: string, reason: string) => void;
  initiateRefund: (id: string) => void;
  markAsRefunded: (id: string) => void;
}

export const useReturnsStore = create<ReturnsState>((set, get) => ({
  returns: mockReturnsList,
  activeTab: 'All Returns',
  searchQuery: '',
  statusFilter: 'All Statuses',
  typeFilter: 'All Types',
  dateRange: 'Last 7 Days',
  selectedReturnIds: [],
  selectedReturn: null,
  activeView: 'overview',

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
      dateRange: 'Last 7 Days',
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

  addReturn: (data) => {
    const nextNum = Math.floor(10026 + Math.random() * 900);
    const newRecord: ReturnRecord = {
      ...data,
      id: `rtn-${nextNum}`,
      returnNumber: `#RTN${nextNum}`,
      returnDate: '18 May 2024',
      returnTime: '10:30 AM',
    };
    set((state) => ({
      returns: [newRecord, ...state.returns],
      activeView: 'overview',
    }));
  },

  approveReturn: (id) => {
    set((state) => ({
      returns: state.returns.map((r) =>
        r.id === id ? { ...r, status: 'Approved' } : r
      ),
    }));
  },

  rejectReturn: (id, reason) => {
    set((state) => ({
      returns: state.returns.map((r) =>
        r.id === id ? { ...r, status: 'Rejected', rejectionReason: reason } : r
      ),
    }));
  },

  initiateRefund: (id) => {
    set((state) => ({
      returns: state.returns.map((r) =>
        r.id === id ? { ...r, status: 'Refunded' } : r
      ),
    }));
  },

  markAsRefunded: (id) => {
    set((state) => ({
      returns: state.returns.map((r) =>
        r.id === id ? { ...r, status: 'Refunded' } : r
      ),
    }));
  },
}));
