import React from 'react';
import { Users, ShoppingCart, Wallet } from 'lucide-react';
import { useCustomerStore } from '../../stores/customerStore.js';

export const CustomerKPIBar: React.FC = () => {
  const { kpis, customers } = useCustomerStore();

  const totalCount = customers.length > 0 ? customers.length : kpis.totalCustomers;
  const activeCount = customers.filter((c) => c.status === 'active').length;
  const totalSales =
    customers.length > 0
      ? customers.reduce((sum, c) => sum + (c.totalSales || 0), 0)
      : kpis.totalSales;
  const totalOutstanding =
    customers.length > 0
      ? customers.reduce((sum, c) => sum + (c.outstandingAmount || 0), 0)
      : kpis.totalOutstanding;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {/* 1. Total Customers (6.0.png) */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 block truncate">Total Customers</span>
          <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 truncate">
            {totalCount.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-0.5 truncate">
            {totalCount === 0 ? (
              <span className="text-slate-400 font-normal">No customer accounts registered</span>
            ) : (
              <span>{activeCount} active in directory</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Total Sales (6.0.png) */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 block truncate">Total Sales</span>
          <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 truncate">
            ₹{totalSales.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-0.5 truncate">
            {totalSales === 0 ? (
              <span className="text-slate-400 font-normal">No sales recorded yet</span>
            ) : (
              <span>Cumulative retail revenue</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Total Outstanding (6.0.png) */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <Wallet className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 block truncate">Total Outstanding</span>
          <div className="text-lg font-black text-slate-900 leading-tight mt-0.5 truncate">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[10px] mt-0.5 truncate">
            {totalOutstanding === 0 ? (
              <span className="text-emerald-600 font-semibold">✓ Zero outstanding dues</span>
            ) : (
              <span className="text-rose-600 font-bold">Active credit balance across accounts</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
