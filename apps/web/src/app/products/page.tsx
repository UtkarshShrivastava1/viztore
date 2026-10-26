'use client';

import React, { useCallback, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { useProducts } from '@/hooks/useProducts';
import { ProductCategory, ProductSortOption, type ProductQueryDto } from '@repo/shared-types';
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowDownUp,
} from 'lucide-react';
import { FilterSortBar } from '@/features/catalog/FilterSortBar';
import { SidebarFilter, type FilterState } from '@/features/catalog/SidebarFilter';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read filters from URL
  const query: Partial<ProductQueryDto> = useMemo(
    () => ({
      search: searchParams.get('search') || undefined,
      category: (searchParams.get('category') as ProductCategory) || undefined,
      sort: (searchParams.get('sort') as ProductSortOption) || ProductSortOption.RELEVANCE,
      page: parseInt(searchParams.get('page') || '1'),
      limit: 20,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      storeId: searchParams.get('storeId') || undefined,
    }),
    [searchParams]
  );

  const { data, isLoading } = useProducts(query);
  const products = data?.products || [];
  const meta = data?.meta || {
    page: 1,
    limit: 20,
    total: products.length,
    totalPages: Math.ceil(products.length / 20) || 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  // Local filter states for sidebar integration
  const [sidebarFilters, setSidebarFilters] = useState<FilterState>({
    category: query.category,
    brands: [],
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
    discount: undefined,
    rating: undefined,
  });

  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== 'page') params.set('page', '1');
      router.push(`/products?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleSidebarFilterChange = (newFilters: FilterState) => {
    setSidebarFilters(newFilters);
    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.category) {
      params.set('category', newFilters.category);
    } else {
      params.delete('category');
    }
    if (newFilters.minPrice) {
      params.set('minPrice', String(newFilters.minPrice));
    } else {
      params.delete('minPrice');
    }
    if (newFilters.maxPrice) {
      params.set('maxPrice', String(newFilters.maxPrice));
    } else {
      params.delete('maxPrice');
    }
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-transparent pb-16 lg:pb-12">
      {/* ── BREADCRUMB & HEADER BAR ── */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-semibold text-surface-500"
          >
            <Link href="/" className="hover:text-[#061842] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#061842] font-black">All Products</span>
          </nav>
          <span className="hidden sm:inline-block text-xs font-semibold text-surface-500">
            Showing <strong className="text-[#061842]">{meta.total.toLocaleString()}</strong> items
          </span>
        </div>
      </div>

      {/* ── MOBILE-FIRST STICKY FILTER TOOLBAR (< 1024px) ── */}
      <div className="lg:hidden">
        <FilterSortBar
          totalProducts={meta.total}
          onFilterChange={(f) => {
            if (f.sort) updateFilter('sort', f.sort);
          }}
        />
      </div>

      {/* ── MAIN CONTENT (1440px CONTAINER) ── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8 items-start">
          {/* ── DESKTOP 260px STICKY FACETED SIDEBAR (Web 2.1 / Web 2.1a) ── */}
          <SidebarFilter
            totalCount={meta.total}
            activeFilters={sidebarFilters}
            onFilterChange={handleSidebarFilterChange}
            onClearAll={() => {
              setSidebarFilters({
                category: undefined,
                brands: [],
                minPrice: undefined,
                maxPrice: undefined,
                discount: undefined,
                rating: undefined,
              });
              router.push('/products');
            }}
          />

          {/* ── PRODUCT GRID SECTION ── */}
          <div className="flex-1 min-w-0">
            {/* Desktop Section Header with Sorting Dropdown */}
            <div className="hidden lg:flex items-center justify-between pb-4 border-b border-surface-200 mb-6">
              <div>
                <h1 className="text-2xl font-black text-[#061842] tracking-tight">
                  {query.search ? `Results for "${query.search}"` : 'All Products'}
                </h1>
                <p className="text-xs text-surface-500 font-semibold mt-0.5">
                  Over <strong className="text-[#061842]">{meta.total.toLocaleString()}</strong> products from nearby stores
                </p>
              </div>

              {/* Sorting Dropdown (Web 2.1) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-surface-500">Sort by:</span>
                <div className="relative">
                  <select
                    value={query.sort || ProductSortOption.RELEVANCE}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className="h-9 pl-3 pr-8 rounded-xl bg-white border border-surface-300 text-xs font-black text-[#061842] focus:outline-none focus:ring-2 focus:ring-[#1668F6] appearance-none cursor-pointer shadow-2xs"
                  >
                    <option value={ProductSortOption.RELEVANCE}>Relevance</option>
                    <option value={ProductSortOption.POPULARITY}>Popularity</option>
                    <option value={ProductSortOption.PRICE_ASC}>Price: Low to High</option>
                    <option value={ProductSortOption.PRICE_DESC}>Price: High to Low</option>
                    <option value={ProductSortOption.RATING}>Customer Rating</option>
                    <option value={ProductSortOption.NEWEST}>Newest First</option>
                  </select>
                  <ArrowDownUp className="w-3.5 h-3.5 text-surface-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* ── 4-COLUMN DESKTOP GRID / 2-COLUMN MOBILE CARDS (Web 2.1 / Mob 2.1) ── */}
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-surface-200 shadow-2xs">
                <SlidersHorizontal className="w-10 h-10 mx-auto text-surface-400 mb-3" />
                <h3 className="text-base font-black text-[#061842]">
                  No products match your filters
                </h3>
                <p className="text-xs text-surface-500 mt-1 max-w-sm mx-auto">
                  Try adjusting or clearing your filter selections to see more results.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/products')}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#1668F6] text-white text-xs font-black hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* ── PAGINATION CONTROLS ── */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  type="button"
                  onClick={() => updateFilter('page', String(meta.page - 1))}
                  disabled={!meta.hasPrevPage}
                  className="p-2 rounded-xl border border-surface-200 bg-white text-surface-600 hover:bg-surface-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(meta.totalPages, 5) }).map((_, i) => {
                  const pageNum = i + 1;
                  const isCurrent = meta.page === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => updateFilter('page', String(pageNum))}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                        isCurrent
                          ? 'bg-[#1668F6] text-white shadow-sm'
                          : 'bg-white border border-surface-200 text-surface-700 hover:bg-surface-50'
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
                  className="p-2 rounded-xl border border-surface-200 bg-white text-surface-600 hover:bg-surface-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-transparent">
          <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
            <ProductGridSkeleton count={8} />
          </main>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
