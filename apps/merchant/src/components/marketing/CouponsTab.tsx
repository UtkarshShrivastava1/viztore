import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Copy,
  Check,
  Tag,
  Clock,
  ShoppingCart,
  IndianRupee,
  ArrowUpRight,
  ChevronDown,
  Trash2,
  Lightbulb,
  X,
  Ticket,
  Percent,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useMarketingStore, Coupon, CouponType } from '../../stores/marketingStore.js';

export const CouponsTab: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon, setActiveSubTab } = useMarketingStore();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedApplicable, setSelectedApplicable] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New coupon form state
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    name: '',
    couponType: 'Percentage' as CouponType,
    discountBenefit: '20% OFF Max ₹1,000',
    applicableOn: 'All Products',
    totalLimit: 1000,
    validityStart: '2024-05-10',
    validityEnd: '2024-05-20',
  });

  const filteredCoupons = coupons.filter((c) => {
    const matchSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'all' || c.couponType.toLowerCase() === selectedType.toLowerCase();
    const matchStatus = selectedStatus === 'all' || c.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchApplicable =
      selectedApplicable === 'all' || c.applicableOn.toLowerCase().includes(selectedApplicable.toLowerCase());
    return matchSearch && matchType && matchStatus && matchApplicable;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.name) return;

    const coupon: Coupon = {
      id: `CPN-${Date.now().toString().slice(-4)}`,
      code: newCoupon.code.toUpperCase(),
      name: newCoupon.name,
      couponType: newCoupon.couponType,
      discountBenefit: newCoupon.discountBenefit,
      applicableOn: newCoupon.applicableOn,
      usedCount: 0,
      totalLimit: newCoupon.totalLimit,
      validity: `${newCoupon.validityStart} - ${newCoupon.validityEnd}`,
      status: 'Active',
    };

    addCoupon(coupon);
    setIsCreateModalOpen(false);
    setNewCoupon({
      code: '',
      name: '',
      couponType: 'Percentage',
      discountBenefit: '20% OFF Max ₹1,000',
      applicableOn: 'All Products',
      totalLimit: 1000,
      validityStart: '2024-05-10',
      validityEnd: '2024-05-20',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row (13.4.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Coupons</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create and manage coupons to provide discounts to your customers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>10 May 2024 - 16 May 2024</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Cards (13.4.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Coupons */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Total Coupons</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Ticket className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">34</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>20% vs last 30 days</span>
            </div>
          </div>
        </div>

        {/* Active Coupons */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Active Coupons</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Tag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">18</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>28% vs last 30 days</span>
            </div>
          </div>
        </div>

        {/* Used Coupons */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Used Coupons</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">1,245</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>32% vs last 30 days</span>
            </div>
          </div>
        </div>

        {/* Total Redemptions */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Total Redemptions</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">2,450</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>24% vs last 30 days</span>
            </div>
          </div>
        </div>

        {/* Total Discount Given */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Total Discount Given</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">₹ 48,750.00</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>18% vs last 30 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (13.4.png) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coupons by name or code..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Coupon Type */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-400 font-medium">Coupon Type:</span>
            <select
              aria-label="Filter coupons by type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="free shipping">Free Shipping</option>
              <option value="fixed amount">Fixed Amount</option>
              <option value="bogo">BOGO</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              aria-label="Filter coupons by status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="inactive">Inactive</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          {/* Applicable On */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-400 font-medium">Applicable On:</span>
            <select
              aria-label="Filter coupons by application scope"
              value={selectedApplicable}
              onChange={(e) => setSelectedApplicable(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="all products">All Products</option>
              <option value="new users">New Users</option>
              <option value="selected">Selected Products</option>
            </select>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>More Filters</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedType('all');
              setSelectedStatus('all');
              setSelectedApplicable('all');
            }}
            className="inline-flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Main Table + Right Sidebar (13.4.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Coupons Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      aria-label="Select all coupons on page"
                      checked={selectedIds.length === filteredCoupons.length && filteredCoupons.length > 0}
                      onChange={() => {
                        if (selectedIds.length === filteredCoupons.length) {
                          setSelectedIds([]);
                        } else {
                          setSelectedIds(filteredCoupons.map((c) => c.id));
                        }
                      }}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="py-3 px-3">Coupon Details</th>
                  <th className="py-3 px-2">Coupon Type</th>
                  <th className="py-3 px-3">Discount / Benefit</th>
                  <th className="py-3 px-2">Applicable On</th>
                  <th className="py-3 px-3">Usage</th>
                  <th className="py-3 px-2">Validity</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCoupons.map((cpn) => {
                  const usagePercent =
                    cpn.totalLimit > 0 ? Math.round((cpn.usedCount / cpn.totalLimit) * 100) : 0;

                  return (
                    <tr key={cpn.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3">
                        <input
                          type="checkbox"
                          aria-label={`Select coupon ${cpn.code}`}
                          checked={selectedIds.includes(cpn.id)}
                          onChange={() => {
                            if (selectedIds.includes(cpn.id)) {
                              setSelectedIds(selectedIds.filter((i) => i !== cpn.id));
                            } else {
                              setSelectedIds([...selectedIds, cpn.id]);
                            }
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-dashed border-blue-400 bg-blue-50/50 rounded-md font-mono text-[11px] font-black text-blue-700">
                            <span>{cpn.code}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(cpn.code)}
                              className="hover:text-blue-900"
                            >
                              {copiedCode === cpn.code ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-blue-400" />
                              )}
                            </button>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
                            {cpn.name}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            cpn.couponType === 'Percentage'
                              ? 'bg-purple-50 text-purple-600 border border-purple-200'
                              : cpn.couponType === 'Free Shipping'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : cpn.couponType === 'Fixed Amount'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                          }`}
                        >
                          {cpn.couponType}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[11px] font-semibold text-slate-800">
                        {cpn.discountBenefit}
                      </td>
                      <td className="py-3.5 px-2 text-[11px] text-slate-600 whitespace-nowrap">
                        {cpn.applicableOn}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-[11px] font-bold text-slate-800">
                            {cpn.usedCount > 0 ? (
                              <>
                                <span>{cpn.usedCount.toLocaleString()}</span>
                                <span className="text-slate-400 font-normal"> / {cpn.totalLimit.toLocaleString()}</span>
                              </>
                            ) : (
                              <span className="text-slate-400 font-normal">Not Used</span>
                            )}
                          </div>
                          {cpn.usedCount > 0 && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className="h-full bg-blue-600 rounded-full"
                                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                />
                              </div>
                              <span className="text-[9px] text-slate-400">{usagePercent}% used</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-2 text-[11px] text-slate-600 whitespace-nowrap">
                        {cpn.validity}
                      </td>
                      <td className="py-3.5 px-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            cpn.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : cpn.status === 'Completed'
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : cpn.status === 'Inactive'
                              ? 'bg-rose-50 text-rose-600 border border-rose-200'
                              : 'bg-blue-50 text-blue-600 border border-blue-200'
                          }`}
                        >
                          {cpn.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === cpn.id ? null : cpn.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                        >
                          <span>View</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>

                        {activeMenuId === cpn.id && (
                          <div className="absolute right-3 top-10 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 text-left">
                            <button
                              type="button"
                              onClick={() => {
                                alert(`Coupon: ${cpn.code}\nStatus: ${cpn.status}`);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                deleteCoupon(cpn.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing 1 to {filteredCoupons.length} of 34 coupons</span>
            <div className="flex items-center gap-1">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">1</span>
              <span className="w-6 h-6 rounded-lg border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">2</span>
              <span className="w-6 h-6 rounded-lg border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">3</span>
              <span className="w-6 h-6 rounded-lg border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">4</span>
              <span className="w-6 h-6 rounded-lg border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">6</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Coupon Summary + Top Performing Coupons + Tips (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Coupon Summary</h3>
            <span className="text-[10px] text-slate-400 block mb-4">(Last 30 Days)</span>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Coupons Created</span>
                <span className="font-black text-slate-900">12</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Coupons Used</span>
                <span className="font-black text-slate-900">1,245</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Unique Customers</span>
                <span className="font-black text-slate-900">890</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600">Avg. Discount</span>
                <span className="font-black text-slate-900">₹ 39.20</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubTab('analytics')}
              className="w-full mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
            >
              <span>View Detailed Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Top Performing Coupons */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Top Performing Coupons</h3>
              <span className="text-[10px] text-blue-600 font-bold cursor-pointer">View All</span>
            </div>

            <div className="space-y-3 mt-3">
              <div className="flex items-center justify-between text-xs hover:bg-slate-50 p-1.5 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-purple-600 text-white flex items-center justify-center text-[8px] font-black">20%</div>
                  <div>
                    <div className="font-bold text-slate-800">SUMMER20</div>
                    <div className="text-[10px] text-slate-400">320 redemptions</div>
                  </div>
                </div>
                <span className="font-bold text-slate-900">₹ 12,450.00</span>
              </div>

              <div className="flex items-center justify-between text-xs hover:bg-slate-50 p-1.5 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-amber-600 text-white flex items-center justify-center text-[8px] font-black">FREE</div>
                  <div>
                    <div className="font-bold text-slate-800">FREDEL499</div>
                    <div className="text-[10px] text-slate-400">560 redemptions</div>
                  </div>
                </div>
                <span className="font-bold text-slate-900">₹ 8,450.00</span>
              </div>

              <div className="flex items-center justify-between text-xs hover:bg-slate-50 p-1.5 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-emerald-600 text-white flex items-center justify-center text-[8px] font-black">₹100</div>
                  <div>
                    <div className="font-bold text-slate-800">WEEKEND100</div>
                    <div className="text-[10px] text-slate-400">210 redemptions</div>
                  </div>
                </div>
                <span className="font-bold text-slate-900">₹ 6,750.00</span>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Tips</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Create time-bound coupons to drive urgency.</li>
              <li>Use free shipping coupons to increase conversions.</li>
              <li>Monitor performance and optimize regularly.</li>
              <li>Share coupons via campaigns and notifications.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Coupon</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Coupon Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. FESTIVE20"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono uppercase font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coupon Type</label>
                  <select
                    value={newCoupon.couponType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, couponType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    <option value="Percentage">Percentage</option>
                    <option value="Free Shipping">Free Shipping</option>
                    <option value="Fixed Amount">Fixed Amount</option>
                    <option value="BOGO">BOGO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Coupon Description / Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCoupon.name}
                  onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
                  placeholder="e.g. Festive Season 20% Off"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount / Benefit</label>
                  <input
                    type="text"
                    value={newCoupon.discountBenefit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountBenefit: e.target.value })}
                    placeholder="e.g. 20% OFF Max ₹1,000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Usage Limit</label>
                  <input
                    type="number"
                    value={newCoupon.totalLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, totalLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Applicable On</label>
                  <select
                    value={newCoupon.applicableOn}
                    onChange={(e) => setNewCoupon({ ...newCoupon, applicableOn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    <option>All Products</option>
                    <option>New Users</option>
                    <option>Selected Products</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Validity (End Date)</label>
                  <input
                    type="date"
                    value={newCoupon.validityEnd}
                    onChange={(e) => setNewCoupon({ ...newCoupon, validityEnd: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
