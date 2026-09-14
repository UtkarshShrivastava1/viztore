import { branding as sharedBranding } from '@repo/shared-types/branding.config';

export const branding = {
  appName: (import.meta as any).env?.VITE_APP_NAME || sharedBranding.appName || 'LocalStore',
  tagline: (import.meta as any).env?.VITE_APP_TAGLINE || sharedBranding.tagline || 'Shop Local. Shop Smart.',
  domain: (import.meta as any).env?.VITE_APP_DOMAIN || sharedBranding.domain || 'localhost',
  supportEmail: (import.meta as any).env?.VITE_SUPPORT_EMAIL || sharedBranding.supportEmail || 'support@example.com',
  logoUrl: sharedBranding.logoUrl,
  themeColor: sharedBranding.themeColor || '#0038ed',
  merchantPortalTitle: `${(import.meta as any).env?.VITE_APP_NAME || sharedBranding.appName || 'LocalStore'} Merchant Hub`,
} as const;

