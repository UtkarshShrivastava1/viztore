'use client';

import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, Check } from 'lucide-react';

const CATEGORIES = ['All Deals', 'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Groceries'];
const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-500', label: 'Under ₹500' },
  { id: '500-1000', label: '₹500 - ₹1,000' },
  { id: '1000-5000', label: '₹1,000 - ₹5,000' },
  { id: 'over-5000', label: 'Over ₹5,000' },
];

export function DealsFilterSidebar() {
  const [activeCategory, setActiveCategory] = useState('All Deals');
  const [activePrice, setActivePrice] = useState('all');

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white border border-surface-200 rounded-2xl p-5 sticky top-24">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-100">
          <SlidersHorizontal className="w-5 h-5 text-[#192168]" />
          <h2 className="text-lg font-bold text-[#192168]">Filters</h2>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#192168] mb-3">Categories</h3>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-left text-sm font-medium py-1.5 transition-colors ${
                  activeCategory === category
                    ? 'text-[#1668F6] font-semibold'
                    : 'text-surface-600 hover:text-[#192168]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-surface-100 mb-6" />

        {/* Price */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#192168] mb-3">Price</h3>
          <div className="flex flex-col gap-2.5">
            {PRICE_RANGES.map((range) => (
              <label
                key={range.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    activePrice === range.id
                      ? 'border-[#1668F6] bg-[#1668F6]'
                      : 'border-surface-300 group-hover:border-[#1668F6]'
                  }`}
                >
                  {activePrice === range.id && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>
                <input
                  type="radio"
                  name="price"
                  value={range.id}
                  checked={activePrice === range.id}
                  onChange={() => setActivePrice(range.id)}
                  className="hidden"
                />
                <span className={`text-sm font-medium ${
                  activePrice === range.id ? 'text-[#192168]' : 'text-surface-600 group-hover:text-[#192168]'
                }`}>
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
