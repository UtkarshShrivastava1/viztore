import React from 'react';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, RotateCcw, CreditCard, Info } from 'lucide-react';
import { useWalletStore } from '../../stores/walletStore.js';

export const WalletKPIBar: React.FC = () => {
  const { currentBalance, totalAdded, totalUsed, pendingRefund, creditLimit } = useWalletStore();

  const cards = [
    {
      title: 'Current Balance',
      value: `₹ ${currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      subtext: 'Available to use',
      icon: Wallet,
      iconBg: 'bg-blue-50 text-blue-600',
      hasInfo: false,
    },
    {
      title: 'Total Added',
      value: `₹ ${totalAdded.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      subtext: 'In all time',
      icon: ArrowDownToLine,
      iconBg: 'bg-emerald-50 text-emerald-600',
      hasInfo: false,
    },
    {
      title: 'Total Used',
      value: `₹ ${totalUsed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      subtext: 'In all time',
      icon: ArrowUpFromLine,
      iconBg: 'bg-amber-50 text-amber-600',
      hasInfo: false,
    },
    {
      title: 'Pending Refund',
      value: `₹ ${pendingRefund.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      subtext: 'Will be added soon',
      icon: RotateCcw,
      iconBg: 'bg-purple-50 text-purple-600',
      hasInfo: true,
    },
    {
      title: 'Credit Limit',
      value: `₹ ${creditLimit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      subtext: 'Allowed credit limit',
      icon: CreditCard,
      iconBg: 'bg-sky-50 text-sky-600',
      hasInfo: true,
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
