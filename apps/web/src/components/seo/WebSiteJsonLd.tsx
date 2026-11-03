import React from 'react';
import { branding } from '@repo/shared-types';
import { JsonLd } from './JsonLd';

export function WebSiteJsonLd() {
  const baseUrl = branding.domain.startsWith('http')
    ? branding.domain
    : `https://${branding.domain}`;

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: branding.appName,
    alternateName: branding.tagline,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: branding.appName,
    url: baseUrl,
    logo: `${baseUrl}${branding.logoUrl}`,
    description: branding.tagline,
    email: branding.supportEmail,
    telephone: branding.contactPhone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: branding.companyAddress,
      addressCountry: 'IN',
    },
    sameAs: [
      branding.playStoreUrl !== '#' ? branding.playStoreUrl : undefined,
      branding.appStoreUrl !== '#' ? branding.appStoreUrl : undefined,
    ].filter(Boolean),
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
    </>
  );
}

