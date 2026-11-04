'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Package, Tag, Truck, CheckCircle2, ArrowRight, 
  Bell, CheckCheck, Trash2, Sparkles, AlertCircle 
} from 'lucide-react';
import { useNotificationStore, type INotificationItem } from '@/stores/notificationStore';
import { useAuthStore } from '@/stores/auth.store';

export function NotificationsDropdown({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { 
    notifications, 
    unreadCount, 
    isLoading,
    fetchNotifications, 
    fetchUnreadSummary, 
    markAsRead, 
    markAllAsRead, 
    clearAll 
  } = useNotificationStore();

  const [activeTab, setActiveTab] = useState<'all' | 'order' | 'promo'>('all');

  // Fetch fresh notifications whenever the dropdown is opened
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadSummary().catch(() => {});
      fetchNotifications().catch(() => {});
    }
  }, [isAuthenticated, fetchUnreadSummary, fetchNotifications]);

  const handleItemClick = (notification: INotificationItem) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    onClose();
    if (notification.targetUrl) {
      router.push(notification.targetUrl);
    } else if (notification.orderId) {
      router.push(`/account/orders/${notification.orderId}`);
    }
  };

  const getNotificationIcon = (item: INotificationItem) => {
    const titleLower = item.title.toLowerCase();
    if (titleLower.includes('delivered')) {
      return (
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      );
    }
    if (titleLower.includes('out for delivery') || titleLower.includes('rider') || titleLower.includes('shipped') || titleLower.includes('way')) {
      return (
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
          <Truck className="w-4 h-4" />
        </div>
      );
    }
    if (item.category === 'order' || item.type === 'order_update') {
      return (
        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
          <Package className="w-4 h-4" />
        </div>
      );
    }
    if (item.category === 'promo' || item.type === 'offer') {
      return (
        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
          <Tag className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100">
        <Bell className="w-4 h-4" />
      </div>
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'order') return n.category === 'order' || n.type === 'order_update';
    if (activeTab === 'promo') return n.category === 'promo' || n.type === 'offer';
    return true;
  });

  return (
    <div className="absolute right-0 top-14 w-96 rounded-2xl bg-white shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col max-h-[620px] animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-base text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllAsRead()}
              className="text-xs font-bold text-[#1668F6] hover:text-[#0e4ec2] transition flex items-center gap-1 hover:underline"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={() => clearAll()}
              className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition"
              title="Clear list"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-100 px-3 bg-white">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 py-2 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('order')}
          className={`px-3 py-2 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'order'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Orders
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('promo')}
          className={`px-3 py-2 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'promo'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Offers
        </button>
      </div>

      {/* Body */}
      {!isAuthenticated ? (
        <div className="py-12 flex flex-col items-center justify-center text-center px-6">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#1668F6] mb-3 border border-blue-100">
            <Bell className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-900 mb-1">Sign in to view alerts</p>
          <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed mb-4">
            Track order status updates, delivery partner arrival, and exclusive local discounts.
          </p>
          <button
            type="button"
            onClick={() => {
              onClose();
              openAuthModal('login');
            }}
            className="px-4 py-2 rounded-xl bg-[#1668F6] hover:bg-[#0f4bba] text-white text-xs font-bold transition shadow-sm"
          >
            Sign In Now
          </button>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center px-6">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
            <Bell className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-900 mb-1">No notifications yet</p>
          <p className="text-xs text-slate-500 max-w-[250px] leading-relaxed mb-3">
            We will alert you here with real-time updates as soon as your order is confirmed, assigned, or out for delivery.
          </p>
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push('/stores');
            }}
            className="text-xs font-bold text-[#1668F6] hover:underline flex items-center gap-1"
          >
            Explore nearby stores <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleItemClick(notification)}
              className={`p-3.5 hover:bg-slate-50/80 transition flex gap-3 cursor-pointer relative ${
                !notification.isRead ? 'bg-blue-50/40' : 'bg-white'
              }`}
            >
              {/* Dynamic Icon */}
              {getNotificationIcon(notification)}

              {/* Text content */}
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4
                    className={`text-xs truncate leading-tight ${
                      !notification.isRead
                        ? 'font-extrabold text-slate-900'
                        : 'font-semibold text-slate-700'
                    }`}
                  >
                    {notification.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">
                    {notification.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {notification.description}
                </p>

                {notification.orderId && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      #{notification.orderId.replace(/^#/, '')}
                    </span>
                    <span className="text-[10px] font-bold text-[#1668F6] flex items-center gap-0.5">
                      Track <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                )}
              </div>

              {/* Unread indicator dot */}
              {!notification.isRead && (
                <div className="absolute right-3.5 top-4 flex items-center gap-1.5">
                  <span className="text-[9px] font-black text-red-600 tracking-wider uppercase">New</span>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-80" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {isAuthenticated && (
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 text-center">
          <Link
            href="/account/notifications"
            onClick={onClose}
            className="text-xs font-bold text-[#1668F6] hover:text-[#0e4ec2] inline-flex items-center gap-1 transition"
          >
            View All Notifications <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
