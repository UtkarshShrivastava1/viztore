import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  Wallet,
  ChevronDown,
  Store,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore.js';
import { NotificationsDrawer } from './drawers/NotificationsDrawer.js';
import { HelpSupportDrawer } from './drawers/HelpSupportDrawer.js';
import { SellerProfileDrawer } from './drawers/SellerProfileDrawer.js';
import { ProfileInformationDrawer } from './drawers/ProfileInformationDrawer.js';

interface HeaderProps {
  isCollapsed: boolean;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isCollapsed, onToggleMobileMenu }) => {
  const { user, currentStore } = useAuthStore();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileInfoOpen, setIsProfileInfoOpen] = useState(false);

  const storeName = currentStore?.name || user?.fullName || 'My Store';
  const avatarInitials = storeName.slice(0, 2).toUpperCase();

  return (
    <>
      <header
        className={`h-16 bg-white border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${
          isCollapsed ? 'sm:ml-20' : 'sm:ml-64'
        }`}
      >
        {/* Left Side: Mobile Menu Toggle & Search Bar */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 sm:hidden transition-colors"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar with Shortcut */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders, products, customers..."
              className="w-full pl-10 pr-16 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              Ctrl + K
            </kbd>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wallet Button */}
          <button
            type="button"
            onClick={() => alert('Wallet & Payouts: ₹32,450')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-200/80 bg-white hover:bg-blue-50/50 text-slate-800 text-xs font-medium transition-all shadow-2xs"
          >
            <Wallet className="w-3.5 h-3.5 text-blue-600" />
            <span>Wallet</span>
          </button>

          {/* Notifications Bell with Badge */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            className={`relative p-2 rounded-xl transition-colors ${
              isNotificationsOpen
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              5
            </span>
          </button>

          {/* Help & Support Button */}
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Help & Support"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Seller Profile Pill */}
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 transition-all text-left"
          >
            <Store className="w-4 h-4 text-slate-500 hidden lg:block" />
            <div className="hidden lg:block">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800 leading-tight">
                <span>{storeName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-400 block font-medium">Seller</span>
            </div>

            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
              {avatarInitials}
            </div>
          </button>
        </div>
      </header>

      {/* Drawers */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <HelpSupportDrawer
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <SellerProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenProfileInfo={() => {
          setIsProfileOpen(false);
          setIsProfileInfoOpen(true);
        }}
      />

      <ProfileInformationDrawer
        isOpen={isProfileInfoOpen}
        onClose={() => setIsProfileInfoOpen(false)}
      />
    </>
  );
};
