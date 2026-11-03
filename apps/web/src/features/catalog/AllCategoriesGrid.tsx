'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
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
  ChevronRight,
  ArrowRight,
  Store,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import { CANONICAL_CATEGORIES, type CanonicalCategory } from '@/features/category';

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

export function AllCategoriesGrid() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredCategories = React.useMemo(() => {
    if (activeFilter === 'all') return CANONICAL_CATEGORIES;
    return CANONICAL_CATEGORIES.filter((c) => c.id === activeFilter);
  }, [activeFilter]);

  return (
    <div className="w-full space-y-6">
      {/* Quick Jump Horizontal Rail */}
      <div className="w-full bg-slate-50 p-2 sm:p-2.5 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#1668F6] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Departments ({CANONICAL_CATEGORIES.length})
          </button>
          {CANONICAL_CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.iconName] || Smartphone;
            const isSelected = activeFilter === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveFilter(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1668F6] text-white shadow-xs font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : ''}`} style={{ color: isSelected ? '#FFFFFF' : cat.color }} />
                <span>{cat.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of All 17 Canonical Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredCategories.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] || Smartphone;

          return (
            <div
              key={cat.id}
              className="group bg-white rounded-3xl border border-slate-200/80 hover:border-[#1668F6]/40 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Category Header & Thumbnail */}
              <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900">
                <img
                  src={cat.heroImage}
                  alt={cat.label}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent`} />

                {/* Category Icon Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md backdrop-blur-md border border-white/20"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: cat.color }} strokeWidth={2.3} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-bold border border-white/10">
                    {cat.subcategories.length} Subcategories
                  </span>
                </div>

                {/* Title & Tagline overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-black tracking-tight leading-tight group-hover:text-blue-300 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-[11.5px] text-slate-200 font-medium line-clamp-1 mt-0.5 opacity-90">
                    {cat.tagline}
                  </p>
                </div>
              </div>

              {/* Subcategories Pills Section */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2.5">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" /> Popular Departments:
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories.slice(0, 6).map((sub) => (
                      <Link
                        key={sub.name}
                        href={`/category/${cat.id}?sub=${encodeURIComponent(sub.name)}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100/80 hover:bg-[#EBF2FE] text-slate-700 hover:text-[#1668F6] text-[11px] font-semibold transition-colors border border-slate-200/50 hover:border-[#1668F6]/30"
                      >
                        {sub.name}
                      </Link>
                    ))}
                    {cat.subcategories.length > 6 && (
                      <span className="px-2 py-1 text-[11px] font-semibold text-slate-400">
                        +{cat.subcategories.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action Links */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/category/${cat.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EBF2FE] hover:bg-[#1668F6] text-[#1668F6] hover:text-white text-xs font-bold transition-all shadow-2xs group/btn flex-1 justify-center"
                  >
                    <span>Explore Department</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                  <Link
                    href={`/stores?category=${cat.id}`}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors border border-slate-200 shrink-0"
                    title={`Find ${cat.shortLabel} Stores`}
                  >
                    <Store className="w-3.5 h-3.5 text-slate-500" />
                    <span>Stores</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
