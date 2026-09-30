"use client";

import { Heart, ShoppingCart, Bell, CircleUserRound } from "lucide-react";
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
import { useAuthStore } from '@/stores/auth.store';

export interface MobileHeaderProps {
  userName?: string;
  address?: string;
  wishlistCount?: number;
  cartCount?: number;
  notificationCount?: number;
  searchPlaceholder?: string;
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
  isAccountPage,
  displayTitle,
}: MobileHeaderProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const rawCartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const rawWishlistCount = useWishlistFlyoutStore((state) => state.items.length);
  const rawNotificationCount = useNotificationStore((state) => state.unreadCount);
  const { isAuthenticated, openAuthModal } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? (propCartCount !== undefined ? propCartCount : rawCartCount) : 0;
  const wishlistCount = mounted ? (propWishlistCount !== undefined ? propWishlistCount : rawWishlistCount) : 0;
  const notificationCount = mounted ? (propNotificationCount !== undefined ? propNotificationCount : rawNotificationCount) : 0;

  const handleUserClick = () => {
    if (isAuthenticated) {
      router.push('/account');
    } else {
      openAuthModal('login');
    }
  };

  return (
    <div className="md:hidden max-w-2xl mx-auto w-full relative pt-1.5 pb-2">
      {/* Background Gradient for Mobile */}
      <div
        className="absolute inset-0 z-0 block"
        style={{
          background: "linear-gradient(180deg, #011A5D 0%, #011B62 25%, #002070 45%, #01267F 55%, #04318C 62%, #1A49A2 68%, #3A6AC0 73%, #6894D8 78%, #9EBEEC 84%, #D4E3FA 91%, #EEF4FE 96%, #F5F9FE 100%)"
        }}
      />

      {/* Soft misty fog / glow behind the categories */}
      {!isAccountPage && (
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
          <>
            <TopBar wishlistCount={wishlistCount} cartCount={cartCount} />
            
            {/* Middle Row: Location Bar + Notification Bell + Profile Icon */}
            <div className="flex items-center gap-3.5 px-4 mb-3.5">
              <div className="flex-1 min-w-0">
                <LocationBar name={userName} address={address} />
              </div>
              
              {/* Notification Bell */}
              <button
                type="button"
                aria-label="Notifications"
                className="relative text-white hover:opacity-85 transition-opacity shrink-0"
              >
                <Bell className="h-6 w-6" strokeWidth={1.5} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-[16px] min-w-[16px] px-1 items-center justify-center rounded-full bg-[#FF3B30] text-[10px] font-bold text-white shadow-sm border border-white">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Profile Icon */}
              <button
                type="button"
                aria-label="User profile"
                className="text-[#1668F6] bg-white rounded-full h-7 w-7 flex items-center justify-center hover:opacity-85 transition-opacity shrink-0 shadow-sm"
                onClick={handleUserClick}
              >
                <CircleUserRound className="h-[22px] w-[22px]" strokeWidth={2} />
              </button>
            </div>

            <SearchBar
              placeholder={searchPlaceholder}
              notificationCount={notificationCount}
            />
            {!isAccountPage && <CategoryTabs />}
          </>
      </div>

      {/* Category Icons under the gradient for Mobile */}
      {!isAccountPage && (
        <div className="relative z-10 bg-gradient-to-b from-[#F5F9FE] to-white pt-2 pb-1">
          <CategoryIcons />
        </div>
      )}
    </div>
  );
}
