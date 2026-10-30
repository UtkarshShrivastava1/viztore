import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Info,
  RefreshCw,
} from 'lucide-react';
import { useInventoryStore, InventoryItem } from '../../stores/inventoryStore.js';
import { useCatalogStore } from '../../stores/catalogStore.js';
import { InventoryActionMenu } from './InventoryActionMenu.js';
import { ReservedStockPopover } from './ReservedStockPopover.js';
import { formatCategoryTitle, formatDateTime, matchesCategory } from '../../utils/formatters.js';

export const InventoryTable: React.FC = () => {
  const {
    items,
    selectedIds,
    toggleSelectId,
    toggleSelectAll,
    searchQuery,
    categoryFilter,
    subcategoryFilter,
    productTypeFilter,
    brandFilter,
    statusFilter,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    openDetailModal,
  } = useInventoryStore();

  const [sortField, setSortField] = useState<'stock' | 'stockValue' | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchSku = item.sku.toLowerCase().includes(q);
      const matchBarcode = item.barcode.toLowerCase().includes(q);
      const matchBrand = item.brand.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchBarcode && !matchBrand) return false;
    }

    if (categoryFilter !== 'All Categories' && !matchesCategory(item.category, categoryFilter)) {
      return false;
    }
    if (subcategoryFilter !== 'All Sub-categories' && !matchesCategory(item.subcategory, subcategoryFilter)) {
      return false;
    }
    if (productTypeFilter !== 'All Product Types' && !matchesCategory(item.productType, productTypeFilter)) {
      return false;
    }
    if (brandFilter !== 'All Brands' && !matchesCategory(item.brand, brandFilter)) {
      return false;
    }
    if (statusFilter !== 'All Statuses') {
      if (item.status !== statusFilter) return false;
    }

    return true;
  });

  // Sort if needed
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === 'stock') {
      return sortAsc ? a.stock - b.stock : b.stock - a.stock;
    }
    if (sortField === 'stockValue') {
      return sortAsc ? a.stockValue - b.stockValue : b.stockValue - a.stockValue;
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = sortedItems.length === 0 ? 0 : (safePage - 1) * pageSize;
  const endIndex = Math.min(safePage * pageSize, sortedItems.length);
  const paginatedItems = sortedItems.slice(startIndex, endIndex);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await useCatalogStore.getState().fetchProducts();
    } catch (err) {
      console.warn('Failed to refresh catalog products:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const getStatusPill = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 whitespace-nowrap">
            In Stock
          </span>
        );
      case 'low_stock':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 whitespace-nowrap">
            Low Stock
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 whitespace-nowrap">
            Out of Stock
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
        {/* Responsive Table Wrapper with clean horizontal scroll */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto min-w-[1240px]">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
                {/* Checkbox */}
                <th className="py-2.5 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={items.length > 0 && selectedIds.length === items.length}
                    onChange={toggleSelectAll}
                    className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                    title="Select All"
                  />
                </th>

                {/* Index */}
                <th className="py-2.5 px-2 w-8 text-center font-semibold text-slate-400">#</th>

                {/* Product */}
                <th className="py-2.5 px-3 font-semibold text-slate-600 min-w-[240px] max-w-[280px]">
                  Product
                </th>

                {/* SKU */}
                <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">
                  SKU
                </th>

                {/* Barcode */}
                <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap min-w-[110px]">
                  Barcode
                </th>

                {/* Category & Type */}
                <th className="py-2.5 px-2.5 font-semibold text-slate-600 whitespace-nowrap min-w-[170px]">
                  Category &amp; Type
                </th>

                {/* Brand */}
                <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap min-w-[100px]">
                  Brand
                </th>

                {/* Stock Units */}
                <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap text-center min-w-[85px]">
                  <button
                    type="button"
                    onClick={() => {
                      if (sortField === 'stock') {
                        setSortAsc(!sortAsc);
                      } else {
                        setSortField('stock');
                        setSortAsc(false);
                      }
                    }}
                    className="inline-flex items-center justify-center gap-1 hover:text-slate-900 cursor-pointer uppercase tracking-wider"
                  >
                    <span>Stock</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>

                {/* Reserved */}
                <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap text-center min-w-[85px]">
                  <div className="inline-flex items-center justify-center gap-1 uppercase tracking-wider">
                    <span>Reserved</span>
                    <ReservedStockPopover showIconOnly />
                  </div>
                </th>

                {/* Available */}
                <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap text-center min-w-[85px]">
                  <div className="inline-flex items-center justify-center gap-1 uppercase tracking-wider">
                    <span>Available</span>
                    <Info className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Status */}
                <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap text-center min-w-[90px]">
                  Status
                </th>

                {/* Stock Value */}
                <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap text-right min-w-[110px]">
                  <button
                    type="button"
                    onClick={() => {
                      if (sortField === 'stockValue') {
                        setSortAsc(!sortAsc);
                      } else {
                        setSortField('stockValue');
                        setSortAsc(false);
                      }
                    }}
                    className="inline-flex items-center justify-end gap-1 hover:text-slate-900 cursor-pointer uppercase tracking-wider ml-auto"
                  >
                    <span>Stock Value</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>

                {/* Last Updated */}
                <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap min-w-[95px]">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800 uppercase tracking-wider">
                    <span>Updated</span>
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>

                {/* Actions */}
                <th className="py-2.5 px-2 font-semibold text-slate-600 text-center w-10">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-1">
                      <p className="font-semibold text-slate-600 text-sm">No inventory items found</p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your search criteria or clear current filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item, index) => {
                  const isSelected = selectedIds.includes(item.id);
                  const itemIndex = startIndex + index + 1;
                  const { date, time } = formatDateTime(item.lastUpdated);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 w-8 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectId(item.id)}
                          className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                        />
                      </td>

                      {/* Row Index */}
                      <td className="py-2.5 px-2 w-8 text-center font-medium text-slate-400 tabular-nums text-[11px]">
                        {itemIndex}
                      </td>

                      {/* Product */}
                      <td className="py-2.5 px-3 min-w-[240px] max-w-[280px]">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              item.imageUrl ||
                              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80'
                            }
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200/80 shrink-0"
                            loading="lazy"
                          />
                          <div className="min-w-0 max-w-[200px] xl:max-w-[240px] overflow-hidden">
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => openDetailModal(item)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  openDetailModal(item);
                                }
                              }}
                              className="font-semibold text-slate-800 text-xs truncate block hover:text-blue-600 transition-colors text-left cursor-pointer"
                              title={item.name}
                            >
                              {item.name}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                              Size: <span className="font-medium text-slate-600">{item.size || 'M'}</span> • Color:{' '}
                              <span className="font-medium text-slate-600">{item.color || 'Black'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-2.5 px-2 font-mono text-[11px] font-medium text-slate-600 whitespace-nowrap">
                        {item.sku}
                      </td>

                      {/* Barcode */}
                      <td className="py-2.5 px-2 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {item.barcode}
                      </td>

                      {/* Category & Type */}
                      <td className="py-2.5 px-2.5 text-[11px] leading-tight whitespace-nowrap">
                        <div className="font-medium text-slate-700">
                          {formatCategoryTitle(item.category)} &gt; {formatCategoryTitle(item.subcategory)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {formatCategoryTitle(item.productType)}
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="py-2.5 px-2 font-medium text-slate-700 whitespace-nowrap">
                        {item.brand}
                      </td>

                      {/* Stock Units */}
                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <div className="font-semibold text-slate-800 leading-tight tabular-nums">
                          {item.stock}
                        </div>
                        <div className="text-[10px] text-slate-400">units</div>
                      </td>

                      {/* Reserved */}
                      <td className="py-2.5 px-2 text-center whitespace-nowrap tabular-nums">
                        <ReservedStockPopover count={item.reserved} />
                      </td>

                      {/* Available */}
                      <td className="py-2.5 px-2 text-center whitespace-nowrap font-bold text-emerald-700 tabular-nums">
                        {item.available}
                      </td>

                      {/* Status Pill */}
                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        {getStatusPill(item.status)}
                      </td>

                      {/* Stock Value */}
                      <td className="py-2.5 px-2 text-right font-bold text-slate-900 whitespace-nowrap tabular-nums">
                        ₹{item.stockValue.toLocaleString('en-IN')}
                      </td>

                      {/* Last Updated */}
                      <td className="py-2.5 px-2 text-slate-500 text-[11px] whitespace-nowrap">
                        <div className="text-slate-600 font-medium whitespace-nowrap">{date}</div>
                        {time && <div className="text-[10px] text-slate-400 whitespace-nowrap">{time}</div>}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-2 text-center w-10">
                        <InventoryActionMenu item={item} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Unified Pagination Bar matching Catalog design */}
        <div className="px-4 py-2.5 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          {/* Total Count */}
          <div className="text-slate-600 font-medium">
            Total{' '}
            <span className="font-bold text-blue-600">{sortedItems.length.toLocaleString()}</span>{' '}
            products
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-4">
            {/* Rows per page selector */}
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <span>Rows per page:</span>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="appearance-none bg-white border border-slate-200 rounded-md px-2 py-0.5 pr-5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <span className="text-slate-500 text-[11px] tabular-nums">
              {sortedItems.length === 0 ? 0 : startIndex + 1}-{endIndex} of{' '}
              {sortedItems.length.toLocaleString()}
            </span>

            <div className="inline-flex rounded-md shadow-2xs">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(1)}
                className="p-1.5 rounded-l-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(safePage - 1)}
                className="p-1.5 border-y border-r border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage(safePage + 1)}
                className="p-1.5 border-y border-r border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-1.5 rounded-r-md border-y border-r border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Last Page"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timestamp indicator */}
      <div className="flex justify-end items-center gap-1.5 text-[11px] text-slate-400 pr-1">
        <span>Last updated a few seconds ago</span>
        <button
          type="button"
          onClick={handleRefresh}
          className="p-0.5 hover:text-blue-600 transition-colors cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>
    </div>
  );
};
