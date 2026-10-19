import React from 'react';
import { useCatalogStore } from '@/stores/catalog.store';
import {
  Flame,
  Shirt,
  Smartphone,
  Car,
  Dumbbell,
  BookOpen,
  MoreHorizontal,
  ShoppingBasket,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom inline SVG icons for categories that require exact mockup fidelity
function WomenFashionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
      <path d="M9 13l3 3 3-3" />
    </svg>
  );
}

function KidsFashionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="5" r="3" />
      <path d="M8 11h8" />
      <path d="M9 11v5a3 3 0 0 0 6 0v-5" />
      <path d="M9 19v3" />
      <path d="M15 19v3" />
      <path d="M6 13l2-2" />
      <path d="M18 13l-2-2" />
    </svg>
  );
}

function FootwearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3.5 17.5h17a1 1 0 0 0 1-1v-2a3 3 0 0 0-2.5-2.96L14 10.5l-3-2.5-3 1.5L5 13H3.5a1.5 1.5 0 0 0-1.5 1.5v1.5a1.5 1.5 0 0 0 1.5 1.5z" />
      <path d="M10 11l-2 3" />
      <path d="M12.5 12l-1.5 2.5" />
    </svg>
  );
}

function BeautyGroomingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="7" y="9" width="10" height="12" rx="2" />
      <path d="M10 9V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4" />
      <line x1="8" y1="2" x2="16" y2="2" />
      <circle cx="12" cy="15" r="1.5" />
    </svg>
  );
}

function HomeLivingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 11v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
      <path d="M4 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z" />
      <path d="M7 9V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
    </svg>
  );
}

function TeddyBearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="13" r="6" />
      <circle cx="9.5" cy="11.5" r="0.75" fill="currentColor" />
      <circle cx="14.5" cy="11.5" r="0.75" fill="currentColor" />
      <ellipse cx="12" cy="14" rx="1.5" ry="1" />
      <circle cx="6.5" cy="7.5" r="2.5" />
      <circle cx="17.5" cy="7.5" r="2.5" />
      <path d="M7 17.5l-2 2" />
      <path d="M17 17.5l2 2" />
    </svg>
  );
}

export const CATEGORIES = [
  { id: 'trending', label: 'Trending Now', icon: Flame, color: 'text-orange-500' },
  { id: 'mens-fashion', label: "Men's Fashion", icon: Shirt, color: 'text-blue-500' },
  { id: 'womens-fashion', label: "Women's Fashion", icon: WomenFashionIcon, color: 'text-pink-500' },
  { id: 'kids', label: 'Kids Fashion', icon: KidsFashionIcon, color: 'text-amber-500' },
  { id: 'footwear', label: 'Footwear', icon: FootwearIcon, color: 'text-emerald-500' },
  { id: 'beauty', label: 'Beauty & Grooming', icon: BeautyGroomingIcon, color: 'text-purple-500' },
  { id: 'home', label: 'Home & Living', icon: HomeLivingIcon, color: 'text-teal-500' },
  { id: 'electronics', label: 'Electronics', icon: Smartphone, color: 'text-blue-600' },
  { id: 'grocery', label: 'Grocery & Staples', icon: ShoppingBasket, color: 'text-green-600' },
  { id: 'automotive', label: 'Automotive', icon: Car, color: 'text-rose-500' },
  { id: 'sports', label: 'Sports & Fitness', icon: Dumbbell, color: 'text-amber-500' },
  { id: 'toys', label: 'Toys, Kids & Baby', icon: TeddyBearIcon, color: 'text-purple-400' },
  { id: 'books', label: 'Books & Stationery', icon: BookOpen, color: 'text-sky-500' },
  { id: 'more', label: 'More Categories', icon: MoreHorizontal, color: 'text-slate-500' },
];

export function CategorySidebarRail() {
  const selectedCategory = useCatalogStore((state) => state.selectedCategory);
  const setSelectedCategory = useCatalogStore((state) => state.setSelectedCategory);

  return (
    <div className="sticky top-0 self-start w-[84px] xs:w-[92px] sm:w-[98px] flex-shrink-0 bg-white border-r border-slate-100 overflow-y-auto scrollbar-none h-[calc(100dvh-68px)] pb-16">
      <div className="flex flex-col py-1">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.id;
          const Icon = category.icon;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'flex flex-col items-center justify-center py-2.5 px-1.5 transition-all relative group cursor-pointer text-center select-none',
                isActive ? 'bg-[#EDF4FF]' : 'hover:bg-slate-50/80 active:bg-slate-100'
              )}
            >
              {/* Left active vertical indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-[#1668F6] rounded-r-full" />
              )}

              {/* Icon */}
              <div className="mb-1 flex items-center justify-center">
                <Icon
                  className={cn(
                    'w-5 h-5 sm:w-6 sm:h-6 transition-colors',
                    isActive ? 'text-[#1668F6]' : category.color
                  )}
                />
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-[10px] leading-tight text-center px-0.5 line-clamp-2 max-w-[80px]',
                  isActive
                    ? 'font-bold text-[#1668F6]'
                    : 'font-medium text-slate-700 group-hover:text-slate-900'
                )}
              >
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategorySidebarRail;
