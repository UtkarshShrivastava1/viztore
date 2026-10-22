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
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport = {
  themeColor: branding.themeColor,
};

export const metadata: Metadata = {
  title: {
    default: `${branding.appName} — ${branding.tagline}`,
    template: `%s | ${branding.appName}`,
  },
  description: `Discover local stores and products near you. ${branding.tagline}`,
  keywords: ['local shopping', 'nearby stores', 'hyperlocal', 'e-commerce', 'shop local'],
  authors: [{ name: branding.appName }],
  openGraph: {
    title: `${branding.appName} — ${branding.tagline}`,
    description: `Discover local stores and products near you. ${branding.tagline}`,
    siteName: branding.appName,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-white text-surface-900 antialiased min-h-[100dvh] relative overflow-x-hidden">
        {/* Subtle decorative side gradients for wide screens */}
        <div className="pointer-events-none fixed inset-0 z-0 hidden lg:block" aria-hidden="true">
          <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-blue-50/50 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-blue-50/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full flex flex-col min-h-screen">
          <Providers>
            <Header />
            <div className="flex-1 w-full">
              {children}
            </div>
            <Footer />
            <CartDrawer />
            <StoreConflictModal />
            <BottomNav />
            <AuthModal />
          </Providers>
        </div>
      </body>
    </html>
  );
}
