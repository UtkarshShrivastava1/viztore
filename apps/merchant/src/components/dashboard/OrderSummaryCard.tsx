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

  const getStatusCount = (label: string) => {
    const l = label.toLowerCase();
    if (l === 'pending') return orders.filter((o) => o.status === 'new').length;
    if (l === 'confirmed') return orders.filter((o) => o.status === 'accepted').length;
    if (l === 'packed') return orders.filter((o) => o.status === 'ready_to_ship').length;
    if (l === 'shipped') return orders.filter((o) => o.status === 'shipped').length;
    if (l === 'delivered') return orders.filter((o) => o.status === 'delivered').length;
    if (l === 'cancelled') return orders.filter((o) => o.status === 'cancelled').length;
    return 0;
  };

  const statuses = [
    { label: 'Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50/80 border border-amber-100' },
    { label: 'Confirmed', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50/80 border border-emerald-100' },
    { label: 'Packed', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50/80 border border-blue-100' },
    { label: 'Shipped', icon: Truck, color: 'text-cyan-500', bg: 'bg-cyan-50/80 border border-cyan-100' },
    { label: 'Delivered', icon: CheckCheck, color: 'text-emerald-500', bg: 'bg-emerald-50/80 border border-emerald-100' },
    { label: 'Cancelled', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50/80 border border-rose-100' },
  ];

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900">Order Summary</h3>
      </div>

      <div className="space-y-0.5 text-xs">
        {statuses.map((s) => {
          const Icon = s.icon;
          const count = getStatusCount(s.label);
          return (
            <div
              key={s.label}
              onClick={() => onNavigateStatus?.(s.label.toLowerCase())}
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
