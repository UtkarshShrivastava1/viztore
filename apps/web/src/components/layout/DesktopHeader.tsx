"use client";

import { Heart, ShoppingCart, Search, Mic, Bell, CircleUserRound, MapPin, ChevronDown, X, TrendingUp, ArrowRight, Loader2, Package } from "lucide-react";
import Logo from '@/components/layout/Logo';
import { useRouter, usePathname } from 'next/navigation';
import DesktopCategoryStrip from '@/components/layout/DesktopCategoryStrip';
import { NotificationsDropdown } from './NotificationsDropdown';
import { WishlistFlyout } from './WishlistFlyout';
import { LocationModal } from './LocationModal';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';
import { useWishlistFlyoutStore } from '@/stores/wishlistFlyoutStore';
import { useAuthStore } from '@/stores/auth.store';
import { useLocationStore } from '@/stores/location.store';
import { useCartStore } from '@/stores/cart.store';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { fetchProducts } from '@/lib/api/catalog';
import type { IProduct } from '@repo/shared-types';

const TRENDING_SEARCHES = [
  "T-Shirts",
  "Smartphones",
  "Running Shoes",
  "Wireless Earbuds",
  "Kurta Set",
  "Backpack",
];

const QUICK_CATEGORIES = [
  { label: "Fashion", slug: "fashion" },
  { label: "Mobiles", slug: "mobiles" },
  { label: "Electronics", slug: "electronics" },
  { label: "Beauty", slug: "beauty" },
  { label: "Grocery", slug: "food_health" },
];

export interface DesktopHeaderProps {
  userName?: string;
  address?: string;
  cartCount?: number;
  searchPlaceholder?: string;
  isSimpleHeader?: boolean;
  isAccountPage?: boolean;
  isAuthenticated?: boolean;
  openAuthModal?: (mode: "login" | "signup") => void;
}

