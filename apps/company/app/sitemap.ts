import { MetadataRoute } from 'next';
import { branding } from '@/config/company';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = branding.siteUrl || `https://${branding.domain}`;
  const now = new Date();

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/for-retailers', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/for-customers', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/platform', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about-us', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/careers', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/grievance-redressal', priority: 0.4, changeFrequency: 'monthly' as const },
    { path: '/refund-policy', priority: 0.4, changeFrequency: 'monthly' as const },
    { path: '/terms-and-conditions', priority: 0.4, changeFrequency: 'monthly' as const },
  ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

