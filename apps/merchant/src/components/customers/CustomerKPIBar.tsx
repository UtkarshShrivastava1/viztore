import React from 'react';
import { Users, TrendingUp, Receipt, Wallet, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useCustomerStore } from '../../stores/customerStore.js';

export const CustomerKPIBar: React.FC = () => {
  const { kpis } = useCustomerStore();

  const cards = [
    {
      title: 'Total Customers',
      value: kpis.totalCustomers.toLocaleString('en-IN'),
      change: `${kpis.totalCustomersGrowth}% from last month`,
      isPositive: true,
      icon: Users,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Active Customers',
      value: kpis.activeCustomers.toLocaleString('en-IN'),
      change: `${kpis.activeCustomersGrowth}% from last month`,
      isPositive: true,
      icon: TrendingUp,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Total Sales',
      value: `₹${kpis.totalSales.toLocaleString('en-IN')}`,
      change: `${kpis.totalSalesGrowth}% from last month`,
      isPositive: true,
      icon: Receipt,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Total Outstanding',
      value: `₹${kpis.totalOutstanding.toLocaleString('en-IN')}`,
      change: `${Math.abs(kpis.totalOutstandingChange)}% from last month`,
      isPositive: false, // decreasing outstanding is good, shown in red in mockup
      isDown: true,
      icon: Wallet,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Credit Customers',
      value: kpis.creditCustomers.toLocaleString('en-IN'),
      change: `${kpis.creditCustomersPercent}% of total customers`,
      isSubtext: true,
      icon: CreditCard,
      iconBg: 'bg-sky-50 text-sky-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">{card.title}</span>
                <h4 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
                  {card.value}
                </h4>
              </div>
              <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs">
              {card.isSubtext ? (
                <span className="text-slate-500 font-medium">{card.change}</span>
              ) : (
                <>
                  {card.isDown ? (
                    <span className="inline-flex items-center text-rose-600 font-semibold">
                      <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                      {card.change}
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-emerald-600 font-semibold">
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                      {card.change}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
