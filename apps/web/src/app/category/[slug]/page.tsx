import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo';
import { branding } from '@repo/shared-types';
import { getCanonicalCategoryBySlug, CANONICAL_CATEGORIES } from '@/features/category';
import { CategoryPageClient } from './CategoryPageClient';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const rawSlug = (params?.slug || '').toLowerCase();
  const canonical = getCanonicalCategoryBySlug(rawSlug);
  const title = canonical?.label || rawSlug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const tagline = canonical?.tagline || `Discover verified local stores and products in ${title} on ${branding.appName}.`;

  return {
    title: `${title} — Shop Online from Local Stores | ${branding.appName}`,
    description: tagline,
    alternates: {
      canonical: `/category/${rawSlug}`,
    },
    openGraph: {
      title: `${title} | ${branding.appName}`,
      description: tagline,
      url: `/category/${rawSlug}`,
      ...(canonical?.heroImage ? { images: [{ url: canonical.heroImage, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${branding.appName}`,
      description: tagline,
    },
  };
}

export default function CategoryDynamicPage({
  params,
}: {
  params: { slug: string };
}) {
  const rawSlug = (params?.slug || '').toLowerCase();
  const canonical = getCanonicalCategoryBySlug(rawSlug) || CANONICAL_CATEGORIES[0];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Categories', item: '/category' },
          { name: canonical.label, item: `/category/${canonical.id}` },
        ]}
      />
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#F8FAFC] p-8 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#1668F6] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <CategoryPageClient category={canonical} slug={rawSlug} />
      </Suspense>
    </>
  );
}
