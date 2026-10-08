import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Store,
  Truck,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { useSettingsStore, BusinessHours } from '../../stores/settingsStore.js';

const timeSlots = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
];

export const StoreTimingsTab: React.FC = () => {
  const { storeTimings, updateStoreTimings } = useSettingsStore();
  const [hours, setHours] = useState<BusinessHours[]>([...storeTimings.hours]);
  const [inStorePickup, setInStorePickup] = useState(storeTimings.inStorePickup);
  const [localDelivery, setLocalDelivery] = useState(storeTimings.localDelivery);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleDay = (index: number) => {
    const target = hours[index];
    if (!target) return;
    const updated = [...hours];
    const newIsOpen = !target.isOpen;
    updated[index] = {
      ...target,
      isOpen: newIsOpen,
      openTime: newIsOpen ? '09:00 AM' : 'Closed',
      closeTime: newIsOpen ? '09:00 PM' : 'Closed',
    };
    setHours(updated);
  };

  const handleTimeChange = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    const target = hours[index];
    if (!target) return;
    const updated = [...hours];
    updated[index] = {
      ...target,
      [field]: value,
    };
    setHours(updated);
  };

  const handleSave = () => {
    updateStoreTimings({ hours, inStorePickup, localDelivery });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Middle Column (Form) */}
      <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
        {/* Section 1: Working Hours */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Store Working Hours</h2>
              <p className="text-xs text-slate-500">
                Set the days and time slots when your store is open for orders and pickups.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {hours.map((item, idx) => (
              <div
                key={item.day}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100"
              >
                <label className="flex items-center gap-3 cursor-pointer min-w-[130px]">
                  <input
                    type="checkbox"
                    checked={item.isOpen}
                    onChange={() => toggleDay(idx)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span
                    className={`text-xs font-bold ${
                      item.isOpen ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {item.day}
                  </span>
                </label>

                {item.isOpen ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={item.openTime}
                      onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <span className="text-slate-400 text-xs">—</span>
                    <select
                      value={item.closeTime}
                      onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      title="Add slot"
                      className="w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-400 min-w-[95px] text-center font-medium">
                      Closed
                    </span>
                    <span className="text-slate-400 text-xs">—</span>
                    <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-400 min-w-[95px] text-center font-medium">
                      Closed
                    </span>
                    <div className="w-7" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Pickup & Fulfilment Options */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Pickup & Fulfilment Options</h3>
              <p className="text-xs text-slate-500">
                Choose how customers can receive their orders from your store.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* In-store Pickup Card */}
            <div
              onClick={() => setInStorePickup(!inStorePickup)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                inStorePickup
                  ? 'border-blue-500 bg-blue-50/20 shadow-2xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  inStorePickup ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Store className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">In-store Pickup</h4>
                  <input
                    type="checkbox"
                    checked={inStorePickup}
                    onChange={(e) => setInStorePickup(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Customers can pick up their orders from your store.
                </p>
              </div>
            </div>

            {/* Local Delivery Card */}
            <div
              onClick={() => setLocalDelivery(!localDelivery)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                localDelivery
                  ? 'border-blue-500 bg-blue-50/20 shadow-2xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  localDelivery ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Local Delivery</h4>
                  <input
                    type="checkbox"
                    checked={localDelivery}
                    onChange={(e) => setLocalDelivery(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Deliver orders within your city/area (You can configure delivery settings later).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 mr-auto flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Timings & pickup saved!
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setHours([...storeTimings.hours]);
              setInStorePickup(storeTimings.inStorePickup);
              setLocalDelivery(storeTimings.localDelivery);
            }}
            className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Right Column (Cards) */}
      <div className="xl:col-span-4 space-y-5">
        {/* Preview on Your Store Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-900">Preview on Your Store</h3>

          {/* Store Pill */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Fashion Hub</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Open Now
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-100 bg-white flex items-start gap-3">
              <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Today's Timings</p>
                <p className="text-[11px] text-slate-500 mt-0.5">09:00 AM – 09:00 PM</p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-white flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Store className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Pickup Available</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Collect your orders from our store.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
            <Lightbulb className="w-4 h-4" />
            <span>Tips</span>
          </div>

          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Set accurate store timings to avoid missed pickups.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Keep your store open during peak hours to capture more orders.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Enable in-store pickup to let customers collect orders easily.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>You can enable local delivery later from Shipping & Returns settings.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
