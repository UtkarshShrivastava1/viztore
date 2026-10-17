import React from 'react';
import {
  Store,
  Package,
  Layers,
  Truck,
  Wrench,
  Rocket,
  ArrowRight,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';

interface SellOnlineDropdownProps {
  onNavigate: (route: string) => void;
  onClose: () => void;
}

export const SellOnlineDropdown: React.FC<SellOnlineDropdownProps> = ({
  onNavigate,
  onClose,
}) => {
  const handleClick = (route: string) => {
    onNavigate(route);
    onClose();
  };

  return (
    <div className="w-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="grid grid-cols-2 gap-2 p-2">
        {/* Left Column */}
        <div className="space-y-1">
          {/* Start Selling */}
          <button
            type="button"
            onClick={() => handleClick('/register')}
            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0 group-hover:bg-[#0038ed] group-hover:text-white transition-colors">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                Start Selling
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                Create your {branding.appName} seller account and set up your store.
              </div>
            </div>
          </button>

          {/* List Products */}
          <button
            type="button"
            onClick={() => handleClick('/sell-online/listproducts')}
            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0 group-hover:bg-[#0038ed] group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                List Products
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                Add products with photos, prices and details.
              </div>
            </div>
          </button>

          {/* Manage Your Store */}
          <button
            type="button"
            onClick={() => handleClick('/sell-online/managestore')}
            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0 group-hover:bg-[#0038ed] group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                Manage Your Store
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                Inventory, billing, customers and more.
              </div>
            </div>
          </button>
        </div>

        {/* Right Column */}
        <div className="space-y-1">
          {/* Orders & Delivery */}
          <button
            type="button"
            onClick={() => handleClick('/sell-online/ordersdelivery')}
            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0 group-hover:bg-[#0038ed] group-hover:text-white transition-colors">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                Orders &amp; Delivery
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                Receive orders and manage delivery or pickup.
              </div>
            </div>
          </button>

          {/* Seller Tools */}
          <button
            type="button"
            onClick={() => handleClick('/sell-online/sellertools')}
            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0 group-hover:bg-[#0038ed] group-hover:text-white transition-colors">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                Seller Tools
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                Store QR, reports and business growth tools.
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom CTA Card */}
      <div className="mt-2 p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              New to {branding.appName}?
            </div>
            <div className="text-[11px] text-slate-500">
              Start your online store in a few simple steps.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleClick('/register')}
          className="px-4 py-2 rounded-lg bg-[#0038ed] hover:bg-[#002fcf] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          <span>Start Selling</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
