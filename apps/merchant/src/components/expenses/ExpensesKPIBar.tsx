import React from 'react';
import {
  ShoppingCart,
  FileText,
  Wallet,
  FileCheck2,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  PieChart,
  Building2,
  MoreHorizontal,
  Users,
  Info,
} from 'lucide-react';
import { useExpenseStore } from '../../stores/expenseStore.js';

export const ExpensesKPIBar: React.FC = () => {
  const { activeSubTab, overviewKPIs } = useExpenseStore();

  if (activeSubTab === 'orders') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Purchase Orders</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">48</h3>
            <span className="text-[11px] text-slate-400 font-medium">All Time</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Pending Orders</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">12</h3>
            <span className="text-[11px] text-slate-500 font-medium">Amount: ₹ 2,35,400</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Received Orders</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">28</h3>
            <span className="text-[11px] text-slate-500 font-medium">Amount: ₹ 4,82,600</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Cancelled Orders</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">8</h3>
            <span className="text-[11px] text-slate-500 font-medium">Amount: ₹ 68,500</span>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubTab === 'expenses') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Expenses</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">₹ 28,450.00</h3>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <span>This Month</span>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Food & Beverages</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">₹ 8,450.00</h3>
            <span className="text-[11px] text-slate-400">This Month</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Rent & Utilities</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">₹ 12,000.00</h3>
            <span className="text-[11px] text-slate-400">This Month</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <MoreHorizontal className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Other Expenses</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">₹ 8,000.00</h3>
            <span className="text-[11px] text-slate-400">This Month</span>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubTab === 'credit_notes') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Credit Notes</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">12</h3>
            <span className="text-[11px] text-slate-400">All Time</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Credit Note Amount</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">₹ 12,450.00</h3>
            <span className="text-[11px] text-slate-400">All Time</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Pending Credit Notes</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">3</h3>
            <span className="text-[11px] text-slate-500">Amount: ₹ 4,500.00</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Cancelled Credit Notes</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">1</h3>
            <span className="text-[11px] text-slate-500">Amount: ₹ 1,200.00</span>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubTab === 'eway_bills') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total E-Way Bills</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">12</h3>
            <span className="text-[11px] text-slate-400">This Month</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Generated</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">8</h3>
            <span className="text-[11px] text-slate-400">This Month</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">In Transit</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">3</h3>
            <span className="text-[11px] text-slate-400">This Month</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Expired / Cancelled</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">1</h3>
            <span className="text-[11px] text-slate-400">This Month</span>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubTab === 'vendors') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Vendors</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">28</h3>
            <span className="text-[11px] text-slate-400">All Time</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Vendors</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">24</h3>
            <span className="text-[11px] text-slate-500">85.7% of total</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Inactive Vendors</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">3</h3>
            <span className="text-[11px] text-slate-500">10.7% of total</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Blocked Vendors</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">1</h3>
            <span className="text-[11px] text-slate-500">3.6% of total</span>
          </div>
        </div>
      </div>
    );
  }

  // Default: Overview 5 KPI Cards (Mockup 8.0.png and 8.6.png)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Purchase */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Purchase</span>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
            ₹ {overviewKPIs.totalPurchase.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h4>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
            <span>This Year</span>
            <Info className="w-3 h-3 text-slate-400" />
          </div>
        </div>
      </div>

      {/* 2. Total Expense */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Expense</span>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
            ₹ {overviewKPIs.totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h4>
          <span className="text-[10px] text-slate-400 mt-0.5 block">This Year</span>
        </div>
      </div>

      {/* 3. Total Credit Note */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Wallet className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Credit Note</span>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
            ₹ {overviewKPIs.totalCreditNote.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h4>
          <span className="text-[10px] text-slate-400 mt-0.5 block">This Year</span>
        </div>
      </div>

      {/* 4. Open Purchase Orders */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <FileCheck2 className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 block">Open Purchase Orders</span>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
            ₹ {overviewKPIs.openPurchaseOrders.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h4>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
            <span>{overviewKPIs.openPOCount} POs</span>
            <Info className="w-3 h-3 text-slate-400" />
          </div>
        </div>
      </div>

      {/* 5. E-Way Bills */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <Truck className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 block">E-Way Bills</span>
          <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
            {overviewKPIs.eWayBillsCount}
          </h4>
          <span className="text-[10px] text-slate-400 mt-0.5 block">This Month</span>
        </div>
      </div>
    </div>
  );
};
