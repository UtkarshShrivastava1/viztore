import React, { useEffect, useState } from 'react';
import { Bell, X, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore.js';
import { useOrderStore } from '../../stores/orderStore.js';
import { merchantSocket, OrderPlacedSocketPayload } from '../../lib/socket.js';
import { isAudioAlertMuted, toggleAudioAlertMuted, playOrderAlertChime } from '../../lib/audioAlert.js';

interface LiveOrderSocketListenerProps {
  onNavigateToOrder?: (orderId?: string) => void;
}

export const LiveOrderSocketListener: React.FC<LiveOrderSocketListenerProps> = ({
  onNavigateToOrder,
}) => {
  const { currentStore, isAuthenticated } = useAuthStore();
  const { setActiveTab } = useOrderStore();

  const [activeAlert, setActiveAlert] = useState<OrderPlacedSocketPayload | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(isAudioAlertMuted());

  useEffect(() => {
    if (!isAuthenticated) return;

    const storeId = currentStore?._id || currentStore?.id;
    merchantSocket.connect(storeId);

    const unsubscribe = merchantSocket.onOrderPlaced((order) => {
      setActiveAlert(order);
    });

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, currentStore]);

  // Sync store ID if currentStore changes
  useEffect(() => {
    const storeId = currentStore?._id || currentStore?.id;
    if (storeId) {
      merchantSocket.setStoreId(storeId);
    }
  }, [currentStore]);

  // Auto-dismiss alert toast after 10 seconds
  useEffect(() => {
    if (!activeAlert) return;
    const timer = setTimeout(() => {
      setActiveAlert(null);
    }, 10000);
    return () => clearTimeout(timer);
  }, [activeAlert]);

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = toggleAudioAlertMuted();
    setIsMuted(next);
    if (!next) {
      playOrderAlertChime();
    }
  };

  const handleViewOrder = () => {
    setActiveTab('new_orders');
    setActiveAlert(null);
    if (onNavigateToOrder) {
      onNavigateToOrder(activeAlert?.orderId);
    }
  };

  if (!activeAlert) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300">
      <div className="p-4 rounded-2xl bg-white border-2 border-amber-500/80 shadow-xl shadow-amber-900/10 flex flex-col gap-2.5 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center animate-bounce shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 tracking-tight">NEW ORDER RECEIVED!</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300/60">
                  Just now
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {activeAlert.orderNumber} • ₹{activeAlert.grandTotal?.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isMuted
                  ? 'border-slate-200 text-slate-400 hover:bg-slate-50'
                  : 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100'
              }`}
              title={isMuted ? 'Audio chime muted (Click to unmute)' : 'Audio chime active'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setActiveAlert(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="text-slate-600 font-medium">
            {activeAlert.itemsCount || 1} item{(activeAlert.itemsCount || 1) > 1 ? 's' : ''} to prepare
          </span>
          <button
            type="button"
            onClick={handleViewOrder}
            className="px-3 py-1.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <span>View Order</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
