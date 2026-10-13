import React, { useState } from 'react';
import {
  Tag,
  Clock,
  TrendingUp,
  Percent,
  Search,
  Filter,
  RotateCcw,
  Plus,
  ChevronDown,
  Copy,
  Check,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import { useMarketingStore, CouponItem, CouponType, CouponStatus } from '../../stores/marketingStore.js';

interface DiscountsCouponsTabProps {
  onCreateCoupon?: () => void;
}

export const DiscountsCouponsTab: React.FC<DiscountsCouponsTabProps> = ({ onCreateCoupon }) => {
  const { coupons, openCreateCouponWizard } = useMarketingStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [selectedApplicable, setSelectedApplicable] = useState<string>('All Products');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleLaunchCreate = () => {
    if (onCreateCoupon) onCreateCoupon();
    else openCreateCouponWizard();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedType('All Types');
    setSelectedStatus('All Status');
    setSelectedApplicable('All Products');
  };

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.benefit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All Types' || c.type === selectedType;
    const matchesStatus = selectedStatus === 'All Status' || c.status === selectedStatus;
    const matchesApplicable =
      selectedApplicable === 'All Products' || c.applicableOn === selectedApplicable;
    return matchesSearch && matchesType && matchesStatus && matchesApplicable;
  });

  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredCoupons.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredCoupons.map((c) => c.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getTypeBadgeClass = (type: CouponType) => {
    switch (type) {
      case 'Percentage':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Fixed Amount':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Free Shipping':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'BOGO':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadgeClass = (status: CouponStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed':
      case 'Expired':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header (12.7.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Discounts &amp; Coupons
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create and manage discounts and coupon codes to attract more customers and boost sales.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Date Range Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-2xs hover:bg-slate-50"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>10 May 2024 - 16 May 2024</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Create Coupon Button */}
          <button
            type="button"
            onClick={handleLaunchCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards (12.7.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Coupons */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Total Coupons</span>
            <div className="text-xl font-black text-slate-900 leading-tight mt-0.5">18</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <span>↑ 20%</span>
              <span className="text-slate-400 font-normal">vs last 30 days</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        {/* Active Coupons */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Active Coupons</span>
            <div className="text-xl font-black text-slate-900 leading-tight mt-0.5">12</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <span>↑ 33%</span>
              <span className="text-slate-400 font-normal">vs last 30 days</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        {/* Coupons Used */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Coupons Used</span>
            <div className="text-xl font-black text-slate-900 leading-tight mt-0.5">1,245</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <span>↑ 28%</span>
              <span className="text-slate-400 font-normal">vs last 30 days</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Revenue from Coupons */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Revenue from Coupons</span>
            <div className="text-xl font-black text-slate-900 leading-tight mt-0.5">₹ 48,750</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <span>↑ 26%</span>
              <span className="text-slate-400 font-normal">vs last 30 days</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar (12.7.png) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search coupon by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50/80 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Coupon Type */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option>All Types</option>
              <option>Percentage</option>
              <option>Fixed Amount</option>
              <option>Free Shipping</option>
              <option>BOGO</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Expired</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Applicable On */}
          <div className="relative">
            <select
              value={selectedApplicable}
              onChange={(e) => setSelectedApplicable(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option>All Products</option>
              <option>Selected Products</option>
              <option>Men Category</option>
              <option>New Users</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>More Filters</span>
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* 2-Column Main Layout: Table (8 cols) + Right Analytics (4 cols) (12.7.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: High Density Coupons Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedRowIds.length === filteredCoupons.length && filteredCoupons.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="py-2.5 px-3">Coupon Details</th>
                  <th className="py-2.5 px-2.5">Type</th>
                  <th className="py-2.5 px-2.5">Discount / Benefit</th>
                  <th className="py-2.5 px-2.5">Applicable On</th>
                  <th className="py-2.5 px-2.5">Validity</th>
                  <th className="py-2.5 px-3">Usage</th>
                  <th className="py-2.5 px-2.5">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCoupons.map((c) => {
                  const isChecked = selectedRowIds.includes(c.id);
                  const usagePercent = Math.min(100, Math.round((c.usedCount / c.totalLimit) * 100));
                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isChecked ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectRow(c.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      {/* Coupon Details */}
                      <td className="py-2.5 px-3">
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold text-xs">
                            <span>{c.code}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(c.code)}
                              className="text-blue-500 hover:text-blue-800 p-0.5"
                              title="Copy code"
                            >
                              {copiedCode === c.code ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">
                            {c.title}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-2.5 px-2.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTypeBadgeClass(
                            c.type
                          )}`}
                        >
                          {c.type}
                        </span>
                      </td>

                      {/* Discount / Benefit */}
                      <td className="py-2.5 px-2.5">
                        <span className="font-bold text-slate-900 block whitespace-nowrap">
                          {c.benefit}
                        </span>
                      </td>

                      {/* Applicable On */}
                      <td className="py-2.5 px-2.5 text-slate-600 whitespace-nowrap">
                        {c.applicableOn}
                      </td>

                      {/* Validity */}
                      <td className="py-2.5 px-2.5 text-slate-600 whitespace-nowrap text-[11px]">
                        {c.startDate} - {c.endDate}
                      </td>

                      {/* Usage progress */}
                      <td className="py-2.5 px-3 min-w-[110px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-700">
                            <span>{c.usedCount.toLocaleString()}</span>
                            <span className="text-slate-400">/ {c.totalLimit.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all"
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-2.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(
                            c.status
                          )}`}
                        >
                          {c.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold rounded-lg inline-flex items-center gap-1 transition-colors"
                        >
                          <span>View</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Showing 1 to {filteredCoupons.length} of {coupons.length} coupons
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="p-1 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white font-bold rounded-lg text-xs">
                1
              </span>
              <span className="w-6 h-6 flex items-center justify-center text-slate-600 rounded-lg text-xs hover:bg-slate-100 cursor-pointer">
                2
              </span>
              <span className="w-6 h-6 flex items-center justify-center text-slate-600 rounded-lg text-xs hover:bg-slate-100 cursor-pointer">
                3
              </span>
              <button
                type="button"
                className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics, Top Performing & Tips (4 cols) (12.7.png) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Coupon Usage Overview (Last 30 Days) Donut Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900">
              Coupon Usage Overview (Last 30 Days)
            </h3>

            {/* SVG Donut Chart */}
            <div className="flex items-center justify-center py-2 relative">
              <svg viewBox="0 0 160 160" className="w-36 h-36">
                {/* Background Ring */}
                <circle cx="80" cy="80" r="54" fill="transparent" stroke="#f1f5f9" strokeWidth="20" />
                {/* Slice 1: WEEKEND100 45% (offset 0) */}
                <circle
                  cx="80"
                  cy="80"
                  r="54"
                  fill="transparent"
                  stroke="#eab308"
                  strokeWidth="20"
                  strokeDasharray="152.6 339"
                  strokeDashoffset="84"
                />
                {/* Slice 2: SUMMER20 25.7% */}
                <circle
                  cx="80"
                  cy="80"
                  r="54"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="20"
                  strokeDasharray="87.2 339"
                  strokeDashoffset="-68.6"
                />
                {/* Slice 3: FREDEL499 14.9% */}
                <circle
                  cx="80"
                  cy="80"
                  r="54"
                  fill="transparent"
                  stroke="#06b6d4"
                  strokeWidth="20"
                  strokeDasharray="50.5 339"
                  strokeDashoffset="-155.8"
                />
                {/* Slice 4: Others 14.4% */}
                <circle
                  cx="80"
                  cy="80"
                  r="54"
                  fill="transparent"
                  stroke="#f43f5e"
                  strokeWidth="20"
                  strokeDasharray="48.8 339"
                  strokeDashoffset="-206.3"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-black text-slate-900">1,245</span>
                <span className="text-[10px] text-slate-400 font-semibold">Total Uses</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="font-semibold text-slate-800">SUMMER20</span>
                </div>
                <span className="text-slate-500 font-medium">320 (25.7%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-slate-800">WEEKEND100</span>
                </div>
                <span className="text-slate-500 font-medium">560 (45.0%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span className="font-semibold text-slate-800">FREDEL499</span>
                </div>
                <span className="text-slate-500 font-medium">185 (14.9%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="font-semibold text-slate-800">Others</span>
                </div>
                <span className="text-slate-500 font-medium">180 (14.4%)</span>
              </div>
            </div>
          </div>

          {/* Top Performing Coupons (12.7.png) */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Top Performing Coupons</h3>
              <button type="button" className="text-[11px] font-bold text-blue-600 hover:text-blue-700">
                View All
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Rank 1 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">WEEKEND100</span>
                    <span className="text-[10px] text-slate-400">560 redemptions</span>
                  </div>
                </div>
                <span className="font-black text-slate-900">₹ 56,000</span>
              </div>

              {/* Rank 2 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">SUMMER20</span>
                    <span className="text-[10px] text-slate-400">320 redemptions</span>
                  </div>
                </div>
                <span className="font-black text-slate-900">₹ 32,000</span>
              </div>

              {/* Rank 3 */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">FREDEL499</span>
                    <span className="text-[10px] text-slate-400">185 redemptions</span>
                  </div>
                </div>
                <span className="font-black text-slate-900">₹ 18,500</span>
              </div>
            </div>
          </div>

          {/* Tips Card (12.7.png) */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Lightbulb className="w-4 h-4 fill-blue-600" />
              <h4 className="text-xs font-bold text-slate-900">Tips</h4>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li>• Create seasonal offers to attract more customers.</li>
              <li>• Use unique coupon codes for different campaigns.</li>
              <li>• Set usage limits to manage your budget.</li>
              <li>• Monitor top performing coupons and optimize regularly.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
