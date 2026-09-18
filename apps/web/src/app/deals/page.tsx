'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { DealProductCard } from '@/features/deals/components/DealProductCard';
import { DealsFilterSidebar } from '@/features/deals/components/DealsFilterSidebar';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { ChevronDown, SlidersHorizontal, Percent } from 'lucide-react';

export default function DealsPage() {
  const { data: featuredProducts, isLoading } = useFeaturedProducts(20);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-14 pb-20 md:pb-0">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-surface-500 mb-4">
          <Link href="/" className="hover:text-[#1668F6] transition-colors">Home</Link>
          <span className="text-surface-300">›</span>
          <span className="text-surface-500">Best Deals</span>
        </div>

        {/* Hero Banner */}
        <div className="w-full bg-[#192168] rounded-2xl md:rounded-[24px] p-6 md:p-10 mb-8 relative overflow-hidden flex flex-col justify-center min-h-[160px]">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-5 h-5 md:w-6 md:h-6 text-[#1668F6]" />
              <span className="text-sm font-bold text-[#1668F6] tracking-wider uppercase">Mega Savings</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">Best Deals For You</h1>
            <p className="text-surface-200 text-sm md:text-base font-medium max-w-xl">
              Shop top discounts from trusted local stores. Unbeatable prices on your favorite brands, delivered fast.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-between bg-white border border-surface-200 p-4 rounded-xl font-bold text-[#192168]"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters & Sort</span>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Sidebar */}
          <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
             <DealsFilterSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 bg-white border border-surface-200 p-3 px-5 rounded-xl">
              <span className="text-sm font-bold text-[#192168]">
                {isLoading ? 'Loading...' : `${featuredProducts?.length || 0} Deals`} <span className="text-surface-500 font-medium">Found</span>
              </span>
              
              <div className="flex items-center gap-2 text-sm font-semibold text-[#192168]">
                Sort by:
                <select className="bg-surface-50 border border-surface-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1668F6]">
                  <option>Biggest Discount</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <ProductGridSkeleton count={10} />
            ) : featuredProducts && featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
                {featuredProducts.map((product) => (
                  <DealProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white border border-surface-200 rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Percent className="w-8 h-8 text-surface-400" />
                </div>
                <p className="text-[#061842] text-lg font-extrabold">No deals found matching your criteria.</p>
                <p className="text-surface-500 text-sm mt-1 font-medium max-w-md mx-auto">Try adjusting your filters or check back later for new offers.</p>
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
