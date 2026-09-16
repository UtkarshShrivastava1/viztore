'use client';

import React, { useState, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { useProducts } from '@/hooks/useProducts';
import { useLocationStore } from '@/stores/location.store';
import { ProductCategory, ProductSortOption, type ProductQueryDto } from '@repo/shared-types';
import { SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { SubcategoryBubbleFilter } from '@/features/catalog/SubcategoryBubbleFilter';
import { FilterSortBar } from '@/features/catalog/FilterSortBar';

const sortOptions = [
  { label: 'Relevance', value: ProductSortOption.RELEVANCE },
  { label: 'Price: Low → High', value: ProductSortOption.PRICE_ASC },
  { label: 'Price: High → Low', value: ProductSortOption.PRICE_DESC },
  { label: 'Highest Rated', value: ProductSortOption.RATING },
  { label: 'Newest First', value: ProductSortOption.NEWEST },
  { label: 'Best Discounts', value: ProductSortOption.DISCOUNT },
  { label: 'Most Popular', value: ProductSortOption.POPULARITY },
];

const categoryOptions = [
  { label: 'All', value: '' },
  ...Object.values(ProductCategory).map((cat) => ({
    label: cat.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    value: cat,
  })),
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { address } = useLocationStore();
  const [showFilters, setShowFilters] = useState(false);

  // Read filters from URL
  const query: Partial<ProductQueryDto> = useMemo(() => ({
    search: searchParams.get('search') || undefined,
    category: (searchParams.get('category') as ProductCategory) || undefined,
    sort: (searchParams.get('sort') as ProductSortOption) || ProductSortOption.RELEVANCE,
    page: parseInt(searchParams.get('page') || '1'),
    limit: 20,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    storeId: searchParams.get('storeId') || undefined,
  }), [searchParams]);

  const { data, isLoading } = useProducts(query);
  const products = data?.products || [];
  const meta = data?.meta || { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false };

  const updateFilter = useCallback((key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 when changing filters
    if (key !== 'page') params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  }, [searchParams, router]);

  const activeFilterCount = [
    query.category,
    query.search,
    query.minPrice,
    query.maxPrice,
    query.storeId,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-transparent">
      {/* <Header address={address} className="hidden md:block" /> */}

      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-100">
              {query.search ? `Results for "${query.search}"` : 'All Products'}
            </h1>
            <p className="text-sm text-surface-400 mt-0.5">
              {meta.total.toLocaleString()} products found
            </p>
          </div>
        </div>



        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {query.category && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/10 text-brand-400 text-xs font-medium border border-brand-500/20">
                {query.category.replace('_', ' ')}
                <button onClick={() => updateFilter('category', undefined)} className="hover:text-brand-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {query.search && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-800 text-surface-300 text-xs font-medium">
                Search: {query.search}
                <button onClick={() => updateFilter('search', undefined)} className="hover:text-surface-100">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => router.push('/products')}
              className="text-xs text-surface-500 hover:text-surface-300 underline transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Mobile-first Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <FilterSortBar totalProducts={meta.total} />
        </div>

        {/* Product Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center glass-card rounded-2xl">
              <SlidersHorizontal className="w-10 h-10 mx-auto text-surface-600 mb-3" />
              <p className="text-surface-400 text-sm">No products match your filters.</p>
              <button
                onClick={() => router.push('/products')}
                className="mt-4 px-5 py-2 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => updateFilter('page', String(meta.page - 1))}
              disabled={!meta.hasPrevPage}
              className="p-2 rounded-lg bg-surface-900 text-surface-400 hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(meta.totalPages, 5) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => updateFilter('page', String(pageNum))}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${meta.page === pageNum
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-900 text-surface-400 hover:bg-surface-800'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => updateFilter('page', String(meta.page + 1))}
              disabled={!meta.hasNextPage}
              className="p-2 rounded-lg bg-surface-900 text-surface-400 hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-transparent">
          <Header className="hidden md:block" />
          <main className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6">
            <ProductGridSkeleton count={8} />
          </main>
          <Footer />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
