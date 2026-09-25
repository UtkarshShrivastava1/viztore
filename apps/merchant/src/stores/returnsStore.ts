import { create } from 'zustand';

export interface ReturnCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
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
  | 'Exchange Initiated'
  | 'Refunded'
  | 'Rejected';

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
  refundMethod: string;
  refundAmount: number;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  comments?: string;
  internalNote?: string;
  notifyCustomer: boolean;
  rejectionReason?: string;
  inspectionStatus?: 'Pending' | 'Passed' | 'Failed';
  conditionNotes?: string;
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
    customerAddress: '12, Green Park, South Extension, New Delhi - 110049, Delhi',
    orderDate: '18 May 2024, 10:30 AM',
    amount: 1049.0,
    paymentMethod: 'Prepaid',
    product: {
      name: 'Men Solid Cotton Shirt',
      variant: 'Blue, M',
      sku: 'PRD-TSHIRT-RN-BL-M',
      price: 1049.0,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&auto=format&fit=crop&q=80',
    },
  },
  {
    orderNumber: '#ORD10042',
    customerName: 'Sneha Kapoor',
    customerEmail: 'sneha@email.com',
    customerPhone: '9876543211',
    customerAddress: '45, Rosewood Lane, Indiranagar, Bengaluru - 560038, Karnataka',
    orderDate: '18 May 2024, 09:15 AM',
    amount: 1849.0,
    paymentMethod: 'Prepaid',
    product: {
      name: 'Women Floral Dress',
      variant: 'Red, M',
      sku: 'PRD-DRESS-FL-RD-M',
      price: 1849.0,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=120&auto=format&fit=crop&q=80',
    },
  },
  {
    orderNumber: '#ORD10041',
    customerName: 'Arjun Mehta',
    customerEmail: 'arjun@email.com',
    customerPhone: '9876543212',
    customerAddress: '88, Sector 14, Gurugram - 122001, Haryana',
    orderDate: '17 May 2024, 07:45 PM',
    amount: 899.0,
    paymentMethod: 'Prepaid',
    product: {
      name: 'Men Polo T-shirt',
      variant: 'Black, L',
      sku: 'PRD-POLO-BK-L',
      price: 899.0,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=120&auto=format&fit=crop&q=80',
    },
  },
  {
    orderNumber: '#ORD10039',
    customerName: 'Neha Singh',
    customerEmail: 'neha@email.com',
    customerPhone: '9876543213',
    customerAddress: '14, Bandra Kurla Complex, Mumbai - 400051, Maharashtra',
    orderDate: '17 May 2024, 06:20 PM',
    amount: 699.0,
    paymentMethod: 'Prepaid',
    product: {
      name: 'Men Graphic Print T-shirt',
      variant: 'White, L',
      sku: 'PRD-GRAPHIC-WH-L',
      price: 699.0,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80',
    },
  },
  {
    orderNumber: '#ORD10038',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@email.com',
    customerPhone: '9876543214',
    customerAddress: '22A, Model Town, Jalandhar - 144003, Punjab',
    orderDate: '17 May 2024, 03:10 PM',
    amount: 1299.0,
    paymentMethod: 'Prepaid',
    product: {
      name: 'Olive Green Cargo Pants',
      variant: '32',
      sku: 'PRD-CARGO-OLV-32',
      price: 1299.0,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=120&auto=format&fit=crop&q=80',
    },
  },
];

