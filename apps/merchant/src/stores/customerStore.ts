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

const initialCustomers: Customer[] = [];

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: initialCustomers,
  kpis: {
    totalCustomers: 0,
    totalCustomersGrowth: 0,
    totalSales: 0,
    totalSalesGrowth: 0,
    totalOutstanding: 0,
    totalOutstandingChange: 0,
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
