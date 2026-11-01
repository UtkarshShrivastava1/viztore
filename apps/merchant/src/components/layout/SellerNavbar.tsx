import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { SellOnlineDropdown } from '../marketing/SellOnlineDropdown.js';
import { LearnDropdown } from '../marketing/LearnDropdown.js';

interface SellerNavbarProps {
  onGoToLogin?: () => void;
  onGoToSignup?: () => void;
  onGoToHome?: () => void;
  onNavigate?: (route: string) => void;
  currentRoute?: string;
}

export const SellerNavbar: React.FC<SellerNavbarProps> = ({
  onGoToLogin,
  onGoToSignup,
  onGoToHome,
  onNavigate,
  currentRoute = '/',
}) => {
  const [openDropdown, setOpenDropdown] = useState<'sell' | 'learn' | null>(null);
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

  const handleNavigate = (route: string) => {
    setOpenDropdown(null);
    if (onNavigate) {
      onNavigate(route);
    } else if (route === '/' && onGoToHome) {
      onGoToHome();
    } else {
      window.location.href = route;
    }
  };

  return (
    <nav
      ref={navRef}
      className="h-18 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-8 lg:px-12 flex items-center justify-between select-none"
    >
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-9">
        <button
          type="button"
          onClick={() => handleNavigate('/')}
          className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
        >
          <img
            src="/images/logo-dark.png"
            alt={branding.appName}
            className="h-11 sm:h-12 md:h-[50px] w-auto object-contain group-hover:opacity-90 transition-opacity"
          />
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-2 text-[13px] font-medium text-slate-700">
          {/* Sell Online Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'sell' ? null : 'sell')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 hover:text-[#0038ed] transition-colors cursor-pointer ${
                openDropdown === 'sell' ? 'bg-blue-50 text-[#0038ed]' : ''
              }`}
            >
              <span>Sell Online</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'sell' ? 'rotate-180 text-[#0038ed]' : 'text-slate-400'
                }`}
              />
            </button>

            {openDropdown === 'sell' && (
              <div className="absolute left-0 top-full pt-2 z-50">
                <SellOnlineDropdown
                  onNavigate={handleNavigate}
                  onClose={() => setOpenDropdown(null)}
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleNavigate('/how-it-works')}
            className="px-3 py-1.5 rounded-lg hover:text-[#0038ed] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            How it works
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('/pricing')}
            className="px-3 py-1.5 rounded-lg hover:text-[#0038ed] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Pricing
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('/grow-business')}
            className="px-3 py-1.5 rounded-lg hover:text-[#0038ed] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Grow Business
          </button>

          {/* Learn Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'learn' ? null : 'learn')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 hover:text-[#0038ed] transition-colors cursor-pointer ${
                openDropdown === 'learn' ? 'bg-blue-50 text-[#0038ed]' : ''
              }`}
            >
              <span>Learn</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'learn' ? 'rotate-180 text-[#0038ed]' : 'text-slate-400'
                }`}
              />
            </button>

            {openDropdown === 'learn' && (
              <div className="absolute left-0 top-full pt-2 z-50">
                <LearnDropdown
                  onNavigate={handleNavigate}
                  onClose={() => setOpenDropdown(null)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onGoToLogin}
          className="px-6 py-2 text-sm font-semibold text-[#0038ed] border border-[#0038ed] rounded-lg hover:bg-blue-50/60 transition-all cursor-pointer"
        >
          Login
        </button>

        <button
          type="button"
          onClick={onGoToSignup}
          className="px-6 py-2 text-sm font-semibold text-white bg-[#0038ed] hover:bg-[#002fcf] rounded-lg shadow-xs transition-all cursor-pointer"
        >
          Start Selling
        </button>
      </div>
    </nav>
  );
};

