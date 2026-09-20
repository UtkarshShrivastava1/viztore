import React from 'react';
import { useCatalogStore } from '../../stores/catalogStore.js';

interface LowStockWarningsProps {
  onAddStock?: () => void;
}

export const LowStockWarnings: React.FC<LowStockWarningsProps> = ({ onAddStock }) => {
  const { products } = useCatalogStore();
  const lowStockItems = products.filter((p) => p.stock <= (p.lowStockThreshold || 10)).slice(0, 5);

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2 h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900">Low Stock Alert</h3>
        <button type="button" className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">
          View All
        </button>
      </div>

      {/* Rows */}
      {lowStockItems.length === 0 ? (
        <div className="py-8 text-center flex flex-col items-center justify-center">
          <p className="text-xs font-semibold text-emerald-700 mb-0.5">Inventory Healthy</p>
          <p className="text-[11px] text-slate-400">All current products are well stocked above alert thresholds.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 text-xs">
          {lowStockItems.map((item) => (
            <div key={item.id} className="py-1.5 flex items-center justify-between hover:bg-slate-50/80 rounded-lg px-1 transition-colors">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs border border-slate-200/60 bg-rose-500 overflow-hidden"
                >
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 text-white opacity-85"
                      fill="currentColor"
                    >
                      <path d="M16 2l4 4-2 3-2-1v14H8V8L6 9 4 6l4-4h2a3 3 0 004 0h2z" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-slate-800 truncate text-[11px] leading-tight">{item.name}</h4>
                  <span className="text-[9px] text-slate-400 truncate block mt-0.5">{item.category || 'General'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-[11px] text-slate-500 font-medium">
                  Stock: <strong className="text-rose-600 font-bold ml-0.5">{item.stock}</strong>
                </span>
                <button
                  type="button"
                  onClick={onAddStock}
                  className="px-2 py-0.5 rounded-lg border border-blue-200 bg-blue-50/40 hover:bg-blue-100/60 text-blue-600 text-[10px] font-semibold transition-colors"
                >
                  Restock
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
