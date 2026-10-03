import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Copy,
  Check,
  Percent,
  Clock,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  ChevronDown,
  Tag,
  Trash2,
  Lightbulb,
  X,
} from 'lucide-react';
import { useMarketingStore, DiscountOffer, OfferType } from '../../stores/marketingStore.js';

export const DiscountsTab: React.FC = () => {
  const { offers, addOffer, deleteOffer } = useMarketingStore();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedApplicable, setSelectedApplicable] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New offer form
  const [newOffer, setNewOffer] = useState({
    name: '',
    subtitle: '',
    type: 'Discount' as OfferType,
    code: '',
    applicableOn: 'All Products',
    discountBenefit: '20% OFF Max ₹1,000',
    validityStart: '2024-05-10',
    validityEnd: '2024-05-20',
  });

  const filteredOffers = offers.filter((o) => {
    const matchSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.subtitle.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'all' || o.type.toLowerCase() === selectedType.toLowerCase();
    const matchStatus = selectedStatus === 'all' || o.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchApplicable =
      selectedApplicable === 'all' || o.applicableOn.toLowerCase().includes(selectedApplicable.toLowerCase());
    return matchSearch && matchType && matchStatus && matchApplicable;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.name || !newOffer.code) return;

    const offer: DiscountOffer = {
      id: `OFF-${Date.now().toString().slice(-4)}`,
      name: newOffer.name,
      subtitle: newOffer.subtitle || newOffer.discountBenefit,
      type: newOffer.type,
      code: newOffer.code.toUpperCase(),
      applicableOn: newOffer.applicableOn,
      discountBenefit: newOffer.discountBenefit,
      status: 'Active',
      validity: `${newOffer.validityStart} - ${newOffer.validityEnd}`,
      redemptions: 0,
      revenueImpact: 0,
    };

    addOffer(offer);
    setIsCreateModalOpen(false);
    setNewOffer({
      name: '',
      subtitle: '',
      type: 'Discount',
      code: '',
      applicableOn: 'All Products',
      discountBenefit: '20% OFF Max ₹1,000',
      validityStart: '2024-05-10',
      validityEnd: '2024-05-20',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row (13.3.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Discounts & Offers</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, manage and track discounts and offers for your customers.
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
            <span>Create Offer</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Cards (13.3.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Offers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Total Offers</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Tag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">28</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>22% vs last 30 days</span>
            </div>
          </div>
        </div>

        {/* Active Offers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Active Offers</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">12</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>18% vs last 30 days</span>
            </div>
          </div>
        </div>

        {/* Scheduled Offers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Scheduled Offers</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">6</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>15% vs last 30 days</span>
            </div>
          </div>
        </div>

        {/* Redemptions */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Redemptions</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">2,450</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>20% vs last 30 days</span>
            </div>
          </div>
        </div>

        {/* Discount Given */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Discount Given</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">₹ 48,750.00</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>16% vs last 30 days</span>
            </div>
          </div>
        </div>

        {/* Revenue Impact */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Revenue Impact</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">₹ 2,18,450.00</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>24% vs last 30 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar (13.3.png) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search offers by name or code..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Offer Type Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-400 font-medium">Offer Type:</span>
            <select
              aria-label="Filter offers by offer type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="discount">Discount</option>
              <option value="offer">Offer</option>
              <option value="free delivery">Free Delivery</option>
              <option value="bogo">BOGO</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              aria-label="Filter offers by status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Applicable On Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-400 font-medium">Applicable On:</span>
            <select
              aria-label="Filter offers by application scope"
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

      {/* Main Table + Right Sidebar (13.3.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Offers Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      aria-label="Select all offers on page"
                      checked={selectedIds.length === filteredOffers.length && filteredOffers.length > 0}
                      onChange={() => {
                        if (selectedIds.length === filteredOffers.length) {
                          setSelectedIds([]);
                        } else {
                          setSelectedIds(filteredOffers.map((o) => o.id));
                        }
                      }}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="py-3 px-3">Offer Name</th>
                  <th className="py-3 px-2">Offer Type</th>
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-2">Applicable On</th>
                  <th className="py-3 px-3">Discount / Benefit</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Validity</th>
                  <th className="py-3 px-2">Redemptions</th>
                  <th className="py-3 px-2">Revenue Impact</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOffers.map((off) => (
                  <tr key={off.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <input
                        type="checkbox"
                        aria-label={`Select offer ${off.name}`}
                        checked={selectedIds.includes(off.id)}
                        onChange={() => {
                          if (selectedIds.includes(off.id)) {
                            setSelectedIds(selectedIds.filter((i) => i !== off.id));
                          } else {
                            setSelectedIds([...selectedIds, off.id]);
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-black text-[9px] shrink-0">
                          {off.type === 'Discount' ? '20% OFF' : off.type === 'Offer' ? 'OFFER' : 'DEAL'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate max-w-[140px]">{off.name}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{off.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          off.type === 'Discount'
                            ? 'bg-purple-50 text-purple-600 border border-purple-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {off.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg border border-slate-200 font-mono text-[11px] font-bold text-slate-800">
                        <span>{off.code}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(off.code)}
                          className="hover:text-blue-600"
                          title="Copy Code"
                        >
                          {copiedCode === off.code ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-[11px] text-slate-600 whitespace-nowrap">
                      {off.applicableOn}
                    </td>
                    <td className="py-3.5 px-3 text-[11px] font-semibold text-slate-800">
                      {off.discountBenefit}
                    </td>
                    <td className="py-3.5 px-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          off.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : off.status === 'Scheduled'
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : off.status === 'Completed'
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {off.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-[11px] text-slate-600 whitespace-nowrap">
                      {off.validity}
                    </td>
                    <td className="py-3.5 px-2 text-[11px] font-bold text-slate-700 text-center">
                      {off.redemptions > 0 ? off.redemptions : '-'}
                    </td>
                    <td className="py-3.5 px-2 text-[11px] font-bold text-slate-900 whitespace-nowrap">
                      {off.revenueImpact > 0 ? `₹ ${off.revenueImpact.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-3.5 px-3 text-right relative">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === off.id ? null : off.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                      >
                        <span>View</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>

                      {activeMenuId === off.id && (
                        <div className="absolute right-3 top-10 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 text-left">
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Offer Code: ${off.code}\nStatus: ${off.status}`);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteOffer(off.id);
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
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing 1 to {filteredOffers.length} of 28 offers</span>
            <div className="flex items-center gap-1">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">1</span>
              <span className="w-6 h-6 rounded-lg border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">2</span>
              <span className="w-6 h-6 rounded-lg border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">3</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Top Performing Offers + Offer Type Distribution + Tips (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Performing Offers */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Top Performing Offers</h3>
              <span className="text-[10px] text-blue-600 font-bold cursor-pointer">View All</span>
            </div>
            <div className="text-[10px] text-slate-400 mb-3">(Last 30 Days)</div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs hover:bg-slate-50 p-1.5 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-purple-600 text-white flex items-center justify-center text-[9px] font-black">20%</div>
                  <div>
                    <div className="font-bold text-slate-800">Summer Sale - 20% Off</div>
                    <div className="text-[10px] text-slate-400">320 redemptions</div>
                  </div>
                </div>
                <span className="font-bold text-slate-900">₹ 12,450.00</span>
              </div>

              <div className="flex items-center justify-between text-xs hover:bg-slate-50 p-1.5 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-[9px] font-black">FREE</div>
                  <div>
                    <div className="font-bold text-slate-800">Free Delivery</div>
                    <div className="text-[10px] text-slate-400">560 redemptions</div>
                  </div>
                </div>
                <span className="font-bold text-slate-900">₹ 8,450.00</span>
              </div>

              <div className="flex items-center justify-between text-xs hover:bg-slate-50 p-1.5 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-amber-600 text-white flex items-center justify-center text-[9px] font-black">₹100</div>
                  <div>
                    <div className="font-bold text-slate-800">Weekend Special - ₹100 Off</div>
                    <div className="text-[10px] text-slate-400">210 redemptions</div>
                  </div>
                </div>
                <span className="font-bold text-slate-900">₹ 6,750.00</span>
              </div>
            </div>
          </div>

          {/* Offer Type Distribution Donut Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Offer Type Distribution</h3>
            <div className="flex items-center justify-center py-2">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#6366f1" strokeWidth="12" strokeDasharray="57.1 42.9" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="28.6 71.4" strokeDashoffset="-57.1" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="7.1 92.9" strokeDashoffset="-85.7" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#ec4899" strokeWidth="12" strokeDasharray="7.1 92.9" strokeDashoffset="-92.8" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-black text-slate-900 leading-tight">28</span>
                  <span className="text-[9px] text-slate-400">Total Offers</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-slate-600 font-medium">Discounts (16)</span>
                </div>
                <span className="font-bold text-slate-800">57.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Offers (8)</span>
                </div>
                <span className="font-bold text-slate-800">28.6%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Free Delivery (2)</span>
                </div>
                <span className="font-bold text-slate-800">7.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <span className="text-slate-600 font-medium">BOGO (2)</span>
                </div>
                <span className="font-bold text-slate-800">7.1%</span>
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
              <li>Create targeted offers for different customer segments.</li>
              <li>Use time-bound offers to create urgency and drive sales.</li>
              <li>Analyze performance regularly to optimize results.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Create Offer Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Discount / Offer</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Offer Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newOffer.name}
                  onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })}
                  placeholder="e.g. Monsoon Special 25% Off"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Promo Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newOffer.code}
                    onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. MONSOON25"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono uppercase font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Offer Type</label>
                  <select
                    value={newOffer.type}
                    onChange={(e) => setNewOffer({ ...newOffer, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    <option value="Discount">Discount</option>
                    <option value="Offer">Offer</option>
                    <option value="Free Delivery">Free Delivery</option>
                    <option value="BOGO">BOGO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount / Benefit</label>
                  <input
                    type="text"
                    value={newOffer.discountBenefit}
                    onChange={(e) => setNewOffer({ ...newOffer, discountBenefit: e.target.value })}
                    placeholder="e.g. 25% OFF Max ₹800"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Applicable On</label>
                  <select
                    value={newOffer.applicableOn}
                    onChange={(e) => setNewOffer({ ...newOffer, applicableOn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    <option>All Products</option>
                    <option>New Users</option>
                    <option>Selected Products</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newOffer.validityStart}
                    onChange={(e) => setNewOffer({ ...newOffer, validityStart: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newOffer.validityEnd}
                    onChange={(e) => setNewOffer({ ...newOffer, validityEnd: e.target.value })}
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
                  Create Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
