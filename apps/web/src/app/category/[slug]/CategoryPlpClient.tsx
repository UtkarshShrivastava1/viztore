'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api/catalog';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { SubcategoryBubbleFilter } from '@/features/catalog/SubcategoryBubbleFilter';
import { FilterSortBar } from '@/features/catalog/FilterSortBar';
import { SidebarFilter, type FilterState } from '@/features/catalog/SidebarFilter';
import { useCatalogStore } from '@/stores/catalog.store';
import { ChevronRight, SlidersHorizontal, ArrowDownUp } from 'lucide-react';
import { branding, ProductCategory } from '@repo/shared-types';

interface CategoryPlpClientProps {
  slug: string;
}

export function CategoryPlpClient({ slug }: CategoryPlpClientProps) {
  const selectedSubcategory = useCatalogStore((state) => state.selectedSubcategory);
  const activeSort = useCatalogStore((state) => state.activeFilters.sort);
  const setSort = useCatalogStore((state) => state.setSort);

  // Formatted category name
  const categoryTitle = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  // Local filter states for sidebar synchronization
  const [filters, setFilters] = useState<FilterState>({
    category: undefined,
    brands: [],
    minPrice: undefined,
    maxPrice: undefined,
    discount: undefined,
    rating: undefined,
  });

  // Fetch products
  const { data, isLoading } = useQuery({
    queryKey: ['category-products', slug, selectedSubcategory, activeSort],
    queryFn: () =>
      fetchProducts({
        category: slug as ProductCategory,
        subCategory: selectedSubcategory || undefined,
        limit: 24,
      }),
  });

  const rawProducts = data?.products || [];
  const meta = data?.meta || { total: rawProducts.length, page: 1, limit: 24 };

  // Filter client-side if facets applied
  const filteredProducts = useMemo(() => {
    return rawProducts.filter((product) => {
      if (filters.brands.length > 0 && product.brand) {
        if (!filters.brands.includes(product.brand)) return false;
      }
      if (filters.discount && filters.discount > 0) {
        const discount =
          product.baseMrp > 0
            ? Math.round(((product.baseMrp - product.basePrice) / product.baseMrp) * 100)
            : 0;
        if (discount < filters.discount) return false;
      }
      if (filters.rating && filters.rating > 0) {
        if ((product.rating || 4.5) < filters.rating) return false;
      }
      return true;
    });
  }, [rawProducts, filters]);

  const displayTotal = filteredProducts.length || meta.total || 0;

  return (
    <div className="min-h-screen bg-transparent pb-16 lg:pb-12">
      {/* ── BREADCRUMB & HEADER BAR (Desktop) ── */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-surface-500">
            <Link href="/" className="hover:text-[#061842] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/category" className="hover:text-[#061842] transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#061842] font-black">{categoryTitle}</span>
          </nav>

          <p className="hidden md:block text-xs font-semibold text-surface-400">
            Curated local stores & trending styles • {branding.appName}
          </p>
        </div>
      </div>

      {/* ── SUBCATEGORY CIRCULAR BUBBLE RAIL (Mob 2.1) ── */}
      <SubcategoryBubbleFilter />

      {/* ── STICKY FILTER TOOLBAR (Mobile < 768px) ── */}
      <div className="lg:hidden">
        <FilterSortBar
          totalProducts={displayTotal}
          onFilterChange={(newFilters) => {
            if (newFilters.sort) setSort(newFilters.sort as 'popularity' | 'nearest' | 'price_asc' | 'price_desc');
            if (newFilters.rating) setFilters((f) => ({ ...f, rating: newFilters.rating }));
          }}
        />
      </div>

      {/* ── MAIN CONTENT: SIDEBAR + 4-COL PRODUCT GRID ── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8 items-start">
          {/* ── DESKTOP 260px STICKY FACETED SIDEBAR (Web 2.1 / Web 2.1a) ── */}
          <SidebarFilter
            totalCount={displayTotal}
            activeFilters={filters}
            onFilterChange={(newFilters) => setFilters(newFilters)}
            onClearAll={() =>
              setFilters({
                category: undefined,
                brands: [],
                minPrice: undefined,
                maxPrice: undefined,
                discount: undefined,
                rating: undefined,
              })
            }
          />

          {/* ── PRODUCTS SECTION ── */}
          <div className="flex-1 min-w-0">
            {/* Desktop Section Header with Sort Dropdown */}
            <div className="hidden lg:flex items-center justify-between pb-4 border-b border-surface-200 mb-6">
              <div>
                <h1 className="text-2xl font-black text-[#061842] tracking-tight">
                  {categoryTitle}
                </h1>
                <p className="text-xs text-surface-500 font-semibold mt-0.5">
                  Showing <strong className="text-[#061842]">{displayTotal.toLocaleString()}</strong> results from verified local merchants
                </p>
              </div>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-surface-500">Sort by:</span>
                <div className="relative">
                  <select
                    value={activeSort}
                    onChange={(e) => setSort(e.target.value as 'popularity' | 'nearest' | 'price_asc' | 'price_desc')}
                    className="h-9 pl-3 pr-8 rounded-xl bg-white border border-surface-300 text-xs font-black text-[#061842] focus:outline-none focus:ring-2 focus:ring-[#1668F6] appearance-none cursor-pointer shadow-2xs"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="nearest">Nearest First ⚡</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                  <ArrowDownUp className="w-3.5 h-3.5 text-surface-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* ── PRODUCT GRID (Mob 2.1: 2-Col Cards | Web 2.1: 4-Col Grid) ── */}
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-surface-200 shadow-2xs">
                <SlidersHorizontal className="w-10 h-10 mx-auto text-surface-400 mb-3" />
                <h3 className="text-base font-black text-[#061842]">
                  No products found for this selection
                </h3>
                <p className="text-xs text-surface-500 mt-1 max-w-sm mx-auto">
                  Try clearing some filter chips or selecting another subcategory.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      category: undefined,
                      brands: [],
                      minPrice: undefined,
                      maxPrice: undefined,
                      discount: undefined,
                      rating: undefined,
                    });
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#1668F6] text-white text-xs font-black hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
