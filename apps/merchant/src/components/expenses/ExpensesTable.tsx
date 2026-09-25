import React, { useState } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  RotateCcw,
  Eye,
  MoreVertical,
  Building,
  CreditCard,
  Banknote,
  ArrowUpDown,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { useExpenseStore, Expense } from '../../stores/expenseStore.js';

interface ExpensesTableProps {
  onViewExpense: (expense: Expense) => void;
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({ onViewExpense }) => {
  const {
    expenses,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    categoryFilter,
    setCategoryFilter,
    methodFilter,
    setMethodFilter,
    statusFilter,
    setStatusFilter,
    clearFilters,
    updateExpenseStatus,
  } = useExpenseStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredExpenses = expenses.filter((e) => {
    // Tab filter
    if (activeTab === 'business' && e.expenseType !== 'Business Expense') return false;
    if (activeTab === 'personal' && e.expenseType !== 'Personal Expense') return false;
    if (activeTab === 'reimbursable' && !e.isReimbursable) return false;
    if (activeTab === 'non_reimbursable' && e.isReimbursable) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        e.id.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.vendor.toLowerCase().includes(q) ||
        (e.notes && e.notes.toLowerCase().includes(q)) ||
        (e.referenceNumber && e.referenceNumber.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category filter
    if (categoryFilter !== 'All Categories' && e.category !== categoryFilter) {
      return false;
    }

    // Payment Method filter
    if (methodFilter !== 'All Methods' && e.paymentMethod !== methodFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'All Statuses' && e.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredExpenses.map((e) => e.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderPaymentIcon = (method: string) => {
    switch (method) {
      case 'Bank Transfer':
        return <Building className="w-3.5 h-3.5 text-blue-600" />;
      case 'UPI':
        return (
          <div className="w-4 h-4 rounded bg-amber-500 text-white flex items-center justify-center text-[7px] font-black leading-none">
            UPI
          </div>
        );
      case 'Card':
        return <CreditCard className="w-3.5 h-3.5 text-purple-600" />;
      case 'Cash':
        return <Banknote className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const thisMonthTotal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* 1. Filter Toolbar matching 8.0.png */}
      <div className="p-4 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
        {/* Search Input */}
        <div className="lg:col-span-4 relative">
          <input
            type="text"
            placeholder="Search by expense name, category, vendor, or notes..."
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
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Quarter">This Quarter</option>
              <option value="This Year">This Year</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Category */}
        <div className="lg:col-span-2">
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Category</label>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Meals & Entertainment">Meals & Entertainment</option>
              <option value="Marketing">Marketing</option>
              <option value="Software">Software</option>
              <option value="Travel">Travel</option>
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
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
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
                <option value="Paid">Paid</option>
                <option value="Needs Review">Needs Review</option>
                <option value="Pending">Pending</option>
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

      {/* 2. Status Tabs matching 8.0.png */}
      <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-6 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-xs font-bold transition-all whitespace-nowrap relative ${
            activeTab === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Expenses
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('business')}
          className={`pb-3 text-xs font-bold transition-all whitespace-nowrap relative ${
            activeTab === 'business'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Business Expenses
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`pb-3 text-xs font-bold transition-all whitespace-nowrap relative ${
            activeTab === 'personal'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Personal Expenses
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reimbursable')}
          className={`pb-3 text-xs font-bold transition-all whitespace-nowrap relative ${
            activeTab === 'reimbursable'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Reimbursable
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('non_reimbursable')}
          className={`pb-3 text-xs font-bold transition-all whitespace-nowrap relative ${
            activeTab === 'non_reimbursable'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Non-Reimbursable
        </button>
      </div>

      {/* 3. Expenses Data Table matching 8.0.png */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={
                    filteredExpenses.length > 0 &&
                    selectedIds.length === filteredExpenses.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </th>
              <th className="py-3 px-4">
                <span className="inline-flex items-center gap-1">
                  Date <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </span>
              </th>
              <th className="py-3 px-4">Expense ID</th>
              <th className="py-3 px-4">Expense Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Vendor</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Amount (₹)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
                  No business expenses found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => {
                const isSelected = selectedIds.includes(exp.id);
                const isMenuOpen = activeMenuId === exp.id;

                return (
                  <tr
                    key={exp.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => onViewExpense(exp)}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(exp.id)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{exp.date}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{exp.time}</div>
                    </td>

                    {/* Expense ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 text-[11px]">
                      {exp.id}
                    </td>

                    {/* Expense Name & Subtitle */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {exp.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{exp.subtitle}</div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {exp.category}
                    </td>

                    {/* Vendor */}
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {exp.vendor}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {renderPaymentIcon(exp.paymentMethod)}
                        <span className="font-medium text-slate-800">{exp.paymentMethod}</span>
                      </div>
                    </td>

                    {/* Amount (₹) in Bold Red matching 8.0.png */}
                    <td className="py-3.5 px-4 font-black text-rose-600 whitespace-nowrap">
                      ₹{' '}
                      {exp.amount.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          exp.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : exp.status === 'Needs Review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {exp.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5 relative">
                        <button
                          type="button"
                          onClick={() => onViewExpense(exp)}
                          className="px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-50 text-blue-700 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveMenuId(isMenuOpen ? null : exp.id)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-30 animate-in fade-in duration-100 text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onViewExpense(exp);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                updateExpenseStatus(exp.id, exp.status === 'Paid' ? 'Needs Review' : 'Paid');
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                              Toggle Paid Status
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Footer Summary matching 8.0.png */}
      <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-slate-500">
          Showing 1 to {filteredExpenses.length} of {expenses.length} expenses
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-500 font-semibold">Total Expenses (This Month)</span>
          <span className="text-lg font-black text-slate-900 tracking-tight">
            ₹{' '}
            {thisMonthTotal.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
