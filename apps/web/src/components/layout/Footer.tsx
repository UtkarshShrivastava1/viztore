'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  MapPin,
} from 'lucide-react';
import { branding } from '@repo/shared-types';

const supportLinks = [
  { label: 'About Us', href: '/account/support' },
  { label: 'Contact Us', href: '/account/support' },
  { label: 'Partner with Us', href: '/account/sell' },
  { label: 'Customer Terms & Conditions', href: '/account/terms' },
  { label: 'Seller Terms & Conditions', href: '/account/terms' },
  { label: 'Careers', href: '/account/support' },
  { label: 'Privacy Policy', href: '/account/privacy' },
  { label: 'Refund and Cancellation Policy', href: '/account/terms' },
  { label: 'Grievance Redressal', href: '/account/support' },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/rider')) return null;

  return (
    <footer className="w-full bg-gradient-to-b from-blue-50 via-blue-600 to-[#00174F] text-slate-900">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 pt-16 pb-24 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-0">

          {/* Column 1: Logo, Description & Follow Us */}
          <div className="lg:col-span-5 lg:pr-12 lg:border-r lg:border-slate-300/40 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block">
                <Image
                  src="/images/logo-dark.png"
                  alt={`${branding.appName} - ${branding.tagline}`}
                  width={200}
                  height={52}
                  priority
                  className="h-11 md:h-12 w-auto object-contain"
                />
              </Link>
              <p className="text-blue-700 text-sm font-semibold mt-2">
                Making Local Stores <span className="font-extrabold">Visible.</span>
              </p>
              <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-slate-800">
                Discover and shop from local stores in your city. Support local businesses
                and find everything you need, all in one place.
              </p>
            </div>

            <div className="mt-8">
              <h4 className="text-base font-bold text-slate-900 mb-4">Follow Us</h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#061755] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:bg-slate-50"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#061755] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:bg-slate-50"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#061755] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:bg-slate-50"
                >
                  <Youtube size={20} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#061755] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:bg-slate-50"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Our Address */}
          <div className="lg:col-span-4 lg:px-10 lg:border-r lg:border-slate-300/40 flex flex-col justify-between">
            <div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Our Address</h4>
                <div className="mt-2 h-1 w-10 rounded-full bg-[#0070F3] shadow-sm shadow-blue-500/50" />
              </div>

              <div className="mt-6 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md shadow-black/10">
                  <MapPin className="h-7 w-7 text-[#0066FF]" />
                </div>
                <div className="text-sm leading-relaxed">
                  <h5 className="font-bold text-slate-900 text-base">{branding.legalEntity || 'Viztore Retail Services Pvt. Ltd.'}</h5>
                  <p className="mt-1 text-slate-800 font-medium leading-relaxed">
                    {branding.companyAddress || 'Startup Enclave, Campus Road, Sector 4, Durg, CG 491001, India'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Support */}
          <div className="lg:col-span-3 lg:pl-10">
            <div>
              <h4 className="text-base font-bold text-slate-900">Support</h4>
              <div className="mt-2 h-1 w-10 rounded-full bg-[#0070F3] shadow-sm shadow-blue-500/50" />
            </div>

            <ul className="mt-6 flex flex-col gap-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-slate-800 transition-colors duration-150 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-7 pb-2 sm:flex-row text-xs md:text-sm text-blue-100/85">
          <p>
            © {new Date().getFullYear()} <strong className="font-bold text-white">{branding.appName}</strong>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-100/90 font-medium">
              Made with <span className="text-red-500 text-sm">❤️</span> in India
            </span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-white font-medium">Service Active</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
