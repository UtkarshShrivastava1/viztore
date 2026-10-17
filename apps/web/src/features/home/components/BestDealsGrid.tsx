'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { HorizontalDealCard } from './HorizontalDealCard';
import { MobileDealCard } from './MobileDealCard';
import { useFeaturedProducts } from '@/hooks/useFeaturedProducts';
import type { IProduct, IProductVariant } from '@repo/shared-types';

const makeVariant = (sku: string, price: number, mrp: number, image: string): IProductVariant[] => [
  {
    sku,
    price,
    mrp,
    stock: 50,
    images: [image],
    isActive: true,
  },
];

const defaultDeals: Partial<IProduct>[] = [
  {
    _id: 'deal-1',
    name: 'Men Solid Cotton Shirt',
    slug: 'men-solid-cotton-shirt',
    basePrice: 899,
    baseMrp: 999,
    storeName: 'Fashion Hub',
    storeId: 'store-1',
    variants: makeVariant('SHIRT-01', 899, 999, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400'),
  },
  {
    _id: 'deal-2',
    name: 'boAt Airdopes 141 TWS Earbuds',
    slug: 'boat-airdopes-141',
    basePrice: 999,
    baseMrp: 1499,
    storeName: 'Sharma Electronics',
    storeId: 'store-2',
    variants: makeVariant('BOAT-01', 999, 1499, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400'),
  },
  {
    _id: 'deal-3',
    name: 'Mamaearth Vitamin C Face Wash (100ml)',
    slug: 'mamaearth-vitamin-c-face-wash',
    basePrice: 339,
    baseMrp: 399,
    storeName: 'Beauty Corner',
    storeId: 'store-3',
    variants: makeVariant('FACEWASH-01', 339, 399, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400'),
  },
  {
    _id: 'deal-4',
    name: 'Prestige Non-stick Cookware Set',
    slug: 'prestige-non-stick-cookware',
    basePrice: 1999,
    baseMrp: 2499,
    storeName: 'Home Needs',
    storeId: 'store-4',
    variants: makeVariant('COOKWARE-01', 1999, 2499, 'https://images.unsplash.com/photo-1584990347449-3974d6c7e2b1?auto=format&fit=crop&q=80&w=400'),
  },
  {
    _id: 'deal-5',
    name: 'Nike Revolution 7 Running Shoes',
    slug: 'nike-revolution-7-running-shoes',
    basePrice: 2799,
    baseMrp: 3999,
    storeName: 'Fashion Hub',
    storeId: 'store-1',
    variants: makeVariant('NIKE-01', 2799, 3999, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'),
  },
  {
    _id: 'deal-6',
    name: 'Skybags Pixel 32L Laptop Backpack',
    slug: 'skybags-pixel-32l-laptop-backpack',
    basePrice: 1699,
    baseMrp: 1999,
    storeName: 'Gadget Store',
    storeId: 'store-5',
    variants: makeVariant('BAG-01', 1699, 1999, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400'),
  },
  {
    _id: 'deal-7',
    name: 'Philips LED Table Lamp',
    slug: 'philips-led-table-lamp',
    basePrice: 799,
    baseMrp: 999,
    storeName: 'Home Needs',
    storeId: 'store-4',
    variants: makeVariant('LAMP-01', 799, 999, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400'),
  },
  {
    _id: 'deal-8',
    name: 'Havells Prolife 4L Air Fryer',
    slug: 'havells-prolife-4l-air-fryer',
    basePrice: 3999,
    baseMrp: 4499,
    storeName: 'Sharma Electronics',
    storeId: 'store-2',
    variants: makeVariant('FRYER-01', 3999, 4499, 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&q=80&w=400'),
  },
];

export function BestDealsGrid() {
  const { data: featuredProducts, isLoading: productsLoading } = useFeaturedProducts(8);

  const liveProducts = featuredProducts && featuredProducts.length > 0 ? featuredProducts : [];

  // Combine live products with sample deals to ensure a full 8-card grid
  const displayProducts: IProduct[] = [...liveProducts];
  if (displayProducts.length < 8) {
    for (const def of defaultDeals) {
      if (displayProducts.length >= 8) break;
      if (!displayProducts.some((p) => p.name.toLowerCase() === def.name?.toLowerCase())) {
        displayProducts.push(def as IProduct);
      }
    }
  }

  return (
    <section className="space-y-3.5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0B1538]">
          Best Deals for You
        </h2>
        <Link
          href="/deals"
          className="flex items-center gap-1 text-sm font-semibold text-[#1668F6] hover:text-[#0f4bba] transition-colors"
        >
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Mobile Viewport: Horizontal Scroll Rail (Matching Mob 1.0.png) */}
      <div className="flex md:hidden gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
        {productsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[155px] h-52 rounded-2xl bg-surface-100 animate-pulse shrink-0 snap-start" />
          ))
        ) : (
          displayProducts.slice(0, 8).map((product, i) => (
            <MobileDealCard key={product._id || i} product={product} index={i} />
          ))
        )}
      </div>

      {/* Desktop Viewport: 4-Column Grid of Horizontal Split Cards (Matching Web 1.0.png) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {productsLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-surface-100 animate-pulse" />
          ))
        ) : (
          displayProducts.slice(0, 8).map((product, i) => (
            <HorizontalDealCard key={product._id || i} product={product} index={i} />
          ))
        )}
      </div>
    </section>
  );
}
