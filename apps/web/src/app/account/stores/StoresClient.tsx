'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, Star, ArrowLeft, Loader2, Store as StoreIcon 
} from 'lucide-react';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { fetchAllStores } from '@/lib/api/stores.js';
import type { IStore } from '@repo/shared-types';

interface DisplayStore {
  id: string;
  slug: string;
  name: string;
  category: string;
  rating: number;
  reviews: string;
  image: string;
  logoText: string;
  isFavorite: boolean;
}

export function StoresClient() {
  const router = useRouter();
  const [stores, setStores] = useState<DisplayStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchFavoriteStores = async () => {
      try {
        setIsLoading(true);
        const res = await fetchAllStores({ limit: 12 });
        if (res && Array.isArray(res.stores) && res.stores.length > 0) {
          const mapped: DisplayStore[] = res.stores.map((s: IStore) => ({
            id: s._id || s.slug,
            slug: s.slug || s._id,
            name: s.name,
            category: s.category || 'Local Retailer',
            rating: typeof s.rating === 'number' ? s.rating : ((s.rating as unknown as { average?: number })?.average || 4.8),
            reviews: typeof s.rating === 'object' && s.rating !== null ? `${(s.rating as unknown as { count?: number })?.count || 24}` : '24',
            image: s.bannerUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=200&h=150',
            logoText: s.name.slice(0, 2).toUpperCase(),
            isFavorite: true,
          }));
          if (isMounted) setStores(mapped);
          return;
        }
        if (isMounted) setStores([]);
      } catch (err) {
        console.warn('Could not load stores from API:', err);
        if (isMounted) setStores([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFavoriteStores();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 font-sans">
      <main className="max-w-[1680px] mx-auto px-3 lg:px-8 pt-4 pb-6 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ================= DESKTOP LEFT SIDEBAR ================= */}
        <AccountSidebar />

        {/* ================= RIGHT MAIN CONTENT ================= */}
        <div className="flex-1 w-full bg-transparent lg:bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-surface-200/60 lg:p-6 flex flex-col min-h-screen">
          
          {/* Header */}
          <div className="px-2 lg:px-0 w-full flex items-start justify-between pb-4 pt-2">
            <div className="flex items-start gap-3">
              <button onClick={() => router.back()} className="shrink-0 lg:hidden mt-0.5">
                <ArrowLeft className="w-6 h-6 text-[#192168]" />
              </button>
              <div>
                <h1 className="text-[20px] lg:text-[28px] font-bold text-[#192168] leading-tight">Favourite Stores</h1>
                <p className="text-[12px] lg:text-[14px] font-medium text-surface-500 mt-1">Your saved neighbourhood stores for quick access.</p>
              </div>
            </div>
            <div className="text-[12px] font-medium text-[#192168] mt-1 lg:mt-0">
              {stores.length} {stores.length === 1 ? 'Store' : 'Stores'}
            </div>
          </div>

          {/* Stores Grid */}
          <div className="flex-1 mt-2">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-surface-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#1668F6]" />
                <p className="text-xs font-semibold">Loading stores...</p>
              </div>
            ) : stores.length === 0 ? (
              /* Empty State */
              <div className="border border-dashed border-[#E5E7EB] bg-white rounded-2xl p-8 lg:p-14 text-center flex flex-col items-center justify-center my-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <StoreIcon className="w-8 h-8 text-[#1668F6]" />
                </div>
                <h3 className="text-[16px] lg:text-[18px] font-bold text-[#192168] mb-1">No Saved Stores Yet</h3>
                <p className="text-[13px] text-surface-500 max-w-md mb-6 leading-relaxed">
                  Discover local shops delivering in your 3-4km radius and save your favorites for rapid re-ordering.
                </p>
                <Link 
                  href="/stores" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1668F6] text-white text-[13px] font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <StoreIcon className="w-4 h-4" /> Explore Nearby Stores
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
                {stores.map((store) => (
                  <Link 
                    href={`/stores/${store.slug}`}
                    key={store.id} 
                    className="bg-white rounded-[14px] border border-surface-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow relative"
                  >
                    
                    {/* Top Banner */}
                    <div className="h-[85px] lg:h-[110px] w-full relative bg-[#F8FAFF] overflow-hidden">
                      <img 
                        src={store.image} 
                        alt={store.name} 
                        className="w-full h-full object-cover mix-blend-multiply opacity-90"
                      />
                      <button className="absolute top-2 right-2 w-6 h-6 lg:w-8 lg:h-8 bg-white rounded-full flex items-center justify-center shadow-sm z-20">
                        <Heart className="w-3.5 h-3.5 lg:w-4 lg:h-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="px-2.5 pb-3 lg:px-4 lg:pb-4 flex-1 flex flex-col relative pt-1">
                      
                      <div className="flex gap-2">
                        {/* Circular Logo */}
                        <div className="w-[44px] h-[44px] lg:w-[56px] lg:h-[56px] rounded-full border-[3px] border-white shrink-0 shadow-sm flex items-center justify-center -mt-[22px] lg:-mt-[28px] relative z-10 bg-[#081028] text-white font-extrabold text-xs">
                          {store.logoText}
                        </div>
                        
                        {/* Name & Category */}
                        <div className="pt-0.5 flex-1 min-w-0">
                          <h4 className="text-[12px] lg:text-[15px] font-extrabold text-[#192168] line-clamp-1">{store.name}</h4>
                          <p className="text-[9px] lg:text-[11px] font-medium text-surface-500 mt-0.5 line-clamp-1">{store.category}</p>
                        </div>
                      </div>

                      <div className="flex-1" />

                      {/* Stats Line */}
                      <div className="flex items-center gap-1 mt-2.5 text-[9px] lg:text-[11px] font-bold">
                        <Star className="w-3 h-3 lg:w-3.5 lg:h-3.5 fill-[#06B95F] text-[#06B95F]" />
                        <span className="text-[#06B95F]">{store.rating}</span>
                        <span className="text-surface-400 font-medium">({store.reviews} ratings)</span>
                      </div>
                      
                    </div>

                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
