import { create } from 'zustand';
import { customersApi } from '../lib/api.js';
import { toast } from './toastStore.js';

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

  isLoadingCustomers: boolean;
  error: string | null;

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

  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'recentOrders' | 'creditHistory' | 'outstandingAmount' | 'totalSales' | 'storeCredit' | 'loyaltyPoints' | 'totalOrders' | 'returnsCount' | 'tier' | 'lastOrderDate' | 'location'> & { location?: string; openingBalance?: number }) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  addStoreCredit: (customerId: string, amount: number, reason: string) => Promise<void>;
  deductStoreCredit: (customerId: string, amount: number, reason: string) => Promise<void>;
  recordPayment: (customerId: string, amount: number, paymentMethod: string, notes?: string) => Promise<void>;
  syncFromStoreData: (invoices: any[], orders: any[]) => void;
}

const defaultAgingBuckets: AgingBucket[] = [
  { label: 'Current', range: '(0–30 days)', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 0 },
  { label: '31–60 days', range: '31–60 days', amount: 0.0, invoiceCount: 0, barColor: '#facc15', heightPercent: 0 },
  { label: '61–90 days', range: '61–90 days', amount: 0.0, invoiceCount: 0, barColor: '#fb923c', heightPercent: 0 },
  { label: '91–120 days', range: '91–120 days', amount: 0.0, invoiceCount: 0, barColor: '#f87171', heightPercent: 0 },
  { label: '> 120 days', range: '> 120 days', amount: 0.0, invoiceCount: 0, barColor: '#e2e8f0', heightPercent: 0 },
];

