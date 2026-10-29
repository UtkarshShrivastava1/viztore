import React, { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  Store,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore.js';
import { NotificationsDrawer } from './drawers/NotificationsDrawer.js';
import { HelpSupportDrawer } from './drawers/HelpSupportDrawer.js';
import { SellerProfileDrawer } from './drawers/SellerProfileDrawer.js';
import { ProfileInformationDrawer } from './drawers/ProfileInformationDrawer.js';
import { StoreInactiveConfirmModal } from './StoreInactiveConfirmModal.js';
import { CommandPaletteModal } from './drawers/CommandPaletteModal.js';
import { DashboardTab } from './Sidebar.js';

interface HeaderProps {
  isCollapsed: boolean;
  isResizing?: boolean;
  onToggleMobileMenu: () => void;
  onNavigateToWallet?: () => void;
  onNavigateToSettings?: (subTab?: string) => void;
  onNavigateToSupport?: () => void;
  onNavigate?: (tab: DashboardTab, subTab?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isCollapsed,
  isResizing = false,
  onToggleMobileMenu,
  onNavigateToWallet,
  onNavigateToSettings,
  onNavigateToSupport,
  onNavigate,
}) => {
  const { user, currentStore, isStoreActive, setStoreActive } = useAuthStore();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileInfoOpen, setIsProfileInfoOpen] = useState(false);
  const [isInactiveModalOpen, setIsInactiveModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Global Ctrl + K / Cmd + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const storeName = currentStore?.name || user?.fullName || 'Fashion Hub';
  const avatarInitials = storeName.slice(0, 2).toUpperCase();

  const handleToggleStoreStatus = () => {
    if (isStoreActive) {
      setIsInactiveModalOpen(true);
    } else {
      setStoreActive(true);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sm:ml-[var(--sidebar-width)] ${
          isResizing ? '' : 'transition-[margin] duration-300'
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
          <div
            onClick={() => setIsCommandPaletteOpen(true)}
            className="relative w-full cursor-pointer group"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
            <input
              type="text"
              readOnly
              onFocus={() => setIsCommandPaletteOpen(true)}
              placeholder="Search orders, products, customers... (Ctrl + K)"
              className="w-full pl-10 pr-16 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 group-hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs cursor-pointer"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs group-hover:border-blue-300 group-hover:text-blue-600 transition-colors">
              Ctrl + K
            </kbd>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
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
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {unreadNotifications}
              </span>
            )}
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

          <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1" />

          {/* Store Active Status Toggle Badge */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Store Status:</span>
            <button
              type="button"
              onClick={handleToggleStoreStatus}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                isStoreActive
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isStoreActive ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              <span>{isStoreActive ? 'Active' : 'Inactive'}</span>
            </button>
          </div>

          {/* Seller Profile Pill */}
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
              {currentStore?.logo ? (
                <img
                  src={currentStore.logo}
                  alt={storeName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                avatarInitials
              )}
            </div>
            <div className="text-left hidden lg:block max-w-[120px]">
              <p className="text-xs font-bold text-slate-800 truncate">{storeName}</p>
              <p className="text-[10px] text-slate-400 truncate">Store ID: #{currentStore?._id?.slice(-4) || '1042'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>
        </div>
      </header>

      {/* Confirmation Modal when toggling active store off (1.0a(V1).png) */}
      <StoreInactiveConfirmModal
        isOpen={isInactiveModalOpen}
        onClose={() => setIsInactiveModalOpen(false)}
        onConfirm={() => setStoreActive(false)}
      />

      {/* Drawers & Command Palette */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={onNavigate}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onUnreadCountChange={setUnreadNotifications}
      />

      <HelpSupportDrawer
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onNavigateToSupport={onNavigateToSupport}
      />

      <SellerProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenProfileInfo={() => {
          setIsProfileOpen(false);
          setIsProfileInfoOpen(true);
        }}
        onNavigateToSettings={onNavigateToSettings}
      />

      <ProfileInformationDrawer
        isOpen={isProfileInfoOpen}
        onClose={() => setIsProfileInfoOpen(false)}
        onNavigateToSettings={onNavigateToSettings}
      />
    </>
  );
};
