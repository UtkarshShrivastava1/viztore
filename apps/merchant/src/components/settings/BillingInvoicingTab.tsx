import React, { useState } from 'react';
import {
  Receipt,
  Info,
  Mail,
  MessageSquare,
  CheckCircle2,
  Store,
  Lightbulb,
  Eye,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore.js';

export const BillingInvoicingTab: React.FC = () => {
  const { billingInvoicing, updateBillingInvoicing } = useSettingsStore();
  const [formData, setFormData] = useState({ ...billingInvoicing });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    updateBillingInvoicing(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Middle Column (Form) */}
      <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
        {/* Section 1: Invoice Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Invoice Settings</h2>
              <p className="text-xs text-slate-500">
                Customize your invoice details and numbering format.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Invoice Prefix <span className="text-rose-500">*</span>
                </label>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Starting Number <span className="text-rose-500">*</span>
                </label>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <input
                type="text"
                value={formData.startingNumber}
                onChange={(e) => setFormData({ ...formData, startingNumber: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Invoice Format */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Invoice Format</label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/90 hover:bg-slate-50/60 cursor-pointer">
                <input
                  type="radio"
                  name="invoiceFormat"
                  checked={formData.invoiceFormat === 'standard'}
                  onChange={() => setFormData({ ...formData, invoiceFormat: 'standard' })}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Standard Invoice</p>
                  <p className="text-[11px] text-slate-500">Includes store details, items, taxes and totals.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/90 hover:bg-slate-50/60 cursor-pointer">
                <input
                  type="radio"
                  name="invoiceFormat"
                  checked={formData.invoiceFormat === 'simplified'}
                  onChange={() => setFormData({ ...formData, invoiceFormat: 'simplified' })}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Simplified Invoice</p>
                  <p className="text-[11px] text-slate-500">Clean and minimal invoice format.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Language & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Invoice Language</label>
              <select
                value={formData.invoiceLanguage}
                onChange={(e) => setFormData({ ...formData, invoiceLanguage: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
              </select>
            </div>
          </div>

          {/* Auto generate checkbox */}
          <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoGenerateInvoice}
              onChange={(e) => setFormData({ ...formData, autoGenerateInvoice: e.target.checked })}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <div>
              <p className="text-xs font-bold text-slate-900">Automatically generate invoice for every order</p>
              <p className="text-[11px] text-slate-500">Invoices will be created and shared with customer's automatically.</p>
            </div>
          </label>
        </div>

        {/* Section 2: Customer Invoice Delivery */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Customer Invoice Delivery</h3>
              <p className="text-xs text-slate-500">Choose how invoices are shared with your customers.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/60 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sendViaEmail}
                onChange={(e) => setFormData({ ...formData, sendViaEmail: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Send invoice via Email</p>
                <p className="text-[11px] text-slate-500">A copy of the invoice will be sent to the customer's email address.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/60 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sendViaWhatsApp}
                onChange={(e) => setFormData({ ...formData, sendViaWhatsApp: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Send invoice via WhatsApp</p>
                <p className="text-[11px] text-slate-500">A copy of the invoice will be sent to the customer's WhatsApp number (if available).</p>
              </div>
            </label>
          </div>
        </div>

        {/* Section 3: Invoice Notes */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">Invoice Notes (Optional)</h3>
            </div>
            <span className="text-[10px] text-slate-400">{formData.invoiceNotes.length}/250</span>
          </div>
          <p className="text-[11px] text-slate-500">Add a custom message that will appear on every invoice.</p>
          <textarea
            rows={2}
            maxLength={250}
            value={formData.invoiceNotes}
            onChange={(e) => setFormData({ ...formData, invoiceNotes: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 mr-auto flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Invoice settings saved!
            </span>
          )}
          <button
            type="button"
            onClick={() => setFormData({ ...billingInvoicing })}
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
        {/* Invoice Preview Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">Invoice Preview</h3>
            </div>
            <button
              type="button"
              className="text-[11px] font-bold text-blue-600 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors"
            >
              View Sample
            </button>
          </div>

          {/* Mini Invoice Card Sheet */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 text-[11px] space-y-3 font-sans">
            <div className="flex items-start justify-between border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center">
                  <Store className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-900">Fashion Hub</span>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900">INVOICE</p>
                <p className="text-[10px] text-slate-500 font-mono font-semibold">VZ1001</p>
                <p className="text-[9px] text-slate-400">Order ID: #VZT10325</p>
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
                <p className="text-slate-500">Jaipur, Rajasthan - 302001</p>
              </div>
            </div>

            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-1">Item</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-right">Price</th>
                  <th className="py-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-1 font-medium text-slate-800">Men Cotton T-shirt</td>
                  <td className="py-1 text-center text-slate-600">3</td>
                  <td className="py-1 text-right text-slate-600">₹899</td>
                  <td className="py-1 text-right font-semibold text-slate-900">₹2,697</td>
                </tr>
              </tbody>
            </table>

            <div className="pt-2 border-t border-slate-200/80 space-y-1 text-right text-[10px]">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">₹2,697</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (5%)</span>
                <span className="font-semibold text-slate-800">₹135</span>
              </div>
              <div className="flex justify-between text-xs font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Total</span>
                <span className="text-blue-600">₹2,832</span>
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
              <span>Invoices help build trust and provide purchase details to your customers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Keep your store details updated for accurate invoices.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>You can preview how your invoice looks before saving.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Invoices are automatically generated for all completed orders.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
