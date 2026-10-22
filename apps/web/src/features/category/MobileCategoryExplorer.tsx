'use client';

import React from 'react';
import { useCatalogStore } from '@/stores/catalog.store';
import { CategorySidebarRail } from './CategorySidebarRail';
import { CategoryPromoBanner } from './CategoryPromoBanner';
import { SubcategoryGrid } from './SubcategoryGrid';
import { CATEGORY_DATA_MAP } from './categoryData';

export function MobileCategoryExplorer() {
  const selectedCategory = useCatalogStore((state) => state.selectedCategory);
  const currentCategoryData =
    CATEGORY_DATA_MAP[selectedCategory] || CATEGORY_DATA_MAP['mens-fashion'];

  return (
    <div className="flex w-full bg-white min-h-[calc(100dvh-68px)]">
      {/* Left Vertical Category Navigation Rail */}
      <CategorySidebarRail />

      {/* Right Category Details Content */}
      <div className="flex-1 px-3 py-3 sm:px-4 sm:py-4 pb-24 bg-white min-w-0">
        {/* Category Hero Promo Banner */}
        <CategoryPromoBanner
          title={currentCategoryData.banner.title}
          storeName={currentCategoryData.banner.storeName}
          imageUrl={currentCategoryData.banner.imageUrl}
          href={currentCategoryData.banner.href}
          bgColor={currentCategoryData.banner.bgColor}
        />

        {/* Subcategory Sections */}
        {currentCategoryData.sections.map((section) => (
          <SubcategoryGrid
            key={section.title}
            title={section.title}
            subcategories={section.subcategories}
            viewAllHref={section.viewAllHref}
          />
        ))}
      </div>
    </div>
  );
}

export default MobileCategoryExplorer;
