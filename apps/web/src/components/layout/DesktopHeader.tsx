"use client";

import {
  Heart,
  ShoppingCart,
  Search,
  Mic,
  Bell,
  MapPin,
  ChevronDown,
  X,
  TrendingUp,
  ArrowRight,
  Loader2,
  Package,
  LogIn,
  Settings,
  Ticket,
  LifeBuoy,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import Logo from '@/components/layout/Logo';
import Link from 'next/link';
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
import { useToastStore } from '@/stores/toast.store';
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
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<IProduct[]>([]);
  const [searchCategory, setSearchCategory] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

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

  const notificationCount = useNotificationStore((state) => state.unreadCount);
  const fetchUnreadSummary = useNotificationStore((state) => state.fetchUnreadSummary);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const wishlistCount = useWishlistFlyoutStore((state) => state.items.length);

  useEffect(() => {
    if (authIsAuthenticated) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        fetchUnreadSummary().catch(() => {});
        fetchNotifications().catch(() => {});
      }
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

  // Click outside to close overlays & account menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on page navigation
  useEffect(() => {
    setIsAccountMenuOpen(false);
    setActiveOverlay(null);
  }, [pathname]);

  const cartCount = mounted ? (propCartCount !== undefined ? propCartCount : rawCartCount) : 0;
  const isAuthenticated = mounted ? (propIsAuthenticated !== undefined ? propIsAuthenticated : authIsAuthenticated) : false;
  const userName = mounted ? (propUserName || authUser?.fullName || "Customer") : "Customer";
  const firstName = userName.trim().split(' ')[0] || userName;
  const userInitial = firstName.charAt(0).toUpperCase() || 'U';

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

  // Determine active category for the category strip
  const activeCategoryId = pathname.startsWith('/category/')
    ? pathname.replace('/category/', '')
    : searchCategory || undefined;

  const toggleOverlay = (overlay: 'notifications' | 'wishlist') => {
    setIsAccountMenuOpen(false);
    setActiveOverlay((prev) => (prev === overlay ? null : overlay));
  };

  return (
    <div className="hidden md:block w-full" ref={headerRef}>
      {/* Top Navigation Bar */}
      <div
        className={`w-full relative ${
          isSearchOpen || isAccountMenuOpen || activeOverlay ? "z-50" : "z-40"
        }`}
        style={{
          background: "linear-gradient(135deg, #011A5D 0%, #002275 60%, #032b8a 100%)",
        }}
      >
        <div className="max-w-[1920px] mx-auto px-6 py-2.5">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="shrink-0 hover:opacity-95 transition-opacity">
              <Logo />
            </div>

            {/* Location Selector (Blinkit / Zomato Two-Tier Layout) */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2.5 rounded-2xl bg-[#022b82]/80 hover:bg-[#022b82] transition-colors border border-white/15 px-3.5 py-1.5 backdrop-blur-md shadow-sm max-w-[280px] cursor-pointer text-left group"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#1668F6]/25 border border-[#4C82FB]/30 text-[#4C82FB] shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="h-4 w-4" fill="#4C82FB" strokeWidth={0} />
              </div>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1 text-[12px] font-bold text-white leading-tight truncate">
                  <span className="truncate">
                    {isAuthenticated ? `${firstName} • ` : 'Deliver to '}
                    {locality}
                  </span>
                  <ChevronDown
                    className="h-3 w-3 shrink-0 text-white/80 group-hover:translate-y-0.5 transition-transform"
                    strokeWidth={2.5}
                  />
                </span>
                <span className="block text-[10px] text-white/75 truncate leading-tight mt-0.5 max-w-[190px]">
                  {displayFullAddress}
                </span>
              </span>
            </button>

            {/* Search Bar - Center and Large */}
            <div className={`relative flex flex-1 max-w-2xl mx-2 ${isSearchOpen ? "z-50" : ""}`} ref={searchContainerRef}>
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-1 items-center gap-2.5 rounded-full bg-white px-4 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#4C82FB]/50 focus-within:shadow-md"
              >
                <button
                  type="submit"
                  aria-label="Search"
                  className="shrink-0 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <Search className="h-4.5 w-4.5" strokeWidth={2} />
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
                  className="w-full truncate bg-transparent text-[13.5px] text-slate-900 placeholder:text-slate-500 font-normal focus:outline-none"
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
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Mic className="h-4.5 w-4.5" strokeWidth={isListening ? 2.2 : 1.8} />
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isSearchOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {searchQuery.trim().length >= 2 ? (
                    <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
                      {/* Search category filters */}
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
                                    router.push(`/products/${p.slug || p._id}`);
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

            {/* Action Buttons & Profile Controls */}
            <div className="flex items-center gap-3.5 shrink-0 relative">
              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleOverlay('notifications')}
                  className={`group relative flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 rounded-xl text-white transition-all cursor-pointer ${
                    activeOverlay === 'notifications' ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                  aria-label="Notifications"
                >
                  <div className="relative">
                    <Bell className="h-[21px] w-[21px]" strokeWidth={1.8} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-[16px] min-w-[16px] px-1 items-center justify-center rounded-full bg-[#FF3B30] text-[9px] font-bold text-white shadow-sm border border-[#011A5D]">
                        {notificationCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium tracking-tight text-white/80 group-hover:text-white">
                    Alerts
                  </span>
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
                  className={`group relative flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 rounded-xl text-white transition-all cursor-pointer ${
                    activeOverlay === 'wishlist' ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                  aria-label="Wishlist"
                >
                  <div className="relative">
                    <Heart className="h-[21px] w-[21px]" strokeWidth={1.8} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-[16px] min-w-[16px] px-1 items-center justify-center rounded-full bg-[#FF3B30] text-[9px] font-bold text-white shadow-sm border border-[#011A5D]">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium tracking-tight text-white/80 group-hover:text-white">
                    Wishlist
                  </span>
                </button>
                {activeOverlay === 'wishlist' && (
                  <WishlistFlyout onClose={() => setActiveOverlay(null)} />
                )}
              </div>

              {/* Orders Shortcut (when authenticated) */}
              {isAuthenticated && (
                <Link
                  href="/account/orders"
                  prefetch={true}
                  className="group relative flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 rounded-xl text-white hover:bg-white/10 transition-all cursor-pointer"
                  aria-label="My Orders"
                >
                  <Package className="h-[21px] w-[21px]" strokeWidth={1.8} />
                  <span className="text-[10px] font-medium tracking-tight text-white/80 group-hover:text-white">
                    Orders
                  </span>
                </Link>
              )}

              {/* ACCOUNT / AUTH STATE (HIGH VISUAL DIFFERENTIATION) */}
              {isAuthenticated ? (
                <div className="relative" ref={accountMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveOverlay(null);
                      setIsAccountMenuOpen((prev) => !prev);
                    }}
                    className={`group relative flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${
                      isAccountMenuOpen
                        ? 'bg-white/25 border-white/40 shadow-blue-500/20'
                        : 'bg-white/10 hover:bg-white/20 border-white/15'
                    }`}
                    aria-label={`Account menu for ${userName}`}
                    aria-expanded={isAccountMenuOpen}
                  >
                    {/* Glowing Avatar Initial */}
                    <div className="relative shrink-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1668F6] to-[#4C82FB] font-black text-xs text-white shadow-md shadow-blue-500/40 border border-white/30 group-hover:scale-105 transition-transform">
                        {userInitial}
                      </div>
                      {/* Active green pulsing beacon */}
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-[#011A5D]" />
                      </span>
                    </div>

                    <div className="text-left hidden xl:block">
                      <span className="block text-[9px] font-semibold text-white/70 leading-tight uppercase tracking-wider">
                        Hello,
                      </span>
                      <span className="flex items-center gap-1 text-[12px] font-bold text-white leading-tight">
                        <span className="max-w-[85px] truncate">{firstName}</span>
                        <ChevronDown
                          className={`h-3 w-3 text-white/75 transition-transform duration-200 ${
                            isAccountMenuOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </span>
                    </div>
                  </button>

                  {/* Account Quick Menu Dropdown */}
                  {isAccountMenuOpen && (
                    <div className="absolute right-0 top-full mt-2.5 w-72 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Identity Ribbon */}
                      <div className="bg-gradient-to-br from-[#011A5D] via-[#0b276b] to-[#1668F6] p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 font-black text-lg text-white border border-white/30 shadow-inner">
                            {userInitial}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-white truncate leading-tight">
                                {userName}
                              </h4>
                              <ShieldCheck className="h-4 w-4 text-emerald-300 shrink-0" />
                            </div>
                            <p className="text-[11px] text-white/75 truncate mt-0.5">
                              {authUser?.email || authUser?.phone || "Verified Shopper"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] text-white/85">
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            Active Customer
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAccountMenuOpen(false);
                              router.push('/account/edit-profile');
                            }}
                            className="text-white hover:underline text-[11px] font-semibold cursor-pointer"
                          >
                            Edit Profile
                          </button>
                        </div>
                      </div>

                      {/* Quick Navigation Items */}
                      <div className="p-2 space-y-0.5 text-xs font-semibold text-slate-700">
                        <Link
                          href="/account/orders"
                          prefetch={true}
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <Package className="h-4 w-4 text-slate-400 group-hover:text-[#1668F6] transition-colors" />
                          <span className="flex-1">My Orders</span>
                          <span className="text-[10px] font-medium text-slate-400 group-hover:text-[#1668F6]">Track & review</span>
                        </Link>
                        <Link
                          href="/account/wishlist"
                          prefetch={true}
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <Heart className="h-4 w-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                          <span className="flex-1">Wishlist</span>
                          {wishlistCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold text-[10px]">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/account/addresses"
                          prefetch={true}
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <MapPin className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                          <span className="flex-1">Saved Addresses</span>
                        </Link>
                        <Link
                          href="/account/coupons"
                          prefetch={true}
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <Ticket className="h-4 w-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                          <span className="flex-1">Coupons & Offers</span>
                        </Link>
                        <Link
                          href="/account/support"
                          prefetch={true}
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <LifeBuoy className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                          <span className="flex-1">Help & Support</span>
                        </Link>
                        <Link
                          href="/account"
                          prefetch={true}
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <Settings className="h-4 w-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
                          <span className="flex-1">Account Hub</span>
                        </Link>
                      </div>

                      {/* Sign Out Action */}
                      <div className="p-2 border-t border-slate-100 bg-slate-50/60">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            useAuthStore.getState().logout();
                            useToastStore.getState().showToast({
                              type: 'info',
                              title: 'Signed out successfully',
                              message: 'You have been logged out of your account. Come back soon!',
                              duration: 3500,
                            });
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* GUEST SIGN IN BUTTON */
                <button
                  type="button"
                  onClick={handleAuthClick}
                  className="group relative flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white backdrop-blur-md shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
                  aria-label="Sign In to your account"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/30 text-blue-200 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner">
                    <LogIn className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </div>
                  <div className="text-left leading-none">
                    <span className="block text-[11px] font-bold text-white tracking-tight">Sign In</span>
                    <span className="block text-[9px] text-white/70 font-medium mt-0.5">Join Free</span>
                  </div>
                </button>
              )}

              {/* Cart Button */}
              <button
                type="button"
                onClick={openCart}
                className="group relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-[#1668F6] hover:bg-[#1255cc] active:scale-95 text-white transition-all duration-200 cursor-pointer shadow-md shadow-blue-500/25 border border-white/20"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingCart className="h-[19px] w-[19px]" strokeWidth={2.2} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 flex h-[18px] min-w-[18px] px-1 items-center justify-center rounded-full bg-white text-[#1668F6] text-[10px] font-black shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <span className="block text-[11px] font-black uppercase tracking-wider">Cart</span>
                  <span className="block text-[9px] text-white/85 font-semibold">
                    {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? 's' : ''}` : '₹0'}
                  </span>
                </div>
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
