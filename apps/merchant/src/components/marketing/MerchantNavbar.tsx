import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { SellOnlineDropdown } from './SellOnlineDropdown.js';
import { LearnDropdown } from './LearnDropdown.js';

interface MerchantNavbarProps {
  currentRoute?: string;
  onNavigate: (route: string) => void;
  onGoToLogin?: () => void;
  onGoToSignup?: () => void;
}

export const MerchantNavbar: React.FC<MerchantNavbarProps> = ({
  currentRoute = '/',
  onNavigate,
  onGoToLogin,
  onGoToSignup,
}) => {
  const [openDropdown, setOpenDropdown] = useState<'sell' | 'learn' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (route: string) => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
    onNavigate(route);
  };

  const handleLoginClick = () => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
    if (onGoToLogin) {
      onGoToLogin();
    } else {
      onNavigate('/login');
    }
  };

  const handleSignupClick = () => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
    if (onGoToSignup) {
      onGoToSignup();
    } else {
      onNavigate('/register');
    }
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all select-none"
    >
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleLinkClick('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0052ff] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5 fill-white/20" />
          </div>
          <span className="text-2xl font-black text-[#0052ff] tracking-tight">
            {branding.appName}
          </span>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Sell Online Dropdown trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'sell' ? null : 'sell')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                openDropdown === 'sell' || currentRoute.startsWith('/sell-online')
                  ? 'bg-blue-50 text-[#0038ed]'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Sell Online</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openDropdown === 'sell' ? 'rotate-180 text-[#0038ed]' : 'text-slate-400'
                }`}
              />
            </button>

            {openDropdown === 'sell' && (
              <div className="absolute left-0 top-full pt-3 z-50">
                <SellOnlineDropdown
                  onNavigate={handleLinkClick}
                  onClose={() => setOpenDropdown(null)}
                />
              </div>
            )}
          </div>

          {/* How It Works */}
          <button
            type="button"
            onClick={() => handleLinkClick('/how-it-works')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              currentRoute === '/how-it-works'
                ? 'bg-blue-50 text-[#0038ed]'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            How it works
          </button>

          {/* Pricing */}
          <button
            type="button"
            onClick={() => handleLinkClick('/pricing')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              currentRoute === '/pricing'
                ? 'bg-blue-50 text-[#0038ed]'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Pricing
          </button>

          {/* Grow Business */}
          <button
            type="button"
            onClick={() => handleLinkClick('/grow-business')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              currentRoute.startsWith('/grow-business')
                ? 'bg-blue-50 text-[#0038ed]'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Grow Business
          </button>

          {/* Learn Dropdown trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'learn' ? null : 'learn')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                openDropdown === 'learn' ||
                currentRoute.startsWith('/learn') ||
                currentRoute === '/help' ||
                currentRoute === '/faqs' ||
                currentRoute.startsWith('/blog')
                  ? 'bg-blue-50 text-[#0038ed]'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Learn</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openDropdown === 'learn' ? 'rotate-180 text-[#0038ed]' : 'text-slate-400'
                }`}
              />
            </button>

            {openDropdown === 'learn' && (
              <div className="absolute right-0 top-full pt-3 z-50">
                <LearnDropdown
                  onNavigate={handleLinkClick}
                  onClose={() => setOpenDropdown(null)}
                />
              </div>
            )}
          </div>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={handleLoginClick}
            className="px-6 py-2 rounded-lg border border-[#0052ff] text-[#0052ff] bg-white font-semibold text-sm hover:bg-blue-50/40 transition-all cursor-pointer"
          >
            Login
          </button>

          <button
            type="button"
            onClick={handleSignupClick}
            className="px-6 py-2 rounded-lg bg-[#0052ff] hover:bg-[#0042d0] text-white font-semibold text-sm shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Start Selling</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/90 bg-white px-4 py-6 space-y-4 shadow-xl">
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Sell Online
            </div>
            <button
              onClick={() => handleLinkClick('/sell-online/listproducts')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              List Products
            </button>
            <button
              onClick={() => handleLinkClick('/sell-online/managestore')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Manage Your Store
            </button>
            <button
              onClick={() => handleLinkClick('/sell-online/ordersdelivery')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Orders &amp; Delivery
            </button>
            <button
              onClick={() => handleLinkClick('/sell-online/sellertools')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Seller Tools
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1">
            <button
              onClick={() => handleLinkClick('/how-it-works')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              How it works
            </button>
            <button
              onClick={() => handleLinkClick('/pricing')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Pricing
            </button>
            <button
              onClick={() => handleLinkClick('/grow-business')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Grow Business
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1">
            <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Learn &amp; Support
            </div>
            <button
              onClick={() => handleLinkClick('/learn/guides')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Business Guides
            </button>
            <button
              onClick={() => handleLinkClick('/learn/tutorials')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Video Tutorials
            </button>
            <button
              onClick={() => handleLinkClick('/help')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Help Centre
            </button>
            <button
              onClick={() => handleLinkClick('/faqs')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              FAQs
            </button>
            <button
              onClick={() => handleLinkClick('/blog')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Seller Blog
            </button>
            <button
              onClick={() => handleLinkClick('/help/contact')}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Contact Support
            </button>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleSignupClick}
              className="w-full py-3 rounded-xl bg-[#0038ed] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
            >
              <span>Start Selling</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleLoginClick}
              className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm text-center"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
