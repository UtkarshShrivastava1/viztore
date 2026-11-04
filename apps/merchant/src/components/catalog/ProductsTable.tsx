import React from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  Layers,
  Barcode,
  Sparkles,
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
    selectedProductIds,
    setCurrentPage,
    setPageSize,
    toggleSelectAll,
    toggleSelectProduct,
    bulkDeleteSelectedProducts,
    clearSelectedProducts,
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

  const isAllSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((p) => (selectedProductIds || []).includes(p.id));

  const getStockStatusBadge = (stock: number, lowThreshold: number) => {
    if (stock <= 0) {
      return (
        <span className="inline-block text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200/80 px-1.5 py-0.2 rounded">
          Out of Stock
        </span>
      );
    }
    if (stock <= lowThreshold) {
      return (
        <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.2 rounded">
          Low Stock
        </span>
      );
    }
    return (
      <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded">
        In Stock
      </span>
    );
  };

  const getStatusPill = (status: ProductItem['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Inactive
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Draft
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Out of Stock
          </span>
        );
    }
  };

  // Micro-capsule for variants (eliminates line-height explosion and long string wrapping)
  const renderVariantCapsule = (product: ProductItem) => {
    const variantsList = Array.isArray(product.variants) ? product.variants : [];
    const variantCount = variantsList.length;

    if (variantCount > 1) {
      const distinctSizes = Array.from(new Set(variantsList.map((v) => v.size).filter(Boolean)));
      const distinctColors = Array.from(new Set(variantsList.map((v) => v.color).filter(Boolean)));
      const sampleSpecs = [...distinctSizes, ...distinctColors].slice(0, 2).join(', ');

      return (
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Layers className="w-3 h-3 text-blue-500" />
            <span>{variantCount} Variants</span>
          </span>
          {sampleSpecs && (
            <span
              className="text-[10px] text-slate-500 font-medium truncate max-w-[140px]"
              title={[...distinctSizes, ...distinctColors].join(' • ')}
            >
              {sampleSpecs}
            </span>
          )}
        </div>
      );
    }

    if (variantCount === 1 && variantsList[0]) {
      const v = variantsList[0];
      const parts: string[] = [];
      if (v?.size && v.size !== 'Standard') parts.push(v.size);
      if (v?.color && v.color !== 'Standard') parts.push(v.color);
      if (parts.length > 0) {
        return (
          <span className="inline-block mt-0.5 text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
            {parts.join(' • ')}
          </span>
        );
      }
    }

    if (product.attributes?.size || product.attributes?.color) {
      const parts: string[] = [];
      if (product.attributes.size && product.attributes.size !== 'Standard') {
        parts.push(product.attributes.size);
      }
      if (product.attributes.color && product.attributes.color !== 'Standard') {
        parts.push(product.attributes.color);
      }
      if (parts.length > 0) {
        return (
          <span className="inline-block mt-0.5 text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
            {parts.join(' • ')}
          </span>
        );
      }
    }

    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
      {/* Zero-Scroll Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider select-none">
              {/* Checkbox */}
              <th className="py-3 px-3 w-9 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  title="Select All"
                />
              </th>

              {/* Product */}
              <th className="py-3 px-3 font-bold text-slate-700 min-w-[220px]">
                Product
              </th>

              {/* Identifiers: SKU & Barcode (Consolidated) */}
              <th className="py-3 px-3 font-bold text-slate-700 w-36">
                Identifiers
              </th>

              {/* Category & Brand (Consolidated) */}
              <th className="py-3 px-3 font-bold text-slate-700 w-44">
                Category &amp; Brand
              </th>

              {/* Stock */}
              <th className="py-3 px-3 font-bold text-slate-700 w-24 text-right">
                Stock
              </th>

              {/* Price */}
              <th className="py-3 px-3 font-bold text-slate-700 w-24 text-right">
                Price
              </th>

              {/* Status */}
              <th className="py-3 px-3 font-bold text-slate-700 w-24 text-center">
                Status
              </th>

              {/* Updated */}
              <th className="py-3 px-3 font-bold text-slate-700 w-24 text-right">
                Updated
              </th>

              {/* Actions */}
              <th className="py-3 px-3 font-bold text-slate-700 text-center w-12">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-1">
                    <p className="font-semibold text-slate-600 text-sm">No products found</p>
                    <p className="text-xs text-slate-400">
                      Try adjusting your search query or reset the active filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => {
                const isSelected = (selectedProductIds || []).includes(product.id);
                const { date, time } = formatDateTime(product.updatedAt);
                const mainImg =
                  product.images?.[0] ||
                  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80';

                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 w-9 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectProduct(product.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                      />
                    </td>

                    {/* Product */}
                    <td className="py-3 px-3 min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={mainImg}
                          alt={product.name}
                          className="w-11 h-11 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shrink-0 shadow-3xs"
                          loading="lazy"
                        />
                        <div className="min-w-0 max-w-[220px] xl:max-w-[260px]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className="font-bold text-slate-900 text-xs truncate block max-w-[180px] xl:max-w-[210px] hover:text-blue-600 cursor-pointer transition-colors"
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
                          {renderVariantCapsule(product)}
                        </div>
                      </div>
                    </td>

                    {/* Identifiers (Consolidated SKU & Barcode) */}
                    <td className="py-3 px-3 w-36 font-mono text-[11px]">
                      <div className="font-semibold text-slate-800 tracking-tight truncate" title={product.sku}>
                        {product.sku}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 truncate" title={product.barcode || 'No barcode'}>
                        <Barcode className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{product.barcode || '—'}</span>
                      </div>
                    </td>

                    {/* Category & Brand (Consolidated) */}
                    <td className="py-3 px-3 w-44">
                      <div className="text-[11px] font-semibold text-slate-700 truncate" title={`${product.category} > ${product.subCategory}`}>
                        {formatCategoryTitle(product.category)} &gt; {formatCategoryTitle(product.subCategory)}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/70">
                          {product.brand || 'Unbranded'}
                        </span>
                        {product.productType && (
                          <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
                            {formatCategoryTitle(product.productType)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-3 w-24 text-right">
                      <div className="font-black text-slate-900 text-sm font-mono leading-tight">
                        {product.stock}
                      </div>
                      <div className="mt-0.5">
                        {getStockStatusBadge(product.stock, product.lowStockThreshold || 10)}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 w-24 text-right">
                      <div className="font-black text-slate-900 text-sm font-mono">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      {product.mrp && product.mrp > product.price && (
                        <div className="text-[10px] text-slate-400 font-mono line-through mt-0.5">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 w-24 text-center">
                      {getStatusPill(product.status)}
                    </td>

                    {/* Updated */}
                    <td className="py-3 px-3 w-24 text-right">
                      <div className="text-slate-700 font-semibold text-[11px] whitespace-nowrap">
                        {date}
                      </div>
                      {time && (
                        <div className="text-[10px] text-slate-400 whitespace-nowrap">
                          {time}
                        </div>
                      )}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3 px-3 w-12 text-center">
                      <ProductActionMenu product={product} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Bar: Total count and pagination */}
      <div className="px-4 py-3 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
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
                className="appearance-none bg-white border border-slate-200 rounded-lg px-2.5 py-1 pr-6 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-3xs"
              >
                <option value={8}>8</option>
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <span className="text-slate-500 text-[11px] tabular-nums font-mono">
            {totalFiltered === 0 ? 0 : startIndex + 1}-{endIndex} of{' '}
            {totalFiltered.toLocaleString()}
          </span>

          <div className="inline-flex rounded-lg shadow-3xs overflow-hidden border border-slate-200 bg-white">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage(1)}
              className="p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage(safePage - 1)}
              className="p-1.5 border-l border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage(safePage + 1)}
              className="p-1.5 border-l border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="p-1.5 border-l border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {(selectedProductIds || []).length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 border border-slate-700">
          <span className="text-xs font-bold">
            {selectedProductIds.length} products selected
          </span>
          <button
            type="button"
            onClick={() => {
              const count = selectedProductIds.length;
              if (window.confirm(`Are you sure you want to delete ${count} selected products?`)) {
                bulkDeleteSelectedProducts();
              }
            }}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Selected</span>
          </button>
          <button
            type="button"
            onClick={clearSelectedProducts}
            className="text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
