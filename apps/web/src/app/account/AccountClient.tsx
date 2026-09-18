'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Settings, 
  ChevronRight, 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  RotateCcw,
  Calendar,
  ShoppingBasket,
  MapPin,
  Heart,
  Ticket,
  Store,
  MessageSquare,
  HeadphonesIcon,
  Shield,
  FileText,
  LogOut,
  User,
  Star
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { useAuthStore } from '@/stores/auth.store';

const mockStores = [
  {
    id: 1,
    name: 'Fashion Hub',
    category: 'Clothing, Accessories',
    rating: 4.5,
    reviews: '1.2K',
    bgColor: 'bg-black',
    textColor: 'text-white'
  },
  {
    id: 2,
    name: 'Tech World',
    category: 'Electronics',
    rating: 4.3,
    reviews: '856',
    bgColor: 'bg-[#1e4620]',
    textColor: 'text-[#ffc107]'
  },
  {
    id: 3,
    name: 'Home Delight',
    category: 'Home & Kitchen',
    rating: 4.6,
    reviews: '1.1K',
    bgColor: 'bg-[#6b1e22]',
    textColor: 'text-white'
  },
  {
    id: 4,
    name: 'Beauty Glow',
    category: 'Beauty & Personal Care',
    rating: 4.2,
    reviews: '732',
    bgColor: 'bg-[#ffc1cc]',
    textColor: 'text-[#e91e63]'
  }
];

