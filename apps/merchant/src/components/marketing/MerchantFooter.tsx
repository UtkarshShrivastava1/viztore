import React from 'react';
import {
  ShoppingBag,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  MapPin,
  Heart,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';

interface MerchantFooterProps {
  onNavigate: (route: string) => void;
}

export const MerchantFooter: React.FC<MerchantFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gradient-to-b from-[#f8fbff] to-[#0d3bf0] text-slate-800 pt-16 sm:pt-20 select-none overflow-hidden">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & Mission Column (3.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0038ed] text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5 fill-white/20" />
              </div>
              <span className="text-2xl font-black text-[#0038ed] tracking-tight">
                {branding.appName}
              </span>
            </div>

            <div className="text-sm font-bold text-slate-900">
              {branding.tagline || 'Making Local Stores Visible.'}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              A connected platform for local retailers to manage their business and help customers
              discover what's nearby.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0038ed] hover:border-[#0038ed] flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0038ed] hover:border-[#0038ed] flex items-center justify-center transition-colors shadow-2xs"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0038ed] hover:border-[#0038ed] flex items-center justify-center transition-colors shadow-2xs"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0038ed] hover:border-[#0038ed] flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>

            {/* App Store Badges */}
            <div className="pt-3">
              <div className="text-[11px] font-bold text-slate-900 mb-2 uppercase tracking-wider">
                Download the App
              </div>
              <div className="flex items-center gap-2">
                {/* Google Play Styled Pill */}
                <div className="px-3 py-1.5 bg-black text-white rounded-lg flex items-center gap-2 cursor-pointer hover:bg-slate-800 transition-colors shadow-2xs">
                  <div className="text-[13px] font-black leading-none">▶</div>
                  <div>
                    <div className="text-[8px] uppercase tracking-wider text-slate-400 leading-none">
                      GET IT ON
                    </div>
                    <div className="text-[11px] font-bold leading-tight">Google Play</div>
                  </div>
                </div>

                {/* App Store Styled Pill */}
                <div className="px-3 py-1.5 bg-black text-white rounded-lg flex items-center gap-2 cursor-pointer hover:bg-slate-800 transition-colors shadow-2xs">
                  <div className="text-[14px] leading-none"></div>
                  <div>
                    <div className="text-[8px] uppercase tracking-wider text-slate-400 leading-none">
                      Download on the
                    </div>
                    <div className="text-[11px] font-bold leading-tight">App Store</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sell Online Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-block pb-1 border-b-2 border-[#0038ed] text-sm font-bold text-slate-900">
              Sell Online
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/register')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Start Selling
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/sell-online/listproducts')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  List Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/sell-online/managestore')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Manage Your Store
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/sell-online/ordersdelivery')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Orders &amp; Delivery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/sell-online/sellertools')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Seller Tools
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/pricing')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Grow Business Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-block pb-1 border-b-2 border-[#0038ed] text-sm font-bold text-slate-900">
              Grow Business
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/how-it-works/localdiscovery')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Local Discovery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/grow-business')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Promotions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/grow-business')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Business Insights
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/sell-online/managestore')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Customer Management
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/sell-online/sellertools')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Marketing Tools
                </button>
              </li>
            </ul>
          </div>

          {/* Learn Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-block pb-1 border-b-2 border-[#0038ed] text-sm font-bold text-slate-900">
              Learn
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/how-it-works')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  How it Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/help')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Help Centre
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/learn/guides')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Business Guides
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/learn/tutorials')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Learning Resources
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/faqs')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/blog')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Seller Blog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/help/contact')}
                  className="hover:text-[#0038ed] transition-colors cursor-pointer"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Address Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-3">
              <div className="inline-block pb-1 border-b-2 border-[#0038ed] text-sm font-bold text-slate-900">
                Company &amp; Legal
              </div>
              <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/how-it-works')}
                    className="hover:text-[#0038ed] transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/help/contact')}
                    className="hover:text-[#0038ed] transition-colors cursor-pointer"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/terms')}
                    className="hover:text-[#0038ed] transition-colors cursor-pointer"
                  >
                    Terms of Use
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/privacy')}
                    className="hover:text-[#0038ed] transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/refund-policy')}
                    className="hover:text-[#0038ed] transition-colors cursor-pointer"
                  >
                    Refund Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/help/contact')}
                    className="hover:text-[#0038ed] transition-colors cursor-pointer"
                  >
                    Grievance
                  </button>
                </li>
              </ul>
            </div>

            {/* Address Box */}
            <div className="p-4 bg-white/90 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Zager Digital Services</div>
                  <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    Startup Enclave, CSIT Campus, Shivaji Nagar, Balod Road, Durg, Chhattisgarh
                    491001, India
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span className="font-semibold text-slate-700">HQ: Durg / Bhilai, CG</span>
                <span className="flex items-center gap-1 text-[#0038ed] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0038ed] animate-pulse" />
                  Hub Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar matching Footer.png */}
      <div className="border-t border-white/20 bg-[#002fcf] text-white py-4.5 px-4 sm:px-6 lg:px-8 text-xs font-medium">
        <div className="max-w-[1340px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            &copy; {new Date().getFullYear()} {branding.appName}. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-white/90">
              Made with <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400 inline" /> in India
            </span>
            <span className="text-white/40">|</span>
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
              Service Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
