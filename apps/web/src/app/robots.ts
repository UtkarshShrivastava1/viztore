import { MetadataRoute } from 'next';
import { branding } from '@repo/shared-types';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = branding.domain.startsWith('http')
    ? branding.domain
    : `https://${branding.domain}`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account/',
          '/cart/',
          '/checkout/',
          '/rider/',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

