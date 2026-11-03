'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { StoreCardSkeleton } from '@/components/ui/Skeleton';
import { useNearbyStores } from '@/hooks/useNearbyStores';
import { useAllStores } from '@/hooks/useAllStores';
import { useLocationStore } from '@/stores/location.store';
import { Search, Grid, List, CheckCircle2, Truck, ShieldCheck, X } from 'lucide-react';
import { StoreCategory } from '@repo/shared-types';
import { StoreCard } from '@/features/stores/components/StoreCard';
import { StoreDirectoryCard } from '@/features/stores/StoreDirectoryCard';

export const CATEGORY_TABS = [
  { id: 'all', label: 'All Stores' },
  { id: 'grocery', label: 'Grocery & Staples', category: StoreCategory.GROCERY_STAPLES },
  { id: 'fashion', label: 'Fashion & Apparel', category: StoreCategory.FASHION },
  { id: 'electronics', label: 'Electronics & Mobiles', category: StoreCategory.ELECTRONICS },
  { id: 'beauty', label: 'Beauty & Care', category: StoreCategory.BEAUTY_CARE },
  { id: 'home', label: 'Home & Living', category: StoreCategory.HOME_LIVING },
  { id: 'footwear', label: 'Footwear & Bags', category: StoreCategory.FOOTWEAR },
  { id: 'jewellery', label: 'Jewellery & Watches', category: StoreCategory.JEWELLERY },
];

export interface StoresClientProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function StoresClient({ searchParams }: StoresClientProps) {
  const { lng, lat, address } = useLocationStore();
  const addressParts = address ? address.split(',') : [];
  const detectedCity = addressParts[0]?.trim() || "Your City";
  const detectedState = addressParts[1]?.trim() || "India";
  const city = (searchParams?.city as string) || detectedCity;
  const state = (searchParams?.state as string) || detectedState;

  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const activeCategory = useMemo(() => {
    if (selectedCategoryTab === 'all') return undefined;
    const found = CATEGORY_TABS.find((t) => t.id === selectedCategoryTab);
    return found?.category;
  }, [selectedCategoryTab]);

  const { data: nearbyStores, isLoading: nearbyLoading } = useNearbyStores(lng, lat, 50, activeCategory, city);
  const { data: allStoresResponse, isLoading: allLoading } = useAllStores({ category: activeCategory, city });

  const rawStores = useMemo(() => {
    const list = nearbyStores && nearbyStores.length > 0 ? nearbyStores : (allStoresResponse?.stores || []);
    return [...list].sort((a: any, b: any) => {
      const distA = typeof a.distanceKm === 'number' && !isNaN(a.distanceKm) ? a.distanceKm : 9999;
      const distB = typeof b.distanceKm === 'number' && !isNaN(b.distanceKm) ? b.distanceKm : 9999;
      return distA - distB;
    });
  }, [nearbyStores, allStoresResponse]);

  const filteredStores = useMemo(() => {
    let list = rawStores;
    // Category match
    if (selectedCategoryTab !== 'all') {
      const activeObj = CATEGORY_TABS.find((t) => t.id === selectedCategoryTab);
      list = list.filter((s: any) => {
        const cat = (s.category || '').toLowerCase();
        const tabId = selectedCategoryTab.toLowerCase();
        const tabLabel = (activeObj?.label || '').toLowerCase();
        return cat.includes(tabId) || tabLabel.includes(cat) || (activeObj?.category && cat === activeObj.category.toLowerCase());
      });
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((s: any) => {
        const name = (s.name || '').toLowerCase();
        const desc = (s.description || '').toLowerCase();
        const cityStr = (s.location?.address?.city || '').toLowerCase();
        return name.includes(q) || desc.includes(q) || cityStr.includes(q);
      });
    }
    return list;
  }, [rawStores, selectedCategoryTab, searchQuery]);

  const hasNearby = !!(nearbyStores && nearbyStores.length > 0);
  const isLoading = nearbyLoading || (allLoading && rawStores.length === 0);

