import React, { useMemo } from 'react';
import { useCatalogStore } from '../../stores/catalogStore.js';
import { useOrderStore } from '../../stores/orderStore.js';

interface TopProductsProps {
  onViewAll?: () => void;
}

export const TopProducts: React.FC<TopProductsProps> = ({ onViewAll }) => {
  const { products } = useCatalogStore();
  const { orders } = useOrderStore();

  const orderCountsByProductId = useMemo(() => {
    const map: Record<string, number> = {};
    for (const order of orders) {
      if (order.items) {
        for (const item of order.items) {
          map[item.id] = (map[item.id] || 0) + (item.quantity || 1);
        }
      }
    }
    return map;
  }, [orders]);

  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (orderCountsByProductId[b.id] || 0) - (orderCountsByProductId[a.id] || 0))
      .slice(0, 5);
  }, [products, orderCountsByProductId]);

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2 h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900">Top Selling Products</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 text-[10px] font-semibold text-slate-400 pb-0.5">
        <span className="col-span-8">Product</span>
        <span className="col-span-2 text-right">Orders</span>
        <span className="col-span-2 text-right">Price</span>
      </div>

      {/* Product Rows */}
      {topProducts.length === 0 ? (
        <div className="py-8 text-center flex flex-col items-center justify-center">
          <p className="text-xs font-semibold text-slate-700 mb-0.5">No products found</p>
          <p className="text-[11px] text-slate-400">Add products to your catalog to track sales analytics.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 text-xs">
          {topProducts.map((p) => {
            const orderCount = orderCountsByProductId[p.id] || 0;
            return (
              <div key={p.id} className="grid grid-cols-12 py-1.5 items-center hover:bg-slate-50/80 rounded-lg px-1 transition-colors">
                <div className="col-span-8 flex items-center gap-2 min-w-0 pr-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs border border-slate-200/60 bg-blue-500 overflow-hidden"
                  >
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white opacity-85" fill="currentColor">
                        <path d="M16 2l4 4-2 3-2-1v14H8V8L6 9 4 6l4-4h2a3 3 0 004 0h2z" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-800 truncate text-[11px] leading-tight">{p.name}</h4>
                    <span className="text-[9px] text-slate-400 truncate block mt-0.5">{p.category || 'General'}</span>
                  </div>
                </div>

                <span className="col-span-2 text-right font-semibold text-slate-700 text-xs">{orderCount}</span>
                <span className="col-span-2 text-right font-bold text-slate-900 text-xs">₹{p.price?.toLocaleString('en-IN') || 0}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
