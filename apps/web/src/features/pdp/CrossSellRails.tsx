import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/features/products/components/ProductCard';
import { IProduct } from '@repo/shared-types';
import { ArrowRight, Store } from 'lucide-react';

interface CrossSellRailsProps {
  title: string;
  products: IProduct[];
  viewAllHref?: string;
}

export function CrossSellRails({ title, products, viewAllHref = '/products' }: CrossSellRailsProps) {
  // Strict de-duplication by ID
  const uniqueProducts = Array.from(
    new Map(
      (products || [])
        .filter(Boolean)
        .map((p) => [p._id || (p as any).id, p])
    ).values()
  );

  if (uniqueProducts.length === 0) {
    return (
      <section className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 p-5 rounded-2xl border border-blue-100/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-[#1668F6] shadow-2xs flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#061842]">Looking for more options?</h3>
            <p className="text-xs text-gray-500 mt-0.5">Explore more products and top-rated neighborhood stores nearby.</p>
          </div>
        </div>
        <Link 
          href="/stores" 
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1668F6] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs shrink-0"
        >
          Explore Stores <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    );
  }
  
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-extrabold text-[#192168]">{title}</h2>
        <Link href={viewAllHref} className="text-xs font-bold text-[#1668F6] hover:underline flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
        {uniqueProducts.map((product) => (
          <div key={product._id || (product as any).id} className="w-[170px] sm:w-[210px] md:w-[230px] flex-shrink-0 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
