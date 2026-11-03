import React from 'react';
import { branding } from '@repo/shared-types';
import { JsonLd } from './JsonLd';

export interface ProductJsonLdProps {
  id: string;
  name: string;
  description?: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  currency?: string;
  inStock?: boolean;
  brand?: string;
  sku?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  storeName?: string;
}

export function ProductJsonLd({
  id,
  name,
  description,
  images = [],
  price,
  originalPrice,
  currency = 'INR',
  inStock = true,
  brand,
  sku,
  category,
  rating = 4.5,
  reviewCount = 12,
  storeName,
}: ProductJsonLdProps) {
  const baseUrl = branding.domain.startsWith('http')
    ? branding.domain
    : `https://${branding.domain}`;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description || `${name} available for fast local delivery on ${branding.appName}.`,
    image: images.length > 0 ? images : [`${baseUrl}/og-image.jpg`],
    sku: sku || id,
    category,
    brand: {
      '@type': 'Brand',
      name: brand || storeName || branding.appName,
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${id}`,
      priceCurrency: currency,
      price: price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: storeName || branding.appName,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: Math.max(reviewCount, 1),
      bestRating: 5,
      worstRating: 1,
    },
  };

  return <JsonLd data={productSchema} />;
}