export function DesktopHeader({
  userName: propUserName,
  address: propAddress,
  cartCount: propCartCount,
  searchPlaceholder = "Search for products, stores and more...",
  isSimpleHeader: _isSimpleHeader,
  isAccountPage: _isAccountPage,
  isAuthenticated: propIsAuthenticated,
  openAuthModal: propOpenAuthModal,
}: DesktopHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<'notifications' | 'wishlist' | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<IProduct[]>([]);
  const [searchCategory, setSearchCategory] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { isListening, startListening, stopListening } = useVoiceSearch();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setSearchCategory(params.get('category'));
    }
  }, [pathname]);

  const authUser = useAuthStore((state) => state.user);
  const authIsAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authOpenModal = useAuthStore((state) => state.openAuthModal);
  const locationAddress = useLocationStore((state) => state.address);
  const locationLocality = useLocationStore((state) => state.locality);
  const locationFormatted = useLocationStore((state) => state.formattedAddress);
  const locationIsSet = useLocationStore((state) => state.isSet);
  const setStoreLocation = useLocationStore((state) => state.setLocation);
  const rawCartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const openCart = useCartStore((state) => state.openCart);
  
  const { unreadCount: notificationCount, fetchUnreadSummary, fetchNotifications } = useNotificationStore();
  const wishlistCount = useWishlistFlyoutStore((state) => state.items.length);

  useEffect(() => {
    if (authIsAuthenticated) {
      fetchUnreadSummary();
      fetchNotifications();
    }
  }, [authIsAuthenticated, fetchUnreadSummary, fetchNotifications]);

  useEffect(() => {
    setMounted(true);
    if (!locationIsSet && authUser?.addresses?.[0]) {
      const primary = authUser.addresses[0];
      const coords = primary.coordinates || [81.3800, 21.1938];
      setStoreLocation(coords[0], coords[1], `${primary.street}, ${primary.city}`);
    }
  }, [authUser, locationIsSet, setStoreLocation]);

  const cartCount = mounted ? (propCartCount !== undefined ? propCartCount : rawCartCount) : 0;
  const isAuthenticated = mounted ? (propIsAuthenticated !== undefined ? propIsAuthenticated : authIsAuthenticated) : false;
  const userName = mounted ? (propUserName || authUser?.fullName || "Customer") : "Customer";
  const address = mounted 
    ? (propAddress || (locationIsSet ? locationAddress : (authUser?.addresses?.[0] ? `${authUser.addresses[0].street}, ${authUser.addresses[0].city}` : locationAddress))) 
    : "Sector 6, Central Avenue, Bhilai - 490006";
  const locality = mounted
    ? (locationLocality || address.split(',')[0])
    : "Sector 6";
  const displayFullAddress = mounted
    ? (locationFormatted || address)
    : "Sector 6, Central Avenue, Bhilai - 490006";

  const handleAuthClick = () => {
    if (isAuthenticated) {
      router.push('/account');
    } else {
      if (typeof propOpenAuthModal === 'function') {
        propOpenAuthModal('login');
      } else {
        authOpenModal('login');
      }
    }
  };

  const executeDesktopSearch = useCallback(
    (searchString: string, categorySlug?: string) => {
      const q = searchString.trim();
      setIsSearchOpen(false);
      if (!q && !categorySlug) return;

      const params = new URLSearchParams();
      if (q) params.set("search", q);
      if (categorySlug) params.set("category", categorySlug);

      router.push(`/products?${params.toString()}`);
    },
    [router],
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      executeDesktopSearch(searchQuery);
    }
  };

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setSearchQuery(transcript);
        executeDesktopSearch(transcript);
      });
    }
  };

  // Debounced product suggestions lookup
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSuggestedProducts([]);
      setIsSearchLoading(false);
      return;
    }

    setIsSearchLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetchProducts({ search: trimmed, limit: 4 });
        setSuggestedProducts(res.products || []);
      } catch (err) {
        console.error("Autocomplete fetch error:", err);
        setSuggestedProducts([]);
      } finally {
        setIsSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveOverlay(null);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Determine active category based on pathname and query parameters
  let activeCategoryId = "";
  if (pathname === '/') {
    activeCategoryId = "home";
  } else if (pathname === '/category') {
    activeCategoryId = "all-categories";
  } else if (pathname?.startsWith('/category/')) {
    activeCategoryId = pathname.replace('/category/', '');
  } else if (pathname?.startsWith('/stores/')) {
    activeCategoryId = pathname.replace('/stores/', '');
  } else if (pathname?.startsWith('/products') && searchCategory) {
    activeCategoryId = searchCategory;
  } else {
    activeCategoryId = "";
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
            <div className="relative flex flex-1 mx-4" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-400">
                <button type="submit" aria-label="Search" className="shrink-0 text-[#1E293B] hover:opacity-80 cursor-pointer">
                  <Search className="h-5 w-5" strokeWidth={2} />
                </button>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder={searchPlaceholder}
                  className="w-full truncate bg-transparent text-[14px] text-slate-900 placeholder:text-slate-500/90 font-normal focus:outline-none"
                />

                {/* Clear button */}
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSuggestedProducts([]);
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* Voice search button */}
                <button
                  type="button"
                  onClick={handleVoiceClick}
                  aria-label={isListening ? "Listening... click to stop" : "Voice search"}
                  className={`shrink-0 transition-colors p-1 rounded-full cursor-pointer ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "text-[#1E293B] hover:opacity-80"
                  }`}
                >
                  <Mic className="h-5 w-5" strokeWidth={isListening ? 2.2 : 1.8} />
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isSearchOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {searchQuery.trim().length >= 2 ? (
                    <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
                      {/* Category suggestions */}
                      <div className="p-3 bg-slate-50/80 flex items-center gap-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 shrink-0">
                          Search in Category:
                        </span>
                        <div className="flex flex-wrap gap-1.5 flex-1">
                          {QUICK_CATEGORIES.map((cat) => (
                            <button
                              key={cat.slug}
                              type="button"
                              onClick={() => executeDesktopSearch(searchQuery, cat.slug)}
                              className="px-3 py-1 text-xs font-medium rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs cursor-pointer"
                            >
                              in {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Direct query submit row */}
                      <button
                        type="button"
                        onClick={() => executeDesktopSearch(searchQuery)}
                        className="w-full flex items-center justify-between px-5 py-3 text-left text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <Search className="h-4 w-4 shrink-0 text-blue-500" />
                          <span className="truncate">
                            Search for &quot;<strong className="text-slate-900">{searchQuery}</strong>&quot;
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-blue-500 shrink-0 group-hover:translate-x-1 transition-transform" />
                      </button>

                      {/* Product Suggestions */}
                      <div className="p-3">
                        <div className="flex items-center justify-between px-2 py-1 mb-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Suggested Products
                          </span>
                          {isSearchLoading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                        </div>

                        {suggestedProducts.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {suggestedProducts.map((p) => {
                              const image = p.variants?.[0]?.images?.[0] || "/placeholder-product.png";
                              const price = p.basePrice ?? p.variants?.[0]?.price ?? 0;
                              const mrp = p.baseMrp ?? p.variants?.[0]?.mrp;
                              return (
                                <button
                                  key={p._id}
                                  type="button"
                                  onClick={() => {
                                    setIsSearchOpen(false);
                                    router.push(`/product/${p._id}`);
                                  }}
                                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-slate-150 group cursor-pointer"
                                >
                                  <img
                                    src={image}
                                    alt={p.name}
                                    className="h-12 w-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = "none";
                                    }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                      {p.name}
                                    </p>
                                    <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                      <span className="font-bold text-slate-900">₹{price}</span>
                                      {mrp && mrp > price && (
                                        <span className="line-through text-slate-400">₹{mrp}</span>
                                      )}
                                      {p.storeName && (
                                        <span className="truncate text-slate-400">• {p.storeName}</span>
                                      )}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          !isSearchLoading && (
                            <div className="px-4 py-4 text-center text-xs text-slate-500">
                              No matching products found. Press Enter to view all results.
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Initial Trending Searches */
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span>Trending Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {TRENDING_SEARCHES.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => {
                              setSearchQuery(term);
                              executeDesktopSearch(term);
                            }}
                            className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Location Selector (Blinkit / Zomato Two-Tier Layout) */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2.5 rounded-2xl bg-[#022b82]/80 hover:bg-[#022b82] transition-colors border border-white/10 px-3.5 py-1.5 backdrop-blur-md shadow-sm max-w-[300px] cursor-pointer text-left group"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1668F6]/20 border border-[#4C82FB]/30 text-[#4C82FB] shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="h-4 w-4" fill="#4C82FB" strokeWidth={0} />
              </div>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1 text-[12px] font-bold text-white leading-tight truncate">
                  <span className="truncate">{isAuthenticated ? `${userName} - ` : ''}{locality}</span>
                  <ChevronDown className="h-3 w-3 shrink-0 text-white/80 group-hover:translate-y-0.5 transition-transform" strokeWidth={2.5} />
                </span>
                <span className="block text-[10px] text-white/75 truncate leading-tight mt-0.5 max-w-[210px]">
                  {displayFullAddress}
                </span>
              </span>
            </button>

            {/* Action Icons */}
            <div className="flex items-center gap-6 relative">
              {/* Notifications */}
              <div className="relative">
                <button 
                  type="button" 
                  onClick={() => toggleOverlay('notifications')}
                  className="group relative flex flex-col items-center justify-center gap-1 text-white hover:opacity-85 transition-opacity cursor-pointer"
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
                  className="group relative flex flex-col items-center justify-center gap-1 text-white hover:opacity-85 transition-opacity cursor-pointer"
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
                className="group relative flex flex-col items-center justify-center gap-1 text-white hover:opacity-85 transition-opacity cursor-pointer"
                onClick={handleAuthClick}
              >
                <CircleUserRound className="h-[22px] w-[22px]" strokeWidth={1.8} />
                <span className="text-[10px] font-medium tracking-wide">
                  {isAuthenticated ? "Account" : "Sign In"}
                </span>
              </button>
              
              {/* Orders */}
              {isAuthenticated && (
                <button
                  type="button"
                  className="group relative flex flex-col items-center justify-center gap-1 text-white hover:opacity-85 transition-opacity cursor-pointer"
                  onClick={() => router.push('/account/orders')}
                >
                  <Package className="h-[22px] w-[22px]" strokeWidth={1.8} />
                  <span className="text-[10px] font-medium tracking-wide">Orders</span>
                </button>
              )}

              {/* Cart */}
              <button type="button" className="group relative flex flex-col items-center justify-center gap-1 text-white hover:opacity-85 transition-opacity cursor-pointer" onClick={openCart}>
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

      {/* REQUIRED: Universal Category Strip across all desktop pages */}
      <DesktopCategoryStrip activeId={activeCategoryId} />

      {/* Location Modal */}
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
      />
    </div>
  );
}
