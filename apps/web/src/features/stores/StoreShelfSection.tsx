import React from 'react';
import { IProduct } from '@repo/shared-types';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ChevronRight } from 'lucide-react';

interface StoreShelfSectionProps {
  title: string;
  products: IProduct[];
  badge?: string;
}

export function StoreShelfSection({ title, products, badge }: StoreShelfSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[16px] font-extrabold text-[#192168]">{title}</h3>
        <button className="text-[12px] font-bold text-[#1668F6] flex items-center gap-0.5 hover:underline">
          View All <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      
      {/* Horizontally scrollable list on mobile, grid on desktop */}
      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 snap-x hide-scrollbar">
        {products.map((product) => (
          <div key={product._id} className="w-[160px] sm:w-auto flex-shrink-0 snap-start">
            <ProductCard product={product} badge={badge} />
          </div>
        ))}
      </div>
    </section>
  );
}
