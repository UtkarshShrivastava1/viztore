import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { branding } from '@repo/shared-types';
import { Providers } from './providers';
import { CartDrawer } from '../components/cart/CartDrawer';
import { StoreConflictModal } from '../components/cart/StoreConflictModal';
import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { TopProgressBar } from '@/components/layout/TopProgressBar';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { CustomerNotificationListener } from '@/components/notifications/CustomerNotificationListener';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-inter',
});

export const viewport = {
  themeColor: branding.themeColor,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const siteUrl = branding.domain.startsWith('http')
  ? branding.domain
  : `https://${branding.domain}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${branding.appName} — ${branding.tagline}`,
    template: `%s | ${branding.appName}`,
  },
  description: `Discover verified local stores and order products near you with 3–4 km instant delivery. ${branding.tagline}`,
  keywords: [
    branding.appName,
    'hyperlocal delivery',
    'local stores near me',
    'online shopping India',
    'nearby shops',
    'instant delivery',
    'support local retailers',
    'buy local',
  ],
  authors: [{ name: branding.appName, url: siteUrl }],
  creator: branding.appName,
  publisher: branding.appName,
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: `${branding.appName} — ${branding.tagline}`,
    description: `Discover verified local stores and order products near you with 3–4 km instant delivery. ${branding.tagline}`,
    url: siteUrl,
    siteName: branding.appName,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${branding.appName} — ${branding.tagline}`,
    description: `Discover verified local stores and order products near you with 3–4 km instant delivery. ${branding.tagline}`,
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${inter.className}`} style={{ fontFamily: 'var(--font-inter)' }} suppressHydrationWarning>
      <body className="font-sans bg-white text-surface-900 antialiased min-h-[100dvh] relative overflow-x-hidden">
        {/* Subtle decorative side gradients for wide screens */}
        <div className="pointer-events-none fixed inset-0 z-0 hidden lg:block" aria-hidden="true">
          <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-blue-50/50 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-blue-50/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full flex flex-col min-h-screen">
          <Providers>
            <TopProgressBar />
            <Header />
            <div className="flex-1 w-full">
              {children}
            </div>
            <Footer />
            <CartDrawer />
            <StoreConflictModal />
            <BottomNav />
            <AuthModal />
            <ToastContainer />
            <CustomerNotificationListener />
          </Providers>
        </div>
      </body>
    </html>
  );
}
