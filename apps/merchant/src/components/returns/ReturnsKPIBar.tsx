import React from 'react';
import { Package, CheckCircle2, Clock, Wallet } from 'lucide-react';
import { useReturnsStore } from '../../stores/returnsStore.js';

export const ReturnsKPIBar: React.FC = () => {
  const { returns } = useReturnsStore();

  const totalReturnsCount = 18;
  const refundsProcessedCount = 12;
  const pendingCount = 5;
  const refundsPendingAmount = 18760;

  const cards = [
    {
      title: 'Total Returns',
      value: totalReturnsCount.toString(),
      subtext: 'All time',
      icon: Package,
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
    },
    {
      title: 'Refunds Processed',
      value: refundsProcessedCount.toString(),
      subtext: 'All time',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
    {
      title: 'Pending Returns',
      value: pendingCount.toString(),
      subtext: 'Awaiting action',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
    },
    {
      title: 'Refunds Pending',
      value: `₹ ${refundsPendingAmount.toLocaleString('en-IN')}`,
      subtext: 'Amount to refund',
      icon: Wallet,
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-slate-500 block leading-tight truncate">
                {card.title}
              </span>
              <h4 className="text-lg font-black text-slate-900 tracking-tight leading-tight mt-0.5 truncate">
                {card.value}
              </h4>
              <span className="text-[10px] text-slate-400 block leading-tight mt-0.5 truncate">
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
