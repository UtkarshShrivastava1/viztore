import { create } from 'zustand';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  subcategory: string;
  productType: string;
  brand: string;
  stock: number;
  reserved: number;
  available: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockValue: number;
  lastUpdated: string;
  imageUrl: string;
  size: string;
  color: string;
}

export interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  date: string;
  type: 'stock_in' | 'stock_out';
  referenceType: 'Purchase' | 'Order' | 'Stock Adjustment';
  referenceNo: string;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  notes: string;
  performedBy: string;
}

export type InventoryViewMode = 'overview' | 'bulk_adjust' | 'stock_history';

interface InventoryStoreState {
  items: InventoryItem[];
  transactions: StockTransaction[];
  viewMode: InventoryViewMode;
  
  // Selection
  selectedIds: string[];
  
  // Filters for Overview & Bulk
  searchQuery: string;
  categoryFilter: string;
  subcategoryFilter: string;
  productTypeFilter: string;
  brandFilter: string;
  statusFilter: string;
  
  // Pagination for Overview
  currentPage: number;
  pageSize: number;
  totalProductCount: number;

  // Filters for Stock History Page
  historyDateRange: string;
  historyProductFilter: string;
  historyCategoryFilter: string;
  historyTypeFilter: string;
  historyRefTypeFilter: string;
  historyCurrentPage: number;
  historyPageSize: number;

  // Drawers & Modals
  adjustDrawerItem: InventoryItem | null;
  historyDrawerItem: InventoryItem | null;
  deleteConfirmItem: InventoryItem | null;
  detailModalItem: InventoryItem | null;

  // Actions
  setViewMode: (mode: InventoryViewMode) => void;
  setSelectedIds: (ids: string[]) => void;
  toggleSelectId: (id: string) => void;
  toggleSelectAll: () => void;
  
  setSearchQuery: (q: string) => void;
  setCategoryFilter: (cat: string) => void;
  setSubcategoryFilter: (sub: string) => void;
  setProductTypeFilter: (type: string) => void;
  setBrandFilter: (brand: string) => void;
  setStatusFilter: (status: string) => void;
  clearFilters: () => void;
  
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  setHistoryDateRange: (range: string) => void;
  setHistoryProductFilter: (prod: string) => void;
  setHistoryCategoryFilter: (cat: string) => void;
  setHistoryTypeFilter: (t: string) => void;
  setHistoryRefTypeFilter: (ref: string) => void;
  setHistoryCurrentPage: (page: number) => void;
  clearHistoryFilters: () => void;

  openAdjustDrawer: (item: InventoryItem) => void;
  closeAdjustDrawer: () => void;
  openHistoryDrawer: (item: InventoryItem) => void;
  closeHistoryDrawer: () => void;
  openDeleteModal: (item: InventoryItem) => void;
  closeDeleteModal: () => void;
  openDetailModal: (item: InventoryItem) => void;
  closeDetailModal: () => void;

  adjustStock: (
    productId: string,
    adjustmentType: 'increase' | 'decrease' | 'set',
    quantity: number,
    reason: string,
    reference?: string,
    notes?: string
  ) => void;

  bulkAdjustStock: (
    adjustments: Array<{
      productId: string;
      adjustmentType: 'increase' | 'decrease';
      quantity: number;
      reason?: string;
      reference?: string;
      notes?: string;
    }>
  ) => void;

  duplicateItem: (productId: string) => void;
  deleteItem: (productId: string) => void;
}

