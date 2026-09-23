import React from 'react';
import {
  Store,
  Image as ImageIcon,
  Tag,
  Clock,
  MapPin,
  Eye,
  LayoutTemplate,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore.js';
import { CustomerAppPhonePreview } from './CustomerAppPhonePreview.js';

export const StoreViewSettingsView: React.FC = () => {
  const {
    storeVisibility,
    openStoreInfoModal,
    openBusinessHoursModal,
    openDeliverySettingsModal,
    openStoreVisibilityModal,
  } = useSettingsStore();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-2 border-b border-slate-100">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Store View Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Customize how your store information is displayed in the customer app.
        </p>
      </div>

      {/* Main Grid: Left Column (7 Cards) + Right Column (Storefront Phone Preview) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column - 8 cols */}
        <div className="xl:col-span-8 space-y-3.5">
          {/* Card 1: Store Information */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Store Information</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Manage store name, description, logo, cover image and contact details.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openStoreInfoModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50/60 rounded-xl flex items-center gap-1 transition-colors"
            >
              Edit
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Banner Image */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Banner Image</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Set a banner image that represents your store.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('Banner image manager dialog')}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50/60 rounded-xl flex items-center gap-1 transition-colors"
            >
              Edit
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Store Features */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Store Features</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Highlight key features and USPs of your store in the app.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('Store features & USPs editor')}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50/60 rounded-xl flex items-center gap-1 transition-colors"
            >
              Edit
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 4: Business Hours */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Business Hours</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Set your store working days and operating hours.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openBusinessHoursModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50/60 rounded-xl flex items-center gap-1 transition-colors"
            >
              Edit
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 5: Delivery Settings */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Delivery Settings</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Configure delivery time, minimum order value and delivery areas.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openDeliverySettingsModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50/60 rounded-xl flex items-center gap-1 transition-colors"
            >
              Edit
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 6: Store Visibility */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">Store Visibility</h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      storeVisibility.isOnline
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {storeVisibility.isOnline ? 'Visible' : 'Paused'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Control store status and visibility in the customer app.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openStoreVisibilityModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50/60 rounded-xl flex items-center gap-1 transition-colors"
            >
              Edit
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 7: Store Page Layout */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-slate-300 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Store Page Layout</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Choose the layout and order of sections on your store page.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('Store page layout selector')}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50/60 rounded-xl flex items-center gap-1 transition-colors"
            >
              Edit
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* About Store View Settings Card */}
          <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-start gap-3 text-xs text-blue-800">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-blue-900">About Store View Settings</h5>
              <p className="text-[11px] text-blue-700 mt-0.5 leading-relaxed">
                These settings help you control how your store appears to customers in the app.
                Changes will reflect in the customer app instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - 4 cols (Customer App Phone Preview in Storefront Mode) */}
        <div className="xl:col-span-4 sticky top-4">
          <CustomerAppPhonePreview mode="storefront" />
        </div>
      </div>
    </div>
  );
};
