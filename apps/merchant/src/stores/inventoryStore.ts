import { create } from 'zustand';
import type { ProductItem } from './catalogStore.js';

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
  ) => void;

  bulkAdjustStock: (
    adjustments: Array<{
      productId: string;
      adjustmentType: 'increase' | 'decrease';
      quantity: number;
      reason?: string;
      reference?: string;
      notes?: string;
    }>,
  ) => void;

  duplicateItem: (productId: string) => void;
  deleteItem: (productId: string) => void;
}

export const useInventoryStore = create<InventoryStoreState>((set, get) => ({
  items: [],
  transactions: [],
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
  totalProductCount: 0,

  historyDateRange: 'Recent Activity',
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
      const reserved = Math.min(stock, Math.floor(stock * 0.1));
      const available = Math.max(0, stock - reserved);
      const status: 'in_stock' | 'low_stock' | 'out_of_stock' =
        stock <= 0 ? 'out_of_stock' : stock <= p.lowStockThreshold ? 'low_stock' : 'in_stock';
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
        stockValue: Math.round(stock * p.price),
        lastUpdated: p.updatedAt || 'Recent',
        imageUrl: p.images[0] || '',
        size: p.attributes?.size || 'Standard',
        color: p.attributes?.color || 'Standard',
      };
    });
    set({ items, totalProductCount: items.length });
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
      const unitValue = item.stock > 0 ? item.stockValue / item.stock : 500;
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
        const unitValue = currentItem.stock > 0 ? currentItem.stockValue / currentItem.stock : 500;
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
            performedBy: 'Store Staff',
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
