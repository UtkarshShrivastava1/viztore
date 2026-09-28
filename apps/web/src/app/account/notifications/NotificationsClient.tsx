'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { 
  User, ShoppingBag, Calendar, ShoppingBasket, Store, Heart, 
  MapPin, Bell, Ticket, HelpCircle, FileText, Shield, LogOut,
  Settings, MoreVertical, Package, Tag, Truck, Heart as HeartIcon, Settings2, Megaphone,
  ArrowLeft,
  ChevronRight,
  Briefcase,
  Star,
  MessageSquare,
  HeadphonesIcon
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { AccountSidebar } from '@/components/account/AccountSidebar';

const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    type: 'orders',
    title: 'Your order has been delivered',
    message: 'Order #VZ785612 has been delivered successfully.',
    time: '10 minutes ago',
    icon: <Briefcase className="w-5 h-5 text-purple-600" />,
    bgClass: 'bg-purple-50',
    unread: true
  },
  {
    id: 2,
    type: 'offers',
    title: 'Special offer just for you!',
    message: 'Get up to 50% OFF on Fashion products. Limited time only!',
    time: '1 hour ago',
    icon: <Tag className="w-5 h-5 text-rose-500" />,
    bgClass: 'bg-rose-50',
    unread: true
  },
  {
    id: 3,
    type: 'updates',
    title: 'Item back in stock',
    message: 'The item in your wishlist "Men White Sneakers" is now back in stock.',
    time: '3 hours ago',
    icon: <HeartIcon className="w-5 h-5 text-rose-500" />,
    bgClass: 'bg-rose-50',
    unread: true
  },
  {
    id: 4,
    type: 'orders',
    title: 'Your order is out for delivery',
    message: 'Order #VZ785612 is out for delivery and will arrive today.',
    time: '5 hours ago',
    icon: <Truck className="w-5 h-5 text-orange-500" />,
    bgClass: 'bg-orange-50',
    unread: false
  },
  {
    id: 5,
    type: 'offers',
    title: 'Flat ₹200 OFF',
    message: 'Use code VZ200 and get flat ₹200 off on your next purchase.',
    time: '1 day ago',
    icon: <Tag className="w-5 h-5 text-emerald-500" />,
    bgClass: 'bg-emerald-50',
    unread: false
  },
  {
    id: 6,
    type: 'updates',
    title: 'Price drop alert',
    message: 'The price of boAt Wave Sigma 3 has dropped to ₹1,599.',
    time: '2 days ago',
    icon: <Bell className="w-5 h-5 text-amber-500" />,
    bgClass: 'bg-amber-50',
    unread: false
  },
  {
    id: 7,
    type: 'updates',
    title: 'New store near you',
    message: 'Tech World is now available near your location.',
    time: '3 days ago',
    icon: <Store className="w-5 h-5 text-blue-500" />,
    bgClass: 'bg-blue-50',
    unread: false
  },
  {
    id: 8,
    type: 'orders',
    title: 'Rate your purchase',
    message: 'How was your experience with Men Casual Shirt? Share your feedback.',
    time: '4 days ago',
    icon: <Star className="w-5 h-5 text-purple-500" />,
    bgClass: 'bg-purple-50',
    unread: false
  },
  {
    id: 9,
    type: 'account',
    title: 'Account security',
    message: 'Your password was updated successfully.',
    time: '5 days ago',
    icon: <Shield className="w-5 h-5 text-blue-500" />,
    bgClass: 'bg-blue-50',
    unread: false
  },
  {
    id: 10,
    type: 'updates',
    title: 'Welcome to Viztore!',
    message: 'Explore local stores, amazing products and exclusive offers.',
    time: '1 week ago',
    icon: <Megaphone className="w-5 h-5 text-emerald-500" />,
    bgClass: 'bg-emerald-50',
    unread: false
  }
];

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'orders', label: 'Orders' },
  { id: 'offers', label: 'Offers' },
  { id: 'account', label: 'Account' },
  { id: 'updates', label: 'Updates' },
];

