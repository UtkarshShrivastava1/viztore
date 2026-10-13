import React from 'react';
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  CheckCheck,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import { useOrderStore } from '../../stores/orderStore.js';

interface OrderSummaryCardProps {
  onNavigateStatus?: (status: string) => void;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ onNavigateStatus }) => {
  const { orders } = useOrderStore();

  const statuses = [
    { label: 'Pending', key: 'pending', tab: 'new_orders', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50/80 border border-amber-100' },
    { label: 'Confirmed', key: 'confirmed', tab: 'ready_to_ship', icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50/80 border border-teal-100' },
    { label: 'Packed', key: 'packed', tab: 'ready_to_ship', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50/80 border border-blue-100' },
    { label: 'Shipped', key: 'shipped', tab: 'shipped', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50/80 border border-purple-100' },
    { label: 'Delivered', key: 'delivered', tab: 'delivered', icon: CheckCheck, color: 'text-emerald-500', bg: 'bg-emerald-50/80 border border-emerald-100' },
    { label: 'Cancelled', key: 'cancelled', tab: 'cancelled', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50/80 border border-rose-100' },
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

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900">Order Summary</h3>
      </div>

      <div className="space-y-0.5 text-xs">
        {statuses.map((s) => {
          const Icon = s.icon;
          const count = getStatusCount(s.key);
          return (
            <div
              key={s.label}
              onClick={() => onNavigateStatus?.(s.tab)}
              className="flex items-center justify-between py-1 px-1.5 hover:bg-slate-50/80 rounded-lg cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-md ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-3 h-3" />
                </div>
                <span className="font-medium text-slate-700 text-xs">{s.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-xs">{count}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
