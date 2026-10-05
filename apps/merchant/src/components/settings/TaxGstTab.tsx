import React, { useState } from 'react';
import {
  Percent,
  CheckCircle2,
  FileText,
  Lightbulb,
  Eye,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore.js';

export const TaxGstTab: React.FC = () => {
  const { taxGst, updateTaxGst } = useSettingsStore();
  const [formData, setFormData] = useState({ ...taxGst });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    updateTaxGst(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Middle Column (Form) */}
      <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
        {/* Section 1: GST Registration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">GST Registration</h2>
                <p className="text-xs text-slate-500">
                  Add your GST details to generate GST compliant invoices.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                GSTIN <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 uppercase tracking-wider focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> GSTIN verified successfully
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Business Legal Name (as per GST) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.businessLegalName}
                onChange={(e) => setFormData({ ...formData, businessLegalName: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Trade Name (Optional)</label>
              <input
                type="text"
                value={formData.tradeName}
                onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">GST Registration Type</label>
              <select
                value={formData.registrationType}
                onChange={(e) => setFormData({ ...formData, registrationType: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Regular">Regular</option>
                <option value="Composition">Composition</option>
                <option value="Consumer">Consumer</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Registered Address (as per GST) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">{formData.registeredAddress.length}/250</span>
            </div>
            <textarea
              rows={2}
              maxLength={250}
              value={formData.registeredAddress}
              onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Section 2: Tax Settings */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Tax Settings</h3>
              <p className="text-xs text-slate-500">
                Choose how taxes are applied to your products and orders.
              </p>
            </div>
          </div>

          {/* Toggle Apply GST */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-900">Apply GST on Orders</p>
              <p className="text-[11px] text-slate-500">
                GST will be calculated and added to customer invoices.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, applyGstOnOrders: !formData.applyGstOnOrders })}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.applyGstOnOrders ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  formData.applyGstOnOrders ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Price Display */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Price Display</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/90 hover:bg-slate-50/60 cursor-pointer">
                <input
                  type="radio"
                  name="priceDisplay"
                  checked={formData.priceDisplay === 'excluding_tax'}
                  onChange={() => setFormData({ ...formData, priceDisplay: 'excluding_tax' })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Show prices excluding tax (Tax added at checkout)
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/90 hover:bg-slate-50/60 cursor-pointer">
                <input
                  type="radio"
                  name="priceDisplay"
                  checked={formData.priceDisplay === 'including_tax'}
                  onChange={() => setFormData({ ...formData, priceDisplay: 'including_tax' })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Show prices including tax (Tax included in product prices)
                </span>
              </label>
            </div>
          </div>

          {/* Rates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Default GST Rate</label>
              <select
                value={formData.defaultGstRate}
                onChange={(e) => setFormData({ ...formData, defaultGstRate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="0% (Zero Rated)">0% (Zero Rated)</option>
                <option value="5% (Concessional)">5% (Concessional)</option>
                <option value="12% (Reduced)">12% (Reduced)</option>
                <option value="18% (Standard Rate)">18% (Standard Rate)</option>
                <option value="28% (Luxury)">28% (Luxury)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 sm:mt-5">
              <div className="space-y-0.5 pr-2">
                <p className="text-xs font-bold text-slate-900">Apply Different GST Rates</p>
                <p className="text-[10px] text-slate-500">Set different GST rates for different categories.</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, applyDifferentGstRates: !formData.applyDifferentGstRates })
                }
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.applyDifferentGstRates ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    formData.applyDifferentGstRates ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 mr-auto flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Tax & GST settings saved!
            </span>
          )}
          <button
            type="button"
            onClick={() => setFormData({ ...taxGst })}
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
        {/* GST Invoice Preview Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">GST Invoice Preview</h3>
            </div>
            <button
              type="button"
              className="text-[11px] font-bold text-blue-600 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors"
            >
              View Sample
            </button>
          </div>

          {/* Mini Tax Invoice Card Sheet */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 text-[11px] space-y-3 font-sans">
            <div className="flex items-start justify-between border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-slate-950 text-white flex flex-col items-center justify-center p-0.5 text-center shrink-0">
                  <span className="text-[7px] font-black tracking-tight leading-none">FASHION</span>
                  <span className="text-[7px] font-black tracking-tight leading-none">HUB</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-xs">Fashion Hub</span>
                  <p className="text-[9px] text-slate-500 font-mono">GSTIN: {formData.gstin}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900">TAX INVOICE</p>
                <p className="text-[9px] text-slate-500 font-mono font-semibold">#VZT10325</p>
                <p className="text-[9px] text-slate-400">Date: 18 May 2024</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] border-b border-slate-200/80 pb-2.5">
              <div>
                <p className="font-bold text-slate-700">Bill To</p>
                <p className="text-slate-900 font-semibold">Rohan Verma</p>
                <p className="text-slate-500">+91 98765 43210</p>
                <p className="text-slate-500">rohan@example.com</p>
              </div>
              <div>
                <p className="font-bold text-slate-700">Store Details</p>
                <p className="text-slate-900 font-semibold">Fashion Hub</p>
                <p className="text-slate-500 leading-tight">Shop No. 12, Main Market</p>
                <p className="text-slate-500">Bhilai, Chhattisgarh - 490023</p>
              </div>
            </div>

            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-1">Item</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-right">Price (₹)</th>
                  <th className="py-1 text-right">Tax (18%)</th>
                  <th className="py-1 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-1 font-medium text-slate-800">Men Cotton T-shirt</td>
                  <td className="py-1 text-center text-slate-600">3</td>
                  <td className="py-1 text-right text-slate-600">899</td>
                  <td className="py-1 text-right text-slate-600">485</td>
                  <td className="py-1 text-right font-semibold text-slate-900">3,182</td>
                </tr>
              </tbody>
            </table>

            <div className="pt-2 border-t border-slate-200/80 space-y-1 text-right text-[10px]">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">₹2,697</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (18%)</span>
                <span className="font-semibold text-slate-800">₹485</span>
              </div>
              <div className="flex justify-between text-xs font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Total</span>
                <span className="text-blue-600">₹3,182</span>
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
              <span>Add a valid GSTIN to generate GST compliant invoices.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Ensure your business name and address match GST records.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>You can set different GST rates for different product categories.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Tax will be automatically calculated on customer invoices.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Keep your GST details updated to avoid issues in payouts and filings.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
