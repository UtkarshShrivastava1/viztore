import { create } from 'zustand';
import { expensesApi } from '../lib/api.js';
import { downloadCSV } from '../utils/csvExport.js';

export type PurchaseSubTab =
  | 'all'
  | 'orders'
  | 'bills'
  | 'expenses'
  | 'credit_notes'
  | 'eway_bills'
  | 'vendors';

export interface PurchaseTransaction {
  id: string;
  date: string;
  time: string;
  referenceNo: string;
  type: 'Purchase' | 'Expense' | 'Purchase Order' | 'Credit Note' | 'E-Way Bill';
  vendorOrPaidTo: string;
  category: string;
  amount: number; // positive or negative
  status: 'Paid' | 'Open' | 'Processed' | 'Generated' | 'Partially Received' | 'Pending';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  time: string;
  vendor: string;
  itemsCount: string;
  totalAmount: number;
  expectedDate: string;
  status: 'Pending' | 'Partially Received' | 'Received' | 'Cancelled';
}

export interface PurchaseBill {
  id: string;
  billNumber: string;
  date: string;
  time: string;
  vendor: string;
  itemsCount: string;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid';
  dueDate: string;
}

export interface ExpenseItem {
  id: string;
  expenseNo: string;
  date: string;
  time: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  status: 'Paid' | 'Pending' | 'Partially Paid';
}

export interface CreditNoteItem {
  id: string;
  creditNoteNo: string;
  date: string;
  time: string;
  referencePurchase: string;
  vendor: string;
  reasonType: string;
  amount: number;
  status: 'Pending' | 'Processed' | 'Cancelled';
}

export interface EWayBillItem {
  id: string;
  eWayBillNo: string;
  date: string;
  time: string;
  invoiceBillNo: string;
  vendor: string;
  fromTo: string;
  distanceKm: number;
  validTill: string;
  status: 'Active' | 'In Transit' | 'Expired' | 'Cancelled';
  vehicleNo?: string;
  totalValue?: number;
  itemsCount?: number;
}

export interface Vendor {
  id: string;
  vendorCode: string; // e.g. "VND-001"
  vendorName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  totalPurchases: number;
  status: 'Active' | 'Inactive' | 'Blocked';
  gstin?: string;
  pan?: string;
  category?: string;
  paymentTerms?: string;
  creditLimit?: number;
  openingBalance?: number;
  address?: string;
  pincode?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  notes?: string;
}

export type VendorItem = Vendor;

// Backward compatibility interfaces
export type ExpenseCategory = string;
export type ExpensePaymentMethod = string;
export type ExpenseStatus = string;
export type ExpenseType = string;
export interface Expense {
  id: string;
  date: string;
  time: string;
  name: string;
  subtitle: string;
  category: string;
  vendor: string;
  paymentMethod: string;
  amount: number;
  tax: number;
  totalAmount: number;
  currency: string;
  status: string;
  expenseType?: string;
  isReimbursable?: boolean;
  receiptName?: string;
  receiptSize?: string;
  referenceNumber?: string;
  notes?: string;
}

interface PurchaseExpenseState {
  // Navigation & Sub-tabs
  activeSubTab: PurchaseSubTab;
  setActiveSubTab: (tab: PurchaseSubTab) => void;

  // Overview KPIs
  overviewKPIs: {
    totalPurchase: number;
    totalExpense: number;
    totalCreditNote: number;
    openPurchaseOrders: number;
    openPOCount: number;
    eWayBillsCount: number;
  };

  // Lists
  allTransactions: PurchaseTransaction[];
  purchaseOrders: PurchaseOrder[];
  purchaseBills: PurchaseBill[];
  expenses: ExpenseItem[];
  creditNotes: CreditNoteItem[];
  ewayBills: EWayBillItem[];
  vendors: VendorItem[];

  // Filter States
  searchQuery: string;
  dateRange: string;
  typeFilter: string;
  categoryFilter: string;
  statusFilter: string;
  vendorFilter: string;
  cityFilter: string;

