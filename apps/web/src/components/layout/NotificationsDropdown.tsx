'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Percent, Truck, Store, Star, ArrowRight, Bell } from 'lucide-react';
import { useNotificationStore } from '@/stores/notificationStore';

export function NotificationsDropdown({ onClose }: { onClose: () => void }) {
  const { notifications } = useNotificationStore();

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
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-900">Notifications</h3>
        {notifications.length > 0 && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
            {notifications.filter((n) => !n.isRead).length} new
          </span>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center px-6">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#1668F6] mb-3 border border-blue-100">
            <Bell className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-900 mb-1">No notifications yet</p>
          <p className="text-xs text-gray-500 max-w-[260px] leading-relaxed">
            We will alert you here about your order status changes, price drops, and exclusive local offers.
          </p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1">
          {notifications.map((notification) => (
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
      )}
      
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
