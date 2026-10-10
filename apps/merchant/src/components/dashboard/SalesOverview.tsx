import React from 'react';
import { ShoppingBag, ClipboardList, Users, ArrowUpRight, Calendar } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore.js';
import { useOrderStore } from '../../stores/orderStore.js';
import { useCatalogStore } from '../../stores/catalogStore.js';

export const GreetingHeader: React.FC = () => {
  const { user } = useAuthStore();
  const storeName = user?.fullName || 'Merchant Partner';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2 leading-tight">
          <span>Good Morning, {storeName}!</span>
          <span>👋</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Date Filter Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
        >
          <span>Last 7 Days</span>
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export const KpiCards: React.FC = () => {
  const { orders } = useOrderStore();
  const { products } = useCatalogStore();

  const totalSalesAmount = orders.reduce((sum, o) => sum + (o.pricing?.totalAmount || 0), 0);

  const kpis = [
    {
      title: 'Total Sales',
      value: `₹${totalSalesAmount.toLocaleString('en-IN')}`,
      change: orders.length > 0 ? '+100%' : '0%',
      timeframe: 'vs last 7 days',
      icon: ShoppingBag,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Total Orders',
      value: `${orders.length}`,
      change: orders.length > 0 ? '+100%' : '0%',
      timeframe: 'vs last 7 days',
      icon: ClipboardList,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Products Listed',
      value: `${products.length}`,
      change: products.length > 0 ? '+100%' : '0%',
      timeframe: 'active in catalog',
      icon: Users,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.title}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5"
          >
            <div
              className={`w-11 h-11 rounded-xl ${kpi.iconBg} flex items-center justify-center shrink-0`}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-semibold text-slate-500 block truncate">{kpi.title}</span>
              <span className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate block">
                {kpi.value}
              </span>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] truncate">
                <span className="inline-flex items-center font-bold text-emerald-600 gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {kpi.change}
                </span>
                <span className="text-slate-400">{kpi.timeframe}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const SalesOverview: React.FC = () => {
  return (
    <div className="space-y-5">
      <GreetingHeader />
      <KpiCards />
    </div>
  );
};
