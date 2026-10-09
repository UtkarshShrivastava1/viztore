import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube, Linkedin, MapPin, Heart, Circle } from 'lucide-react';
import { branding } from '@repo/shared-types';

export function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-blue-50 via-blue-600 to-[#00174F] text-black">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
          
          {/* Column 1: Brand & Social */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Image src="/logo_v.png" alt="{branding.appName} Logo" width={48} height={48} className="object-contain" />
                <span className="text-4xl font-bold tracking-tight text-black">{branding.appName.toLowerCase()}</span>
              </div>
              <p className="text-blue-700 text-sm font-medium mt-1 ml-[56px]">
                Making Local Stores <span className="font-bold">Visible.</span>
              </p>
            </div>
            
            <p className="text-[15px] font-medium leading-relaxed max-w-sm">
              Discover and shop from local stores in your city. Support local businesses and find everything you need, all in one place.
            </p>

            <div className="space-y-3">
              <h4 className="font-bold text-lg">Follow Us</h4>
              <div className="flex items-center gap-3">
                <a href="#" className="flex items-center justify-center w-10 h-10 rounded bg-white hover:bg-gray-100 transition-colors shadow-sm">
                  <Instagram className="w-5 h-5 text-black" />
                </a>
                <a href="#" className="flex items-center justify-center w-10 h-10 rounded bg-white hover:bg-gray-100 transition-colors shadow-sm">
                  <Linkedin className="w-5 h-5 text-black" />
                </a>
                <a href="#" className="flex items-center justify-center w-10 h-10 rounded bg-white hover:bg-gray-100 transition-colors shadow-sm">
                  <Youtube className="w-5 h-5 text-black" />
                </a>
                <a href="#" className="flex items-center justify-center w-10 h-10 rounded bg-white hover:bg-gray-100 transition-colors shadow-sm">
                  <Facebook className="w-5 h-5 text-black" />
                </a>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-lg">Download the App</h4>
              <div className="flex items-center gap-3">
                {/* Google Play Button */}
                <a href="#" className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors border border-gray-800">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white"><path d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 01-.609-1.423V3.237c0-.528.216-1.04.608-1.423zM21.037 10.378l-5.69-3.284-2.822 2.822 2.83 2.83 5.682-3.284a1.002 1.002 0 000-1.748L21.037 10.378zM14.28 6.035L4.542.423A2.001 2.001 0 003.568.125l10.712 10.71zM14.288 17.965l-2.828-2.828-7.892 7.892c.31.258.718.36 1.134.258l9.586-5.322z" fillRule="evenodd" clipRule="evenodd" fill="#000" /></svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase leading-none font-semibold text-gray-300">GET IT ON</span>
                    <span className="text-sm font-bold leading-none mt-0.5">Google Play</span>
                  </div>
                </a>
                {/* App Store Button */}
                <a href="#" className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors border border-gray-800">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M16.365 14.232c-.035 3.322 2.88 4.437 2.923 4.453-.027.086-.456 1.564-1.493 3.08-.897 1.31-1.83 2.613-3.3 2.636-1.444.024-1.92-.857-3.56-.857-1.64 0-2.164.834-3.56.88-1.517.05-2.583-1.426-3.48-2.736-1.83-2.658-3.235-7.51-1.353-10.783.932-1.624 2.597-2.65 4.38-2.674 1.417-.024 2.76.953 3.633.953.87 0 2.518-1.18 4.218-1.002 1.802.188 3.447 1.09 4.394 2.622-3.708 2.162-3.125 7.42-.79 8.428h-.012zm-3.083-10.985c.783-.948 1.306-2.26 1.164-3.57-1.11.045-2.482.737-3.29 1.684-.716.837-1.343 2.18-1.176 3.468 1.237.095 2.514-.64 3.302-1.582z"/></svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase leading-none font-semibold text-gray-300">Download on the</span>
                    <span className="text-sm font-bold leading-none mt-0.5">App Store</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Address */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold pb-2 relative">
              Our Address
              <div className="absolute bottom-0 left-0 w-10 h-1 bg-blue-600 rounded"></div>
            </h3>
            
            <div className="flex gap-4 mt-4">
              <div className="bg-white/90 shadow-sm p-2 rounded-xl flex-shrink-0 w-12 h-12 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex flex-col space-y-2 pt-1 text-[15px] font-medium">
                <span className="font-bold text-lg leading-none">Zager Digital Services</span>
                <p className="leading-relaxed">
                  Startup Enclave, CSIT Campus,<br/>
                  Shivaji Nagar, Balod Road,<br/>
                  Durg, Chhattisgarh 491001<br/>
                  India
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold pb-2 relative">
              Support
              <div className="absolute bottom-0 left-0 w-10 h-1 bg-blue-600 rounded"></div>
            </h3>
            
            <ul className="flex flex-col space-y-3 mt-4 text-[15px] font-medium">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Partner with Us', href: '/partner' },
                { label: 'Customer Terms & Conditions', href: '/terms' },
                { label: 'Seller Terms & Conditions', href: '/seller-terms' },
                { label: 'Careers', href: '/careers' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Refund and Cancellation Policy', href: '/refund' },
                { label: 'Grievance Redressal', href: '/grievance' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
          <p className="text-sm font-medium">
            © {new Date().getFullYear()} <span className="font-bold">{branding.appName}</span>. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1.5">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> in India
            </div>
            <div className="h-4 w-px bg-white/40"></div>
            <div className="flex items-center gap-1.5">
              <Circle className="w-3 h-3 text-green-400 fill-current" /> Service Active
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
