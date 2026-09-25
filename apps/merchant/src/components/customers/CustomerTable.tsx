import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  Download,
  Settings,
  Eye,
  MoreVertical,
  Phone,
  Mail,
  ChevronDown,
  ArrowUpDown,
  CreditCard,
  MessageCircle,
} from 'lucide-react';
import { useCustomerStore, Customer } from '../../stores/customerStore.js';

interface CustomerTableProps {
  onSelectCustomer: (customer: Customer) => void;
  onOpenCreditModal: (customer: Customer) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  onSelectCustomer,
  onOpenCreditModal,
}) => {
  const {
    customers,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    paymentTermsFilter,
    setPaymentTermsFilter,
    locationFilter,
    setLocationFilter,
    clearFilters,
    activeTab,
    setActiveTab,
  } = useCustomerStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter logic
  const filteredCustomers = customers.filter((c) => {
    // Tab filter
    if (activeTab === 'active' && c.status !== 'active') return false;
    if (activeTab === 'inactive' && c.status !== 'inactive') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.gstin && c.gstin.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Status filter
    if (statusFilter !== 'All' && c.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }

    // Customer Type filter
    if (typeFilter !== 'All' && c.customerType !== typeFilter) {
      return false;
    }

    // Payment Terms filter
    if (paymentTermsFilter !== 'All' && c.paymentTerms !== paymentTermsFilter) {
      return false;
    }

    // Location filter
    if (locationFilter !== 'All' && c.location !== locationFilter) {
      return false;
    }

    return true;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getAvatarBg = (id: string) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-emerald-100 text-emerald-700',
      'bg-amber-100 text-amber-800',
      'bg-rose-100 text-rose-700',
      'bg-indigo-100 text-indigo-700',
      'bg-teal-100 text-teal-700',
      'bg-cyan-100 text-cyan-700',
      'bg-orange-100 text-orange-700',
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % colors.length;
    return colors[idx]!;
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Customer ID,Name,Phone,Email,GSTIN,Type,Payment Terms,Outstanding,Total Sales,Status',
        ...filteredCustomers.map(
          (c) =>
            `"${c.id}","${c.name}","${c.phone}","${c.email}","${c.gstin || ''}","${c.customerType}","${c.paymentTerms}",${c.outstandingAmount},${c.totalSales},"${c.status}"`
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* 1. Filters Bar matching 6.0.png */}
      <div className="p-4 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <input
            type="text"
            placeholder="Search by name, GSTIN, phone or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3.5 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
          />
          <Search className="w-4 h-4 text-blue-600 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Status</label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Customer Type Dropdown */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Customer Type</label>
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Retailer">Retailer</option>
              <option value="Wholesaler">Wholesaler</option>
              <option value="Individual">Individual</option>
              <option value="Business">Business</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Payment Terms Dropdown */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Payment Terms</label>
          <div className="relative">
            <select
              value={paymentTermsFilter}
              onChange={(e) => setPaymentTermsFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
            >
              <option value="All">All</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days</option>
              <option value="45 Days">45 Days</option>
              <option value="Immediate">Immediate</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Location Dropdown & Clear Filters */}
        <div className="flex items-center gap-2 pt-3">
          <div className="relative flex-1">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
            >
              <option value="All">All Locations</option>
              <option value="Indore">Indore</option>
              <option value="Bhopal">Bhopal</option>
              <option value="Ujjain">Ujjain</option>
              <option value="Dewas">Dewas</option>
              <option value="Gwalior">Gwalior</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
            title="Clear all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* 2. Tabs Bar */}
      <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-2 text-xs font-bold transition-all relative ${
              activeTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Customers ({customers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`pb-2 text-xs font-bold transition-all relative ${
              activeTab === 'active'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Active ({customers.filter((c) => c.status === 'active').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inactive')}
            className={`pb-2 text-xs font-bold transition-all relative ${
              activeTab === 'inactive'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Inactive ({customers.filter((c) => c.status === 'inactive').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export
          </button>
          <button
            type="button"
            onClick={() => alert('Customer table column preferences')}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
            title="Table Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">
                <span className="inline-flex items-center gap-1">
                  Customer Name <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </span>
              </th>
              <th className="py-3 px-4">Contact Details</th>
              <th className="py-3 px-4">GSTIN</th>
              <th className="py-3 px-4">Customer Type</th>
              <th className="py-3 px-4">Payment Terms</th>
              <th className="py-3 px-4">Outstanding Amount</th>
              <th className="py-3 px-4">Total Sales</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  No customers found matching the selected filters.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => {
                const initials = getInitials(customer.name);
                const avatarBg = getAvatarBg(customer.id);
                const isMenuOpen = activeMenuId === customer.id;

                return (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => onSelectCustomer(customer)}
                  >
                    {/* Customer Name + Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${avatarBg} font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                        >
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {customer.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {customer.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{customer.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* GSTIN */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                      {customer.gstin || '—'}
                    </td>

                    {/* Customer Type */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          customer.customerType === 'Wholesaler'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                            : customer.customerType === 'Retailer'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                            : 'bg-purple-50 text-purple-700 border border-purple-200/70'
                        }`}
                      >
                        {customer.customerType}
                      </span>
                    </td>

                    {/* Payment Terms */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {customer.paymentTerms}
                    </td>

                    {/* Outstanding Amount */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold ${
                          customer.outstandingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        ₹
                        {customer.outstandingAmount.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>

                    {/* Total Sales */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      ₹
                      {customer.totalSales.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          customer.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {customer.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5 relative">
                        <button
                          type="button"
                          onClick={() => onSelectCustomer(customer)}
                          className="px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-50 text-blue-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveMenuId(isMenuOpen ? null : customer.id)}
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
                                onSelectCustomer(customer);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              View Profile
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onOpenCreditModal(customer);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2"
                            >
                              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                              Manage Store Credit
                            </button>
                            <a
                              href={`https://wa.me/91${customer.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => setActiveMenuId(null)}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 text-emerald-700 text-xs flex items-center gap-2"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              Chat on WhatsApp
                            </a>
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

      {/* 4. Footer Pagination / Count */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>
            Showing 1 to {filteredCustomers.length} of {customers.length} customers
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <button
          type="button"
          onClick={() => alert('All records loaded')}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Scroll to load more
        </button>
      </div>
    </div>
  );
};
