import React, { useState } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { usePayoutsStore, PayoutRecord } from '../../stores/payoutsStore.js';

export const PaymentHistoryTab: React.FC = () => {
  const {
    payouts,
    setSelectedPayout,
    setIsPayoutDrawerOpen,
  } = usePayoutsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [dateRange, setDateRange] = useState('10 May 2024 - 16 May 2024');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPayouts = payouts.filter((p) => {
    if (statusFilter !== 'All Statuses' && p.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.payoutId.toLowerCase().includes(q) ||
        p.utr.toLowerCase().includes(q) ||
        p.bankAccount.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Statuses');
    setDateRange('10 May 2024 - 16 May 2024');
    setCurrentPage(1);
  };

  const handleViewDetails = (p: PayoutRecord) => {
    setSelectedPayout(p);
    setIsPayoutDrawerOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Title Header Matching 10.1.png */}
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900">Payment History</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          View all payouts made to your bank account.
        </p>
      </div>

      {/* Filter Bar Matching 10.1.png */}
      <div className="p-3.5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-3 justify-between bg-slate-50/30">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by payout ID, order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Status</span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[120px]"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Date Range</span>
            <div className="relative">
              <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 min-w-[190px] justify-between">
                <span>{dateRange}</span>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/60 rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Main Table Matching 10.1.png */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-semibold text-[11px]">
              <th className="py-2.5 px-3">Payout ID</th>
              <th className="py-2.5 px-3">Date & Time</th>
              <th className="py-2.5 px-2.5">Order Count</th>
              <th className="py-2.5 px-3">Amount (₹)</th>
              <th className="py-2.5 px-3">UTR / Reference No.</th>
              <th className="py-2.5 px-3">Bank Account</th>
              <th className="py-2.5 px-2.5">Status</th>
              <th className="py-2.5 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
            {filteredPayouts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap">
                  {p.payoutId}
                </td>
                <td className="py-2 px-3 text-slate-600 whitespace-nowrap">
                  {p.dateTime}
                </td>
                <td className="py-2 px-2.5 text-slate-800 font-medium whitespace-nowrap">
                  {p.orderCount}
                </td>
                <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap">
                  ₹ {p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-3 text-slate-600 font-mono whitespace-nowrap">
                  {p.utr}
                </td>
                <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                  {p.bankAccount}
                </td>
                <td className="py-2 px-2.5 whitespace-nowrap">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      p.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-2 px-3 text-center whitespace-nowrap">
                  <button
                    onClick={() => handleViewDetails(p)}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Matching 10.1.png */}
      <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing 1 to {filteredPayouts.length} of 28 payouts
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(1)}
            className={`w-7 h-7 rounded-lg text-xs font-bold ${
              currentPage === 1 ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`w-7 h-7 rounded-lg text-xs font-bold ${
              currentPage === 2 ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className={`w-7 h-7 rounded-lg text-xs font-bold ${
              currentPage === 3 ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            3
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
            className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
