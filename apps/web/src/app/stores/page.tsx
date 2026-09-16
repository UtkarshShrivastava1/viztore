'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { StoreCardSkeleton } from '@/components/ui/Skeleton';
import { useNearbyStores } from '@/hooks/useNearbyStores';
import { useLocationStore } from '@/stores/location.store';
import { MapPin, Search, Grid, List, CheckCircle2, Navigation, TrendingUp, Star, Clock, Tag, LayoutGrid, Truck, ShieldCheck, BadgePercent } from 'lucide-react';
import { StoreCategory } from '@repo/shared-types';
import { StoreCard } from '@/features/stores/components/StoreCard';

const filters = [
  { label: 'Categories', icon: LayoutGrid },
  { label: 'Distance', icon: MapPin },
  { label: 'Ratings', icon: Star },
  { label: 'Open Now', icon: Clock },
  { label: 'Offers', icon: Tag },
];

export default function StoresPage() {
  const { lng, lat, address } = useLocationStore();
  const [activeCategory, setActiveCategory] = useState<StoreCategory | undefined>(undefined);
  const { data: stores, isLoading } = useNearbyStores(lng, lat, 10, activeCategory);
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');

  return (
    <div className="min-h-screen bg-transparent pt-14 pb-20 md:pb-0">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-6 space-y-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-surface-500 mb-2">
          <Link href="/" className="hover:text-[#1668F6] transition-colors">Home</Link>
          <span className="text-surface-300">›</span>
          <span className="text-surface-500">Stores <span className="text-[#1668F6]">Near You</span></span>
        </div>

        {/* Hero Banner */}
        <div className="flex flex-col lg:flex-row gap-6 relative">
          
          {/* Main Hero Area (Text + Map) */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-50/50 via-blue-50/30 to-blue-50/80 rounded-[24px] overflow-hidden relative border border-blue-100/50">
            {/* Map background pattern overlay */}
            <div className="absolute inset-0 right-0 md:left-1/3 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] mix-blend-multiply pointer-events-none" />
            
            {/* Left Text Area */}
            <div className="p-8 md:p-10 z-10 w-full md:w-auto">
              <h1 className="text-3xl md:text-[40px] leading-tight font-extrabold text-[#061842] mb-3 tracking-tight">Stores Near You</h1>
              <p className="text-[17px] font-bold text-[#061842] mb-1.5">Discover trusted local stores around you.</p>
              <p className="text-[14px] font-medium text-surface-500">Shop from nearby stores and support your local community.</p>
            </div>
            
            {/* Center Map Pill */}
            <div className="p-8 md:p-10 z-10 flex items-center justify-center w-full md:w-auto mt-4 md:mt-0">
               <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
                 <div className="relative flex items-center justify-center shrink-0">
                   <MapPin className="w-10 h-10 text-[#1668F6]" fill="currentColor" strokeWidth={1} />
                   <div className="absolute w-2.5 h-2.5 bg-white rounded-full top-[10px]" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[11px] font-bold text-[#1668F6] tracking-wide">Near you</span>
                   <span className="text-[14px] font-extrabold text-[#061842]">{address || "Bhilai, Chhattisgarh"}</span>
                 </div>
               </div>
            </div>
          </div>
          
          {/* Right Trust Badges */}
          <div className="w-full lg:w-[320px] bg-[#F8FAFC] rounded-[24px] p-6 flex flex-col justify-center gap-5 border border-surface-100 shrink-0">
            <div className="flex items-center gap-4">
              <div className="text-[#1668F6] shrink-0">
                <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <p className="font-extrabold text-[13px] text-[#061842] leading-tight">Support Local Businesses</p>
                <p className="text-[11px] text-surface-500 font-medium">Stronger communities</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-[#1668F6] shrink-0">
                <Truck className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <p className="font-extrabold text-[13px] text-[#061842] leading-tight">Same Day Pickup</p>
                <p className="text-[11px] text-surface-500 font-medium">Convenient & Fast</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-[#1668F6] shrink-0">
                <ShieldCheck className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <p className="font-extrabold text-[13px] text-[#061842] leading-tight">Trusted Stores</p>
                <p className="text-[11px] text-surface-500 font-medium">Verified & Reliable</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col xl:flex-row items-center gap-4 pt-4">
           {/* Search */}
           <div className="relative w-full xl:w-[320px] shrink-0">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
             <input 
               type="text" 
               placeholder="Search stores or products..." 
               className="w-full h-11 pl-11 pr-4 rounded-xl bg-white border border-surface-200 text-[13px] font-semibold text-[#061842] placeholder:text-surface-400 focus:outline-none focus:border-[#1668F6] focus:ring-1 focus:ring-[#1668F6] shadow-sm transition-all"
             />
           </div>
           
           {/* Filters */}
           <div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 xl:pb-0 w-full">
              {filters.map(filter => {
                const Icon = filter.icon;
                return (
                  <button key={filter.label} className="px-4 py-2.5 rounded-xl bg-white border border-surface-200 text-[13px] font-bold text-[#061842] whitespace-nowrap hover:bg-surface-50 hover:border-surface-300 transition-all flex items-center gap-2 shadow-sm shrink-0">
                    {Icon && <Icon className="w-4 h-4 text-[#061842]" strokeWidth={2} />}
                    {filter.label}
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1 opacity-60">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                );
              })}
           </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 mb-2">
           <h2 className="text-[16px] font-medium text-[#061842]">
             <span className="font-extrabold">{isLoading ? 'Loading...' : `${stores?.length || 124} Stores`}</span> found near you
           </h2>
           
           {/* View Toggle */}
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all border ${
                  viewMode === 'grid' 
                    ? 'bg-[#1668F6] border-[#1668F6] text-white shadow-sm' 
                    : 'bg-white border-surface-200 text-surface-600 hover:text-[#061842] hover:bg-surface-50'
                }`}
              >
                <Grid className="w-4 h-4" strokeWidth={2.5} /> Grid
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all border ${
                  viewMode === 'list' 
                    ? 'bg-[#1668F6] border-[#1668F6] text-white shadow-sm' 
                    : 'bg-white border-surface-200 text-surface-600 hover:text-[#061842] hover:bg-surface-50'
                }`}
              >
                <List className="w-4 h-4" strokeWidth={2.5} /> List
              </button>
           </div>
        </div>

        {/* Store Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-full sm:w-auto"><StoreCardSkeleton /></div>
            ))}
          </div>
        ) : stores && stores.length > 0 ? (
          <div className={`grid gap-4 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-2'}`}>
            {stores.map((store) => (
              <StoreCard key={store._id} store={store} className="w-full h-full" />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-surface-200 rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <Search className="w-8 h-8 text-surface-400" />
            </div>
            <p className="text-[#061842] text-lg font-extrabold">No stores found in this area.</p>
            <p className="text-surface-500 text-sm mt-1 font-medium max-w-md mx-auto">Try expanding your search radius or changing your location to find more stores.</p>
          </div>
        )}
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}

