import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  RotateCcw,
  Eye,
  MoreVertical,
  ArrowUpDown,
  Download,
  Trash2,
  Edit2,
  FileText,
  Truck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useExpenseStore, Vendor, PurchaseSubTab } from '../../stores/expenseStore.js';
import { TableActionPopover } from '../ui/TableActionPopover.js';
import { downloadCSV } from '../../utils/csvExport.js';

interface VendorsTabProps {
  onOpenAddVendor?: () => void;
  onEditVendor?: (vendor: Vendor) => void;
  onCreatePO?: (vendor: Vendor) => void;
  onGenerateEWayBill?: (vendor: Vendor) => void;
}

export const VendorsTab: React.FC<VendorsTabProps> = ({
  onOpenAddVendor,
  onEditVendor,
  onCreatePO,
  onGenerateEWayBill,
}) => {
  const {
    vendors,
    activeSubTab,
    setActiveSubTab,
    deleteVendor,
    openAddVendor,
    setIsCreatePOModalOpen,
    setIsGenerateEWayBillOpen,
  } = useExpenseStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const [sortField, setSortField] = useState<keyof Vendor>('vendorCode');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Sub-tabs list matching mockup 8.10.png
  const subTabs: { id: PurchaseSubTab; label: string }[] = [
    { id: 'all', label: 'All Transactions' },
    { id: 'orders', label: 'Purchase Orders' },
    { id: 'bills', label: 'Purchases (Bills)' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'credit_notes', label: 'Credit Notes' },
    { id: 'eway_bills', label: 'E-Way Bills' },
    { id: 'vendors', label: 'Vendors' },
  ];

  // Dynamic filter options based on available vendors
  const cities = useMemo(() => {
    const set = new Set<string>();
    vendors.forEach((v) => {
      if (v.city) set.add(v.city);
    });
    return Array.from(set).sort();
  }, [vendors]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    vendors.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    return Array.from(set).sort();
  }, [vendors]);

  // Filtering & sorting logic
  const filteredVendors = useMemo(() => {
    return vendors
      .filter((v) => {
        // Search query across name, code, contact person, phone, email, gstin
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            v.vendorName.toLowerCase().includes(q) ||
            v.vendorCode.toLowerCase().includes(q) ||
            v.contactPerson.toLowerCase().includes(q) ||
            v.phone.toLowerCase().includes(q) ||
            v.email.toLowerCase().includes(q) ||
            (v.gstin && v.gstin.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Status filter
        if (statusFilter !== 'All Statuses' && v.status !== statusFilter) {
          return false;
        }

        // City filter
        if (cityFilter !== 'All Cities' && v.city !== cityFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== 'All Categories' && v.category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }
        const aStr = String(aVal || '').toLowerCase();
        const bStr = String(bVal || '').toLowerCase();
        return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
  }, [vendors, searchQuery, statusFilter, cityFilter, categoryFilter, sortField, sortOrder]);

  // Pagination calculation
  const sizeNum = parseInt(pageSize, 10) || 10;
  const totalItems = filteredVendors.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / sizeNum));
  const startIndex = (currentPage - 1) * sizeNum;
  const endIndex = Math.min(startIndex + sizeNum, totalItems);
  const currentVendors = filteredVendors.slice(startIndex, endIndex);

  const handleSort = (field: keyof Vendor) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(currentVendors.map((v) => v.id));
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

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Statuses');
    setCityFilter('All Cities');
    setCategoryFilter('All Categories');
    setCurrentPage(1);
  };

  const handleExportSelected = () => {
    const toExport =
      selectedIds.length > 0
        ? vendors.filter((v) => selectedIds.includes(v.id))
        : filteredVendors;

    downloadCSV(
      `vendors_${new Date().toISOString().slice(0, 10)}.csv`,
      ['Vendor Code', 'Vendor Name', 'Contact Person', 'Phone', 'Email', 'City', 'Total Purchases', 'Status', 'GSTIN', 'Category'],
      toExport.map((v) => [
        v.vendorCode,
        v.vendorName,
        v.contactPerson,
        v.phone,
        v.email,
        v.city,
        v.totalPurchases,
        v.status,
        v.gstin || '',
        v.category || '',
      ])
    );
  };

  const handleViewOrEdit = (vendor: Vendor) => {
    if (onEditVendor) {
      onEditVendor(vendor);
    } else {
      openAddVendor(vendor);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* 1. Main Card Container with Subtabs Bar & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Horizontal Sub-Tabs Bar matching mockup 8.10.png */}
        <div className="border-b border-slate-100 flex items-center px-4 overflow-x-auto scrollbar-none gap-6 text-xs bg-white">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`py-3.5 font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 2. Filter Toolbar matching mockup 8.10.png */}
        <div className="p-4 border-b border-slate-100/80 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {/* Search Input (md:col-span-4) */}
            <div className="md:col-span-5">
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Search</label>
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by vendor name, code, GSTIN, phone or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter (md:col-span-2) */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Blocked">Blocked</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* City Filter (md:col-span-2) */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">City</label>
              <div className="relative">
                <select
                  value={cityFilter}
                  onChange={(e) => {
                    setCityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                >
                  <option value="All Cities">All Cities</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Category Filter (md:col-span-2) */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Category</label>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                >
                  <option value="All Categories">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Clear Filters (md:col-span-1) */}
            <div className="md:col-span-1">
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full py-1.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                title="Reset filters"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span className="truncate">Clear</span>
              </button>
            </div>
          </div>

          {/* Bulk Selection Action Bar */}
          {selectedIds.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between bg-blue-50/70 p-2 rounded-xl text-xs animate-in fade-in duration-100">
              <div className="flex items-center gap-2 text-blue-900 font-semibold px-2">
                <span>{selectedIds.length} vendor(s) selected</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportSelected}
                  className="px-3 py-1 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Export Selected</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    selectedIds.forEach((id) => deleteVendor(id));
                    setSelectedIds([]);
                  }}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete Selected</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. 9-Column Full Vendor Data Table matching mockup 8.10.png */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] sm:text-[11px] font-bold text-slate-600 tracking-tight">
                {/* 1. Checkbox */}
                <th className="py-2.5 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={currentVendors.length > 0 && selectedIds.length === currentVendors.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                </th>

                {/* 2. Vendor Code */}
                <th
                  onClick={() => handleSort('vendorCode')}
                  className="py-2.5 px-2 font-bold cursor-pointer hover:text-slate-900 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Vendor Code</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 3. Vendor Name */}
                <th
                  onClick={() => handleSort('vendorName')}
                  className="py-2.5 px-2 font-bold cursor-pointer hover:text-slate-900 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Vendor Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 4. Contact Person */}
                <th className="py-2.5 px-2 font-bold whitespace-nowrap">Contact Person</th>

                {/* 5. Phone */}
                <th
                  onClick={() => handleSort('phone')}
                  className="py-2.5 px-2 font-bold cursor-pointer hover:text-slate-900 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Phone</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 6. Email */}
                <th className="py-2.5 px-2 font-bold whitespace-nowrap">Email</th>

                {/* 7. City */}
                <th
                  onClick={() => handleSort('city')}
                  className="py-2.5 px-2 font-bold cursor-pointer hover:text-slate-900 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>City</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 8. Total Purchases (₹) */}
                <th
                  onClick={() => handleSort('totalPurchases')}
                  className="py-2.5 px-2 font-bold cursor-pointer hover:text-slate-900 whitespace-nowrap text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Total Purchases (₹)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* 9. Status */}
                <th className="py-2.5 px-2 font-bold whitespace-nowrap">Status</th>

                {/* Actions */}
                <th className="py-2.5 px-2 text-center font-bold whitespace-nowrap w-24">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {currentVendors.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <p className="font-semibold text-xs text-slate-700">No vendors found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Try adjusting your search query or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                currentVendors.map((v) => {
                  const isSelected = selectedIds.includes(v.id);
                  const isMenuOpen = activeMenuId === v.id;

                  return (
                    <tr
                      key={v.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(v.id, e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>

                      {/* Vendor Code */}
                      <td className="py-2.5 px-2 font-mono font-medium whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleViewOrEdit(v)}
                          className="text-blue-600 hover:text-blue-700 hover:underline font-semibold cursor-pointer"
                        >
                          {v.vendorCode}
                        </button>
                      </td>

                      {/* Vendor Name */}
                      <td className="py-2.5 px-2 font-bold text-slate-800 whitespace-nowrap">
                        {v.vendorName}
                      </td>

                      {/* Contact Person */}
                      <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap">
                        {v.contactPerson || '—'}
                      </td>

                      {/* Phone */}
                      <td className="py-2.5 px-2 text-slate-600 font-mono whitespace-nowrap">
                        {v.phone || '—'}
                      </td>

                      {/* Email */}
                      <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap">
                        {v.email || '—'}
                      </td>

                      {/* City */}
                      <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap">
                        {v.city || '—'}
                      </td>

                      {/* Total Purchases (₹) */}
                      <td className="py-2.5 px-2 text-right font-medium text-slate-900 whitespace-nowrap font-mono">
                        {v.totalPurchases.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-2 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
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

                      {/* Actions */}
                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <VendorRowActionMenu
                          vendor={v}
                          isOpen={isMenuOpen}
                          onToggle={() => setActiveMenuId(isMenuOpen ? null : v.id)}
                          onClose={() => setActiveMenuId(null)}
                          onViewDetails={() => handleViewOrEdit(v)}
                          onEditVendor={() => handleViewOrEdit(v)}
                          onCreatePO={() => {
                            if (onCreatePO) onCreatePO(v);
                            else setIsCreatePOModalOpen(true);
                          }}
                          onGenerateEWayBill={() => {
                            if (onGenerateEWayBill) onGenerateEWayBill(v);
                            else setIsGenerateEWayBillOpen(true);
                          }}
                          onDelete={() => deleteVendor(v.id)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Compact Pagination Bar matching mockup 8.10.png */}
        <div className="p-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white">
          {/* Left: Per page dropdown & count */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-2.5 pr-6 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 appearance-none shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <span className="text-[11px] text-slate-500">
              Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} vendors
            </span>
          </div>

          {/* Right: Page Navigation Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors disabled:opacity-40 disabled:pointer-events-none shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors disabled:opacity-40 disabled:pointer-events-none shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Stronger Supplier Relationships Compliance Banner matching mockup 8.10.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Stronger Supplier Relationships</h4>
            <p className="text-[11px] text-slate-500">
              Keep all your vendor information, purchase history and communication in one place.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert('Vendor Relationship Management & Compliance Guidelines')}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shrink-0 transition-colors shadow-2xs"
        >
          Know More
        </button>
      </div>
    </div>
  );
};

// Row Action Menu Component for Vendors Table
const VendorRowActionMenu: React.FC<{
  vendor: Vendor;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onViewDetails: () => void;
  onEditVendor: () => void;
  onCreatePO: () => void;
  onGenerateEWayBill: () => void;
  onDelete: () => void;
}> = ({
  vendor,
  isOpen,
  onToggle,
  onClose,
  onViewDetails,
  onEditVendor,
  onCreatePO,
  onGenerateEWayBill,
  onDelete,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleDownloadStatement = () => {
    onClose();
    downloadCSV(
      `statement_${vendor.vendorCode}_${new Date().toISOString().slice(0, 10)}.csv`,
      ['Vendor Code', 'Vendor Name', 'Total Purchases', 'Opening Balance', 'Credit Limit', 'Status'],
      [[
        vendor.vendorCode,
        vendor.vendorName,
        vendor.totalPurchases,
        vendor.openingBalance || '0.00',
        vendor.creditLimit || '0.00',
        vendor.status,
      ]]
    );
  };

  return (
    <>
      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={onViewDetails}
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
            onEditVendor();
          }}
          className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Edit Vendor</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onCreatePO();
          }}
          className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Create PO</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onGenerateEWayBill();
          }}
          className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
        >
          <Truck className="w-3.5 h-3.5 text-slate-400" />
          <span>Generate E-Way Bill</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadStatement}
          className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Download Statement</span>
        </button>

        <div className="border-t border-slate-100 my-1" />

        <button
          type="button"
          onClick={() => {
            onClose();
            if (confirm(`Are you sure you want to delete vendor "${vendor.vendorName}"?`)) {
              onDelete();
            }
          }}
          className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          <span>Delete Vendor</span>
        </button>
      </TableActionPopover>
    </>
  );
};
