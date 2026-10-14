import { create } from 'zustand';
import type { ProductItem } from './catalogStore.js';
import { useCatalogStore } from './catalogStore.js';

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
  referenceType: 'Purchase' | 'Order' | 'Stock Adjustment' | 'POS Sale' | 'Return';
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
  setItemsFromProducts: (products: ProductItem[]) => void;
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
    notes?: string,
  ) => Promise<void>;

  bulkAdjustStock: (
    adjustments: Array<{
      productId: string;
      adjustmentType: 'increase' | 'decrease';
      quantity: number;
      reason?: string;
      reference?: string;
      notes?: string;
    }>,
  ) => Promise<void>;

  duplicateItem: (productId: string) => void;
  deleteItem: (productId: string) => void;

  // Real-Time Stock Synchronization with Online Store and In-House POS Billing
  recordSaleDeduction: (
    items: Array<{ id?: string; productId?: string; sku?: string; quantity: number }>,
    referenceNo: string,
    source: 'pos' | 'online_order' | 'manual_order',
    notes?: string
  ) => void;
  recordOrderOnlineNotification: (orderPayload: {
    orderId?: string;
    orderNumber?: string;
    grandTotal?: number;
    itemsCount?: number;
  }) => void;
}

export const initialMockupTransactions: StockTransaction[] = [
  {
    id: 'tx-mock-01',
    productId: 'prd-mock-01',
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
    performedBy: 'Store Staff',
  },
  {
    id: 'tx-mock-02',
    productId: 'prd-mock-02',
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
    performedBy: 'Store Staff',
  },
  {
    id: 'tx-mock-03',
    productId: 'prd-mock-01',
    productName: 'Men Black Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-BLK-M',
    date: '10 May 2024, 07:45 PM',
    type: 'stock_out',
    referenceType: 'Order',
    referenceNo: 'ORD-4567',
    quantity: -10,
    stockBefore: 120,
    stockAfter: 110,
    notes: 'Sold via Order #ORD-4567',
    performedBy: 'System',
  },
  {
    id: 'tx-mock-04',
    productId: 'prd-mock-03',
    productName: 'Men Navy Blue Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-NVY-L',
    date: '10 May 2024, 06:20 PM',
    type: 'stock_out',
    referenceType: 'Order',
    referenceNo: 'ORD-4566',
    quantity: -8,
    stockBefore: 60,
    stockAfter: 52,
    notes: 'Sold via Order #ORD-4566',
    performedBy: 'System',
  },
  {
    id: 'tx-mock-05',
    productId: 'prd-mock-04',
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
    performedBy: 'Store Staff',
  },
  {
    id: 'tx-mock-06',
    productId: 'prd-mock-05',
    productName: 'Men Black Polo T-Shirt',
    sku: 'PRD-POLO-BLK-M',
    date: '10 May 2024, 04:00 PM',
    type: 'stock_out',
    referenceType: 'Order',
    referenceNo: 'ORD-4565',
    quantity: -5,
    stockBefore: 30,
    stockAfter: 25,
    notes: 'Sold via Order #ORD-4565',
    performedBy: 'System',
  },
  {
    id: 'tx-mock-07',
    productId: 'prd-mock-06',
    productName: 'Men Maroon Polo T-Shirt',
    sku: 'PRD-POLO-MRN-L',
    date: '09 May 2024, 08:30 PM',
    type: 'stock_out',
    referenceType: 'Order',
    referenceNo: 'ORD-4564',
    quantity: -3,
    stockBefore: 25,
    stockAfter: 22,
    notes: 'Sold via Order #ORD-4564',
    performedBy: 'System',
  },
  {
    id: 'tx-mock-08',
    productId: 'prd-mock-07',
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
    performedBy: 'Store Staff',
  },
  {
    id: 'tx-mock-09',
    productId: 'prd-mock-01',
    productName: 'Men Black Round Neck T-Shirt',
    sku: 'PRD-TSHIRT-RD-BLK-M',
    date: '09 May 2024, 11:05 AM',
    type: 'stock_out',
    referenceType: 'Order',
    referenceNo: 'ORD-4563',
    quantity: -10,
    stockBefore: 130,
    stockAfter: 120,
    notes: 'Sold via Order #ORD-4563',
    performedBy: 'System',
  },
  {
    id: 'tx-mock-10',
    productId: 'prd-mock-05',
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
    performedBy: 'Store Staff',
  },
];

