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

export interface StatementTransaction {
  id: string;
  date: string;
  type: 'Invoice' | 'Payment';
  referenceNo: string;
  amount: number; // positive for Invoice, negative for Payment
  balance: number;
}

export interface AgingBucket {
  label: string;
  range: string;
  amount: number;
  invoiceCount: number;
  barColor: string;
  heightPercent: number;
}

export interface OverdueInvoice {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  daysOverdue: number;
  status: 'Overdue';
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
  statementTransactions?: StatementTransaction[];
  agingBuckets?: AgingBucket[];
  overdueInvoices?: OverdueInvoice[];
}

export interface CustomerKPIs {
  totalCustomers: number;
  totalCustomersGrowth: number;
  totalSales: number;
  totalSalesGrowth: number;
  totalOutstanding: number;
  totalOutstandingChange: number;
}

interface CustomerState {
  customers: Customer[];
  kpis: CustomerKPIs;
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  locationFilter: string;
  activeTab: 'all' | 'active' | 'inactive';
  viewMode: 'list' | 'add';
  selectedCustomerId: string | null;
  editingCustomer: Customer | null;
  isCreditModalOpen: boolean;

  // Statements Drawer (Mockups 6.3 & 6.4)
  isStatementDrawerOpen: boolean;
  statementCustomer: Customer | null;
  activeStatementTab: 'history' | 'aging';

  // Actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setTypeFilter: (type: string) => void;
  setLocationFilter: (location: string) => void;
  clearFilters: () => void;
  setActiveTab: (tab: 'all' | 'active' | 'inactive') => void;
  setViewMode: (mode: 'list' | 'add') => void;
  setSelectedCustomerId: (id: string | null) => void;
  setEditingCustomer: (customer: Customer | null) => void;
  setIsCreditModalOpen: (open: boolean) => void;

  openCustomerStatement: (customer: Customer, tab?: 'history' | 'aging') => void;
  closeCustomerStatement: () => void;
  setActiveStatementTab: (tab: 'history' | 'aging') => void;

  addCustomer: (customer: Omit<Customer, 'id' | 'recentOrders' | 'creditHistory' | 'outstandingAmount' | 'totalSales' | 'storeCredit' | 'loyaltyPoints' | 'totalOrders' | 'returnsCount' | 'tier' | 'lastOrderDate' | 'location'> & { location?: string; openingBalance?: number }) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addStoreCredit: (customerId: string, amount: number, reason: string) => void;
  deductStoreCredit: (customerId: string, amount: number, reason: string) => void;
}

const defaultStatementTransactions: StatementTransaction[] = [
  { id: 'st-1', date: '11 May 2024', type: 'Invoice', referenceNo: 'INV-1248', amount: 12450.0, balance: 18450.0 },
  { id: 'st-2', date: '10 May 2024', type: 'Payment', referenceNo: 'PAY-0034', amount: -25000.0, balance: 6000.0 },
  { id: 'st-3', date: '02 May 2024', type: 'Invoice', referenceNo: 'INV-1241', amount: 32000.0, balance: 31000.0 },
  { id: 'st-4', date: '28 Apr 2024', type: 'Payment', referenceNo: 'PAY-0031', amount: -15000.0, balance: -1000.0 },
  { id: 'st-5', date: '21 Apr 2024', type: 'Invoice', referenceNo: 'INV-1235', amount: 18450.0, balance: 18000.0 },
  { id: 'st-6', date: '10 Apr 2024', type: 'Payment', referenceNo: 'PAY-0028', amount: -40000.0, balance: -450.0 },
  { id: 'st-7', date: '05 Apr 2024', type: 'Invoice', referenceNo: 'INV-1228', amount: 22000.0, balance: 39550.0 },
  { id: 'st-8', date: '28 Mar 2024', type: 'Payment', referenceNo: 'PAY-0021', amount: -22000.0, balance: 17550.0 },
];

