import React, { useState, useRef } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  RotateCcw,
  Eye,
  MoreVertical,
  MessageSquare,
} from 'lucide-react';
import {
  useReturnsStore,
  ReturnRecord,
  ReturnFilterTab,
} from '../../stores/returnsStore.js';
import { TableActionPopover } from '../ui/TableActionPopover.js';

interface ReturnsTableProps {
  onViewReturn: (ret: ReturnRecord) => void;
}

const ReturnRowActionMenu: React.FC<{
  ret: ReturnRecord;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onOpenRaiseModal: (ret: ReturnRecord) => void;
}> = ({ ret, isOpen, onToggle, onClose, onOpenRaiseModal }) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={onToggle}
        className={`p-1 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer ${
          isOpen ? 'bg-slate-100' : ''
        }`}
        aria-label="More Actions"
      >
        <MoreVertical className="w-3.5 h-3.5 text-slate-600" />
      </button>

      <TableActionPopover
        isOpen={isOpen}
        onClose={onClose}
        triggerRef={triggerRef}
        className="w-44 rounded-xl py-1.5 text-left text-xs shadow-xl"
      >
        <button
          onClick={() => {
            onClose();
            onOpenRaiseModal(ret);
          }}
          className="w-full px-3.5 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span className="font-semibold">Raise Request</span>
        </button>
      </TableActionPopover>
    </>
  );
};

export const ReturnsTable: React.FC<ReturnsTableProps> = ({ onViewReturn }) => {
  const {
    returns,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    dateRange,
    setDateRange,
    clearFilters,
    selectedReturnIds,
    toggleSelectReturn,
    selectAllReturns,
    deselectAllReturns,
    openRaiseModal,
  } = useReturnsStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filterTabs: ReturnFilterTab[] = [
    'All Returns',
    'Pending',
    'Approved',
    'Refunded',
    'Rejected',
  ];

  const filteredReturns = returns.filter((item) => {
    // Tab filter
    if (activeTab === 'Pending' && item.status !== 'Pending') return false;
    if (activeTab === 'Approved' && item.status !== 'Approved') return false;
    if (activeTab === 'Refunded' && item.status !== 'Refunded') return false;
    if (activeTab === 'Rejected' && item.status !== 'Rejected') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.returnNumber.toLowerCase().includes(q) ||
        item.orderNumber.toLowerCase().includes(q) ||
        item.customer.name.toLowerCase().includes(q) ||
        item.customer.email.toLowerCase().includes(q) ||
        item.product.name.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Status filter dropdown
    if (statusFilter !== 'All Statuses' && item.status !== statusFilter) {
      return false;
    }

    // Return Type filter dropdown
    if (typeFilter !== 'All Types' && item.returnType !== typeFilter) {
      return false;
    }

    return true;
  });

  const allSelected =
    filteredReturns.length > 0 &&
    filteredReturns.every((r) => selectedReturnIds.includes(r.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      selectAllReturns();
    } else {
      deselectAllReturns();
    }
  };

  const getStatusBadge = (status: ReturnRecord['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Approved
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Refunded
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const totalRefundSum = 18760;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-visible">
      {/* Top Filter Bar Matching 9.0.png */}
      <div className="p-3.5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by return ID, order ID, customer or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Filter Dropdowns & Clear */}
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
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Refunded">Refunded</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Return Type Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Return Type</span>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[110px]"
              >
                <option value="All Types">All Types</option>
                <option value="Return">Return</option>
                <option value="Exchange">Exchange</option>
                <option value="Refund Only">Refund Only</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Date Range Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Date Range</span>
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[125px]"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="All Time">All Time</option>
              </select>
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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

      {/* 5 Status Filter Tabs Matching 9.0.png */}
      <div className="px-4 border-b border-slate-100 flex items-center gap-6 overflow-x-auto">
        {filterTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-xs font-semibold tracking-tight border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Main Table - High Density, Zero Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px]">
              <th className="py-2.5 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="Select all returns"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 h-3.5 w-3.5"
                />
              </th>
              <th className="py-2.5 px-2">Return ID</th>
              <th className="py-2.5 px-2">Order ID</th>
              <th className="py-2.5 px-2.5">Customer</th>
              <th className="py-2.5 px-2.5">Product</th>
              <th className="py-2.5 px-2">Return Type</th>
              <th className="py-2.5 px-2.5">Reason</th>
              <th className="py-2.5 px-2">Amount (₹)</th>
              <th className="py-2.5 px-2">Status</th>
              <th className="py-2.5 px-2.5">Return Date</th>
              <th className="py-2.5 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredReturns.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400">
                  <p className="text-sm font-semibold text-slate-600">No returns found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try changing your search query or adjusting your filters.
                  </p>
                </td>
              </tr>
            ) : (
              filteredReturns.map((ret) => {
                const isSelected = selectedReturnIds.includes(ret.id);
                const isMenuOpen = activeMenuId === ret.id;

                return (
                  <tr
                    key={ret.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isSelected ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectReturn(ret.id)}
                        aria-label={`Select return ${ret.returnNumber}`}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 h-3.5 w-3.5"
                      />
                    </td>
                    <td className="py-2 px-2 font-bold text-slate-900 whitespace-nowrap">
                      {ret.returnNumber}
                    </td>
                    <td className="py-2 px-2 font-medium text-slate-600 whitespace-nowrap">
                      {ret.orderNumber}
                    </td>
                    <td className="py-2 px-2.5">
                      <div className="leading-tight">
                        <p className="font-semibold text-slate-900">{ret.customer.name}</p>
                        <p className="text-[10px] text-slate-400">{ret.customer.email}</p>
                      </div>
                    </td>
                    <td className="py-2 px-2.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={ret.product.imageUrl}
                          alt={ret.product.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                        />
                        <div className="leading-tight truncate max-w-[150px]">
                          <p className="font-semibold text-slate-900 truncate" title={ret.product.name}>
                            {ret.product.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{ret.product.variant}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-slate-700 whitespace-nowrap">
                      {ret.returnType}
                    </td>
                    <td className="py-2 px-2.5 text-slate-700 whitespace-nowrap">
                      {ret.reason}
                    </td>
                    <td className="py-2 px-2 font-bold text-slate-900 whitespace-nowrap">
                      ₹ {ret.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-2 whitespace-nowrap">
                      {getStatusBadge(ret.status)}
                    </td>
                    <td className="py-2 px-2.5 text-slate-500 whitespace-nowrap leading-tight">
                      <p className="font-medium text-slate-700">{ret.returnDate}</p>
                      <p className="text-[10px] text-slate-400">{ret.returnTime || '10:30 AM'}</p>
                    </td>
                    <td className="py-2 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5 relative">
                        {/* View Button */}
                        <button
                          onClick={() => onViewReturn(ret)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        {/* More Action ⋮ Popover Menu */}
                        <ReturnRowActionMenu
                          ret={ret}
                          isOpen={isMenuOpen}
                          onToggle={() => setActiveMenuId(isMenuOpen ? null : ret.id)}
                          onClose={() => setActiveMenuId(null)}
                          onOpenRaiseModal={openRaiseModal}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer matching 9.0.png */}
      <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing 1 to {filteredReturns.length} of {filteredReturns.length} returns
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Total Refund Amount</span>
          <span className="text-base font-black text-slate-900 tracking-tight">
            ₹ {totalRefundSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};
