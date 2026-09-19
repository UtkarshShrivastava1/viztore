import React, { useState } from 'react';
import {
  ChevronRight,
  Save,
  Edit2,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useBillingStore, BillingSettings } from '../../stores/billingStore.js';
import { branding } from '../../lib/branding.js';

interface BillingSettingsViewProps {
  onBack: () => void;
}

export const BillingSettingsView: React.FC<BillingSettingsViewProps> = ({ onBack }) => {
  const { settings, updateBillingSettings } = useBillingStore();

  // Local form state initialized from store
  const [formState, setFormState] = useState<BillingSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = <K extends keyof BillingSettings>(key: K, value: BillingSettings[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    updateBillingSettings(formState);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumbs (5.3.png) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 mb-1">
            <button type="button" onClick={onBack} className="hover:underline">
              Billing &amp; Invoicing
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800">Settings</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Billing &amp; Invoicing Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage preferences for invoices, taxes, discounts and settlements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Info Alert Banner (5.3.png) */}
      <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-xl flex items-center gap-2.5 text-xs text-blue-700 font-medium">
        <Info className="w-4 h-4 text-blue-600 shrink-0" />
        <span>Changes are saved automatically when you click Save Changes.</span>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Billing preferences and tax settings saved successfully!</span>
        </div>
      )}

      {/* Main Grid: Left Column (4 Settings Panels) & Right Column (Live Invoice Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column - 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1: General Billing Settings */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">General Billing Settings</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Default Currency
                </label>
                <select
                  value={formState.defaultCurrency}
                  onChange={(e) => handleChange('defaultCurrency', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                >
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Billing Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formState.billingAddress}
                    onChange={(e) => handleChange('billingAddress', e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                  <Edit2 className="w-3.5 h-3.5 text-blue-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">
                Enable customer billing address
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.useCustomerBillingAddress}
                  onChange={(e) => handleChange('useCustomerBillingAddress', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Card 2: Invoice Settings */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Invoice Settings</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">
                  Auto-generate invoices
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.autoInvoiceGeneration}
                    onChange={(e) => handleChange('autoInvoiceGeneration', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Invoice template
                </label>
                <select
                  value={formState.invoiceTemplate}
                  onChange={(e) => handleChange('invoiceTemplate', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                >
                  <option value="Modern Tax Invoice">Modern Tax Invoice</option>
                  <option value="Classic Tax Invoice">Classic Tax Invoice</option>
                  <option value="GST Standard Template">GST Standard Template</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Invoice Prefix
                </label>
                <input
                  type="text"
                  value={formState.invoicePrefix}
                  onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Starting Number
                </label>
                <input
                  type="number"
                  value={formState.startingSequenceNumber}
                  onChange={(e) => handleChange('startingSequenceNumber', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Card 3: GST & Tax Settings */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">GST &amp; Tax Settings</h3>
                {formState.gstEnabled && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    GST Enabled
                  </span>
                )}
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.gstEnabled}
                  onChange={(e) => handleChange('gstEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  GSTIN
                </label>
                <input
                  type="text"
                  value={formState.gstin}
                  onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  State
                </label>
                <select
                  value={formState.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Tax calculation
                </label>
                <select
                  value={formState.taxCalculationType === 'exclusive' ? 'Exclusive of tax' : 'Inclusive of tax'}
                  onChange={(e) =>
                    handleChange(
                      'taxCalculationType',
                      e.target.value.includes('Exclusive') ? 'exclusive' : 'inclusive'
                    )
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                >
                  <option value="Exclusive of tax">Exclusive of tax</option>
                  <option value="Inclusive of tax">Inclusive of tax</option>
                </select>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">
                Apply tax by product category
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.categoryTaxEnabled}
                  onChange={(e) => handleChange('categoryTaxEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Card 4: Discount Settings */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Discount Settings</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                <span className="text-xs font-medium text-slate-700">
                  Allow discounts on invoices
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.allowDiscounts}
                    onChange={(e) => handleChange('allowDiscounts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Discount type
                </label>
                <select
                  value="Percentage or fixed amount"
                  onChange={() => {}}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                >
                  <option value="Percentage or fixed amount">Percentage or fixed amount</option>
                  <option value="Percentage only">Percentage only</option>
                  <option value="Fixed amount only">Fixed amount only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Maximum discount allowed
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formState.maxDiscountLimit}
                    onChange={(e) => handleChange('maxDiscountLimit', Number(e.target.value))}
                    className="w-full pl-3 pr-7 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Invoice Preview Card (5.3.png) - 5 cols */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Preview</h3>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-6 text-slate-800 space-y-5 text-xs font-sans">
            {/* Top Store Details & Tax Invoice Label */}
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Fashion Hub</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  {formState.billingAddress}
                </p>
                <p className="text-[11px] text-slate-500 leading-tight">+91 98765 43210</p>
              </div>

              <div className="text-right">
                <h2 className="text-base font-extrabold tracking-wider text-slate-900 mb-1.5">
                  TAX INVOICE
                </h2>
                <p className="text-[11px] text-slate-600">
                  <span className="text-slate-500">Invoice No:</span>{' '}
                  <span className="font-mono font-semibold">
                    {formState.invoicePrefix}
                    {formState.startingSequenceNumber}
                  </span>
                </p>
                <p className="text-[11px] text-slate-600">
                  <span className="text-slate-500">Date:</span> 11 May 2024
                </p>
              </div>
            </div>

            {/* Bill To Customer Section */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block mb-0.5">Bill To</span>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-slate-900">Ramesh Stores</span>
                <span className="text-slate-500">+91 98765 43210</span>
              </div>
            </div>

            {/* Line Items Sample Table */}
            <div className="border-t border-slate-100 pt-2">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-slate-200 font-semibold text-slate-600">
                    <th className="py-2 pr-2">Sr.</th>
                    <th className="py-2 pr-2">Item</th>
                    <th className="py-2 px-1 text-center">Qty</th>
                    <th className="py-2 px-1 text-right">MRP (₹)</th>
                    <th className="py-2 px-1 text-right">Rate (₹)</th>
                    <th className="py-2 pl-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 pr-2 text-slate-500">1</td>
                    <td className="py-2.5 pr-2 font-medium text-slate-900">Men's Cotton Shirt</td>
                    <td className="py-2.5 px-1 text-center">2</td>
                    <td className="py-2.5 px-1 text-right font-mono">2,999.00</td>
                    <td className="py-2.5 px-1 text-right font-mono">2,500.00</td>
                    <td className="py-2.5 pl-2 text-right font-mono font-medium text-slate-900">5,000.00</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-2 text-slate-500">2</td>
                    <td className="py-2.5 pr-2 font-medium text-slate-900">Women's Kurti</td>
                    <td className="py-2.5 px-1 text-center">3</td>
                    <td className="py-2.5 px-1 text-right font-mono">2,999.00</td>
                    <td className="py-2.5 px-1 text-right font-mono">2,500.00</td>
                    <td className="py-2.5 pl-2 text-right font-mono font-medium text-slate-900">7,500.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Subtotals Breakdown (Aligned to the right) */}
            <div className="pt-2 border-t border-slate-100 flex flex-col items-end space-y-1.5 text-xs">
              <div className="flex justify-between w-48 text-slate-600">
                <span>Total MRP</span>
                <span className="font-mono text-slate-800">₹14,995.00</span>
              </div>
              <div className="flex justify-between w-48 text-emerald-600">
                <span>Discount on MRP</span>
                <span className="font-mono font-medium">- ₹2,495.00</span>
              </div>
              <div className="flex justify-between w-48 text-slate-600">
                <span>GST (18%)</span>
                <span className="font-mono text-slate-800">₹2,250.00</span>
              </div>
            </div>

            {/* Total Amount Light Blue Banner */}
            <div className="bg-blue-50/80 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Total Amount</span>
              <span className="font-black text-lg text-slate-900 font-mono">₹12,500.00</span>
            </div>

            {/* Centered Footer */}
            <div className="pt-4 text-center text-xs text-slate-500">
              Thanks, Visit Again!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
