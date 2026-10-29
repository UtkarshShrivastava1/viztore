import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  Plus,
  ChevronDown,
  Search,
  Filter,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { useCatalogStore } from '../../stores/catalogStore.js';

interface CatalogToolbarProps {
  onOpenBulkUpload?: () => void;
  onExportCsv?: () => void;
}

export const CatalogToolbar: React.FC<CatalogToolbarProps> = ({
  onOpenBulkUpload,
  onExportCsv,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    subCategoryFilter,
    setSubCategoryFilter,
    productTypeFilter,
    setProductTypeFilter,
    brandFilter,
    setBrandFilter,
    statusFilter,
    setStatusFilter,
    clearFilters,
    setActiveView,
    resetDraftProduct,
  } = useCatalogStore();

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [showFiltersBar, setShowFiltersBar] = useState(true);
  const addMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setIsAddMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFilterCount = [
    categoryFilter !== 'All Categories',
    subCategoryFilter !== 'All Sub-categories',
    productTypeFilter !== 'All Product Types',
    brandFilter !== 'All Brands',
    statusFilter !== 'All Status',
    Boolean(searchQuery.trim()),
  ].filter(Boolean).length;

  const handleAddNewProduct = () => {
    resetDraftProduct();
    setActiveView('wizard');
    setIsAddMenuOpen(false);
  };

  return (
    <div className="space-y-4 mb-4">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products / Catalog</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage all your products in one place.</p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Import Button */}
          <button
            type="button"
            onClick={() => onOpenBulkUpload?.()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import</span>
          </button>

          {/* Export Button */}
          <button
            type="button"
            onClick={() => onExportCsv?.()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          {/* Add Product Split Dropdown */}
          <div className="relative" ref={addMenuRef}>
            <div className="inline-flex rounded-lg shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={handleAddNewProduct}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                className="px-2 py-2 text-white bg-blue-700 hover:bg-blue-800 border-l border-blue-500/50 transition-colors cursor-pointer"
                title="Add Options"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {isAddMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={handleAddNewProduct}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold text-slate-800">Single Product</div>
                    <div className="text-[11px] text-slate-400">Step-by-step catalog wizard</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    onOpenBulkUpload?.();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-slate-800">Bulk Upload</div>
                    <div className="text-[11px] text-slate-400">Upload CSV / Excel sheet</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar Box */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3">
        {/* Row 1: Search & Filter Toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="relative w-full sm:max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU, barcode..."
              className="w-full pl-3.5 pr-10 py-2 text-xs text-slate-800 placeholder-slate-400 bg-slate-50/70 border border-slate-200/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
              type="button"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setShowFiltersBar(!showFiltersBar)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                activeFilterCount > 0
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Row 2: 5 Filter Dropdowns matching 3.0.png */}
        {showFiltersBar && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 pt-1 border-t border-slate-100">
            {/* Category */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Category</label>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-1.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="All Categories">All Categories</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Sub-category */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Sub-category</label>
              <div className="relative">
                <select
                  value={subCategoryFilter}
                  onChange={(e) => setSubCategoryFilter(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-1.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="All Sub-categories">All Sub-categories</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Trousers">Trousers</option>
                  <option value="Shorts">Shorts</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Product Type */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Product Type</label>
              <div className="relative">
                <select
                  value={productTypeFilter}
                  onChange={(e) => setProductTypeFilter(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-1.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="All Product Types">All Product Types</option>
                  <option value="Round Neck T-Shirt">Round Neck T-Shirt</option>
                  <option value="Polo T-Shirt">Polo T-Shirt</option>
                  <option value="Henley T-Shirt">Henley T-Shirt</option>
                  <option value="V-Neck T-Shirt">V-Neck T-Shirt</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Brand</label>
              <div className="relative">
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-1.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="All Brands">All Brands</option>
                  <option value="Roadster">Roadster</option>
                  <option value="PUMA">PUMA</option>
                  <option value="Nike">Nike</option>
                  <option value="Levis">Levis</option>
                  <option value="HRX">HRX</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-1.5 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="All Status">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
