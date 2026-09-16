import React from 'react';
import { ProductCard } from '@/features/products/components/ProductCard';
import { IProduct } from '@repo/shared-types';

interface CrossSellRailsProps {
  title: string;
  products: IProduct[];
}

export function CrossSellRails({ title, products }: CrossSellRailsProps) {
  if (!products || products.length === 0) return null;
  
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-extrabold text-[#192168]">{title}</h2>
        <button className="text-xs font-bold text-[#1668F6]">View All</button>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {products.map(product => (
          <div key={product._id} className="w-[160px] md:w-[220px] flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
