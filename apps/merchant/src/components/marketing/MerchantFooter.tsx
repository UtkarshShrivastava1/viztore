import React from 'react';
import {
  ShoppingBag,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  MapPin,
  Heart,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';

interface MerchantFooterProps {
  onNavigate: (route: string) => void;
}

export const MerchantFooter: React.FC<MerchantFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative bg-white text-slate-800 pt-16 sm:pt-20 select-none overflow-hidden border-t border-slate-100">
      {/* Background Wave Graphic matching Footer.png */}
      <div 
        className="absolute inset-x-0 bottom-0 pointer-events-none z-0" 
        style={{ height: '380px' }}
      >
        <svg
          viewBox="0 0 1440 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="footerWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.08" />
              <stop offset="30%" stopColor="#2563eb" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#0052ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0031c4" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="footerBackGlow" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#002baf" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M0,140 C320,60 520,200 820,130 C1120,60 1280,120 1440,80 L1440,380 L0,380 Z"
            fill="url(#footerBackGlow)"
            opacity="0.5"
          />
          <path
            d="M0,160 C380,80 620,230 960,150 C1200,90 1340,140 1440,110 L1440,380 L0,380 Z"
            fill="url(#footerWaveGrad)"
          />
        </svg>
      </div>

      {/* Top 6 Columns - Clean Desktop Alignment */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 xl:gap-12">
          {/* Column 1: Brand */}
          <div className="w-full lg:w-[310px] shrink-0">
            {/* Logo */}
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0052ff] text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5 fill-white/20" />
              </div>
              <span className="text-[28px] font-black text-[#0052ff] tracking-tight">
                {branding.appName}
              </span>
            </div>

            {/* Tagline */}
            <div className="text-[17px] font-bold text-[#0c1427] tracking-tight mt-3">
              Making Local Stores <span className="text-[#0052ff]">Visible.</span>
            </div>

            {/* Description */}
            <p className="text-[13.5px] text-slate-500 leading-relaxed max-w-[290px] mt-2">
              A connected platform for local retailers to manage their business and help customers
              discover what's nearby.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#f1f5f9] text-slate-800 hover:text-[#0052ff] hover:bg-blue-50 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#f1f5f9] text-slate-800 hover:text-[#0052ff] hover:bg-blue-50 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#f1f5f9] text-slate-800 hover:text-[#0052ff] hover:bg-blue-50 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#f1f5f9] text-slate-800 hover:text-[#0052ff] hover:bg-blue-50 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>

            {/* Download the App */}
            <div className="mt-7">
              <div className="text-[13.5px] font-bold text-[#0c1427] mb-3">
                Download the App
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="#download-play"
                  className="inline-block hover:opacity-90 transition-opacity"
                  aria-label="Get it on Google Play"
                >
                  <img
                    src="/images/google-play-badge.svg"
                    alt="Get it on Google Play"
                    className="h-[38px] w-auto shadow-xs rounded-md"
                  />
                </a>
                <a
                  href="#download-appstore"
                  className="inline-block hover:opacity-90 transition-opacity"
                  aria-label="Download on the App Store"
                >
                  <img
                    src="/images/app-store-badge.svg"
                    alt="Download on the App Store"
                    className="h-[38px] w-auto shadow-xs rounded-md"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Columns 2-5: The 4 Middle Link Columns */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 xl:gap-10">
            {/* Column 2: Sell Online */}
            <div>
              <div className="text-[16px] font-bold text-[#0c1427]">Sell Online</div>
              <span className="w-8 h-[3.5px] bg-[#0052ff] rounded-full block mt-2 mb-4" />
              <ul className="space-y-3 text-[13.5px] text-slate-600 font-normal">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/register')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Start Selling
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/sell-online/listproducts')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    List Products
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/sell-online/managestore')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Manage Your Store
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/sell-online/ordersdelivery')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Orders &amp; Delivery
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/sell-online/sellertools')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Seller Tools
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/pricing')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Pricing
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Grow Business */}
            <div>
              <div className="text-[16px] font-bold text-[#0c1427]">Grow Business</div>
              <span className="w-8 h-[3.5px] bg-[#0052ff] rounded-full block mt-2 mb-4" />
              <ul className="space-y-3 text-[13.5px] text-slate-600 font-normal">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/how-it-works/localdiscovery')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Local Discovery
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/grow-business')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Promotions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/grow-business')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Business Insights
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/sell-online/managestore')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Customer Management
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/sell-online/sellertools')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Marketing Tools
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Learn */}
            <div>
              <div className="text-[16px] font-bold text-[#0c1427]">Learn</div>
              <span className="w-8 h-[3.5px] bg-[#0052ff] rounded-full block mt-2 mb-4" />
              <ul className="space-y-3 text-[13.5px] text-slate-600 font-normal">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/how-it-works')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    How it Works
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/help')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Help Centre
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/learn/guides')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Business Guides
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/learn/tutorials')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Learning Resources
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/faqs')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    FAQs
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/blog')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Seller Blog
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/help/contact')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Contact Support
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5: Company */}
            <div>
              <div className="text-[16px] font-bold text-[#0c1427]">Company</div>
              <span className="w-8 h-[3.5px] bg-[#0052ff] rounded-full block mt-2 mb-4" />
              <ul className="space-y-3 text-[13.5px] text-slate-600 font-normal">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/how-it-works')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    About {branding.appName}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/help/contact')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/help/contact')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Partner with Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/help/contact')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/terms')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Terms of Use
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/privacy')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/terms')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Seller Terms &amp; Conditions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/refund-policy')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Refund and Cancellation Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/help/contact')}
                    className="hover:text-[#0052ff] transition-colors cursor-pointer text-left block"
                  >
                    Grievance Redressal
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 6: Our Address */}
          <div className="w-full lg:w-[280px] shrink-0">
            <div>
              <div className="text-[16px] font-bold text-[#0c1427]">Our Address</div>
              <span className="w-8 h-[3.5px] bg-[#0052ff] rounded-full block mt-2 mb-4" />
            </div>

            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0 text-[#0052ff] mt-0.5">
                <MapPin className="w-5 h-5 fill-[#0052ff]/10" />
              </div>
              <div className="text-[13px] text-slate-600 leading-relaxed">
                <div className="font-bold text-[#0c1427] text-[14.5px] mb-0.5">
                  Zager Digital Services
                </div>
                <div>Startup Enclave, CSIT Campus,</div>
                <div>Shivaji Nagar, Balod Road,</div>
                <div>Durg, Chhattisgarh 491001</div>
                <div>India</div>
              </div>
            </div>

            {/* Dotted India Map Badge with Durg Pin */}
            <div className="relative w-full max-w-[260px] rounded-2xl overflow-hidden shadow-xs border border-blue-100/40 bg-gradient-to-br from-blue-50/60 to-white/90 p-1.5">
              <img
                src="/images/footer-india-map.png"
                alt="CSIT Campus, Durg, Chhattisgarh location map"
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Thin Horizontal White Divider Line matching Footer.png */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="w-full h-[1px] bg-white/25" />
      </div>

      {/* Bottom Copyright Bar inside Royal Blue matching Footer.png */}
      <div className="py-5 px-4 sm:px-6 lg:px-8 text-xs font-medium relative z-20 text-white">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-white/95">
            &copy; 2026 <strong className="font-bold text-white">{branding.appName}.</strong> All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-white/95 font-medium">
              Made with <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500 inline" /> in India
            </span>
            <span className="text-white/40">|</span>
            <span className="flex items-center gap-2 text-white font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00e676] shadow-sm animate-pulse inline-block" />
              Service Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
