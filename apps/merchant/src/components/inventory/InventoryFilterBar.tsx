import React, { useMemo } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore.js';
import { formatCategoryTitle, matchesCategory } from '../../utils/formatters.js';

interface InventoryFilterBarProps {
  showProductType?: boolean;
}

export const InventoryFilterBar: React.FC<InventoryFilterBarProps> = ({
  showProductType = true,
}) => {
  const {
    items,
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

  // Dynamic unique categories extracted from live inventory items
  const availableCategories = useMemo(() => {
    const map = new Map<string, { raw: string; label: string; count: number }>();
    items.forEach((item) => {
      if (item.category) {
        const label = formatCategoryTitle(item.category);
        const existing = map.get(label);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(label, { raw: item.category, label, count: 1 });
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [items]);

  // Dynamic subcategories cascading from selected category
  const availableSubcategories = useMemo(() => {
    const map = new Map<string, { raw: string; label: string; count: number }>();
    items.forEach((item) => {
      const matchCat =
        categoryFilter === 'All Categories' || matchesCategory(item.category, categoryFilter);
      if (matchCat && item.subcategory) {
        const label = formatCategoryTitle(item.subcategory);
        const existing = map.get(label);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(label, { raw: item.subcategory, label, count: 1 });
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [items, categoryFilter]);

  // Dynamic product types cascading from selected category & subcategory
  const availableProductTypes = useMemo(() => {
    const map = new Map<string, { raw: string; label: string; count: number }>();
    items.forEach((item) => {
      const matchCat =
        categoryFilter === 'All Categories' || matchesCategory(item.category, categoryFilter);
      const matchSub =
        subcategoryFilter === 'All Sub-categories' ||
        matchesCategory(item.subcategory, subcategoryFilter);
      if (matchCat && matchSub && item.productType) {
        const label = formatCategoryTitle(item.productType);
        const existing = map.get(label);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(label, { raw: item.productType, label, count: 1 });
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [items, categoryFilter, subcategoryFilter]);

  // Dynamic brands extracted from live inventory items
  const availableBrands = useMemo(() => {
    const map = new Map<string, { raw: string; label: string; count: number }>();
    items.forEach((item) => {
      if (item.brand) {
        const label = item.brand;
        const existing = map.get(label);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(label, { raw: item.brand, label, count: 1 });
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [items]);

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
          className="w-full h-[38px] pl-3.5 pr-9 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-2xs"
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
            className="appearance-none h-[38px] bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[130px] shadow-2xs"
          >
            <option value="All Categories">All Categories</option>
            {availableCategories.map((c) => (
              <option key={c.label} value={c.label}>
                {c.label} ({c.count})
              </option>
            ))}
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
            className="appearance-none h-[38px] bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[135px] shadow-2xs"
          >
            <option value="All Sub-categories">All Sub-categories</option>
            {availableSubcategories.map((sc) => (
              <option key={sc.label} value={sc.label}>
                {sc.label} ({sc.count})
              </option>
            ))}
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
              className="appearance-none h-[38px] bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[130px] shadow-2xs"
            >
              <option value="All Product Types">All Product Types</option>
              {availableProductTypes.map((pt) => (
                <option key={pt.label} value={pt.label}>
                  {pt.label} ({pt.count})
                </option>
              ))}
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
            className="appearance-none h-[38px] bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[110px] shadow-2xs"
          >
            <option value="All Brands">All Brands</option>
            {availableBrands.map((b) => (
              <option key={b.label} value={b.label}>
                {b.label} ({b.count})
              </option>
            ))}
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
            className="appearance-none h-[38px] bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[115px] shadow-2xs"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
        </div>
      </div>

      {/* Clear Filters Button */}
      {isFiltered && (
        <button
          type="button"
          onClick={clearFilters}
          className="h-[38px] px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer shadow-2xs"
        >
          Clear All
        </button>
      )}
    </div>
  );
};
