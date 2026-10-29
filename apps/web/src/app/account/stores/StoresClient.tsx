'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, ArrowLeft, Loader2, Store as StoreIcon, MapPin 
} from 'lucide-react';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { useFavoriteStoresStore } from '@/stores/favoriteStoresStore';

export function StoresClient() {
  const router = useRouter();
  const { favoriteStores, toggleFavorite, fetchFavorites, isLoading } = useFavoriteStoresStore();

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 font-sans">
      <main className="max-w-[1680px] mx-auto px-3 lg:px-8 pt-4 pb-6 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ================= DESKTOP LEFT SIDEBAR ================= */}
        <AccountSidebar />

        {/* ================= RIGHT MAIN CONTENT ================= */}
        <div className="flex-1 w-full bg-transparent lg:bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-surface-200/60 lg:p-6 flex flex-col min-h-screen">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => router.back()}
              className="lg:hidden p-2 -ml-2 rounded-full hover:bg-surface-100 text-surface-600"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#192168] tracking-tight">Saved Stores</h1>
              <p className="text-xs sm:text-sm text-surface-500 font-medium">Your bookmarked and favorite neighborhood shops</p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && favoriteStores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-surface-400">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600 mb-3" />
              <p className="text-sm font-semibold">Loading your favorite stores...</p>
            </div>
          ) : favoriteStores.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-surface-200 rounded-2xl bg-surface-50/50 my-auto">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 shadow-xs">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-[#192168] mb-1">No Saved Stores Yet</h3>
              <p className="text-sm text-surface-500 max-w-sm mb-6">
                Bookmark your favorite local stores by tapping the heart icon on any store card or store page for quick access.
              </p>
              <Link 
                href="/stores"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-sm transition-all"
              >
                <StoreIcon className="w-4 h-4" />
                Explore Nearby Stores
              </Link>
            </div>
          ) : (
            /* Stores Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteStores.map((store) => {
                const storeId = store._id || (store as any).id || store.slug;
                const banner = store.bannerUrl || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=600';
                const dist = typeof store.distanceKm === 'number' && !isNaN(store.distanceKm) ? store.distanceKm : null;
                const distanceStr = dist !== null ? `${dist.toFixed(1)} km` : null;

                return (
                  <div 
                    key={storeId}
                    className="group bg-white rounded-2xl border border-surface-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col relative"
                  >
                    <Link href={`/stores/${store.slug || storeId}`} className="block relative aspect-[16/9] w-full overflow-hidden bg-surface-100">
                      <img 
                        src={banner} 
                        alt={store.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      {distanceStr && (
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-bold text-gray-800 shadow-2xs flex items-center gap-1 leading-none">
                          <MapPin className="w-3 h-3 text-emerald-600" /> {distanceStr}
                        </span>
                      )}
                    </Link>

                    {/* Unfavorite Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(store);
                      }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-rose-50 text-rose-500 ring-2 ring-rose-200 flex items-center justify-center transition-all z-10 hover:bg-rose-100 shadow-2xs"
                      title="Remove from favorites"
                      aria-label="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    </button>

                    <div className="p-4 flex flex-col gap-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <Link href={`/stores/${store.slug || storeId}`}>
                          <h3 className="font-extrabold text-[#192168] group-hover:text-primary-600 transition-colors line-clamp-1">
                            {store.name}
                          </h3>
                        </Link>
                        {store.rating && (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            ★ {store.rating.toFixed(1)}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-surface-500 line-clamp-1">
                        {store.description || `${store.category || 'Local Retail'} • Open for Orders`}
                      </p>

                      <div className="mt-auto pt-3 flex items-center justify-between border-t border-surface-100 text-xs">
                        <span className="text-surface-400 font-medium">
                          {store.address?.city || 'Local Store'}
                        </span>
                        <Link 
                          href={`/stores/${store.slug || storeId}`}
                          className="font-bold text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          Visit Store →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
