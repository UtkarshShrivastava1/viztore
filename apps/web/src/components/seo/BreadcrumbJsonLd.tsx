import React from 'react';
import { branding } from '@repo/shared-types';
import { JsonLd } from './JsonLd';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const baseUrl = branding.domain.startsWith('http')
    ? branding.domain
    : `https://${branding.domain}`;

  const breadcrumbListSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => {
      const fullUrl = crumb.item.startsWith('http')
        ? crumb.item
        : `${baseUrl}${crumb.item.startsWith('/') ? crumb.item : `/${crumb.item}`}`;

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: fullUrl,
      };
    }),
  };

  return <JsonLd data={breadcrumbListSchema} />;
}

