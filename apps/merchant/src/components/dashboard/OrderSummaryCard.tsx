import React from 'react';
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  CheckCheck,
  XCircle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useOrderStore } from '../../stores/orderStore.js';

interface OrderSummaryCardProps {
  onNavigateStatus?: (status: string) => void;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ onNavigateStatus }) => {
  const { orders } = useOrderStore();

  const statuses = [
    { label: 'Confirmed', key: 'confirmed', tab: 'ready_to_ship', icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50 border border-teal-200/60' },
    { label: 'Packed', key: 'packed', tab: 'ready_to_ship', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50 border border-blue-200/60' },
    { label: 'Shipped', key: 'shipped', tab: 'shipped', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50 border border-purple-200/60' },
    { label: 'Delivered', key: 'delivered', tab: 'delivered', icon: CheckCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 border border-emerald-200/60' },
    { label: 'Cancelled', key: 'cancelled', tab: 'cancelled', icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50 border border-rose-200/60' },
  ];

  const getStatusCount = (key: string) => {
    if (key === 'pending') {
      return orders.filter((o) => o.status === 'new' || (o as any).status === 'pending').length;
    }
    if (key === 'confirmed') {
      return orders.filter((o) => (o as any).status === 'confirmed').length;
    }
    if (key === 'packed') {
      return orders.filter((o) => o.status === 'ready_to_ship' || (o as any).status === 'packed').length;
    }
    if (key === 'shipped') {
      return orders.filter((o) => o.status === 'shipped' || (o as any).status === 'out_for_delivery').length;
    }
    if (key === 'delivered') {
      return orders.filter((o) => o.status === 'delivered').length;
    }
    if (key === 'cancelled') {
      return orders.filter((o) => o.status === 'cancelled').length;
    }
    return 0;
  };

  const deliveredCount = getStatusCount('delivered');
  const totalOrdersCount = orders.length || 1;
  const fulfillmentRate = Math.round((deliveredCount / totalOrdersCount) * 100);

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight leading-none">
            Order Pipeline
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">Status distribution</span>
        </div>

        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
          <TrendingUp className="w-2.5 h-2.5" />
          <span>{fulfillmentRate}% Fulfilled</span>
        </span>
      </div>

      {/* Mini Progress Track */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
        <div 
          className="bg-emerald-500 h-full transition-all duration-500" 
          style={{ width: `${fulfillmentRate}%` }} 
          title={`Delivered: ${deliveredCount}`}
        />
        <div 
          className="bg-blue-500 h-full transition-all duration-500" 
          style={{ width: `${Math.round((getStatusCount('shipped') / totalOrdersCount) * 100)}%` }} 
          title="Shipped"
        />
        <div 
          className="bg-amber-400 h-full transition-all duration-500" 
          style={{ width: `${Math.round((getStatusCount('confirmed') / totalOrdersCount) * 100)}%` }} 
          title="Active"
        />
      </div>

      <div className="space-y-1 text-xs pt-0.5">
        {statuses.map((s) => {
          const Icon = s.icon;
          const count = getStatusCount(s.key);
          return (
            <div
              key={s.label}
              onClick={() => onNavigateStatus?.(s.tab)}
              className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-all duration-150 group"
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg ${s.bg} ${s.color} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-700 text-xs group-hover:text-slate-900 transition-colors">
                  {s.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`font-black text-xs px-2 py-0.5 rounded-md ${count > 0 ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}>
                  {count}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
