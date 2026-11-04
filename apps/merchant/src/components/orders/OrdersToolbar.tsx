import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Calendar,
  RotateCw,
  CheckCheck,
  LayoutList,
  Columns3,
  X,
} from 'lucide-react';
import { OrderTab, useOrderStore } from '../../stores/orderStore.js';

interface OrdersToolbarProps {
  activeTab: OrderTab;
}

export const OrdersToolbar: React.FC<OrdersToolbarProps> = ({ activeTab }) => {
  const {
    searchQuery,
    setSearchQuery,
    paymentStatusFilter,
    setPaymentStatusFilter,
    fulfillmentTypeFilter,
    setFulfillmentTypeFilter,
    dateRange,
    setDateRange,
    viewMode,
    setViewMode,
    packAllNewOrders,
    acceptAllNewOrders,
    fetchOrders,
  } = useOrderStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const dateOptions = [
    'Today',
    'Yesterday',
    'Last 7 Days',
    'This Month',
    'Last 30 Days',
    'All Time',
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
      {/* Left: Search Bar & Filters */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* Search Input with Clear Button */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order #, customer or product..."
            className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="hidden sm:block h-5 w-px bg-slate-200" />

        {/* Filter: Payment Status */}
        <div className="relative">
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-7 py-2 rounded-xl bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs cursor-pointer"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid (Online / Prepaid)</option>
            <option value="pending">Pending (COD)</option>
            <option value="refunded">Refunded</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter: Channel */}
        <div className="relative">
          <select
            value={fulfillmentTypeFilter}
            onChange={(e) => setFulfillmentTypeFilter(e.target.value)}
            className="appearance-none pl-3 pr-7 py-2 rounded-xl bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs cursor-pointer"
          >
            <option value="all">All Channels</option>
            <option value="online">Online Delivery</option>
            <option value="instore">In-Store / Hold</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter: Date Window */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDateOpen(!isDateOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50/60 hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {isDateOpen && (
            <div className="absolute left-0 mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-30 animate-in fade-in-50 zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Date Window
              </div>
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setDateRange(opt);
                    setIsDateOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors hover:bg-slate-50 cursor-pointer ${
                    dateRange === opt ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Refresh Icon */}
        <button
          type="button"
          onClick={handleRefresh}
          className="p-2 rounded-xl bg-slate-50/60 hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs shrink-0 cursor-pointer"
          title="Refresh live orders"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {/* Right: Actions & View Switcher */}
      <div className="flex items-center gap-2.5 shrink-0 self-end xl:self-auto">
        {/* Tab-Specific Batch CTA */}
        {activeTab === 'new_orders' && (
          <button
            type="button"
            onClick={acceptAllNewOrders}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Accept All</span>
          </button>
        )}

        {activeTab === 'accepted' && (
          <button
            type="button"
            onClick={packAllNewOrders}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Ready to Ship All</span>
          </button>
        )}

        {/* View Switcher: Table vs Pipeline Kanban */}
        <div className="bg-slate-100/90 p-1 rounded-xl flex items-center border border-slate-200/70 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Compact Table View"
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Visual Pipeline Kanban Board"
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>Pipeline Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};
