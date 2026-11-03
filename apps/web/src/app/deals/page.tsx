import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { branding } from '@repo/shared-types';
import { DealsClient } from './DealsClient';
import { BreadcrumbJsonLd } from '@/components/seo';

export const metadata: Metadata = {
  title: `Best Deals & Offers — Exclusive Discounts from Local Retailers | ${branding.appName}`,
  description: `Save big with trending discounts and exclusive deals from verified neighbourhood stores on ${branding.appName}. Same-day delivery on fashion, electronics, groceries, and more.`,
  alternates: {
    canonical: '/deals',
  },
  openGraph: {
    title: `Best Deals & Offers | ${branding.appName}`,
    description: `Save big with trending discounts and exclusive deals from verified neighbourhood stores.`,
    url: '/deals',
  },
};

export default function DealsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Best Deals', item: '/deals' },
        ]}
      />
      <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] animate-pulse" />}>
        <DealsClient />
      </Suspense>
    </>
  );
}
