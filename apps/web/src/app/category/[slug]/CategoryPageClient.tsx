'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Smartphone,
  Shirt,
  Sparkles,
  Baby,
  Sofa,
  ShoppingBasket,
  Trophy,
  Dumbbell,
  HeartPulse,
  Book,
  PenTool,
  Car,
  Wrench,
  Stethoscope,
  Music,
  Film,
  Gamepad2,
  Store as StoreIcon,
  ShoppingBag,
  ShieldCheck,
  RotateCcw,
  Clock,
  ArrowRight,
  ChevronRight,
  Search,
  SlidersHorizontal,
  PackageOpen,
  type LucideIcon,
} from 'lucide-react';
import { ProductSortOption } from '@repo/shared-types';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductCard } from '@/features/products/components/ProductCard';
import { StoreCard } from '@/features/stores/components/StoreCard';
import { useProducts } from '@/hooks/useProducts';
import { useAllStores } from '@/hooks/useAllStores';
import type { CanonicalCategory } from '@/features/category';

const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone,
  Shirt,
  Sparkles,
  Baby,
  Sofa,
  ShoppingBasket,
  Trophy,
  Dumbbell,
  HeartPulse,
  Book,
  PenTool,
  Car,
  Wrench,
  Stethoscope,
  Music,
  Film,
  Gamepad2,
};

interface CategoryPageClientProps {
  category: CanonicalCategory;
  slug?: string;
}

