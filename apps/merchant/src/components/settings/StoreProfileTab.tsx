import React, { useState } from 'react';
import {
  Store,
  Upload,
  Info,
  X,
  Phone,
  Mail,
  Link as LinkIcon,
  MapPin,
  Building2,
  CheckCircle2,
  Clock,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore.js';

export const StoreProfileTab: React.FC = () => {
  const { storeProfile, updateStoreProfile, setActiveSubTab } = useSettingsStore();
  const [formData, setFormData] = useState({ ...storeProfile });
  const [showBanner, setShowBanner] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    updateStoreProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Middle Column (Form) */}
      <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Store Profile</h2>
            <p className="text-xs text-slate-500">
              Update the details customers see when they discover your store.
            </p>
          </div>
        </div>

        {/* Info Banner */}
        {showBanner && (
          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between gap-3 text-xs text-blue-800">
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Keep your store information up to date to help customers recognize your business.</span>
            </div>
            <button
              type="button"
              onClick={() => setShowBanner(false)}
              className="p-1 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-100/50"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Display Name & Store Logo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Store Display Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <p className="text-[11px] text-slate-400">This name will be visible to customers on Viztore.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Store Logo</label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-slate-950 text-white flex flex-col items-center justify-center p-2 text-center shrink-0 border border-slate-200 shadow-2xs">
                <span className="text-[9px] font-black tracking-widest leading-none">FASHION</span>
                <span className="text-[9px] font-black tracking-widest leading-none mt-0.5">HUB</span>
              </div>
              <div className="space-y-1">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload logo</span>
                  <input type="file" accept="image/*" className="hidden" />
                </label>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Recommended size: 512 × 512 px PNG, JPG (Max 2 MB)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Store Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              Store Description <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] font-medium text-slate-400">
              {formData.description.length}/500
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={500}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
        </div>

        {/* Contact Number & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Store Contact Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-9 pr-24 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <div className="absolute right-2.5 flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified
                </span>
                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  Edit
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Store Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-24 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <div className="absolute right-2.5 flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified
                </span>
                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Website / Social Link */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Website / Social Link</label>
          <div className="relative flex items-center">
            <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Add your website or social media link (Instagram, Facebook, etc.).
          </p>
        </div>

        {/* Store Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Store Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
          </div>
          <p className="text-[11px] text-slate-400">Enter your complete store address.</p>
        </div>

        {/* City, State, PIN Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              City <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              State <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Rajasthan">Rajasthan</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              PIN Code <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={formData.pinCode}
                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 mr-auto flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Changes saved successfully!
            </span>
          )}
          <button
            type="button"
            onClick={() => setFormData({ ...storeProfile })}
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
        {/* Profile Completeness Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">Profile completeness</h3>
            <span className="text-xs font-black text-blue-600">80%</span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '80%' }} />
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Store details</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600">Completed</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Contact information</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600">Completed</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Address</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600">Completed</span>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubTab('timings_pickup')}
              className="w-full py-2.5 flex items-center justify-between text-left hover:bg-slate-50/80 -mx-1 px-1 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="group-hover:text-blue-600 transition-colors">Store hours</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Pending
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              </div>
            </button>
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
              <span>Use a clear store name that matches your brand.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Add a high quality logo (square format).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Keep your description short and relevant.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Make sure contact details are correct and verified.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Update store hours to improve customer trust.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
