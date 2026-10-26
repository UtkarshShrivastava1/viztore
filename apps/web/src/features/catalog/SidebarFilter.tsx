'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Search,
  X,
  Star,
  SlidersHorizontal,
} from 'lucide-react';

export interface FilterState {
  category?: string;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  discount?: number;
  rating?: number;
}

interface SidebarFilterProps {
  totalCount?: number;
  activeFilters?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
  onClearAll?: () => void;
}

const CATEGORY_LIST = [
  { id: 't-shirts', name: 'T-Shirts', count: 12456 },
  { id: 'polo-t-shirts', name: 'Polo T-shirts', count: 3240 },
  { id: 'round-neck', name: 'Round Neck', count: 4521 },
  { id: 'v-neck', name: 'V Neck', count: 2340 },
  { id: 'printed', name: 'Printed T-shirts', count: 6210 },
  { id: 'striped', name: 'Striped', count: 1982 },
  { id: 'full-sleeve', name: 'Full Sleeve', count: 2104 },
  { id: 'oversized', name: 'Oversized', count: 1540 },
];

const BRAND_LIST = [
  { id: 'us-polo', name: 'U.S. Polo Assn.', count: 1245 },
  { id: 'levis', name: "Levi's", count: 980 },
  { id: 'puma', name: 'Puma', count: 876 },
  { id: 'nike', name: 'Nike', count: 1120 },
  { id: 'adidas', name: 'Adidas', count: 1430 },
  { id: 'roadster', name: 'Roadster', count: 965 },
  { id: 'hrx', name: 'HRX', count: 743 },
  { id: 'souled-store', name: 'The Souled Store', count: 689 },
];

const DISCOUNT_CHIPS = [
  { label: '10% and above', value: 10 },
  { label: '20% and above', value: 20 },
  { label: '30% and above', value: 30 },
  { label: '50% and above', value: 50 },
];

const RATING_OPTIONS = [
  { label: '4★ & above', value: 4 },
  { label: '3★ & above', value: 3 },
  { label: '2★ & above', value: 2 },
];

