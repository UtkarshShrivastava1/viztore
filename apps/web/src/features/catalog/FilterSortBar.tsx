import React from 'react';
import { ChevronDown, Filter, ArrowDownUp } from 'lucide-react';
import { useCatalogStore } from '@/stores/catalog.store';

interface FilterSortBarProps {
  totalProducts: number;
}

export function FilterSortBar({ totalProducts }: FilterSortBarProps) {
  const activeFilters = useCatalogStore((state) => state.activeFilters);
  const setSort = useCatalogStore((state) => state.setSort);

  return (
    <div className="flex flex-col gap-4 px-4 py-2">
      {/* Primary Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 whitespace-nowrap hover:bg-gray-50 flex-shrink-0">
          <ArrowDownUp className="w-4 h-4 text-gray-500" /> Sort <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 whitespace-nowrap hover:bg-gray-50 flex-shrink-0">
          Size <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 whitespace-nowrap hover:bg-gray-50 flex-shrink-0">
          Color <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 whitespace-nowrap hover:bg-gray-50 flex-shrink-0">
          Brand <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        <div className="flex-1 min-w-[16px]"></div>
        <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-900 bg-white whitespace-nowrap hover:bg-gray-50 flex-shrink-0 ml-auto sticky right-0 shadow-[-8px_0_12px_-4px_rgba(255,255,255,1)]">
          Filter <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Counter & Secondary Sort */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm font-bold text-gray-900">
          {totalProducts.toLocaleString()} <span className="text-gray-500 font-medium">Products</span>
        </span>
        <div className="relative group">
          <button className="flex items-center gap-1 text-sm font-bold text-gray-700">
            {activeFilters.sort === 'popularity' ? 'Popularity' : 'Sort By'} 
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {/* Mock dropdown, would use a proper Radix Select in real implementation */}
          <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 hidden group-hover:block z-20">
             <button onClick={() => setSort('popularity')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Popularity</button>
             <button onClick={() => setSort('nearest')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Nearest First</button>
             <button onClick={() => setSort('price_asc')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Price: Low to High</button>
             <button onClick={() => setSort('price_desc')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Price: High to Low</button>
          </div>
        </div>
      </div>
    </div>
  );
}
