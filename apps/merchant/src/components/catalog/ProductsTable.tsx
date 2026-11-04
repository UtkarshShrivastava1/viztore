import React from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
} from 'lucide-react';
import { useCatalogStore, ProductItem } from '../../stores/catalogStore.js';
import { ProductActionMenu } from './ProductActionMenu.js';
import { formatCategoryTitle, formatDateTime, matchesCategory } from '../../utils/formatters.js';

export const ProductsTable: React.FC = () => {
  const {
    products,
    searchQuery,
    categoryFilter,
    subCategoryFilter,
    productTypeFilter,
    brandFilter,
    statusFilter,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
  } = useCatalogStore();

  // Filter products based on live criteria
  const filteredProducts = products.filter((product) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchSku = product.sku.toLowerCase().includes(q);
      const matchBarcode = product.barcode.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchBarcode && !matchBrand) return false;
    }

    if (categoryFilter !== 'All Categories' && !matchesCategory(product.category, categoryFilter)) {
      return false;
    }
    if (subCategoryFilter !== 'All Sub-categories' && !matchesCategory(product.subCategory, subCategoryFilter)) {
      return false;
    }
    if (productTypeFilter !== 'All Product Types' && !matchesCategory(product.productType, productTypeFilter)) {
      return false;
    }
    if (brandFilter !== 'All Brands' && !matchesCategory(product.brand, brandFilter)) {
      return false;
    }
    if (statusFilter !== 'All Status') {
      if (statusFilter === 'active' && product.status !== 'active') return false;
      if (statusFilter === 'inactive' && product.status !== 'inactive') return false;
      if (statusFilter === 'draft' && product.status !== 'draft') return false;
      if (statusFilter === 'out_of_stock' && product.stock > 0) return false;
    }

    return true;
  });

  const totalFiltered = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = totalFiltered === 0 ? 0 : (safePage - 1) * pageSize;
  const endIndex = Math.min(safePage * pageSize, totalFiltered);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const getStockStatusBadge = (stock: number, lowThreshold: number) => {
    if (stock <= 0) {
      return <span className="text-rose-600 text-[10px] font-semibold">Out of Stock</span>;
    }
    if (stock <= lowThreshold) {
      return <span className="text-amber-600 text-[10px] font-semibold">Low Stock</span>;
    }
    return <span className="text-emerald-600 text-[10px] font-medium">In Stock</span>;
  };

  const getStatusPill = (status: ProductItem['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 whitespace-nowrap">
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
            Inactive
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/90 whitespace-nowrap shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Draft
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
            Out of Stock
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto min-w-[1150px]">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
              <th className="py-2.5 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={
                    paginatedProducts.length > 0 &&
                    paginatedProducts.every((p) =>
                      (useCatalogStore.getState().selectedProductIds || []).includes(p.id)
                    )
                  }
                  onChange={() => useCatalogStore.getState().toggleSelectAll()}
                  className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  title="Select All"
                />
              </th>
              <th className="py-2.5 px-3 font-semibold text-slate-600 min-w-[240px] max-w-[280px]">Product</th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">
                SKU
              </th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap min-w-[110px]">
                Barcode
              </th>
              <th className="py-2.5 px-2.5 font-semibold text-slate-600 whitespace-nowrap min-w-[170px]">
                Category &amp; Type
              </th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap min-w-[100px]">
                Brand
              </th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap min-w-[90px]">
                Stock
              </th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap min-w-[90px]">
                Status
              </th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap min-w-[90px]">
                Price
              </th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap min-w-[95px]">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800 uppercase tracking-wider">
                  <span>Updated</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 text-center w-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-1">
                    <p className="font-semibold text-slate-600 text-sm">No products found</p>
                    <p className="text-xs text-slate-400">
                      Try adjusting your search criteria or clear current filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => {
                const variantsList = Array.isArray(product.variants) ? product.variants : [];
                const distinctSizes = Array.from(new Set(variantsList.map((v) => v.size).filter(Boolean)));
                const distinctColors = Array.from(new Set(variantsList.map((v) => v.color).filter(Boolean)));
                const variantCount = variantsList.length;

                let variantText = '';
                if (variantCount > 1) {
                  const sampleSpecs = [...distinctSizes, ...distinctColors].slice(0, 3).join(', ');
                  variantText = `${variantCount} Variants${sampleSpecs ? ` • ${sampleSpecs}` : ''}`;
                } else if (variantCount === 1 && variantsList[0]) {
                  const v = variantsList[0];
                  const parts: string[] = [];
                  if (v?.size && v.size !== 'Standard') parts.push(`Size: ${v.size}`);
                  if (v?.color && v.color !== 'Standard') parts.push(`Color: ${v.color}`);
                  variantText = parts.join(' • ');
                } else {
                  const parts: string[] = [];
                  if (product.attributes?.size) parts.push(`Size: ${product.attributes.size}`);
                  if (product.attributes?.color) parts.push(`Color: ${product.attributes.color}`);
                  variantText = parts.join(' • ');
                }

                const mainImg =
                  product.images?.[0] ||
                  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80';
                const isSelected = (
                  useCatalogStore.getState().selectedProductIds || []
                ).includes(product.id);
                const { date, time } = formatDateTime(product.updatedAt);

                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isSelected ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-2.5 px-3 w-8 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => useCatalogStore.getState().toggleSelectProduct(product.id)}
                        className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                      />
                    </td>

                    {/* Product */}
                    <td className="py-2.5 px-3 min-w-[240px] max-w-[280px]">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={mainImg}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200/80 shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0 max-w-[200px] xl:max-w-[240px] overflow-hidden">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className="font-semibold text-slate-800 text-xs truncate block max-w-[170px]"
                              title={product.name}
                            >
                              {product.name}
                            </span>
                            {product.status === 'draft' && (
                              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200 shrink-0 uppercase tracking-wide">
                                Draft
                              </span>
                            )}
                          </div>
                          {variantText ? (
                            <div className="text-[11px] text-blue-600 font-medium mt-0.5 truncate">
                              {variantText}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-2.5 px-2 font-mono text-[11px] font-medium text-slate-600 whitespace-nowrap">
                      {product.sku}
                    </td>

                    {/* Barcode */}
                    <td className="py-2.5 px-2 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {product.barcode}
                    </td>

                    {/* Hierarchy & Type with clean Title Case */}
                    <td className="py-2.5 px-2.5 text-[11px] leading-tight whitespace-nowrap">
                      <div className="font-medium text-slate-700">
                        {formatCategoryTitle(product.category)} &gt;{' '}
                        {formatCategoryTitle(product.subCategory)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {formatCategoryTitle(product.productType)}
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="py-2.5 px-2 font-medium text-slate-700 whitespace-nowrap">
                      {product.brand}
                    </td>

                    {/* Stock */}
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 leading-tight">
                        {product.stock}
                      </div>
                      <div>{getStockStatusBadge(product.stock, product.lowStockThreshold)}</div>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-2 whitespace-nowrap">{getStatusPill(product.status)}</td>

                    {/* Price */}
                    <td className="py-2.5 px-2 font-bold text-slate-900 whitespace-nowrap">
                      ₹{product.price.toLocaleString('en-IN')}
                    </td>

                    {/* Updated On */}
                    <td className="py-2.5 px-2 text-slate-500 text-[11px] whitespace-nowrap">
                      <div className="text-slate-600 font-medium whitespace-nowrap">{date}</div>
                      {time && (
                        <div className="text-[10px] text-slate-400 whitespace-nowrap">{time}</div>
                      )}
                    </td>

                    {/* Actions Trigger */}
                    <td className="py-2.5 px-2 text-center w-10">
                      <ProductActionMenu product={product} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Bar: Total count label and unified pagination controls */}
      <div className="px-4 py-2.5 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="text-slate-600 font-medium">
          Total{' '}
          <span className="font-bold text-blue-600">{totalFiltered.toLocaleString()}</span>{' '}
          products
        </div>

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
                <option value={8}>8</option>
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <span className="text-slate-500 text-[11px] tabular-nums">
            {totalFiltered === 0 ? 0 : startIndex + 1}-{endIndex} of{' '}
            {totalFiltered.toLocaleString()}
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

      {/* Floating Bulk Action Bar */}
      {(useCatalogStore.getState().selectedProductIds || []).length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 border border-slate-700">
          <span className="text-xs font-bold">
            {useCatalogStore.getState().selectedProductIds.length} products selected
          </span>
          <button
            type="button"
            onClick={() => {
              const count = useCatalogStore.getState().selectedProductIds.length;
              if (window.confirm(`Are you sure you want to delete ${count} selected products?`)) {
                useCatalogStore.getState().bulkDeleteSelectedProducts();
              }
            }}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Selected</span>
          </button>
          <button
            type="button"
            onClick={() => useCatalogStore.getState().clearSelectedProducts()}
            className="text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
