import React from 'react';
import { branding } from '@repo/shared-types';
import { JsonLd } from './JsonLd';

export interface StoreJsonLdProps {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  telephone?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  openingHours?: string[];
}

export function StoreJsonLd({
  id,
  name,
  description,
  imageUrl,
  telephone,
  address,
  geo,
  rating = 4.8,
  reviewCount = 42,
  priceRange = '₹₹',
  openingHours = ['Mo-Su 09:00-22:00'],
}: StoreJsonLdProps) {
  const baseUrl = branding.domain.startsWith('http')
    ? branding.domain
    : `https://${branding.domain}`;

  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/stores/${id}`,
    name,
    description: description || `Shop directly from ${name} with fast local delivery on ${branding.appName}.`,
    image: imageUrl || `${baseUrl}/og-image.jpg`,
    url: `${baseUrl}/stores/${id}`,
    telephone: telephone || branding.contactPhone,
    priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address?.streetAddress || branding.companyAddress,
      addressLocality: address?.addressLocality || 'Durg',
      addressRegion: address?.addressRegion || 'CG',
      postalCode: address?.postalCode || '491001',
      addressCountry: address?.addressCountry || 'IN',
    },
    ...(geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: geo.latitude,
            longitude: geo.longitude,
          },
        }
      : {}),
    openingHoursSpecification: openingHours.map((hours) => {
      const [days, timeRange] = hours.split(' ');
      const [opens, closes] = (timeRange || '09:00-22:00').split('-');
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days === 'Mo-Su'
          ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: opens || '09:00',
        closes: closes || '22:00',
      };
    }),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: Math.max(reviewCount, 1),
    },
  };

  return <JsonLd data={storeSchema} />;
}

