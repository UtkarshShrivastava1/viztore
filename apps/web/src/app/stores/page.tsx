import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { branding } from '@repo/shared-types';
import { StoresClient } from './StoresClient';
import { BreadcrumbJsonLd } from '@/components/seo';

export const metadata: Metadata = {
  title: `Local Stores Near You — Fast Hyperlocal Delivery | ${branding.appName}`,
  description: `Discover verified neighbourhood grocery, fashion, electronics, and lifestyle stores within 3–4 km. Order direct and support local businesses with ${branding.appName}.`,
  alternates: {
    canonical: '/stores',
  },
  openGraph: {
    title: `Local Stores Near You | ${branding.appName}`,
    description: `Discover verified neighbourhood grocery, fashion, electronics, and lifestyle stores within 3–4 km.`,
    url: '/stores',
  },
};

export default function StoresPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Stores Near You', item: '/stores' },
        ]}
      />
      <Suspense fallback={<div className="min-h-screen bg-[#FAFCFF] animate-pulse" />}>
        <StoresClient searchParams={searchParams} />
      </Suspense>
    </>
  );
}
