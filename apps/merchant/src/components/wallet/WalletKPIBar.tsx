import React from 'react';
import { Wallet, TrendingDown, Info } from 'lucide-react';
import { useWalletStore } from '../../stores/walletStore.js';

export const WalletKPIBar: React.FC = () => {
  const { currentBalance, usedThisMonth, usedChangePercent } = useWalletStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {/* 1. Current Balance Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Wallet className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold truncate">
            <span>Current Balance</span>
            <span title="Available balance for platform fees, payouts and refunds.">
              <Info className="w-3.5 h-3.5 text-slate-400 inline cursor-pointer" />
            </span>
          </div>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
            ₹ {currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h4>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block truncate">Available to use</span>
        </div>
      </div>

      {/* 2. Used This Month Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <TrendingDown className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] text-slate-500 font-semibold block truncate">Used This Month</span>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
            ₹ {usedThisMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h4>
          <div className="flex items-center gap-1.5 text-[10px] mt-0.5 truncate">
            <span className="inline-flex items-center text-rose-600 font-bold">
              <TrendingDown className="w-3 h-3 mr-0.5 inline" />
              {Math.abs(usedChangePercent)}%
            </span>
            <span className="text-slate-400">from last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};
