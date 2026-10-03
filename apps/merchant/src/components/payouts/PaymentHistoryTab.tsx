import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  Calendar,
  Filter,
  Download,
  ChevronDown,
} from 'lucide-react';
import { usePayoutsStore, PayoutRecord } from '../../stores/payoutsStore.js';

export const PaymentHistoryTab: React.FC = () => {
  const { payouts } = usePayoutsStore();

  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateRange, setDateRange] = useState('01 Apr 2024 - 18 May 2024');

  const filteredPayouts = payouts.filter((p) => {
    if (statusFilter !== 'All Status' && p.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: PayoutRecord['status']) => {
    switch (status) {
      case 'Success':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Success
          </span>
        );
      case 'In Process':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            In Process
          </span>
        );
      case 'Failed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Failed
          </span>
        );
      case 'Reversed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Reversed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const handleExport = () => {
    alert('Exporting payment history to CSV...');
  };

  return (
    <div className="space-y-6">
      {/* 5 KPI Cards Matching 11.1.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Payouts */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Payouts</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,18,450.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">45 Payouts</p>
        </div>

        {/* Card 2: Total Amount Paid */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Amount Paid</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,15,230.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Transferred to bank</p>
        </div>

        {/* Card 3: In Process */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">In Process</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 3,220.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">2 Payouts</p>
        </div>

        {/* Card 4: Failed / Reversed */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Failed / Reversed</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 0.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">0 Payouts</p>
        </div>

        {/* Card 5: Average Payout Amount */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">
                Average Payout Amount
              </span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 2,627.78</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Per Payout</p>
        </div>
      </div>

      {/* Filter Bar Matching 11.1.png */}
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

          {/* Payout Date */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Payout Date
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

          {/* Status */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Status
            </span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[130px]"
              >
                <option value="All Status">All Status</option>
                <option value="Success">Success</option>
                <option value="In Process">In Process</option>
                <option value="Failed">Failed</option>
                <option value="Reversed">Reversed</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={() => setStatusFilter('All Status')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-2"
          >
            Clear All
          </button>
          <button className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter</span>
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Payout ID</th>
                <th className="py-3 px-3">Payout Date & Time</th>
                <th className="py-3 px-3">Payout Account</th>
                <th className="py-3 px-3">Amount (₹)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">UTR / Reference No.</th>
                <th className="py-3 px-3">Processed On</th>
                <th className="py-3 px-3">Remarks</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPayouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {p.payoutId}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{p.date}</td>
                  <td className="py-3 px-3 text-slate-800 whitespace-nowrap font-medium">
                    {p.payoutAccount}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                    ₹ {p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">{getStatusBadge(p.status)}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {p.utrNumber || '-'}
                  </td>
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                    {p.processedOn || '-'}
                  </td>
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                    {p.remarks || '-'}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => alert(`Payout ${p.payoutId}: ₹${p.amount}`)}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
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
