import React from 'react';
import Link from 'next/link';
import { branding } from '@repo/shared-types';
import { MapPin, Mail, Phone, Instagram, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface-950 border-t border-surface-800/50 mt-16">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <span className="text-xl font-bold text-gradient">{branding.appName}</span>
            <p className="text-sm text-surface-400 leading-relaxed">
              {branding.tagline} Discover local stores and products near you. Supporting local retailers, one order at a time.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-surface-900 hover:bg-brand-500/20 text-surface-400 hover:text-brand-400 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-surface-900 hover:bg-brand-500/20 text-surface-400 hover:text-brand-400 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-surface-900 hover:bg-brand-500/20 text-surface-400 hover:text-brand-400 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-surface-200 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'All Products', href: '/products' },
                { label: 'Stores Near Me', href: '/stores' },
                { label: "Men's Fashion", href: '/category/men' },
                { label: "Women's Fashion", href: '/category/women' },
                { label: 'Electronics', href: '/category/electronics' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-surface-400 hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-surface-200 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Sell With Us', href: '/sell' },
                { label: 'Help & Support', href: '/help' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms & Conditions', href: '/terms' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-surface-400 hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-surface-200 uppercase tracking-wider">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-sm text-surface-400">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" />
                <span>New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-surface-400">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href={`mailto:${branding.supportEmail}`} className="hover:text-brand-400 transition-colors">
                  {branding.supportEmail}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-surface-400">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-surface-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-surface-500">
            © {new Date().getFullYear()} {branding.appName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-surface-500">
            <span>🔒 Secure Payments</span>
            <span>📦 Fast Delivery</span>
            <span>↩️ Easy Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
