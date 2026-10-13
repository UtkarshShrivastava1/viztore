import React, { useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  RotateCw,
  CheckCheck,
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
    orderStatusFilter,
    setOrderStatusFilter,
    fulfillmentTypeFilter,
    setFulfillmentTypeFilter,
    dateRange,
    setDateRange,
    packAllNewOrders,
    acceptAllNewOrders,
  } = useOrderStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const dateOptions = [
    '13 May 2024 - 19 May 2024',
    'Today',
    'Yesterday',
    'Last 7 Days',
    'This Month',
    'All Time',
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* Search & Filter Controls */}
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Search Input with Shortcut / Icon */}
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Customer or Product..."
            className="w-full pl-3.5 pr-9 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filters Button */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span>Filters</span>
        </button>

        {/* Payment Status Dropdown */}
        <div className="relative">
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-7 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-2xs cursor-pointer"
          >
            <option value="all">Payment Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Order Status Dropdown */}
        <div className="relative">
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-7 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-2xs cursor-pointer"
          >
            <option value="all">Order Status</option>
            <option value="new">New Order</option>
            <option value="accepted">Accepted</option>
            <option value="ready_to_ship">Ready to Ship</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Fulfillment Type Dropdown */}
        <div className="relative">
          <select
            value={fulfillmentTypeFilter}
            onChange={(e) => setFulfillmentTypeFilter(e.target.value)}
            className="appearance-none pl-3 pr-7 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-2xs cursor-pointer"
          >
            <option value="all">Fulfillment Type</option>
            <option value="delivery">Delivery</option>
            <option value="self_pickup">Self-Pickup</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Date Range Picker Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDateOpen(!isDateOpen)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
          </button>

          {isDateOpen && (
            <div className="absolute left-0 mt-1.5 w-56 rounded-xl bg-white border border-slate-200 shadow-lg py-1 z-30 animate-in fade-in-50 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Select Date Window
              </div>
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setDateRange(opt);
                    setIsDateOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors hover:bg-slate-50 ${
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
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs shrink-0 cursor-pointer"
          title="Refresh orders"
        >
          <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {/* Right Action: Accept All button matching 2.0.png */}
      {activeTab === 'new_orders' && (
        <button
          type="button"
          onClick={acceptAllNewOrders}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Accept All</span>
        </button>
      )}

      {/* Right Action: Ready to Ship All on Accepted Tab */}
      {activeTab === 'accepted' && (
        <button
          type="button"
          onClick={packAllNewOrders}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Ready to Ship All</span>
        </button>
      )}
    </div>
  );
};
