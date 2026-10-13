import React from 'react';
import { Package, ShoppingBag, AlertTriangle, AlertCircle, FileText } from 'lucide-react';
import { useCatalogStore } from '../../stores/catalogStore.js';

export const CatalogKpiCards: React.FC = () => {
  const { kpis, products } = useCatalogStore();

  // Dynamic calculations can also reflect active items in table
  const activeCount = products.filter((p) => p.status === 'active').length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStockCount = products.filter((p) => p.stock === 0 || p.status === 'out_of_stock').length;
  const draftCount = products.filter((p) => p.status === 'draft').length;

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
            {kpis.totalProducts.toLocaleString()}
          </h4>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 mt-0.5 truncate">
            <span>↑ 12%</span>
            <span className="text-slate-400 font-normal">from last month</span>
          </div>
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
            {kpis.activeProducts.toLocaleString()}
          </h4>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 mt-0.5 truncate">
            <span>↑ 8%</span>
            <span className="text-slate-400 font-normal">from last month</span>
          </div>
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
            {kpis.lowStock}
          </h4>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-rose-500 mt-0.5 truncate">
            <span>↓ 5%</span>
            <span className="text-slate-400 font-normal">from last month</span>
          </div>
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
            {kpis.outOfStock}
          </h4>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-rose-500 mt-0.5 truncate">
            <span>↓ 3%</span>
            <span className="text-slate-400 font-normal">from last month</span>
          </div>
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
            {kpis.draft}
          </h4>
          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 mt-0.5 truncate">
            <span>Draft items</span>
          </div>
        </div>
      </div>
    </div>
  );
};
