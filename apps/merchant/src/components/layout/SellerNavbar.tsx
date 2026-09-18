import React from 'react';
import { ChevronDown } from 'lucide-react';
import { branding } from '../../lib/branding.js';

interface SellerNavbarProps {
  onGoToLogin?: () => void;
  onGoToSignup?: () => void;
  onGoToHome?: () => void;
}

export const SellerNavbar: React.FC<SellerNavbarProps> = ({
  onGoToLogin,
  onGoToSignup,
  onGoToHome,
}) => {
  return (
    <nav className="h-18 bg-white border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-8 lg:px-12 flex items-center justify-between">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-9">
        <button
          onClick={onGoToHome || onGoToSignup}
          className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
        >
          {/* Shopping Bag with Checkmark Icon matching Mockup Logo */}
          <div className="w-9 h-9 rounded-lg bg-[#0038ed] flex items-center justify-center text-white shadow-xs">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="m9 13 2 2 4-4" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#0038ed] font-sans">
            {branding.appName}
          </span>
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-slate-800">
          <button className="flex items-center gap-1 hover:text-[#0038ed] transition-colors cursor-pointer">
            <span>Sell Online</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="hover:text-[#0038ed] transition-colors cursor-pointer">
            How it works
          </button>
          <button className="hover:text-[#0038ed] transition-colors cursor-pointer">Pricing</button>
          <button className="hover:text-[#0038ed] transition-colors cursor-pointer">
            Grow Business
          </button>
          <button className="flex items-center gap-1 hover:text-[#0038ed] transition-colors cursor-pointer">
            <span>Learn</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
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
