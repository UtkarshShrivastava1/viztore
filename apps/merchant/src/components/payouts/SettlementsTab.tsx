import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  RotateCcw,
  Eye,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { usePayoutsStore, SettlementRecord } from '../../stores/payoutsStore.js';

export const SettlementsTab: React.FC = () => {
  const {
    settlements,
    setSelectedSettlement,
    setIsSettlementDrawerOpen,
  } = usePayoutsStore();

  const [dateRange, setDateRange] = useState('10 May 2024 - 16 May 2024');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [payoutAccountFilter, setPayoutAccountFilter] = useState(
    'HDFC Bank - 50200012345678'
  );
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSettlements = settlements.filter((s) => {
    if (statusFilter !== 'All Statuses' && s.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setDateRange('10 May 2024 - 16 May 2024');
    setStatusFilter('All Statuses');
    setPayoutAccountFilter('HDFC Bank - 50200012345678');
    setCurrentPage(1);
  };

  const handleView = (s: SettlementRecord) => {
    setSelectedSettlement(s);
    setIsSettlementDrawerOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Title Header Matching 10.2.png */}
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900">Settlements</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          View all settlements transferred to your bank account.
        </p>
      </div>

      {/* Filter Bar Matching 10.2.png */}
      <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/30">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 min-w-[190px] justify-between">
              <span>{dateRange}</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Settlement Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Settlement Status</span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[120px]"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Settled">Settled</option>
                <option value="In Transit">In Transit</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Payout Account Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Payout Account</span>
            <div className="relative">
              <select
                value={payoutAccountFilter}
                onChange={(e) => setPayoutAccountFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[210px]"
              >
                <option value="HDFC Bank - 50200012345678">
                  HDFC Bank - 50200012345678
                </option>
                <option value="ICICI Bank - 001205012345">
                  ICICI Bank - 001205012345
                </option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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

      {/* Main Settlements Table Matching 10.2.png */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-semibold text-[11px]">
              <th className="py-2.5 px-3">Settlement ID</th>
              <th className="py-2.5 px-3">Settlement Date</th>
              <th className="py-2.5 px-3">Period</th>
              <th className="py-2.5 px-2.5">
                <span className="inline-flex items-center gap-1">
                  Order Count <Info className="w-3 h-3 text-slate-400" />
                </span>
              </th>
              <th className="py-2.5 px-3">Gross Amount (₹)</th>
              <th className="py-2.5 px-3">
                <span className="inline-flex items-center gap-1">
                  Deductions (₹) <Info className="w-3 h-3 text-slate-400" />
                </span>
              </th>
              <th className="py-2.5 px-3">Settlement Amount (₹)</th>
              <th className="py-2.5 px-2.5">Status</th>
              <th className="py-2.5 px-3">UTR / Reference No.</th>
              <th className="py-2.5 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
            {filteredSettlements.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap">
                  {s.settlementId}
                </td>
                <td className="py-2 px-3 text-slate-600 whitespace-nowrap">
                  {s.settlementDate}
                </td>
                <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                  {s.period}
                </td>
                <td className="py-2 px-2.5 font-medium text-slate-800 whitespace-nowrap">
                  {s.orderCount}
                </td>
                <td className="py-2 px-3 font-semibold text-slate-900 whitespace-nowrap">
                  ₹ {s.grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-3 text-slate-600 whitespace-nowrap">
                  ₹ {s.deductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap">
                  ₹ {s.settlementAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-2.5 whitespace-nowrap">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {s.status}
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-600 font-mono whitespace-nowrap">
                  {s.utr}
                </td>
                <td className="py-2 px-3 text-center whitespace-nowrap">
                  <button
                    onClick={() => handleView(s)}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Matching 10.2.png */}
      <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing 1 to {filteredSettlements.length} of 28 settlements
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
