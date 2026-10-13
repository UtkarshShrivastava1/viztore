import React, { useState, useRef } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  RotateCcw,
  Eye,
  MoreVertical,
  ArrowUpDown,
  Download,
  Upload,
  Copy,
  CheckCircle,
  FileText,
  Truck,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import {
  useExpenseStore,
  PurchaseSubTab,
  PurchaseTransaction,
  PurchaseBill,
} from '../../stores/expenseStore.js';
import { TableActionPopover } from '../ui/TableActionPopover.js';
import { downloadCSV } from '../../utils/csvExport.js';

interface ExpensesTableProps {
  onViewDetails: (item: any) => void;
  onEditItem: (item: any) => void;
  onCreateCreditNote: (item: any) => void;
  onGenerateEWayBill: (item: any) => void;
}

const ExpenseRowActionMenu: React.FC<{
  item: any;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onViewDetails: (item: any) => void;
  onEditItem: (item: any) => void;
  onCreateCreditNote: (item: any) => void;
  onGenerateEWayBill: (item: any) => void;
}> = ({
  item,
  isOpen,
  onToggle,
  onClose,
  onViewDetails,
  onEditItem,
  onCreateCreditNote,
  onGenerateEWayBill,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => onViewDetails(item)}
          className="px-2 py-0.5 rounded border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600 text-[10px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Eye className="w-3 h-3" />
          <span>View</span>
        </button>
        <button
          ref={triggerRef}
          type="button"
          onClick={onToggle}
          className={`p-1 rounded transition-colors cursor-pointer ${
            isOpen ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}
          title="More actions"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      <TableActionPopover
        isOpen={isOpen}
        onClose={onClose}
        triggerRef={triggerRef}
        className="w-48 rounded-xl py-1 text-left"
      >
        <button
          type="button"
          onClick={() => {
            onClose();
            onViewDetails(item);
          }}
          className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>View Details</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onEditItem(item);
          }}
          className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Edit</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            alert('Entry duplicated successfully.');
          }}
          className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5 text-slate-400" />
          <span>Duplicate</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            alert('Marked as Paid.');
          }}
          className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
        >
          <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Mark as Paid</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            alert('Downloading invoice PDF...');
          }}
          className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Download Invoice</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onGenerateEWayBill(item);
          }}
          className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
        >
          <Truck className="w-3.5 h-3.5 text-slate-400" />
          <span>Generate E-Way Bill</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onCreateCreditNote(item);
          }}
          className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Create Credit Note</span>
        </button>

        <div className="border-t border-slate-100 my-1" />

        <button
          type="button"
          onClick={() => {
            onClose();
            if (confirm('Are you sure you want to delete this record?')) {
              alert('Record deleted.');
            }
          }}
          className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </TableActionPopover>
    </>
  );
};

export const ExpensesTable: React.FC<ExpensesTableProps> = ({
  onViewDetails,
  onEditItem,
  onCreateCreditNote,
  onGenerateEWayBill,
}) => {
  const {
    activeSubTab,
    setActiveSubTab,
    allTransactions,
    purchaseOrders,
    purchaseBills,
    expenses,
    creditNotes,
    ewayBills,
    vendors,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    vendorFilter,
    setVendorFilter,
    clearFilters,
  } = useExpenseStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Tabs list matching mockup 8.0.png
  const tabs: { id: PurchaseSubTab; label: string }[] = [
    { id: 'all', label: 'All Transactions' },
    { id: 'orders', label: 'Purchase Orders' },
    { id: 'bills', label: 'Purchases (Bills)' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'credit_notes', label: 'Credit Notes' },
    { id: 'eway_bills', label: 'E-Way Bills' },
    { id: 'vendors', label: 'Vendors' },
  ];

  const handleSelectAll = (checked: boolean, count: number, ids: string[]) => {
    if (checked) {
      setSelectedIds(ids);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Universal CSV Export Handler
  const handleExportExpensesCSV = () => {
    setIsDownloadOpen(false);
    if (activeSubTab === 'all') {
      downloadCSV(
        `transactions_${new Date().toISOString().slice(0, 10)}.csv`,
        ['Date', 'Time', 'Reference No', 'Type', 'Vendor / Paid To', 'Category', 'Amount', 'Status'],
        allTransactions.map((t) => [t.date, t.time, t.referenceNo, t.type, t.vendorOrPaidTo, t.category, t.amount, t.status])
      );
    } else if (activeSubTab === 'orders') {
      downloadCSV(
        `purchase_orders_${new Date().toISOString().slice(0, 10)}.csv`,
        ['PO Number', 'Date', 'Vendor', 'Items Count', 'Total Amount', 'Expected Date', 'Status'],
        purchaseOrders.map((p) => [p.poNumber, p.date, p.vendor, p.itemsCount, p.totalAmount, p.expectedDate, p.status])
      );
    } else if (activeSubTab === 'bills') {
      downloadCSV(
        `purchase_bills_${new Date().toISOString().slice(0, 10)}.csv`,
        ['Bill Number', 'Date', 'Vendor', 'Items Count', 'Total Amount', 'Payment Status', 'Due Date'],
        purchaseBills.map((b) => [b.billNumber, b.date, b.vendor, b.itemsCount, b.totalAmount, b.paymentStatus, b.dueDate])
      );
    } else if (activeSubTab === 'expenses') {
      downloadCSV(
        `expenses_${new Date().toISOString().slice(0, 10)}.csv`,
        ['Expense No', 'Date', 'Category', 'Description', 'Amount', 'Payment Method', 'Status'],
        expenses.map((e) => [e.expenseNo, e.date, e.category, e.description, e.amount, e.paymentMethod, e.status])
      );
    } else if (activeSubTab === 'credit_notes') {
      downloadCSV(
        `credit_notes_${new Date().toISOString().slice(0, 10)}.csv`,
        ['Credit Note No', 'Date', 'Reference Purchase', 'Vendor', 'Reason Type', 'Amount', 'Status'],
        creditNotes.map((c) => [c.creditNoteNo, c.date, c.referencePurchase, c.vendor, c.reasonType, c.amount, c.status])
      );
    } else if (activeSubTab === 'eway_bills') {
      downloadCSV(
        `eway_bills_${new Date().toISOString().slice(0, 10)}.csv`,
        ['E-Way Bill No', 'Date', 'Invoice/Bill No', 'Vendor', 'From / To', 'Distance (km)', 'Valid Till', 'Status'],
        ewayBills.map((w) => [w.eWayBillNo, w.date, w.invoiceBillNo, w.vendor, w.fromTo, w.distanceKm, w.validTill, w.status])
      );
    } else if (activeSubTab === 'vendors') {
      downloadCSV(
        `vendors_${new Date().toISOString().slice(0, 10)}.csv`,
        ['Vendor ID', 'Code', 'Vendor Name', 'Contact Person', 'Phone', 'Email', 'City', 'Total Purchases', 'Status'],
        vendors.map((v) => [v.id, v.vendorCode, v.vendorName, v.contactPerson, v.phone, v.email, v.city, v.totalPurchases, v.status])
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* 1. Sub-Tab Strip matching mockup 8.0.png */}
      <div className="px-5 pt-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveSubTab(tab.id);
                setSelectedIds([]);
              }}
              className={`pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Right Action (Download Report / Import PO) */}
        <div className="relative pb-2 sm:pb-0">
          {activeSubTab === 'orders' ? (
            <button
              type="button"
              onClick={() => alert('Import purchase orders via CSV/Excel...')}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import Purchase Orders</span>
            </button>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Report</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isDownloadOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDownloadOpen(false);
                      alert('Generating PDF Report...');
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-rose-500" />
                    <span>PDF Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportExpensesCSV}
                    className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Excel / CSV</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Filters Bar matching mockup 8.0.png */}
      <div className="p-3.5 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-end">
        {/* Search Input */}
        <div className="lg:col-span-4 relative">
          <input
            type="text"
            placeholder={
              activeSubTab === 'orders'
                ? 'Search by PO no., vendor, item or notes...'
                : activeSubTab === 'bills'
                ? 'Search by bill no., vendor, item or notes...'
                : activeSubTab === 'expenses'
                ? 'Search by expense no., category, vendor or notes...'
                : activeSubTab === 'credit_notes'
                ? 'Search by credit note no., vendor, reference or notes...'
                : activeSubTab === 'eway_bills'
                ? 'Search by e-way bill no., invoice no., vendor or notes...'
                : activeSubTab === 'vendors'
                ? 'Search by vendor name, code, GSTIN, phone or email...'
                : 'Search by invoice no., vendor, item, category or notes...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Date Range */}
        {activeSubTab !== 'vendors' && (
          <div className="lg:col-span-2">
            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Date Range</label>
            <div className="relative">
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full pl-6 pr-6 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer truncate"
              />
              <Calendar className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Type / Vendor Dropdown */}
        <div className="lg:col-span-2">
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">
            {activeSubTab === 'all'
              ? 'Type'
              : activeSubTab === 'vendors'
              ? 'City'
              : 'Vendor'}
          </label>
          <div className="relative">
            <select
              value={activeSubTab === 'all' ? typeFilter : vendorFilter}
              onChange={(e) =>
                activeSubTab === 'all'
                  ? setTypeFilter(e.target.value)
                  : setVendorFilter(e.target.value)
              }
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
            >
              <option value="All Types">
                {activeSubTab === 'all' ? 'All Types' : 'All Vendors'}
              </option>
              <option value="Purchase">Purchase</option>
              <option value="Expense">Expense</option>
              <option value="Purchase Order">Purchase Order</option>
              <option value="Credit Note">Credit Note</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Category / Status Dropdown */}
        <div className="lg:col-span-2">
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">
            {activeSubTab === 'vendors' ? 'Category' : 'Category'}
          </label>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              <option value="Inventory (Apparel)">Inventory (Apparel)</option>
              <option value="Inventory (Footwear)">Inventory (Footwear)</option>
              <option value="Rent">Rent</option>
              <option value="Marketing">Marketing</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Partially Received">Partially Received</option>
                <option value="Active">Active</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="px-2.5 py-1.5 mt-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-semibold flex items-center gap-1 transition-colors shrink-0 shadow-2xs"
            title="Clear filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* 3. Compact High-Density Data Table (Fits 100% width cleanly without horizontal scroll) */}
      <div className="overflow-x-auto">
        {/* Tab 1: All Transactions (Mockup 8.0.png) */}
        {activeSubTab === 'all' && (
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] sm:text-[11px] font-bold text-slate-600 tracking-tight">
                <th className="py-2.5 px-2 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={
                      allTransactions.length > 0 && selectedIds.length === allTransactions.length
                    }
                    onChange={(e) =>
                      handleSelectAll(
                        e.target.checked,
                        allTransactions.length,
                        allTransactions.map((t) => t.id)
                      )
                    }
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-2 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    Date <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th className="py-2.5 px-2 whitespace-nowrap">Reference No.</th>
                <th className="py-2.5 px-1.5 whitespace-nowrap">Type</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Vendor / Paid To</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Category</th>
                <th className="py-2.5 px-2 whitespace-nowrap text-right">Amount (₹)</th>
                <th className="py-2.5 px-1.5 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-2 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allTransactions.map((txn) => {
                const isSelected = selectedIds.includes(txn.id);
                const isMenuOpen = activeMenuId === txn.id;
                return (
                  <tr
                    key={txn.id}
                    className={`transition-colors cursor-pointer group ${
                      isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                    }`}
                    onClick={() => onViewDetails(txn)}
                  >
                    <td className="py-2.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(txn.id, e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <div className="font-bold text-slate-900 leading-tight">{txn.date}</div>
                      <div className="text-[10px] text-slate-400">{txn.time}</div>
                    </td>
                    <td className="py-2.5 px-2 font-mono font-medium text-slate-800 text-[11px] whitespace-nowrap">
                      {txn.referenceNo}
                    </td>
                    <td className="py-2.5 px-1.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          txn.type === 'Purchase'
                            ? 'bg-blue-50 text-blue-700'
                            : txn.type === 'Expense'
                            ? 'bg-purple-50 text-purple-700'
                            : txn.type === 'Purchase Order'
                            ? 'bg-amber-50 text-amber-700'
                            : txn.type === 'Credit Note'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-sky-50 text-sky-700'
                        }`}
                      >
                        {txn.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-800 whitespace-nowrap">
                      {txn.vendorOrPaidTo}
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-600 whitespace-nowrap">
                      {txn.category}
                    </td>
                    <td className="py-2.5 px-2 font-bold text-right whitespace-nowrap">
                      {txn.amount === 0 ? (
                        <span className="text-slate-400">—</span>
                      ) : txn.amount > 0 ? (
                        <span className="text-emerald-600">
                          + ₹ {txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-rose-600">
                          - ₹{' '}
                          {Math.abs(txn.amount).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-1.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          txn.status === 'Paid' || txn.status === 'Processed' || txn.status === 'Generated'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : txn.status === 'Open'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td
                      className="py-2.5 px-2 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExpenseRowActionMenu
                        item={txn}
                        isOpen={isMenuOpen}
                        onToggle={() => setActiveMenuId(isMenuOpen ? null : txn.id)}
                        onClose={() => setActiveMenuId(null)}
                        onViewDetails={onViewDetails}
                        onEditItem={onEditItem}
                        onCreateCreditNote={onCreateCreditNote}
                        onGenerateEWayBill={onGenerateEWayBill}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Tab 2: Purchase Orders (Mockup 8.5.png) */}
        {activeSubTab === 'orders' && (
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] sm:text-[11px] font-bold text-slate-600 tracking-tight">
                <th className="py-2.5 px-2 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={
                      purchaseOrders.length > 0 && selectedIds.length === purchaseOrders.length
                    }
                    onChange={(e) =>
                      handleSelectAll(
                        e.target.checked,
                        purchaseOrders.length,
                        purchaseOrders.map((t) => t.id)
                      )
                    }
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-2 whitespace-nowrap">PO No. ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Date ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Vendor</th>
                <th className="py-2.5 px-1.5 whitespace-nowrap">Items ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap text-right">Total Amount (₹)</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Expected Date</th>
                <th className="py-2.5 px-1.5 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-2 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchaseOrders.map((po) => {
                const isSelected = selectedIds.includes(po.id);
                const isMenuOpen = activeMenuId === po.id;
                return (
                  <tr
                    key={po.id}
                    className={`transition-colors cursor-pointer group ${
                      isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                    }`}
                    onClick={() => onViewDetails(po)}
                  >
                    <td className="py-2.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(po.id, e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-2 font-mono font-medium text-slate-800 text-[11px] whitespace-nowrap">
                      {po.poNumber}
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <div className="font-bold text-slate-900 leading-tight">{po.date}</div>
                      <div className="text-[10px] text-slate-400">{po.time}</div>
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-800 whitespace-nowrap">
                      {po.vendor}
                    </td>
                    <td className="py-2.5 px-1.5 text-blue-600 font-semibold whitespace-nowrap">
                      {po.itemsCount}
                    </td>
                    <td className="py-2.5 px-2 font-bold text-right text-slate-900 whitespace-nowrap">
                      {po.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap">
                      {po.expectedDate}
                    </td>
                    <td className="py-2.5 px-1.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          po.status === 'Received'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : po.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : po.status === 'Partially Received'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td
                      className="py-2.5 px-2 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExpenseRowActionMenu
                        item={po}
                        isOpen={isMenuOpen}
                        onToggle={() => setActiveMenuId(isMenuOpen ? null : po.id)}
                        onClose={() => setActiveMenuId(null)}
                        onViewDetails={onViewDetails}
                        onEditItem={onEditItem}
                        onCreateCreditNote={onCreateCreditNote}
                        onGenerateEWayBill={onGenerateEWayBill}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Tab 3: Purchases (Bills) (Mockup 8.6.png) */}
        {activeSubTab === 'bills' && (
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] sm:text-[11px] font-bold text-slate-600 tracking-tight">
                <th className="py-2.5 px-2 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={
                      purchaseBills.length > 0 && selectedIds.length === purchaseBills.length
                    }
                    onChange={(e) =>
                      handleSelectAll(
                        e.target.checked,
                        purchaseBills.length,
                        purchaseBills.map((t) => t.id)
                      )
                    }
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-2 whitespace-nowrap">Bill No. ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Date ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Vendor</th>
                <th className="py-2.5 px-1.5 whitespace-nowrap">Items ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap text-right">Total Amount (₹)</th>
                <th className="py-2.5 px-1.5 whitespace-nowrap">Payment Status</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Due Date</th>
                <th className="py-2.5 px-2 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchaseBills.map((bill) => {
                const isSelected = selectedIds.includes(bill.id);
                const isMenuOpen = activeMenuId === bill.id;
                return (
                  <tr
                    key={bill.id}
                    className={`transition-colors cursor-pointer group ${
                      isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                    }`}
                    onClick={() => onViewDetails(bill)}
                  >
                    <td className="py-2.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(bill.id, e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-2 font-mono font-medium text-slate-800 text-[11px] whitespace-nowrap">
                      {bill.billNumber}
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <div className="font-bold text-slate-900 leading-tight">{bill.date}</div>
                      <div className="text-[10px] text-slate-400">{bill.time}</div>
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-800 whitespace-nowrap">
                      {bill.vendor}
                    </td>
                    <td className="py-2.5 px-1.5 text-blue-600 font-semibold whitespace-nowrap">
                      {bill.itemsCount}
                    </td>
                    <td className="py-2.5 px-2 font-bold text-right text-slate-900 whitespace-nowrap">
                      {bill.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-1.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          bill.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : bill.paymentStatus === 'Partially Paid'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {bill.paymentStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap">
                      {bill.dueDate}
                    </td>
                    <td
                      className="py-2.5 px-2 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExpenseRowActionMenu
                        item={bill}
                        isOpen={isMenuOpen}
                        onToggle={() => setActiveMenuId(isMenuOpen ? null : bill.id)}
                        onClose={() => setActiveMenuId(null)}
                        onViewDetails={onViewDetails}
                        onEditItem={onEditItem}
                        onCreateCreditNote={onCreateCreditNote}
                        onGenerateEWayBill={onGenerateEWayBill}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Tab 4: Expenses (Mockup 8.7.png) */}
        {activeSubTab === 'expenses' && (
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] sm:text-[11px] font-bold text-slate-600 tracking-tight">
                <th className="py-2.5 px-2 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={expenses.length > 0 && selectedIds.length === expenses.length}
                    onChange={(e) =>
                      handleSelectAll(
                        e.target.checked,
                        expenses.length,
                        expenses.map((t) => t.id)
                      )
                    }
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-2 whitespace-nowrap">Expense No. ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Date ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Category</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Description</th>
                <th className="py-2.5 px-2 whitespace-nowrap text-right">Amount (₹)</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Payment Method</th>
                <th className="py-2.5 px-1.5 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-2 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp) => {
                const isSelected = selectedIds.includes(exp.id);
                const isMenuOpen = activeMenuId === exp.id;
                return (
                  <tr
                    key={exp.id}
                    className={`transition-colors cursor-pointer group ${
                      isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                    }`}
                    onClick={() => onViewDetails(exp)}
                  >
                    <td className="py-2.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(exp.id, e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-2 font-mono font-medium text-slate-800 text-[11px] whitespace-nowrap">
                      {exp.expenseNo}
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <div className="font-bold text-slate-900 leading-tight">{exp.date}</div>
                      <div className="text-[10px] text-slate-400">{exp.time}</div>
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 text-[10px]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-800 whitespace-nowrap max-w-[160px] truncate">
                      {exp.description}
                    </td>
                    <td className="py-2.5 px-2 font-bold text-right text-slate-900 whitespace-nowrap">
                      {exp.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap">
                      {exp.paymentMethod}
                    </td>
                    <td className="py-2.5 px-1.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          exp.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : exp.status === 'Partially Paid'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {exp.status}
                      </span>
                    </td>
                    <td
                      className="py-2.5 px-2 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExpenseRowActionMenu
                        item={exp}
                        isOpen={isMenuOpen}
                        onToggle={() => setActiveMenuId(isMenuOpen ? null : exp.id)}
                        onClose={() => setActiveMenuId(null)}
                        onViewDetails={onViewDetails}
                        onEditItem={onEditItem}
                        onCreateCreditNote={onCreateCreditNote}
                        onGenerateEWayBill={onGenerateEWayBill}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Tab 5: Credit Notes (Mockup 8.8.png) */}
        {activeSubTab === 'credit_notes' && (
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] sm:text-[11px] font-bold text-slate-600 tracking-tight">
                <th className="py-2.5 px-2 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={
                      creditNotes.length > 0 && selectedIds.length === creditNotes.length
                    }
                    onChange={(e) =>
                      handleSelectAll(
                        e.target.checked,
                        creditNotes.length,
                        creditNotes.map((t) => t.id)
                      )
                    }
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-2 whitespace-nowrap">Credit Note No. ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Date ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Reference (Purchase)</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Vendor</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Reason / Type</th>
                <th className="py-2.5 px-2 whitespace-nowrap text-right">Amount (₹)</th>
                <th className="py-2.5 px-1.5 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-2 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {creditNotes.map((cn) => {
                const isSelected = selectedIds.includes(cn.id);
                const isMenuOpen = activeMenuId === cn.id;
                return (
                  <tr
                    key={cn.id}
                    className={`transition-colors cursor-pointer group ${
                      isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                    }`}
                    onClick={() => onViewDetails(cn)}
                  >
                    <td className="py-2.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(cn.id, e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-2 font-mono font-medium text-slate-800 text-[11px] whitespace-nowrap">
                      {cn.creditNoteNo}
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <div className="font-bold text-slate-900 leading-tight">{cn.date}</div>
                      <div className="text-[10px] text-slate-400">{cn.time}</div>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-slate-600 whitespace-nowrap">
                      {cn.referencePurchase}
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-800 whitespace-nowrap">
                      {cn.vendor}
                    </td>
                    <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap">
                      {cn.reasonType}
                    </td>
                    <td className="py-2.5 px-2 font-bold text-right text-rose-600 whitespace-nowrap">
                      - ₹ {Math.abs(cn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-1.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          cn.status === 'Processed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : cn.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {cn.status}
                      </span>
                    </td>
                    <td
                      className="py-2.5 px-2 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExpenseRowActionMenu
                        item={cn}
                        isOpen={isMenuOpen}
                        onToggle={() => setActiveMenuId(isMenuOpen ? null : cn.id)}
                        onClose={() => setActiveMenuId(null)}
                        onViewDetails={onViewDetails}
                        onEditItem={onEditItem}
                        onCreateCreditNote={onCreateCreditNote}
                        onGenerateEWayBill={onGenerateEWayBill}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Tab 6: E-Way Bills (Mockup 8.9.png) */}
        {activeSubTab === 'eway_bills' && (
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] sm:text-[11px] font-bold text-slate-600 tracking-tight">
                <th className="py-2.5 px-2 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={
                      ewayBills.length > 0 && selectedIds.length === ewayBills.length
                    }
                    onChange={(e) =>
                      handleSelectAll(
                        e.target.checked,
                        ewayBills.length,
                        ewayBills.map((t) => t.id)
                      )
                    }
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-2 whitespace-nowrap">E-Way Bill No. ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Date ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Invoice / Bill No.</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Vendor</th>
                <th className="py-2.5 px-2 whitespace-nowrap">From → To</th>
                <th className="py-2.5 px-1.5 whitespace-nowrap text-right">Distance (KM)</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Valid Till</th>
                <th className="py-2.5 px-1.5 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-2 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ewayBills.map((ewb) => {
                const isSelected = selectedIds.includes(ewb.id);
                const isMenuOpen = activeMenuId === ewb.id;
                return (
                  <tr
                    key={ewb.id}
                    className={`transition-colors cursor-pointer group ${
                      isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                    }`}
                    onClick={() => onViewDetails(ewb)}
                  >
                    <td className="py-2.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(ewb.id, e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-2 font-mono font-bold text-blue-600 text-[11px] whitespace-nowrap">
                      {ewb.eWayBillNo}
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <div className="font-bold text-slate-900 leading-tight">{ewb.date}</div>
                      <div className="text-[10px] text-slate-400">{ewb.time}</div>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-slate-600 whitespace-nowrap">
                      {ewb.invoiceBillNo}
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-800 whitespace-nowrap">
                      {ewb.vendor}
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-700 whitespace-nowrap">
                      {ewb.fromTo}
                    </td>
                    <td className="py-2.5 px-1.5 text-right font-medium text-slate-800 whitespace-nowrap">
                      {ewb.distanceKm}
                    </td>
                    <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap">
                      {ewb.validTill}
                    </td>
                    <td className="py-2.5 px-1.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          ewb.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ewb.status === 'In Transit'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : ewb.status === 'Expired'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {ewb.status}
                      </span>
                    </td>
                    <td
                      className="py-2.5 px-2 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExpenseRowActionMenu
                        item={ewb}
                        isOpen={isMenuOpen}
                        onToggle={() => setActiveMenuId(isMenuOpen ? null : ewb.id)}
                        onClose={() => setActiveMenuId(null)}
                        onViewDetails={onViewDetails}
                        onEditItem={onEditItem}
                        onCreateCreditNote={onCreateCreditNote}
                        onGenerateEWayBill={onGenerateEWayBill}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Tab 7: Vendors (Mockup 8.10.png) */}
        {activeSubTab === 'vendors' && (
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] sm:text-[11px] font-bold text-slate-600 tracking-tight">
                <th className="py-2.5 px-2 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={vendors.length > 0 && selectedIds.length === vendors.length}
                    onChange={(e) =>
                      handleSelectAll(
                        e.target.checked,
                        vendors.length,
                        vendors.map((t) => t.id)
                      )
                    }
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-2 whitespace-nowrap">Vendor Code ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Vendor Name ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Contact Person</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Phone ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Email</th>
                <th className="py-2.5 px-2 whitespace-nowrap">City ⇅</th>
                <th className="py-2.5 px-2 whitespace-nowrap text-right">Total Purchases (₹)</th>
                <th className="py-2.5 px-1.5 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-2 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendors.map((v) => {
                const isSelected = selectedIds.includes(v.id);
                const isMenuOpen = activeMenuId === v.id;
                return (
                  <tr
                    key={v.id}
                    className={`transition-colors cursor-pointer group ${
                      isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                    }`}
                    onClick={() => onViewDetails(v)}
                  >
                    <td className="py-2.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(v.id, e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-2 font-mono font-medium text-slate-800 text-[11px] whitespace-nowrap">
                      {v.vendorCode}
                    </td>
                    <td className="py-2.5 px-2 font-bold text-slate-900 whitespace-nowrap">
                      {v.vendorName}
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-700 whitespace-nowrap">
                      {v.contactPerson}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-slate-700 whitespace-nowrap">
                      {v.phone}
                    </td>
                    <td className="py-2.5 px-2 text-slate-500 whitespace-nowrap">
                      {v.email}
                    </td>
                    <td className="py-2.5 px-2 font-medium text-slate-700 whitespace-nowrap">
                      {v.city}
                    </td>
                    <td className="py-2.5 px-2 font-bold text-right text-slate-900 whitespace-nowrap">
                      {v.totalPurchases.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-1.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${
                          v.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : v.status === 'Inactive'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td
                      className="py-2.5 px-2 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExpenseRowActionMenu
                        item={v}
                        isOpen={isMenuOpen}
                        onToggle={() => setActiveMenuId(isMenuOpen ? null : v.id)}
                        onClose={() => setActiveMenuId(null)}
                        onViewDetails={onViewDetails}
                        onEditItem={onEditItem}
                        onCreateCreditNote={onCreateCreditNote}
                        onGenerateEWayBill={onGenerateEWayBill}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 4. Compact Pagination Bar matching mockup 8.0.png */}
      <div className="p-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Left: Per page dropdown & count */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="pl-2.5 pr-6 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 appearance-none shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span className="text-[11px] text-slate-500">
            Showing 1 to 8 of{' '}
            {activeSubTab === 'orders'
              ? '48 purchase orders'
              : activeSubTab === 'bills'
              ? '48 purchase bills'
              : activeSubTab === 'expenses'
              ? '48 expenses'
              : activeSubTab === 'credit_notes'
              ? '12 credit notes'
              : activeSubTab === 'eway_bills'
              ? '12 e-way bills'
              : activeSubTab === 'vendors'
              ? '28 vendors'
              : '48 transactions'}
          </span>
        </div>

        {/* Right: Page Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors disabled:opacity-40 disabled:pointer-events-none shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
              currentPage === 1
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            1
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(2)}
            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
              currentPage === 2
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            2
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(3)}
            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
              currentPage === 3
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            3
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(4)}
            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
              currentPage === 4
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            4
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(5)}
            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
              currentPage === 5
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            5
          </button>

          <span className="px-1 text-slate-400 font-bold text-xs">...</span>

          <button
            type="button"
            onClick={() => setCurrentPage(25)}
            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
              currentPage === 25
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            25
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => p + 1)}
            className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-2xs"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