const mockReturnsList: ReturnRecord[] = [
  {
    id: 'rtn-10025',
    returnNumber: '#RTN10025',
    orderNumber: '#ORD10045',
    customer: {
      name: 'Rohan Verma',
      email: 'rohan@email.com',
      phone: '9876543210',
      address: '12, Green Park, South Extension, New Delhi - 110049, Delhi',
    },
    product: {
      name: 'Men Solid Cotton Shirt',
      variant: 'Blue, M',
      sku: 'PRD-TSHIRT-RN-BL-M',
      price: 1049.0,
      quantity: 1,
      returnQuantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&auto=format&fit=crop&q=80',
    },
    returnType: 'Return',
    reason: 'Size issue',
    amount: 1049.0,
    status: 'Pending',
    returnDate: '18 May 2024, 10:30 AM',
    refundMethod: 'Original Payment Method',
    refundAmount: 1049.0,
    pickupDate: '19 May 2024',
    pickupTime: '10:00 AM - 01:00 PM',
    pickupAddress: '12, Green Park, South Extension, New Delhi - 110049, Delhi',
    comments: 'Fabric is great, but size M is slightly tighter around the chest.',
    internalNote: 'Customer contacted support asking for quicker pickup.',
    notifyCustomer: true,
  },
  {
    id: 'rtn-10024',
    returnNumber: '#RTN10024',
    orderNumber: '#ORD10042',
    customer: {
      name: 'Sneha Kapoor',
      email: 'sneha@email.com',
      phone: '9876543211',
      address: '45, Rosewood Lane, Indiranagar, Bengaluru - 560038, Karnataka',
    },
    product: {
      name: 'Women Floral Dress',
      variant: 'Red, M',
      sku: 'PRD-DRESS-FL-RD-M',
      price: 1849.0,
      quantity: 1,
      returnQuantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=120&auto=format&fit=crop&q=80',
    },
    returnType: 'Return',
    reason: 'Product not as described',
    amount: 1849.0,
    status: 'Approved',
    returnDate: '18 May 2024, 09:15 AM',
    refundMethod: 'Original Payment Method',
    refundAmount: 1849.0,
    pickupDate: '19 May 2024',
    pickupTime: '02:00 PM - 05:00 PM',
    pickupAddress: '45, Rosewood Lane, Indiranagar, Bengaluru - 560038, Karnataka',
    comments: 'Print color differs noticeably from the online listing photo.',
    internalNote: 'Approved under 7-day hassle free return policy.',
    notifyCustomer: true,
  },
  {
    id: 'rtn-10023',
    returnNumber: '#RTN10023',
    orderNumber: '#ORD10041',
    customer: {
      name: 'Arjun Mehta',
      email: 'arjun@email.com',
      phone: '9876543212',
      address: '88, Sector 14, Gurugram - 122001, Haryana',
    },
    product: {
      name: 'Men Polo T-shirt',
      variant: 'Black, L',
      sku: 'PRD-POLO-BK-L',
      price: 899.0,
      quantity: 1,
      returnQuantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=120&auto=format&fit=crop&q=80',
    },
    returnType: 'Exchange',
    reason: 'Size issue',
    amount: 899.0,
    status: 'Exchange Initiated',
    returnDate: '17 May 2024, 07:45 PM',
    refundMethod: 'Original Payment Method',
    refundAmount: 899.0,
    pickupDate: '18 May 2024',
    pickupTime: '10:00 AM - 01:00 PM',
    pickupAddress: '88, Sector 14, Gurugram - 122001, Haryana',
    comments: 'Exchange requested for XL size instead of L.',
    internalNote: 'Replacement item reserved in warehouse stock.',
    notifyCustomer: true,
  },
  {
    id: 'rtn-10022',
    returnNumber: '#RTN10022',
    orderNumber: '#ORD10039',
    customer: {
      name: 'Neha Singh',
      email: 'neha@email.com',
      phone: '9876543213',
      address: '14, Bandra Kurla Complex, Mumbai - 400051, Maharashtra',
    },
    product: {
      name: 'Men Graphic Print T-shirt',
      variant: 'White, L',
      sku: 'PRD-GRAPHIC-WH-L',
      price: 699.0,
      quantity: 1,
      returnQuantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80',
    },
    returnType: 'Return',
    reason: 'Fabric quality',
    amount: 699.0,
    status: 'Refunded',
    returnDate: '17 May 2024, 06:20 PM',
    refundMethod: 'Store Credit / Wallet',
    refundAmount: 699.0,
    pickupDate: '18 May 2024',
    pickupTime: '02:00 PM - 05:00 PM',
    pickupAddress: '14, Bandra Kurla Complex, Mumbai - 400051, Maharashtra',
    comments: 'Material felt thinner than expected.',
    internalNote: 'Refund credited directly to customer store wallet balance.',
    notifyCustomer: true,
  },
  {
    id: 'rtn-10021',
    returnNumber: '#RTN10021',
    orderNumber: '#ORD10038',
    customer: {
      name: 'Rahul Sharma',
      email: 'rahul@email.com',
      phone: '9876543214',
      address: '22A, Model Town, Jalandhar - 144003, Punjab',
    },
    product: {
      name: 'Olive Green Cargo Pants',
      variant: '32',
      sku: 'PRD-CARGO-OLV-32',
      price: 1299.0,
      quantity: 1,
      returnQuantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=120&auto=format&fit=crop&q=80',
    },
    returnType: 'Return',
    reason: 'Received wrong item',
    amount: 1299.0,
    status: 'Rejected',
    returnDate: '17 May 2024, 03:10 PM',
    refundMethod: 'Original Payment Method',
    refundAmount: 1299.0,
    pickupDate: '18 May 2024',
    pickupTime: '10:00 AM - 01:00 PM',
    pickupAddress: '22A, Model Town, Jalandhar - 144003, Punjab',
    comments: 'Wrong size received in shipment.',
    rejectionReason: 'Item returned does not match serial dispatch security seal.',
    internalNote: 'Serial seal tampered; rejection notice sent via email.',
    notifyCustomer: true,
  },
  {
    id: 'rtn-10020',
    returnNumber: '#RTN10020',
    orderNumber: '#ORD10037',
    customer: {
      name: 'Priya Patel',
      email: 'priya@email.com',
      phone: '9876543215',
      address: '101, Navrangpura, Ahmedabad - 380009, Gujarat',
    },
    product: {
      name: 'Men Checked Shirt',
      variant: 'Red, M',
      sku: 'PRD-CHECKED-RD-M',
      price: 1199.0,
      quantity: 1,
      returnQuantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=120&auto=format&fit=crop&q=80',
    },
    returnType: 'Return',
    reason: 'Too large',
    amount: 1199.0,
    status: 'Pending',
    returnDate: '16 May 2024, 11:05 AM',
    refundMethod: 'Original Payment Method',
    refundAmount: 1199.0,
    pickupDate: '17 May 2024',
    pickupTime: '02:00 PM - 05:00 PM',
    pickupAddress: '101, Navrangpura, Ahmedabad - 380009, Gujarat',
    comments: 'Size M runs bigger than standard sizing.',
    internalNote: 'Awaiting warehouse inspection slot.',
    notifyCustomer: true,
  },
  {
    id: 'rtn-10019',
    returnNumber: '#RTN10019',
    orderNumber: '#ORD10035',
    customer: {
      name: 'Karan Joshi',
      email: 'karan@email.com',
      phone: '9876543216',
      address: '502, Skyline Towers, Jaipur - 302001, Rajasthan',
    },
    product: {
      name: 'Men Solid Polo T-shirt',
      variant: 'Navy, M',
      sku: 'PRD-POLO-NV-M',
      price: 949.0,
      quantity: 1,
      returnQuantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=120&auto=format&fit=crop&q=80',
    },
    returnType: 'Exchange',
    reason: 'Need different size',
    amount: 949.0,
    status: 'Approved',
    returnDate: '16 May 2024, 10:40 AM',
    refundMethod: 'Original Payment Method',
    refundAmount: 949.0,
    pickupDate: '17 May 2024',
    pickupTime: '05:00 PM - 08:00 PM',
    pickupAddress: '502, Skyline Towers, Jaipur - 302001, Rajasthan',
    comments: 'Requesting exchange for Large size.',
    internalNote: 'Exchange order will be dispatched upon pickup receipt.',
    notifyCustomer: true,
  },
];

