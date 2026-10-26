'use client';

import React from 'react';
import { useCatalogStore } from '@/stores/catalog.store';
import { LayoutGrid } from 'lucide-react';

export interface BubbleItem {
  id: string;
  name: string;
  imageUrl?: string;
  isMore?: boolean;
}

interface SubcategoryBubbleFilterProps {
  items?: BubbleItem[];
}

const DEFAULT_BUBBLES: BubbleItem[] = [
  { id: 't-shirts', name: 'T-Shirts', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&auto=format&fit=crop&q=80' },
  { id: 'shirts', name: 'Casual Shirts', imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&auto=format&fit=crop&q=80' },
  { id: 'jeans', name: 'Jeans & Denim', imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=150&auto=format&fit=crop&q=80' },
  { id: 'jackets', name: 'Jackets', imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&auto=format&fit=crop&q=80' },
  { id: 'trousers', name: 'Trousers', imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=150&auto=format&fit=crop&q=80' },
  { id: 'ethnic', name: 'Kurta Sets', imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=150&auto=format&fit=crop&q=80' },
  { id: 'footwear', name: 'Sneakers', imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&auto=format&fit=crop&q=80' },
  { id: 'accessories', name: 'Watches', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80' },
];

export function SubcategoryBubbleFilter({ items = DEFAULT_BUBBLES }: SubcategoryBubbleFilterProps) {
  const selectedSubcategory = useCatalogStore((state) => state.selectedSubcategory);
  const setSelectedSubcategory = useCatalogStore((state) => state.setSelectedSubcategory);

  const bubbleList = items.length > 0 ? items : DEFAULT_BUBBLES;

  return (
    <div className="flex items-center overflow-x-auto scrollbar-hide gap-3.5 px-4 py-3 bg-white border-b border-surface-100">
      {/* "All" button */}
      <button
        type="button"
        onClick={() => setSelectedSubcategory(null)}
        className="flex flex-col items-center gap-1.5 shrink-0 group"
      >
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all shadow-2xs ${
            selectedSubcategory === null
              ? 'border-[#1668F6] ring-2 ring-[#1668F6] ring-offset-2 bg-blue-50 text-[#1668F6]'
              : 'border-surface-200 bg-surface-50 text-surface-500 hover:border-surface-300'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
        </div>
        <span
          className={`text-[11px] font-bold text-center transition-colors ${
            selectedSubcategory === null ? 'text-[#1668F6]' : 'text-surface-600'
          }`}
        >
          All
        </span>
      </button>

      {/* Circular Subcategory Icons */}
      {bubbleList.map((item) => {
        const isActive = selectedSubcategory === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedSubcategory(isActive ? null : item.id)}
            className="flex flex-col items-center gap-1.5 shrink-0 group"
          >
            <div
              className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all p-0.5 shadow-2xs ${
                isActive
                  ? 'border-[#1668F6] ring-2 ring-[#1668F6] ring-offset-2'
                  : 'border-surface-200 bg-surface-100 hover:border-surface-300'
              }`}
            >
              <div className="w-full h-full rounded-full overflow-hidden relative">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-200 flex items-center justify-center text-xs font-black text-surface-500">
                    {item.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <span
              className={`text-[11px] font-bold text-center max-w-[68px] truncate transition-colors ${
                isActive ? 'text-[#1668F6]' : 'text-surface-700'
              }`}
            >
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