const mockInventoryItems: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Men Black Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-BLK-M',
    barcode: '8901234567890',
    category: 'Men',
    subcategory: 'T-Shirts',
    productType: 'Round Neck T-Shirt',
    brand: 'Roadster',
    stock: 120,
    reserved: 10,
    available: 110,
    status: 'in_stock',
    stockValue: 65880,
    lastUpdated: '10 May 2024 10:30 AM',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80',
    size: 'M',
    color: 'Black',
  },
  {
    id: 'inv-2',
    name: 'Men White Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-WHT-M',
    barcode: '8901234567891',
    category: 'Men',
    subcategory: 'T-Shirts',
    productType: 'Round Neck T-Shirt',
    brand: 'Roadster',
    stock: 80,
    reserved: 5,
    available: 75,
    status: 'in_stock',
    stockValue: 44920,
    lastUpdated: '10 May 2024 10:15 AM',
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=120&auto=format&fit=crop&q=80',
    size: 'M',
    color: 'White',
  },
  {
    id: 'inv-3',
    name: 'Men Navy Blue Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-NVY-L',
    barcode: '8901234567892',
    category: 'Men',
    subcategory: 'T-Shirts',
    productType: 'Round Neck T-Shirt',
    brand: 'Roadster',
    stock: 60,
    reserved: 8,
    available: 52,
    status: 'in_stock',
    stockValue: 32940,
    lastUpdated: '09 May 2024 05:45 PM',
    imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=120&auto=format&fit=crop&q=80',
    size: 'L',
    color: 'Navy Blue',
  },
  {
    id: 'inv-4',
    name: 'Men Grey Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-GRY-M',
    barcode: '8901234567893',
    category: 'Men',
    subcategory: 'T-Shirts',
    productType: 'Round Neck T-Shirt',
    brand: 'Roadster',
    stock: 45,
    reserved: 2,
    available: 43,
    status: 'in_stock',
    stockValue: 24705,
    lastUpdated: '09 May 2024 04:20 PM',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=120&auto=format&fit=crop&q=80',
    size: 'M',
    color: 'Grey',
  },
  {
    id: 'inv-5',
    name: 'Men Black Polo T-Shirt',
    sku: 'PRD-POLO-BLK-M',
    barcode: '8901234567894',
    category: 'Men',
    subcategory: 'T-Shirts',
    productType: 'Polo T-Shirt',
    brand: 'Roadster',
    stock: 30,
    reserved: 5,
    available: 25,
    status: 'low_stock',
    stockValue: 18725,
    lastUpdated: '08 May 2024 11:10 AM',
    imageUrl: 'https://images.unsplash.com/photo-1625910513413-7a544f800be3?w=120&auto=format&fit=crop&q=80',
    size: 'M',
    color: 'Black',
  },
  {
    id: 'inv-6',
    name: 'Men Maroon Polo T-Shirt',
    sku: 'PRD-POLO-MRN-L',
    barcode: '8901234567895',
    category: 'Men',
    subcategory: 'T-Shirts',
    productType: 'Polo T-Shirt',
    brand: 'Roadster',
    stock: 25,
    reserved: 3,
    available: 22,
    status: 'low_stock',
    stockValue: 16470,
    lastUpdated: '08 May 2024 10:05 AM',
    imageUrl: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=120&auto=format&fit=crop&q=80',
    size: 'L',
    color: 'Maroon',
  },
  {
    id: 'inv-7',
    name: 'Men Blue Henley T-Shirt',
    sku: 'PRD-HENLEY-BLU-M',
    barcode: '8901234567896',
    category: 'Men',
    subcategory: 'T-Shirts',
    productType: 'Henley T-Shirt',
    brand: 'Roadster',
    stock: 20,
    reserved: 0,
    available: 20,
    status: 'in_stock',
    stockValue: 13980,
    lastUpdated: '07 May 2024 03:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&auto=format&fit=crop&q=80',
    size: 'M',
    color: 'Blue',
  },
  {
    id: 'inv-8',
    name: 'Men Striped Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-STP-M',
    barcode: '8901234567897',
    category: 'Men',
    subcategory: 'T-Shirts',
    productType: 'Round Neck T-Shirt',
    brand: 'Roadster',
    stock: 0,
    reserved: 0,
    available: 0,
    status: 'out_of_stock',
    stockValue: 0,
    lastUpdated: '07 May 2024 02:15 PM',
    imageUrl: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=120&auto=format&fit=crop&q=80',
    size: 'M',
    color: 'White/Black',
  },
];

