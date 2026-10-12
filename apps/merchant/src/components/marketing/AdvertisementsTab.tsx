import React, { useState } from 'react';
import {
  Megaphone,
  Calendar,
  CheckCircle2,
  DollarSign,
  Search,
  Filter,
  RotateCcw,
  Plus,
  Eye,
  MousePointer,
  ChevronDown,
  MoreVertical,
  Shield,
  Headphones,
  TrendingUp,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Play,
} from 'lucide-react';
import { useMarketingStore, AdvertisementItem, AdType, AdStatus } from '../../stores/marketingStore.js';

interface AdvertisementsTabProps {
  onCreateAd?: () => void;
}

export const AdvertisementsTab: React.FC<AdvertisementsTabProps> = ({ onCreateAd }) => {
  const { advertisements, openCreateAdWizard } = useMarketingStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('Last 30 Days');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const handleLaunchCreate = () => {
    if (onCreateAd) onCreateAd();
    else openCreateAdWizard();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('All Types');
    setSelectedStatus('All Status');
    setSelectedDateRange('Last 30 Days');
  };

  const filteredAds = advertisements.filter((ad) => {
    const matchesSearch =
      ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All Types' || ad.type === selectedType;
    const matchesStatus = selectedStatus === 'All Status' || ad.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredAds.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredAds.map((a) => a.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getTypeBadgeClass = (type: AdType) => {
    switch (type) {
      case 'Sponsored Product':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Sponsored Store':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Category Promotion':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Best Deals':
      case 'Best Deals Promotion':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Banner Advertisement':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadgeClass = (status: AdStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Advertisements
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Promote your products, offers and store to get more visibility and reach more customers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLaunchCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Advertisement</span>
        </button>
      </div>

      {/* 4 KPI Cards Matching Purchases (Bills) Standard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Active Ads */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Active Ads</span>
            <span className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate block">5</span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5 truncate">
              <span>↑ 25%</span>
              <span className="text-slate-400 font-normal">vs last 30d</span>
            </div>
          </div>
        </div>

        {/* Scheduled Ads */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Scheduled Ads</span>
            <span className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate block">2</span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5 truncate">
              <span>↑ 100%</span>
              <span className="text-slate-400 font-normal">vs last 30d</span>
            </div>
          </div>
        </div>

        {/* Completed Ads */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Completed Ads</span>
            <span className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate block">8</span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5 truncate">
              <span>↑ 14%</span>
              <span className="text-slate-400 font-normal">vs last 30d</span>
            </div>
          </div>
        </div>

        {/* Total Ad Spend */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Total Ad Spend</span>
            <span className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate block">₹ 12,450</span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5 truncate">
              <span>↑ 18.6%</span>
              <span className="text-slate-400 font-normal">vs last 30d</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar (12.1.png) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ads by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50/80 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Ad Type */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option>All Types</option>
              <option>Sponsored Product</option>
              <option>Sponsored Store</option>
              <option>Category Promotion</option>
              <option>Best Deals</option>
              <option>Banner Advertisement</option>
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
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date Range */}
          <div className="relative">
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>All Time</option>
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
            onClick={handleResetFilters}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Advertisements High-Density Table (12.1.png) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedRowIds.length === filteredAds.length && filteredAds.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-2.5 px-3">Ad Details</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-2.5">Duration</th>
                <th className="py-2.5 px-2.5">Amount</th>
                <th className="py-2.5 px-2.5">Start Date</th>
                <th className="py-2.5 px-2.5">End Date</th>
                <th className="py-2.5 px-2.5">Status</th>
                <th className="py-2.5 px-3">Performance</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAds.map((ad) => {
                const isChecked = selectedRowIds.includes(ad.id);
                return (
                  <tr
                    key={ad.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isChecked ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectRow(ad.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>

                    {/* Ad Details */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={ad.imageUrl}
                          alt={ad.name}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-900 truncate">{ad.name}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {ad.subtitle}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTypeBadgeClass(
                          ad.type
                        )}`}
                      >
                        {ad.type}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-2.5 px-2.5 font-semibold text-slate-700 whitespace-nowrap">
                      {ad.duration}
                    </td>

                    {/* Amount */}
                    <td className="py-2.5 px-2.5 font-bold text-slate-900 whitespace-nowrap">
                      ₹{ad.amount.toLocaleString()}
                    </td>

                    {/* Start Date */}
                    <td className="py-2.5 px-2.5 text-slate-600 whitespace-nowrap">
                      {ad.startDate}
                    </td>

                    {/* End Date */}
                    <td className="py-2.5 px-2.5 text-slate-600 whitespace-nowrap">
                      {ad.endDate}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-2.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(
                          ad.status
                        )}`}
                      >
                        {ad.status}
                      </span>
                    </td>

                    {/* Performance */}
                    <td className="py-2.5 px-3">
                      {ad.views !== null && ad.clicks !== null ? (
                        <div className="flex items-center gap-3 text-[11px] text-slate-600">
                          <span className="flex items-center gap-1" title="Impressions">
                            <Eye className="w-3 h-3 text-blue-500" />
                            <span className="font-semibold">{ad.views.toLocaleString()}</span>
                          </span>
                          <span className="flex items-center gap-1" title="Clicks">
                            <MousePointer className="w-3 h-3 text-indigo-500" />
                            <span className="font-semibold">{ad.clicks.toLocaleString()}</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-bold">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          className="px-2.5 py-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <span>View</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>
                        <button
                          type="button"
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination (12.1.png) */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            Showing 1 to {filteredAds.length} of {advertisements.length} advertisements
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
            <button
              type="button"
              disabled
              className="p-1 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 3 Info Cards (12.1.png) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
        {/* Card 1: Ad Guidelines */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1.5">
              <Shield className="w-4 h-4" />
              <h3 className="font-bold text-slate-900 text-xs">Ad Guidelines</h3>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                <span>Use clear and high-quality images.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                <span>Avoid misleading information.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                <span>Follow store advertising policy.</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1"
          >
            <span>View Guidelines</span>
            <span className="text-xs">→</span>
          </button>
        </div>

        {/* Card 2: Need Help? */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1.5">
              <Headphones className="w-4 h-4" />
              <h3 className="font-bold text-slate-900 text-xs">Need Help?</h3>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Learn how advertisements work and get the best results for your store.
            </p>
          </div>
          <button
            type="button"
            className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors self-start"
          >
            <Play className="w-3 h-3 fill-blue-600" />
            <span>Watch Guide</span>
          </button>
        </div>

        {/* Card 3: Boost Your Sales */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2 text-blue-600">
              <TrendingUp className="w-4 h-4" />
              <h3 className="font-bold text-slate-900 text-xs">Boost Your Sales</h3>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug max-w-xs">
              Reach more local customers and grow your business with targeted advertisements.
            </p>
            <button
              type="button"
              onClick={handleLaunchCreate}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Rocket className="w-3 h-3" />
              <span>Create Advertisement →</span>
            </button>
          </div>
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Rocket className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
};
