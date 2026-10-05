import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ListOrdered,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { useWalletStore, WalletTransaction } from '../../stores/walletStore.js';

interface TransactionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTransaction: (txn: WalletTransaction) => void;
}

export const TransactionHistoryDrawer: React.FC<TransactionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTransaction,
}) => {
  const {
    transactions,
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

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  if (!isOpen) return null;

  const filteredTransactions = transactions.filter((t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.id.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.paymentMethod.toLowerCase().includes(q) ||
        (t.referenceId && t.referenceId.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (typeFilter !== 'All Types' && t.type !== typeFilter) return false;
    if (methodFilter !== 'All Methods' && t.paymentMethod !== methodFilter) return false;
    if (statusFilter !== 'All Statuses' && t.status !== statusFilter) return false;

    return true;
  });

  const totalPages = Math.ceil(filteredTransactions.length / 5) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  );

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Full screen backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel starting flush from top to bottom */}
      <div className="relative w-full max-w-md bg-white h-screen shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header - flush with top edge */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">Transaction History</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              View all your wallet transactions, including added money, usage and refunds.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area - optimized compact spacing */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {/* Total Transactions Card */}
          <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Total Transactions</span>
              <h3 className="text-xl font-bold text-slate-900 leading-tight">248</h3>
            </div>
          </div>

          {/* Search bar with filter icon */}
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by transaction ID, reference, invoice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors shadow-2xs shrink-0"
              title="Reset Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Dropdowns (2x2 grid) */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="01 May 2024 - 31 May 2024">01 May 2024 - 31 May 2024</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="This Year">This Year</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Transaction Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="All Types">All Types</option>
                <option value="Added">Added Money</option>
                <option value="Used">Used Money</option>
                <option value="Refund">Refunds</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Payment Method</label>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="All Methods">All Methods</option>
                <option value="Razorpay">Razorpay</option>
                <option value="Wallet Balance">Wallet Balance</option>
                <option value="HDFC Bank **** 4567">HDFC Bank</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Transaction Cards List */}
          <div className="space-y-2">
            {paginatedTransactions.map((txn) => {
              const isPositive = txn.amount > 0;
              return (
                <div
                  key={txn.id}
                  onClick={() => onSelectTransaction(txn)}
                  className="p-3 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-200/80 shadow-2xs cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {isPositive ? '+' : '-'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {txn.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                        <span className="font-mono text-slate-500">{txn.id}</span>
                        <span>•</span>
                        <span>
                          {txn.date} {txn.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-xs font-bold ${
                        isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isPositive ? '+' : '-'} ₹{' '}
                      {Math.abs(txn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <span
                      className={`inline-block mt-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        txn.status === 'Success'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {txn.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing {Math.min(1, filteredTransactions.length)} to{' '}
              {Math.min(currentPage * 5, filteredTransactions.length)} of {filteredTransactions.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 py-0.5 bg-blue-600 text-white font-bold rounded-md text-[11px]">
                {currentPage}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Download Statement */}
        <div className="p-3.5 border-t border-slate-100 bg-white relative shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDownloadOpen(!isDownloadOpen)}
              className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download Statement</span>
            </button>

            {isDownloadOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-20 animate-in fade-in duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsDownloadOpen(false);
                    alert('Downloading PDF statement...');
                  }}
                  className="w-full px-3 py-1.5 hover:bg-slate-50 text-xs text-slate-700 flex items-center gap-2 text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-500" />
                  Download as PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDownloadOpen(false);
                    alert('Downloading Excel spreadsheet...');
                  }}
                  className="w-full px-3 py-1.5 hover:bg-slate-50 text-xs text-slate-700 flex items-center gap-2 text-left"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  Download as Excel (CSV)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
