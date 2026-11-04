import React, { useState } from 'react';
import { ChevronRight, ArrowRight, Volume2, VolumeX, Sparkles, Printer, Clock, Truck, CheckCircle2, PackageCheck } from 'lucide-react';
import { printMerchantInvoice } from '../../lib/printInvoice.js';
import { useOrderStore } from '../../stores/orderStore.js';
import { playOrderAlertChime, isAudioAlertMuted, toggleAudioAlertMuted } from '../../lib/audioAlert.js';
import { merchantSocket } from '../../lib/socket.js';

interface LiveOrderAlertsProps {
  onNavigateOrders?: () => void;
}

export const LiveOrderAlerts: React.FC<LiveOrderAlertsProps> = ({ onNavigateOrders }) => {
  const { orders } = useOrderStore();
  const recentOrders = orders.slice(0, 5);
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;

  const [isMuted, setIsMuted] = useState<boolean>(isAudioAlertMuted());
  const [isPlayingTest, setIsPlayingTest] = useState<boolean>(false);

  const handleToggleMute = () => {
    const next = toggleAudioAlertMuted();
    setIsMuted(next);
    if (!next) {
      playOrderAlertChime();
    }
  };

  const handleTestChime = () => {
    setIsPlayingTest(true);
    merchantSocket.triggerTestArrival();
    setTimeout(() => setIsPlayingTest(false), 1400);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>Delivered</span>
          </span>
        );
      case 'shipped':
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 uppercase">
            <Truck className="w-2.5 h-2.5" />
            <span>Shipped</span>
          </span>
        );
      case 'ready_to_ship':
      case 'packed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 uppercase">
            <PackageCheck className="w-2.5 h-2.5" />
            <span>Packed</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/80 uppercase">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>Confirmed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 uppercase">
            <Clock className="w-2.5 h-2.5" />
            <span>{status.replace('_', ' ')}</span>
          </span>
        );
    }
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-full">
      <div>
        {/* Header with Live Status, Sound Controls & 3D Basket Graphic */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
              <span className="text-xs">🔥</span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
                <span>Incoming Orders</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">Real-time local fulfillment</span>
            </div>

            <span className="ml-1 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
              <span>{newOrdersCount} New</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Alert Controls */}
            <button
              type="button"
              onClick={handleTestChime}
              disabled={isPlayingTest}
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[10px] font-bold transition-all cursor-pointer shadow-2xs ${
                isPlayingTest
                  ? 'border-amber-400 bg-amber-50 text-amber-800 ring-2 ring-amber-400/20'
                  : 'border-slate-200 hover:border-amber-300 bg-slate-50 hover:bg-amber-50/60 text-slate-700'
              }`}
              title="Test real-time incoming order sound"
            >
              <Sparkles className={`w-3 h-3 ${isPlayingTest ? 'text-amber-600 animate-spin' : 'text-amber-500'}`} />
              <span>{isPlayingTest ? 'Playing...' : 'Test Sound'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                isMuted
                  ? 'border-slate-200 text-slate-400 hover:bg-slate-50'
                  : 'border-blue-200 text-blue-600 bg-blue-50/50 hover:bg-blue-100/60 shadow-2xs'
              }`}
              title={isMuted ? 'Order sound muted (Click to unmute)' : 'Order sound active (Click to mute)'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Orders Table */}
        {recentOrders.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800 mb-0.5">No Incoming Orders Yet</p>
            <p className="text-[11px] text-slate-400 max-w-xs">New customer orders placed within your 3–4 km delivery radius will appear here instantly.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {/* Table Header */}
            <div className="grid grid-cols-[22%_24%_14%_18%_22%] items-center text-[10px] font-bold uppercase tracking-wider text-slate-400 py-2 px-1 border-b border-slate-100">
              <span>Order</span>
              <span>Customer</span>
              <span>Items</span>
              <span>Amount</span>
              <span className="text-right pr-2">Status</span>
            </div>

            {/* Table Rows */}
            {recentOrders.map((order) => {
              const custName = order.customer?.name || 'Customer';
              const initial = custName.charAt(0).toUpperCase();
              return (
                <div
                  key={order.id}
                  onClick={onNavigateOrders}
                  className="grid grid-cols-[22%_24%_14%_18%_22%] items-center py-2 hover:bg-slate-50/80 rounded-xl cursor-pointer transition-all px-1 group"
                >
                  <span className="font-bold text-blue-600 group-hover:text-blue-700 truncate text-xs font-mono">
                    {order.orderNumber}
                  </span>

                  <div className="flex items-center gap-1.5 min-w-0 pr-1">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 text-slate-700 text-[10px] font-extrabold flex items-center justify-center shrink-0">
                      {initial}
                    </div>
                    <span className="text-slate-800 font-semibold truncate text-xs">{custName}</span>
                  </div>

                  <span className="text-slate-500 font-medium truncate text-xs">
                    {order.itemsSummary?.count || order.items?.length || 1} {((order.itemsSummary?.count || order.items?.length || 1) === 1) ? 'item' : 'items'}
                  </span>

                  <span className="font-extrabold text-slate-900 text-xs truncate">
                    ₹{Math.round(order.pricing?.totalAmount || 0).toLocaleString('en-IN')}
                  </span>

                  <div className="flex items-center justify-end gap-1.5 pl-1 shrink-0">
                    {order.status === 'new' ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          useOrderStore.getState().acceptOrder(order.id);
                          printMerchantInvoice(order);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                        title="Accept & Print Order in 1 click"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Accept</span>
                      </button>
                    ) : (
                      renderStatusBadge(order.status)
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-3">
        <button
          type="button"
          onClick={onNavigateOrders}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-sm shadow-orange-500/20 hover:shadow-md cursor-pointer"
        >
          <span>View All Orders ({orders.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
