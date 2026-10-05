import React, { useState } from 'react';
import {
  Truck,
  RotateCcw,
  Info,
  CheckCircle2,
  ShoppingCart,
  Bike,
  Home,
  Lightbulb,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore.js';

export const ShippingReturnsTab: React.FC = () => {
  const { shippingReturns, updateShippingReturns } = useSettingsStore();
  const [formData, setFormData] = useState({ ...shippingReturns });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    updateShippingReturns(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Middle Column (Form) */}
      <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
        {/* Section 1: Delivery Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Delivery Settings</h2>
              <p className="text-xs text-slate-500">
                Configure how orders are delivered to your customers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Service Area</label>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <select
                value={formData.serviceArea}
                onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Bhilai, Durg (Selected Areas)">Bhilai, Durg (Selected Areas)</option>
                <option value="Raipur (All Zones)">Raipur (All Zones)</option>
                <option value="Pan-India Delivery">Pan-India Delivery</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Delivery Partner</label>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <select
                value={formData.deliveryPartner}
                onChange={(e) => setFormData({ ...formData, deliveryPartner: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Viztore Delivery">Viztore Delivery</option>
                <option value="Self / In-house Fleet">Self / In-house Fleet</option>
                <option value="Dunzo / Porter">Dunzo / Porter</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Estimated Delivery Time</label>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <select
              value={formData.estimatedDeliveryTime}
              onChange={(e) =>
                setFormData({ ...formData, estimatedDeliveryTime: e.target.value })
              }
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="30 - 45 minutes">30 - 45 minutes</option>
              <option value="45 - 60 minutes">45 - 60 minutes</option>
              <option value="2 - 4 hours">2 - 4 hours</option>
              <option value="Same Day (Within 24h)">Same Day (Within 24h)</option>
            </select>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-2.5 text-xs text-blue-800">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Delivery charges are calculated at checkout based on customer location. We ensure fair,
              transparent delivery pricing with no hidden charges.
            </span>
          </div>

          {/* Toggle Enable Delivery */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-900">Enable delivery for customer orders</p>
              <p className="text-[11px] text-slate-500">
                Customers can place orders for delivery through the Viztore app.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, enableDelivery: !formData.enableDelivery })
              }
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.enableDelivery ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  formData.enableDelivery ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section 2: Return Settings */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Return Settings</h3>
              <p className="text-xs text-slate-500">Configure return policy for customer orders.</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-900">Allow Returns</p>
              <p className="text-[11px] text-slate-500">
                Customers can request returns as per your policy.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, allowReturns: !formData.allowReturns })
              }
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.allowReturns ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  formData.allowReturns ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Return Window</label>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <select
              value={formData.returnWindow}
              onChange={(e) => setFormData({ ...formData, returnWindow: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="3 days">3 days</option>
              <option value="7 days">7 days</option>
              <option value="15 days">15 days</option>
              <option value="30 days">30 days</option>
            </select>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 mr-auto flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Shipping & returns saved!
            </span>
          )}
          <button
            type="button"
            onClick={() => setFormData({ ...shippingReturns })}
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
        {/* Delivery Preview Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900">Delivery Preview</h3>
          </div>
          <p className="text-[11px] text-slate-500">Check how delivery works for your store.</p>

          {/* Timeline */}
          <div className="relative pl-6 space-y-6 pt-2">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-6 top-0 w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div className="ml-4">
                <h4 className="text-xs font-bold text-slate-900">Customer places order</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Order received on Viztore app</p>
              </div>
            </div>

            {/* Dotted Line */}
            <div className="w-0.5 h-6 border-l-2 border-dashed border-slate-200 ml-[-8px]" />

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-6 top-0 w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <Bike className="w-4 h-4" />
              </div>
              <div className="ml-4">
                <h4 className="text-xs font-bold text-slate-900">Order assigned to delivery partner</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Our delivery partner picks up from your store</p>
              </div>
            </div>

            {/* Dotted Line */}
            <div className="w-0.5 h-6 border-l-2 border-dashed border-slate-200 ml-[-8px]" />

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-6 top-0 w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Home className="w-4 h-4" />
              </div>
              <div className="ml-4">
                <h4 className="text-xs font-bold text-slate-900">Order delivered to customer</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Customer receives the order</p>
              </div>
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
              <span>Keep your delivery settings updated for accurate ETAs to customers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Set a clear return policy to build customer trust.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Ensure your products are properly packed to avoid damage during delivery.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Be transparent about delivery charges to provide a better shopping experience.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
