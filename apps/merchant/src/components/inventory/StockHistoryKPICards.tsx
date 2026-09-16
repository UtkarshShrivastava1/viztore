import React from 'react';
import {
  Boxes,
  ArrowUpCircle,
  ArrowDownCircle,
  BarChart3,
  Package,
} from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore.js';

export const StockHistoryKPICards: React.FC = () => {
  const { transactions } = useInventoryStore();

  const totalTransactions = 582;
  const stockInUnits = 1248;
  const stockOutUnits = 968;
  const netChangeUnits = 280;
  const productsAffected = 156;

  const cards = [
    {
      id: 'total-tx',
      title: 'Total Transactions',
      value: totalTransactions.toLocaleString(),
      subtitle: 'In selected period',
      icon: Boxes,
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
    },
    {
      id: 'stock-in',
      title: 'Stock In (Added)',
      value: `+${stockInUnits.toLocaleString()} Units`,
      valueColor: 'text-emerald-600',
      icon: ArrowUpCircle,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
    {
      id: 'stock-out',
      title: 'Stock Out (Deducted)',
      value: `-${stockOutUnits.toLocaleString()} Units`,
      valueColor: 'text-rose-600',
      icon: ArrowDownCircle,
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
    },
    {
      id: 'net-change',
      title: 'Net Change',
      value: `+${netChangeUnits.toLocaleString()} Units`,
      valueColor: 'text-emerald-600',
      icon: BarChart3,
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
    },
    {
      id: 'products-affected',
      title: 'Products Affected',
      value: productsAffected.toLocaleString(),
      icon: Package,
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-500 leading-tight">
                {c.title}
              </span>
              <div className={`p-2 rounded-xl shrink-0 ${c.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2.5">
              <div className={`text-2xl font-black tracking-tight leading-none ${c.valueColor || 'text-slate-900'}`}>
                {c.value}
              </div>
              {c.subtitle && (
                <div className="text-[11px] font-medium text-slate-400 mt-2">
                  {c.subtitle}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
