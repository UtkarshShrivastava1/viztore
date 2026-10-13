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
  recordPayment: (customerId: string, amount: number, paymentMethod: string, notes?: string) => void;
  syncFromStoreData: (invoices: any[], orders: any[]) => void;
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

export function computeCustomerKPIs(customers: Customer[]): CustomerKPIs {
  const totalCustomers = customers.length;
  const totalSales = customers.reduce((sum, c) => sum + (c.totalSales || 0), 0);
  const totalOutstanding = customers.reduce((sum, c) => sum + (c.outstandingAmount || 0), 0);

  return {
    totalCustomers,
    totalCustomersGrowth: 8.5,
    totalSales,
    totalSalesGrowth: 14.2,
    totalOutstanding,
    totalOutstandingChange: -4.3,
  };
}

const seedCustomers: Customer[] = [
  {
    id: 'CUS-1001',
    name: 'Rajesh Kumar',
    customerType: 'Retailer',
    phone: '+91 98271 23456',
    email: 'rajesh.kumar@gmail.com',
    displayName: 'Rajesh Store',
    gstin: '22AAAAA0000A1Z5',
    customerCode: 'CUS-1001',
    creditLimit: 50000,
    paymentTerms: '15 Days',
    creditPeriodDays: 15,
    outstandingAmount: 18450.0,
    totalSales: 125000.0,
    storeCredit: 0,
    loyaltyPoints: 450,
    totalOrders: 14,
    returnsCount: 0,
    status: 'active',
    tier: 'VIP',
    lastOrderDate: '11 May 2024',
    location: 'Bhilai, CG',
    billingAddress: {
      addressLine1: 'Shop 12, Civic Center',
      city: 'Bhilai',
      state: 'CG',
      pincode: '490006',
      country: 'India',
      sameAsShipping: true,
    },
    notes: 'Regular wholesale buyer. Monthly settlement on 15th.',
    recentOrders: [
      { orderId: 'ORD-9841', date: '11 May 2024', itemsCount: 4, totalAmount: 12450, status: 'delivered', paymentMethod: 'Credit / Khata' },
      { orderId: 'ORD-9712', date: '02 May 2024', itemsCount: 8, totalAmount: 32000, status: 'delivered', paymentMethod: 'UPI' },
    ],
    creditHistory: [],
    statementTransactions: defaultStatementTransactions,
    agingBuckets: defaultAgingBuckets,
    overdueInvoices: defaultOverdueInvoices,
  },
  {
    id: 'CUS-1002',
    name: 'Sharma General Store',
    customerType: 'Business',
    phone: '+91 94252 87654',
    email: 'sharma.store@gmail.com',
    displayName: 'Sharma General Store',
    gstin: '22BBBBB1111B2Z6',
    customerCode: 'CUS-1002',
    creditLimit: 30000,
    paymentTerms: '7 Days',
    creditPeriodDays: 7,
    outstandingAmount: 8500.0,
    totalSales: 84200.0,
    storeCredit: 500,
    loyaltyPoints: 320,
    totalOrders: 9,
    returnsCount: 1,
    status: 'active',
    tier: 'Regular',
    lastOrderDate: '08 May 2024',
    location: 'Durg, CG',
    billingAddress: {
      addressLine1: 'Station Road, Mohan Nagar',
      city: 'Durg',
      state: 'CG',
      pincode: '491001',
      country: 'India',
      sameAsShipping: true,
    },
    notes: 'Weekly milk and grocery delivery.',
    recentOrders: [
      { orderId: 'ORD-9810', date: '08 May 2024', itemsCount: 5, totalAmount: 8500, status: 'delivered', paymentMethod: 'Credit / Khata' },
    ],
    creditHistory: [],
    statementTransactions: [
      { id: 'st-s1', date: '08 May 2024', type: 'Invoice', referenceNo: 'INV-1250', amount: 8500.0, balance: 8500.0 },
      { id: 'st-s2', date: '01 May 2024', type: 'Payment', referenceNo: 'PAY-0032', amount: -15000.0, balance: 0.0 },
      { id: 'st-s3', date: '25 Apr 2024', type: 'Invoice', referenceNo: 'INV-1238', amount: 15000.0, balance: 15000.0 },
    ],
    agingBuckets: [
      { label: 'Current', range: '(0–30 days)', amount: 8500.0, invoiceCount: 1, barColor: '#3b82f6', heightPercent: 85 },
      { label: '31–60 days', range: '31–60 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
      { label: '61–90 days', range: '61–90 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
      { label: '91–120 days', range: '91–120 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
      { label: '> 120 days', range: '> 120 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
    ],
    overdueInvoices: [],
  },
  {
    id: 'CUS-1003',
    name: 'Priya Verma',
    customerType: 'Individual',
    phone: '+91 91112 34567',
    email: 'priya.verma@outlook.com',
    displayName: 'Priya Verma',
    customerCode: 'CUS-1003',
    creditLimit: 10000,
    paymentTerms: 'Immediate',
    creditPeriodDays: 0,
    outstandingAmount: 0.0,
    totalSales: 32400.0,
    storeCredit: 1200,
    loyaltyPoints: 680,
    totalOrders: 6,
    returnsCount: 0,
    status: 'active',
    tier: 'Regular',
    lastOrderDate: '06 May 2024',
    location: 'Raipur, CG',
    billingAddress: {
      addressLine1: 'Flat 402, Green Enclave',
      city: 'Raipur',
      state: 'CG',
      pincode: '492001',
      country: 'India',
      sameAsShipping: true,
    },
    recentOrders: [
      { orderId: 'ORD-9755', date: '06 May 2024', itemsCount: 3, totalAmount: 4200, status: 'delivered', paymentMethod: 'UPI' },
    ],
    creditHistory: [
      { id: 'CR-101', date: '06 May 2024', type: 'add', amount: 1200, balanceAfter: 1200, reason: 'Promotional gift voucher' },
    ],
    statementTransactions: [
      { id: 'st-p1', date: '06 May 2024', type: 'Invoice', referenceNo: 'INV-1245', amount: 4200.0, balance: 0.0 },
      { id: 'st-p2', date: '06 May 2024', type: 'Payment', referenceNo: 'PAY-0029', amount: -4200.0, balance: 0.0 },
    ],
    agingBuckets: [
      { label: 'Current', range: '(0–30 days)', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
      { label: '31–60 days', range: '31–60 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
      { label: '61–90 days', range: '61–90 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
      { label: '91–120 days', range: '91–120 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
      { label: '> 120 days', range: '> 120 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
    ],
    overdueInvoices: [],
  },
  {
    id: 'CUS-1004',
    name: 'Anil Agrawal',
    customerType: 'Wholesaler',
    phone: '+91 98930 11223',
    email: 'agrawal.traders@yahoo.com',
    displayName: 'Agrawal Trading Corp',
    gstin: '22CCCCC2222C3Z7',
    customerCode: 'CUS-1004',
    creditLimit: 100000,
    paymentTerms: '30 Days',
    creditPeriodDays: 30,
    outstandingAmount: 34200.0,
    totalSales: 340000.0,
    storeCredit: 0,
    loyaltyPoints: 1250,
    totalOrders: 18,
    returnsCount: 2,
    status: 'active',
    tier: 'VIP',
    lastOrderDate: '10 May 2024',
    location: 'Bhilai, CG',
    billingAddress: {
      addressLine1: 'Plot 45, Light Industrial Area',
      city: 'Bhilai',
      state: 'CG',
      pincode: '490026',
      country: 'India',
      sameAsShipping: true,
    },
    notes: 'Bulk seasonal purchases. 30 days credit cycle.',
    recentOrders: [
      { orderId: 'ORD-9830', date: '10 May 2024', itemsCount: 12, totalAmount: 34200, status: 'delivered', paymentMethod: 'Credit / Khata' },
    ],
    creditHistory: [],
    statementTransactions: [
      { id: 'st-a1', date: '10 May 2024', type: 'Invoice', referenceNo: 'INV-1247', amount: 34200.0, balance: 34200.0 },
      { id: 'st-a2', date: '20 Apr 2024', type: 'Payment', referenceNo: 'PAY-0025', amount: -60000.0, balance: 0.0 },
      { id: 'st-a3', date: '15 Apr 2024', type: 'Invoice', referenceNo: 'INV-1232', amount: 60000.0, balance: 60000.0 },
    ],
    agingBuckets: [
      { label: 'Current', range: '(0–30 days)', amount: 34200.0, invoiceCount: 1, barColor: '#3b82f6', heightPercent: 90 },
      { label: '31–60 days', range: '31–60 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
      { label: '61–90 days', range: '61–90 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
      { label: '91–120 days', range: '91–120 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
      { label: '> 120 days', range: '> 120 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
    ],
    overdueInvoices: [],
  },
  {
    id: 'CUS-1005',
    name: 'Sunita Patel',
    customerType: 'Individual',
    phone: '+91 93001 98765',
    email: 'sunita.patel@gmail.com',
    displayName: 'Sunita Patel',
    customerCode: 'CUS-1005',
    creditLimit: 5000,
    paymentTerms: '7 Days',
    creditPeriodDays: 7,
    outstandingAmount: 1850.0,
    totalSales: 14600.0,
    storeCredit: 0,
    loyaltyPoints: 140,
    totalOrders: 4,
    returnsCount: 0,
    status: 'active',
    tier: 'Regular',
    lastOrderDate: '04 May 2024',
    location: 'Durg, CG',
    billingAddress: {
      addressLine1: 'Ganjpara, Ward 12',
      city: 'Durg',
      state: 'CG',
      pincode: '491001',
      country: 'India',
      sameAsShipping: true,
    },
    recentOrders: [
      { orderId: 'ORD-9740', date: '04 May 2024', itemsCount: 2, totalAmount: 1850, status: 'delivered', paymentMethod: 'Credit / Khata' },
    ],
    creditHistory: [],
    statementTransactions: [
      { id: 'st-u1', date: '04 May 2024', type: 'Invoice', referenceNo: 'INV-1243', amount: 1850.0, balance: 1850.0 },
      { id: 'st-u2', date: '24 Apr 2024', type: 'Payment', referenceNo: 'PAY-0027', amount: -3200.0, balance: 0.0 },
      { id: 'st-u3', date: '18 Apr 2024', type: 'Invoice', referenceNo: 'INV-1234', amount: 3200.0, balance: 3200.0 },
    ],
    agingBuckets: [
      { label: 'Current', range: '(0–30 days)', amount: 1850.0, invoiceCount: 1, barColor: '#3b82f6', heightPercent: 40 },
      { label: '31–60 days', range: '31–60 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
      { label: '61–90 days', range: '61–90 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
      { label: '91–120 days', range: '91–120 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
      { label: '> 120 days', range: '> 120 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 20 },
    ],
    overdueInvoices: [],
  },
];

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: seedCustomers,
  kpis: computeCustomerKPIs(seedCustomers),
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
        statementTransactions: customerData.openingBalance
          ? [
              {
                id: `st-${Date.now()}`,
                date: 'Opening Balance',
                type: 'Invoice',
                referenceNo: 'OPENING',
                amount: customerData.openingBalance,
                balance: customerData.openingBalance,
              },
            ]
          : [],
        agingBuckets: defaultAgingBuckets,
        overdueInvoices: [],
      };

      const updatedCustomers = [newCustomer, ...state.customers];
      return {
        customers: updatedCustomers,
        viewMode: 'list',
        editingCustomer: null,
        kpis: computeCustomerKPIs(updatedCustomers),
      };
    }),

  updateCustomer: (id, updates) =>
    set((state) => {
      const updatedCustomers = state.customers.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      return {
        customers: updatedCustomers,
        editingCustomer: null,
        viewMode: 'list',
        kpis: computeCustomerKPIs(updatedCustomers),
      };
    }),

  deleteCustomer: (id) =>
    set((state) => {
      const updatedCustomers = state.customers.filter((c) => c.id !== id);
      return {
        customers: updatedCustomers,
        selectedCustomerId: state.selectedCustomerId === id ? null : state.selectedCustomerId,
        statementCustomer: state.statementCustomer?.id === id ? null : state.statementCustomer,
        kpis: computeCustomerKPIs(updatedCustomers),
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
            reason: reason || 'Merchant credit addition',
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

  recordPayment: (customerId, amount, paymentMethod, notes) =>
    set((state) => {
      const refNo = `PAY-${Date.now().toString().slice(-4)}`;
      const dateStr = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      const updated = state.customers.map((c) => {
        if (c.id === customerId) {
          const newOutstanding = Math.max(0, c.outstandingAmount - amount);
          const paymentTx: StatementTransaction = {
            id: `st-${Date.now()}`,
            date: dateStr,
            type: 'Payment',
            referenceNo: refNo,
            amount: -amount,
            balance: newOutstanding,
          };

          return {
            ...c,
            outstandingAmount: newOutstanding,
            statementTransactions: [paymentTx, ...(c.statementTransactions || [])],
          };
        }
        return c;
      });

      const updatedStatementCustomer =
        state.statementCustomer?.id === customerId
          ? updated.find((c) => c.id === customerId) || null
          : state.statementCustomer;

      return {
        customers: updated,
        statementCustomer: updatedStatementCustomer,
        kpis: computeCustomerKPIs(updated),
      };
    }),

  syncFromStoreData: (invoices = [], orders = []) =>
    set((state) => {
      let updated = [...state.customers];

      // Process invoices from POS / Tax billing
      invoices.forEach((inv) => {
        if (!inv.customerName && !inv.customerPhone) return;
        const cleanPhone = (inv.customerPhone || '').replace(/\D/g, '');
        const existingIdx = updated.findIndex(
          (c) =>
            (cleanPhone && c.phone.replace(/\D/g, '') === cleanPhone) ||
            c.name.toLowerCase() === (inv.customerName || '').toLowerCase()
        );

        const invoiceAmount = Number(inv.grandTotal) || 0;
        const balanceDue =
          inv.balanceDue !== undefined
            ? Number(inv.balanceDue)
            : inv.status === 'paid'
            ? 0
            : invoiceAmount;
        const invoiceDate = inv.date || 'Today';
        const invoiceNo = inv.invoiceNo || `INV-${inv.id}`;

        if (existingIdx >= 0 && updated[existingIdx]) {
          const cust = updated[existingIdx]!;
          const hasInvoice = cust.statementTransactions?.some((t) => t.referenceNo === invoiceNo);
          if (!hasInvoice) {
            const newTx: StatementTransaction = {
              id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
              date: invoiceDate,
              type: 'Invoice',
              referenceNo: invoiceNo,
              amount: invoiceAmount,
              balance: cust.outstandingAmount + balanceDue,
            };
            updated[existingIdx] = {
              ...cust,
              totalSales: cust.totalSales + invoiceAmount,
              outstandingAmount: cust.outstandingAmount + balanceDue,
              statementTransactions: [newTx, ...(cust.statementTransactions || [])],
            };
          }
        } else {
          const nextIdNum = 1000 + updated.length + 1;
          const newCust: Customer = {
            id: `CUS-${nextIdNum}`,
            name: inv.customerName || 'Walk-in Customer',
            customerType: 'Individual',
            phone: inv.customerPhone || 'N/A',
            email:
              inv.customerEmail ||
              `${(inv.customerName || 'customer').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
            displayName: inv.customerName || 'Walk-in Customer',
            gstin: inv.customerGstin,
            customerCode: `CUS-${nextIdNum}`,
            creditLimit: 10000,
            paymentTerms: '15 Days',
            creditPeriodDays: 15,
            outstandingAmount: balanceDue,
            totalSales: invoiceAmount,
            storeCredit: 0,
            loyaltyPoints: Math.floor(invoiceAmount / 100),
            totalOrders: 1,
            returnsCount: 0,
            status: 'active',
            tier: 'Regular',
            lastOrderDate: invoiceDate,
            location: inv.placeOfSupply || 'Local',
            billingAddress: {
              addressLine1: inv.customerAddress || 'Local Area',
              city: inv.placeOfSupply || 'Local',
              state: 'CG',
              pincode: '490020',
              country: 'India',
              sameAsShipping: true,
            },
            recentOrders: [],
            creditHistory: [],
            statementTransactions: [
              {
                id: `st-${Date.now()}`,
                date: invoiceDate,
                type: 'Invoice',
                referenceNo: invoiceNo,
                amount: invoiceAmount,
                balance: balanceDue,
              },
            ],
            agingBuckets: defaultAgingBuckets,
            overdueInvoices:
              balanceDue > 0
                ? [
                    {
                      id: `ov-${Date.now()}`,
                      invoiceNo: invoiceNo,
                      invoiceDate: invoiceDate,
                      dueDate: inv.dueDate || invoiceDate,
                      amount: balanceDue,
                      daysOverdue: 0,
                      status: 'Overdue',
                    },
                  ]
                : [],
          };
          updated.push(newCust);
        }
      });

      return {
        customers: updated,
        kpis: computeCustomerKPIs(updated),
      };
    }),
}));