const defaultAgingBuckets: AgingBucket[] = [
  { label: 'Current', range: '(0–30 days)', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
  { label: '31–60 days', range: '31–60 days', amount: 6250.0, invoiceCount: 1, barColor: '#facc15', heightPercent: 55 },
  { label: '61–90 days', range: '61–90 days', amount: 8750.0, invoiceCount: 1, barColor: '#fb923c', heightPercent: 85 },
  { label: '91–120 days', range: '91–120 days', amount: 3450.0, invoiceCount: 1, barColor: '#f87171', heightPercent: 40 },
  { label: '> 120 days', range: '> 120 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
];

const defaultOverdueInvoices: OverdueInvoice[] = [
  { id: 'ov-1', invoiceNo: 'INV-1248', invoiceDate: '11 May 2024', dueDate: '10 Jun 2024', amount: 6250.0, daysOverdue: 21, status: 'Overdue' },
  { id: 'ov-2', invoiceNo: 'INV-1235', invoiceDate: '21 Apr 2024', dueDate: '21 May 2024', amount: 8750.0, daysOverdue: 41, status: 'Overdue' },
  { id: 'ov-3', invoiceNo: 'INV-1228', invoiceDate: '05 Apr 2024', dueDate: '05 May 2024', amount: 3450.0, daysOverdue: 57, status: 'Overdue' },
];

const initialCustomers: Customer[] = [
  {
    id: 'CUS-1001',
    name: 'Ramesh Stores',
    customerType: 'Retailer',
    phone: '98765 43210',
    email: 'ramesh@stores.com',
    displayName: 'Ramesh Stores',
    gstin: '23ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    customerCode: 'CUS-1001',
    creditLimit: 50000,
    paymentTerms: '15 Days',
    creditPeriodDays: 15,
    outstandingAmount: 18450.0,
    totalSales: 125430.0,
    storeCredit: 1250.0,
    loyaltyPoints: 340,
    totalOrders: 24,
    returnsCount: 1,
    status: 'active',
    tier: 'VIP',
    lastOrderDate: '11 May 2024',
    location: 'Indore, MP',
    billingAddress: {
      addressLine1: '123, MG Road, Near Rajwada',
      addressLine2: 'Indore, Madhya Pradesh - 452001, India',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452001',
      country: 'India',
      sameAsShipping: true,
    },
    notes: 'Regular customer. Prefers bulk orders during festival season. Contact via WhatsApp for faster response.',
    recentOrders: [
      { orderId: '#ORD-10045', date: '11 May 2024', itemsCount: 6, totalAmount: 14200, status: 'delivered', paymentMethod: 'UPI' },
      { orderId: '#ORD-10032', date: '02 May 2024', itemsCount: 4, totalAmount: 8900, status: 'delivered', paymentMethod: 'Net Banking' },
      { orderId: '#ORD-10018', date: '21 Apr 2024', itemsCount: 10, totalAmount: 24500, status: 'delivered', paymentMethod: 'Credit Terms' },
    ],
    creditHistory: [
      { id: 'CR-101', date: '10 May 2024', type: 'add', amount: 500, balanceAfter: 1250, reason: 'Promotional loyalty incentive' },
    ],
    statementTransactions: defaultStatementTransactions,
    agingBuckets: defaultAgingBuckets,
    overdueInvoices: defaultOverdueInvoices,
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
    customerCode: 'CUS-1002',
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
    lastOrderDate: '10 May 2024',
    location: 'Bhopal, MP',
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
      { orderId: '#ORD-10051', date: '10 May 2024', itemsCount: 15, totalAmount: 48600, status: 'delivered', paymentMethod: 'Bank Transfer' },
    ],
    creditHistory: [],
    statementTransactions: defaultStatementTransactions,
    agingBuckets: defaultAgingBuckets,
    overdueInvoices: defaultOverdueInvoices,
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
    customerCode: 'CUS-1003',
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
    lastOrderDate: '09 May 2024',
    location: 'Raipur, CG',
    billingAddress: {
      addressLine1: '78 Freeganj Main Street',
      city: 'Raipur',
      state: 'Chhattisgarh',
      pincode: '492001',
      country: 'India',
      sameAsShipping: true,
    },
    recentOrders: [],
    creditHistory: [],
    statementTransactions: defaultStatementTransactions,
    agingBuckets: defaultAgingBuckets,
    overdueInvoices: [],
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
    customerCode: 'CUS-1004',
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
    lastOrderDate: '08 May 2024',
    location: 'Durg, CG',
    billingAddress: {
      addressLine1: 'Shop 104, City Plaza',
      city: 'Durg',
      state: 'Chhattisgarh',
      pincode: '491001',
      country: 'India',
      sameAsShipping: true,
    },
    recentOrders: [],
    creditHistory: [],
    statementTransactions: defaultStatementTransactions,
    agingBuckets: defaultAgingBuckets,
    overdueInvoices: defaultOverdueInvoices,
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
    customerCode: 'CUS-1005',
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
    lastOrderDate: '07 May 2024',
    location: 'Bhilai, CG',
    billingAddress: {
      addressLine1: 'Station Road, Civic Center',
      city: 'Bhilai',
      state: 'Chhattisgarh',
      pincode: '490006',
      country: 'India',
      sameAsShipping: true,
    },
    recentOrders: [],
    creditHistory: [],
    statementTransactions: defaultStatementTransactions,
    agingBuckets: defaultAgingBuckets,
    overdueInvoices: [],
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
    customerCode: 'CUS-1006',
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
    lastOrderDate: '06 May 2024',
    location: 'Nagpur, MH',
    billingAddress: {
      addressLine1: 'Lashkar Sarafa Bazar',
      city: 'Nagpur',
      state: 'Maharashtra',
      pincode: '440002',
      country: 'India',
      sameAsShipping: true,
    },
    recentOrders: [],
    creditHistory: [],
    statementTransactions: defaultStatementTransactions,
    agingBuckets: defaultAgingBuckets,
    overdueInvoices: defaultOverdueInvoices,
  },
  {
    id: 'CUS-1007',
    name: 'Ajay Traders',
    customerType: 'Retailer',
    phone: '32109 87654',
    email: 'ajay.traders@gmail.com',
    displayName: 'Ajay Traders Retail',
    gstin: '23ABCDE7890F1Z1',
    pan: 'ABCDE7890F',
    customerCode: 'CUS-1007',
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
    lastOrderDate: '05 May 2024',
    location: 'Ranchi, JH',
    billingAddress: {
      addressLine1: '12 Main Road',
      city: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834001',
      country: 'India',
      sameAsShipping: true,
    },
    recentOrders: [],
    creditHistory: [],
    statementTransactions: defaultStatementTransactions,
    agingBuckets: defaultAgingBuckets,
    overdueInvoices: [],
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
    customerCode: 'CUS-1008',
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
    lastOrderDate: '04 May 2024',
    location: 'Bilaspur, CG',
    billingAddress: {
      addressLine1: '88 Link Road, City Center',
      city: 'Bilaspur',
      state: 'Chhattisgarh',
      pincode: '495001',
      country: 'India',
      sameAsShipping: true,
    },
    recentOrders: [],
    creditHistory: [],
    statementTransactions: defaultStatementTransactions,
    agingBuckets: defaultAgingBuckets,
    overdueInvoices: defaultOverdueInvoices,
  },
];

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: initialCustomers,
  kpis: {
    totalCustomers: 1248,
    totalCustomersGrowth: 18,
    totalSales: 1284560,
    totalSalesGrowth: 22,
    totalOutstanding: 299140,
    totalOutstandingChange: -8,
  },
  searchQuery: '',
  statusFilter: 'All',
  typeFilter: 'All',
  locationFilter: 'All',
  activeTab: 'all',
  viewMode: 'list',
  selectedCustomerId: null,
  editingCustomer: null,
  isCreditModalOpen: false,

  isStatementDrawerOpen: false,
  statementCustomer: null,
  activeStatementTab: 'history',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setLocationFilter: (locationFilter) => set({ locationFilter }),
  clearFilters: () =>
    set({
      searchQuery: '',
      statusFilter: 'All',
      typeFilter: 'All',
      locationFilter: 'All',
    }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedCustomerId: (selectedCustomerId) => set({ selectedCustomerId }),
  setEditingCustomer: (editingCustomer) => set({ editingCustomer }),
  setIsCreditModalOpen: (isCreditModalOpen) => set({ isCreditModalOpen }),

  openCustomerStatement: (customer, tab = 'history') =>
    set({
      statementCustomer: customer,
      activeStatementTab: tab,
      isStatementDrawerOpen: true,
    }),
  closeCustomerStatement: () =>
    set({
      isStatementDrawerOpen: false,
      statementCustomer: null,
    }),
  setActiveStatementTab: (activeStatementTab) => set({ activeStatementTab }),

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
        customerCode: customerData.customerCode || `CUS-${nextIdNum}`,
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
        lastOrderDate: 'Just now',
        location: customerData.billingAddress.city
          ? `${customerData.billingAddress.city}, ${customerData.billingAddress.state.slice(0, 2).toUpperCase()}`
          : 'Local',
        billingAddress: customerData.billingAddress,
        notes: customerData.notes,
        recentOrders: [],
        creditHistory: [],
        statementTransactions: defaultStatementTransactions,
        agingBuckets: defaultAgingBuckets,
        overdueInvoices: [],
      };

      return {
        customers: [newCustomer, ...state.customers],
        viewMode: 'list',
        editingCustomer: null,
        kpis: {
          ...state.kpis,
          totalCustomers: state.kpis.totalCustomers + 1,
        },
      };
    }),

  updateCustomer: (id, updates) =>
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      editingCustomer: null,
      viewMode: 'list',
    })),

  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
      selectedCustomerId: state.selectedCustomerId === id ? null : state.selectedCustomerId,
      statementCustomer: state.statementCustomer?.id === id ? null : state.statementCustomer,
    })),

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
