import React from 'react';
import { Package, ShoppingBag, AlertTriangle, AlertCircle, FileText } from 'lucide-react';
import { useCatalogStore } from '../../stores/catalogStore.js';

export const CatalogKpiCards: React.FC = () => {
  const { kpis, products } = useCatalogStore();

  const totalProducts = products.length > 0 ? products.length : kpis.totalProducts;
  const totalStockUnits = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const activeCount = products.length > 0 ? products.filter((p) => p.status === 'active').length : kpis.activeProducts;
  const lowStockCount = products.length > 0 ? products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length : kpis.lowStock;
  const outOfStockCount = products.length > 0 ? products.filter((p) => p.stock <= 0 || p.status === 'out_of_stock').length : kpis.outOfStock;
  const draftCount = products.length > 0 ? products.filter((p) => p.status === 'draft').length : kpis.draft;

  const activePct = totalProducts > 0 ? Math.round((activeCount / totalProducts) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-5">
      {/* 1. Total Products */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
          <Package className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 block truncate">Total Products</p>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
            {totalProducts.toLocaleString()}
          </h4>
          {totalProducts === 0 ? (
            <span className="text-[10px] text-slate-400 font-normal mt-0.5 block truncate">Catalog is empty</span>
          ) : (
            <div className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 mt-0.5 truncate">
              <span>{totalStockUnits.toLocaleString()} units</span>
              <span className="text-slate-400 font-normal">in inventory</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Active Products */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 block truncate">Active Products</p>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
            {activeCount.toLocaleString()}
          </h4>
          {activeCount === 0 ? (
            <span className="text-[10px] text-slate-400 font-normal mt-0.5 block truncate">0 live on storefront</span>
          ) : (
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 mt-0.5 truncate">
              <span>{activePct}% published</span>
              <span className="text-slate-400 font-normal">• live & discoverable</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Low Stock */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 block truncate">Low Stock</p>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
            {lowStockCount}
          </h4>
          {lowStockCount === 0 ? (
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 mt-0.5 truncate">
              <span>✓ Optimal levels</span>
              <span className="text-slate-400 font-normal">• healthy stock</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 mt-0.5 truncate">
              <span>⚠ Needs reorder</span>
              <span className="text-slate-400 font-normal">({lowStockCount} {lowStockCount === 1 ? 'item' : 'items'} low)</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Out of Stock */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 block truncate">Out of Stock</p>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
            {outOfStockCount}
          </h4>
          {outOfStockCount === 0 ? (
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 mt-0.5 truncate">
              <span>✓ 0 stockouts</span>
              <span className="text-slate-400 font-normal">• full availability</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 mt-0.5 truncate">
              <span>✕ Immediate restock</span>
              <span className="text-slate-400 font-normal">({outOfStockCount} unavailable)</span>
            </div>
          )}
        </div>
      </div>

      {/* 5. Draft */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 block truncate">Draft</p>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
            {draftCount}
          </h4>
          {draftCount === 0 ? (
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 mt-0.5 truncate">
              <span>No pending drafts</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[10px] font-semibold text-purple-600 mt-0.5 truncate">
              <span>● {draftCount} pending</span>
              <span className="text-slate-400 font-normal">awaiting publish</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
