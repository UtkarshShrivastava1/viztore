import type { Metadata } from "next";
import { Poppins, Geist, Geist_Mono } from "next/font/google";
import { branding } from "@repo/shared-types/branding.config";
import './global.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${branding.domain}`),
  title: `${branding.appName} — ${branding.tagline}`,
  description:
    `${branding.appName} helps local retailers digitize their business and helps customers discover nearby stores and products.`,
  keywords: [
    branding.appName,
    "local retail",
    "digitize store",
    "retail SaaS",
    "discover local stores",
    "retailer app",
  ],
  openGraph: {
    title: `${branding.appName} — ${branding.tagline}`,
    description:
      `Digitize your store, manage inventory and orders, and get discovered by nearby customers with ${branding.appName}.`,
    url: `https://${branding.domain}`,
    siteName: branding.appName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${branding.appName} — ${branding.tagline}`,
    description:
      `Digitize your store, manage inventory and orders, and get discovered by nearby customers with ${branding.appName}.`,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="company" className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased no-scrollbar`}>
      <body className="font-sans antialiased element no-scrollbar">{children}</body>
    </html>
  );
}
