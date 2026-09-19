export const branding = {
  appName: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_APP_NAME) ? process.env.NEXT_PUBLIC_APP_NAME : 'LocalStore',
  tagline: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_APP_TAGLINE) ? process.env.NEXT_PUBLIC_APP_TAGLINE : 'Shop Local. Shop Smart.',
  domain: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_APP_DOMAIN) ? process.env.NEXT_PUBLIC_APP_DOMAIN : 'localhost',
  supportEmail: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPPORT_EMAIL) ? process.env.NEXT_PUBLIC_SUPPORT_EMAIL : 'support@example.com',
  logoUrl: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_LOGO_URL) ? process.env.NEXT_PUBLIC_LOGO_URL : '/logo.svg',
  themeColor: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_THEME_COLOR) ? process.env.NEXT_PUBLIC_THEME_COLOR : '#6366f1',
} as const;

export type BrandingConfig = typeof branding;
