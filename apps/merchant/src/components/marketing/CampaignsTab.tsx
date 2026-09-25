import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Megaphone,
  PlayCircle,
  CheckCircle2,
  Users,
  Ticket,
  IndianRupee,
  ArrowUpRight,
  ChevronDown,
  Trash2,
  Copy,
  Edit2,
  Eye,
  Lightbulb,
} from 'lucide-react';
import { useMarketingStore, Campaign } from '../../stores/marketingStore.js';

export const CampaignsTab: React.FC = () => {
  const {
    campaigns,
    searchQuery,
    statusFilter,
    typeFilter,
    setSearchQuery,
    setStatusFilter,
    setTypeFilter,
    setActiveCampaignView,
    deleteCampaign,
  } = useMarketingStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchType = typeFilter === 'all' || c.type.toLowerCase() === typeFilter.toLowerCase();
    return matchSearch && matchStatus && matchType;
  });

  const totalPages = Math.ceil(filteredCampaigns.length / pageSize) || 1;
  const paginatedCampaigns = filteredCampaigns.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedCampaigns.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedCampaigns.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row with Date Range and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Campaigns</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, manage and track your marketing campaigns.
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
            onClick={() => setActiveCampaignView('create')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Cards (13.1.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Campaigns */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Total Campaigns</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Megaphone className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">12</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>20% vs last 30 days</span>
            </div>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Active Campaigns</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <PlayCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">5</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>25% vs last 30 days</span>
            </div>
          </div>
        </div>

        {/* Completed Campaigns */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Completed Campaigns</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
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

        {/* Total Reach */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Total Reach</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">18,450</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>16% vs last 30 days</span>
            </div>
          </div>
        </div>

        {/* Total Redemptions */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Total Redemptions</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <Ticket className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">1,245</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>18% vs last 30 days</span>
            </div>
          </div>
        </div>

        {/* Revenue Generated */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Revenue Generated</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">₹ 48,750.00</div>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>22% vs last 30 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (13.1.png) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns by name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              aria-label="Filter campaigns by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Campaign Type Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-400 font-medium">Campaign Type:</span>
            <select
              aria-label="Filter campaigns by type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="discount">Discount</option>
              <option value="offer">Offer</option>
              <option value="delivery">Delivery</option>
              <option value="referral">Referral</option>
              <option value="awareness">Awareness</option>
              <option value="loyalty">Loyalty</option>
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
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Main Content: Table on Left + Performance Summary Sidebar on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Campaigns Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      aria-label="Select all campaigns on page"
                      checked={selectedIds.length === paginatedCampaigns.length && paginatedCampaigns.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="py-3 px-3">Campaign Name</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-3">Banner</th>
                  <th className="py-3 px-2">Start Date</th>
                  <th className="py-3 px-2">End Date</th>
                  <th className="py-3 px-3">Performance</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <input
                        type="checkbox"
                        aria-label={`Select campaign ${camp.name}`}
                        checked={selectedIds.includes(camp.id)}
                        onChange={() => toggleSelect(camp.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center font-bold text-[10px] text-slate-400">
                          <img
                            src={camp.bannerImageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate max-w-[160px]">{camp.name}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{camp.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          camp.type === 'Discount'
                            ? 'bg-purple-50 text-purple-600 border border-purple-200'
                            : camp.type === 'Offer'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : camp.type === 'Delivery'
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : camp.type === 'Referral'
                            ? 'bg-orange-50 text-orange-600 border border-orange-200'
                            : camp.type === 'Awareness'
                            ? 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {camp.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          camp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : camp.status === 'Scheduled'
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : camp.status === 'Completed'
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[11px] text-slate-600 font-medium block truncate max-w-[120px]">
                        {camp.banner}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-[11px] text-slate-600 whitespace-nowrap">
                      {camp.startDate}
                    </td>
                    <td className="py-3.5 px-2 text-[11px] text-slate-600 whitespace-nowrap">
                      {camp.endDate}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="text-[10px] space-y-0.5">
                        <div className="flex gap-1 text-slate-500">
                          <span>Reach:</span>
                          <span className="font-bold text-slate-800">{camp.reach > 0 ? camp.reach.toLocaleString() : '-'}</span>
                        </div>
                        <div className="flex gap-1 text-slate-500">
                          <span>Redemptions:</span>
                          <span className="font-bold text-slate-800">{camp.redemptions > 0 ? camp.redemptions : '-'}</span>
                        </div>
                        <div className="flex gap-1 text-slate-500">
                          <span>Revenue:</span>
                          <span className="font-bold text-slate-800">{camp.revenue > 0 ? `₹ ${camp.revenue.toLocaleString()}` : '-'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right relative">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === camp.id ? null : camp.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                      >
                        <span>View</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>

                      {/* Dropdown Action Menu */}
                      {activeMenuId === camp.id && (
                        <div className="absolute right-3 top-10 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 text-left">
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Viewing campaign: ${camp.name}`);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>View Details</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Editing campaign: ${camp.name}`);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Edit Campaign</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Duplicate campaign: ${camp.name}`);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Duplicate</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteCampaign(camp.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
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

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {Math.min((currentPage - 1) * pageSize + 1, filteredCampaigns.length)} to{' '}
              {Math.min(currentPage * pageSize, filteredCampaigns.length)} of {filteredCampaigns.length} campaigns
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg font-bold text-xs ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Campaign Performance & Top Campaigns (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Campaign Performance Donut */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Campaign Performance</h3>
            <span className="text-[11px] text-slate-400 block mb-4">(Last 30 Days)</span>

            <div className="flex items-center justify-center py-2">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#6366f1" strokeWidth="12" strokeDasharray="46 54" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="26.1 73.9" strokeDashoffset="-46" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="13.8 86.2" strokeDashoffset="-72.1" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#ec4899" strokeWidth="12" strokeDasharray="6.7 93.3" strokeDashoffset="-85.9" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#64748b" strokeWidth="12" strokeDasharray="7.3 92.7" strokeDashoffset="-92.6" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] text-slate-400">Total Revenue</span>
                  <span className="text-xs font-black text-slate-900 leading-tight">₹ 48,750.00</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-slate-600 font-medium">Discount</span>
                </div>
                <span className="font-bold text-slate-800">₹ 22,450 (46.0%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Offer</span>
                </div>
                <span className="font-bold text-slate-800">₹ 12,750 (26.1%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Delivery</span>
                </div>
                <span className="font-bold text-slate-800">₹ 6,750 (13.8%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <span className="text-slate-600 font-medium">Referral</span>
                </div>
                <span className="font-bold text-slate-800">₹ 3,250 (6.7%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  <span className="text-slate-600 font-medium">Others</span>
                </div>
                <span className="font-bold text-slate-800">₹ 3,550 (7.3%)</span>
              </div>
            </div>
          </div>

          {/* Top Performing Campaigns with Colored Bars */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Top Performing Campaigns</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">1. Summer Sale - Get 20% Off</span>
                  <span className="font-bold text-slate-900">₹ 12,450</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">2. Weekend Special Offer</span>
                  <span className="font-bold text-slate-900">₹ 6,750</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">3. New User Welcome Offer</span>
                  <span className="font-bold text-slate-900">₹ 4,600</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">4. Refer & Earn</span>
                  <span className="font-bold text-slate-900">₹ 3,250</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">5. Free Delivery Campaign</span>
                  <span className="font-bold text-slate-900">Revenue -</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-300 rounded-full" style={{ width: '10%' }} />
                </div>
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
              <li>Use attractive banners to highlight offers.</li>
              <li>Place banners on high visibility areas.</li>
              <li>Track performance and optimize regularly.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
