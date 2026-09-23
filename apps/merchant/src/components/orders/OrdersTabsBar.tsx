import React from 'react';
import { OrderTab, useOrderStore } from '../../stores/orderStore.js';

interface OrdersTabsBarProps {
  activeTab: OrderTab;
  onSelectTab: (tab: OrderTab) => void;
}

export const OrdersTabsBar: React.FC<OrdersTabsBarProps> = ({ activeTab, onSelectTab }) => {
  const { orders } = useOrderStore();

  const counts = {
    new_orders: orders.filter((o) => o.status === 'new').length,
    ready_to_ship: orders.filter((o) => o.status === 'ready_to_ship').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    all_orders: orders.length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
    returns: orders.filter((o) => o.status === 'return_requested' || o.status === 'returned').length,
  };

  const tabs: {
    id: OrderTab;
    label: string;
    count: number;
    badgeStyle?: 'default' | 'success' | 'danger';
  }[] = [
    { id: 'new_orders', label: 'New Orders', count: counts.new_orders },
    { id: 'ready_to_ship', label: 'Ready to Ship', count: counts.ready_to_ship },
    { id: 'shipped', label: 'Shipped', count: counts.shipped, badgeStyle: 'success' },
    { id: 'delivered', label: 'Delivered', count: counts.delivered, badgeStyle: 'success' },
    { id: 'all_orders', label: 'All Orders', count: counts.all_orders },
    { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
    { id: 'returns', label: 'Returns', count: counts.returns, badgeStyle: 'danger' },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1.5 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        // Custom badge styling based on tab type and active state
        let badgeClasses = 'bg-slate-100 text-slate-700';
        if (isActive) {
          badgeClasses = 'bg-white text-blue-600 shadow-2xs font-bold';
        } else if (tab.badgeStyle === 'success') {
          badgeClasses = 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold';
        } else if (tab.badgeStyle === 'danger') {
          badgeClasses = 'bg-rose-50 text-rose-600 border border-rose-200/60 font-semibold';
        }

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
              isActive
                ? 'bg-blue-600 text-white shadow-xs'
                : tab.badgeStyle === 'danger'
                ? 'bg-white text-rose-600 border border-rose-200/80 hover:bg-rose-50/50'
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-md transition-colors ${badgeClasses}`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