  setSearchQuery: (query: string) => void;
  setDateRange: (range: string) => void;
  setTypeFilter: (type: string) => void;
  setCategoryFilter: (category: string) => void;
  setStatusFilter: (status: string) => void;
  setVendorFilter: (vendor: string) => void;
  setCityFilter: (city: string) => void;
  clearFilters: () => void;

  // Drawers & Modals States
  selectedPurchase: PurchaseBill | PurchaseTransaction | null;
  setSelectedPurchase: (p: PurchaseBill | PurchaseTransaction | null) => void;

  isEditPurchaseOpen: boolean;
  setIsEditPurchaseOpen: (open: boolean) => void;

  isCreateCreditNoteOpen: boolean;
  setIsCreateCreditNoteOpen: (open: boolean) => void;

  isAddVendorOpen: boolean;
  setIsAddVendorOpen: (open: boolean) => void;

  isGenerateEWayBillOpen: boolean;
  setIsGenerateEWayBillOpen: (open: boolean) => void;

  isCreatePOModalOpen: boolean;
  setIsCreatePOModalOpen: (open: boolean) => void;

  isCreateBillModalOpen: boolean;
  setIsCreateBillModalOpen: (open: boolean) => void;

  isCreateReturnModalOpen: boolean;
  setIsCreateReturnModalOpen: (open: boolean) => void;

  isCreateDirectPurchaseOpen: boolean;
  setIsCreateDirectPurchaseOpen: (open: boolean) => void;

  isAddExpenseModalOpen: boolean;
  setIsAddExpenseModalOpen: (open: boolean) => void;

  // Backend Sync & Mutations
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  fetchExpenseData: () => Promise<void>;
  createExpenseRecord: (data: any) => Promise<boolean>;
  createVendorRecord: (data: any) => Promise<boolean>;
  createPurchaseRecord: (data: any) => Promise<boolean>;
  createCreditNoteRecord: (data: any) => Promise<boolean>;
  createEWayBillRecord: (data: any) => Promise<boolean>;
  deleteExpenseRecord: (id: string) => Promise<boolean>;
  receivePurchaseRecord: (id: string) => Promise<boolean>;

  // Vendor & Procurement Hub States (TASK-ABH-14)
  selectedVendor: Vendor | null;
  setSelectedVendor: (v: Vendor | null) => void;
  isImportModalOpen: boolean;
  importType: 'purchases' | 'expenses' | 'vendors' | null;

