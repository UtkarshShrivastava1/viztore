import React, { useMemo } from 'react';
import { useCatalogStore } from '../../stores/catalogStore.js';
import { useOrderStore } from '../../stores/orderStore.js';
import { Trophy, ArrowRight } from 'lucide-react';

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

  const getRankBadge = (index: number) => {
    if (index === 0) return 'bg-amber-100 text-amber-800 border-amber-300/80';
    if (index === 1) return 'bg-slate-100 text-slate-700 border-slate-300/80';
    if (index === 2) return 'bg-orange-100 text-orange-800 border-orange-300/80';
    return 'bg-slate-50 text-slate-500 border-slate-200/60';
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5 h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight leading-none">
              Top Selling Products
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

        {/* Table Header */}
        <div className="grid grid-cols-12 text-[10px] font-bold uppercase tracking-wider text-slate-400 py-1.5 px-1 border-b border-slate-100/80">
          <span className="col-span-8">Product</span>
          <span className="col-span-2 text-right">Orders</span>
          <span className="col-span-2 text-right">Price</span>
        </div>

        {/* Product Rows */}
        {topProducts.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <p className="text-xs font-bold text-slate-700 mb-0.5">No products found</p>
            <p className="text-[11px] text-slate-400 max-w-xs">Publish products in your catalog to track sales performance and customer popularity.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100/80 text-xs">
            {topProducts.map((p, idx) => {
              const orderCount = orderCountsByProductId[p.id] || 0;
              return (
                <div key={p.id} className="grid grid-cols-12 py-2 items-center hover:bg-slate-50/80 rounded-xl px-1.5 transition-colors group">
                  <div className="col-span-8 flex items-center gap-2 min-w-0 pr-2">
                    {/* Rank Pill */}
                    <span className={`w-4 h-4 rounded-full text-[9px] font-extrabold flex items-center justify-center border shrink-0 ${getRankBadge(idx)}`}>
                      {idx + 1}
                    </span>

                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs border border-slate-200/60 bg-slate-100 overflow-hidden group-hover:scale-105 transition-transform">
                      {p.images && p.images.length > 0 ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                          {p.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-800 group-hover:text-blue-600 truncate text-[11px] leading-tight transition-colors">
                        {p.name}
                      </h4>
                      <span className="text-[9px] text-slate-400 font-medium truncate block mt-0.5 capitalize">
                        {p.category || 'General'}
                      </span>
                    </div>
                  </div>

                  <span className="col-span-2 text-right font-bold text-slate-700 text-xs">
                    {orderCount}
                  </span>
                  <span className="col-span-2 text-right font-black text-slate-900 text-xs">
                    ₹{Math.round(p.price || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
