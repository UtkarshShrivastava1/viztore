import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  RotateCcw,
  Eye,
  Info,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { usePayoutsStore, PayoutTransaction } from '../../stores/payoutsStore.js';

export const TransactionsTab: React.FC = () => {
  const {
    transactions,
    setSelectedTransaction,
    setIsTransactionDrawerOpen,
  } = usePayoutsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [methodFilter, setMethodFilter] = useState('All Methods');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = transactions.filter((t) => {
    if (typeFilter !== 'All Types' && t.type !== typeFilter) return false;
    if (methodFilter !== 'All Methods' && t.paymentMethod !== methodFilter) return false;
    if (statusFilter !== 'All Statuses' && t.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.transactionId.toLowerCase().includes(q) ||
        t.orderId.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.paymentMethod.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('All Types');
    setMethodFilter('All Methods');
    setStatusFilter('All Statuses');
    setCurrentPage(1);
  };

  const handleView = (t: PayoutTransaction) => {
    setSelectedTransaction(t);
    setIsTransactionDrawerOpen(true);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Order Payment':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Order Payment
          </span>
        );
      case 'Refund':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Refund
          </span>
        );
      case 'Chargeback':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Chargeback
          </span>
        );
      case 'Fee Deduction':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Fee Deduction
          </span>
        );
      case 'Shipping Charge':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Shipping Charge
          </span>
        );
      case 'Payout':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Payout
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Title Header Matching 10.3.png */}
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900">Transactions</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          View all transactions including orders, payments, refunds, fees, and adjustments.
        </p>
      </div>

      {/* Filter Bar Matching 10.3.png */}
      <div className="p-3.5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-3 justify-between bg-slate-50/30">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by order ID, transaction ID, customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Transaction Type Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Transaction Type</span>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[120px]"
              >
                <option value="All Types">All Types</option>
                <option value="Order Payment">Order Payment</option>
                <option value="Refund">Refund</option>
                <option value="Fee Deduction">Fee Deduction</option>
                <option value="Chargeback">Chargeback</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Payment Method Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Payment Method</span>
            <div className="relative">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[125px]"
              >
                <option value="All Methods">All Methods</option>
                <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                <option value="UPI (Google Pay)">UPI (Google Pay)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="UPI (Paytm)">UPI (Paytm)</option>
                <option value="Original Payment">Original Payment</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Status</span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[110px]"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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

      {/* Main Transactions Table Matching 10.3.png */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-semibold text-[11px]">
              <th className="py-2.5 px-3">
                <span className="inline-flex items-center gap-1">
                  Date & Time <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </span>
              </th>
              <th className="py-2.5 px-2.5">Transaction ID</th>
              <th className="py-2.5 px-2.5">Order ID</th>
              <th className="py-2.5 px-2.5">Customer</th>
              <th className="py-2.5 px-2.5">Type</th>
              <th className="py-2.5 px-2.5">Payment Method</th>
              <th className="py-2.5 px-2.5">
                <span className="inline-flex items-center gap-1">
                  Amount (₹) <Info className="w-3 h-3 text-slate-400" />
                </span>
              </th>
              <th className="py-2.5 px-2">
                <span className="inline-flex items-center gap-1">
                  Fee (₹) <Info className="w-3 h-3 text-slate-400" />
                </span>
              </th>
              <th className="py-2.5 px-2.5">Net Amount (₹)</th>
              <th className="py-2.5 px-2">Status</th>
              <th className="py-2.5 px-2.5">Balance (₹)</th>
              <th className="py-2.5 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2 px-3 text-slate-600 whitespace-nowrap">
                  {t.dateTime}
                </td>
                <td className="py-2 px-2.5 font-bold text-slate-900 whitespace-nowrap">
                  {t.transactionId}
                </td>
                <td className="py-2 px-2.5 font-medium text-slate-600 whitespace-nowrap">
                  {t.orderId}
                </td>
                <td className="py-2 px-2.5 font-semibold text-slate-900 whitespace-nowrap">
                  {t.customer}
                </td>
                <td className="py-2 px-2.5 whitespace-nowrap">
                  {getTypeBadge(t.type)}
                </td>
                <td className="py-2 px-2.5 text-slate-700 whitespace-nowrap">
                  {t.paymentMethod}
                </td>
                <td
                  className={`py-2 px-2.5 font-bold whitespace-nowrap ${
                    t.amount < 0 ? 'text-rose-600' : 'text-slate-900'
                  }`}
                >
                  {t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-2 text-slate-600 whitespace-nowrap">
                  {t.fee !== null ? t.fee.toFixed(2) : '-'}
                </td>
                <td
                  className={`py-2 px-2.5 font-bold whitespace-nowrap ${
                    t.netAmount < 0 ? 'text-rose-600' : 'text-slate-900'
                  }`}
                >
                  {t.netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-2 whitespace-nowrap">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {t.status}
                  </span>
                </td>
                <td className="py-2 px-2.5 font-bold text-slate-900 whitespace-nowrap">
                  {t.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-3 text-center whitespace-nowrap">
                  <button
                    onClick={() => handleView(t)}
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

      {/* Pagination Matching 10.3.png */}
      <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing 1 to {filteredTransactions.length} of 248 transactions
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-lg text-xs font-bold ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
            className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
