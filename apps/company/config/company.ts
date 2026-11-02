/**
 * Viztore Corporate Marketing Platform Configuration
 * Static company identity, contact information, and business metadata.
 * 
 * Note: These are hardcoded company constants. No environment variables
 * are required for standard local development or cloud deployment.
 */

export const companyConfig = {
  appName: 'Viztore',
  tagline: 'Making Local Stores Visible.',
  domain: process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, '') || 'viztore.com',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://viztore.com',
  supportEmail: 'support@viztore.com',
  contactPhone: '+91 98765 43210',
  companyAddress: 'Startup Enclave, Campus Road, Sector 4, Durg, CG 491001, India',
  legalEntity: 'Viztore Retail Services Pvt. Ltd.',
  themeColor: '#03153d',
  logoUrl: '/images/lightLogo.png',
  logoDarkUrl: '/images/darkLogo.png',
} as const;

// Direct alias for company components
export const branding = companyConfig;
export default companyConfig;
