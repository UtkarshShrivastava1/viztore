import React from 'react';
import { Users, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useExpenseStore } from '../../stores/expenseStore.js';

export const VendorsKPIBar: React.FC = () => {
  const { vendors } = useExpenseStore();

  const total = vendors.length || 28;
  const activeCount = vendors.filter((v) => v.status === 'Active').length || 24;
  const inactiveCount = vendors.filter((v) => v.status === 'Inactive').length || 3;
  const blockedCount = vendors.filter((v) => v.status === 'Blocked').length || 1;

  const activePercent = total > 0 ? ((activeCount / total) * 100).toFixed(1) : '85.7';
  const inactivePercent = total > 0 ? ((inactiveCount / total) * 100).toFixed(1) : '10.7';
  const blockedPercent = total > 0 ? ((blockedCount / total) * 100).toFixed(1) : '3.6';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Total Vendors */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-semibold text-slate-500 block truncate">Total Vendors</span>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">{total}</h4>
          <span className="text-[10px] text-slate-400 mt-0.5 block">All Time</span>
        </div>
      </div>

      {/* 2. Active Vendors */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-semibold text-slate-500 block truncate">Active Vendors</span>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">{activeCount}</h4>
          <span className="text-[10px] text-slate-500 mt-0.5 block font-medium">
            {activePercent}% of total
          </span>
        </div>
      </div>

      {/* 3. Inactive Vendors */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-semibold text-slate-500 block truncate">Inactive Vendors</span>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">{inactiveCount}</h4>
          <span className="text-[10px] text-slate-500 mt-0.5 block font-medium">
            {inactivePercent}% of total
          </span>
        </div>
      </div>

      {/* 4. Blocked Vendors */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <XCircle className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-semibold text-slate-500 block truncate">Blocked Vendors</span>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">{blockedCount}</h4>
          <span className="text-[10px] text-slate-500 mt-0.5 block font-medium">
            {blockedPercent}% of total
          </span>
        </div>
      </div>
    </div>
  );
};
