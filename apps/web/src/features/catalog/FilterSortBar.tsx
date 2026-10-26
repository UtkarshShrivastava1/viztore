'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  Filter,
  ArrowDownUp,
  Zap,
  Star,
  X,
  Check,
} from 'lucide-react';
import { useCatalogStore } from '@/stores/catalog.store';

interface FilterSortBarProps {
  totalProducts: number;
  onFilterChange?: (filters: {
    sort?: string;
    fastDelivery?: boolean;
    rating?: number;
  }) => void;
}

const SORT_OPTIONS = [
  { id: 'popularity', label: 'Popularity' },
  { id: 'nearest', label: 'Nearest First ⚡' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
] as const;

export function FilterSortBar({ totalProducts, onFilterChange }: FilterSortBarProps) {
  const activeFilters = useCatalogStore((state) => state.activeFilters);
  const setSort = useCatalogStore((state) => state.setSort);

  // Mobile Bottom Sheet state
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);
  const [minRating4, setMinRating4] = useState(false);

  const handleToggleFastDelivery = () => {
    const updated = !fastDeliveryOnly;
    setFastDeliveryOnly(updated);
    onFilterChange?.({ fastDelivery: updated });
  };

  const handleToggleRating4 = () => {
    const updated = !minRating4;
    setMinRating4(updated);
    onFilterChange?.({ rating: updated ? 4 : undefined });
  };

  const handleSelectSort = (sortId: 'popularity' | 'nearest' | 'price_asc' | 'price_desc') => {
    setSort(sortId);
    setIsSortDropdownOpen(false);
    onFilterChange?.({ sort: sortId });
  };

  return (
    <>
      {/* ── STICKY FILTER TOOLBAR (Mob 2.1) ── */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md border-b border-surface-200 px-3 sm:px-4 py-2.5 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
          {/* Filters Button (Opens Bottom Slide-over Sheet) */}
          <button
            type="button"
            onClick={() => setIsBottomSheetOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-surface-300 text-xs font-black text-[#061842] bg-surface-50 hover:bg-surface-100 whitespace-nowrap shrink-0 active:scale-95 transition-all shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5 text-[#1668F6]" />
            <span>Filters</span>
            <ChevronDown className="w-3 h-3 text-surface-400" />
          </button>

          {/* Sort By Dropdown Trigger */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-surface-300 text-xs font-extrabold text-[#061842] bg-white hover:bg-surface-50 whitespace-nowrap active:scale-95 transition-all shadow-2xs"
            >
              <ArrowDownUp className="w-3.5 h-3.5 text-surface-500" />
              <span>Sort By</span>
              <ChevronDown className="w-3 h-3 text-surface-400" />
            </button>

            {/* Sort Popover Dropdown */}
            {isSortDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-surface-200 py-1.5 z-40 animate-fade-in">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectSort(opt.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left font-bold transition-colors ${
                      activeFilters.sort === opt.id
                        ? 'bg-blue-50 text-[#1668F6]'
                        : 'text-surface-700 hover:bg-surface-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {activeFilters.sort === opt.id && (
                      <Check className="w-3.5 h-3.5 text-[#1668F6] stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fast Delivery ⚡ Chip */}
          <button
            type="button"
            onClick={handleToggleFastDelivery}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-black whitespace-nowrap shrink-0 active:scale-95 transition-all shadow-2xs ${
              fastDeliveryOnly
                ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-400'
                : 'border-surface-300 text-[#061842] bg-white hover:bg-surface-50'
            }`}
          >
            <span>Fast Delivery</span>
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          </button>

          {/* Ratings 4★+ Chip */}
          <button
            type="button"
            onClick={handleToggleRating4}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-black whitespace-nowrap shrink-0 active:scale-95 transition-all shadow-2xs ${
              minRating4
                ? 'bg-blue-50 border-[#1668F6] text-[#1668F6] ring-1 ring-[#1668F6]'
                : 'border-surface-300 text-[#061842] bg-white hover:bg-surface-50'
            }`}
          >
            <span>Ratings 4★+</span>
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          </button>

          {/* Right Product Counter */}
          <div className="ml-auto pl-2 shrink-0 text-right">
            <span className="text-[11px] font-extrabold text-surface-500 whitespace-nowrap">
              <strong className="text-[#061842]">{totalProducts.toLocaleString()}</strong> Items
            </span>
          </div>
        </div>
      </div>

      {/* ── MOBILE BOTTOM SLIDE-OVER SHEET (Mob 2.1) ── */}
      {isBottomSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsBottomSheetOpen(false)}
          />

          {/* Bottom Sheet Modal */}
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col z-50 animate-slide-up">
            {/* Sheet Header */}
            <div className="flex items-center justify-between p-4 border-b border-surface-200">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#1668F6]" />
                <h3 className="text-base font-black text-[#061842]">Filter & Refine</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBottomSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-surface-600 hover:text-[#061842]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sheet Content Body */}
            <div className="p-4 overflow-y-auto space-y-6">
              {/* Quick Sort Options */}
              <div>
                <h4 className="text-xs font-black text-[#061842] uppercase tracking-wider mb-2.5">
                  Sort By
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectSort(opt.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        activeFilters.sort === opt.id
                          ? 'border-[#1668F6] bg-blue-50 text-[#1668F6]'
                          : 'border-surface-200 text-surface-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Speed */}
              <div>
                <h4 className="text-xs font-black text-[#061842] uppercase tracking-wider mb-2.5">
                  Delivery Speed
                </h4>
                <button
                  type="button"
                  onClick={handleToggleFastDelivery}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                    fastDeliveryOnly
                      ? 'border-amber-400 bg-amber-50 text-amber-900'
                      : 'border-surface-200 text-surface-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>Instant Hyperlocal Delivery (within 30-45 mins)</span>
                  </div>
                  {fastDeliveryOnly && <Check className="w-4 h-4 text-amber-600 stroke-[3]" />}
                </button>
              </div>

              {/* Customer Rating */}
              <div>
                <h4 className="text-xs font-black text-[#061842] uppercase tracking-wider mb-2.5">
                  Customer Ratings
                </h4>
                <div className="flex gap-2">
                  {[4, 3, 2].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        const next = minRating4 && r === 4 ? false : true;
                        setMinRating4(next);
                      }}
                      className={`flex-1 py-2 rounded-xl border text-xs font-black flex items-center justify-center gap-1 ${
                        minRating4 && r === 4
                          ? 'border-[#1668F6] bg-blue-50 text-[#1668F6]'
                          : 'border-surface-200 text-surface-700'
                      }`}
                    >
                      <span>{r}★ & above</span>
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sheet Footer Actions */}
            <div className="p-4 border-t border-surface-200 flex items-center gap-3 bg-surface-50">
              <button
                type="button"
                onClick={() => {
                  setFastDeliveryOnly(false);
                  setMinRating4(false);
                  setSort('popularity');
                }}
                className="flex-1 h-11 rounded-xl border border-surface-300 bg-white font-extrabold text-xs text-surface-700 hover:bg-surface-100 transition-colors"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setIsBottomSheetOpen(false)}
                className="flex-1 h-11 rounded-xl bg-[#1668F6] hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
