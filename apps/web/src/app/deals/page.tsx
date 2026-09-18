'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { DealProductCard } from '@/features/deals/components/DealProductCard';
import { DealsFilterSidebar } from '@/features/deals/components/DealsFilterSidebar';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { ChevronDown, SlidersHorizontal, Percent, ShieldCheck, RefreshCw, Shield } from 'lucide-react';

export default function DealsPage() {
  const { data: featuredProducts, isLoading } = useFeaturedProducts(20);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-5 pb-20 md:pb-0">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-surface-500 mb-4">
          <Link href="/" className="hover:text-[#1668F6] transition-colors">Home</Link>
          <span className="text-surface-300">›</span>
          <span className="text-surface-500">Best Deals</span>
        </div>

        {/* Hero Banner */}
        <div className="w-full bg-gradient-to-r from-[#EBF4FF] via-[#E2EEFF] to-[#F1F7FF] rounded-2xl md:rounded-[24px] p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between min-h-[240px] gap-6">
          {/* Decorative Waves */}
          <div className="absolute bottom-0 left-0 right-0 top-0 opacity-40 pointer-events-none">
             <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full" preserveAspectRatio="none">
                <path fill="#ffffff" fillOpacity="0.8" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,160C672,160,768,192,864,202.7C960,213,1056,203,1152,176C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
             </svg>
          </div>
          
          {/* Left Content */}
          <div className="relative z-10 max-w-md text-center lg:text-left">
            <h1 className="text-4xl md:text-[44px] font-extrabold text-[#09153D] mb-3 leading-[1.1] tracking-tight">
              Best Deals for You
            </h1>
            <p className="text-surface-600 text-sm md:text-[17px] font-medium leading-snug">
              Unbeatable offers from trusted local stores. Great products. Greater savings.
            </p>
          </div>

          {/* Middle Graphics (Products & Text) */}
          <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center w-full min-h-[160px]">
             {/* Text "Big Savings Local Stores Bigger Possibilities" in cursive script */}
             <div className="hidden xl:flex flex-col transform -rotate-[8deg] -translate-y-4 mr-6 z-20 font-bold">
                <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');`}} />
                <div style={{ fontFamily: "'Caveat', cursive" }} className="text-[#09153D] text-[28px] leading-[0.85] tracking-tight">Big Savings</div>
                <div style={{ fontFamily: "'Caveat', cursive" }} className="text-[#09153D] text-[28px] leading-[0.85] tracking-tight ml-4">Local Stores</div>
                <div style={{ fontFamily: "'Caveat', cursive" }} className="text-[#1668F6] text-[32px] leading-[0.85] tracking-tight mt-1">Bigger Possibilities</div>
             </div>
             
             {/* Mocked Products Stack */}
             <div className="relative w-64 h-40 flex items-center justify-center drop-shadow-xl mix-blend-darken">
                {/* Headphones */}
                <img 
                  src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200&bg=transparent" 
                  alt="Headphones" 
                  className="absolute left-0 w-32 h-32 object-cover rounded-xl shadow-lg -rotate-6 z-10" 
                />
                {/* Watch */}
                <img 
                  src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=150&bg=transparent" 
                  alt="Watch" 
                  className="absolute right-8 top-2 w-24 h-24 object-cover rounded-xl shadow-md z-20 border-2 border-white" 
                />
                {/* Shoes */}
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=250&bg=transparent" 
                  alt="Shoes" 
                  className="absolute right-[-20px] bottom-[-10px] w-40 h-32 object-cover rounded-xl shadow-xl rotate-12 z-30" 
                />
             </div>
          </div>

          {/* Right Features */}
          <div className="relative z-10 flex flex-col gap-4 bg-white/70 backdrop-blur-md rounded-2xl p-5 min-w-[220px] shadow-sm border border-white/50">
             <div className="flex items-center gap-3">
                <div className="p-1.5 bg-[#EBF4FF] rounded-full text-[#1668F6]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                   <div className="text-[13px] font-extrabold text-[#09153D] leading-tight">100% Authentic</div>
                   <div className="text-[11px] text-surface-500 font-semibold leading-tight mt-0.5">Products</div>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-1.5 bg-[#EBF4FF] rounded-full text-[#1668F6]">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                   <div className="text-[13px] font-extrabold text-[#09153D] leading-tight">Easy Returns</div>
                   <div className="text-[11px] text-surface-500 font-semibold leading-tight mt-0.5">7 Days Return</div>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-1.5 bg-[#EBF4FF] rounded-full text-[#1668F6]">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                   <div className="text-[13px] font-extrabold text-[#09153D] leading-tight">Secure Payments</div>
                   <div className="text-[11px] text-surface-500 font-semibold leading-tight mt-0.5">100% Secure</div>
                </div>
             </div>
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
