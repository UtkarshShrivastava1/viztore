import React from 'react';
import { Users, ShoppingCart, Wallet, ArrowUp, ArrowDown } from 'lucide-react';
import { useCustomerStore } from '../../stores/customerStore.js';

export const CustomerKPIBar: React.FC = () => {
  const { kpis } = useCustomerStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* 1. Total Customers (6.0.png) */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Customers</span>
          <div className="text-xl font-black text-slate-900 leading-tight">
            {kpis.totalCustomers.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-0.5">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            <span>{kpis.totalCustomersGrowth}% from last month</span>
          </div>
        </div>
      </div>

      {/* 2. Total Sales (6.0.png) */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Sales</span>
          <div className="text-xl font-black text-slate-900 leading-tight">
            ₹{kpis.totalSales.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-0.5">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            <span>{kpis.totalSalesGrowth}% from last month</span>
          </div>
        </div>
      </div>

      {/* 3. Total Outstanding (6.0.png) */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <Wallet className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Outstanding</span>
          <div className="text-xl font-black text-slate-900 leading-tight">
            ₹{kpis.totalOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-rose-600 font-bold mt-0.5">
            <ArrowDown className="w-3 h-3 stroke-[2.5]" />
            <span>{Math.abs(kpis.totalOutstandingChange)}% from last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};
