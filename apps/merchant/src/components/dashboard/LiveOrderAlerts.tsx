import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useOrderStore } from '../../stores/orderStore.js';

interface LiveOrderAlertsProps {
  onNavigateOrders?: () => void;
}

export const LiveOrderAlerts: React.FC<LiveOrderAlertsProps> = ({ onNavigateOrders }) => {
  const { orders } = useOrderStore();
  const recentOrders = orders.slice(0, 5);
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full">
      <div>
        {/* Header with Fire & 3D Basket Graphic */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>🔥</span>
              <span>New Orders</span>
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800 border border-amber-200/60">
              {newOrdersCount} New Orders
            </span>
          </div>

          {/* 3D Basket Graphic */}
          <div className="w-8 h-8 relative flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-7 h-7 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="18" y="12" width="16" height="14" rx="2" fill="#3B82F6" />
              <rect x="24" y="12" width="4" height="14" fill="#60A5FA" />
              <rect x="30" y="8" width="16" height="18" rx="2" fill="#F97316" />
              <rect x="36" y="8" width="4" height="18" fill="#FDBA74" />
              <path d="M12 28C12 26.8954 12.8954 26 14 26H50C51.1046 26 52 26.8954 52 28L47.5 48C47.2 49.5 45.8 51 44.2 51H19.8C18.2 51 16.8 49.5 16.5 48L12 28Z" fill="#EA580C" />
              <path d="M11 26H53" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
              <path d="M22 28L24 49M32 28V49M42 28L40 49" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 36H50M16 43H48" stroke="#C2410C" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Orders Table */}
        {recentOrders.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center">
            <p className="text-xs font-semibold text-slate-700 mb-0.5">No incoming orders yet</p>
            <p className="text-[11px] text-slate-400">New customer orders will appear here in real time.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {/* Table Header */}
            <div className="grid grid-cols-[22%_24%_14%_18%_22%] items-center text-[10px] font-semibold text-slate-400 py-1.5 px-1 border-b border-slate-100">
              <span>Order ID</span>
              <span>Customer</span>
              <span>Items</span>
              <span>Amount</span>
              <span className="pl-1">Status</span>
            </div>

            {/* Table Rows */}
            {recentOrders.map((order) => (
              <div
                key={order.id}
                onClick={onNavigateOrders}
                className="grid grid-cols-[22%_24%_14%_18%_22%] items-center py-1.5 hover:bg-slate-50/80 rounded-lg cursor-pointer transition-colors px-1 group"
              >
                <span className="font-semibold text-blue-600 hover:underline truncate text-xs">
                  {order.orderNumber}
                </span>
                <span className="text-slate-700 font-medium truncate text-xs">{order.customer?.name || 'Customer'}</span>
                <span className="text-slate-500 truncate text-xs">{order.itemsSummary?.count || order.items?.length || 1} items</span>
                <span className="font-bold text-slate-900 text-xs truncate">
                  ₹{order.pricing?.totalAmount?.toLocaleString('en-IN') || 0}
                </span>
                <div className="flex items-center justify-between gap-1.5 pl-1 shrink-0">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 uppercase whitespace-nowrap">
                    {order.status.replace('_', ' ')}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-width Solid Orange Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNavigateOrders}
          className="w-full py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <span>View All Orders</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
