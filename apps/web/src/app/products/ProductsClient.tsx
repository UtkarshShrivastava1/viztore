'use client';

import React, { useCallback, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { useProducts } from '@/hooks/useProducts';
import { ProductCategory, ProductSortOption, type ProductQueryDto } from '@repo/shared-types';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FilterSortBar } from '@/features/catalog/FilterSortBar';

export function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read filters and dynamic faceted attributes from URL
  const query: Partial<ProductQueryDto> = useMemo(() => {
    const rawCategory = searchParams.get('category');
    return {
      search: searchParams.get('search') || searchParams.get('q') || undefined,
      category: (rawCategory as ProductCategory) || undefined,
      sort: (searchParams.get('sort') as ProductSortOption) || ProductSortOption.RELEVANCE,
      page: parseInt(searchParams.get('page') || '1'),
      limit: 20,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      storeId: searchParams.get('storeId') || undefined,
      // Dynamic faceted attributes
      subcategory: searchParams.get('sub') || searchParams.get('subcategory') || undefined,
      brand: searchParams.get('brand') || undefined,
      size: searchParams.get('size') || undefined,
      color: searchParams.get('color') || undefined,
    } as any;
  }, [searchParams]);

  const { data, isLoading } = useProducts(query);
  const products = data?.products || [];
  const meta = data?.meta || { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false };

  const updateFilter = useCallback((key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
      if (key === 'sub') params.delete('subcategory');
      if (key === 'search') params.delete('q');
    }
    // Reset to page 1 when changing filters
    if (key !== 'page') params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  }, [searchParams, router]);

  const subcategory = searchParams.get('sub') || searchParams.get('subcategory');
  const brand = searchParams.get('brand');
  const size = searchParams.get('size');
  const color = searchParams.get('color');

  const activeFilters = useMemo(() => {
    const list: Array<{ key: string; label: string; value: string }> = [];
    if (query.category) {
      list.push({ key: 'category', label: 'Category', value: String(query.category).replace(/[-_]/g, ' ') });
    }
    if (subcategory) {
      list.push({ key: 'sub', label: 'Subcategory', value: subcategory.replace(/[-_]/g, ' ') });
    }
    if (brand) {
      list.push({ key: 'brand', label: 'Brand', value: brand });
    }
    if (size) {
      list.push({ key: 'size', label: 'Size', value: size });
    }
    if (color) {
      list.push({ key: 'color', label: 'Color', value: color });
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const min = query.minPrice ?? 0;
      const max = query.maxPrice ? `₹${query.maxPrice}` : 'Above';
      list.push({ key: 'price', label: 'Price', value: `₹${min} - ${max}` });
    }
    if (query.search) {
      list.push({ key: 'search', label: 'Search', value: `"${query.search}"` });
    }
    return list;
  }, [query, subcategory, brand, size, color]);

  return (
    <div className="min-h-screen bg-transparent">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 capitalize">
              {query.search
                ? `Results for "${query.search}"`
                : query.category
                ? `${String(query.category).replace(/[-_]/g, ' ')} Products`
                : 'All Products'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5 font-medium">
              {meta.total.toLocaleString()} products available
            </p>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {activeFilters.map((f) => (
              <span
                key={f.key}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200"
              >
                <span className="text-blue-400 font-normal">{f.label}:</span>
                <span className="capitalize">{f.value}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (f.key === 'price') {
                      updateFilter('minPrice', undefined);
                      updateFilter('maxPrice', undefined);
                    } else {
                      updateFilter(f.key, undefined);
                    }
                  }}
                  className="hover:text-blue-900 transition-colors ml-0.5 cursor-pointer"
                  title={`Remove ${f.label} filter`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={() => router.push('/products')}
              className="text-xs text-slate-500 hover:text-slate-800 underline font-semibold transition-colors cursor-pointer ml-1"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Filter and Sort Toolbar */}
        <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 overflow-hidden">
          <FilterSortBar totalProducts={meta.total} />
        </div>

        {/* Product Grid */}
        <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 p-4 sm:p-6">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-2xl bg-slate-50/50 border border-slate-200/60 max-w-lg mx-auto my-4">
              <SlidersHorizontal className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="text-slate-700 font-bold text-base">No products match your filters</p>
              <p className="text-slate-400 text-xs mt-1">Try adjusting your filters or search keywords</p>
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              type="button"
              onClick={() => updateFilter('page', String(meta.page - 1))}
              disabled={!meta.hasPrevPage}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(meta.totalPages, 5) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => updateFilter('page', String(pageNum))}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    meta.page === pageNum
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => updateFilter('page', String(meta.page + 1))}
              disabled={!meta.hasNextPage}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export function ProductsClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-transparent">
          <main className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6">
            <ProductGridSkeleton count={8} />
          </main>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