export function SidebarFilter({
  totalCount = 1420,
  activeFilters: externalFilters,
  onFilterChange,
  onClearAll,
}: SidebarFilterProps) {
  // Local state if not controlled externally
  const [internalFilters, setInternalFilters] = useState<FilterState>({
    category: undefined,
    brands: [],
    minPrice: undefined,
    maxPrice: undefined,
    discount: undefined,
    rating: undefined,
  });

  const filters = externalFilters || internalFilters;

  const updateFilters = (newFilters: FilterState) => {
    setInternalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  // Accordion toggle states
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
    discount: true,
    ratings: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Category Show More
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Search within brands
  const [brandSearch, setBrandSearch] = useState('');
  const [showBrandSearch, setShowBrandSearch] = useState(false);

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return BRAND_LIST;
    return BRAND_LIST.filter((b) =>
      b.name.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [brandSearch]);

  const displayedCategories = showAllCategories
    ? CATEGORY_LIST
    : CATEGORY_LIST.slice(0, 5);

  const handleBrandToggle = (brandName: string) => {
    const current = filters.brands || [];
    const updated = current.includes(brandName)
      ? current.filter((b) => b !== brandName)
      : [...current, brandName];
    updateFilters({ ...filters, brands: updated });
  };

  const handleDiscountToggle = (val: number) => {
    const updated = filters.discount === val ? undefined : val;
    updateFilters({ ...filters, discount: updated });
  };

  const handleRatingToggle = (val: number) => {
    const updated = filters.rating === val ? undefined : val;
    updateFilters({ ...filters, rating: updated });
  };

  const handleClearAll = () => {
    const cleared: FilterState = {
      category: undefined,
      brands: [],
      minPrice: undefined,
      maxPrice: undefined,
      discount: undefined,
      rating: undefined,
    };
    setInternalFilters(cleared);
    setBrandSearch('');
    if (onClearAll) {
      onClearAll();
    } else {
      onFilterChange?.(cleared);
    }
  };

  // Determine active filter badges
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (filters.category) {
      chips.push({
        key: `cat-${filters.category}`,
        label: `Category: ${filters.category}`,
        onRemove: () => updateFilters({ ...filters, category: undefined }),
      });
    }
    filters.brands.forEach((brand) => {
      chips.push({
        key: `brand-${brand}`,
        label: brand,
        onRemove: () => handleBrandToggle(brand),
      });
    });
    if (filters.discount) {
      chips.push({
        key: 'discount',
        label: `${filters.discount}%+ Off`,
        onRemove: () => updateFilters({ ...filters, discount: undefined }),
      });
    }
    if (filters.rating) {
      chips.push({
        key: 'rating',
        label: `${filters.rating}★ & above`,
        onRemove: () => updateFilters({ ...filters, rating: undefined }),
      });
    }
    if (filters.minPrice || filters.maxPrice) {
      chips.push({
        key: 'price',
        label: `₹${filters.minPrice || 0} - ₹${filters.maxPrice || '10,000+'}`,
        onRemove: () => updateFilters({ ...filters, minPrice: undefined, maxPrice: undefined }),
      });
    }
    return chips;
  }, [filters]);

  return (
    <aside className="w-[260px] shrink-0 hidden lg:block select-none bg-white border border-surface-200 rounded-3xl p-5 shadow-xs sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
      {/* ── HEADER WITH 1-CLICK CLEAR ALL (Web 2.1a) ── */}
      <div className="flex items-center justify-between pb-3.5 border-b border-surface-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1668F6]" />
          <h2 className="text-base font-black text-[#061842]">Filters</h2>
          <span className="text-[11px] font-bold text-surface-400">
            ({totalCount.toLocaleString()})
          </span>
        </div>
        {activeChips.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-black text-[#1668F6] hover:underline transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* ── ACTIVE FILTER CHIPS ROW (Web 2.1a) ── */}
      {activeChips.length > 0 && (
        <div className="py-3 border-b border-surface-100">
          <div className="flex flex-wrap gap-1.5">
            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50/80 text-[#1668F6] text-[11px] font-bold border border-blue-200/80"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="hover:text-blue-800 p-0.5 rounded-full"
                  aria-label={`Remove ${chip.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── CATEGORIES ACCORDION ── */}
      <div className="py-4 border-b border-surface-100">
        <button
          type="button"
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left group"
        >
          <h3 className="text-xs font-black text-[#061842] tracking-wider uppercase">
            Categories
          </h3>
          {openSections.categories ? (
            <ChevronUp className="w-4 h-4 text-surface-400 group-hover:text-[#061842]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-surface-400 group-hover:text-[#061842]" />
          )}
        </button>

        {openSections.categories && (
          <div className="space-y-2 mt-3 animate-fade-in">
            {displayedCategories.map((cat) => {
              const isSelected = filters.category === cat.id;
              return (
                <label
                  key={cat.id}
                  className="flex items-center justify-between cursor-pointer group py-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="plp-category"
                      checked={isSelected}
                      onChange={() =>
                        updateFilters({
                          ...filters,
                          category: isSelected ? undefined : cat.id,
                        })
                      }
                      className="w-3.5 h-3.5 text-[#1668F6] focus:ring-[#1668F6] border-surface-300"
                    />
                    <span
                      className={`text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'text-[#1668F6] font-bold'
                          : 'text-surface-700 group-hover:text-[#1668F6]'
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-surface-400">
                    {cat.count.toLocaleString()}
                  </span>
                </label>
              );
            })}

            <button
              type="button"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-xs font-black text-[#1668F6] pt-1 hover:underline text-left block"
            >
              {showAllCategories ? '- Show Less' : '+ Show More'}
            </button>
          </div>
        )}
      </div>

      {/* ── BRANDS ACCORDION WITH SEARCH-WITHIN-FILTER (Web 2.1a) ── */}
      <div className="py-4 border-b border-surface-100">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => toggleSection('brands')}
            className="flex items-center justify-between flex-1 text-left group"
          >
            <h3 className="text-xs font-black text-[#061842] tracking-wider uppercase">
              Brand
            </h3>
            {openSections.brands ? (
              <ChevronUp className="w-4 h-4 text-surface-400 group-hover:text-[#061842]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-surface-400 group-hover:text-[#061842]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowBrandSearch(!showBrandSearch)}
            className="p-1 rounded-md text-surface-400 hover:text-[#1668F6] ml-2"
            aria-label="Search within brands"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        {openSections.brands && (
          <div className="space-y-2 mt-3 animate-fade-in">
            {showBrandSearch && (
              <div className="relative mb-2">
                <input
                  type="text"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  placeholder="Search brands..."
                  className="w-full h-8 pl-7 pr-2 text-xs font-semibold bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1668F6]"
                />
                <Search className="w-3 h-3 text-surface-400 absolute left-2 top-2.5" />
              </div>
            )}

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
              {filteredBrands.map((b) => {
                const isChecked = (filters.brands || []).includes(b.name);
                return (
                  <label
                    key={b.id}
                    className="flex items-center justify-between cursor-pointer group py-0.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleBrandToggle(b.name)}
                        className="w-3.5 h-3.5 rounded text-[#1668F6] focus:ring-[#1668F6] border-surface-300"
                      />
                      <span
                        className={`text-xs font-semibold transition-colors ${
                          isChecked
                            ? 'text-[#1668F6] font-bold'
                            : 'text-surface-700 group-hover:text-[#1668F6]'
                        }`}
                      >
                        {b.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-surface-400">
                      {b.count.toLocaleString()}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── PRICE RANGE DUAL-SLIDER / BOUNDS ── */}
      <div className="py-4 border-b border-surface-100">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left group"
        >
          <h3 className="text-xs font-black text-[#061842] tracking-wider uppercase">
            Price Range
          </h3>
          {openSections.price ? (
            <ChevronUp className="w-4 h-4 text-surface-400 group-hover:text-[#061842]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-surface-400 group-hover:text-[#061842]" />
          )}
        </button>

        {openSections.price && (
          <div className="mt-3 space-y-3 animate-fade-in">
            {/* Visual dual slider bar */}
            <div className="relative w-full h-1.5 bg-surface-200 rounded-full my-2">
              <div className="absolute top-0 left-0 h-full w-4/5 bg-[#1668F6] rounded-full" />
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-3.5 h-3.5 bg-white border-2 border-[#1668F6] rounded-full shadow-xs cursor-pointer" />
              <div className="absolute top-1/2 -translate-y-1/2 left-4/5 w-3.5 h-3.5 bg-white border-2 border-[#1668F6] rounded-full shadow-xs cursor-pointer" />
            </div>

            <div className="flex items-center justify-between text-xs font-black text-[#061842]">
              <span>₹199</span>
              <span className="text-surface-400 font-normal">to</span>
              <span>₹4,999+</span>
            </div>
          </div>
        )}
      </div>

      {/* ── DISCOUNT % CHIPS ── */}
      <div className="py-4 border-b border-surface-100">
        <button
          type="button"
          onClick={() => toggleSection('discount')}
          className="flex items-center justify-between w-full text-left group"
        >
          <h3 className="text-xs font-black text-[#061842] tracking-wider uppercase">
            Discount
          </h3>
          {openSections.discount ? (
            <ChevronUp className="w-4 h-4 text-surface-400 group-hover:text-[#061842]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-surface-400 group-hover:text-[#061842]" />
          )}
        </button>

        {openSections.discount && (
          <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
            {DISCOUNT_CHIPS.map((chip) => {
              const isActive = filters.discount === chip.value;
              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => handleDiscountToggle(chip.value)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black border transition-all ${
                    isActive
                      ? 'bg-[#1668F6] text-white border-[#1668F6] shadow-xs'
                      : 'bg-surface-50 text-surface-700 border-surface-200 hover:border-surface-300'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── CUSTOMER RATINGS ACCORDION ── */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection('ratings')}
          className="flex items-center justify-between w-full text-left group"
        >
          <h3 className="text-xs font-black text-[#061842] tracking-wider uppercase">
            Customer Ratings
          </h3>
          {openSections.ratings ? (
            <ChevronUp className="w-4 h-4 text-surface-400 group-hover:text-[#061842]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-surface-400 group-hover:text-[#061842]" />
          )}
        </button>

        {openSections.ratings && (
          <div className="space-y-2 mt-3 animate-fade-in">
            {RATING_OPTIONS.map((opt) => {
              const isChecked = filters.rating === opt.value;
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 cursor-pointer group py-0.5"
                >
                  <input
                    type="radio"
                    name="rating-filter"
                    checked={isChecked}
                    onChange={() => handleRatingToggle(opt.value)}
                    className="w-3.5 h-3.5 text-[#1668F6] focus:ring-[#1668F6] border-surface-300"
                  />
                  <div className="flex items-center gap-1 text-xs font-bold text-surface-700 group-hover:text-[#1668F6]">
                    <span>{opt.label}</span>
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