export function CategoryPageClient({ category }: CategoryPageClientProps) {
  const searchParams = useSearchParams();
  const initialSub = searchParams?.get('sub') || 'all';

  const [selectedSub, setSelectedSub] = useState<string>(initialSub);
  const [sortOption, setSortOption] = useState<ProductSortOption>(ProductSortOption.RELEVANCE);
  const [productSearch, setProductSearch] = useState<string>('');

  const Icon = ICON_MAP[category.iconName] || Smartphone;

  // 1. Fetch real products for this category
  const productQueryParams = useMemo(() => {
    return {
      category: category.canonicalName,
      subCategory: selectedSub !== 'all' ? selectedSub : undefined,
      search: productSearch.trim() || undefined,
      sort: sortOption,
      limit: 30,
    };
  }, [category.canonicalName, selectedSub, productSearch, sortOption]);

  const { data: productsResponse, isLoading: isProductsLoading } = useProducts(productQueryParams);

  // Fallback query if category has 0 direct matches (e.g. general search)
  const products = productsResponse?.products || [];

  // 2. Fetch real stores operating strictly in this category
  const storeQueryParams = useMemo(() => {
    return {
      category: category.storeCategory,
      limit: 8,
    };
  }, [category.storeCategory]);

  const { data: storesResponse, isLoading: isStoresLoading } = useAllStores(storeQueryParams);

  // Strictly category-isolated stores — zero foreign category bleed
  const stores = storesResponse?.stores || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Banner Navigation & Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'All Categories', href: '/category' },
              { label: category.label },
            ]}
          />
        </div>
      </div>

      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Dynamic Category Hero Section with Viztore Palette */}
        <section className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-950 text-white min-h-[220px] sm:min-h-[280px] flex items-center">
          <img
            src={category.heroImage}
            alt={category.label}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-45 mix-blend-overlay"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-95`} />

          <div className="relative z-10 p-6 sm:p-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs backdrop-blur-md"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
              >
                <Icon className="w-4 h-4" style={{ color: category.color }} strokeWidth={2.5} />
              </div>
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                Official Department
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 30-45 Min Doorstep Delivery
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {category.label}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-2xl line-clamp-2">
              {category.tagline}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#products-section"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-950 text-xs sm:text-sm font-extrabold hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#1668F6]" />
                Browse {products.length > 0 ? `${products.length}+ Products` : 'Products'}
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>

              <a
                href="#stores-section"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold border border-white/25 transition-colors cursor-pointer"
              >
                <StoreIcon className="w-4 h-4" />
                Find Nearby Stores
              </a>
            </div>
          </div>

          {/* Right Trust Badges */}
          <div className="hidden xl:flex flex-col gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-10">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-white">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-left leading-tight">
                <div className="text-xs font-bold">100% Authentic Stock</div>
                <div className="text-[11px] text-slate-300">Verified Local Merchants</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-white">
              <RotateCcw className="w-6 h-6 text-blue-400 shrink-0" />
              <div className="text-left leading-tight">
                <div className="text-xs font-bold">Easy Local Returns</div>
                <div className="text-[11px] text-slate-300">Instant Store Resolution</div>
              </div>
            </div>
          </div>
        </section>

        {/* Subcategories Horizontal Filter Bar */}
        <section className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#0B1953]">
                Departments & Subcategories in {category.label}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Click any subcategory to filter products instantly
              </p>
            </div>
            {selectedSub !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedSub('all')}
                className="text-xs font-bold text-[#1668F6] hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            <button
              type="button"
              onClick={() => setSelectedSub('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedSub === 'all'
                  ? 'bg-[#1668F6] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Items ({category.subcategories.length})
            </button>

            {category.subcategories.map((sub) => {
              const isSelected = selectedSub === sub.name;
              return (
                <button
                  key={sub.name}
                  type="button"
                  onClick={() => setSelectedSub(sub.name)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#EBF2FE] border-[#1668F6] text-[#1668F6] font-bold shadow-2xs'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={sub.imageUrl}
                    alt={sub.name}
                    className="w-5 h-5 rounded-md object-cover"
                    loading="lazy"
                  />
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 1: Local Stores in this Category */}
        <section id="stores-section" className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <StoreIcon className="w-5 h-5 text-[#1668F6]" />
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0B1953]">
                  Verified Local Stores Selling {category.label}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Verified retailers across Durg & Bhilai ready for same-day & 24–48h delivery
              </p>
            </div>
            <Link
              href={`/stores?category=${category.id}`}
              className="text-xs font-bold text-[#1668F6] hover:text-[#0B1953] flex items-center gap-1 group self-start sm:self-auto"
            >
              Explore all stores <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {isStoresLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-44 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : stores.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stores.map((store) => (
                <StoreCard key={store._id || store.slug} store={store} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
              <StoreIcon className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No stores found specifically for this category yet</div>
              <p className="text-xs text-slate-500">Explore general nearby stores in Bhilai:</p>
              <Link
                href="/stores"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1668F6] text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition-colors mt-2"
              >
                View All Nearby Stores
              </Link>
            </div>
          )}
        </section>

        {/* SECTION 2: Catalog Products in this Category */}
        <section id="products-section" className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
          {/* Controls Bar: Subcategory indicator, live search, sorting */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#1668F6]" />
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0B1953]">
                  {selectedSub !== 'all' ? `${selectedSub} Products` : `${category.label} Catalog`}
                </h2>
                {!isProductsLoading && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    {products.length} Items
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Authentic products available directly from nearby local storefronts
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Search Input */}
              <div className="relative min-w-[200px] sm:min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search in ${category.shortLabel}...`}
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#1668F6]/20 focus:border-[#1668F6] transition-all"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as ProductSortOption)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#1668F6]/20 cursor-pointer"
                >
                  <option value={ProductSortOption.RELEVANCE}>Featured</option>
                  <option value={ProductSortOption.PRICE_ASC}>Price: Low to High</option>
                  <option value={ProductSortOption.PRICE_DESC}>Price: High to Low</option>
                  <option value={ProductSortOption.DISCOUNT}>Highest Discount</option>
                  <option value={ProductSortOption.NEWEST}>Newest Arrivals</option>
                  <option value={ProductSortOption.RATING}>Customer Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {isProductsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-3xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
              <PackageOpen className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No products found {selectedSub !== 'all' ? `in "${selectedSub}"` : `in ${category.label}`}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Local retailers in Bhilai are rapidly onboarding stock for this category. You can reset filters or discover other departments.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                {selectedSub !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedSub('all')}
                    className="px-4 py-2 rounded-xl bg-[#1668F6] text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition-colors"
                  >
                    View All {category.shortLabel} Products
                  </button>
                )}
                <Link
                  href="/category"
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Browse All 17 Departments
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
