import React from 'react';
import {
  SlidersHorizontal,
  Upload,
  History,
  ChevronDown,
  Trash2,
  X,
  Eye,
} from 'lucide-react';
import { useInventoryStore } from '../stores/inventoryStore.js';
import { useCatalogStore } from '../stores/catalogStore.js';
import { InventoryKPICards } from '../components/inventory/InventoryKPICards.js';
import { InventoryFilterBar } from '../components/inventory/InventoryFilterBar.js';
import { InventoryTable } from '../components/inventory/InventoryTable.js';
import { AdjustStockDrawer } from '../components/inventory/AdjustStockDrawer.js';
import { StockHistoryDrawer } from '../components/inventory/StockHistoryDrawer.js';
import { BulkAdjustStockView } from '../components/inventory/BulkAdjustStockView.js';
import { StockHistoryView } from '../components/inventory/StockHistoryView.js';

export const InventoryPage: React.FC = () => {
  const { fetchProducts, products } = useCatalogStore();
  const {
    items,
    setItemsFromProducts,
    viewMode,
    setViewMode,
    deleteConfirmItem,
    closeDeleteModal,
    deleteItem,
    detailModalItem,
    closeDetailModal,
  } = useInventoryStore();

  React.useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  React.useEffect(() => {
    if (products.length > 0) {
      setItemsFromProducts(products);
    }
  }, [products, setItemsFromProducts]);

  return (
    <div className="space-y-4">
      {/* ─── View 1: Main Inventory Overview (Screen 4.0 & 4.3) ─── */}
      {viewMode === 'overview' && (
        <div className="space-y-4">
          {/* Header & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Inventory
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Track and manage your stock across all products.
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2.5">
              {/* Adjust Stock Button */}
              <button
                type="button"
                onClick={() => setViewMode('bulk_adjust')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-2xs transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Adjust Stock</span>
              </button>

              {/* Import Stock Button */}
              <button
                type="button"
                onClick={() => alert('Bulk Import CSV: Upload stock spreadsheet to batch update products.')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-2xs transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Import Stock</span>
              </button>

              {/* Stock History Dropdown Button */}
              <button
                type="button"
                onClick={() => setViewMode('stock_history')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <History className="w-4 h-4" />
                <span>Stock History</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Top 5 KPI Metric Cards */}
          <InventoryKPICards />

          {/* Filter Bar with Labels Above Dropdowns & Aligned Bottom */}
          <InventoryFilterBar />

          {/* Main Inventory Table */}
          <InventoryTable />
        </div>
      )}

      {/* ─── View 2: Bulk Adjust Stock Batch View (Screen 4.5) ─── */}
      {viewMode === 'bulk_adjust' && <BulkAdjustStockView />}

      {/* ─── View 3: Dedicated Stock History Full-Page Ledger (Screen 4.6) ─── */}
      {viewMode === 'stock_history' && <StockHistoryView />}

      {/* ─── Slide-Out Drawers ─── */}
      <AdjustStockDrawer />
      <StockHistoryDrawer />

      {/* ─── Delete Confirmation Modal ─── */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Product?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-slate-900 font-semibold">{deleteConfirmItem.name}</strong>{' '}
              (SKU: {deleteConfirmItem.sku}) from inventory?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteItem(deleteConfirmItem.id)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── View Details Modal ─── */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Product Specifications</h3>
              </div>
              <button
                type="button"
                onClick={closeDetailModal}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-4">
              <img
                src={detailModalItem.imageUrl}
                alt={detailModalItem.name}
                className="w-20 h-20 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">{detailModalItem.name}</h4>
                <p className="text-slate-500 font-mono">SKU: {detailModalItem.sku}</p>
                <p className="text-slate-500 font-mono">Barcode: {detailModalItem.barcode}</p>
                <p className="text-blue-600 font-medium">
                  {detailModalItem.category} &gt; {detailModalItem.subcategory} &gt; {detailModalItem.productType}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Stock Units</span>
                <span className="font-black text-sm text-slate-900 mt-0.5 block">{detailModalItem.stock}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Reserved</span>
                <span className="font-black text-sm text-slate-900 mt-0.5 block">{detailModalItem.reserved}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Available</span>
                <span className="font-black text-sm text-emerald-600 mt-0.5 block">{detailModalItem.available}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Stock Value</span>
                <span className="font-black text-sm text-slate-900 mt-0.5 block">{'\u20B9'}{detailModalItem.stockValue.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={closeDetailModal}
                className="px-5 py-2 rounded-xl bg-[#2563eb] text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
