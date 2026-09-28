'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, Store, MapPin, Ticket, MessageSquare, HeadphonesIcon, 
  Shield, FileText, LogOut, User, Bell, ShoppingBasket, ShoppingBag, 
  Loader2, Star, ArrowLeft, Calendar
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { useAuthStore } from '@/stores/auth.store';
import { fetchAllStores } from '@/lib/api/stores';
import type { IStore } from '@repo/shared-types';
import { AccountSidebar } from '@/components/account/AccountSidebar';

export function StoresClient() {
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formData = {
    fullName: user?.fullName || 'Guest User',
    mobileNumber: user?.phone ? `+91 ${user.phone}` : '+91 91234 56789',
    email: user?.email || 'harishkumar@gmail.com',
  };

  useEffect(() => {
    let isMounted = true;
    const fetchFavStores = async () => {
      try {
        setIsLoading(true);
        // Using fetchAllStores as a placeholder for favourite stores API
        // const res = await fetchAllStores({ limit: 12 });
        // Instead of API data, using the mock data that perfectly matches the screenshot
        const mockStores = [
          {
            id: '1', name: 'Fashion Hub', category: 'Clothing, Accessories', rating: 4.5, reviews: '1.2K', products: '320+',
            logoColor: 'bg-[#111111]', logoText: 'Fashion\nHub',
            bannerBg: 'bg-[#F2EFE9]', bannerTitle: 'Trendy\nStyles\nEveryday',
            image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=200&h=150',
            isFavorite: true
          },
          {
            id: '2', name: 'Tech World', category: 'Electronics', rating: 4.3, reviews: '856', products: '1.2K+',
            logoColor: 'bg-[#0E3B20]', logoText: 'Tech\nWorld',
            bannerBg: 'bg-[#1E293B]', bannerTitle: 'Latest\nTech for\na Smarter You', bannerTextColor: 'text-white',
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=200&h=150',
            isFavorite: true
          },
          {
            id: '3', name: 'Home Delight', category: 'Home & Kitchen', rating: 4.6, reviews: '1.1K', products: '980+',
            logoColor: 'bg-[#7F1D1D]', logoText: 'Home\nDelight',
            bannerBg: 'bg-[#F7F3EB]', bannerTitle: 'Make\nHome Beautiful',
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200&h=150',
            isFavorite: true
          },
          {
            id: '4', name: 'Beauty Glow', category: 'Beauty & Personal Care', rating: 4.2, reviews: '732', products: '640+',
            logoColor: 'bg-[#FDF2F8]', logoTextColor: 'text-rose-500', logoText: 'Beauty\nGlow',
            bannerBg: 'bg-[#FDF2F8]', bannerTitle: 'Beauty\nFor A Brighter\nYou', bannerTextColor: 'text-rose-800',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=200&h=150',
            isFavorite: true
          },
          {
            id: '5', name: 'Daily Fresh', category: 'Food & Beverages', rating: 4.4, reviews: '920', products: '1.5K+',
            logoColor: 'bg-[#FFF7ED]', logoTextColor: 'text-orange-600', logoText: 'Daily\nFresh',
            bannerBg: 'bg-[#F0FDF4]', bannerTitle: 'Fresh\nGoodness\nDaily', bannerTextColor: 'text-emerald-800',
            image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=200&h=150',
            isFavorite: true
          },
          {
            id: '6', name: 'Kids Zone', category: 'Toys & Baby', rating: 4.5, reviews: '660', products: '480+',
            logoColor: 'bg-[#FAF5FF]', logoTextColor: 'text-purple-700', logoText: 'Kids\nZone',
            bannerBg: 'bg-[#EFF6FF]', bannerTitle: 'Little\nJoy\nEveryday', bannerTextColor: 'text-blue-900',
            image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=200&h=150',
            isFavorite: true
          },
          {
            id: '7', name: 'Auto Care', category: 'Auto Accessories', rating: 4.1, reviews: '540', products: '370+',
            logoColor: 'bg-[#ECFDF5]', logoTextColor: 'text-emerald-700', logoText: 'Auto\nCare',
            bannerBg: 'bg-[#F3F4F6]', bannerTitle: 'Drive\nwith\nConfidence',
            image: 'https://images.unsplash.com/photo-1552865910-1c09930873a4?auto=format&fit=crop&q=80&w=200&h=150',
            isFavorite: false
          },
          {
            id: '8', name: 'Sports Arena', category: 'Sports & Fitness', rating: 4.4, reviews: '610', products: '520+',
            logoColor: 'bg-[#FEF2F2]', logoTextColor: 'text-red-600', logoText: 'Sports\nArena',
            bannerBg: 'bg-[#F1F5F9]', bannerTitle: 'Play\nLive\nStronger',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200&h=150',
            isFavorite: true
          }
        ];
        
        if (isMounted) {
          setStores(mockStores);
        }
      } catch (err) {
        console.warn('Could not load favourite stores:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchFavStores();
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
                <p className="text-[12px] lg:text-[14px] font-medium text-surface-500 mt-1">Your favourite stores, all in one place.</p>
              </div>
            </div>
            <div className="text-[12px] font-medium text-[#192168] mt-1 lg:mt-0">
              {stores.length} Stores
            </div>
          </div>

          {/* Stores Grid */}
          <div className="flex-1 mt-2">
            {isLoading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#1668F6]" />
              </div>
            ) : stores.length === 0 ? (
              <div className="py-16 text-center">
                <h3 className="text-base font-bold text-slate-800">No favourite stores</h3>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
                {stores.map((store) => (
                  <Link 
                    href={`/store/${store.id}`}
                    key={store.id} 
                    className="bg-white rounded-[14px] border border-surface-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow relative"
                  >
                    
                    {/* Top Banner (Simulating Image from Mockup) */}
                    <div className={`h-[85px] lg:h-[110px] w-full relative flex ${store.bannerBg} overflow-hidden`}>
                      <div className="w-[50%] p-2.5 z-10 flex flex-col justify-center">
                        <h3 className={`text-[11px] lg:text-[14px] font-extrabold leading-[1.15] whitespace-pre-line ${store.bannerTextColor || 'text-[#192168]'}`}>
                          {store.bannerTitle}
                        </h3>
                      </div>
                      <div className="w-[50%] absolute right-0 top-0 bottom-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10 mix-blend-multiply z-10" />
                        <img 
                          src={store.image} 
                          alt={store.name} 
                          className="w-full h-full object-cover mix-blend-multiply opacity-90"
                        />
                      </div>
                      
                      {/* Heart Icon */}
                      <button className="absolute top-2 right-2 w-6 h-6 lg:w-8 lg:h-8 bg-white rounded-full flex items-center justify-center shadow-sm z-20">
                        <Heart className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${store.isFavorite ? 'fill-red-500 text-red-500' : 'text-surface-400'}`} />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="px-2.5 pb-3 lg:px-4 lg:pb-4 flex-1 flex flex-col relative pt-1">
                      
                      <div className="flex gap-2">
                        {/* Circular Logo */}
                        <div className={`w-[44px] h-[44px] lg:w-[56px] lg:h-[56px] rounded-full border-[3px] border-white shrink-0 shadow-sm flex items-center justify-center -mt-[22px] lg:-mt-[28px] relative z-10 ${store.logoColor}`}>
                          {store.logoText === 'Home\nDelight' ? (
                            <div className="flex flex-col items-center">
                              <svg className="w-3.5 h-3.5 text-white mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                              <span className="text-[7.5px] font-bold text-white text-center leading-[1.1]">{store.logoText}</span>
                            </div>
                          ) : (
                            <span className={`text-[9px] lg:text-[11px] font-extrabold text-center leading-[1.1] whitespace-pre-line ${store.logoTextColor || 'text-white'}`}>
                              {store.logoText}
                            </span>
                          )}
                        </div>
                        
                        {/* Name & Category */}
                        <div className="pt-0.5 flex-1 min-w-0">
                          <h4 className="text-[12px] lg:text-[15px] font-extrabold text-[#192168] line-clamp-1">{store.name}</h4>
                          <p className="text-[9px] lg:text-[11px] font-medium text-surface-500 mt-0.5 line-clamp-1">{store.category}</p>
                        </div>
                      </div>

                      {/* Spacer to push stats to bottom */}
                      <div className="flex-1" />

                      {/* Stats Line */}
                      <div className="flex items-center gap-1 mt-2.5 text-[9px] lg:text-[11px] font-bold">
                        <Star className="w-3 h-3 lg:w-3.5 lg:h-3.5 fill-[#06B95F] text-[#06B95F]" />
                        <span className="text-[#06B95F]">{store.rating}</span>
                        <span className="text-surface-400 font-medium">({store.reviews})</span>
                        <span className="text-surface-300 mx-0.5">|</span>
                        <span className="text-surface-500 font-medium">{store.products} products</span>
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