export function computeCustomerKPIs(customers: Customer[]): CustomerKPIs {
  const totalCustomers = customers.length;
  const totalSales = customers.reduce((sum, c) => sum + (c.totalSales || 0), 0);
  const totalOutstanding = customers.reduce((sum, c) => sum + (c.outstandingAmount || 0), 0);

  return {
    totalCustomers,
    totalCustomersGrowth: totalCustomers > 0 ? 8.5 : 0,
    totalSales,
    totalSalesGrowth: totalSales > 0 ? 14.2 : 0,
    totalOutstanding,
    totalOutstandingChange: totalOutstanding > 0 ? -4.3 : 0,
  };
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  kpis: computeCustomerKPIs([]),
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
  isLoadingCustomers: false,
  error: null,

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

  fetchCustomers: async () => {
    set({ isLoadingCustomers: true, error: null });
    try {
      const res = await customersApi.getCustomers();
      // Unpack response: api.get returns json.data; handle raw or wrapped payload
      const payload: any = (res as any)?.data?.data || (res as any)?.data || res;
      const rawList: any[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.customers)
        ? payload.customers
        : [];

      const liveCustomers: Customer[] = rawList.map((raw: any) => ({
        id: raw._id || raw.id,
        name: raw.name,
        customerType: raw.customerType || 'Individual',
        phone: raw.phone || '',
        email: raw.email || '',
        displayName: raw.displayName || raw.name,
        gstin: raw.gstin || '',
        pan: raw.pan || '',
        customerCode: raw.customerCode || raw._id || raw.id,
        creditLimit: raw.creditLimit || 0,
        paymentTerms: raw.paymentTerms || '15 Days',
        creditPeriodDays: raw.creditPeriodDays || 15,
        outstandingAmount: raw.outstandingAmount || 0,
        totalSales: raw.totalSales || 0,
        storeCredit: raw.storeCredit || 0,
        loyaltyPoints: raw.loyaltyPoints || 0,
        totalOrders: raw.totalOrders || 0,
        returnsCount: raw.returnsCount || 0,
        status: raw.status || 'active',
        tier: raw.tier || 'Regular',
        lastOrderDate: raw.lastOrderDate
          ? new Date(raw.lastOrderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : 'Never',
        location: raw.billingAddress?.city
          ? `${raw.billingAddress.city}, ${(raw.billingAddress.state || '').slice(0, 2).toUpperCase()}`
          : 'Local',
        billingAddress: raw.billingAddress || { addressLine1: '', city: '', state: '', pincode: '' },
        notes: raw.notes || '',
        recentOrders: raw.recentOrders || [],
        creditHistory: raw.creditHistory || [],
        statementTransactions: raw.statementTransactions || [],
        agingBuckets: raw.agingBuckets || defaultAgingBuckets,
        overdueInvoices: raw.overdueInvoices || [],
      }));

      const backendKpis = payload?.kpis;
      set({
        customers: liveCustomers,
        kpis: backendKpis
          ? {
              totalCustomers: backendKpis.totalCustomers ?? liveCustomers.length,
              totalCustomersGrowth: backendKpis.totalCustomersGrowth ?? (liveCustomers.length > 0 ? 8.5 : 0),
              totalSales: backendKpis.totalSales ?? computeCustomerKPIs(liveCustomers).totalSales,
              totalSalesGrowth: backendKpis.totalSalesGrowth ?? (liveCustomers.length > 0 ? 14.2 : 0),
              totalOutstanding: backendKpis.totalOutstanding ?? computeCustomerKPIs(liveCustomers).totalOutstanding,
              totalOutstandingChange: backendKpis.totalOutstandingChange ?? 0,
            }
          : computeCustomerKPIs(liveCustomers),
        isLoadingCustomers: false,
      });
    } catch (err: any) {
      console.warn('Live API fetch customers failed, keeping local state:', err);
      set({ isLoadingCustomers: false, error: err.message || 'Failed to fetch customers' });
    }
  },

  addCustomer: async (customerData) => {
    const nextIdNum = 1000 + (get().customers.length || 0) + 1;
    const optimisticId = `CUS-${nextIdNum}`;
    const newCustomer: Customer = {
      id: optimisticId,
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

    set((state) => {
      const updatedCustomers = [newCustomer, ...state.customers];
      return {
        customers: updatedCustomers,
        viewMode: 'list',
        editingCustomer: null,
        kpis: computeCustomerKPIs(updatedCustomers),
      };
    });
    toast.success("Customer Registered Successfully!", `${customerData.name} has been added to directory.`);

    try {
      const res = await customersApi.create({
        name: customerData.name,
        customerType: customerData.customerType,
        phone: customerData.phone,
        email: customerData.email,
        displayName: customerData.displayName,
        gstin: customerData.gstin,
        pan: customerData.pan,
        customerCode: customerData.customerCode,
        creditLimit: customerData.creditLimit,
        paymentTerms: customerData.paymentTerms,
        creditPeriodDays: customerData.creditPeriodDays,
        openingBalance: customerData.openingBalance,
        status: customerData.status,
        billingAddress: customerData.billingAddress,
        notes: customerData.notes,
      });
      const saved: any = (res as any)?.data?.data || (res as any)?.data || res;
      if (saved && (saved._id || saved.id)) {
        const savedId = saved._id || saved.id;
        const savedCode = saved.customerCode || savedId;
        set((state) => {
          const updated = state.customers.map((c) =>
            c.id === optimisticId ? { ...c, id: savedId, customerCode: savedCode } : c
          );
          return { customers: updated, kpis: computeCustomerKPIs(updated) };
        });
      }
    } catch (err) {
      console.warn('Live API create failed, preserved optimistic state:', err);
    }
  },

  updateCustomer: async (id, updates) => {
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
    });

    try {
      await customersApi.update(id, updates);
    } catch (err) {
      console.warn('Live API update failed, preserved optimistic state:', err);
    }
  },

  deleteCustomer: async (id) => {
    set((state) => {
      const updatedCustomers = state.customers.filter((c) => c.id !== id);
      return {
        customers: updatedCustomers,
        selectedCustomerId: state.selectedCustomerId === id ? null : state.selectedCustomerId,
        statementCustomer: state.statementCustomer?.id === id ? null : state.statementCustomer,
        kpis: computeCustomerKPIs(updatedCustomers),
      };
    });

    try {
      await customersApi.delete(id);
    } catch (err) {
      console.warn('Live API delete failed:', err);
    }
  },

  addStoreCredit: async (customerId, amount, reason) => {
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
    });

    try {
      await customersApi.addCredit(customerId, { type: 'add', amount, reason });
    } catch (err) {
      console.warn('Live API addStoreCredit failed:', err);
    }
  },

  deductStoreCredit: async (customerId, amount, reason) => {
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
    });

    try {
      await customersApi.addCredit(customerId, { type: 'deduct', amount, reason });
    } catch (err) {
      console.warn('Live API deductStoreCredit failed:', err);
    }
  },

  recordPayment: async (customerId, amount, paymentMethod, notes) => {
    const refNo = `PAY-${Date.now().toString().slice(-4)}`;
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    set((state) => {
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
    });
    toast.success("Payment Recorded", `Payment of ₹${amount.toLocaleString('en-IN')} recorded successfully.`);

    try {
      await customersApi.recordPayment(customerId, {
        amount,
        paymentMethod,
        referenceNo: refNo,
        notes,
      });
    } catch (err) {
      console.warn('Live API recordPayment failed:', err);
    }
  },

  syncFromStoreData: (invoices = [], orders = []) =>
    set((state) => {
      const updated = [...state.customers];

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

