'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { fetchStoreBySlug } from '@/lib/api/stores';
import { useStoreProducts } from '@/hooks/useStoreProducts';
import { StoreHeroCard } from '@/features/stores/StoreHeroCard';
import { Store, Search, ChevronDown, ChevronRight } from 'lucide-react';

interface StoreStorefrontClientProps {
  slug: string;
}

export function StoreStorefrontClient({ slug }: StoreStorefrontClientProps) {
  const [activeTab, setActiveTab] = useState('All Products');
  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['store', slug],
    queryFn: () => fetchStoreBySlug(slug),
    enabled: !!slug,
  });

  const { data: productsData, isLoading: productsLoading } = useStoreProducts(
    store?._id || '',
    { limit: 20 },
  );

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
        <Footer />
      </div>
    );
  }

  const products = productsData?.products || [];
  const newArrivals = products.slice(0, 4);
  const bestDeals = products.slice(4, 8);

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
          {/* Desktop Filter Sidebar (Flipkart Style) */}
          <aside className="hidden md:block w-[260px] flex-shrink-0">
            <div className="bg-white border border-surface-200 rounded-2xl p-0 sticky top-24 shadow-sm overflow-hidden">

              {/* Categories */}
              <div className="p-5 border-b border-surface-100">
                <h4 className="font-extrabold text-[#192168] text-[15px] mb-4">Shop by Category</h4>
                <div className="space-y-4">
                  {[
                    { name: 'Men\'s Fashion', count: 120 },
                    { name: 'Women\'s Fashion', count: 95 },
                    { name: 'Kids Wear', count: 35 },
                    { name: 'Footwear', count: 28 },
                    { name: 'Bags & Backpacks', count: 22 },
                    { name: 'Accessories', count: 40 },
                    { name: 'Sports Wear', count: 18 },
                    { name: 'Ethnic Wear', count: 26 },
                    { name: 'Winter Wear', count: 15 },
                  ].map((cat, i) => (
                    <label key={i} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <Store className="w-4 h-4 text-surface-400 group-hover:text-brand-500 transition-colors" />
                        <span className="text-[14px] text-surface-600 font-medium group-hover:text-brand-600 transition-colors">{cat.name}</span>
                      </div>
                      <span className="text-[12px] text-surface-400 font-medium">({cat.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Section */}
              <div className="p-5 bg-surface-50/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-extrabold text-[#192168] text-[15px]">Filter</h4>
                  <button className="text-[12px] font-bold text-brand-500 hover:text-brand-600">Clear All</button>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h5 className="font-bold text-[#192168] text-[13px] mb-3">Price Range</h5>
                  <p className="text-[12px] text-surface-500 font-medium mb-3">₹0 - ₹5000</p>
                  <input type="range" className="w-full accent-brand-500" min="0" max="5000" defaultValue="5000" />
                </div>

                {/* Brand Filter */}
                <div>
                  <h5 className="font-bold text-[#192168] text-[13px] mb-3">Brand</h5>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input type="text" placeholder="Search brands..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-surface-200 bg-white text-[13px] focus:outline-none focus:border-brand-500" />
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Puma', count: 24 },
                      { name: 'Nike', count: 18 },
                      { name: 'Adidas', count: 21 },
                    ].map((brand, i) => (
                      <label key={i} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500 cursor-pointer" />
                          <span className="text-[14px] text-surface-600 font-medium">{brand.name}</span>
                        </div>
                        <span className="text-[12px] text-surface-400">({brand.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* Tabs & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200 pb-px mb-6">
              <div className="flex overflow-x-auto hide-scrollbar gap-8">
                {['All Products', 'New Arrivals', 'Best Deals', 'Top Picks'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[14px] font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-brand-500 text-[#192168]' : 'border-transparent text-surface-500 hover:text-[#192168]'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button className="hidden sm:flex items-center gap-2 text-[13px] font-bold text-[#192168] pb-4">
                Sort by: Popular <ChevronDown className="w-4 h-4 text-surface-400" />
              </button>
            </div>

            {productsLoading ? (
              <ProductGridSkeleton count={8} />
            ) : products.length > 0 ? (
              <div className="space-y-12">
                {/* New Arrivals Section */}
                {newArrivals.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[18px] font-extrabold text-[#192168]">New Arrivals</h3>
                      <Link href="#" className="flex items-center gap-1 text-[13px] font-bold text-brand-600">
                        View All <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {newArrivals.map(product => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Best Deals Section */}
                {bestDeals.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[18px] font-extrabold text-[#192168]">Best Deals</h3>
                      <Link href="#" className="flex items-center gap-1 text-[13px] font-bold text-brand-600">
                        View All <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {bestDeals.map(product => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center bg-white border border-surface-200 rounded-[24px]">
                <Store className="w-12 h-12 mx-auto text-surface-300 mb-4" />
                <p className="text-[15px] text-surface-600 font-extrabold">This store hasn't listed any products yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}