  // Actions
  openAddVendor: (vendor?: Vendor) => void;
  closeAddVendor: () => void;
  openImportModal: (type: 'purchases' | 'expenses' | 'vendors') => void;
  closeImportModal: () => void;
  saveVendor: (vendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  exportVendorsCsv: () => void;
  exportProcurementReportCsv: () => void;
  importCsvData: (type: 'purchases' | 'expenses' | 'vendors', rows: any[]) => void;
  addEWayBill: (bill: EWayBillItem) => void;

  // Backward compatibility fields
  viewMode: 'list' | 'add';
  setViewMode: (mode: 'list' | 'add') => void;
  addExpense: (expense: any) => void;
  kpis: {
    totalExpenses: number;
    thisMonth: number;
    thisWeek: number;
  };
}

export type ExpenseStoreState = PurchaseExpenseState;

const initialTransactions: PurchaseTransaction[] = [];
const initialPurchaseOrders: PurchaseOrder[] = [];
const initialPurchaseBills: PurchaseBill[] = [];
const initialExpenses: ExpenseItem[] = [];
const initialCreditNotes: CreditNoteItem[] = [];
const initialEwayBills: EWayBillItem[] = [];
const initialVendors: Vendor[] = [];

const computeCurrentDateRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${fmt(start)} - ${fmt(now)}`;
};

export const useExpenseStore = create<PurchaseExpenseState>((set, get) => ({
  activeSubTab: 'all',
  setActiveSubTab: (activeSubTab) => set({ activeSubTab }),

  isLoading: false,
  isSubmitting: false,
  error: null,

  overviewKPIs: {
    totalPurchase: 0,
    totalExpense: 0,
    totalCreditNote: 0,
    openPurchaseOrders: 0,
    openPOCount: 0,
    eWayBillsCount: 0,
  },

  allTransactions: initialTransactions,
  purchaseOrders: initialPurchaseOrders,
  purchaseBills: initialPurchaseBills,
  expenses: initialExpenses,
  creditNotes: initialCreditNotes,
  ewayBills: initialEwayBills,
  vendors: initialVendors,

  searchQuery: '',
  dateRange: computeCurrentDateRange(),
  typeFilter: 'All Types',
  categoryFilter: 'All Categories',
  statusFilter: 'All Statuses',
  vendorFilter: 'All Vendors',
  cityFilter: 'All Cities',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setDateRange: (dateRange) => set({ dateRange }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setVendorFilter: (vendorFilter) => set({ vendorFilter }),
  setCityFilter: (cityFilter) => set({ cityFilter }),
  clearFilters: () =>
    set({
      searchQuery: '',
      dateRange: computeCurrentDateRange(),
      typeFilter: 'All Types',
      categoryFilter: 'All Categories',
      statusFilter: 'All Statuses',
      vendorFilter: 'All Vendors',
      cityFilter: 'All Cities',
    }),

  selectedPurchase: null,
  setSelectedPurchase: (selectedPurchase) => set({ selectedPurchase }),

  selectedVendor: null,
  setSelectedVendor: (selectedVendor) => set({ selectedVendor }),

  isEditPurchaseOpen: false,
  setIsEditPurchaseOpen: (isEditPurchaseOpen) => set({ isEditPurchaseOpen }),

  isCreateCreditNoteOpen: false,
  setIsCreateCreditNoteOpen: (isCreateCreditNoteOpen) => set({ isCreateCreditNoteOpen }),

  isAddVendorOpen: false,
  setIsAddVendorOpen: (isAddVendorOpen) => set({ isAddVendorOpen }),

  isGenerateEWayBillOpen: false,
  setIsGenerateEWayBillOpen: (isGenerateEWayBillOpen) => set({ isGenerateEWayBillOpen }),

  isCreatePOModalOpen: false,
  setIsCreatePOModalOpen: (isCreatePOModalOpen) => set({ isCreatePOModalOpen }),

  isCreateBillModalOpen: false,
  setIsCreateBillModalOpen: (isCreateBillModalOpen) => set({ isCreateBillModalOpen }),

  isCreateReturnModalOpen: false,
  setIsCreateReturnModalOpen: (isCreateReturnModalOpen) => set({ isCreateReturnModalOpen }),

  isCreateDirectPurchaseOpen: false,
  setIsCreateDirectPurchaseOpen: (isCreateDirectPurchaseOpen) =>
    set({ isCreateDirectPurchaseOpen }),

  isAddExpenseModalOpen: false,
  setIsAddExpenseModalOpen: (isAddExpenseModalOpen) => set({ isAddExpenseModalOpen }),

  isImportModalOpen: false,
  importType: null,

  openAddVendor: (vendor) => set({ isAddVendorOpen: true, selectedVendor: vendor || null }),
  closeAddVendor: () => set({ isAddVendorOpen: false, selectedVendor: null }),

  openImportModal: (type) => set({ isImportModalOpen: true, importType: type }),
  closeImportModal: () => set({ isImportModalOpen: false, importType: null }),

  saveVendor: (vendorData) =>
    set((state) => {
      if (vendorData.id && state.vendors.some((v) => v.id === vendorData.id)) {
        return {
          vendors: state.vendors.map((v) =>
            v.id === vendorData.id ? ({ ...v, ...vendorData } as Vendor) : v
          ),
          isAddVendorOpen: false,
          selectedVendor: null,
        };
      }
      const nextCode = `VND-${String(state.vendors.length + 1).padStart(3, '0')}`;
      const newVendor: Vendor = {
        id: vendorData.id || `VND-${Date.now()}`,
        vendorCode: vendorData.vendorCode || nextCode,
        vendorName: vendorData.vendorName || 'New Vendor',
        contactPerson: vendorData.contactPerson || '',
        phone: vendorData.phone || '',
        email: vendorData.email || '',
        city: vendorData.city || 'Bhilai',
        totalPurchases: Number(vendorData.totalPurchases || 0),
        status: vendorData.status || 'Active',
        gstin: vendorData.gstin || '',
        pan: vendorData.pan || '',
        category: vendorData.category || 'Inventory (Apparel)',
        paymentTerms: vendorData.paymentTerms || 'Due on Receipt',
        creditLimit: Number(vendorData.creditLimit || 0),
        openingBalance: Number(vendorData.openingBalance || 0),
        address: vendorData.address || '',
        pincode: vendorData.pincode || '',
        notes: vendorData.notes || '',
      };
      return {
        vendors: [newVendor, ...state.vendors],
        isAddVendorOpen: false,
        selectedVendor: null,
      };
    }),

  deleteVendor: (id) =>
    set((state) => ({
      vendors: state.vendors.filter((v) => v.id !== id),
    })),

  exportVendorsCsv: () => {
    const state = useExpenseStore.getState();
    const headers = [
      'Vendor Code',
      'Vendor Name',
      'Contact Person',
      'Phone',
      'Email',
      'City',
      'Category',
      'GSTIN',
      'Payment Terms',
      'Total Purchases (INR)',
      'Status',
    ];
    const rows = state.vendors.map((v) => [
      v.vendorCode,
      v.vendorName,
      v.contactPerson,
      v.phone,
      v.email,
      v.city,
      v.category,
      v.gstin || '',
      v.paymentTerms,
      v.totalPurchases,
      v.status,
    ]);
    downloadCSV('vendors_directory.csv', headers, rows);
  },

  exportProcurementReportCsv: () => {
    const state = useExpenseStore.getState();
    const headers = [
      'Reference No',
      'Date',
      'Type',
      'Vendor / Paid To',
      'Category',
      'Amount (INR)',
      'Status',
    ];
    const rows = state.allTransactions.map((t) => [
      t.referenceNo,
      `${t.date} ${t.time}`,
      t.type,
      t.vendorOrPaidTo,
      t.category,
      t.amount,
      t.status,
    ]);
    downloadCSV('procurement_expenses_report.csv', headers, rows);
  },

  importCsvData: (type, rows) => {
    set((state) => {
      if (type === 'vendors') {
        const imported: Vendor[] = rows.map((r, idx) => ({
          id: `VND-IMP-${Date.now()}-${idx}`,
          vendorCode:
            r.vendorCode ||
            r['Vendor Code'] ||
            `VND-${String(state.vendors.length + idx + 1).padStart(3, '0')}`,
          vendorName: r.vendorName || r['Vendor Name'] || 'Imported Vendor',
          contactPerson: r.contactPerson || r['Contact Person'] || '',
          phone: r.phone || r['Phone'] || '',
          email: r.email || r['Email'] || '',
          city: r.city || r['City'] || 'Bhilai',
          totalPurchases: Number(r.totalPurchases || r['Total Purchases'] || 0),
          status: (r.status || r['Status'] || 'Active') as any,
          gstin: r.gstin || r['GSTIN'] || '',
          pan: r.pan || r['PAN'] || '',
          category: r.category || r['Category'] || 'General',
          paymentTerms: r.paymentTerms || r['Payment Terms'] || 'Due on Receipt',
          creditLimit: Number(r.creditLimit || 0),
          openingBalance: Number(r.openingBalance || 0),
        }));
        return {
          vendors: [...imported, ...state.vendors],
          isImportModalOpen: false,
          importType: null,
        };
      }
      if (type === 'purchases') {
        const imported: PurchaseTransaction[] = rows.map((r, idx) => ({
          id: `TXN-IMP-${Date.now()}-${idx}`,
          date: r.date || r['Date'] || '11 May 2024',
          time: '12:00 PM',
          referenceNo:
            r.referenceNo ||
            r['Reference No'] ||
            `BILL-2024-${Math.floor(100000 + Math.random() * 900000)}`,
          type: 'Purchase',
          vendorOrPaidTo: r.vendor || r['Vendor'] || 'Vendor',
          category: r.category || r['Category'] || 'Inventory (Apparel)',
          amount: -Math.abs(Number(r.amount || r['Amount'] || 1000)),
          status: 'Paid',
        }));
        return {
          allTransactions: [...imported, ...state.allTransactions],
          isImportModalOpen: false,
          importType: null,
        };
      }
      if (type === 'expenses') {
        const imported: ExpenseItem[] = rows.map((r, idx) => ({
          id: `EXP-IMP-${Date.now()}-${idx}`,
          expenseNo:
            r.referenceNo ||
            r['Reference No'] ||
            `EXP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
          date: r.date || r['Date'] || '11 May 2024',
          time: '12:00 PM',
          category: r.category || r['Category'] || 'General',
          description: r.description || r['Description'] || 'Business Expense',
          amount: Number(r.amount || r['Amount'] || 500),
          paymentMethod: r.paymentMethod || r['Payment Method'] || 'Cash',
          status: 'Paid',
        }));
        return {
          expenses: [...imported, ...state.expenses],
          isImportModalOpen: false,
          importType: null,
        };
      }
      return { isImportModalOpen: false, importType: null };
    });
  },

  addEWayBill: (bill) =>
    set((state) => ({
      ewayBills: [bill, ...state.ewayBills],
      isGenerateEWayBillOpen: false,
    })),

  viewMode: 'list',
  setViewMode: (viewMode) => set({ viewMode }),

  fetchExpenseData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [kpis, txns, exps, vnds, prchs, cns, ewbs] = await Promise.allSettled([
        expensesApi.getOverview(),
        expensesApi.getAllTransactions(),
        expensesApi.getExpenses(),
        expensesApi.getVendors(),
        expensesApi.getPurchases(),
        expensesApi.getCreditNotes(),
        expensesApi.getEWayBills(),
      ]);

      const updates: Partial<PurchaseExpenseState> = { isLoading: false };

      if (kpis.status === 'fulfilled' && kpis.value && kpis.value.totalPurchase !== undefined) {
        updates.overviewKPIs = kpis.value;
      }

      if (txns.status === 'fulfilled' && Array.isArray(txns.value) && txns.value.length > 0) {
        updates.allTransactions = txns.value;
      }

      if (exps.status === 'fulfilled' && Array.isArray(exps.value) && exps.value.length > 0) {
        updates.expenses = exps.value.map((e: any) => ({
          id: e._id || e.id,
          expenseNo: e.expenseNo,
          date: e.date,
          time: e.time,
          category: e.category,
          description: e.description,
          amount: e.amount,
          paymentMethod: e.paymentMethod,
          status: e.status,
        }));
      }

      if (vnds.status === 'fulfilled' && Array.isArray(vnds.value) && vnds.value.length > 0) {
        updates.vendors = vnds.value.map((v: any) => ({
          id: v._id || v.id,
          vendorCode: v.vendorCode,
          vendorName: v.vendorName,
          contactPerson: v.contactPerson,
          phone: v.phone,
          email: v.email,
          city: v.city,
          totalPurchases: v.totalPurchases || 0,
          status: v.status || 'Active',
          category: v.category || 'General',
          paymentTerms: v.paymentTerms || 'Due on Receipt',
          creditLimit: v.creditLimit || 0,
          openingBalance: v.openingBalance || 0,
        }));
      }

      if (prchs.status === 'fulfilled' && Array.isArray(prchs.value) && prchs.value.length > 0) {
        updates.purchaseBills = prchs.value
          .filter((p: any) => p.type !== 'Purchase Order')
          .map((p: any) => ({
            id: p._id || p.id,
            billNumber: p.billNumber,
            date: p.date,
            time: p.time,
            vendor: p.vendor,
            itemsCount: p.itemsCount || '1 item',
            totalAmount: p.totalAmount,
            paymentStatus: p.paymentStatus,
            dueDate: p.dueDate || '',
          }));

        updates.purchaseOrders = prchs.value
          .filter((p: any) => p.type === 'Purchase Order')
          .map((p: any) => ({
            id: p._id || p.id,
            poNumber: p.billNumber,
            date: p.date,
            time: p.time,
            vendor: p.vendor,
            itemsCount: p.itemsCount || '1 item',
            totalAmount: p.totalAmount,
            expectedDate: p.dueDate || '',
            status: p.paymentStatus === 'Paid' ? 'Received' : 'Pending',
          }));
      }

      if (cns.status === 'fulfilled' && Array.isArray(cns.value) && cns.value.length > 0) {
        updates.creditNotes = cns.value.map((c: any) => ({
          id: c._id || c.id,
          creditNoteNo: c.creditNoteNo,
          date: c.date,
          time: c.time,
          referencePurchase: c.referencePurchase,
          vendor: c.vendor,
          reasonType: c.reasonType,
          amount: c.amount,
          status: c.status,
        }));
      }

      if (ewbs.status === 'fulfilled' && Array.isArray(ewbs.value) && ewbs.value.length > 0) {
        updates.ewayBills = ewbs.value.map((ew: any) => ({
          id: ew._id || ew.id,
          eWayBillNo: ew.eWayBillNo,
          date: ew.date,
          time: ew.time,
          invoiceBillNo: ew.invoiceBillNo,
          vendor: ew.vendor,
          fromTo: ew.fromTo,
          distanceKm: ew.distanceKm,
          validTill: ew.validTill,
          status: ew.status,
        }));
      }

      set(updates);
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to load expense data' });
    }
  },

  createExpenseRecord: async (data: any) => {
    set({ isSubmitting: true, error: null });
    try {
      await expensesApi.createExpense(data);
      await get().fetchExpenseData();
      set({ isSubmitting: false, isAddExpenseModalOpen: false, viewMode: 'list' });
      return true;
    } catch (err: any) {
      console.error('Failed to create expense:', err);
      set({ isSubmitting: false, error: err.message || 'Failed to create expense' });
      return false;
    }
  },

  createVendorRecord: async (data: any) => {
    set({ isSubmitting: true, error: null });
    try {
      await expensesApi.createVendor(data);
      await get().fetchExpenseData();
      set({ isSubmitting: false, isAddVendorOpen: false });
      return true;
    } catch (err: any) {
      console.error('Failed to create vendor:', err);
      set({ isSubmitting: false, error: err.message || 'Failed to create vendor' });
      return false;
    }
  },

  createPurchaseRecord: async (data: any) => {
    set({ isSubmitting: true, error: null });
    try {
      const payload = {
        vendor: data.vendor || data.vendorName || 'Sharma Enterprises',
        itemsCount: `${data.items?.length || 1} items`,
        totalAmount: data.totalAmount > 0 ? data.totalAmount : 1,
        paymentStatus:
          data.paymentStatus?.toLowerCase() === 'paid'
            ? 'Paid'
            : data.paymentStatus?.toLowerCase() === 'partial' || data.paymentStatus === 'Partially Paid'
            ? 'Partially Paid'
            : 'Unpaid',
        status: data.status || 'Received',
        dueDate: data.dueDate || '',
        type: data.type || 'Purchase',
        items: (data.items || []).map((it: any) => ({
          name: it.name || it.productName || 'Inventory Item',
          quantity: it.quantity || it.qty || 1,
          unitPrice: it.unitPrice || it.rate || it.purchaseRate || 0,
        })),
      };
      await expensesApi.createPurchase(payload);
      await get().fetchExpenseData();
      set({
        isSubmitting: false,
        isCreateBillModalOpen: false,
        isCreatePOModalOpen: false,
        isCreateDirectPurchaseOpen: false,
      });
      return true;
    } catch (err: any) {
      console.error('Failed to create purchase:', err);
      const now = new Date();
      const fallbackBill: PurchaseBill = {
        id: `bill-${Date.now()}`,
        billNumber: data.billNumber || `BILL-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        vendor: data.vendor || data.vendorName || 'Sharma Enterprises',
        itemsCount: `${data.items?.length || 1} items`,
        totalAmount: data.totalAmount || 1,
        paymentStatus: data.paymentStatus?.toLowerCase() === 'paid' ? 'Paid' : 'Unpaid',
        dueDate: data.dueDate || 'In 14 days',
      };
      set((s) => ({
        purchases: [fallbackBill, ...s.purchases],
        overviewKPIs: {
          ...s.overviewKPIs,
          totalPurchase: s.overviewKPIs.totalPurchase + (data.totalAmount || 0),
        },
        isSubmitting: false,
        isCreateBillModalOpen: false,
        isCreatePOModalOpen: false,
        isCreateDirectPurchaseOpen: false,
      }));
      return true;
    }
  },

  receivePurchaseRecord: async (id: string) => {
    set({ isSubmitting: true, error: null });
    try {
      await expensesApi.receivePurchase(id);
      await get().fetchExpenseData();
      set({ isSubmitting: false });
      return true;
    } catch (err: any) {
      console.error('Failed to receive purchase:', err);
      set({ isSubmitting: false, error: err.message || 'Failed to receive purchase' });
      return false;
    }
  },

  createCreditNoteRecord: async (data: any) => {
    set({ isSubmitting: true, error: null });
    try {
      await expensesApi.createCreditNote(data);
      await get().fetchExpenseData();
      set({ isSubmitting: false, isCreateCreditNoteOpen: false, isCreateReturnModalOpen: false });
      return true;
    } catch (err: any) {
      console.error('Failed to create credit note:', err);
      set({ isSubmitting: false, error: err.message || 'Failed to create credit note' });
      return false;
    }
  },

  createEWayBillRecord: async (data: any) => {
    set({ isSubmitting: true, error: null });
    try {
      await expensesApi.createEWayBill(data);
      await get().fetchExpenseData();
      set({ isSubmitting: false, isGenerateEWayBillOpen: false });
      return true;
    } catch (err: any) {
      console.error('Failed to create e-way bill:', err);
      set({ isSubmitting: false, error: err.message || 'Failed to create e-way bill' });
      return false;
    }
  },

  deleteExpenseRecord: async (id: string) => {
    try {
      await expensesApi.deleteExpense(id);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
        allTransactions: state.allTransactions.filter((t) => t.id !== id),
      }));
      return true;
    } catch (err) {
      console.error('Failed to delete expense:', err);
      return false;
    }
  },

  addExpense: (newExp: any) =>
    set((state) => ({
      expenses: [
        {
          id: Date.now().toString(),
          expenseNo: `EXP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
          date: newExp.date || '11 May 2024',
          time: '12:00 PM',
          category: newExp.category || 'General',
          description: newExp.name || newExp.description || 'Business Expense',
          amount: Number(newExp.amount || 0),
          paymentMethod: newExp.paymentMethod || 'Cash',
          status: 'Paid',
        },
        ...state.expenses,
      ],
      viewMode: 'list',
    })),
  kpis: {
    totalExpenses: 0,
    thisMonth: 0,
    thisWeek: 0,
  },
}));
