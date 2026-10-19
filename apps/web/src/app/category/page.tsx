import React from 'react';
import { AllCategoriesHero } from '@/features/catalog/AllCategoriesHero';
import { AllCategoriesGrid } from '@/features/catalog/AllCategoriesGrid';
import { CategoryPromoCards } from '@/features/catalog/CategoryPromoCards';
import { TrendingDeals } from '@/features/catalog/TrendingDeals';
import { MobileCategoryExplorer } from '@/features/category/MobileCategoryExplorer';

export default function AllCategoriesPage() {
  return (
    <div className="min-h-screen bg-white md:bg-transparent pb-16 lg:pb-0">
      {/* Mobile View: High-fidelity Split Category Explorer */}
      <div className="md:hidden">
        <MobileCategoryExplorer />
      </div>

      {/* Desktop View: Full Catalog Experience */}
      <main className="hidden md:block max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-6 lg:py-8 space-y-8">
        <AllCategoriesHero />
        
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#061842]">Shop by Category</h2>
          <AllCategoriesGrid />
        </section>

        <CategoryPromoCards />

        <TrendingDeals />
      </main>
    </div>
  );
}
