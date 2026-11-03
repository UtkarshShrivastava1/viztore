import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { branding } from '@repo/shared-types';
import { ProductsClient } from './ProductsClient';
import { BreadcrumbJsonLd } from '@/components/seo';

export const metadata: Metadata = {
  title: `Browse Products — Authentic Goods from Local Retailers | ${branding.appName}`,
  description: `Search and filter thousands of products from verified local stores on ${branding.appName}. Same-day hyperlocal delivery within 3–4 km.`,
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: `Browse Products | ${branding.appName}`,
    description: `Search and filter products from verified local stores with rapid neighbourhood delivery.`,
    url: '/products',
  },
};

export default function ProductsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Products', item: '/products' },
        ]}
      />
      <Suspense fallback={<div className="min-h-screen bg-transparent animate-pulse" />}>
        <ProductsClient />
      </Suspense>
    </>
  );
}
