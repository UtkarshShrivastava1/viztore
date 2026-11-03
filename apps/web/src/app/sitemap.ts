import { MetadataRoute } from 'next';
import { branding } from '@repo/shared-types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = branding.domain.startsWith('http')
    ? branding.domain
    : `https://${branding.domain}`;

  const now = new Date();

  // 1. Static Core Application Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/stores`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/category`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Information & Legal Policies
    {
      url: `${baseUrl}/account/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/account/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/account/support`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // 2. High-Intent Category Verticals
  const categorySlugs = [
    'fashion',
    'grocery-staples',
    'electronics-mobiles',
    'beauty-care',
    'home-living',
    'footwear-bags',
    'jewellery-watches',
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Dynamic Products & Stores from Backend API (with graceful fallback)
  const dynamicRoutes: MetadataRoute.Sitemap = [];
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const [storesRes, productsRes] = await Promise.allSettled([
      fetch(`${apiUrl}/stores?limit=50`, {
        signal: controller.signal,
        next: { revalidate: 3600 },
      }),
      fetch(`${apiUrl}/catalog/products?limit=100`, {
        signal: controller.signal,
        next: { revalidate: 3600 },
      }),
    ]);

    clearTimeout(timeoutId);

    if (storesRes.status === 'fulfilled' && storesRes.value.ok) {
      const storesJson = await storesRes.value.json();
      const storesList = storesJson.data?.stores || storesJson.data || [];
      if (Array.isArray(storesList)) {
        for (const store of storesList) {
          const storeSlug = store.slug || store._id;
          if (storeSlug) {
            dynamicRoutes.push({
              url: `${baseUrl}/stores/${storeSlug}`,
              lastModified: store.updatedAt ? new Date(store.updatedAt) : now,
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          }
        }
      }
    }

    if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
      const productsJson = await productsRes.value.json();
      const productsList = productsJson.data?.products || productsJson.data || [];
      if (Array.isArray(productsList)) {
        for (const product of productsList) {
          const productSlug = product.slug || product._id;
          if (productSlug) {
            dynamicRoutes.push({
              url: `${baseUrl}/products/${productSlug}`,
              lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          }
        }
      }
    }
  } catch (_err) {
    // Graceful fallback to static and category routes when backend is unavailable during build
  }

  return [...staticRoutes, ...categoryRoutes, ...dynamicRoutes];
}