const mockStockTransactions: StockTransaction[] = [
  {
    id: 'tx-1',
    productId: 'inv-1',
    productName: 'Men Black Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-BLK-M',
    date: '11 May 2024, 10:30 AM',
    type: 'stock_in',
    referenceType: 'Purchase',
    referenceNo: 'PO#1234',
    quantity: 120,
    stockBefore: 0,
    stockAfter: 120,
    notes: 'Stock received from supplier',
    performedBy: 'Sujal Verma',
  },
  {
    id: 'tx-2',
    productId: 'inv-2',
    productName: 'Men White Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-WHT-M',
    date: '11 May 2024, 09:15 AM',
    type: 'stock_in',
    referenceType: 'Purchase',
    referenceNo: 'PO#1234',
    quantity: 80,
    stockBefore: 0,
    stockAfter: 80,
    notes: 'Stock received from supplier',
    performedBy: 'Sujal Verma',
  },
  {
    id: 'tx-3',
    productId: 'inv-1',
    productName: 'Men Black Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-BLK-M',
    date: '10 May 2024, 07:45 PM',
    type: 'stock_out',
    referenceType: 'Order',
    referenceNo: 'ORD-4567',
    quantity: -10,
    stockBefore: 120,
    stockAfter: 110,
    notes: 'Order packed',
    performedBy: 'System',
  },
  {
    id: 'tx-4',
    productId: 'inv-3',
    productName: 'Men Navy Blue Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-NVY-L',
    date: '10 May 2024, 06:20 PM',
    type: 'stock_out',
    referenceType: 'Order',
    referenceNo: 'ORD-4566',
    quantity: -8,
    stockBefore: 60,
    stockAfter: 52,
    notes: 'Order packed',
    performedBy: 'System',
  },
  {
    id: 'tx-5',
    productId: 'inv-4',
    productName: 'Men Grey Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-GRY-M',
    date: '10 May 2024, 05:10 PM',
    type: 'stock_in',
    referenceType: 'Purchase',
    referenceNo: 'PO#1220',
    quantity: 45,
    stockBefore: 0,
    stockAfter: 43,
    notes: 'Stock received from supplier',
    performedBy: 'Sujal Verma',
  },
  {
    id: 'tx-6',
    productId: 'inv-5',
    productName: 'Men Black Polo T-Shirt',
    sku: 'PRD-POLO-BLK-M',
    date: '10 May 2024, 04:00 PM',
    type: 'stock_out',
    referenceType: 'Order',
    referenceNo: 'ORD-4565',
    quantity: -5,
    stockBefore: 30,
    stockAfter: 25,
    notes: 'Order packed',
    performedBy: 'System',
  },
  {
    id: 'tx-7',
    productId: 'inv-6',
    productName: 'Men Maroon Polo T-Shirt',
    sku: 'PRD-POLO-MRN-L',
    date: '09 May 2024, 08:30 PM',
    type: 'stock_out',
    referenceType: 'Order',
    referenceNo: 'ORD-4564',
    quantity: -3,
    stockBefore: 25,
    stockAfter: 22,
    notes: 'Order packed',
    performedBy: 'System',
  },
  {
    id: 'tx-8',
    productId: 'inv-7',
    productName: 'Men Blue Henley T-Shirt',
    sku: 'PRD-HENLEY-BLU-M',
    date: '09 May 2024, 03:20 PM',
    type: 'stock_in',
    referenceType: 'Purchase',
    referenceNo: 'PO#1215',
    quantity: 20,
    stockBefore: 0,
    stockAfter: 20,
    notes: 'Stock received from supplier',
    performedBy: 'Sujal Verma',
  },
  {
    id: 'tx-9',
    productId: 'inv-1',
    productName: 'Men Black Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-BLK-M',
    date: '09 May 2024, 11:05 AM',
    type: 'stock_out',
    referenceType: 'Order',
    referenceNo: 'ORD-4563',
    quantity: -10,
    stockBefore: 130,
    stockAfter: 120,
    notes: 'Order packed',
    performedBy: 'System',
  },
  {
    id: 'tx-10',
    productId: 'inv-5',
    productName: 'Men Black Polo T-Shirt',
    sku: 'PRD-POLO-BLK-M',
    date: '08 May 2024, 09:40 PM',
    type: 'stock_in',
    referenceType: 'Stock Adjustment',
    referenceNo: 'ADJ-1001',
    quantity: 5,
    stockBefore: 25,
    stockAfter: 30,
    notes: 'Stock adjustment',
    performedBy: 'Sujal Verma',
  },
];

