import React from 'react';
import { useCatalogStore } from '../../stores/catalogStore.js';
import { ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

interface LowStockWarningsProps {
  onAddStock?: () => void;
  onViewAll?: () => void;
}

export const LowStockWarnings: React.FC<LowStockWarningsProps> = ({ onAddStock, onViewAll }) => {
  const { products } = useCatalogStore();
  const lowStockItems = products.filter((p) => p.stock <= (p.lowStockThreshold || 10)).slice(0, 5);

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5 h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            {lowStockItems.length > 0 ? (
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            )}
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight leading-none">
              Stock Health
            </h3>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Rows */}
        {lowStockItems.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 mb-2 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-xs font-extrabold text-emerald-800 mb-0.5">Inventory Healthy</p>
            <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
              All active catalog products are currently well-stocked above alert thresholds.
            </p>
            <button
              type="button"
              onClick={onViewAll}
              className="mt-3 px-3 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold transition-all shadow-2xs"
            >
              Audit Inventory
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100/80 text-xs">
            {lowStockItems.map((item) => (
              <div key={item.id} className="py-2 flex items-center justify-between hover:bg-slate-50/80 rounded-xl px-1.5 transition-colors group">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs border border-rose-200/60 bg-rose-50 overflow-hidden group-hover:scale-105 transition-transform">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-rose-600">
                        {item.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 group-hover:text-rose-600 truncate text-[11px] leading-tight transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-[9px] text-slate-400 font-medium truncate block mt-0.5">
                      {item.category || 'General'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-semibold text-slate-500 bg-rose-50 border border-rose-200/60 px-1.5 py-0.5 rounded-md">
                    Stock: <strong className="text-rose-700 font-black">{item.stock}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={onAddStock}
                    className="px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-[10px] font-bold transition-all shadow-2xs"
                  >
                    Restock
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
