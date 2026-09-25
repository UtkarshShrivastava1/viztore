import React, { useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  Receipt,
  Calendar,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { usePayoutsStore, PayoutTransaction } from '../../stores/payoutsStore.js';

export const TransactionsTab: React.FC = () => {
  const { transactions } = usePayoutsStore();

  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateRange] = useState('01 Apr 2024 - 18 May 2024');

  const filteredTransactions = transactions.filter((t) => {
    if (typeFilter !== 'All Types' && t.type !== typeFilter) return false;
    if (statusFilter !== 'All Status' && t.status !== statusFilter) return false;
    return true;
  });

  const getTransactionTypeBadge = (type: PayoutTransaction['type']) => {
    switch (type) {
      case 'Order Credit':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Order Credit
          </span>
        );
      case 'Shipping Charge':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Shipping Charge
          </span>
        );
      case 'Commission':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Commission
          </span>
        );
      case 'Refund':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Refund
          </span>
        );
      case 'Payout':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Payout
          </span>
        );
      case 'TDS Deducted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            TDS Deducted
          </span>
        );
      case 'Tax Collected':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            Tax Collected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 5 KPI Cards Matching 11.3.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Payouts */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Payouts</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 28,750.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">25 Payouts</p>
        </div>

        {/* Card 2: Total Successful Payouts */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">
                Total Successful Payouts
              </span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 27,500.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">22 Payouts</p>
        </div>

        {/* Card 3: Total Failed / Cancelled */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">
                Total Failed / Cancelled
              </span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,250.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">3 Payouts</p>
        </div>

        {/* Card 4: Average Payout Amount */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">
                Average Payout Amount
              </span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,150.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Across all payouts</p>
        </div>

        {/* Card 5: Next Payout */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Next Payout</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">22 May 2024</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">₹ 12,450.00</p>
        </div>
      </div>

      {/* Filter Bar Matching 11.3.png */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Payout Account */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Payout Account
            </span>
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[200px]">
                <option value="hdfc">HDFC Bank - 50200012345678</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Payout Cycle */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Payout Cycle
            </span>
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[120px]">
                <option value="all">All Cycles</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Transaction Type */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Transaction Type
            </span>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[140px]"
              >
                <option value="All Types">All Types</option>
                <option value="Order Credit">Order Credit</option>
                <option value="Shipping Charge">Shipping Charge</option>
                <option value="Commission">Commission</option>
                <option value="Refund">Refund</option>
                <option value="Payout">Payout</option>
                <option value="TDS Deducted">TDS Deducted</option>
                <option value="Tax Collected">Tax Collected</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Status
            </span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[120px]"
              >
                <option value="All Status">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Date Range */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Date Range
            </span>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={dateRange}
                className="bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[190px]"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={() => {
              setTypeFilter('All Types');
              setStatusFilter('All Status');
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-2"
          >
            Clear All
          </button>
          <button className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-3">Order / Reference ID</th>
                <th className="py-3 px-3">Debit (₹)</th>
                <th className="py-3 px-3">Credit (₹)</th>
                <th className="py-3 px-3">Balance (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {tx.transactionId}
                  </td>
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                    {tx.dateTime}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getTransactionTypeBadge(tx.type)}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {tx.description}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                    {tx.referenceId}
                  </td>
                  <td className="py-3 px-3 font-bold text-rose-600 whitespace-nowrap">
                    {tx.debit
                      ? `₹ ${tx.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                      : '-'}
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-600 whitespace-nowrap">
                    {tx.credit
                      ? `₹ ${tx.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                      : '-'}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                    ₹ {tx.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
