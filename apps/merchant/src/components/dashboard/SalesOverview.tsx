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
      iconBg: 'bg-blue-50/80 border border-blue-100/60',
    },
    {
      title: 'Total Orders',
      value: `${orders.length}`,
      change: orders.length > 0 ? '+100%' : '0%',
      timeframe: 'vs last 7 days',
      icon: ClipboardList,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50/80 border border-emerald-100/60',
    },
    {
      title: 'Products Listed',
      value: `${products.length}`,
      change: products.length > 0 ? '+100%' : '0%',
      timeframe: 'active in catalog',
      icon: Users,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50/80 border border-purple-100/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.title}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-slate-500 block">{kpi.title}</span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block tracking-tight">
                {kpi.value}
              </span>
              <div className="flex items-center gap-1 pt-0.5">
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {kpi.change}
                </span>
                <span className="text-[10px] text-slate-400">{kpi.timeframe}</span>
              </div>
            </div>

            {/* Circular Badge Icon */}
            <div
              className={`w-10 h-10 rounded-full ${kpi.iconBg} ${kpi.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}
            >
              <Icon className="w-4 h-4" />
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
