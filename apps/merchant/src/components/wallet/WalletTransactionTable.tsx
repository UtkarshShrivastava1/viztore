import React, { useState } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  RotateCcw,
  Eye,
  ArrowUpDown,
  Download,
  Wallet as WalletIcon,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { useWalletStore, WalletTransaction } from '../../stores/walletStore.js';

interface WalletTransactionTableProps {
  onViewTransaction: (txn: WalletTransaction) => void;
}

export const WalletTransactionTable: React.FC<WalletTransactionTableProps> = ({
  onViewTransaction,
}) => {
  const {
    transactions,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    typeFilter,
    setTypeFilter,
    methodFilter,
    setMethodFilter,
    statusFilter,
    setStatusFilter,
    clearFilters,
  } = useWalletStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const filteredTransactions = transactions.filter((t) => {
    // Tab filter
    if (activeTab === 'added' && t.type !== 'Added') return false;
    if (activeTab === 'used' && t.type !== 'Used') return false;
    if (activeTab === 'refunds' && t.type !== 'Refund') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.id.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.paymentMethod.toLowerCase().includes(q) ||
        (t.referenceId && t.referenceId.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Type filter
    if (typeFilter !== 'All Types' && t.type !== typeFilter) {
      return false;
    }

    // Method filter
    if (methodFilter !== 'All Methods' && t.paymentMethod !== methodFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'All Statuses' && t.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredTransactions.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const renderPaymentMethod = (method: string, methodType: string) => {
    switch (methodType) {
      case 'razorpay':
        return (
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-4 h-4 rounded bg-[#072654] text-white flex items-center justify-center text-[9px] font-black italic shrink-0 shadow-2xs">
              <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current">
                <path d="M22.436 0l-11.91 7.773-2.766 8.355 4.887-3.19 1.83-5.526 3.655-2.387-4.148 12.529-6.388 4.172 1.488-4.496-4.887 3.19-4.197 12.67 7.027-4.59 2.766-8.354-4.887 3.19-1.83 5.526-3.655 2.387 4.148-12.53 6.388-4.171-1.488 4.496 4.887-3.19z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-800 text-[11px] truncate">{method}</span>
          </div>
        );
      case 'hdfc':
        return (
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-4 h-4 rounded bg-[#ed1c24] text-white flex items-center justify-center text-[9px] font-bold shrink-0 shadow-2xs">
              <div className="w-2 h-2 bg-blue-900 border border-white flex items-center justify-center">
                <span className="text-[6px] text-white font-extrabold">+</span>
              </div>
            </div>
            <span className="font-semibold text-slate-800 text-[11px] truncate">{method}</span>
          </div>
        );
      case 'upi':
        return (
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="px-1 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center font-black text-[8px] tracking-tight shrink-0">
              <span className="text-emerald-600">UP</span>
              <span className="text-amber-500">I</span>
            </div>
            <span className="font-semibold text-slate-800 text-[11px] truncate">{method}</span>
            <span className="text-[9px] text-slate-400">↗</span>
          </div>
        );
      case 'wallet':
      default:
        return (
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-4 h-4 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
              <WalletIcon className="w-3 h-3" />
            </div>
            <span className="font-semibold text-slate-800 text-[11px] truncate">{method}</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* 1. Tabs Bar matching mockup 7.0.png */}
      <div className="px-5 pt-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${
              activeTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Transactions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('added')}
            className={`pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${
              activeTab === 'added'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Added Money
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('used')}
            className={`pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${
              activeTab === 'used'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Used Money
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('refunds')}
            className={`pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${
              activeTab === 'refunds'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Refunds
          </button>
        </div>

        {/* Download Statement Dropdown */}
        <div className="relative pb-2 sm:pb-0">
          <button
            type="button"
            onClick={() => setIsDownloadOpen(!isDownloadOpen)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Statement</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDownloadOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setIsDownloadOpen(false);
                  alert('Generating PDF Statement for current period...');
                }}
                className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-rose-500" />
                <span>PDF Statement</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDownloadOpen(false);
                  alert('Exporting transactions as Excel (CSV)...');
                }}
                className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Excel / CSV</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Filters Bar matching mockup 7.0.png */}
      <div className="p-3.5 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-end">
        {/* Search Input */}
        <div className="lg:col-span-4 relative">
          <input
            type="text"
            placeholder="Search by transaction ID, reference, invoice no. or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Date Range */}
        <div className="lg:col-span-2">
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Date Range</label>
          <div className="relative">
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-6 pr-6 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer truncate"
            />
            <Calendar className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Transaction Type */}
        <div className="lg:col-span-2">
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">
            Transaction Type
          </label>
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
            >
              <option value="All Types">All Types</option>
              <option value="Added">Added</option>
              <option value="Used">Used</option>
              <option value="Refund">Refund</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Payment Method */}
        <div className="lg:col-span-2">
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">
            Payment Method
          </label>
          <div className="relative">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
            >
              <option value="All Methods">All Methods</option>
              <option value="Razorpay">Razorpay</option>
              <option value="Wallet Balance">Wallet Balance</option>
              <option value="HDFC Bank **** 4567">HDFC Bank **** 4567</option>
              <option value="UPI">UPI</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Status & Clear Filters */}
        <div className="lg:col-span-2 flex items-center gap-2">
          <div className="relative flex-1">
            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="px-2.5 py-1.5 mt-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-semibold flex items-center gap-1 transition-colors shrink-0 shadow-2xs"
            title="Clear filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* 3. Compact High-Density Table (Fits entire screen without scroll) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] sm:text-[11px] font-bold text-slate-600 tracking-tight">
              <th className="py-2.5 px-2 w-8 text-center">
                <input
                  type="checkbox"
                  checked={
                    filteredTransactions.length > 0 &&
                    selectedIds.length === filteredTransactions.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-2 whitespace-nowrap">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 font-bold text-slate-700 hover:text-slate-900"
                >
                  <span>Date & Time</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-2.5 px-2 whitespace-nowrap">Transaction ID</th>
              <th className="py-2.5 px-1.5 whitespace-nowrap">Type</th>
              <th className="py-2.5 px-2">Description</th>
              <th className="py-2.5 px-2 whitespace-nowrap">Payment Method</th>
              <th className="py-2.5 px-2 whitespace-nowrap">Amount</th>
              <th className="py-2.5 px-1.5 whitespace-nowrap">Status</th>
              <th className="py-2.5 px-2 whitespace-nowrap">Closing Balance</th>
              <th className="py-2.5 px-1.5 whitespace-nowrap">Reference</th>
              <th className="py-2.5 px-2 text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-10 text-center text-slate-400 text-xs">
                  No wallet transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => {
                const isPositive = txn.amount > 0;
                const isSelected = selectedIds.includes(txn.id);

                return (
                  <tr
                    key={txn.id}
                    className={`transition-colors cursor-pointer group ${
                      isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                    }`}
                    onClick={() => onViewTransaction(txn)}
                  >
                    {/* Checkbox */}
                    <td
                      className="py-2.5 px-2 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(txn.id, e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>

                    {/* Date & Time */}
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <div className="font-bold text-slate-900 leading-tight">{txn.date}</div>
                      <div className="text-[10px] text-slate-400">{txn.time}</div>
                    </td>

                    {/* Transaction ID */}
                    <td className="py-2.5 px-2 font-mono font-medium text-slate-800 text-[11px] whitespace-nowrap">
                      {txn.id}
                    </td>

                    {/* Type Badge */}
                    <td className="py-2.5 px-1.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          txn.type === 'Added'
                            ? 'bg-emerald-50 text-emerald-700'
                            : txn.type === 'Used'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {txn.type}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-2.5 px-2 font-medium text-slate-800 max-w-[140px] xl:max-w-xs truncate" title={txn.description}>
                      {txn.description}
                    </td>

                    {/* Payment Method */}
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      {renderPaymentMethod(txn.paymentMethod, txn.methodType)}
                    </td>

                    {/* Amount */}
                    <td className="py-2.5 px-2 font-bold whitespace-nowrap">
                      <span className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                        {isPositive ? '+ ' : '- '}₹{' '}
                        {Math.abs(txn.amount).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-1.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          txn.status === 'Success'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : txn.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>

                    {/* Closing Balance */}
                    <td className="py-2.5 px-2 font-medium text-slate-900 whitespace-nowrap">
                      ₹{' '}
                      {txn.closingBalance.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    {/* Reference */}
                    <td className="py-2.5 px-1.5 font-medium text-slate-500 whitespace-nowrap">
                      {txn.referenceId || '—'}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-2.5 px-2 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onViewTransaction(txn)}
                        className="px-2 py-0.5 rounded border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600 text-[10px] font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination bar matching mockup 7.0.png */}
      <div className="p-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Left: Per page dropdown & count */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="pl-2.5 pr-6 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 appearance-none shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span className="text-[11px] text-slate-500">
            Showing 1 to {filteredTransactions.length} of 248 transactions
          </span>
        </div>

        {/* Right: Page Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors disabled:opacity-40 disabled:pointer-events-none shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
              currentPage === 1
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            1
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(2)}
            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
              currentPage === 2
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            2
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(3)}
            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
              currentPage === 3
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            3
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(4)}
            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
              currentPage === 4
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            4
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(5)}
            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
              currentPage === 5
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            5
          </button>

          <span className="px-1 text-slate-400 font-bold text-xs">...</span>

          <button
            type="button"
            onClick={() => setCurrentPage(25)}
            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
              currentPage === 25
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            25
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => p + 1)}
            className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-2xs"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
