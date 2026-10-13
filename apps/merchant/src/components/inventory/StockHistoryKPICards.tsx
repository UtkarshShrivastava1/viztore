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

  const totalTransactions = transactions.length;
  const stockInUnits = transactions
    .filter((t) => t.type === 'stock_in')
    .reduce((sum, t) => sum + Math.abs(t.quantity), 0);
  const stockOutUnits = transactions
    .filter((t) => t.type === 'stock_out')
    .reduce((sum, t) => sum + Math.abs(t.quantity), 0);
  const netChangeUnits = stockInUnits - stockOutUnits;
  const productsAffected = new Set(transactions.map((t) => t.productId)).size;

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
            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow duration-200"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-slate-500 block truncate">
                {c.title}
              </span>
              <div className={`text-lg font-black tracking-tight mt-0.5 truncate ${c.valueColor || 'text-slate-900'}`}>
                {c.value}
              </div>
              {c.subtitle && (
                <div className="text-[10px] font-medium text-slate-400 mt-0.5 truncate">
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