const defaultReservedBySku: Record<string, number> = {
  'PRD-TSHIRT-RD-BLK-M': 10,
  'PRD-TSHIRT-RD-WHT-M': 5,
  'PRD-TSHIRT-RD-NVY-L': 8,
  'PRD-TSHIRT-RD-GRY-M': 2,
  'PRD-POLO-BLK-M': 5,
  'PRD-POLO-MRN-L': 3,
  'PRD-HENLEY-BLU-M': 0,
  'PRD-TSHIRT-RD-STP-M': 0,
};

export const useInventoryStore = create<InventoryStoreState>((set, get) => ({
  items: [],
  transactions: initialMockupTransactions,
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

  historyDateRange: 'Last 30 Days',
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

  setItemsFromProducts: (products: ProductItem[]) => {
    const items: InventoryItem[] = products.map((p) => {
      const stock = p.stock || 0;
      const reserved = defaultReservedBySku[p.sku] ?? Math.min(stock, Math.floor(stock * 0.1));
      const available = Math.max(0, stock - reserved);
      const lowThresh = p.lowStockThreshold || 30;
      const status: 'in_stock' | 'low_stock' | 'out_of_stock' =
        stock <= 0 ? 'out_of_stock' : stock <= lowThresh ? 'low_stock' : 'in_stock';
      return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        barcode: p.barcode,
        category: p.category,
        subcategory: p.subCategory,
        productType: p.productType,
        brand: p.brand,
        stock,
        reserved,
        available,
        status,
        stockValue: Math.round(stock * (p.price || 500)),
        lastUpdated: p.updatedAt || 'Recent',
        imageUrl: p.images[0] || '',
        size: p.attributes?.size || 'M',
        color: p.attributes?.color || 'Black',
      };
    });

    const currentTxs = get().transactions;
    const initialTxs: StockTransaction[] =
      currentTxs.length > 0 ? currentTxs : initialMockupTransactions;

    set({
      items,
      totalProductCount: Math.max(items.length, 1248),
      transactions: initialTxs,
    });
  },

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

  adjustStock: async (productId, adjustmentType, quantity, reason, reference, notes) => {
    const state = get();
    const item = state.items.find((i) => i.id === productId);
    if (!item) return;

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

    // Persist to backend catalog API via useCatalogStore
    try {
      await useCatalogStore.getState().updateStock(productId, newStock);
    } catch (err) {
      console.warn('Failed to update stock in catalog store:', err);
    }

    const newAvailable = Math.max(0, newStock - item.reserved);
    const unitValue = item.stock > 0 ? item.stockValue / item.stock : 500;
    const newStockValue = Math.round(newStock * unitValue);
    const newStatus: 'in_stock' | 'low_stock' | 'out_of_stock' =
      newStock <= 0 ? 'out_of_stock' : newStock <= 30 ? 'low_stock' : 'in_stock';

    const updatedItems = get().items.map((i) =>
      i.id === productId
        ? {
            ...i,
            stock: newStock,
            available: newAvailable,
            stockValue: newStockValue,
            status: newStatus,
            lastUpdated: 'Just now',
          }
        : i,
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
      performedBy: 'Store Staff',
    };

    set({
      items: updatedItems,
      transactions: [newTx, ...get().transactions],
      adjustDrawerItem: null,
    });
  },

  bulkAdjustStock: async (adjustments) => {
    const updatedItems: InventoryItem[] = [...get().items];
    const newTxs: StockTransaction[] = [];

    for (const adj of adjustments) {
      const index = updatedItems.findIndex((i) => i.id === adj.productId);
      if (index === -1) continue;
      const currentItem = updatedItems[index];
      if (!currentItem) continue;

      const delta = adj.adjustmentType === 'increase' ? adj.quantity : -adj.quantity;
      const newStock = Math.max(0, currentItem.stock + delta);
      const newAvailable = Math.max(0, newStock - currentItem.reserved);
      const unitValue = currentItem.stock > 0 ? currentItem.stockValue / currentItem.stock : 500;
      const newStockValue = Math.round(newStock * unitValue);
      const newStatus: 'in_stock' | 'low_stock' | 'out_of_stock' =
        newStock <= 0 ? 'out_of_stock' : newStock <= 30 ? 'low_stock' : 'in_stock';

      try {
        await useCatalogStore.getState().updateStock(adj.productId, newStock);
      } catch (err) {
        console.warn('Failed to bulk update stock for product:', adj.productId, err);
      }

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
          performedBy: 'Store Staff',
        });
      }
    }

    set({
      items: updatedItems,
      transactions: [...newTxs, ...get().transactions],
      viewMode: 'overview',
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

  recordSaleDeduction: (saleItems, referenceNo, source, notes) => {
    const state = get();
    const updatedItems = [...state.items];
    const newTxs: StockTransaction[] = [];
    const nowFormatted = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    saleItems.forEach((sale) => {
      if (!sale.quantity || sale.quantity <= 0) return;
      const idx = updatedItems.findIndex(
        (i) => i.id === sale.productId || i.sku === sale.sku || i.id === sale.id || i.sku === sale.productId
      );
      if (idx === -1) return;

      const current = updatedItems[idx];
      if (!current) return;

      const newStock = Math.max(0, current.stock - sale.quantity);
      const newAvailable = Math.max(0, newStock - current.reserved);
      const unitValue = current.stock > 0 ? current.stockValue / current.stock : 500;
      const newStockValue = Math.round(newStock * unitValue);
      const newStatus: 'in_stock' | 'low_stock' | 'out_of_stock' =
        newStock <= 0 ? 'out_of_stock' : newStock <= 30 ? 'low_stock' : 'in_stock';

      updatedItems[idx] = {
        ...current,
        stock: newStock,
        available: newAvailable,
        stockValue: newStockValue,
        status: newStatus,
        lastUpdated: 'Just now',
      };

      // Persist asynchronously to catalogStore and backend
      try {
        useCatalogStore.getState().updateStock(current.id, newStock);
      } catch (err) {
        console.warn('Failed to update catalog product stock:', err);
      }

      newTxs.push({
        id: `tx-${Date.now()}-${current.id}`,
        productId: current.id,
        productName: current.name,
        sku: current.sku,
        date: nowFormatted,
        type: 'stock_out',
        referenceType: source === 'pos' ? 'POS Sale' : source === 'online_order' ? 'Order' : 'Stock Adjustment',
        referenceNo,
        quantity: -sale.quantity,
        stockBefore: current.stock,
        stockAfter: newStock,
        notes: notes || (source === 'pos' ? 'Sold via In-Store POS' : `Sold via Order #${referenceNo}`),
        performedBy: source === 'pos' ? 'Cashier / POS Terminal' : source === 'online_order' ? 'System' : 'Store Staff',
      });
    });

    set({
      items: updatedItems,
      transactions: [...newTxs, ...state.transactions],
    });
  },

  recordOrderOnlineNotification: (orderPayload) => {
    // Re-fetch catalog products from server to ensure complete sync
    try {
      useCatalogStore.getState().fetchProducts();
    } catch (err) {
      console.warn('Failed to fetch products on online order notification:', err);
    }
  },
}));
