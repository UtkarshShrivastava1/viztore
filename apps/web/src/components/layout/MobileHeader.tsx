"use client";

import { Heart, ShoppingCart } from "lucide-react";
import TopBar from '@/components/layout/TopBar';
import LocationBar from '@/components/layout/LocationBar';
import SearchBar from '@/components/layout/SearchBar';
import CategoryTabs from '@/components/layout/CategoryTabs';
import CategoryIcons from '@/features/home/components/CategoryIcons';
import Logo from '@/components/layout/Logo';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cart.store';
import { useWishlistFlyoutStore } from '@/stores/wishlistFlyoutStore';
import { useNotificationStore } from '@/stores/notificationStore';

export interface MobileHeaderProps {
  userName?: string;
  address?: string;
  wishlistCount?: number;
  cartCount?: number;
  notificationCount?: number;
  searchPlaceholder?: string;
  isSimpleHeader?: boolean;
  isAccountPage?: boolean;
  displayTitle?: string;
}

export function MobileHeader({
  userName,
  address,
  wishlistCount: propWishlistCount,
  cartCount: propCartCount,
  notificationCount: propNotificationCount,
  searchPlaceholder,
  isSimpleHeader,
  isAccountPage,
  displayTitle,
}: MobileHeaderProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const rawCartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const rawWishlistCount = useWishlistFlyoutStore((state) => state.items.length);
  const rawNotificationCount = useNotificationStore((state) => state.unreadCount);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? (propCartCount !== undefined ? propCartCount : rawCartCount) : 0;
  const wishlistCount = mounted ? (propWishlistCount !== undefined ? propWishlistCount : rawWishlistCount) : 0;
  const notificationCount = mounted ? (propNotificationCount !== undefined ? propNotificationCount : rawNotificationCount) : 0;

  return (
    <div className="md:hidden max-w-2xl mx-auto w-full relative pt-1.5 pb-2">
      {/* Background Gradient for Mobile */}
      {!isSimpleHeader && (
        <div 
          className="absolute inset-0 z-0 block"
          style={{
            background: "linear-gradient(180deg, #011A5D 0%, #011B62 25%, #002070 45%, #01267F 55%, #04318C 62%, #1A49A2 68%, #3A6AC0 73%, #6894D8 78%, #9EBEEC 84%, #D4E3FA 91%, #EEF4FE 96%, #F5F9FE 100%)"
          }}
        />
      )}
      {/* White Background for Mobile Simple Header */}
      {isSimpleHeader && (
        <div className="absolute inset-0 z-0 bg-white" />
      )}
      
      {/* Soft misty fog / glow behind the categories */}
      {!isAccountPage && !isSimpleHeader && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-44 opacity-80 z-0"
          style={{
            background:
              "radial-gradient(ellipse 95% 75% at 50% 90%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 80%)",
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10">
        {!isSimpleHeader ? (
          <>
            <TopBar wishlistCount={wishlistCount} cartCount={cartCount} />
            <LocationBar name={userName} address={address} />
            <SearchBar
              placeholder={searchPlaceholder}
              notificationCount={notificationCount}
            />
            {!isAccountPage && <CategoryTabs />}
          </>
        ) : (
          <div className="flex items-center justify-between px-4 py-1 pb-2">
            <button onClick={() => router.push('/account')} className="p-1 -ml-1 text-[#192168]">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className={displayTitle ? "flex-1 flex justify-center text-[#192168] font-bold text-lg" : "scale-90"}>
              {displayTitle ? displayTitle : <Logo theme="dark" />}
            </div>
            <div className="flex items-center gap-4">
              <button type="button" className="text-[#192168]" onClick={() => router.push('/account/wishlist')}>
                <Heart className="h-6 w-6" strokeWidth={1.5} />
              </button>
              <button type="button" className="relative text-[#192168]" onClick={() => router.push('/cart')}>
                <ShoppingCart className="h-6 w-6" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-[18px] min-w-[18px] px-1 items-center justify-center rounded-full bg-[#1668F6] text-[10.5px] font-bold text-white shadow-sm border border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Category Icons under the gradient for Mobile */}
      {!isAccountPage && !isSimpleHeader && (
        <div className="relative z-10 bg-gradient-to-b from-[#F5F9FE] to-white pt-2 pb-1">
          <CategoryIcons />
        </div>
      )}
    </div>
  );
}
