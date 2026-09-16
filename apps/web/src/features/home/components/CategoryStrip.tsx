'use client';

import React from 'react';
import { ProductCategory } from '@repo/shared-types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const categories = [
  { label: 'Top Offers', value: 'offers', imageUrl: 'https://picsum.photos/seed/offers/120/120' },
  { label: 'Mobiles & Tablets', value: 'mobiles', imageUrl: 'https://picsum.photos/seed/mobiles/120/120' },
  { label: 'Electronics', value: ProductCategory.ELECTRONICS, imageUrl: 'https://picsum.photos/seed/electronics/120/120' },
  { label: 'TVs & Appliances', value: 'appliances', imageUrl: 'https://picsum.photos/seed/appliances/120/120' },
  { label: 'Fashion', value: ProductCategory.FASHION, imageUrl: 'https://picsum.photos/seed/fashion/120/120' },
  { label: 'Beauty', value: ProductCategory.BEAUTY, imageUrl: 'https://picsum.photos/seed/beauty/120/120' },
  { label: 'Home & Kitchen', value: ProductCategory.HOME_LIVING, imageUrl: 'https://picsum.photos/seed/home/120/120' },
  { label: 'Furniture', value: 'furniture', imageUrl: 'https://picsum.photos/seed/furniture/120/120' },
  { label: 'Travel', value: 'travel', imageUrl: 'https://picsum.photos/seed/travel/120/120' },
  { label: 'Grocery', value: ProductCategory.GROCERY_STAPLES, imageUrl: 'https://picsum.photos/seed/grocery/120/120' },
];

interface CategoryStripProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function CategoryStrip({ activeCategory = 'all', onCategoryChange }: CategoryStripProps) {
  const router = useRouter();

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-3 bg-white shadow-sm border-b border-surface-100">
      <div className="flex items-center justify-between gap-4 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 2xl:px-32 min-w-max max-w-[1920px] mx-auto">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => {
                if (cat.value === ProductCategory.FASHION || cat.value === 'fashion') {
                  router.push('/category/fashion');
                } else {
                  onCategoryChange?.(cat.value);
                }
              }}
              className="flex flex-col items-center gap-2 group transition-all"
            >
              <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden transition-transform group-hover:scale-105 ${isActive ? 'ring-2 ring-brand-500 scale-105' : ''}`}>
                <img
                  src={cat.imageUrl}
                  alt={cat.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`text-[12px] sm:text-sm font-semibold whitespace-nowrap ${isActive ? 'text-[#1668F6]' : 'text-surface-800 group-hover:text-[#1668F6]'}`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
