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
import { InventoryActionMenu } from './InventoryActionMenu.js';
import { ReservedStockPopover } from './ReservedStockPopover.js';

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
    totalProductCount,
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

    if (categoryFilter !== 'All Categories' && item.category !== categoryFilter) {
      return false;
    }
    if (subcategoryFilter !== 'All Sub-categories' && item.subcategory !== subcategoryFilter) {
      return false;
    }
    if (productTypeFilter !== 'All Product Types' && item.productType !== productTypeFilter) {
      return false;
    }
    if (brandFilter !== 'All Brands' && item.brand !== brandFilter) {
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

  const totalPages = 125;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalProductCount);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const getStatusBadge = (status: InventoryItem['status']) => {
    if (status === 'out_of_stock') {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fdeeed] text-[#e53e3e]">
          Out of Stock
        </span>
      );
    }
    if (status === 'low_stock') {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fef3e7] text-[#f59e0b]">
          Low Stock
        </span>
      );
    }
    return (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e6f8f0] text-[#00a86b]">
        In Stock
      </span>
    );
  };

  return (
    <div className="space-y-2">
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead className="bg-white border-b border-slate-200">
              <tr className="text-xs font-semibold text-slate-700">
                {/* Checkbox */}
                <th className="w-10 px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={items.length > 0 && selectedIds.length === items.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </th>

                {/* Index */}
                <th className="w-8 px-2 py-3 text-center text-slate-400 font-semibold">#</th>

                {/* Product */}
                <th className="px-3 py-3 text-left">Product</th>

                {/* SKU */}
                <th className="px-3 py-3 text-left">SKU</th>

                {/* Barcode */}
                <th className="px-3 py-3 text-left">Barcode</th>

                {/* Category */}
                <th className="px-3 py-3 text-left">Category / Sub-category / Type</th>

                {/* Brand */}
                <th className="px-3 py-3 text-left">Brand</th>

                {/* Stock Units */}
                <th className="px-3 py-3 text-center">
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
                    className="inline-flex items-center justify-center gap-1 hover:text-blue-600 cursor-pointer font-semibold text-xs text-slate-700"
                  >
                    <span>Stock (Units)</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </th>

                {/* Reserved */}
                <th className="px-3 py-3 text-center">
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>Reserved</span>
                    <ReservedStockPopover showIconOnly />
                  </div>
                </th>

                {/* Available */}
                <th className="px-3 py-3 text-center">
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>Available</span>
                    <Info className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Status */}
                <th className="px-3 py-3 text-center">Status</th>

                {/* Stock Value */}
                <th className="px-3 py-3 text-right">
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
                    className="inline-flex items-center justify-end gap-1 hover:text-blue-600 cursor-pointer font-semibold text-xs text-slate-700 ml-auto"
                  >
                    <span>Stock Value</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </th>

                {/* Last Updated */}
                <th className="px-3 py-3 text-left">
                  <div className="inline-flex items-center gap-1">
                    <span>Last Updated</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Actions */}
                <th className="w-12 px-3 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 bg-white">
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-400">
                    No inventory items match the current search or filters.
                  </td>
                </tr>
              ) : (
                sortedItems.map((item, index) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? 'bg-blue-50/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="w-10 px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectId(item.id)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                      </td>

                      {/* Row Index */}
                      <td className="w-8 px-2 py-3 text-center font-medium text-slate-400 tabular-nums">
                        {index + 1}
                      </td>

                      {/* Product */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-9 h-9 rounded-md object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div>
                            <span
                              onClick={() => openDetailModal(item)}
                              className="font-semibold text-slate-900 block hover:text-blue-600 cursor-pointer leading-tight"
                            >
                              {item.name}
                            </span>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">
                              Size: {item.size} • Color: {item.color}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="px-3 py-3 text-slate-600 font-normal">
                        {item.sku}
                      </td>

                      {/* Barcode */}
                      <td className="px-3 py-3 text-slate-600 font-normal">
                        {item.barcode}
                      </td>

                      {/* Category hierarchy */}
                      <td className="px-3 py-3">
                        <span className="text-blue-600 font-medium text-xs">
                          {item.category} &gt; {item.subcategory} &gt; {item.productType}
                        </span>
                      </td>

                      {/* Brand */}
                      <td className="px-3 py-3 font-normal text-slate-700">
                        {item.brand}
                      </td>

                      {/* Stock Units */}
                      <td className="px-3 py-3 text-center font-medium text-slate-800 tabular-nums">
                        {item.stock}
                      </td>

                      {/* Reserved */}
                      <td className="px-3 py-3 text-center tabular-nums">
                        <ReservedStockPopover count={item.reserved} />
                      </td>

                      {/* Available */}
                      <td className="px-3 py-3 text-center font-medium text-slate-800 tabular-nums">
                        {item.available}
                      </td>

                      {/* Status Pill */}
                      <td className="px-3 py-3 text-center">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Stock Value */}
                      <td className="px-3 py-3 text-right font-medium text-slate-800 tabular-nums">
                        {'\u20B9'}{item.stockValue.toLocaleString()}
                      </td>

                      {/* Last Updated */}
                      <td className="px-3 py-3 text-slate-700 text-xs">
                        <div className="font-medium text-slate-800">
                          {item.lastUpdated.split(' ').slice(0, 3).join(' ')}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.lastUpdated.split(' ').slice(3).join(' ')}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="w-12 px-3 py-3 text-center">
                        <InventoryActionMenu item={item} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="border-t border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-white text-xs">
          {/* Left count */}
          <div className="font-bold text-slate-900">
            Total {totalProductCount.toLocaleString()} products
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 text-slate-500">
              <span>Rows per page</span>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="appearance-none bg-white border border-slate-200 rounded-lg px-2.5 py-1 pr-6 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <span className="text-slate-500 tabular-nums">
              {startIndex}-{endIndex} of {totalProductCount.toLocaleString()}
            </span>

            {/* Stepper Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="p-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Numbers */}
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className={`w-6 h-6 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                  currentPage === 1
                    ? 'bg-[#1a56db] text-white shadow-2xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                1
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(2)}
                className={`w-6 h-6 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                  currentPage === 2
                    ? 'bg-[#1a56db] text-white shadow-2xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                2
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(3)}
                className={`w-6 h-6 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                  currentPage === 3
                    ? 'bg-[#1a56db] text-white shadow-2xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                3
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(4)}
                className={`w-6 h-6 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                  currentPage === 4
                    ? 'bg-[#1a56db] text-white shadow-2xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                4
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(5)}
                className={`w-6 h-6 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                  currentPage === 5
                    ? 'bg-[#1a56db] text-white shadow-2xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                5
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button
                type="button"
                onClick={() => setCurrentPage(125)}
                className={`w-6 h-6 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                  currentPage === 125
                    ? 'bg-[#1a56db] text-white shadow-2xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                125
              </button>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className="p-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
