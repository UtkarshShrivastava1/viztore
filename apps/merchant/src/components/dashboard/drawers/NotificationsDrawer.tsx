import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Boxes,
  ClipboardCheck,
  ShieldCheck,
  Truck,
  RotateCcw,
  Store,
  ArrowRight,
  Bell,
} from 'lucide-react';
import { branding } from '@repo/shared-types/branding.config';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export type NotificationCategory = 'all' | 'orders' | 'inventory' | 'system';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  description: React.ReactNode;
  time: string;
  isUnread: boolean;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const initialNotifications: NotificationItem[] = [];

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onUnreadCountChange,
}) => {
  const [activeTab, setActiveTab] = useState<NotificationCategory>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  if (!isOpen) return null;

  const filtered =
    activeTab === 'all'
      ? notifications
      : notifications.filter((n) => n.category === activeTab);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    onUnreadCountChange?.(0);
  };

  const tabs: { id: NotificationCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'orders', label: 'Orders', count: notifications.filter((n) => n.category === 'orders').length },
    { id: 'inventory', label: 'Inventory', count: notifications.filter((n) => n.category === 'inventory').length },
    { id: 'system', label: 'System', count: notifications.filter((n) => n.category === 'system').length },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="relative w-full max-w-[420px] bg-white text-slate-800 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Notifications</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Mark all as read
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Underline Tabs */}
        <div className="flex items-center gap-6 px-5 pt-3 border-b border-slate-200 text-xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 pb-2.5 font-medium transition-all relative ${
                  isActive
                    ? 'text-blue-600 font-bold border-b-2 border-blue-600 -mb-px'
                    : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent -mb-px'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-700">No notifications</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                You're all caught up! New alerts and order updates will appear here.
              </p>
            </div>
          ) : (
            filtered.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className="p-4 flex items-start gap-3 hover:bg-slate-50/80 transition-colors relative group cursor-pointer"
              >
                {/* Icon Tile */}
                <div
                  className={`w-9 h-9 rounded-xl ${n.iconBg} ${n.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-3">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{n.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.description}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block font-medium">{n.time}</span>
                </div>

                {/* Blue Unread Dot */}
                {n.isUnread && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                )}
              </div>
            );
          }))}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View all notifications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
