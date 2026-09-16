import React from 'react';
import { Search, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore.js';

interface InventoryFilterBarProps {
  showProductType?: boolean;
}

export const InventoryFilterBar: React.FC<InventoryFilterBarProps> = ({ showProductType = true }) => {
  const {
    searchQuery,
    categoryFilter,
    subcategoryFilter,
    productTypeFilter,
    brandFilter,
    statusFilter,
    setSearchQuery,
    setCategoryFilter,
    setSubcategoryFilter,
    setProductTypeFilter,
    setBrandFilter,
    setStatusFilter,
    clearFilters,
  } = useInventoryStore();

  const isFiltered =
    Boolean(searchQuery) ||
    categoryFilter !== 'All Categories' ||
    subcategoryFilter !== 'All Sub-categories' ||
    (showProductType && productTypeFilter !== 'All Product Types') ||
    brandFilter !== 'All Brands' ||
    statusFilter !== 'All Statuses';

  return (
    <div className="flex flex-wrap items-end gap-3 w-full py-1 text-xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px] max-w-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by product name, SKU, barcode..."
          className="w-full h-[38px] pl-3.5 pr-9 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-2xs"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Category Dropdown */}
      <div className="flex flex-col">
        <label className="text-[11px] font-semibold text-slate-700 mb-1 leading-tight">
          Category
        </label>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none h-[38px] bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[130px] shadow-2xs"
          >
            <option>All Categories</option>
            <option>Men</option>
            <option>Women</option>
            <option>Kids</option>
            <option>Accessories</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
        </div>
      </div>

      {/* Sub-category Dropdown */}
      <div className="flex flex-col">
        <label className="text-[11px] font-semibold text-slate-700 mb-1 leading-tight">
          Sub-category
        </label>
        <div className="relative">
          <select
            value={subcategoryFilter}
            onChange={(e) => setSubcategoryFilter(e.target.value)}
            className="appearance-none h-[38px] bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[135px] shadow-2xs"
          >
            <option>All Sub-categories</option>
            <option>T-Shirts</option>
            <option>Shirts</option>
            <option>Jeans</option>
            <option>Trousers</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
        </div>
      </div>

      {/* Product Type Dropdown */}
      {showProductType && (
        <div className="flex flex-col">
          <label className="text-[11px] font-semibold text-slate-700 mb-1 leading-tight">
            Product Type
          </label>
          <div className="relative">
            <select
              value={productTypeFilter}
              onChange={(e) => setProductTypeFilter(e.target.value)}
              className="appearance-none h-[38px] bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[130px] shadow-2xs"
            >
              <option>All Product Types</option>
              <option>Round Neck T-Shirt</option>
              <option>Polo T-Shirt</option>
              <option>Henley T-Shirt</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
          </div>
        </div>
      )}

      {/* Brand Dropdown */}
      <div className="flex flex-col">
        <label className="text-[11px] font-semibold text-slate-700 mb-1 leading-tight">
          Brand
        </label>
        <div className="relative">
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="appearance-none h-[38px] bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[110px] shadow-2xs"
          >
            <option>All Brands</option>
            <option>Roadster</option>
            <option>HRX</option>
            <option>WROGN</option>
            <option>Puma</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
        </div>
      </div>

      {/* Stock Status Dropdown */}
      <div className="flex flex-col">
        <label className="text-[11px] font-semibold text-slate-700 mb-1 leading-tight">
          Stock Status
        </label>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none h-[38px] bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[115px] shadow-2xs"
          >
            <option>All Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
        </div>
      </div>

      {/* Filters Button & Clear All */}
      <div className="flex items-center gap-3 ml-auto self-end h-[38px]">
        <button
          type="button"
          onClick={() => alert('Filter settings')}
          className="h-[38px] px-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span>Filters</span>
        </button>

        {isFiltered && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};
