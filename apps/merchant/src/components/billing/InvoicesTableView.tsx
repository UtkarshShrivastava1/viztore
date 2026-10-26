import React, { useState, useMemo, useRef } from 'react';
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
  RefreshCw,
  X,
  CheckCircle,
  Zap,
  Plus,
} from 'lucide-react';
import { useBillingStore, IInvoice, InvoiceStatus } from '../../stores/billingStore.js';
import { InvoiceRowActionMenu } from './InvoiceRowActionMenu.js';
import { PrintReceiptModal } from './PrintReceiptModal.js';

const InvoiceRowMoreAction: React.FC<{
  invoice: IInvoice;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onPrintThermal: (invoice: IInvoice) => void;
  onPrintA4: (invoice: IInvoice) => void;
  onRecordPayment: (invoice: IInvoice) => void;
  onViewPayments: (invoice: IInvoice) => void;
  onViewNotes: (invoice: IInvoice) => void;
  onAdjustInvoice: (invoice: IInvoice) => void;
  onCancelInvoice: (invoice: IInvoice) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}> = ({
  invoice,
  isOpen,
  onToggle,
  onClose,
  onPrintThermal,
  onPrintA4,
  onRecordPayment,
  onViewPayments,
  onViewNotes,
  onAdjustInvoice,
  onCancelInvoice,
  onShowToast,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-0.5 transition-colors cursor-pointer ${
          isOpen ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <span>More</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
      </button>
      <InvoiceRowActionMenu
        invoice={invoice}
        isOpen={isOpen}
        onClose={onClose}
        triggerRef={triggerRef}
        onPrintThermal={onPrintThermal}
        onPrintA4={onPrintA4}
        onRecordPayment={onRecordPayment}
        onViewPayments={onViewPayments}
        onViewNotes={onViewNotes}
        onAdjustInvoice={onAdjustInvoice}
        onCancelInvoice={onCancelInvoice}
        onShowToast={onShowToast}
      />
    </>
  );
};

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
    fetchInvoices,
    isLoadingInvoices,
    recordPayment,
    cancelInvoice,
    setActiveView,
    openCreateInvoiceModal,
  } = useBillingStore();

  const [activeMenuInvoiceId, setActiveMenuInvoiceId] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [printModalInvoice, setPrintModalInvoice] = useState<IInvoice | null>(null);
  const [printModalMode, setPrintModalMode] = useState<'thermal-80mm' | 'a4-tax-invoice'>('thermal-80mm');

  // Modal and toast state
  const [recordPaymentInvoice, setRecordPaymentInvoice] = useState<IInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'upi' | 'cash' | 'card' | 'bank_transfer'>('upi');
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  const [viewPaymentsInvoice, setViewPaymentsInvoice] = useState<IInvoice | null>(null);
  const [viewNotesInvoice, setViewNotesInvoice] = useState<IInvoice | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>('');

  const [cancelInvoiceTarget, setCancelInvoiceTarget] = useState<IInvoice | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Customer returned goods / Counter mistake');

  const [toastNotification, setToastNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  React.useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => setToastNotification(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  // Dynamic KPI calculations derived purely from live invoices array
  const { totalSales, paidTotal, outstandingTotal, overdueTotal } = useMemo(() => {
    let sales = 0;
    let paid = 0;
    let outstanding = 0;
    let overdue = 0;
    invoices.forEach((inv) => {
      sales += inv.totalAmount || 0;
      paid += inv.paidAmount || 0;
      outstanding += inv.dueAmount || 0;
      if (inv.status === 'overdue') {
        overdue += inv.dueAmount || 0;
      }
    });
    return {
      totalSales: sales,
      paidTotal: paid,
      outstandingTotal: outstanding,
      overdueTotal: overdue,
    };
  }, [invoices]);

  const kpiCards = [
    {
      id: 'total-invoices',
      title: 'Total Invoices',
      value: invoices.length.toLocaleString('en-IN'),
      change: invoices.length > 0 ? '+100%' : '0%',
      isPositive: invoices.length > 0,
      icon: FileText,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
    },
    {
      id: 'total-sales',
      title: 'Total Sales',
      value: `₹${totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      change: totalSales > 0 ? '+100%' : '0%',
      isPositive: totalSales > 0,
      icon: ShoppingBag,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
    },
    {
      id: 'paid-amount',
      title: 'Paid Amount',
      value: `₹${paidTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      change: paidTotal > 0 ? '+100%' : '0%',
      isPositive: paidTotal > 0,
      icon: CreditCard,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      id: 'outstanding-amount',
      title: 'Outstanding Amount',
      value: `₹${outstandingTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      change: outstandingTotal > 0 ? 'Active' : '0%',
      isPositive: outstandingTotal === 0,
      icon: Clock,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
    {
      id: 'overdue-amount',
      title: 'Overdue Amount',
      value: `₹${overdueTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      change: overdueTotal > 0 ? 'Requires Action' : 'None',
      isPositive: overdueTotal === 0,
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
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-150 ${
            toastNotification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : toastNotification.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastNotification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-slate-700 ml-4 font-bold text-sm"
          >
            ✕
          </button>
        </div>
      )}

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
              onClick={() => fetchInvoices()}
              disabled={isLoadingInvoices}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-3xs disabled:opacity-50"
              title="Refresh invoices from server"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isLoadingInvoices ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={clearInvoiceFilters}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Direct POS and Invoice Creation Shortcut Actions */}
          <div className="flex items-center gap-2 pt-3 sm:pt-4 ml-auto">
            <button
              type="button"
              onClick={() => setActiveView('pos_counter')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-emerald-200" />
              <span>Counter POS</span>
            </button>
            <button
              type="button"
              onClick={() => openCreateInvoiceModal()}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Invoice</span>
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
                  <td colSpan={9} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-10 h-10 text-slate-300 stroke-1" />
                      <p className="text-sm font-semibold text-slate-700">No invoices yet</p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        Create your first counter sale bill or tax invoice to begin tracking retail payments and inventory.
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          type="button"
                          onClick={() => setActiveView('pos_counter')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current text-emerald-200" />
                          <span>Launch Counter POS</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openCreateInvoiceModal()}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Create Invoice</span>
                        </button>
                      </div>
                    </div>
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
                          onClick={() => {
                            setPrintModalInvoice(inv);
                            setPrintModalMode('a4-tax-invoice');
                          }}
                          className="px-2 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="View Tax Invoice"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPrintModalInvoice(inv);
                            setPrintModalMode('thermal-80mm');
                          }}
                          className="px-2 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Print Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print</span>
                        </button>

                        <InvoiceRowMoreAction
                          invoice={inv}
                          isOpen={activeMenuInvoiceId === inv.id}
                          onToggle={() =>
                            setActiveMenuInvoiceId(activeMenuInvoiceId === inv.id ? null : inv.id)
                          }
                          onClose={() => setActiveMenuInvoiceId(null)}
                          onPrintThermal={(invoice) => {
                            setPrintModalInvoice(invoice);
                            setPrintModalMode('thermal-80mm');
                          }}
                          onPrintA4={(invoice) => {
                            setPrintModalInvoice(invoice);
                            setPrintModalMode('a4-tax-invoice');
                          }}
                          onRecordPayment={(invoice) => {
                            setRecordPaymentInvoice(invoice);
                            setPaymentAmount(invoice.dueAmount);
                            setPaymentMode((invoice.settlementMode as any) || 'upi');
                            setPaymentNotes('');
                          }}
                          onViewPayments={(invoice) => setViewPaymentsInvoice(invoice)}
                          onViewNotes={(invoice) => {
                            setViewNotesInvoice(invoice);
                            setNotesDraft(invoice.notes || '');
                          }}
                          onAdjustInvoice={(invoice) => {
                            setToastNotification({
                              message: `Credit/Debit adjustment note initiated for ${invoice.invoiceNo}`,
                              type: 'info',
                            });
                          }}
                          onCancelInvoice={(invoice) => {
                            setCancelInvoiceTarget(invoice);
                            setCancelReason('Customer returned goods / Counter mistake');
                          }}
                          onShowToast={(message, type) =>
                            setToastNotification({ message, type: type || 'info' })
                          }
                        />
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

      {/* Printable Receipt & Tax Invoice Modal */}
      <PrintReceiptModal
        isOpen={Boolean(printModalInvoice)}
        onClose={() => setPrintModalInvoice(null)}
        invoice={printModalInvoice}
        defaultMode={printModalMode}
      />

      {/* 1. Record Payment Modal */}
      {recordPaymentInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Record Payment — {recordPaymentInvoice.invoiceNo}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {recordPaymentInvoice.customerName} ({recordPaymentInvoice.customerPhone || 'Counter Walk-in'})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRecordPaymentInvoice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Bill</span>
                  <span className="font-bold text-slate-800 text-sm">₹{recordPaymentInvoice.totalAmount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Paid</span>
                  <span className="font-bold text-emerald-600 text-sm">₹{recordPaymentInvoice.paidAmount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Balance Due</span>
                  <span className="font-bold text-rose-600 text-sm">₹{recordPaymentInvoice.dueAmount.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Mode</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['upi', 'cash', 'card', 'bank_transfer'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                        paymentMode === mode
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {mode === 'bank_transfer' ? 'Bank' : mode.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Amount Received (₹)</label>
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(recordPaymentInvoice.dueAmount)}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    Set Full Due (₹{recordPaymentInvoice.dueAmount.toFixed(2)})
                  </button>
                </div>
                <input
                  type="number"
                  min="1"
                  max={recordPaymentInvoice.dueAmount}
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Transaction Reference</label>
                <input
                  type="text"
                  placeholder="e.g. UPI Ref / Cash register counter / Cheque #"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRecordPaymentInvoice(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={paymentAmount <= 0}
                onClick={() => {
                  recordPayment(recordPaymentInvoice.id, paymentAmount, paymentMode);
                  setToastNotification({
                    message: `Payment of ₹${paymentAmount.toFixed(2)} (${paymentMode.toUpperCase()}) recorded for ${recordPaymentInvoice.invoiceNo}`,
                    type: 'success',
                  });
                  setRecordPaymentInvoice(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors shadow-xs"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. View Payments Modal */}
      {viewPaymentsInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Payment History — {viewPaymentsInvoice.invoiceNo}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{viewPaymentsInvoice.customerName}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewPaymentsInvoice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Mode</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{viewPaymentsInvoice.date}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 uppercase">
                        {viewPaymentsInvoice.settlementMode || 'CASH'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                        ₹{viewPaymentsInvoice.paidAmount.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          SUCCESS
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Balance Due on this Invoice:</span>
                <span className="font-bold text-rose-600 text-sm">₹{viewPaymentsInvoice.dueAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setViewPaymentsInvoice(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. View Notes Modal */}
      {viewNotesInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Notes & Remarks — {viewNotesInvoice.invoiceNo}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{viewNotesInvoice.customerName}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewNotesInvoice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs">
              <label className="block font-semibold text-slate-700">Internal Remarks / Terms:</label>
              <textarea
                rows={4}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Add special instructions, warranty terms, or customer remarks..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewNotesInvoice(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  viewNotesInvoice.notes = notesDraft;
                  setToastNotification({
                    message: `Notes updated for ${viewNotesInvoice.invoiceNo}`,
                    type: 'success',
                  });
                  setViewNotesInvoice(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Cancel Invoice Confirmation Modal */}
      {cancelInvoiceTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between bg-rose-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-rose-900">
                    Cancel Invoice {cancelInvoiceTarget.invoiceNo}
                  </h3>
                  <p className="text-xs text-rose-600 mt-0.5">This action cannot be undone.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCancelInvoiceTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-rose-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                <p className="font-semibold mb-1">Automatic Inventory Restock:</p>
                <p>
                  All {cancelInvoiceTarget.items.length} items billed in this invoice will be automatically restocked
                  into your active live inventory ledger.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Cancellation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason for audit record..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCancelInvoiceTarget(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={async () => {
                  const target = cancelInvoiceTarget;
                  setCancelInvoiceTarget(null);
                  await cancelInvoice(target.id, cancelReason);
                  setToastNotification({
                    message: `Invoice ${target.invoiceNo} cancelled. Line items restocked back to inventory.`,
                    type: 'success',
                  });
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
