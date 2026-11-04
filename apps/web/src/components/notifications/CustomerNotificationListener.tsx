'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notificationStore';
import { customerSocket } from '@/lib/socket';
import { CheckCircle2, Truck, Package, X, ArrowRight, Sparkles } from 'lucide-react';

interface ActiveToast {
  id: string;
  title: string;
  message: string;
  category?: 'order' | 'promo' | 'system' | 'inventory';
  targetUrl?: string;
  orderId?: string;
}

export function CustomerNotificationListener() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { addLiveNotification, fetchUnreadSummary, fetchNotifications } = useNotificationStore();
  const [toast, setToast] = useState<ActiveToast | null>(null);

  const userId = user?._id || (user as any)?.id;

  // 1. Establish real-time WebSocket connection to customer's personal user room
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      customerSocket.disconnect();
      return;
    }

    customerSocket.connect(userId);

    // Initial sync
    fetchUnreadSummary().catch(() => {});
    fetchNotifications().catch(() => {});

    // Listen to backend notification.created domain event
    const unsubscribeNotif = customerSocket.onNotification((payload) => {
      addLiveNotification({
        id: payload.notificationId,
        category: payload.category,
        title: payload.title,
        description: payload.message,
        orderId: (payload.data?.orderNumber as string) || (payload.data?.orderId as string),
        createdAt: payload.createdAt,
      });

      const orderRef = (payload.data?.orderId as string) || (payload.data?.orderNumber as string);
      setToast({
        id: payload.notificationId || `toast_${Date.now()}`,
        title: payload.title,
        message: payload.message,
        category: payload.category,
        orderId: orderRef,
        targetUrl: orderRef ? `/account/orders/${orderRef}` : '/account/notifications',
      });
    });

    // Listen to direct order state change events
    const unsubscribeOrder = customerSocket.onOrderUpdate(() => {
      fetchUnreadSummary().catch(() => {});
      fetchNotifications().catch(() => {});
    });

    return () => {
      unsubscribeNotif();
      unsubscribeOrder();
    };
  }, [isAuthenticated, userId, addLiveNotification, fetchUnreadSummary, fetchNotifications]);

  // 2. Resilient periodic polling fallback every 35s when window is focused
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchUnreadSummary().catch(() => {});
      }
    }, 35000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadSummary]);

  // 3. Auto-dismiss floating toast banner after 6.5 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 6500);

    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const getToastIcon = () => {
    if (toast.title.toLowerCase().includes('delivered')) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
    if (toast.title.toLowerCase().includes('delivery') || toast.title.toLowerCase().includes('rider') || toast.title.toLowerCase().includes('way')) {
      return <Truck className="w-5 h-5 text-blue-600" />;
    }
    if (toast.title.toLowerCase().includes('order') || toast.title.toLowerCase().includes('placed') || toast.title.toLowerCase().includes('confirmed')) {
      return <Package className="w-5 h-5 text-purple-600" />;
    }
    return <Sparkles className="w-5 h-5 text-amber-500" />;
  };

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-[9999] max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 p-4 flex gap-3 items-start relative ring-1 ring-black/5 hover:shadow-3xl transition-all">
        {/* Pulsing Alert Icon */}
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          {getToastIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">
              {toast.title}
            </h4>
          </div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {toast.message}
          </p>

          {/* Action Link */}
          {toast.targetUrl && (
            <button
              type="button"
              onClick={() => {
                const url = toast.targetUrl;
                setToast(null);
                if (url) router.push(url);
              }}
              className="mt-2 text-xs font-bold text-[#1668F6] hover:text-[#0e4ec2] flex items-center gap-1 group transition-colors"
            >
              <span>{toast.orderId ? 'Track Order Live' : 'View Details'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => setToast(null)}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
