'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Search, Check, RotateCcw } from 'lucide-react';

export const CATEGORIES_LIST = [
  'Fashion',
  'Mobiles',
  'Electronics',
  'Beauty',
  'Home & Living',
  'Appliances',
  'Toys & Baby',
  'Food & Health',
  'Auto Accessories',
  'Sports',
  'Furniture',
  'Books',
  '2 Wheelers',
];

export const PRICE_RANGES_LIST = [
  { id: 'under-500', label: 'Under ₹500', min: 0, max: 500 },
  { id: '500-1000', label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { id: '1000-2000', label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
  { id: '2000-5000', label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
  { id: 'above-5000', label: 'Above ₹5,000', min: 5000, max: Infinity },
];

export const BRANDS_LIST = [
  'Nike',
  'Adidas',
  'boAt',
  'Sony',
  'Samsung',
  'Apple',
  'Philips',
  'Havells',
  'Prestige',
  'Mamaearth',
  'Butterfly',
  'Puma',
  'Fastrack',
];

export interface DealsFilterSidebarProps {
  selectedCategories?: string[];
  selectedPriceRanges?: string[];
  selectedBrands?: string[];
  onCategoryToggle?: (category: string) => void;
  onPriceRangeToggle?: (rangeId: string) => void;
  onBrandToggle?: (brand: string) => void;
  onClearFilters?: () => void;
}

export function DealsFilterSidebar({
  selectedCategories: propCategories,
  selectedPriceRanges: propPriceRanges,
  selectedBrands: propBrands,
  onCategoryToggle,
  onPriceRangeToggle,
  onBrandToggle,
  onClearFilters,
}: DealsFilterSidebarProps) {
  // Local state fallbacks if not fully controlled
  const [internalCategories, setInternalCategories] = useState<string[]>([]);
  const [internalPriceRanges, setInternalPriceRanges] = useState<string[]>([]);
  const [internalBrands, setInternalBrands] = useState<string[]>([]);

  // Section collapse state
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);

  // Show More / Show Less state
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Brand search
  const [brandSearch, setBrandSearch] = useState('');

  const categories = propCategories ?? internalCategories;
  const priceRanges = propPriceRanges ?? internalPriceRanges;
  const brands = propBrands ?? internalBrands;

  const handleCategoryClick = (cat: string) => {
    if (onCategoryToggle) {
      onCategoryToggle(cat);
    } else {
      setInternalCategories((prev) =>
        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
      );
    }
  };

  const handlePriceClick = (rangeId: string) => {
    if (onPriceRangeToggle) {
      onPriceRangeToggle(rangeId);
    } else {
      setInternalPriceRanges((prev) =>
        prev.includes(rangeId) ? prev.filter((r) => r !== rangeId) : [...prev, rangeId]
      );
    }
  };

  const handleBrandClick = (brand: string) => {
    if (onBrandToggle) {
      onBrandToggle(brand);
    } else {
      setInternalBrands((prev) =>
        prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
      );
    }
  };

  const handleClear = () => {
    setBrandSearch('');
    setShowAllCategories(false);
    setShowAllBrands(false);
    if (onClearFilters) {
      onClearFilters();
    } else {
      setInternalCategories([]);
      setInternalPriceRanges([]);
      setInternalBrands([]);
    }
  };

  // Filter brands based on search
  const filteredBrands = BRANDS_LIST.filter((b) =>
    b.toLowerCase().includes(brandSearch.trim().toLowerCase())
  );

  const displayedCategories = showAllCategories
    ? CATEGORIES_LIST
    : CATEGORIES_LIST.slice(0, 10);

  const displayedBrands = showAllBrands || brandSearch.trim().length > 0
    ? filteredBrands
    : filteredBrands.slice(0, 5);

  return (
    <aside className="w-full select-none">
      <div className="bg-white border border-surface-200/90 rounded-2xl p-5 shadow-sm sticky top-24">
        
        {/* Categories Section */}
        <div>
          <button
            type="button"
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="w-full flex items-center justify-between text-left group py-0.5 focus:outline-none"
            aria-expanded={isCategoriesOpen}
          >
            <span className="text-[14px] font-bold text-[#09153D]">Categories</span>
            {isCategoriesOpen ? (
              <ChevronUp className="w-4 h-4 text-surface-500 group-hover:text-surface-700 transition-colors" />
            ) : (
              <ChevronDown className="w-4 h-4 text-surface-500 group-hover:text-surface-700 transition-colors" />
            )}
          </button>

          {isCategoriesOpen && (
            <div className="mt-3.5 space-y-2.5">
              {displayedCategories.map((category) => {
                const isChecked = categories.includes(category);
                return (
                  <label
                    key={category}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryClick(category)}
                      className="sr-only"
                    />
                    <div
                      className={`w-[17px] h-[17px] rounded-[4px] border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-[#1668F6] border-[#1668F6] text-white shadow-xs'
                          : 'border-surface-300 bg-white group-hover:border-[#1668F6]/60'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-[13px] font-medium leading-tight transition-colors ${
                        isChecked
                          ? 'text-[#09153D] font-semibold'
                          : 'text-surface-600 group-hover:text-[#09153D]'
                      }`}
                    >
                      {category}
                    </span>
                  </label>
                );
              })}

              {CATEGORIES_LIST.length > 10 && (
                <button
                  type="button"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="text-[12px] font-semibold text-[#1668F6] hover:text-blue-700 flex items-center gap-1 pt-1 transition-colors"
                >
                  <span>{showAllCategories ? 'Show Less' : 'Show More'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      showAllCategories ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-surface-100 my-5" />

        {/* Price Range Section */}
        <div>
          <button
            type="button"
            onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
            className="w-full flex items-center justify-between text-left group py-0.5 focus:outline-none"
            aria-expanded={isPriceRangeOpen}
          >
            <span className="text-[14px] font-bold text-[#09153D]">Price Range</span>
            {isPriceRangeOpen ? (
              <ChevronUp className="w-4 h-4 text-surface-500 group-hover:text-surface-700 transition-colors" />
            ) : (
              <ChevronDown className="w-4 h-4 text-surface-500 group-hover:text-surface-700 transition-colors" />
            )}
          </button>

          {isPriceRangeOpen && (
            <div className="mt-3.5 space-y-2.5">
              {PRICE_RANGES_LIST.map((range) => {
                const isChecked = priceRanges.includes(range.id);
                return (
                  <label
                    key={range.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handlePriceClick(range.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-[17px] h-[17px] rounded-[4px] border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-[#1668F6] border-[#1668F6] text-white shadow-xs'
                          : 'border-surface-300 bg-white group-hover:border-[#1668F6]/60'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-[13px] font-medium leading-tight transition-colors ${
                        isChecked
                          ? 'text-[#09153D] font-semibold'
                          : 'text-surface-600 group-hover:text-[#09153D]'
                      }`}
                    >
                      {range.label}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-surface-100 my-5" />

        {/* Brand Section */}
        <div>
          <button
            type="button"
            onClick={() => setIsBrandOpen(!isBrandOpen)}
            className="w-full flex items-center justify-between text-left group py-0.5 focus:outline-none"
            aria-expanded={isBrandOpen}
          >
            <span className="text-[14px] font-bold text-[#09153D]">Brand</span>
            {isBrandOpen ? (
              <ChevronUp className="w-4 h-4 text-surface-500 group-hover:text-surface-700 transition-colors" />
            ) : (
              <ChevronDown className="w-4 h-4 text-surface-500 group-hover:text-surface-700 transition-colors" />
            )}
          </button>

          {isBrandOpen && (
            <div className="mt-3.5">
              {/* Search Brand Input */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-surface-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search brand..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-[12px] bg-white border border-surface-200 rounded-lg placeholder:text-surface-400 text-surface-800 focus:outline-none focus:border-[#1668F6] transition-colors"
                />
              </div>

              {/* Brands Checkbox List */}
              <div className="space-y-2.5">
                {displayedBrands.length > 0 ? (
                  displayedBrands.map((brand) => {
                    const isChecked = brands.includes(brand);
                    return (
                      <label
                        key={brand}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleBrandClick(brand)}
                          className="sr-only"
                        />
                        <div
                          className={`w-[17px] h-[17px] rounded-[4px] border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-[#1668F6] border-[#1668F6] text-white shadow-xs'
                              : 'border-surface-300 bg-white group-hover:border-[#1668F6]/60'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-[13px] font-medium leading-tight transition-colors ${
                            isChecked
                              ? 'text-[#09153D] font-semibold'
                              : 'text-surface-600 group-hover:text-[#09153D]'
                          }`}
                        >
                          {brand}
                        </span>
                      </label>
                    );
                  })
                ) : (
                  <p className="text-[12px] text-surface-400 italic py-1">
                    No brands match &quot;{brandSearch}&quot;
                  </p>
                )}
              </div>

              {!brandSearch && filteredBrands.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllBrands(!showAllBrands)}
                  className="text-[12px] font-semibold text-[#1668F6] hover:text-blue-700 flex items-center gap-1 pt-2.5 transition-colors"
                >
                  <span>{showAllBrands ? 'Show Less' : 'Show More'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      showAllBrands ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        <button
          type="button"
          onClick={handleClear}
          className="w-full mt-6 py-2 px-3 rounded-xl border border-surface-200 hover:border-[#1668F6]/40 text-[#1668F6] hover:bg-[#F0F6FF] text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs group"
        >
          <RotateCcw className="w-3.5 h-3.5 transition-transform group-hover:-rotate-45" />
          <span>Clear Filters</span>
        </button>
      </div>
    </aside>
  );
}