export const useInventoryStore = create<InventoryStoreState>((set, get) => ({
  items: mockInventoryItems,
  transactions: mockStockTransactions,
  viewMode: 'overview',
  
  selectedIds: [],

  searchQuery: '',
  categoryFilter: 'All Categories',
  subcategoryFilter: 'All Sub-categories',
  productTypeFilter: 'All Product Types',
  brandFilter: 'All Brands',
  statusFilter: 'All Statuses',
  
  currentPage: 1,
  pageSize: 10,
  totalProductCount: 1248,

  historyDateRange: 'Last 30 Days (12 Apr 2024 - 11 May 2024)',
  historyProductFilter: 'All Products',
  historyCategoryFilter: 'All Categories',
  historyTypeFilter: 'All Types',
  historyRefTypeFilter: 'All Reference Types',
  historyCurrentPage: 1,
  historyPageSize: 10,

  adjustDrawerItem: null,
  historyDrawerItem: null,
  deleteConfirmItem: null,
  detailModalItem: null,

  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  toggleSelectId: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((item) => item !== id)
        : [...state.selectedIds, id],
    })),
  toggleSelectAll: () =>
    set((state) => {
      if (state.selectedIds.length === state.items.length) {
        return { selectedIds: [] };
      }
      return { selectedIds: state.items.map((i) => i.id) };
    }),

  setSearchQuery: (q) => set({ searchQuery: q, currentPage: 1 }),
  setCategoryFilter: (cat) => set({ categoryFilter: cat, currentPage: 1 }),
  setSubcategoryFilter: (sub) => set({ subcategoryFilter: sub, currentPage: 1 }),
  setProductTypeFilter: (type) => set({ productTypeFilter: type, currentPage: 1 }),
  setBrandFilter: (brand) => set({ brandFilter: brand, currentPage: 1 }),
  setStatusFilter: (status) => set({ statusFilter: status, currentPage: 1 }),
  clearFilters: () =>
    set({
      searchQuery: '',
      categoryFilter: 'All Categories',
      subcategoryFilter: 'All Sub-categories',
      productTypeFilter: 'All Product Types',
      brandFilter: 'All Brands',
      statusFilter: 'All Statuses',
      currentPage: 1,
    }),

  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),

  setHistoryDateRange: (range) => set({ historyDateRange: range, historyCurrentPage: 1 }),
  setHistoryProductFilter: (prod) => set({ historyProductFilter: prod, historyCurrentPage: 1 }),
  setHistoryCategoryFilter: (cat) => set({ historyCategoryFilter: cat, historyCurrentPage: 1 }),
  setHistoryTypeFilter: (t) => set({ historyTypeFilter: t, historyCurrentPage: 1 }),
  setHistoryRefTypeFilter: (ref) => set({ historyRefTypeFilter: ref, historyCurrentPage: 1 }),
  setHistoryCurrentPage: (page) => set({ historyCurrentPage: page }),
  clearHistoryFilters: () =>
    set({
      historyProductFilter: 'All Products',
      historyCategoryFilter: 'All Categories',
      historyTypeFilter: 'All Types',
      historyRefTypeFilter: 'All Reference Types',
      historyCurrentPage: 1,
    }),

  openAdjustDrawer: (item) => set({ adjustDrawerItem: item }),
  closeAdjustDrawer: () => set({ adjustDrawerItem: null }),
  openHistoryDrawer: (item) => set({ historyDrawerItem: item }),
  closeHistoryDrawer: () => set({ historyDrawerItem: null }),
  openDeleteModal: (item) => set({ deleteConfirmItem: item }),
  closeDeleteModal: () => set({ deleteConfirmItem: null }),
  openDetailModal: (item) => set({ detailModalItem: item }),
  closeDetailModal: () => set({ detailModalItem: null }),

  adjustStock: (productId, adjustmentType, quantity, reason, reference, notes) => {
    set((state) => {
      const item = state.items.find((i) => i.id === productId);
      if (!item) return state;

      let newStock = item.stock;
      let delta = 0;
      let txType: 'stock_in' | 'stock_out' = 'stock_in';

      if (adjustmentType === 'increase') {
        delta = quantity;
        newStock = item.stock + quantity;
        txType = 'stock_in';
      } else if (adjustmentType === 'decrease') {
        delta = -quantity;
        newStock = Math.max(0, item.stock - quantity);
        txType = 'stock_out';
      } else if (adjustmentType === 'set') {
        delta = quantity - item.stock;
        newStock = quantity;
        txType = delta >= 0 ? 'stock_in' : 'stock_out';
      }

      const newAvailable = Math.max(0, newStock - item.reserved);
      const unitValue = item.stock > 0 ? item.stockValue / item.stock : 549;
      const newStockValue = Math.round(newStock * unitValue);
      const newStatus: 'in_stock' | 'low_stock' | 'out_of_stock' =
        newStock <= 0 ? 'out_of_stock' : newStock <= 30 ? 'low_stock' : 'in_stock';

      const updatedItems = state.items.map((i) =>
        i.id === productId
          ? {
              ...i,
              stock: newStock,
              available: newAvailable,
              stockValue: newStockValue,
              status: newStatus,
              lastUpdated: 'Just now',
            }
          : i
      );

      const newTx: StockTransaction = {
        id: 'tx-' + Date.now(),
        productId: item.id,
        productName: item.name,
        sku: item.sku,
        date: 'Just now',
        type: txType,
        referenceType: 'Stock Adjustment',
        referenceNo: reference || 'ADJ-' + Math.floor(1000 + Math.random() * 9000),
        quantity: delta,
        stockBefore: item.stock,
        stockAfter: newStock,
        notes: notes || reason || 'Manual adjustment',
        performedBy: 'Sujal Verma',
      };

      return {
        items: updatedItems,
        transactions: [newTx, ...state.transactions],
        adjustDrawerItem: null,
      };
    });
  },

  bulkAdjustStock: (adjustments) => {
    set((state) => {
      const updatedItems: InventoryItem[] = [...state.items];
      const newTxs: StockTransaction[] = [];

      adjustments.forEach((adj) => {
        const index = updatedItems.findIndex((i) => i.id === adj.productId);
        if (index === -1) return;
        const currentItem = updatedItems[index];
        if (!currentItem) return;

        const delta = adj.adjustmentType === 'increase' ? adj.quantity : -adj.quantity;
        const newStock = Math.max(0, currentItem.stock + delta);
        const newAvailable = Math.max(0, newStock - currentItem.reserved);
        const unitValue = currentItem.stock > 0 ? currentItem.stockValue / currentItem.stock : 549;
        const newStockValue = Math.round(newStock * unitValue);
        const newStatus: 'in_stock' | 'low_stock' | 'out_of_stock' =
          newStock <= 0 ? 'out_of_stock' : newStock <= 30 ? 'low_stock' : 'in_stock';

        updatedItems[index] = {
          ...currentItem,
          stock: newStock,
          available: newAvailable,
          stockValue: newStockValue,
          status: newStatus,
          lastUpdated: 'Just now',
        };

        if (adj.quantity > 0) {
          newTxs.push({
            id: 'tx-' + Date.now() + '-' + currentItem.id,
            productId: currentItem.id,
            productName: currentItem.name,
            sku: currentItem.sku,
            date: 'Just now',
            type: adj.adjustmentType === 'increase' ? 'stock_in' : 'stock_out',
            referenceType: 'Stock Adjustment',
            referenceNo: adj.reference || 'ADJ-BATCH',
            quantity: delta,
            stockBefore: currentItem.stock,
            stockAfter: newStock,
            notes: adj.notes || adj.reason || 'Batch Stock Adjustment',
            performedBy: 'Sujal Verma',
          });
        }
      });

      return {
        items: updatedItems,
        transactions: [...newTxs, ...state.transactions],
        viewMode: 'overview',
      };
    });
  },

  duplicateItem: (productId) => {
    set((state) => {
      const item = state.items.find((i) => i.id === productId);
      if (!item) return state;

      const newItem: InventoryItem = {
        ...item,
        id: 'inv-' + Date.now(),
        name: item.name + ' (Copy)',
        sku: item.sku + '-COPY',
        barcode: String(Number(item.barcode) + 1),
        lastUpdated: 'Just now',
      };

      return {
        items: [newItem, ...state.items],
        totalProductCount: state.totalProductCount + 1,
      };
    });
  },

  deleteItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== productId),
      deleteConfirmItem: null,
      totalProductCount: Math.max(0, state.totalProductCount - 1),
    }));
  },
}));
