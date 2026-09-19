'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Smartphone, Percent, Truck, Store, Star, ArrowRight, Bell } from 'lucide-react';
import { useNotificationStore, INotificationItem } from '@/stores/notificationStore';

const dummyNotifications: INotificationItem[] = [
  {
    id: '1',
    type: 'price_drop',
    title: 'Price Drop Alert!',
    description: 'iPhone 15 is now ₹6,000 cheaper at Mobile World.',
    timestamp: '5 min ago',
    isRead: false,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: '2',
    type: 'offer',
    title: 'Special Offer',
    description: 'Flat 20% OFF on Home & Living products. Limited time only!',
    timestamp: '1 hour ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'order_update',
    title: 'Order Shipped',
    description: 'Your order #ORD-125680 has been shipped and is on the way.',
    timestamp: '3 hours ago',
    isRead: false,
    orderId: '#ORD-125680',
  },
  {
    id: '4',
    type: 'new_store',
    title: 'New Store Nearby',
    description: 'A new electronics store is now available near you in your neighborhood.',
    timestamp: '5 hours ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'review',
    title: 'Review Reminder',
    description: 'How was your recent purchase? Share your review and help others.',
    timestamp: '1 day ago',
    isRead: true,
  },
];

export function NotificationsDropdown({ onClose }: { onClose: () => void }) {
  const { notifications, setNotifications } = useNotificationStore();

  useEffect(() => {
    // Populate with dummy data if empty for demo purposes
    if (notifications.length === 0) {
      setNotifications(dummyNotifications);
    }
  }, [notifications.length, setNotifications]);

  const displayNotifications = notifications.length > 0 ? notifications : dummyNotifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'price_drop':
        return <Smartphone className="w-5 h-5 text-gray-700" />;
      case 'offer':
        return <Percent className="w-5 h-5 text-white" />;
      case 'order_update':
        return <Truck className="w-5 h-5 text-white" />;
      case 'new_store':
        return <Store className="w-5 h-5 text-white" />;
      case 'review':
        return <Star className="w-5 h-5 text-white" />;
      default:
        return <Bell className="w-5 h-5 text-white" />;
    }
  };

  const getIconContainerClass = (type: string) => {
    switch (type) {
      case 'price_drop':
        return 'bg-gray-100';
      case 'offer':
        return 'bg-red-500';
      case 'order_update':
        return 'bg-blue-500';
      case 'new_store':
        return 'bg-blue-500';
      case 'review':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="absolute right-0 top-14 w-96 rounded-2xl bg-white shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col max-h-[600px]">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-lg text-gray-900">Notifications</h3>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {displayNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-4 cursor-pointer relative ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
          >
            {/* Unread indicator */}
            {!notification.isRead && (
              <div className="absolute right-4 top-4 w-2 h-2 rounded-full bg-blue-600" />
            )}
            
            {/* Icon / Image */}
            <div className="shrink-0">
              {notification.imageUrl ? (
                <img 
                  src={notification.imageUrl} 
                  alt={notification.title}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                />
              ) : (
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconContainerClass(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 pr-4">
              <h4 className="font-semibold text-sm text-gray-900 mb-1">{notification.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2 leading-snug mb-1">
                {notification.description}
              </p>
              <span className="text-xs text-gray-400">{notification.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-gray-100 bg-gray-50/50">
        <Link 
          href="/account/notifications" 
          className="flex items-center justify-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors py-2"
          onClick={onClose}
        >
          View All Notifications <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
