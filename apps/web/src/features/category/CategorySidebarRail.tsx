import React from 'react';
import { useCatalogStore } from '@/stores/catalog.store';
import { 
  Flame, Shirt, MonitorSmartphone, Car, Dumbbell, 
  ToyBrick, BookOpen, MoreHorizontal, Footprints, 
  Sparkles, Home, ShoppingBasket, ShoppingBag, Watch 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = [
  { id: 'trending', label: 'Trending Now', icon: Flame, color: 'text-orange-500' },
  { id: 'mens-fashion', label: "Men's Fashion", icon: Shirt, color: 'text-blue-500' },
  { id: 'womens-fashion', label: "Women's Fashion", icon: ShoppingBag, color: 'text-pink-500' },
  { id: 'kids', label: 'Kids Fashion', icon: ToyBrick, color: 'text-yellow-500' },
  { id: 'footwear', label: 'Footwear', icon: Footprints, color: 'text-green-500' },
  { id: 'beauty', label: 'Beauty & Grooming', icon: Sparkles, color: 'text-purple-500' },
  { id: 'home', label: 'Home & Living', icon: Home, color: 'text-teal-500' },
  { id: 'electronics', label: 'Electronics', icon: MonitorSmartphone, color: 'text-indigo-500' },
  { id: 'grocery', label: 'Grocery & Staples', icon: ShoppingBasket, color: 'text-green-600' },
  { id: 'automotive', label: 'Automotive', icon: Car, color: 'text-red-500' },
  { id: 'sports', label: 'Sports & Fitness', icon: Dumbbell, color: 'text-orange-400' },
  { id: 'toys', label: 'Toys, Kids & Baby', icon: ToyBrick, color: 'text-purple-400' },
  { id: 'books', label: 'Books & Stationery', icon: BookOpen, color: 'text-blue-400' },
  { id: 'more', label: 'More Categories', icon: MoreHorizontal, color: 'text-gray-500' },
];

export function CategorySidebarRail() {
  const selectedCategory = useCatalogStore((state) => state.selectedCategory);
  const setSelectedCategory = useCatalogStore((state) => state.setSelectedCategory);

  return (
    <div className="w-24 md:w-36 lg:w-48 flex-shrink-0 bg-white border-r border-gray-100 overflow-y-auto hide-scrollbar pb-24 lg:pb-0 h-[calc(100vh-140px)] md:h-[calc(100vh-160px)]">
      <div className="flex flex-col py-2">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex flex-col items-center justify-center p-3 gap-2 transition-colors relative group",
                isActive ? "bg-blue-50" : "hover:bg-gray-50"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
              )}
              <div className={cn(
                "p-2 rounded-full",
                isActive ? "bg-white shadow-sm" : "bg-gray-50 group-hover:bg-white"
              )}>
                <category.icon 
                  className={cn("w-6 h-6", isActive ? category.color : "text-gray-500")} 
                />
              </div>
              <span className={cn(
                "text-[10px] md:text-xs text-center leading-tight px-1",
                isActive ? "font-semibold text-blue-900" : "font-medium text-gray-500"
              )}>
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