export function AccountClient() {
  const { user, isAuthenticated, openAuthModal } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#f4f5f9] pb-24 relative">
      {/* Background Gradient matching header */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />

      <main className="max-w-md lg:max-w-5xl mx-auto px-4 pt-6 pb-6 relative z-10 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#1668F6]">My Account</h1>
            <p className="text-[12px] font-medium text-surface-500 mt-0.5">Manage your profile, orders and preferences</p>
          </div>
          <button className="p-2 text-surface-600">
            <Settings className="w-5 h-5 text-[#192168]" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start">
          {/* Left Column (Desktop) */}
          <div className="w-full lg:w-[320px] flex flex-col gap-4 shrink-0">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-surface-200/50">
              <div className="w-16 h-16 rounded-full bg-[#E8F0FE] flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-[#1668F6]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-[16px] font-bold text-[#192168] truncate">
                  {isAuthenticated ? (user?.fullName || 'Customer') : 'Guest User'}
                </h2>
                <p className="text-[11px] font-semibold text-surface-600 truncate mt-0.5">
                  {isAuthenticated ? (user?.phone || user?.email || 'Active Account') : 'Sign in to access your orders & profile'}
                </p>
                {isAuthenticated && user?.email && user?.phone && (
                  <p className="text-[11px] text-surface-500 truncate mt-0.5">{user.email}</p>
                )}
              </div>
              {isAuthenticated ? (
                <Link href="/account/edit-profile" className="flex items-center gap-1 text-[10px] font-bold text-[#1668F6] shrink-0">
                  Edit Profile <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 bg-[#1668F6] text-white text-[11px] font-bold rounded-lg hover:bg-blue-700 transition shrink-0 shadow-sm"
                >
                  Sign In
                </button>
              )}
            </div>

          {/* Menu Options (Moved to left column on desktop) */}
          <div className="bg-white rounded-2xl shadow-sm border border-surface-200/50 overflow-hidden hidden lg:block">
            <MenuLink href="/account/addresses" icon={<MapPin className="w-4 h-4 text-[#1668F6]" />} title="My Addresses" subtitle="Manage your saved addresses" />
            <MenuLink href="/account/wishlist" icon={<Heart className="w-4 h-4 text-rose-500" />} title="Wishlist" subtitle="View your favourite items" />
            <MenuLink href="/account/coupons" icon={<Ticket className="w-4 h-4 text-emerald-500" />} title="Coupons & Offers" subtitle="View available offers and discounts" />
            
            <Link href="/account/sell" className="flex items-center justify-between p-3.5 hover:bg-surface-50 transition-colors border-b border-surface-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E8F0FE] flex items-center justify-center">
                  <Store className="w-4 h-4 text-[#1668F6]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-[#192168]">Sell on {branding.appName}</span>
                    <span className="bg-[#1668F6] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">New</span>
                  </div>
                  <span className="text-[10px] font-medium text-surface-500 leading-tight block">Start selling and grow your business</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-surface-400" />
            </Link>

            <MenuLink href="/account/feedback" icon={<MessageSquare className="w-4 h-4 text-[#f59e0b]" />} title="Feedback" subtitle="Share your feedback with us" />
            <MenuLink href="/account/support" icon={<HeadphonesIcon className="w-4 h-4 text-[#f97316]" />} title="Help & Support" subtitle="Get help or raise a ticket" />
            <MenuLink href="/account/privacy" icon={<Shield className="w-4 h-4 text-[#1668F6]" />} title="Privacy Policy" subtitle="Read our privacy policy" />
            <MenuLink href="/account/terms" icon={<FileText className="w-4 h-4 text-[#22c55e]" />} title="Terms & Conditions" subtitle="Read our terms and conditions" />
            
            {isAuthenticated ? (
              <Link href="/account/logout" className="flex items-center justify-between p-3.5 hover:bg-surface-50 transition-colors border-b border-surface-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <span className="text-[12px] font-bold text-[#192168] block">Logout</span>
                    <span className="text-[10px] font-medium text-surface-500 leading-tight block">Logout from your account</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-surface-400" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="w-full flex items-center justify-between p-3.5 hover:bg-surface-50 transition-colors border-b border-surface-100 last:border-0 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#1668F6]" />
                  </div>
                  <div>
                    <span className="text-[12px] font-bold text-[#1668F6] block">Sign In / Register</span>
                    <span className="text-[10px] font-medium text-surface-500 leading-tight block">Access your account or create one</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-surface-400" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column (Desktop) */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          {/* My Orders */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-surface-200/50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-[#192168]">My Orders</h3>
            <Link href="/account/orders" className="flex items-center gap-1 text-[10px] font-bold text-[#1668F6] hover:opacity-80 transition-opacity">
              View All Orders <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <Link href="/account/orders" className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-[#f6f2fe] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-[#8b5cf6]" />
              </div>
              <span className="text-[14px] font-bold text-[#192168]">2</span>
              <span className="text-[9px] font-medium text-surface-500 text-center leading-tight">All Orders</span>
            </Link>
            <Link href="/account/orders" className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-[#fef5ec] flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#f97316]" />
              </div>
              <span className="text-[14px] font-bold text-[#192168]">1</span>
              <span className="text-[9px] font-medium text-surface-500 text-center leading-tight">To Be Delivered</span>
            </Link>
            <Link href="/account/orders" className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-[#ecfdf3] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
              </div>
              <span className="text-[14px] font-bold text-[#192168]">3</span>
              <span className="text-[9px] font-medium text-surface-500 text-center leading-tight">Delivered</span>
            </Link>
            <Link href="/account/orders" className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-[#fef2f2] flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-[#ef4444]" />
              </div>
              <span className="text-[14px] font-bold text-[#192168]">0</span>
              <span className="text-[9px] font-medium text-surface-500 text-center leading-tight">Returns</span>
            </Link>
          </div>
        </div>

        {/* Order Types */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/account/orders" className="bg-white rounded-2xl p-3 flex items-center justify-between shadow-sm border border-surface-200/50 hover:bg-surface-50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#f6f2fe] flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-[#8b5cf6]" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-[#192168]">Reserve Orders</h4>
                <p className="text-[9px] font-medium text-surface-500 mt-0.5 leading-tight">View your reserved items</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-surface-400" />
          </Link>
          <Link href="/account/orders" className="bg-white rounded-2xl p-3 flex items-center justify-between shadow-sm border border-surface-200/50 hover:bg-surface-50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#ecfdf3] flex items-center justify-center flex-shrink-0">
                <ShoppingBasket className="w-4 h-4 text-[#22c55e]" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-[#192168]">Pickup Orders</h4>
                <p className="text-[9px] font-medium text-surface-500 mt-0.5 leading-tight">View items to be picked up</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-surface-400" />
          </Link>
        </div>

        {/* Favourite Stores */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[14px] font-bold text-[#192168]">Favourite Stores</h3>
            <button className="text-[10px] font-bold text-[#1668F6]">
              View All Stores
            </button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {mockStores.map((store) => (
              <div key={store.id} className="w-[110px] flex-shrink-0 bg-white rounded-2xl p-3 shadow-sm border border-surface-200/50 flex flex-col items-center relative">
                <button className="absolute top-2 right-2 text-[#192168]">
                   <Heart className="w-3.5 h-3.5" />
                </button>
                <div className={`w-[52px] h-[52px] rounded-full ${store.bgColor} flex items-center justify-center mb-2.5`}>
                  {store.name.includes('Tech') ? (
                    <div className="flex flex-col items-center">
                      <span className={`text-[10px] font-extrabold ${store.textColor} leading-tight`}>Tech</span>
                      <span className={`text-[10px] font-extrabold ${store.textColor} leading-tight`}>World</span>
                    </div>
                  ) : store.name.includes('Home') ? (
                    <div className="flex flex-col items-center">
                      <Store className="w-4 h-4 text-white mb-0.5" />
                      <span className="text-[7px] text-white">Home Delight</span>
                    </div>
                  ) : store.name.includes('Beauty') ? (
                     <div className="flex flex-col items-center">
                      <span className={`text-[10px] font-extrabold ${store.textColor} leading-tight`}>Beauty</span>
                      <span className={`text-[10px] font-extrabold ${store.textColor} leading-tight`}>Glow</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center px-1">
                      <span className={`text-[10px] font-extrabold ${store.textColor} leading-tight`}>
                        {store.name.split(' ')[0]}<br/>{store.name.split(' ')[1]}
                      </span>
                    </div>
                  )}
                </div>
                <h4 className="text-[11px] font-bold text-[#192168] text-center line-clamp-1">{store.name}</h4>
                <p className="text-[8px] font-medium text-surface-500 mt-0.5 text-center line-clamp-1 leading-tight px-1">{store.category}</p>
                <div className="flex items-center gap-0.5 mt-1.5">
                  <Star className="w-2.5 h-2.5 text-[#06B95F] fill-[#06B95F]" />
                  <span className="text-[9px] font-bold text-[#06B95F]">{store.rating}</span>
                  <span className="text-[8px] font-medium text-surface-500">({store.reviews})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Options (Mobile Only) */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200/50 overflow-hidden lg:hidden">
          <MenuLink href="/account/addresses" icon={<MapPin className="w-4 h-4 text-[#1668F6]" />} title="My Addresses" subtitle="Manage your saved addresses" />
          <MenuLink href="/account/wishlist" icon={<Heart className="w-4 h-4 text-rose-500" />} title="Wishlist" subtitle="View your favourite items" />
          <MenuLink href="/account/coupons" icon={<Ticket className="w-4 h-4 text-emerald-500" />} title="Coupons & Offers" subtitle="View available offers and discounts" />
          
          <Link href="/account/sell" className="flex items-center justify-between p-3.5 hover:bg-surface-50 transition-colors border-b border-surface-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E8F0FE] flex items-center justify-center">
                <Store className="w-4 h-4 text-[#1668F6]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-[#192168]">Sell on {branding.appName}</span>
                  <span className="bg-[#1668F6] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">New</span>
                </div>
                <span className="text-[10px] font-medium text-surface-500 leading-tight block">Start selling and grow your business</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-surface-400" />
          </Link>

          <MenuLink href="/account/feedback" icon={<MessageSquare className="w-4 h-4 text-[#f59e0b]" />} title="Feedback" subtitle="Share your feedback with us" />
          <MenuLink href="/account/support" icon={<HeadphonesIcon className="w-4 h-4 text-[#f97316]" />} title="Help & Support" subtitle="Get help or raise a ticket" />
          <MenuLink href="/account/privacy" icon={<Shield className="w-4 h-4 text-[#1668F6]" />} title="Privacy Policy" subtitle="Read our privacy policy" />
          <MenuLink href="/account/terms" icon={<FileText className="w-4 h-4 text-[#22c55e]" />} title="Terms & Conditions" subtitle="Read our terms and conditions" />
          
          {isAuthenticated ? (
            <Link href="/account/logout" className="flex items-center justify-between p-3.5 hover:bg-surface-50 transition-colors border-b border-surface-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <span className="text-[12px] font-bold text-[#192168] block">Logout</span>
                  <span className="text-[10px] font-medium text-surface-500 leading-tight block">Logout from your account</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-surface-400" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-surface-50 transition-colors border-b border-surface-100 last:border-0 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <User className="w-4 h-4 text-[#1668F6]" />
                </div>
                <div>
                  <span className="text-[12px] font-bold text-[#1668F6] block">Sign In / Register</span>
                  <span className="text-[10px] font-medium text-surface-500 leading-tight block">Access your account or create one</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-surface-400" />
            </button>
          )}
        </div>

        </div> {/* Close right column */}
        </div> {/* Close split layout */}

      </main>
    </div>
  );
}

function MenuLink({ icon, title, subtitle, href = "#" }: { icon: React.ReactNode, title: string, subtitle: string, href?: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-3.5 hover:bg-surface-50 transition-colors border-b border-surface-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#E8F0FE] flex items-center justify-center">
          {icon}
        </div>
        <div>
          <span className="text-[12px] font-bold text-[#192168] block">{title}</span>
          <span className="text-[10px] font-medium text-surface-500 leading-tight block">{subtitle}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-surface-400" />
    </Link>
  );
}
