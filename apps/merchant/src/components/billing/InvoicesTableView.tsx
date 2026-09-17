import React, { useState, useMemo } from 'react';
import {
  FileText,
  ShoppingBag,
  CreditCard,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Printer,
  ChevronDown,
  ArrowUpDown,
  ChevronsUpDown,
} from 'lucide-react';
import { useBillingStore, IInvoice, InvoiceStatus } from '../../stores/billingStore.js';
import { InvoiceRowActionMenu } from './InvoiceRowActionMenu.js';

export const InvoicesTableView: React.FC = () => {
  const {
    invoices,
    invoiceSearchQuery,
    setInvoiceSearchQuery,
    invoiceDateRange,
    setInvoiceDateRange,
    invoiceTypeFilter,
    setInvoiceTypeFilter,
    invoiceStatusFilter,
    setInvoiceStatusFilter,
    invoicePaymentFilter,
    setInvoicePaymentFilter,
    invoiceCurrentTab,
    setInvoiceCurrentTab,
    clearInvoiceFilters,
  } = useBillingStore();

  const [activeMenuInvoiceId, setActiveMenuInvoiceId] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // 5 KPI metrics matching 5.0.png
  const kpiCards = [
    {
      id: 'total-invoices',
      title: 'Total Invoices',
      value: '1,248',
      change: '18%',
      isPositive: true,
      icon: FileText,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
    },
    {
      id: 'total-sales',
      title: 'Total Sales',
      value: '₹12,84,560',
      change: '22%',
      isPositive: true,
      icon: ShoppingBag,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
    },
    {
      id: 'paid-amount',
      title: 'Paid Amount',
      value: '₹9,85,420',
      change: '16%',
      isPositive: true,
      icon: CreditCard,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      id: 'outstanding-amount',
      title: 'Outstanding Amount',
      value: '₹2,99,140',
      change: '8%',
      isPositive: false,
      icon: Clock,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
    {
      id: 'overdue-amount',
      title: 'Overdue Amount',
      value: '₹75,230',
      change: '12%',
      isPositive: false,
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
    },
  ];

  const statusTabs = [
    'All Invoices',
    'Draft',
    'Issued',
    'Paid',
    'Partially Paid',
    'Overdue',
    'Cancelled',
  ];

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // Tab filter
      if (invoiceCurrentTab !== 'All Invoices') {
        const tabKey = invoiceCurrentTab.toLowerCase().replace(' ', '_');
        if (inv.status !== tabKey) return false;
      }

      // Search query
      if (invoiceSearchQuery.trim()) {
        const q = invoiceSearchQuery.toLowerCase();
        const matchNo = inv.invoiceNo.toLowerCase().includes(q);
        const matchCustomer = inv.customerName.toLowerCase().includes(q);
        const matchPhone = inv.customerPhone.includes(q);
        if (!matchNo && !matchCustomer && !matchPhone) return false;
      }

      // Status dropdown
      if (invoiceStatusFilter !== 'All Statuses') {
        const sKey = invoiceStatusFilter.toLowerCase().replace(' ', '_');
        if (inv.status !== sKey) return false;
      }

      // Type dropdown
      if (invoiceTypeFilter !== 'All Types') {
        if (inv.type !== invoiceTypeFilter) return false;
      }

      // Payment Status dropdown
      if (invoicePaymentFilter !== 'All') {
        if (invoicePaymentFilter === 'Paid' && inv.status !== 'paid') return false;
        if (invoicePaymentFilter === 'Unpaid' && inv.paidAmount > 0) return false;
        if (invoicePaymentFilter === 'Partial' && inv.status !== 'partially_paid') return false;
      }

      return true;
    });
  }, [
    invoices,
    invoiceCurrentTab,
    invoiceSearchQuery,
    invoiceStatusFilter,
    invoiceTypeFilter,
    invoicePaymentFilter,
  ]);

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            Paid
          </span>
        );
      case 'partially_paid':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            Partially Paid
          </span>
        );
      case 'overdue':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200">
            Overdue
          </span>
        );
      case 'issued':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            Issued
          </span>
        );
      case 'draft':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            Draft
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-500 border border-slate-200 line-through">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">{card.title}</span>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                  {card.value}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs">
                  {card.isPositive ? (
                    <span className="font-semibold text-emerald-600 flex items-center">
                      &uarr; {card.change}
                    </span>
                  ) : (
                    <span className="font-semibold text-rose-600 flex items-center">
                      &darr; {card.change}
                    </span>
                  )}
                  <span className="text-slate-400 font-normal">from last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar & Dropdowns (5.0.png) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search with Ctrl + K */}
          <div className="flex-1 min-w-[260px] relative">
            <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={invoiceSearchQuery}
              onChange={(e) => setInvoiceSearchQuery(e.target.value)}
              placeholder="Search by invoice no., customer name, or phone..."
              className="w-full pl-9 pr-20 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shadow-3xs">
              Ctrl + K
            </kbd>
          </div>

          {/* Date Range Dropdown */}
          <div className="flex items-center gap-2">
            <div className="text-left">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Date Range
              </span>
              <select
                value={invoiceDateRange}
                onChange={(e) => setInvoiceDateRange(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Custom Range">Custom Range</option>
              </select>
            </div>
          </div>

          {/* Invoice Type Dropdown */}
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Invoice Type
            </span>
            <select
              value={invoiceTypeFilter}
              onChange={(e) => setInvoiceTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All Types">All Types</option>
              <option value="Tax Invoice">Tax Invoice</option>
              <option value="Bill of Supply">Bill of Supply</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Status
            </span>
            <select
              value={invoiceStatusFilter}
              onChange={(e) => setInvoiceStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Issued">Issued</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Payment Status Dropdown */}
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Payment Status
            </span>
            <select
              value={invoicePaymentFilter}
              onChange={(e) => setInvoicePaymentFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          {/* Filter & Clear Actions */}
          <div className="flex items-center gap-2 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={() => alert('Custom filter panel opened')}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-3xs"
            >
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              Filters
            </button>
            <button
              type="button"
              onClick={clearInvoiceFilters}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* 7 Status Tabs */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive = invoiceCurrentTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setInvoiceCurrentTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600 rounded-b-none bg-blue-50/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Invoices Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Invoice No.</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Paid Amount</th>
                <th className="py-3 px-4 text-right">Due Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No invoices match your selected filters.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 px-4">
                      <span className="font-bold text-blue-600 hover:underline cursor-pointer">
                        {inv.invoiceNo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {inv.date}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">
                          {inv.customerName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {inv.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        {inv.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                      ₹{inv.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-700 tabular-nums">
                      ₹{inv.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-700 tabular-nums">
                      ₹{inv.dueAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">{getStatusBadge(inv.status)}</td>
                    <td className="py-3 px-4 text-center relative">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              `Previewing Invoice ${inv.invoiceNo} for ${inv.customerName}`
                            )
                          }
                          className="px-2 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="px-2 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Print"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print</span>
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuInvoiceId(
                                activeMenuInvoiceId === inv.id ? null : inv.id
                              )
                            }
                            className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-0.5 transition-colors"
                          >
                            <span>More</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          </button>

                          {/* 10-Action Dropdown Menu (5.1.png) */}
                          <InvoiceRowActionMenu
                            invoice={inv}
                            isOpen={activeMenuInvoiceId === inv.id}
                            onClose={() => setActiveMenuInvoiceId(null)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing 1 to {Math.min(filteredInvoices.length, 8)} of {invoices.length} invoices
          </span>
          <button
            type="button"
            className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            Scroll to load more invoices &darr;
          </button>
        </div>
      </div>
    </div>
  );
};
