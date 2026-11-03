import React from 'react';
import type { Metadata } from 'next';
import { branding } from '@repo/shared-types';
import { ProductDetailClient } from './ProductDetailClient';
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const formattedSlug = params.slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  let productTitle = `${formattedSlug} — Buy Online from Local Stores | ${branding.appName}`;
  let productDescription = `Order authentic ${formattedSlug} from trusted neighbourhood retailers. Enjoy instant hyperlocal delivery within 3–4 km on ${branding.appName}.`;
  let productImage: string | undefined;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${apiUrl}/catalog/products/${params.slug}`, {
      signal: controller.signal,
      next: { revalidate: 600 },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      const product = json.data;
      if (product?.name) {
        productTitle = `${product.name} | ${branding.appName}`;
        productDescription = product.description
          ? `${product.description.slice(0, 150)}... Buy with fast delivery on ${branding.appName}.`
          : `Order ${product.name} online. Price: ₹${product.basePrice}. Fast local delivery on ${branding.appName}.`;
        if (product.images?.[0]) {
          productImage = product.images[0];
        }
      }
    }
  } catch (_e) {
    // Fall back to slug-derived metadata
  }

  return {
    title: productTitle,
    description: productDescription,
    alternates: {
      canonical: `/products/${params.slug}`,
    },
    openGraph: {
      title: productTitle,
      description: productDescription,
      url: `/products/${params.slug}`,
      ...(productImage ? { images: [{ url: productImage, alt: formattedSlug }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: productTitle,
      description: productDescription,
      ...(productImage ? { images: [productImage] } : {}),
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const formattedSlug = params.slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Products', item: '/products' },
          { name: formattedSlug, item: `/products/${params.slug}` },
        ]}
      />
      <ProductJsonLd
        id={params.slug}
        name={formattedSlug}
        price={499}
      />
      <ProductDetailClient slug={params.slug} />
    </>
  );
}
