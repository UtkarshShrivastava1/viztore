import { branding as sharedBranding } from '@repo/shared-types/branding.config';

export const getCompanyUrl = (path: string = ''): string => {
  const envUrl = (import.meta as any).env?.VITE_COMPANY_URL;
  const baseUrl =
    envUrl ||
    (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3002'
      : 'https://company.viztore.com');
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${cleanBase}${cleanPath}`;
};

export const branding = {
  appName: (import.meta as any).env?.VITE_APP_NAME || sharedBranding.appName || 'LocalStore',
  tagline: (import.meta as any).env?.VITE_APP_TAGLINE || sharedBranding.tagline || 'Shop Local. Shop Smart.',
  domain: (import.meta as any).env?.VITE_APP_DOMAIN || sharedBranding.domain || 'localhost',
  supportEmail: (import.meta as any).env?.VITE_SUPPORT_EMAIL || sharedBranding.supportEmail || 'connect@viztore.com',
  contactPhone: (import.meta as any).env?.VITE_CONTACT_PHONE || (sharedBranding as any).contactPhone || '+91 9407655617',
  logoUrl: sharedBranding.logoUrl,
  themeColor: sharedBranding.themeColor || '#0038ed',
  merchantPortalTitle: `${(import.meta as any).env?.VITE_APP_NAME || sharedBranding.appName || 'LocalStore'} Merchant Hub`,
  companyUrl: getCompanyUrl(),
} as const;
