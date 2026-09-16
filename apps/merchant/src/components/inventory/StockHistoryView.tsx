import React, { useState } from 'react';
import {
  ChevronRight,
  Boxes,
  Download,
  SlidersHorizontal,
  Calendar,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronsRight,
} from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore.js';
import { StockHistoryKPICards } from './StockHistoryKPICards.js';

export const StockHistoryView: React.FC = () => {
  const {
    transactions,
    setViewMode,
    historyDateRange,
    historyProductFilter,
    historyCategoryFilter,
    historyTypeFilter,
    historyRefTypeFilter,
    historyCurrentPage,
    setHistoryDateRange,
    setHistoryProductFilter,
    setHistoryCategoryFilter,
    setHistoryTypeFilter,
    setHistoryRefTypeFilter,
    setHistoryCurrentPage,
    clearHistoryFilters,
  } = useInventoryStore();

  const [dateRangeOpen, setDateRangeOpen] = useState(false);

  // Filter transactions
  const filteredTxs = transactions.filter((tx) => {
    if (historyProductFilter !== 'All Products' && !tx.productName.toLowerCase().includes(historyProductFilter.toLowerCase())) {
      return false;
    }
    if (historyTypeFilter !== 'All Types') {
      if (historyTypeFilter === 'Stock In' && tx.type !== 'stock_in') return false;
      if (historyTypeFilter === 'Stock Out' && tx.type !== 'stock_out') return false;
    }
    if (historyRefTypeFilter !== 'All Reference Types' && tx.referenceType !== historyRefTypeFilter) {
      return false;
    }
    return true;
  });

  const totalTransactions = 582;
  const totalPages = 59;

  const handleExport = () => {
    const csvContent =
      'Date,Product,SKU,Type,ReferenceType,ReferenceNo,Quantity,StockBefore,StockAfter,Notes\\n' +
      transactions
        .map(
          (t) =>
            `"${t.date}","${t.productName}","${t.sku}","${t.type}","${t.referenceType}","${t.referenceNo}","${t.quantity}","${t.stockBefore}","${t.stockAfter}","${t.notes}"`
        )
        .join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Stock_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
            <button
              type="button"
              onClick={() => setViewMode('overview')}
              className="hover:text-blue-600 cursor-pointer"
            >
              Inventory
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Stock History</span>
          </nav>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Stock History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View all stock movements and updates across your products.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setViewMode('bulk_adjust')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-blue-600 shadow-2xs transition-colors cursor-pointer"
          >
            <Boxes className="w-4 h-4" />
            <span>Adjust Stock</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => alert('History advanced filter presets')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-blue-600 shadow-2xs transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Date Range & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        {/* Date Range Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDateRangeOpen(!dateRangeOpen)}
            className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Last 30 Days</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-normal">12 Apr 2024 → 11 May 2024</span>
          </button>

          {dateRangeOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-30 divide-y divide-slate-100">
              {['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Range'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setHistoryDateRange(r);
                    setDateRangeOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-slate-50 hover:text-blue-600 rounded-lg"
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Dropdown */}
        <div className="relative">
          <select
            value={historyProductFilter}
            onChange={(e) => setHistoryProductFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-slate-700 font-medium text-xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option>All Products</option>
            <option>Men Black Round Neck T-Shirt</option>
            <option>Men White Round Neck T-Shirt</option>
            <option>Men Navy Blue Round Neck T-Shirt</option>
            <option>Men Black Polo T-Shirt</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <select
            value={historyCategoryFilter}
            onChange={(e) => setHistoryCategoryFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-slate-700 font-medium text-xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option>All Categories</option>
            <option>Men</option>
            <option>Women</option>
            <option>Kids</option>
            <option>Accessories</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Transaction Type Dropdown */}
        <div className="relative">
          <select
            value={historyTypeFilter}
            onChange={(e) => setHistoryTypeFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-slate-700 font-medium text-xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option>All Types</option>
            <option>Stock In</option>
            <option>Stock Out</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Reference Type Dropdown */}
        <div className="relative">
          <select
            value={historyRefTypeFilter}
            onChange={(e) => setHistoryRefTypeFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-slate-700 font-medium text-xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option>All Reference Types</option>
            <option>Purchase</option>
            <option>Order</option>
            <option>Stock Adjustment</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Clear All */}
        <button
          type="button"
          onClick={clearHistoryFilters}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline ml-auto cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {/* 5 Summary Metric Cards */}
      <StockHistoryKPICards />

      {/* Ledger Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">All Stock Transactions</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px] text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <th className="px-4 py-3.5">
                  <div className="inline-flex items-center gap-1 cursor-pointer">
                    <span>Date &amp; Time</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Product</th>
                <th className="px-4 py-3.5">SKU</th>
                <th className="px-4 py-3.5">Transaction Type</th>
                <th className="px-4 py-3.5">Reference Type</th>
                <th className="px-4 py-3.5">Reference No.</th>
                <th className="px-4 py-3.5">Quantity</th>
                <th className="px-4 py-3.5">Stock Before</th>
                <th className="px-4 py-3.5">Stock After</th>
                <th className="px-4 py-3.5">Notes</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-150 bg-white text-slate-700">
              {filteredTxs.map((tx) => {
                const isStockIn = tx.type === 'stock_in';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Date & Time with Circular arrow */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            isStockIn
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-rose-50 text-rose-600 border border-rose-200'
                          }`}
                        >
                          {isStockIn ? (
                            <ArrowUp className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="leading-tight">
                          <span className="font-semibold text-slate-800 block text-xs">
                            {tx.date.split(',')[0]}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {tx.date.split(',')[1]?.trim() || ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block">
                        {tx.productName}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Size: M • Color: Black
                      </span>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 font-medium">
                      {tx.sku}
                    </td>

                    {/* Transaction Type */}
                    <td className="px-4 py-3">
                      {isStockIn ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ArrowUp className="w-3 h-3" /> Stock In
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <ArrowDown className="w-3 h-3" /> Stock Out
                        </span>
                      )}
                    </td>

                    {/* Reference Type */}
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {tx.referenceType}
                    </td>

                    {/* Reference No */}
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600 font-medium">
                      {tx.referenceNo}
                    </td>

                    {/* Quantity */}
                    <td className="px-4 py-3 font-black tabular-nums text-xs">
                      <span className={isStockIn ? 'text-emerald-600' : 'text-rose-600'}>
                        {isStockIn ? `+${tx.quantity}` : `${tx.quantity}`}
                      </span>
                    </td>

                    {/* Stock Before */}
                    <td className="px-4 py-3 font-bold text-slate-700 tabular-nums">
                      {tx.stockBefore}
                    </td>

                    {/* Stock After */}
                    <td className="px-4 py-3 font-bold text-slate-900 tabular-nums">
                      {tx.stockAfter}
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-3 text-slate-500 text-[11px]">
                      {tx.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer with transaction count & pagination */}
        <div className="border-t border-slate-200/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-white text-xs">
          <div className="font-bold text-slate-900">
            Total {totalTransactions.toLocaleString()} transactions
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button
              type="button"
              disabled={historyCurrentPage === 1}
              onClick={() => setHistoryCurrentPage(1)}
              className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={historyCurrentPage === 1}
              onClick={() => setHistoryCurrentPage(Math.max(1, historyCurrentPage - 1))}
              className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setHistoryCurrentPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  historyCurrentPage === p
                    ? 'bg-[#1a56db] text-white shadow-xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}

            <span className="px-1 text-slate-400">...</span>

            <button
              type="button"
              onClick={() => setHistoryCurrentPage(59)}
              className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                historyCurrentPage === 59
                  ? 'bg-[#1a56db] text-white shadow-xs'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              59
            </button>

            <button
              type="button"
              disabled={historyCurrentPage === totalPages}
              onClick={() => setHistoryCurrentPage(Math.min(totalPages, historyCurrentPage + 1))}
              className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
