'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { fetchStoreBySlug } from '@/lib/api/stores';
import { useStoreProducts } from '@/hooks/useStoreProducts';
import { StoreHeroCard } from '@/features/stores/StoreHeroCard';
import { Store, Search, ChevronRight, X, ShoppingBag, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';

interface StoreStorefrontClientProps {
  slug: string;
}

export function StoreStorefrontClient({ slug }: StoreStorefrontClientProps) {
  const [activeTab, setActiveTab] = useState('All Products');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [storeSearch, setStoreSearch] = useState('');
  const [sortOption, setSortOption] = useState<'featured' | 'price_asc' | 'price_desc' | 'discount' | 'newest'>('featured');
  const [priceLimit, setPriceLimit] = useState<number | null>(null);

  const cartItems = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);

  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['store', slug],
    queryFn: () => fetchStoreBySlug(slug),
    enabled: !!slug,
  });

  const { data: productsData, isLoading: productsLoading } = useStoreProducts(
    store?._id || '',
    { limit: 50 },
  );

  const rawProducts = useMemo(() => productsData?.products || [], [productsData]);

  // 1. Dynamic category facet extraction with real counts from catalog
  const categoryFacets = useMemo(() => {
    const countsMap = new Map<string, number>();

    if (productsData?.facets?.categories && productsData.facets.categories.length > 0) {
      productsData.facets.categories.forEach((cat) => {
        if (cat.value && cat.count > 0) {
          const formatted = String(cat.value)
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
          countsMap.set(formatted, (countsMap.get(formatted) || 0) + cat.count);
        }
      });
    } else {
      rawProducts.forEach((p) => {
        const cat = p.category || 'General';
        const formatted = String(cat)
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        countsMap.set(formatted, (countsMap.get(formatted) || 0) + 1);
      });
    }

    return Array.from(countsMap.entries()).map(([name, count]) => ({ name, count }));
  }, [productsData, rawProducts]);

  // 2. Dynamic brand facet extraction with real counts
  const brandFacets = useMemo(() => {
    const countsMap = new Map<string, number>();

    if (productsData?.facets?.brands && productsData.facets.brands.length > 0) {
      productsData.facets.brands.forEach((b) => {
        if (b.value && b.value.trim() && b.count > 0) {
          countsMap.set(b.value.trim(), (countsMap.get(b.value.trim()) || 0) + b.count);
        }
      });
    } else {
      rawProducts.forEach((p) => {
        if (p.brand && p.brand.trim()) {
          const b = p.brand.trim();
          countsMap.set(b, (countsMap.get(b) || 0) + 1);
        }
      });
    }

    return Array.from(countsMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [productsData, rawProducts]);

  // 3. Dynamic price range min/max
  const { minPrice, maxPrice } = useMemo(() => {
    if (rawProducts.length === 0) return { minPrice: 0, maxPrice: 5000 };
    const prices = rawProducts.map((p) => p.basePrice || 0);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [rawProducts]);

  const currentPriceLimit = priceLimit ?? maxPrice;

  // 4. Reactive product filtering based on active sidebar selections, store search & tab
  const filteredProducts = useMemo(() => {
    let result = [...rawProducts];

    // Filter by in-store live search query
    if (storeSearch.trim()) {
      const q = storeSearch.toLowerCase().trim();
      result = result.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const catMatch = p.category?.toLowerCase().includes(q);
        const brandMatch = p.brand?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        return Boolean(nameMatch || catMatch || brandMatch || descMatch);
      });
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => {
        const formatted = String(p.category || '')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return formatted.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand.trim()));
    }

    // Filter by price limit
    if (priceLimit !== null) {
      result = result.filter((p) => (p.basePrice || 0) <= priceLimit);
    }

    // Filter / Sort by active tab
    if (activeTab === 'New Arrivals') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (activeTab === 'Best Deals') {
      result = result.filter((p) => (p.baseMrp && p.baseMrp > p.basePrice) || (p.maxDiscount && p.maxDiscount > 0));
      result.sort((a, b) => (b.maxDiscount || 0) - (a.maxDiscount || 0) || (a.basePrice || 0) - (b.basePrice || 0));
    } else if (activeTab === 'Top Picks') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.basePrice || 0) - (a.basePrice || 0));
    }

    // Apply explicit sort option
    if (sortOption === 'price_asc') {
      result.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
    } else if (sortOption === 'price_desc') {
      result.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
    } else if (sortOption === 'discount') {
      const getDisc = (p: typeof rawProducts[0]) => (p.baseMrp && p.baseMrp > p.basePrice ? ((p.baseMrp - p.basePrice) / p.baseMrp) * 100 : 0);
      result.sort((a, b) => getDisc(b) - getDisc(a));
    } else if (sortOption === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [rawProducts, storeSearch, selectedCategory, selectedBrands, priceLimit, activeTab, sortOption]);

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return brandFacets;
    return brandFacets.filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase().trim()));
  }, [brandFacets, brandSearch]);

  const storeCartItems = useMemo(() => {
    if (!store) return [];
    return cartItems.filter(
      (item) => item.storeId === store._id || item.storeName === store.name,
    );
  }, [cartItems, store]);

  const storeCartCount = useMemo(
    () => storeCartItems.reduce((acc, item) => acc + item.quantity, 0),
    [storeCartItems],
  );

  const storeCartSubtotal = useMemo(
    () => storeCartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
    [storeCartItems],
  );

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedBrands([]);
    setPriceLimit(null);
    setBrandSearch('');
    setStoreSearch('');
    setSortOption('featured');
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    selectedBrands.length +
    (priceLimit !== null ? 1 : 0) +
    (storeSearch ? 1 : 0) +
    (sortOption !== 'featured' ? 1 : 0);

  if (storeLoading) {
    return (
      <div className="min-h-screen bg-transparent pt-16">
        <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-6 space-y-6">
          <div className="skeleton h-64 rounded-[24px]" />
          <div className="flex gap-6">
            <div className="hidden md:block w-[260px] skeleton h-[600px] rounded-2xl" />
            <div className="flex-1">
              <ProductGridSkeleton count={8} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-transparent pt-16">
        <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-20 text-center">
          <Store className="w-16 h-16 mx-auto text-surface-600 mb-4" />
          <h1 className="text-xl font-bold text-surface-700">Store not found</h1>
          <p className="text-sm text-surface-500 mt-2">This store may have been removed or is temporarily unavailable.</p>
          <Link href="/stores" className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors">
            Browse All Stores
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-14 pb-20 md:pb-0">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[12px] font-semibold text-surface-500 mb-4">
          <Link href="/" className="hover:text-brand-500">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/stores" className="hover:text-brand-500">Stores Near You</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#192168]">{store.name}</span>
        </div>

        {/* Store Info Banner Card */}
        <StoreHeroCard store={store} />

        <div className="flex flex-col md:flex-row gap-8 mt-16">
          {/* Desktop Filter Sidebar (Dynamic Catalog Facets) */}
          <aside className="hidden md:block w-[260px] flex-shrink-0">
            <div className="bg-white border border-surface-200 rounded-2xl p-0 sticky top-24 shadow-sm overflow-hidden">

              {/* Categories */}
              <div className="p-5 border-b border-surface-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-extrabold text-[#192168] text-[15px]">Shop by Category</h4>
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label
                    onClick={() => setSelectedCategory(null)}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                      selectedCategory === null
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-surface-600 hover:bg-surface-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Store className={`w-4 h-4 ${selectedCategory === null ? 'text-blue-600' : 'text-surface-400'}`} />
                      <span className="text-[13px]">All Categories</span>
                    </div>
                    <span className="text-[12px] opacity-75">({rawProducts.length})</span>
                  </label>

                  {categoryFacets.map((cat, i) => {
                    const isSelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase();
                    return (
                      <label
                        key={i}
                        onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-surface-600 hover:bg-surface-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Store className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-surface-400'}`} />
                          <span className="text-[13px]">{cat.name}</span>
                        </div>
                        <span className="text-[12px] opacity-75">({cat.count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Filter Section */}
              <div className="p-5 bg-surface-50/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-[#192168] text-[15px]">Filter</h4>
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-[12px] font-bold text-blue-600 hover:text-blue-800"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-[#192168] text-[13px]">Price Range</h5>
                    <span className="text-[12px] font-bold text-blue-600">
                      Up to ₹{currentPriceLimit.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="w-full accent-blue-600 cursor-pointer"
                    min={minPrice}
                    max={maxPrice}
                    value={currentPriceLimit}
                    onChange={(e) => setPriceLimit(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-[11px] text-surface-400 font-medium mt-1">
                    <span>₹{minPrice.toLocaleString()}</span>
                    <span>₹{maxPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-[#192168] text-[13px]">Brand</h5>
                    {selectedBrands.length > 0 && (
                      <span className="text-[11px] font-bold text-blue-600">
                        {selectedBrands.length} selected
                      </span>
                    )}
                  </div>
                  {brandFacets.length > 4 && (
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                      <input
                        type="text"
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        placeholder="Search brands..."
                        className="w-full h-9 pl-9 pr-3 rounded-lg border border-surface-200 bg-white text-[13px] focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                  {filteredBrands.length > 0 ? (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {filteredBrands.map((brand, i) => {
                        const checked = selectedBrands.includes(brand.name);
                        return (
                          <label
                            key={i}
                            className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white cursor-pointer group transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  if (checked) {
                                    setSelectedBrands(selectedBrands.filter((b) => b !== brand.name));
                                  } else {
                                    setSelectedBrands([...selectedBrands, brand.name]);
                                  }
                                }}
                                className="w-4 h-4 rounded border-surface-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                              <span className={`text-[13px] ${checked ? 'font-bold text-blue-700' : 'font-medium text-surface-600'}`}>
                                {brand.name}
                              </span>
                            </div>
                            <span className="text-[11px] text-surface-400 font-medium">({brand.count})</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-surface-400 py-2">No brands available</p>
                  )}
                </div>
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* In-Store Live Search Bar (Amazon / Flipkart Storefront Standard) */}
            <div className="relative mb-5">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                placeholder={`Search products in ${store.name} (e.g. shirt, jacket, sneaker)...`}
                className="w-full h-11 pl-10 pr-10 rounded-xl border border-surface-200 bg-white text-[13px] font-medium text-[#192168] placeholder:text-surface-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-2xs transition-all"
              />
              {storeSearch && (
                <button
                  type="button"
                  onClick={() => setStoreSearch('')}
                  title="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Tabs & Sort Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200 pb-px mb-6">
              <div className="flex overflow-x-auto hide-scrollbar gap-8">
                {['All Products', 'New Arrivals', 'Best Deals', 'Top Picks'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[14px] font-bold whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-blue-600 text-[#192168]'
                        : 'border-transparent text-surface-500 hover:text-[#192168]'
                    }`}
                  >
                    {tab}
                    {tab === 'All Products' && (
                      <span className="ml-1.5 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
                        {filteredProducts.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Sort Selector & Product Count */}
              <div className="flex items-center gap-3 pb-3 sm:pb-4 justify-between sm:justify-end">
                <div className="flex items-center gap-1.5 bg-white border border-surface-200 rounded-xl px-3 py-1.5 shadow-2xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-surface-400" />
                  <span className="text-[11px] font-bold text-surface-500 whitespace-nowrap">Sort:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as 'featured' | 'price_asc' | 'price_desc' | 'discount' | 'newest')}
                    className="text-[12px] font-extrabold text-[#192168] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Featured / Best Match</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="discount">Biggest Discount</option>
                    <option value="newest">New Arrivals</option>
                  </select>
                </div>
                <div className="text-[12px] font-bold text-[#192168]">
                  <span>{filteredProducts.length} items</span>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="text-xs font-bold text-slate-500">Active Filters:</span>
                {storeSearch && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                    Search: "{storeSearch}"
                    <button onClick={() => setStoreSearch('')} className="hover:text-blue-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory(null)} className="hover:text-blue-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {selectedBrands.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200"
                  >
                    Brand: {b}
                    <button
                      onClick={() => setSelectedBrands(selectedBrands.filter((brand) => brand !== b))}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                {priceLimit !== null && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                    ≤ ₹{priceLimit.toLocaleString()}
                    <button onClick={() => setPriceLimit(null)} className="hover:text-blue-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {productsLoading ? (
              <ProductGridSkeleton count={8} />
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white border border-surface-200 rounded-[24px]">
                <Store className="w-12 h-12 mx-auto text-surface-300 mb-4" />
                <p className="text-[15px] text-surface-600 font-extrabold">No products match your active search or filters.</p>
                <p className="text-xs text-surface-400 mt-1 max-w-sm mx-auto">
                  Try checking for spelling errors or clearing your search term to see all store products.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Clear all filters & search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Bottom Cart Bar (Blinkit / Zepto / Amazon Fresh Standard) */}
        {storeCartCount > 0 && (
          <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-700/60 flex items-center justify-between animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center relative shrink-0 shadow-md">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-slate-900">
                  {storeCartCount}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-extrabold text-blue-300 flex items-center gap-1.5 truncate">
                  <span className="truncate">{store.name}</span>
                  <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-emerald-400 font-bold shrink-0">{storeCartCount} item{storeCartCount > 1 ? 's' : ''}</span>
                </div>
                <div className="text-sm sm:text-base font-black text-white">
                  ₹{storeCartSubtotal.toLocaleString('en-IN')}
                  <span className="text-[11px] font-medium text-slate-400 ml-1.5 hidden sm:inline">(plus taxes/delivery)</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={openCart}
              className="px-4 py-2.5 bg-[#1668F6] hover:bg-blue-600 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}