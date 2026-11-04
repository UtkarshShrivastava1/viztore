"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Mic, Bell, CircleUserRound, X, TrendingUp, ArrowRight, Loader2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { fetchProducts } from "@/lib/api/catalog";
import type { IProduct } from "@repo/shared-types";

interface SearchBarProps {
  placeholder?: string;
  notificationCount?: number;
}

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

export default function SearchBar({
  placeholder = "Search for products, stores and more...",
  notificationCount = 0,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<IProduct[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const authUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const userInitial = authUser?.fullName?.trim().charAt(0).toUpperCase() || 'U';

  const { isListening, startListening, stopListening } = useVoiceSearch();

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced product suggestions lookup
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestedProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetchProducts({ search: trimmed, limit: 4 });
        setSuggestedProducts(res.products || []);
      } catch (err) {
        console.error("Autocomplete fetch error:", err);
        setSuggestedProducts([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const executeSearch = useCallback(
    (searchString: string, categorySlug?: string) => {
      const q = searchString.trim();
      setIsOpen(false);
      if (!q && !categorySlug) return;

      const params = new URLSearchParams();
      if (q) params.set("search", q);
      if (categorySlug) params.set("category", categorySlug);

      router.push(`/products?${params.toString()}`);
    },
    [router],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      executeSearch(query);
    }
  };

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setQuery(transcript);
        executeSearch(transcript);
      });
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push("/account");
    } else {
      openAuthModal("login");
    }
  };

  const handleNotificationClick = () => {
    router.push("/account/notifications");
  };

  return (
    <div className="relative z-30 px-4 pb-3.5" ref={containerRef}>
      <div className="flex items-center gap-3.5">
        {/* Search Input Container */}
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-1 items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-400"
        >
          <button
            type="submit"
            aria-label="Execute search"
            className="text-slate-700 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
          >
            <Search className="h-5 w-5 shrink-0 text-[#1E293B]" strokeWidth={2} />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full truncate bg-transparent text-[13px] text-slate-900 placeholder:text-slate-500/90 font-normal focus:outline-none"
          />

          {/* Clear input button */}
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestedProducts([]);
                inputRef.current?.focus();
              }}
              aria-label="Clear search input"
              className="p-0.5 text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Voice Search Button */}
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
            <Mic className="h-4.5 w-4.5" strokeWidth={isListening ? 2.2 : 1.8} />
          </button>
        </form>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={handleNotificationClick}
          aria-label="Notifications"
          suppressHydrationWarning
          className="relative text-white hover:opacity-85 transition-opacity shrink-0 cursor-pointer"
        >
          <Bell className="h-[25px] w-[25px]" strokeWidth={1.75} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] px-1 items-center justify-center rounded-full bg-[#FF3B30] text-[10px] font-bold text-white shadow-sm border border-[#011A5D]">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Profile / Auth State Trigger */}
        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleProfileClick}
            aria-label={`Profile (${authUser?.fullName || "User"})`}
            className="relative shrink-0 cursor-pointer group p-0.5 active:scale-95 transition-transform"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1668F6] to-[#4C82FB] font-black text-xs text-white shadow-md shadow-blue-500/40 border border-white/40 group-hover:scale-105 transition-transform">
              {userInitial}
            </div>
            {/* Live Green Pulsing Beacon */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-[#011A5D]" />
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleProfileClick}
            aria-label="Sign In"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[11px] font-bold shrink-0 cursor-pointer active:scale-95 transition-all shadow-sm"
          >
            <LogIn className="h-3.5 w-3.5 text-blue-200" strokeWidth={2.2} />
            <span>Sign In</span>
          </button>
        )}
      </div>

      {/* Autocomplete & Discovery Dropdown */}
      {isOpen && (
        <div className="absolute left-4 right-4 top-full mt-1.5 rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Active Query Matching Header */}
          {query.trim().length >= 2 ? (
            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
              {/* Category Search Shortcuts */}
              <div className="p-2.5 bg-slate-50/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                  Filter by Category
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => executeSearch(query, cat.slug)}
                      className="px-2.5 py-1 text-xs font-medium rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs cursor-pointer"
                    >
                      in {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Full Search Item */}
              <button
                type="button"
                onClick={() => executeSearch(query)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Search className="h-4 w-4 shrink-0 text-blue-500" />
                  <span className="truncate">
                    Search for &quot;<strong className="text-slate-900">{query}</strong>&quot;
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-blue-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Matching Products */}
              <div className="p-2">
                <div className="flex items-center justify-between px-2 py-1 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Products
                  </span>
                  {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
                </div>

                {suggestedProducts.length > 0 ? (
                  <div className="space-y-1">
                    {suggestedProducts.map((p) => {
                      const image = p.variants?.[0]?.images?.[0] || "/placeholder-product.png";
                      const price = p.basePrice ?? p.variants?.[0]?.price ?? 0;
                      const mrp = p.baseMrp ?? p.variants?.[0]?.mrp;
                      return (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            router.push(`/product/${p._id}`);
                          }}
                          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                        >
                          <img
                            src={image}
                            alt={p.name}
                            className="h-10 w-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
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
                  !isLoading && (
                    <div className="px-3 py-3 text-center text-xs text-slate-500">
                      No exact product match. Press Enter to view all results.
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            /* Trending / Popular Initial State */
            <div className="p-3.5 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      executeSearch(term);
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
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
  );
}
