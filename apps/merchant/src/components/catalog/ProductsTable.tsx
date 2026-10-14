import React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCatalogStore, ProductItem } from '../../stores/catalogStore.js';
import { ProductActionMenu } from './ProductActionMenu.js';

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
    kpis,
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

    if (categoryFilter !== 'All Categories' && product.category !== categoryFilter) {
      return false;
    }
    if (subCategoryFilter !== 'All Sub-categories' && product.subCategory !== subCategoryFilter) {
      return false;
    }
    if (productTypeFilter !== 'All Product Types' && product.productType !== productTypeFilter) {
      return false;
    }
    if (brandFilter !== 'All Brands' && product.brand !== brandFilter) {
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
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap">
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

  const renderUpdatedOn = (val: string) => {
    const parts = val.split(/ (?=\d{2}:\d{2})/);
    if (parts.length === 2) {
      return (
        <div className="leading-tight">
          <div className="text-slate-600 whitespace-nowrap">{parts[0]}</div>
          <div className="text-[10px] text-slate-400 whitespace-nowrap">{parts[1]}</div>
        </div>
      );
    }
    return <span className="text-slate-600 whitespace-nowrap">{val}</span>;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
              <th className="py-2.5 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={paginatedProducts.length > 0 && paginatedProducts.every((p) => (useCatalogStore.getState().selectedProductIds || []).includes(p.id))}
                  onChange={() => useCatalogStore.getState().toggleSelectAll()}
                  className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  title="Select All"
                />
              </th>
              <th className="py-2.5 px-3 font-semibold text-slate-600">Product</th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap">SKU</th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap">Barcode</th>
              <th className="py-2.5 px-2.5 font-semibold text-slate-600 whitespace-nowrap">
                Category &amp; Type
              </th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap">Brand</th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap">Stock</th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap">Status</th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap">Price</th>
              <th className="py-2.5 px-2 font-semibold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
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
                const sizeAttr = product.attributes?.size || 'M';
                const colorAttr = product.attributes?.color || 'Black';
                const mainImg =
                  product.images?.[0] ||
                  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80';
                const isSelected = (useCatalogStore.getState().selectedProductIds || []).includes(product.id);

                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}
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
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={mainImg}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200/80 shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0 max-w-[200px] xl:max-w-[240px]">
                          <div
                            className="font-semibold text-slate-800 text-xs truncate"
                            title={product.name}
                          >
                            {product.name}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                            Size: <span className="font-medium text-slate-600">{sizeAttr}</span> •
                            Color: <span className="font-medium text-slate-600">{colorAttr}</span>
                          </div>
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

                    {/* Hierarchy & Type */}
                    <td className="py-2.5 px-2.5 text-[11px] leading-tight whitespace-nowrap">
                      <div className="font-medium text-slate-700">
                        {product.category} &gt; {product.subCategory}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {product.productType}
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="py-2.5 px-2 font-medium text-slate-700 whitespace-nowrap">
                      {product.brand}
                    </td>

                    {/* Stock */}
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 leading-tight">{product.stock}</div>
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
                      {renderUpdatedOn(product.updatedAt)}
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

      {/* Footer Bar: Total count label and pagination controls */}
      <div className="px-4 py-2.5 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="text-slate-600 font-medium">
          Total{' '}
          <span className="font-bold text-blue-600">{kpis.totalProducts.toLocaleString()}</span>{' '}
          products
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px]">
            Page {currentPage} of {totalPages}
          </span>
          <div className="inline-flex rounded-md shadow-2xs">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="p-1.5 rounded-l-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1.5 rounded-r-md border-y border-r border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
