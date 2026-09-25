import { create } from 'zustand';

export type CustomerType = 'Individual' | 'Business' | 'Retailer' | 'Wholesaler';
export type CustomerStatus = 'active' | 'inactive';
export type CustomerTier = 'VIP' | 'Regular' | 'New';

export interface CustomerOrderSummary {
  orderId: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  status: 'delivered' | 'processing' | 'shipped' | 'cancelled';
  paymentMethod: string;
}

export interface StoreCreditHistory {
  id: string;
  date: string;
  type: 'add' | 'deduct';
  amount: number;
  balanceAfter: number;
  reason: string;
}

export interface CustomerBillingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  sameAsShipping: boolean;
}

export interface Customer {
  id: string;
  name: string;
  customerType: CustomerType;
  phone: string;
  email: string;
  displayName?: string;
  gstin?: string;
  pan?: string;
  customerCode?: string;
  creditLimit?: number;
  paymentTerms: string;
  creditPeriodDays: number;
  outstandingAmount: number;
  totalSales: number;
  storeCredit: number;
  loyaltyPoints: number;
  totalOrders: number;
  returnsCount: number;
  status: CustomerStatus;
  tier: CustomerTier;
  lastOrderDate: string;
  location: string;
  billingAddress: CustomerBillingAddress;
  notes?: string;
  recentOrders: CustomerOrderSummary[];
  creditHistory: StoreCreditHistory[];
}

export interface CustomerKPIs {
  totalCustomers: number;
  totalCustomersGrowth: number;
  activeCustomers: number;
  activeCustomersGrowth: number;
  totalSales: number;
  totalSalesGrowth: number;
  totalOutstanding: number;
  totalOutstandingChange: number;
  creditCustomers: number;
  creditCustomersPercent: number;
}

interface CustomerState {
  customers: Customer[];
  kpis: CustomerKPIs;
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  paymentTermsFilter: string;
  locationFilter: string;
  activeTab: 'all' | 'active' | 'inactive';
  viewMode: 'list' | 'add';
  selectedCustomerId: string | null;
  isCreditModalOpen: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setTypeFilter: (type: string) => void;
  setPaymentTermsFilter: (terms: string) => void;
  setLocationFilter: (location: string) => void;
  clearFilters: () => void;
  setActiveTab: (tab: 'all' | 'active' | 'inactive') => void;
  setViewMode: (mode: 'list' | 'add') => void;
  setSelectedCustomerId: (id: string | null) => void;
  setIsCreditModalOpen: (open: boolean) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'recentOrders' | 'creditHistory' | 'outstandingAmount' | 'totalSales' | 'storeCredit' | 'loyaltyPoints' | 'totalOrders' | 'returnsCount' | 'tier' | 'lastOrderDate' | 'location'> & { location?: string; openingBalance?: number }) => void;
  addStoreCredit: (customerId: string, amount: number, reason: string) => void;
  deductStoreCredit: (customerId: string, amount: number, reason: string) => void;
}

