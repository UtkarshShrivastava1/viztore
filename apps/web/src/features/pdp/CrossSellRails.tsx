'use client';

import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/features/products/components/ProductCard';
import { IProduct } from '@repo/shared-types';
import { ArrowRight } from 'lucide-react';

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

  // If no products available for this rail, return null to prevent stacking duplicate empty banners
  if (uniqueProducts.length === 0) {
    return null;
  }
  
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-extrabold text-[#192168]">{title}</h2>
        <Link href={viewAllHref} className="text-xs font-bold text-[#1668F6] hover:underline flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {uniqueProducts.slice(0, 4).map((p) => (
          <ProductCard key={p._id || (p as any).id} product={p} />
        ))}
      </div>
    </section>
  );
}
