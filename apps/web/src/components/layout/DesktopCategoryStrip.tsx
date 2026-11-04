"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Smartphone,
  Shirt,
  Sparkles,
  Baby,
  Sofa,
  ShoppingBasket,
  Trophy,
  Dumbbell,
  HeartPulse,
  Book,
  PenTool,
  Car,
  Wrench,
  Stethoscope,
  Music,
  Film,
  Gamepad2,
  ChevronDown,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import {
  STRIP_VISIBLE_CATEGORIES,
  STRIP_OVERFLOW_CATEGORIES,
  getCanonicalCategoryBySlug,
} from "@/features/category";

const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone,
  Shirt,
  Sparkles,
  Baby,
  Sofa,
  ShoppingBasket,
  Trophy,
  Dumbbell,
  HeartPulse,
  Book,
  PenTool,
  Car,
  Wrench,
  Stethoscope,
  Music,
  Film,
  Gamepad2,
};

interface DesktopCategoryStripProps {
  activeId?: string;
  onSelect?: (id: string) => void;
}

export default function DesktopCategoryStrip({ activeId, onSelect }: DesktopCategoryStripProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Derive active selection from props or current pathname
  const currentActive = React.useMemo(() => {
    if (activeId) return activeId;
    if (pathname === "/") return "home";
    if (pathname === "/category" || pathname === "/categories") return "all";
    if (pathname.startsWith("/category/")) {
      const slug = pathname.replace("/category/", "").split("/")[0];
      const match = getCanonicalCategoryBySlug(slug);
      return match ? match.id : slug;
    }
    return "home";
  }, [activeId, pathname]);

  // Check if active category is in overflow
  const isOverflowActive = STRIP_OVERFLOW_CATEGORIES.some((c) => c.id === currentActive);
  const activeOverflowCategory = isOverflowActive
    ? STRIP_OVERFLOW_CATEGORIES.find((c) => c.id === currentActive)
    : undefined;

  const handleSelect = (id: string) => {
    setIsMoreOpen(false);
    onSelect?.(id);
    if (id === "home") {
      router.push("/");
    } else if (id === "all") {
      router.push("/category");
    } else {
      router.push(`/category/${id}`);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsMoreOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsMoreOpen(false);
    }, 200);
  };

  return (
    <div className={`w-full bg-[#FFFFFF] border-b border-slate-200/90 select-none shadow-[0_1px_3px_rgba(0,0,0,0.03)] relative ${isMoreOpen ? 'z-30' : 'z-20'}`}>
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6">
        <nav
          aria-label="Categories"
          className="flex items-center justify-between w-full py-1.5 gap-1 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {/* 1. Home Tab */}
          <Link
            href="/"
            prefetch={true}
            onClick={() => {
              setIsMoreOpen(false);
              onSelect?.("home");
            }}
            className={`flex-1 min-w-[62px] sm:min-w-[70px] lg:min-w-0 flex flex-col items-center justify-center gap-1 py-1.5 px-1 sm:px-2 rounded-xl transition-all duration-200 group cursor-pointer text-center ${
              currentActive === "home"
                ? "bg-[#EBF2FE] shadow-2xs font-bold ring-1 ring-[#1668F6]/20"
                : "hover:bg-slate-100/70 font-medium"
            }`}
          >
            <div
              className={`flex items-center justify-center transition-transform duration-150 ${
                currentActive === "home" ? "scale-110 text-[#1668F6]" : "text-[#1668F6] group-hover:scale-110"
              }`}
            >
              <Home className="h-5 w-5 sm:h-5.5 sm:w-5.5 shrink-0" strokeWidth={currentActive === "home" ? 2.5 : 2} />
            </div>
            <span
              className={`text-[10px] sm:text-[11px] lg:text-[11.5px] leading-tight tracking-tight whitespace-nowrap transition-colors ${
                currentActive === "home" ? "text-[#0B1953] font-bold" : "text-[#475569] group-hover:text-[#0B1953]"
              }`}
            >
              Home
            </span>
          </Link>

          {/* 2. All Categories Directory */}
          <Link
            href="/category"
            prefetch={true}
            onClick={() => {
              setIsMoreOpen(false);
              onSelect?.("all");
            }}
            className={`flex-1 min-w-[66px] sm:min-w-[74px] lg:min-w-0 flex flex-col items-center justify-center gap-1 py-1.5 px-1 sm:px-2 rounded-xl transition-all duration-200 group cursor-pointer text-center ${
              currentActive === "all"
                ? "bg-[#EBF2FE] shadow-2xs font-bold ring-1 ring-[#1668F6]/20"
                : "hover:bg-slate-100/70 font-medium"
            }`}
          >
            <div
              className={`flex items-center justify-center transition-transform duration-150 ${
                currentActive === "all" ? "scale-110 text-[#1668F6]" : "text-[#1668F6] group-hover:scale-110"
              }`}
            >
              <LayoutGrid className="h-5 w-5 sm:h-5.5 sm:w-5.5 shrink-0" strokeWidth={currentActive === "all" ? 2.5 : 2} />
            </div>
            <span
              className={`text-[10px] sm:text-[11px] lg:text-[11.5px] leading-tight tracking-tight whitespace-nowrap transition-colors ${
                currentActive === "all" ? "text-[#0B1953] font-bold" : "text-[#475569] group-hover:text-[#0B1953]"
              }`}
            >
              All Categories
            </span>
          </Link>

          {/* 3. Pre-configured Taxonomy Visible Categories */}
          {STRIP_VISIBLE_CATEGORIES.map((cat) => {
            const isActive = currentActive === cat.id;
            const Icon = ICON_MAP[cat.iconName] || Smartphone;

            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                prefetch={true}
                onClick={() => {
                  setIsMoreOpen(false);
                  onSelect?.(cat.id);
                }}
                className={`flex-1 min-w-[62px] sm:min-w-[70px] lg:min-w-0 flex flex-col items-center justify-center gap-1 py-1.5 px-1 sm:px-2 rounded-xl transition-all duration-200 group cursor-pointer text-center ${
                  isActive ? "shadow-2xs font-bold ring-1 ring-[#1668F6]/20" : "hover:bg-slate-100/70 font-medium"
                }`}
                style={{ backgroundColor: isActive ? cat.activeBg : "transparent" }}
              >
                <div
                  className={`flex items-center justify-center transition-transform duration-150 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                >
                  <Icon
                    className="h-5 w-5 sm:h-5.5 sm:w-5.5 shrink-0"
                    style={{ color: cat.color }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] lg:text-[11.5px] leading-tight tracking-tight whitespace-nowrap transition-colors ${
                    isActive ? "text-[#0B1953] font-bold" : "text-[#475569] group-hover:text-[#0B1953]"
                  }`}
                  title={cat.label}
                >
                  {cat.shortLabel}
                </span>
              </Link>
            );
          })}

          {/* 4. Responsive "More ▾" Overflow Dropdown */}
          <div
            ref={dropdownRef}
            className="relative flex-1 min-w-[62px] sm:min-w-[70px] lg:min-w-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setIsMoreOpen((prev) => !prev)}
              aria-expanded={isMoreOpen}
              className={`w-full flex flex-col items-center justify-center gap-1 py-1.5 px-1 sm:px-2 rounded-xl transition-all duration-200 group cursor-pointer text-center ${
                isOverflowActive || isMoreOpen
                  ? "bg-[#EBF2FE] shadow-2xs font-bold ring-1 ring-[#1668F6]/25"
                  : "hover:bg-slate-100/70 font-medium"
              }`}
            >
              <div
                className={`flex items-center justify-center transition-transform duration-150 ${
                  isOverflowActive ? "scale-110 text-[#1668F6]" : "text-[#1668F6] group-hover:scale-110"
                }`}
              >
                <div className="flex items-center gap-0.5">
                  {activeOverflowCategory ? (
                    (() => {
                      const ActiveIcon = ICON_MAP[activeOverflowCategory.iconName] || LayoutGrid;
                      return <ActiveIcon className="h-5 w-5 shrink-0" style={{ color: activeOverflowCategory.color }} />;
                    })()
                  ) : (
                    <LayoutGrid className="h-5 w-5 shrink-0" />
                  )}
                  <ChevronDown
                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-200 text-[#1668F6] ${
                      isMoreOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              <span
                className={`text-[10px] sm:text-[11px] lg:text-[11.5px] leading-tight tracking-tight whitespace-nowrap transition-colors flex items-center gap-0.5 ${
                  isOverflowActive || isMoreOpen ? "text-[#0B1953] font-bold" : "text-[#475569] group-hover:text-[#0B1953]"
                }`}
              >
                {activeOverflowCategory ? activeOverflowCategory.shortLabel : "More"}
              </span>
            </button>

            {/* Dropdown Popover Menu */}
            {isMoreOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-3 px-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-md"
                role="menu"
              >
                <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-extrabold text-[#0B1953] tracking-tight">More Departments</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Pre-configured catalog categories</p>
                  </div>
                  <Link
                    href="/category"
                    prefetch={true}
                    onClick={() => {
                      setIsMoreOpen(false);
                      onSelect?.("all");
                    }}
                    className="text-[11px] font-bold text-[#1668F6] hover:text-[#0B1953] flex items-center gap-1 group"
                  >
                    All 17 <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[380px] overflow-y-auto pr-1">
                  {STRIP_OVERFLOW_CATEGORIES.map((cat) => {
                    const Icon = ICON_MAP[cat.iconName] || LayoutGrid;
                    const isSelected = currentActive === cat.id;

                    return (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.id}`}
                        prefetch={true}
                        role="menuitem"
                        onClick={() => {
                          setIsMoreOpen(false);
                          onSelect?.(cat.id);
                        }}
                        className={`flex items-center gap-2.5 p-2 rounded-xl text-left transition-all duration-150 group cursor-pointer ${
                          isSelected
                            ? "bg-[#EBF2FE] text-[#0B1953] ring-1 ring-[#1668F6]/20 font-bold"
                            : "hover:bg-slate-50 text-slate-700 hover:text-[#0B1953]"
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: cat.activeBg }}
                        >
                          <Icon className="w-4 h-4" style={{ color: cat.color }} strokeWidth={2.2} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11.5px] font-bold truncate group-hover:text-[#1668F6] transition-colors">
                            {cat.label}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium truncate">
                            {cat.subcategories.slice(0, 2).map((s) => s.name).join(", ")}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 px-1">
                  <Link
                    href="/category"
                    prefetch={true}
                    onClick={() => {
                      setIsMoreOpen(false);
                      onSelect?.("all");
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-[#EBF2FE] text-[#1668F6] text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Browse All Departments Directory
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
