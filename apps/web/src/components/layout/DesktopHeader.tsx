"use client";

import { Heart, ShoppingCart, Search, Mic, Bell, CircleUserRound, MapPin, ChevronDown } from "lucide-react";
import Logo from '@/components/layout/Logo';
import { useRouter, usePathname } from 'next/navigation';
import DesktopCategoryStrip from '@/components/layout/DesktopCategoryStrip';
import { NotificationsDropdown } from './NotificationsDropdown';
import { WishlistFlyout } from './WishlistFlyout';
import { useState, useRef, useEffect } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';
import { useWishlistFlyoutStore } from '@/stores/wishlistFlyoutStore';

export interface DesktopHeaderProps {
  userName?: string;
  address?: string;
  cartCount?: number;
  searchPlaceholder?: string;
  isSimpleHeader?: boolean;
  isAccountPage?: boolean;
}

export function DesktopHeader({
  userName = "Harish Kumar",
  address = "Q No- 6/B, Street -13, Sector -2, Bhilai",
  cartCount = 3,
  searchPlaceholder = "Search for products, stores and more...",
  isSimpleHeader,
  isAccountPage,
}: DesktopHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeOverlay, setActiveOverlay] = useState<'notifications' | 'wishlist' | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const notificationCount = useNotificationStore((state) => state.unreadCount);
  const wishlistCount = useWishlistFlyoutStore((state) => state.items.length);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveOverlay(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Determine active category based on pathname
  let activeCategoryId = "all";
  if (pathname === '/category/fashion') {
    activeCategoryId = "fashion";
  }

  const toggleOverlay = (overlay: 'notifications' | 'wishlist') => {
    setActiveOverlay(prev => prev === overlay ? null : overlay);
  };

  return (
    <div className="hidden md:block w-full" ref={headerRef}>
      {/* Top Bar (Blue Background) */}
      <div 
        className="w-full"
        style={{ background: "#011A5D" }}
      >
        <div className="max-w-[1920px] mx-auto px-6 pt-3 pb-3">
          <div className="flex items-center justify-between gap-8">
            <Logo />

            {/* Search Bar - Center and Large */}
            <div className="flex flex-1 items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-sm mx-4">
              <Search className="h-5 w-5 shrink-0 text-[#1E293B]" strokeWidth={2} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full truncate bg-transparent text-[14px] text-slate-900 placeholder:text-slate-500/90 font-normal focus:outline-none"
              />
              <button type="button" aria-label="Voice search" className="shrink-0 text-[#1E293B] hover:opacity-80">
                <Mic className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>

            {/* Location Selector */}
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-full bg-[#022b82]/80 hover:bg-[#022b82] transition-colors border border-white/10 px-4 py-2.5 backdrop-blur-md shadow-sm max-w-[280px]"
            >
              <MapPin className="h-4 w-4 shrink-0 text-[#4C82FB]" fill="#4C82FB" strokeWidth={0} />
              <span className="flex-1 truncate text-[12px] text-white text-left">
                <span className="font-normal text-white/80">Deliver to </span>
                <span className="font-medium text-white">{resolvedUserName} - {address.split(',')[0]}</span>
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-white" strokeWidth={2.2} />
            </button>

            {/* Action Icons */}
            <div className="flex items-center gap-6 relative">
              {/* Notifications */}
              <div className="relative">
                <button 
                  type="button" 
                  onClick={() => toggleOverlay('notifications')}
                  className="group relative flex flex-col items-center justify-center gap-1 text-white hover:opacity-85 transition-opacity"
                >
                  <div className="relative">
                    <Bell className="h-[22px] w-[22px]" strokeWidth={1.8} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-[16px] min-w-[16px] px-1 items-center justify-center rounded-full bg-[#FF3B30] text-[9px] font-bold text-white shadow-sm border border-[#011A5D]">
                        {notificationCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium tracking-wide">Notifications</span>
                </button>
                {activeOverlay === 'notifications' && (
                  <NotificationsDropdown onClose={() => setActiveOverlay(null)} />
                )}
              </div>

              {/* Wishlist */}
              <div className="relative">
                <button 
                  type="button" 
                  onClick={() => toggleOverlay('wishlist')}
                  className="group relative flex flex-col items-center justify-center gap-1 text-white hover:opacity-85 transition-opacity"
                >
                  <div className="relative">
                    <Heart className="h-[22px] w-[22px]" strokeWidth={1.8} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-[16px] min-w-[16px] px-1 items-center justify-center rounded-full bg-[#FF3B30] text-[9px] font-bold text-white shadow-sm border border-[#011A5D]">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium tracking-wide">Wishlist</span>
                </button>
                {activeOverlay === 'wishlist' && (
                  <WishlistFlyout onClose={() => setActiveOverlay(null)} />
                )}
              </div>

              {/* Account / Auth */}
              <button
                type="button"
                className="group relative flex flex-col items-center justify-center gap-1 text-white hover:opacity-85 transition-opacity"
                onClick={() => {
                  if (isAuthenticated) {
                    router.push('/account');
                  } else {
                    openAuthModal('login');
                  }
                }}
              >
                <CircleUserRound className="h-[22px] w-[22px]" strokeWidth={1.8} />
                <span className="text-[10px] font-medium tracking-wide">
                  {isAuthenticated ? "Account" : "Sign In"}
                </span>
              </button>
              
              {/* Cart */}
              <button type="button" className="group relative flex flex-col items-center justify-center gap-1 text-white hover:opacity-85 transition-opacity" onClick={() => router.push('/cart')}>
                <div className="relative">
                  <ShoppingCart className="h-[22px] w-[22px]" strokeWidth={1.8} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-[18px] min-w-[18px] px-1 items-center justify-center rounded-full bg-[#1668F6] text-[10px] font-bold text-white shadow-sm border border-[#011A5D]">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium tracking-wide">Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Strip (White Background) */}
      {!isSimpleHeader && !isAccountPage && (
      <DesktopCategoryStrip activeId={activeCategoryId} />
      )}
    </div>
  );
}
