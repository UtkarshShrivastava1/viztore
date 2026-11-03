import { MetadataRoute } from 'next';
import { branding } from '@repo/shared-types';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${branding.appName} — Hyperlocal Shopping`,
    short_name: branding.appName,
    description: branding.tagline,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: branding.themeColor,
    icons: [
      {
        src: branding.logoUrl || '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}

