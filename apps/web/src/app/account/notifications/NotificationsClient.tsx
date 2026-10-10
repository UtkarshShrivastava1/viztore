'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { 
  Bell, Briefcase, Tag,
  ArrowLeft, Loader2
} from 'lucide-react';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { notificationsApi, type ICustomerNotification } from '@/lib/api/notifications.js';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'order', label: 'Orders' },
  { id: 'promo', label: 'Offers' },
  { id: 'system', label: 'System' },
];

export function NotificationsClient() {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<ICustomerNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMarkingAll, setIsMarkingAll] = useState<boolean>(false);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      if (isAuthenticated) {
        const categoryParam = activeTab === 'all' ? undefined : activeTab;
        const data = await notificationsApi.getNotifications({ category: categoryParam });
        setNotifications(data);
        return;
      }
      setNotifications([]);
    } catch (err) {
      console.warn('Failed to load notifications from API:', err);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [isAuthenticated, activeTab]);

  const handleMarkAllRead = async () => {
    try {
      setIsMarkingAll(true);
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id || n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'order':
        return { icon: <Briefcase className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' };
      case 'promo':
        return { icon: <Tag className="w-5 h-5 text-rose-500" />, bg: 'bg-rose-50' };
      case 'system':
      default:
        return { icon: <Bell className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' };
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 font-sans">
      <main className="max-w-[1680px] mx-auto px-4 lg:px-8 pt-4 pb-6 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ================= DESKTOP LEFT SIDEBAR ================= */}
        <AccountSidebar />

        {/* ================= RIGHT MAIN CONTENT ================= */}
        <div className="flex-1 w-full bg-transparent lg:bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-surface-200/60 lg:p-6 flex flex-col min-h-screen">
          
          {/* Header */}
          <div className="px-0 w-full flex items-start justify-between pb-3 pt-2">
            <div className="flex items-start gap-3">
              <button onClick={() => router.back()} className="shrink-0 lg:hidden mt-0.5">
                <ArrowLeft className="w-6 h-6 text-[#192168]" />
              </button>
              <div>
                <h1 className="text-[20px] lg:text-[28px] font-bold text-[#192168] leading-tight">Notifications</h1>
                <p className="text-[12px] lg:text-[14px] font-medium text-surface-500 mt-0.5">Stay updated with your orders and store announcements.</p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                disabled={isMarkingAll}
                className="text-[12px] font-bold text-[#1668F6] hover:underline shrink-0 pt-1"
              >
                {isMarkingAll ? 'Marking...' : 'Mark all as read'}
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-surface-100 my-2 hide-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#1668F6] text-white shadow-sm'
                    : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="flex-1 mt-3">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-2 text-surface-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#1668F6]" />
                <p className="text-xs font-semibold">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              /* Empty State */
              <div className="border border-dashed border-[#E5E7EB] bg-white rounded-2xl p-8 lg:p-14 text-center flex flex-col items-center justify-center my-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-[#1668F6]" />
                </div>
                <h3 className="text-[16px] lg:text-[18px] font-bold text-[#192168] mb-1">You're All Caught Up!</h3>
                <p className="text-[13px] text-surface-500 max-w-sm mb-6 leading-relaxed">
                  {isAuthenticated 
                    ? "No new notifications right now. We'll alert you here when your order is placed, shipped, or out for delivery."
                    : "Please sign in to view your personalized order and delivery updates."}
                </p>
                {!isAuthenticated && (
                  <button 
                    onClick={() => openAuthModal('login')}
                    className="px-6 py-2.5 bg-[#1668F6] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700 transition"
                  >
                    Sign In
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {notifications.map(item => {
                  const id = item._id || item.id || '';
                  const { icon, bg } = getIconForCategory(item.category);
                  const isUnread = !item.isRead;
                  const formattedTime = item.createdAt 
                    ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Recent';

                  return (
                    <div 
                      key={id}
                      onClick={() => isUnread && handleMarkSingleRead(id)}
                      className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                        isUnread 
                          ? 'bg-[#F8FAFF] border-blue-200 shadow-sm' 
                          : 'bg-white border-surface-200/80 hover:bg-surface-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                        {icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-[13px] lg:text-[14px] font-bold text-[#192168] truncate">
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-surface-400 font-medium shrink-0">
                            {formattedTime}
                          </span>
                        </div>
                        <p className="text-[12px] text-surface-600 mt-1 leading-relaxed">
                          {item.message}
                        </p>
                      </div>

                      {isUnread && (
                        <div className="w-2 h-2 rounded-full bg-[#1668F6] mt-2 shrink-0" title="Unread" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
