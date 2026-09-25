import React from 'react';
import { Wallet, Calendar, Clock, PieChart, RotateCcw, Info } from 'lucide-react';
import { useExpenseStore } from '../../stores/expenseStore.js';

export const ExpensesKPIBar: React.FC = () => {
  const { kpis } = useExpenseStore();

  const cards = [
    {
      title: 'Total Expenses',
      value: `₹ ${kpis.totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      subtext: 'All time',
      hasInfo: true,
      icon: Wallet,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'This Month',
      value: `₹ ${kpis.thisMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      subtext: 'May 2024',
      hasInfo: false,
      icon: Calendar,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'This Week',
      value: `₹ ${kpis.thisWeek.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      subtext: '05 May - 11 May 2024',
      hasInfo: false,
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Highest Category',
      value: kpis.highestCategory.name,
      subtext: `₹ ${kpis.highestCategory.amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
      })} (${kpis.highestCategory.percentage}%)`,
      hasInfo: false,
      icon: PieChart,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Pending Reimbursement',
      value: `₹ ${kpis.pendingReimbursement.amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
      })}`,
      subtext: `${kpis.pendingReimbursement.count} Expenses`,
      hasInfo: false,
      icon: RotateCcw,
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
                <h4 className="text-xl lg:text-2xl font-black text-slate-900 mt-1 tracking-tight">
                  {card.value}
                </h4>
              </div>
              <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1 text-xs text-slate-400 font-medium">
              <span>{card.subtext}</span>
              {card.hasInfo && <Info className="w-3.5 h-3.5 text-slate-400" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};
