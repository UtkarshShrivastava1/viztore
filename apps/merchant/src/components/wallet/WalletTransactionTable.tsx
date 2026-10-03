import React from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  RotateCcw,
  Eye,
  ArrowUpDown,
  Wallet as WalletIcon,
  CreditCard,
  Building,
  Smartphone,
  ExternalLink,
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

  const renderMethodIcon = (methodType: string) => {
    switch (methodType) {
      case 'razorpay':
        return (
          <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-black italic shadow-2xs">
            R
          </div>
        );
      case 'hdfc':
        return (
          <div className="w-5 h-5 rounded bg-red-600 text-white flex items-center justify-center text-[9px] font-black shadow-2xs">
            +
          </div>
        );
      case 'upi':
        return (
          <div className="w-5 h-5 rounded bg-amber-500 text-white flex items-center justify-center text-[8px] font-extrabold shadow-2xs">
            UPI
          </div>
        );
      case 'wallet':
        return (
          <div className="w-5 h-5 rounded bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs">
            <WalletIcon className="w-3 h-3 text-slate-600" />
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 rounded bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs">
            <Building className="w-3 h-3 text-slate-600" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* 1. Tabs Bar matching 7.0.png */}
      <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-xs font-bold transition-all relative ${
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
          className={`pb-3 text-xs font-bold transition-all relative ${
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
          className={`pb-3 text-xs font-bold transition-all relative ${
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
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'refunds'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Refunds
        </button>
      </div>

      {/* 2. Filters Bar matching 7.0.png */}
      <div className="p-4 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
        {/* Search Input */}
        <div className="lg:col-span-4 relative">
          <input
            type="text"
            placeholder="Search by transaction ID, reference, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3.5 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
          />
          <Search className="w-4 h-4 text-blue-600 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Date Range */}
        <div className="lg:col-span-2">
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Date Range</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Select date range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
            >
              <option value="All Types">All Types</option>
              <option value="Added">Added</option>
              <option value="Used">Used</option>
              <option value="Refund">Refund</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
            >
              <option value="All Methods">All Methods</option>
              <option value="Razorpay">Razorpay</option>
              <option value="Wallet Balance">Wallet Balance</option>
              <option value="HDFC Bank **** 4567">HDFC Bank **** 4567</option>
              <option value="UPI">UPI</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="px-2.5 py-1.5 mt-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 shadow-2xs"
            title="Clear filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* 3. Transactions Table matching 7.0.png */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">
                <span className="inline-flex items-center gap-1">
                  Date & Time <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </span>
              </th>
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Closing Balance</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  No wallet transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => {
                const isPositive = txn.amount > 0;
                return (
                  <tr
                    key={txn.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => onViewTransaction(txn)}
                  >
                    {/* Date & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{txn.date}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{txn.time}</div>
                    </td>

                    {/* Transaction ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-[11px]">
                      {txn.id}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          txn.type === 'Added'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : txn.type === 'Used'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {txn.type}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {txn.description}
                    </td>

                    {/* Payment Method with Logo */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {renderMethodIcon(txn.methodType)}
                        <span className="font-semibold text-slate-800 text-xs">
                          {txn.paymentMethod}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-extrabold whitespace-nowrap">
                      <span className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                        {isPositive ? '+ ' : '- '}₹{' '}
                        {Math.abs(txn.amount).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          txn.status === 'Success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : txn.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>

                    {/* Closing Balance */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      ₹{' '}
                      {txn.closingBalance.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onViewTransaction(txn)}
                        className="px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-50 text-blue-700 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
