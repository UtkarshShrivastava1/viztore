'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, ShoppingBag, Calendar, ShoppingBasket, Store, Heart, 
  MapPin, Bell, Ticket, MessageSquare, HeadphonesIcon, Shield, 
  FileText, LogOut
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { useAuthStore } from '@/stores/auth.store';

function MenuLink({ icon, title, href = "#", isActive = false }: { icon: React.ReactNode; title: string; href?: string; isActive?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
        isActive ? 'bg-[#E8F0FE] text-[#1668F6] border-r-2 border-[#1668F6]' : 'hover:bg-surface-50 text-surface-600'
      }`}
    >
      <div className={`${isActive ? 'text-[#1668F6]' : ''}`}>{icon}</div>
      <span className={`text-[13px] ${isActive ? 'font-bold' : 'font-semibold text-[#192168]'}`}>{title}</span>
    </Link>
  );
}

export function AccountSidebar() {
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const pathname = usePathname();

  const formData = {
    fullName: user?.fullName || (isAuthenticated ? 'Customer User' : 'Guest User'),
    mobileNumber: user?.phone
      ? (user.phone.startsWith('+91') ? user.phone : `+91 ${user.phone}`)
      : 'Not Provided',
  };

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <div className="hidden lg:block w-[280px] mt-6 bg-white rounded-xl shadow-sm border border-surface-200/60 shrink-0 overflow-hidden h-fit">
      <div className="p-5 border-b border-surface-100 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#E8F0FE] flex items-center justify-center shrink-0">
          <User className="w-7 h-7 text-[#1668F6]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-bold text-[#192168] truncate">{isAuthenticated ? formData.fullName : 'Guest User'}</h2>
          <p className="text-[12px] font-medium text-surface-600 truncate mt-0.5">{isAuthenticated ? formData.mobileNumber : 'Sign in to access'}</p>
        </div>
      </div>
      <div className="py-2">
        <MenuLink href="/account" icon={<User className="w-4 h-4 text-blue-500" />} title="Profile Information" isActive={pathname === '/account'} />
        <MenuLink href="/account/orders" icon={<ShoppingBag className="w-4 h-4 text-pink-500" />} title="My Orders" isActive={pathname === '/account/orders' || pathname?.startsWith('/account/orders/') && !pathname.includes('reserve') && !pathname.includes('pickup')} />
        <MenuLink href="/account/orders/reserve" icon={<Calendar className="w-4 h-4 text-purple-500" />} title="Reserve Orders" isActive={isActive('/account/orders/reserve')} />
        <MenuLink href="/account/orders/pickup" icon={<ShoppingBasket className="w-4 h-4 text-emerald-500" />} title="Pickup Orders" isActive={isActive('/account/orders/pickup')} />
        <MenuLink href="/account/stores" icon={<Store className="w-4 h-4 text-blue-500" />} title="Favourite Stores" isActive={isActive('/account/stores')} />
        <MenuLink href="/account/wishlist" icon={<Heart className="w-4 h-4 text-rose-500" />} title="Wishlist" isActive={isActive('/account/wishlist')} />
        <MenuLink href="/account/addresses" icon={<MapPin className="w-4 h-4 text-blue-500" />} title="Manage Addresses" isActive={isActive('/account/addresses')} />
        <MenuLink href="/account/notifications" icon={<Bell className="w-4 h-4 text-amber-500" />} title="Notifications" isActive={isActive('/account/notifications')} />
        <MenuLink href="/account/coupons" icon={<Ticket className="w-4 h-4 text-emerald-500" />} title="Coupons & Offers" isActive={isActive('/account/coupons')} />
        
        <Link href="/account/sell" className="flex items-center justify-between px-5 py-2.5 hover:bg-surface-50 transition-colors">
          <div className="flex items-center gap-3">
            <Store className="w-4 h-4 text-blue-500" />
            <span className={`text-[13px] ${isActive('/account/sell') ? 'font-bold' : 'font-semibold text-[#192168]'}`}>Sell on {branding.appName}</span>
          </div>
          <span className="bg-[#1668F6] text-white text-[10px] font-bold px-2 py-0.5 rounded">New</span>
        </Link>

        <MenuLink href="/account/feedback" icon={<MessageSquare className="w-4 h-4 text-amber-500" />} title="Feedback" isActive={isActive('/account/feedback')} />
        <MenuLink href="/account/support" icon={<HeadphonesIcon className="w-4 h-4 text-orange-500" />} title="Help & Support" isActive={isActive('/account/support')} />
        <MenuLink href="/account/privacy" icon={<Shield className="w-4 h-4 text-purple-500" />} title="Privacy Policy" isActive={isActive('/account/privacy')} />
        <MenuLink href="/account/terms" icon={<FileText className="w-4 h-4 text-emerald-500" />} title="Terms & Conditions" isActive={isActive('/account/terms')} />
        
        <div className="mt-2 pt-2 border-t border-surface-100">
          {isAuthenticated ? (
            <Link href="/account/logout" className={`w-full flex items-center gap-3 px-5 py-2.5 hover:bg-rose-50 transition-colors text-left ${isActive('/account/logout') ? 'bg-rose-50' : ''}`}>
              <LogOut className="w-4 h-4 text-rose-500" />
              <span className={`text-[13px] ${isActive('/account/logout') ? 'font-bold text-[#192168]' : 'font-semibold text-[#192168]'}`}>Logout</span>
            </Link>
          ) : (
            <button onClick={() => openAuthModal('login')} className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-blue-50 transition-colors text-left">
              <User className="w-4 h-4 text-[#1668F6]" />
              <span className="text-[13px] font-semibold text-[#1668F6]">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
