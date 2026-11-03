import React from 'react';
import type { Metadata } from 'next';
import { branding } from '@repo/shared-types';
import { StoreStorefrontClient } from './StoreStorefrontClient';
import { StoreJsonLd, BreadcrumbJsonLd } from '@/components/seo';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const formattedSlug = params.slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  let storeTitle = `${formattedSlug} — Shop Local Storefront | ${branding.appName}`;
  let storeDescription = `Browse authentic catalog items, seasonal discounts, and instant hyperlocal delivery from ${formattedSlug} on ${branding.appName}.`;
  let storeImage: string | undefined;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${apiUrl}/stores/${params.slug}`, {
      signal: controller.signal,
      next: { revalidate: 600 },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      const store = json.data;
      if (store?.name) {
        const locality = store.location?.address?.locality || store.location?.address?.city || '';
        storeTitle = `${store.name}${locality ? ` (${locality})` : ''} | ${branding.appName}`;
        storeDescription = store.description
          ? `${store.description.slice(0, 150)}... Order for fast delivery on ${branding.appName}.`
          : `Shop from ${store.name}. Verified local retailer with same-day delivery on ${branding.appName}.`;
        if (store.logo || store.banner) {
          storeImage = store.logo || store.banner;
        }
      }
    }
  } catch (_e) {
    // Fall back to slug-derived metadata
  }

  return {
    title: storeTitle,
    description: storeDescription,
    alternates: {
      canonical: `/stores/${params.slug}`,
    },
    openGraph: {
      title: storeTitle,
      description: storeDescription,
      url: `/stores/${params.slug}`,
      ...(storeImage ? { images: [{ url: storeImage, alt: formattedSlug }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: storeTitle,
      description: storeDescription,
      ...(storeImage ? { images: [storeImage] } : {}),
    },
  };
}

export default function StoreStorefrontPage({ params }: { params: { slug: string } }) {
  const formattedSlug = params.slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Stores', item: '/stores' },
          { name: formattedSlug, item: `/stores/${params.slug}` },
        ]}
      />
      <StoreJsonLd
        id={params.slug}
        name={formattedSlug}
      />
      <StoreStorefrontClient slug={params.slug} />
    </>
  );
}