export type ReturnFilterTab =
  | 'All Returns'
  | 'Pending'
  | 'Approved'
  | 'Refunded'
  | 'Rejected'
  | 'Exchange Requests';

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
  isDetailsDrawerOpen: boolean;
  isSlipModalOpen: boolean;
  isRejectModalOpen: boolean;
  returnToReject: ReturnRecord | null;

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
  setIsDetailsDrawerOpen: (open: boolean) => void;
  setIsSlipModalOpen: (open: boolean) => void;
  setIsRejectModalOpen: (open: boolean) => void;
  setReturnToReject: (ret: ReturnRecord | null) => void;

  // Business Workflow Actions
  addReturn: (newRet: Omit<ReturnRecord, 'id' | 'returnNumber' | 'returnDate'>) => void;
  updateReturn: (id: string, updates: Partial<ReturnRecord>) => void;
  approveReturn: (id: string) => void;
  rejectReturn: (id: string, reason: string) => void;
  initiateRefund: (id: string) => void;
  markAsRefunded: (id: string) => void;
  cancelReturn: (id: string) => void;
  deleteReturn: (id: string) => void;
  bulkApprove: () => void;
  bulkReject: () => void;
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

  isDetailsDrawerOpen: false,
  isSlipModalOpen: false,
  isRejectModalOpen: false,
  returnToReject: null,

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
  setIsDetailsDrawerOpen: (open) => set({ isDetailsDrawerOpen: open }),
  setIsSlipModalOpen: (open) => set({ isSlipModalOpen: open }),
  setIsRejectModalOpen: (open) => set({ isRejectModalOpen: open }),
  setReturnToReject: (ret) => set({ returnToReject: ret }),

  addReturn: (data) => {
    const nextNum = Math.floor(10026 + Math.random() * 900);
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', {
      month: 'short',
    })} ${now.getFullYear()}, ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newRecord: ReturnRecord = {
      ...data,
      id: `rtn-${nextNum}`,
      returnNumber: `#RTN${nextNum}`,
      returnDate: formattedDate,
    };

    set((state) => ({
      returns: [newRecord, ...state.returns],
      activeView: 'overview',
    }));
  },

  updateReturn: (id, updates) =>
    set((state) => ({
      returns: state.returns.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      selectedReturn:
        state.selectedReturn?.id === id
          ? { ...state.selectedReturn, ...updates }
          : state.selectedReturn,
    })),

  approveReturn: (id) => {
    get().updateReturn(id, { status: 'Approved' });
  },

  rejectReturn: (id, reason) => {
    get().updateReturn(id, { status: 'Rejected', rejectionReason: reason });
  },

  initiateRefund: (id) => {
    get().updateReturn(id, { status: 'Refunded' });
  },

  markAsRefunded: (id) => {
    get().updateReturn(id, { status: 'Refunded' });
  },

  cancelReturn: (id) => {
    get().updateReturn(id, { status: 'Rejected', rejectionReason: 'Cancelled by merchant request' });
  },

  deleteReturn: (id) =>
    set((state) => ({
      returns: state.returns.filter((r) => r.id !== id),
      selectedReturnIds: state.selectedReturnIds.filter((item) => item !== id),
      selectedReturn: state.selectedReturn?.id === id ? null : state.selectedReturn,
    })),

  bulkApprove: () => {
    const ids = get().selectedReturnIds;
    set((state) => ({
      returns: state.returns.map((r) =>
        ids.includes(r.id) ? { ...r, status: 'Approved' } : r
      ),
      selectedReturnIds: [],
    }));
  },

  bulkReject: () => {
    const ids = get().selectedReturnIds;
    set((state) => ({
      returns: state.returns.map((r) =>
        ids.includes(r.id)
          ? { ...r, status: 'Rejected', rejectionReason: 'Bulk rejection by merchant' }
          : r
      ),
      selectedReturnIds: [],
    }));
  },
}));
