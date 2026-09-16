import React from 'react';
import Image from 'next/image';
import { useCatalogStore } from '@/stores/catalog.store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BubbleItem {
  id: string;
  name: string;
  imageUrl?: string;
  isMore?: boolean;
}

interface SubcategoryBubbleFilterProps {
  items: BubbleItem[];
}

export function SubcategoryBubbleFilter({ items }: SubcategoryBubbleFilterProps) {
  const selectedSubcategory = useCatalogStore((state) => state.selectedSubcategory);
  const setSelectedSubcategory = useCatalogStore((state) => state.setSelectedSubcategory);

  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-4 px-4 py-3">
      {/* "All" button */}
      <button
        onClick={() => setSelectedSubcategory(null)}
        className="flex flex-col items-center gap-2 flex-shrink-0"
      >
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center border-2 transition-colors",
          selectedSubcategory === null 
            ? "border-blue-600 bg-blue-50 text-blue-600" 
            : "border-gray-200 bg-white text-gray-400 hover:border-blue-300"
        )}>
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-2 h-2 bg-current rounded-[2px]" />
            <div className="w-2 h-2 bg-current rounded-[2px]" />
            <div className="w-2 h-2 bg-current rounded-[2px]" />
            <div className="w-2 h-2 bg-current rounded-[2px]" />
          </div>
        </div>
        <span className={cn(
          "text-[11px] font-bold text-center",
          selectedSubcategory === null ? "text-blue-600" : "text-gray-600"
        )}>
          All
        </span>
      </button>

      {/* Bubble items */}
      {items.map((item) => {
        const isActive = selectedSubcategory === item.id;
        
        if (item.isMore) {
          return (
            <button
              key={item.id}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300">
                <span className="text-xl tracking-widest leading-none mt-[-8px]">...</span>
              </div>
              <span className="text-[11px] font-bold text-center text-gray-600">
                More
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setSelectedSubcategory(item.id)}
            className="flex flex-col items-center gap-2 flex-shrink-0"
          >
            <div className={cn(
              "relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all p-1",
              isActive ? "border-blue-600 ring-2 ring-blue-100" : "border-transparent bg-gray-100 hover:bg-gray-200"
            )}>
              <div className="w-full h-full rounded-full overflow-hidden">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover object-top mix-blend-multiply"
                  />
                )}
              </div>
            </div>
            <span className={cn(
              "text-[11px] font-bold text-center",
              isActive ? "text-gray-900" : "text-gray-600"
            )}>
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
