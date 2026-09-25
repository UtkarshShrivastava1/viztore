import React, { useState } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  RotateCcw,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Pencil,
  CheckSquare,
  Ban,
  Trash2,
} from 'lucide-react';
import {
  useReturnsStore,
  ReturnRecord,
  ReturnFilterTab,
} from '../../stores/returnsStore.js';

interface ReturnsTableProps {
  onViewReturn: (ret: ReturnRecord) => void;
  onEditReturn?: (ret: ReturnRecord) => void;
}

export const ReturnsTable: React.FC<ReturnsTableProps> = ({
  onViewReturn,
  onEditReturn,
}) => {
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
    approveReturn,
    markAsRefunded,
    initiateRefund,
    deleteReturn,
    setIsRejectModalOpen,
    setReturnToReject,
  } = useReturnsStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filterTabs: ReturnFilterTab[] = [
    'All Returns',
    'Pending',
    'Approved',
    'Refunded',
    'Rejected',
    'Exchange Requests',
  ];

  const filteredReturns = returns.filter((item) => {
    // Tab filter
    if (activeTab === 'Pending' && item.status !== 'Pending') return false;
    if (activeTab === 'Approved' && item.status !== 'Approved') return false;
    if (activeTab === 'Refunded' && item.status !== 'Refunded') return false;
    if (activeTab === 'Rejected' && item.status !== 'Rejected') return false;
    if (activeTab === 'Exchange Requests' && item.returnType !== 'Exchange') return false;

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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Approved
          </span>
        );
      case 'Exchange Initiated':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Exchange Initiated
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            Refunded
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const totalRefundSum = filteredReturns.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-visible">
      {/* Top Filter Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by order ID, return ID, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400"
          />
          <Search className="w-4 h-4 text-blue-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter Dropdowns & Clear */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Dropdown */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Status
            </span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[130px]"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Exchange Initiated">Exchange Initiated</option>
                <option value="Refunded">Refunded</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Return Type Dropdown */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Return Type
            </span>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[120px]"
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
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Date Range
            </span>
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[130px]"
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
          <div className="flex flex-col justify-end">
            <button
              onClick={clearFilters}
              className="mt-auto px-3.5 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/60 rounded-xl border border-blue-100 transition-colors flex items-center gap-1.5 h-[34px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
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

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[350px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
              <th className="py-3 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="Select all returns"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 h-4 w-4"
                />
              </th>
              <th className="py-3 px-3">Return ID</th>
              <th className="py-3 px-3">Order ID</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-3">Product</th>
              <th className="py-3 px-3">Return Type</th>
              <th className="py-3 px-3">Reason</th>
              <th className="py-3 px-3">Amount (₹)</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Return Date</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
            {filteredReturns.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-semibold text-slate-600">No returns found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try changing your search query or adjusting your filters.
                    </p>
                  </div>
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
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectReturn(ret.id)}
                        aria-label={`Select return ${ret.returnNumber}`}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 h-4 w-4"
                      />
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {ret.returnNumber}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600 whitespace-nowrap">
                      {ret.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-semibold text-slate-900">{ret.customer.name}</p>
                        <p className="text-[11px] text-slate-400">{ret.customer.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5 min-w-[200px]">
                        <img
                          src={ret.product.imageUrl}
                          alt={ret.product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                        />
                        <div className="truncate">
                          <p className="font-semibold text-slate-900 truncate">
                            {ret.product.name}
                          </p>
                          <p className="text-[11px] text-slate-400">{ret.product.variant}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      {ret.returnType}
                    </td>
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      {ret.reason}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      ₹ {ret.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getStatusBadge(ret.status)}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {ret.returnDate}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5 relative">
                        {/* View Button */}
                        <button
                          onClick={() => onViewReturn(ret)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        {/* More Action ⋮ Button */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveMenuId(isMenuOpen ? null : ret.id)
                            }
                            className={`p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors ${
                              isMenuOpen ? 'bg-slate-100' : ''
                            }`}
                            aria-label="More Actions"
                          >
                            <MoreVertical className="w-4 h-4 text-slate-600" />
                          </button>

                          {/* 8-Action Dropdown Menu (Matching 10.1.png) */}
                          {isMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveMenuId(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-left text-xs animate-in fade-in zoom-in-95 duration-100">
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onViewReturn(ret);
                                  }}
                                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-slate-500" />
                                  <span>View Details</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    if (onEditReturn) {
                                      onEditReturn(ret);
                                    } else {
                                      onViewReturn(ret);
                                    }
                                  }}
                                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <Pencil className="w-4 h-4 text-slate-500" />
                                  <span>Edit Return</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    approveReturn(ret.id);
                                  }}
                                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>Approve Return</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setReturnToReject(ret);
                                    setIsRejectModalOpen(true);
                                  }}
                                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <XCircle className="w-4 h-4 text-rose-500" />
                                  <span>Reject Return</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    initiateRefund(ret.id);
                                  }}
                                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <RotateCcw className="w-4 h-4 text-blue-600" />
                                  <span>Initiate Refund</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    markAsRefunded(ret.id);
                                  }}
                                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                                  <span>Mark as Refunded</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setReturnToReject(ret);
                                    setIsRejectModalOpen(true);
                                  }}
                                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <Ban className="w-4 h-4 text-slate-500" />
                                  <span>Cancel Return</span>
                                </button>

                                <div className="border-t border-slate-100 my-1" />

                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    if (
                                      window.confirm(
                                        `Are you sure you want to delete ${ret.returnNumber}?`
                                      )
                                    ) {
                                      deleteReturn(ret.id);
                                    }
                                  }}
                                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                                >
                                  <Trash2 className="w-4 h-4 text-rose-600" />
                                  <span>Delete Return</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Bar */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50 rounded-b-2xl">
        <span className="font-medium">
          Showing 1 to {filteredReturns.length} of {returns.length} returns
        </span>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600">Total Refund Amount:</span>
          <span className="text-base font-black text-slate-900">
            ₹ {totalRefundSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};