  return (
    <div className="min-h-screen bg-transparent pt-6 pb-20 md:pb-0">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-2 space-y-4">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-surface-500">
          <Link href="/" className="hover:text-[#1668F6] transition-colors">Home</Link>
          <span className="text-surface-300">›</span>
          <span className="text-surface-500">Stores <span className="text-[#1668F6]">Near You</span></span>
        </div>

        {/* Hero Banner */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 relative">
          {/* Main Hero Area */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-white via-blue-50/30 to-blue-100/40 rounded-[24px] overflow-hidden relative border border-blue-100/50">
            <div className="p-6 md:p-8 lg:p-9 z-10 w-full md:w-auto">
              <h1 className="text-2xl md:text-3xl lg:text-[38px] leading-tight font-extrabold text-[#0A0F56] mb-2 lg:mb-3 tracking-tight">Stores Near You</h1>
              <p className="text-[15px] lg:text-[17px] font-bold text-[#0A0F56] mb-1">Discover trusted local stores around you.</p>
              <p className="text-[13px] lg:text-[14px] font-medium text-surface-500">Shop from nearby verified retailers and support local commerce.</p>
            </div>

            {/* Map Pin Area */}
            <div className="relative min-h-[170px] lg:min-h-[190px] flex-1 overflow-hidden w-full md:w-auto">
              <MapBackground />
              <div className="absolute inset-0 flex items-center justify-center gap-3">
                <div className="drop-shadow-md">
                  <svg viewBox="0 0 24 30" className="h-11 w-11 text-[#2554FF]" fill="currentColor">
                    <path d="M12 29S1 18 1 11.5A11 11 0 0 1 23 11.5C23 18 12 29 12 29Z" />
                    <circle cx="12" cy="11" r="4.2" fill="white" />
                  </svg>
                </div>
                <div className="rounded-2xl bg-white px-5 py-3 shadow-lg">
                  <p className="text-[13px] font-medium text-[#2F6BFF]">Near you</p>
                  <p className="text-[15px] font-bold text-[#1D3FE0]">{city}, {state}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Trust Badges */}
          <div className="w-full hidden lg:flex lg:w-[280px] xl:w-[320px] bg-[#F1F7FE] rounded-[24px] p-5 lg:p-6 flex-col justify-center gap-4 lg:gap-5 border border-blue-100/50 shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="text-[#1668F6] shrink-0">
                <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <p className="font-extrabold text-[13px] text-[#061842] leading-tight">Same Day Delivery</p>
                <p className="text-[11px] text-surface-500 font-medium mt-0.5">3-4 km Radius</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="text-[#1668F6] shrink-0">
                <Truck className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <p className="font-extrabold text-[13px] text-[#061842] leading-tight">Self Pickup Available</p>
                <p className="text-[11px] text-surface-500 font-medium mt-0.5">Skip the Queue</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="text-[#1668F6] shrink-0">
                <ShieldCheck className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <p className="font-extrabold text-[13px] text-[#061842] leading-tight">Verified Stores</p>
                <p className="text-[11px] text-surface-500 font-medium mt-0.5">Authentic & Licensed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar with Search & Category Pills */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 pt-2">
          {/* Search Input */}
          <div className="relative w-full lg:w-[320px] shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stores by name or area..."
              className="w-full h-11 pl-11 pr-10 rounded-xl bg-white border border-surface-200 text-[13px] font-semibold text-[#061842] placeholder:text-surface-400 focus:outline-none focus:border-[#1668F6] focus:ring-1 focus:ring-[#1668F6] shadow-2xs transition-all"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Interactive Category Pills */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategoryTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-[12.5px] font-bold whitespace-nowrap transition-all shadow-2xs shrink-0 cursor-pointer border ${
                    isActive
                      ? 'bg-[#1668F6] text-white border-[#1668F6] shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 mb-2">
          <h2 className="text-[15px] font-medium text-[#061842]">
            <span className="font-extrabold">
              {isLoading ? 'Scanning stores...' : `${filteredStores.length} Store${filteredStores.length === 1 ? '' : 's'}`}
            </span>{' '}
            {selectedCategoryTab !== 'all' ? `in ${CATEGORY_TABS.find(t => t.id === selectedCategoryTab)?.label}` : hasNearby ? 'found near your location' : 'available on platform'}
          </h2>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#1668F6] border-[#1668F6] text-white shadow-2xs'
                  : 'bg-white border-surface-200 text-surface-600 hover:text-[#061842] hover:bg-surface-50'
              }`}
            >
              <Grid className="w-3.5 h-3.5" strokeWidth={2.5} /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#1668F6] border-[#1668F6] text-white shadow-2xs'
                  : 'bg-white border-surface-200 text-surface-600 hover:text-[#061842] hover:bg-surface-50'
              }`}
            >
              <List className="w-3.5 h-3.5" strokeWidth={2.5} /> List
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
        ) : filteredStores && filteredStores.length > 0 ? (
          <div className={`grid gap-4 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-2'}`}>
            {filteredStores.map((store: any) =>
              viewMode === 'grid' ? (
                <StoreCard key={store._id || store.id} store={store} className="w-full h-full" />
              ) : (
                <StoreDirectoryCard key={store._id || store.id} store={store} />
              )
            )}
          </div>
        ) : (
          <div className="py-16 text-center bg-white border border-surface-200 rounded-2xl shadow-xs">
            <div className="w-14 h-14 bg-blue-50 text-[#1668F6] rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Search className="w-7 h-7" />
            </div>
            <p className="text-[#061842] text-base font-extrabold">No stores found in this category.</p>
            <p className="text-surface-500 text-xs mt-1 font-medium max-w-sm mx-auto">
              Try selecting "All Stores" or clearing your search filter to see other nearby shops.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryTab('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-50 text-[#1668F6] font-bold text-xs hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function MapBackground() {
  return (
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 700 220"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="mapFade" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#D6E6FB" stopOpacity="1" />
            <stop offset="70%" stopColor="#E7F0FC" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="700" height="220" fill="url(#mapFade)" />

        <g stroke="#FFFFFF" strokeWidth="2.2" opacity="0.85">
          <path d="M0 20 L700 35" />
          <path d="M0 55 L700 45" />
          <path d="M0 85 L700 100" />
          <path d="M0 120 L700 108" />
          <path d="M0 150 L700 165" />
          <path d="M0 185 L700 175" />
          <path d="M40 0 L60 220" />
          <path d="M120 0 L100 220" />
          <path d="M200 0 L230 220" />
          <path d="M300 0 L280 220" />
          <path d="M400 0 L430 220" />
          <path d="M500 0 L470 220" />
          <path d="M580 0 L610 220" />
          <path d="M650 0 L630 220" />
        </g>

        <path
          d="M-10 160 C 120 120, 220 190, 340 140 S 560 90, 710 130"
          stroke="#C7DCF7"
          strokeWidth="10"
          fill="none"
          opacity="0.7"
        />

        <ellipse cx="120" cy="60" rx="46" ry="26" fill="#D9EFDC" opacity="0.9" />
        <ellipse cx="600" cy="170" rx="38" ry="22" fill="#D9EFDC" opacity="0.85" />
      </svg>
    </div>
  );
}

