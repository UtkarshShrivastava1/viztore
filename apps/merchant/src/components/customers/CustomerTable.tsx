import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  MoreVertical,
  Phone,
  Mail,
  ChevronDown,
  ArrowUpDown,
  FileText,
  CreditCard,
  BarChart2,
  Trash2,
} from 'lucide-react';
import { useCustomerStore, Customer } from '../../stores/customerStore.js';

interface CustomerTableProps {
  onSelectCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onOpenStatements: (customer: Customer, tab?: 'history' | 'aging') => void;
  onOpenCreditModal?: (customer: Customer) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  onSelectCustomer,
  onEditCustomer,
  onOpenStatements,
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
    locationFilter,
    setLocationFilter,
    deleteCustomer,
  } = useCustomerStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [perPage, setPerPage] = useState('10');

  // Filter logic
  const filteredCustomers = customers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.gstin && c.gstin.toLowerCase().includes(q)) ||
        c.location.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (statusFilter !== 'All' && c.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }

    if (typeFilter !== 'All' && c.customerType !== typeFilter) {
      return false;
    }

    if (locationFilter !== 'All' && !c.location.toLowerCase().includes(locationFilter.toLowerCase())) {
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
      'bg-purple-100 text-purple-700',
      'bg-indigo-100 text-indigo-700',
      'bg-teal-100 text-teal-700',
      'bg-orange-100 text-orange-700',
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % colors.length;
    return colors[idx]!;
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredCustomers.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Customer ID,Name,Phone,Email,GSTIN,Type,Location,Outstanding,Total Sales,Last Order,Status',
        ...filteredCustomers.map(
          (c) =>
            `"${c.id}","${c.name}","${c.phone}","${c.email}","${c.gstin || ''}","${c.customerType}","${c.location}",${c.outstandingAmount},${c.totalSales},"${c.lastOrderDate}","${c.status}"`
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* 1. Filter Toolbar matching Mockup 6.0.png */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[280px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by customer name, GSTIN, phone, email or customer code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Status</span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer min-w-[90px]"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Customer Type Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Customer Type</span>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer min-w-[100px]"
              >
                <option value="All">All</option>
                <option value="Retailer">Retailer</option>
                <option value="Wholesaler">Wholesaler</option>
                <option value="Individual">Individual</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Location Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Location</span>
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer min-w-[90px]"
              >
                <option value="All">All</option>
                <option value="Indore">Indore</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Raipur">Raipur</option>
                <option value="Durg">Durg</option>
                <option value="Bhilai">Bhilai</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Ranchi">Ranchi</option>
                <option value="Bilaspur">Bilaspur</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* More Filters Button */}
          <button
            type="button"
            onClick={() => alert('Additional customer attribute filters (Credit limit, Tiers, Date added)...')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>More Filters</span>
          </button>
        </div>

        {/* Right Export Button */}
        <button
          type="button"
          onClick={handleExport}
          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0 self-end lg:self-center"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export</span>
        </button>
      </div>

      {/* 2. Customer Table (11 columns matching Mockup 6.0.png) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-2 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredCustomers.length &&
                      filteredCustomers.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                </th>
                <th className="py-2.5 px-2.5">
                  <span className="inline-flex items-center gap-1">
                    Customer <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th className="py-2.5 px-2.5">Contact Details</th>
                <th className="py-2.5 px-2">GSTIN</th>
                <th className="py-2.5 px-1.5">Type</th>
                <th className="py-2.5 px-2">Location</th>
                <th className="py-2.5 px-2 text-right">Outstanding Amount (₹)</th>
                <th className="py-2.5 px-2 text-right">Total Sales (₹)</th>
                <th className="py-2.5 px-2">Last Order</th>
                <th className="py-2.5 px-1.5">Status</th>
                <th className="py-2.5 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    No customers found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const initials = getInitials(customer.name);
                  const avatarBg = getAvatarBg(customer.id);
                  const isMenuOpen = activeMenuId === customer.id;
                  const isSelected = selectedIds.includes(customer.id);

                  return (
                    <tr
                      key={customer.id}
                      className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-blue-50/30' : ''
                        }`}
                    >
                      {/* 1. Checkbox */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(customer.id)}
                          className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                        />
                      </td>

                      {/* 2. Customer Name & Avatar */}
                      <td className="py-2.5 px-2.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-full ${avatarBg} font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs`}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block leading-snug truncate max-w-[130px] xl:max-w-xs text-xs">
                              {customer.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {customer.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Contact Details */}
                      <td className="py-2.5 px-2.5 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-slate-700 font-medium text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{customer.phone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{customer.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* 4. GSTIN */}
                      <td className="py-2.5 px-2 font-mono font-medium text-slate-700 text-[10px] whitespace-nowrap">
                        {customer.gstin || '23ABCDE1234F1Z5'}
                      </td>

                      {/* 5. Type Badge */}
                      <td className="py-2.5 px-1.5 whitespace-nowrap">
                        <span
                          className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${customer.customerType === 'Wholesaler'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : customer.customerType === 'Retailer'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                        >
                          {customer.customerType}
                        </span>
                      </td>

                      {/* 6. Location */}
                      <td className="py-2.5 px-2 font-medium text-slate-700 whitespace-nowrap">
                        {customer.location}
                      </td>

                      {/* 7. Outstanding Amount */}
                      <td className="py-2.5 px-2 text-right whitespace-nowrap">
                        <span
                          className={`font-bold text-xs ${customer.outstandingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'
                            }`}
                        >
                          ₹{' '}
                          {customer.outstandingAmount.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </td>

                      {/* 8. Total Sales */}
                      <td className="py-2.5 px-2 text-right font-bold text-slate-800 text-xs whitespace-nowrap">
                        ₹{' '}
                        {customer.totalSales.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })}
                      </td>

                      {/* 9. Last Order */}
                      <td className="py-2.5 px-2 font-medium text-slate-700 text-[11px] whitespace-nowrap">
                        {customer.lastOrderDate}
                      </td>

                      {/* 10. Status */}
                      <td className="py-2.5 px-1.5 whitespace-nowrap">
                        <span
                          className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-bold ${customer.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                        >
                          {customer.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* 11. Actions: 3 Icons (Eye, Pencil, More ⋮) */}
                      <td className="py-2.5 px-2 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-0.5 relative">
                          {/* Eye: View Details */}
                          <button
                            type="button"
                            onClick={() => onSelectCustomer(customer)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Customer Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Pencil: Edit Customer */}
                          <button
                            type="button"
                            onClick={() => onEditCustomer(customer)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Customer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* More Options ⋮ Button (6.1.png) */}
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(isMenuOpen ? null : customer.id)
                            }
                            className={`p-1 rounded-lg transition-colors ${isMenuOpen
                                ? 'bg-slate-100 text-slate-800'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                              }`}
                            title="More Actions"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>


                          {/* Row Actions Floating Menu (6.1.png) */}
                          {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-40 animate-in fade-in duration-100 text-left">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onSelectCustomer(customer);
                                }}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                              >
                                <Eye className="w-4 h-4 text-blue-600" />
                                <span>View Details</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onEditCustomer(customer);
                                }}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                              >
                                <Edit2 className="w-4 h-4 text-blue-600" />
                                <span>Edit Customer</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  alert(`Creating invoice for ${customer.name}...`);
                                }}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                              >
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span>Create Invoice</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  if (onOpenCreditModal) onOpenCreditModal(customer);
                                }}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                              >
                                <CreditCard className="w-4 h-4 text-blue-600" />
                                <span>Record Payment</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onOpenStatements(customer, 'history');
                                }}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                              >
                                <BarChart2 className="w-4 h-4 text-blue-600" />
                                <span>View Statements</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  alert(`Downloading statement for ${customer.name}...`);
                                }}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                              >
                                <Download className="w-4 h-4 text-blue-600" />
                                <span>Download Statement</span>
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  if (confirm(`Are you sure you want to delete customer ${customer.name}?`)) {
                                    deleteCustomer(customer.id);
                                  }
                                }}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                              >
                                <Trash2 className="w-4 h-4 text-rose-500" />
                                <span>Delete Customer</span>
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

        {/* 3. Footer Pagination Bar matching Mockup 6.0.png */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={perPage}
                onChange={(e) => setPerPage(e.target.value)}
                className="pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs"
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span>Showing 1 to {Math.min(filteredCustomers.length, 8)} of 1,248 customers</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40">
              &lt;
            </button>
            <button className="px-3 py-1 rounded-xl bg-blue-600 text-white font-bold">1</button>
            <button className="px-3 py-1 rounded-xl hover:bg-slate-50 text-slate-600 font-medium">
              2
            </button>
            <button className="px-3 py-1 rounded-xl hover:bg-slate-50 text-slate-600 font-medium">
              3
            </button>
            <button className="px-3 py-1 rounded-xl hover:bg-slate-50 text-slate-600 font-medium">
              4
            </button>
            <button className="px-3 py-1 rounded-xl hover:bg-slate-50 text-slate-600 font-medium">
              5
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="px-3 py-1 rounded-xl hover:bg-slate-50 text-slate-600 font-medium">
              125
            </button>
            <button className="px-2.5 py-1 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