const initialCustomers: Customer[] = [
  {
    id: 'CUS-1001',
    name: 'Ramesh Stores',
    customerType: 'Retailer',
    phone: '98765 43210',
    email: 'ramesh@stores.com',
    displayName: 'Ramesh Stores Wholesale & Retail',
    gstin: '23ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    customerCode: 'RS-01',
    creditLimit: 50000,
    paymentTerms: '15 Days',
    creditPeriodDays: 15,
    outstandingAmount: 18450.0,
    totalSales: 125430.0,
    storeCredit: 1250.0,
    loyaltyPoints: 340,
    totalOrders: 14,
    returnsCount: 1,
    status: 'active',
    tier: 'VIP',
    lastOrderDate: '18 Sep 2026',
    location: 'Indore',
    billingAddress: {
      addressLine1: '45, MG Road, Commercial Complex',
      addressLine2: 'Near Chhappan Dukan',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452001',
      country: 'India',
      sameAsShipping: true,
    },
    notes: 'Preferred buyer for bulk cotton and synthetic blended apparel.',
    recentOrders: [
      { orderId: '#ORD-10045', date: '18 Sep 2026', itemsCount: 6, totalAmount: 14200, status: 'delivered', paymentMethod: 'UPI' },
      { orderId: '#ORD-10032', date: '05 Sep 2026', itemsCount: 4, totalAmount: 8900, status: 'delivered', paymentMethod: 'Net Banking' },
      { orderId: '#ORD-10018', date: '21 Aug 2026', itemsCount: 10, totalAmount: 24500, status: 'delivered', paymentMethod: 'Credit Terms' },
    ],
    creditHistory: [
      { id: 'CR-101', date: '10 Sep 2026', type: 'add', amount: 500, balanceAfter: 1250, reason: 'Promotional loyalty incentive' },
      { id: 'CR-100', date: '15 Aug 2026', type: 'add', amount: 750, balanceAfter: 750, reason: 'Return adjustment #RET-3049' },
    ],
  },
  {
    id: 'CUS-1002',
    name: 'Sharma Garments',
    customerType: 'Wholesaler',
    phone: '87654 32109',
    email: 'sharma.garments@gmail.com',
    displayName: 'Sharma Garments Distributors',
    gstin: '23ABCDE2345F1Z6',
    pan: 'ABCDE2345F',
    customerCode: 'SG-02',
    creditLimit: 150000,
    paymentTerms: '30 Days',
    creditPeriodDays: 30,
    outstandingAmount: 52230.0,
    totalSales: 360920.0,
    storeCredit: 3400.0,
    loyaltyPoints: 1120,
    totalOrders: 28,
    returnsCount: 2,
    status: 'active',
    tier: 'VIP',
    lastOrderDate: '20 Sep 2026',
    location: 'Bhopal',
    billingAddress: {
      addressLine1: 'Plot 12, New Market Sector B',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462003',
      country: 'India',
      sameAsShipping: true,
    },
    notes: 'High-volume wholesale distributor with consistent 30-day clearance cycle.',
    recentOrders: [
      { orderId: '#ORD-10051', date: '20 Sep 2026', itemsCount: 15, totalAmount: 48600, status: 'delivered', paymentMethod: 'Bank Transfer' },
      { orderId: '#ORD-10039', date: '12 Sep 2026', itemsCount: 12, totalAmount: 39500, status: 'delivered', paymentMethod: 'Credit Terms' },
    ],
    creditHistory: [
      { id: 'CR-102', date: '12 Sep 2026', type: 'add', amount: 1500, balanceAfter: 3400, reason: 'Early settlement rebate' },
    ],
  },
  {
    id: 'CUS-1003',
    name: 'Kiran Collection',
    customerType: 'Retailer',
    phone: '76543 21098',
    email: 'kiran.collection@outlook.com',
    displayName: 'Kiran Collection Boutique',
    gstin: '23ABCDE3456F1Z7',
    pan: 'ABCDE3456F',
    customerCode: 'KC-03',
    creditLimit: 30000,
    paymentTerms: '15 Days',
    creditPeriodDays: 15,
    outstandingAmount: 0.0,
    totalSales: 98760.0,
    storeCredit: 650.0,
    loyaltyPoints: 480,
    totalOrders: 9,
    returnsCount: 0,
    status: 'active',
    tier: 'Regular',
    lastOrderDate: '15 Sep 2026',
    location: 'Ujjain',
    billingAddress: {
      addressLine1: '78 Freeganj Main Street',
      city: 'Ujjain',
      state: 'Madhya Pradesh',
      pincode: '456010',
      country: 'India',
      sameAsShipping: true,
    },
    recentOrders: [
      { orderId: '#ORD-10041', date: '15 Sep 2026', itemsCount: 5, totalAmount: 11400, status: 'delivered', paymentMethod: 'UPI' },
    ],
    creditHistory: [],
  },
  {
    id: 'CUS-1004',
    name: 'New Look Fashion',
    customerType: 'Wholesaler',
    phone: '65432 10987',
    email: 'newlook.fashion@gmail.com',
    displayName: 'New Look Fashion Hub',
    gstin: '23ABCDE4567F1Z8',
    pan: 'ABCDE4567F',
    customerCode: 'NL-04',
    creditLimit: 100000,
    paymentTerms: '30 Days',
    creditPeriodDays: 30,
    outstandingAmount: 32500.0,
    totalSales: 240150.0,
    storeCredit: 0.0,
    loyaltyPoints: 720,
    totalOrders: 18,
    returnsCount: 1,
    status: 'active',
    tier: 'VIP',
    lastOrderDate: '19 Sep 2026',
    location: 'Indore',
    billingAddress: {
      addressLine1: 'Shop 104, Rajwada Market',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452002',
      country: 'India',
      sameAsShipping: true,
    },
    recentOrders: [
      { orderId: '#ORD-10048', date: '19 Sep 2026', itemsCount: 8, totalAmount: 26000, status: 'delivered', paymentMethod: 'Credit Terms' },
    ],
    creditHistory: [],
  },
  {
    id: 'CUS-1005',
    name: 'Manoj Collection',
    customerType: 'Retailer',
    phone: '54321 09876',
    email: 'manoj.collection@gmail.com',
    displayName: 'Manoj Retailers',
    gstin: '23ABCDE5678F1Z9',
    pan: 'ABCDE5678F',
    customerCode: 'MC-05',
    creditLimit: 25000,
    paymentTerms: '15 Days',
    creditPeriodDays: 15,
    outstandingAmount: 0.0,
    totalSales: 76340.0,
    storeCredit: 450.0,
    loyaltyPoints: 310,
    totalOrders: 7,
    returnsCount: 0,
    status: 'active',
    tier: 'Regular',
    lastOrderDate: '11 Sep 2026',
    location: 'Dewas',
    billingAddress: {
      addressLine1: 'Station Road, Opp. Bus Stand',
      city: 'Dewas',
      state: 'Madhya Pradesh',
      pincode: '455001',
      country: 'India',
      sameAsShipping: true,
    },
    recentOrders: [
      { orderId: '#ORD-10036', date: '11 Sep 2026', itemsCount: 3, totalAmount: 7800, status: 'delivered', paymentMethod: 'UPI' },
    ],
    creditHistory: [],
  },
  {
    id: 'CUS-1006',
    name: 'Goyal Textiles',
    customerType: 'Wholesaler',
    phone: '43210 98765',
    email: 'goyal.textiles@gmail.com',
    displayName: 'Goyal Textiles Agency',
    gstin: '23ABCDE6789F1Z0',
    pan: 'ABCDE6789F',
    customerCode: 'GT-06',
    creditLimit: 200000,
    paymentTerms: '45 Days',
    creditPeriodDays: 45,
    outstandingAmount: 110250.0,
    totalSales: 485670.0,
    storeCredit: 5200.0,
    loyaltyPoints: 1850,
    totalOrders: 35,
    returnsCount: 3,
    status: 'active',
    tier: 'VIP',
    lastOrderDate: '21 Sep 2026',
    location: 'Gwalior',
    billingAddress: {
      addressLine1: 'Lashkar Sarafa Bazar',
      city: 'Gwalior',
      state: 'Madhya Pradesh',
      pincode: '474001',
      country: 'India',
      sameAsShipping: true,
    },
    recentOrders: [
      { orderId: '#ORD-10055', date: '21 Sep 2026', itemsCount: 22, totalAmount: 76000, status: 'delivered', paymentMethod: 'Bank Transfer' },
    ],
    creditHistory: [],
  },
  {
    id: 'CUS-1007',
    name: 'Ajay Traders',
    customerType: 'Retailer',
    phone: '32109 87665',
    email: 'ajay.traders@gmail.com',
    displayName: 'Ajay Traders Retail',
    gstin: '23ABCDE7890F1Z1',
    pan: 'ABCDE7890F',
    customerCode: 'AT-07',
    creditLimit: 20000,
    paymentTerms: '15 Days',
    creditPeriodDays: 15,
    outstandingAmount: 0.0,
    totalSales: 54230.0,
    storeCredit: 0.0,
    loyaltyPoints: 190,
    totalOrders: 5,
    returnsCount: 1,
    status: 'inactive',
    tier: 'New',
    lastOrderDate: '14 Jul 2026',
    location: 'Indore',
    billingAddress: {
      addressLine1: '12 Malwa Mill Road',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452003',
      country: 'India',
      sameAsShipping: true,
    },
    recentOrders: [
      { orderId: '#ORD-09850', date: '14 Jul 2026', itemsCount: 2, totalAmount: 4300, status: 'delivered', paymentMethod: 'Cash' },
    ],
    creditHistory: [],
  },
  {
    id: 'CUS-1008',
    name: 'Pooja Boutique',
    customerType: 'Retailer',
    phone: '21098 76543',
    email: 'pooja.boutique@gmail.com',
    displayName: 'Pooja Boutique & Design',
    gstin: '23ABCDE8901F1Z2',
    pan: 'ABCDE8901F',
    customerCode: 'PB-08',
    creditLimit: 40000,
    paymentTerms: '15 Days',
    creditPeriodDays: 15,
    outstandingAmount: 9800.0,
    totalSales: 115430.0,
    storeCredit: 900.0,
    loyaltyPoints: 460,
    totalOrders: 11,
    returnsCount: 0,
    status: 'active',
    tier: 'Regular',
    lastOrderDate: '17 Sep 2026',
    location: 'Indore',
    billingAddress: {
      addressLine1: '88 Saket Nagar Main',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452018',
      country: 'India',
      sameAsShipping: true,
    },
    recentOrders: [
      { orderId: '#ORD-10043', date: '17 Sep 2026', itemsCount: 4, totalAmount: 9800, status: 'delivered', paymentMethod: 'UPI' },
    ],
    creditHistory: [],
  },
];

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: initialCustomers,
  kpis: {
    totalCustomers: 1248,
    totalCustomersGrowth: 18,
    activeCustomers: 976,
    activeCustomersGrowth: 16,
    totalSales: 1284560,
    totalSalesGrowth: 22,
    totalOutstanding: 299140,
    totalOutstandingChange: -8,
    creditCustomers: 753,
    creditCustomersPercent: 60,
  },
  searchQuery: '',
  statusFilter: 'All',
  typeFilter: 'All',
  paymentTermsFilter: 'All',
  locationFilter: 'All',
  activeTab: 'all',
  viewMode: 'list',
  selectedCustomerId: null,
  isCreditModalOpen: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setPaymentTermsFilter: (paymentTermsFilter) => set({ paymentTermsFilter }),
  setLocationFilter: (locationFilter) => set({ locationFilter }),
  clearFilters: () =>
    set({
      searchQuery: '',
      statusFilter: 'All',
      typeFilter: 'All',
      paymentTermsFilter: 'All',
      locationFilter: 'All',
    }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedCustomerId: (selectedCustomerId) => set({ selectedCustomerId }),
  setIsCreditModalOpen: (isCreditModalOpen) => set({ isCreditModalOpen }),

  addCustomer: (customerData) =>
    set((state) => {
      const nextIdNum = 1000 + state.customers.length + 1;
      const newCustomer: Customer = {
        id: `CUS-${nextIdNum}`,
        name: customerData.name,
        customerType: customerData.customerType,
        phone: customerData.phone,
        email: customerData.email,
        displayName: customerData.displayName || customerData.name,
        gstin: customerData.gstin,
        pan: customerData.pan,
        customerCode: customerData.customerCode || `CUST-${nextIdNum}`,
        creditLimit: customerData.creditLimit || 0,
        paymentTerms: customerData.paymentTerms || '15 Days',
        creditPeriodDays: customerData.creditPeriodDays || 15,
        outstandingAmount: customerData.openingBalance || 0,
        totalSales: 0,
        storeCredit: 0,
        loyaltyPoints: 0,
        totalOrders: 0,
        returnsCount: 0,
        status: customerData.status || 'active',
        tier: 'New',
        lastOrderDate: 'None',
        location: customerData.billingAddress.city || 'Local',
        billingAddress: customerData.billingAddress,
        notes: customerData.notes,
        recentOrders: [],
        creditHistory: [],
      };

      return {
        customers: [newCustomer, ...state.customers],
        viewMode: 'list',
        kpis: {
          ...state.kpis,
          totalCustomers: state.kpis.totalCustomers + 1,
          activeCustomers:
            customerData.status === 'inactive'
              ? state.kpis.activeCustomers
              : state.kpis.activeCustomers + 1,
        },
      };
    }),

  addStoreCredit: (customerId, amount, reason) =>
    set((state) => {
      const updated = state.customers.map((c) => {
        if (c.id === customerId) {
          const newCredit = c.storeCredit + amount;
          const newHistory: StoreCreditHistory = {
            id: `CR-${Date.now().toString().slice(-4)}`,
            date: 'Today',
            type: 'add',
            amount,
            balanceAfter: newCredit,
            reason: reason || 'Merchant credit credit',
          };
          return {
            ...c,
            storeCredit: newCredit,
            creditHistory: [newHistory, ...c.creditHistory],
          };
        }
        return c;
      });
      return { customers: updated };
    }),

  deductStoreCredit: (customerId, amount, reason) =>
    set((state) => {
      const updated = state.customers.map((c) => {
        if (c.id === customerId) {
          const newCredit = Math.max(0, c.storeCredit - amount);
          const newHistory: StoreCreditHistory = {
            id: `CR-${Date.now().toString().slice(-4)}`,
            date: 'Today',
            type: 'deduct',
            amount,
            balanceAfter: newCredit,
            reason: reason || 'Adjustment deduction',
          };
          return {
            ...c,
            storeCredit: newCredit,
            creditHistory: [newHistory, ...c.creditHistory],
          };
        }
        return c;
      });
      return { customers: updated };
    }),
}));
