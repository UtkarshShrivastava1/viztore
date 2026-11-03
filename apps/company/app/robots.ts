import { MetadataRoute } from 'next';
import { branding } from '@/config/company';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = branding.siteUrl || `https://${branding.domain}`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