export function NotificationsClient() {
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const [activeTab, setActiveTab] = useState('all');

  // Leave room for APIs
  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  const formData = {
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    mobileNumber: user?.phone || '',
  };

  const filteredNotifications = activeTab === 'all' 
    ? DUMMY_NOTIFICATIONS 
    : DUMMY_NOTIFICATIONS.filter(n => n.type === activeTab);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 font-sans">
      <main className="max-w-[1680px] mx-auto px-4 lg:px-8 pt-4 pb-6 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ================= DESKTOP LEFT SIDEBAR ================= */}
        <AccountSidebar />

        {/* ================= RIGHT MAIN CONTENT ================= */}
        <div className="flex-1 w-full flex flex-col gap-4 min-h-screen bg-transparent lg:bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-surface-200/60 lg:p-6">
          
          {/* Header */}
          <div className="px-0 w-full pt-2 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <button onClick={() => router.back()} className="mt-1 shrink-0 lg:hidden">
                  <ArrowLeft className="w-6 h-6 text-[#192168]" />
                </button>
                <div>
                  <h1 className="text-[22px] lg:text-[28px] font-extrabold text-[#192168] leading-tight">
                    Notifications
                  </h1>
                  <p className="text-[12px] lg:text-[14px] text-surface-500 mt-1">
                    Stay updated with your orders, offers and more.
                  </p>
                </div>
              </div>
              <button className="text-[13px] font-bold text-[#1668F6] hover:underline self-start mt-2 lg:mt-0 whitespace-nowrap">
                Mark All as Read
              </button>
            </div>
          </div>

          {/* Tabs - Pill Style on Mobile */}
          <div className="bg-[#F8FAFF] border border-[#E5E7EB] rounded-xl p-1.5 flex items-center justify-between overflow-x-auto no-scrollbar gap-1 mt-2 mb-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 lg:px-6 py-2 text-[13px] font-bold rounded-lg transition-colors whitespace-nowrap flex-1 text-center ${
                  activeTab === tab.id 
                    ? 'bg-[#E8F0FE] text-[#1668F6]' 
                    : 'bg-transparent text-[#192168] hover:bg-surface-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="flex flex-col gap-3 lg:gap-4">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className="bg-white rounded-[14px] border border-surface-200/80 p-4 lg:p-5 flex items-start gap-4 hover:shadow-sm transition-shadow relative cursor-pointer"
              >
                {/* Icon Container */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notification.bgClass}`}>
                  {notification.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-8">
                  <h4 className="text-[14px] lg:text-[15px] font-bold text-[#192168] mb-0.5 pr-2 truncate">
                    {notification.title}
                  </h4>
                  <p className="text-[12px] lg:text-[13px] text-surface-600 line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <span className="text-[11px] lg:text-[12px] font-medium text-surface-400 mt-1.5 block">
                    {notification.time}
                  </span>
                </div>

                {/* Right Arrow & Unread Dot */}
                <div className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center gap-3">
                  {notification.unread && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1668F6]"></div>
                  )}
                  <ChevronRight className="w-5 h-5 text-surface-400" />
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="p-12 text-center bg-white rounded-[14px] border border-surface-200/80 mt-4">
                <Bell className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                <h3 className="text-[16px] font-bold text-[#192168]">No Notifications</h3>
                <p className="text-[14px] text-surface-500 mt-1">You're all caught up!</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

function MenuLink({ icon, title, href = "#", isActive = false }: { icon: React.ReactNode, title: string, href?: string, isActive?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
        isActive 
          ? 'bg-[#E8F0FE] text-[#1668F6] border-r-2 border-[#1668F6]' 
          : 'hover:bg-surface-50 text-surface-600'
      }`}
    >
      <div className={`${isActive ? 'text-[#1668F6]' : ''}`}>
        {icon}
      </div>
      <span className={`text-[13px] ${isActive ? 'font-bold' : 'font-semibold text-[#192168]'}`}>
        {title}
      </span>
    </Link>
  );
}
