import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  RotateCcw,
  Eye,
  MoreVertical,
  Laptop,
  Printer,
  Armchair,
  Fan,
  Monitor,
  Sofa,
  Flame,
  Camera,
  Zap,
  Smartphone,
  Droplets,
  HardDrive,
  Wrench,
  ArrowUpDown,
} from 'lucide-react';
import { useAssetStore, Asset, AssetCategory } from '../../stores/assetStore.js';

interface AssetTableProps {
  onViewAsset: (asset: Asset) => void;
  onOpenMaintenance: (asset: Asset) => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  onViewAsset,
  onOpenMaintenance,
}) => {
  const {
    assets,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    locationFilter,
    setLocationFilter,
    statusFilter,
    setStatusFilter,
    clearFilters,
    updateAssetStatus,
  } = useAssetStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredAssets = assets.filter((a) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        a.name.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        (a.brand && a.brand.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category filter
    if (categoryFilter !== 'All Categories' && a.category !== categoryFilter) {
      return false;
    }

    // Location filter
    if (locationFilter !== 'All Locations' && a.location !== locationFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'All Statuses' && a.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredAssets.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderAssetThumbnail = (name: string, category: AssetCategory) => {
    const lower = name.toLowerCase();
    let Icon = HardDrive;
    let bg = 'bg-blue-50 text-blue-600';

    if (lower.includes('laptop')) {
      Icon = Laptop;
      bg = 'bg-slate-100 text-slate-700';
    } else if (lower.includes('printer')) {
      Icon = Printer;
      bg = 'bg-slate-100 text-slate-700';
    } else if (lower.includes('chair')) {
      Icon = Armchair;
      bg = 'bg-amber-50 text-amber-700';
    } else if (lower.includes('ac') || lower.includes('voltas')) {
      Icon = Fan;
      bg = 'bg-teal-50 text-teal-600';
    } else if (lower.includes('monitor')) {
      Icon = Monitor;
      bg = 'bg-indigo-50 text-indigo-600';
    } else if (lower.includes('sofa')) {
      Icon = Sofa;
      bg = 'bg-amber-50 text-amber-700';
    } else if (lower.includes('fire')) {
      Icon = Flame;
      bg = 'bg-rose-50 text-rose-600';
    } else if (lower.includes('cctv') || lower.includes('camera')) {
      Icon = Camera;
      bg = 'bg-slate-100 text-slate-700';
    } else if (lower.includes('invertor') || lower.includes('generator')) {
      Icon = Zap;
      bg = 'bg-yellow-50 text-yellow-600';
    } else if (lower.includes('galaxy') || lower.includes('samsung') || lower.includes('phone')) {
      Icon = Smartphone;
      bg = 'bg-blue-50 text-blue-600';
    } else if (lower.includes('purifier') || lower.includes('water')) {
      Icon = Droplets;
      bg = 'bg-cyan-50 text-cyan-600';
    }

    return (
      <div
        className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0 shadow-2xs border border-slate-200/60`}
      >
        <Icon className="w-5 h-5" />
      </div>
    );
  };

  const renderCategoryBadge = (category: AssetCategory) => {
    switch (category) {
      case 'IT Equipment':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            {category}
          </span>
        );
      case 'Office Equipment':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {category}
          </span>
        );
      case 'Furniture':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            {category}
          </span>
        );
      case 'Electrical':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
            {category}
          </span>
        );
      case 'Safety Equipment':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            {category}
          </span>
        );
      case 'Security':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            {category}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {category}
          </span>
        );
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active
          </span>
        );
      case 'Under Maintenance':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Under Maintenance
          </span>
        );
      case 'Fully Depreciated':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Fully Depreciated
          </span>
        );
      case 'Disposed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800 border border-slate-300">
            Disposed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  const totalCurrentValue = filteredAssets.reduce((sum, a) => sum + a.currentValue, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* 1. Filter Toolbar matching 9.0.png */}
      <div className="p-4 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
        {/* Search Input */}
        <div className="lg:col-span-4 relative">
          <input
            type="text"
            placeholder="Search by asset name, code, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3.5 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
          />
          <Search className="w-4 h-4 text-blue-600 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category */}
        <div className="lg:col-span-3">
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Category</label>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              <option value="IT Equipment">IT Equipment</option>
              <option value="Office Equipment">Office Equipment</option>
              <option value="Furniture">Furniture</option>
              <option value="Electrical">Electrical</option>
              <option value="Safety Equipment">Safety Equipment</option>
              <option value="Security">Security</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Location */}
        <div className="lg:col-span-2">
          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Location</label>
          <div className="relative">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
            >
              <option value="All Locations">All Locations</option>
              <option value="Head Office">Head Office</option>
              <option value="Store - Indore">Store - Indore</option>
              <option value="Store - Bhopal">Store - Bhopal</option>
              <option value="Warehouse">Warehouse</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Status & Clear Filters */}
        <div className="lg:col-span-3 flex items-center gap-2">
          <div className="relative flex-1">
            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Fully Depreciated">Fully Depreciated</option>
                <option value="Disposed">Disposed</option>
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

      {/* 2. Assets Data Table matching 9.0.png */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={
                    filteredAssets.length > 0 && selectedIds.length === filteredAssets.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </th>
              <th className="py-3 px-4">
                <span className="inline-flex items-center gap-1">
                  Asset Name <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </span>
              </th>
              <th className="py-3 px-4">Asset Code</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Purchase Date</th>
              <th className="py-3 px-4">Purchase Value (₹)</th>
              <th className="py-3 px-4">Current Value (₹)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
                  No assets found matching the selected filters.
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => {
                const isSelected = selectedIds.includes(asset.id);
                const isMenuOpen = activeMenuId === asset.id;

                return (
                  <tr
                    key={asset.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => onViewAsset(asset)}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(asset.id)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                    </td>

                    {/* Asset Name + Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {renderAssetThumbnail(asset.name, asset.category)}
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {asset.name}
                        </span>
                      </div>
                    </td>

                    {/* Asset Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 text-[11px]">
                      {asset.code}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">{renderCategoryBadge(asset.category)}</td>

                    {/* Location */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {asset.location}
                    </td>

                    {/* Purchase Date */}
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {asset.purchaseDate}
                    </td>

                    {/* Purchase Value */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      ₹{' '}
                      {asset.purchaseValue.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    {/* Current Value */}
                    <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                      ₹{' '}
                      {asset.currentValue.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">{renderStatusBadge(asset.status)}</td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5 relative">
                        <button
                          type="button"
                          onClick={() => onViewAsset(asset)}
                          className="px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-50 text-blue-700 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveMenuId(isMenuOpen ? null : asset.id)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-30 animate-in fade-in duration-100 text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onViewAsset(asset);
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
                                onOpenMaintenance(asset);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2"
                            >
                              <Wrench className="w-3.5 h-3.5 text-slate-400" />
                              Schedule Maintenance
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                updateAssetStatus(
                                  asset.id,
                                  asset.status === 'Active' ? 'Under Maintenance' : 'Active'
                                );
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-2"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                              Toggle Active Status
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

      {/* 3. Footer Summary matching 9.0.png */}
      <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-slate-500">
          Showing 1 to {filteredAssets.length} of {assets.length} assets
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-500 font-semibold">Total Asset Value (Current)</span>
          <span className="text-lg font-black text-slate-900 tracking-tight">
            ₹{' '}
            {totalCurrentValue.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
