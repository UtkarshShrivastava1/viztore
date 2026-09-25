import React from 'react';
import {
  CreditCard,
  Receipt,
  FileSpreadsheet,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { useAnalyticsStore } from '../../stores/analyticsStore.js';

export const GSTReportTab: React.FC = () => {
  const { gstRatesSummary, gstInvoicesSummary } = useAnalyticsStore();

  return (
    <div className="space-y-6">
      {/* 6 KPI Cards Matching 12.5.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Taxable Sales */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Total Taxable Sales</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">₹ 12,45,320</h4>
            </div>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-2">
            &uarr; 10.25% <span className="text-slate-400 font-normal">vs 03-09 May</span>
          </p>
        </div>

        {/* Total CGST Collected */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Total CGST</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">₹ 1,12,450</h4>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-2">
            &uarr; 9.65% <span className="text-slate-400 font-normal">vs 03-09 May</span>
          </p>
        </div>

        {/* Total SGST Collected */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Total SGST</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">₹ 1,12,450</h4>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-2">
            &uarr; 9.65% <span className="text-slate-400 font-normal">vs 03-09 May</span>
          </p>
        </div>

        {/* Total IGST Collected */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Total IGST</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">₹ 2,24,900</h4>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-2">
            &uarr; 11.32% <span className="text-slate-400 font-normal">vs 03-09 May</span>
          </p>
        </div>

        {/* Total Tax Collected */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Total Tax Collected</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">₹ 4,49,800</h4>
            </div>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-2">
            &uarr; 10.12% <span className="text-slate-400 font-normal">vs 03-09 May</span>
          </p>
        </div>

        {/* Net GST Payable */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Net GST Payable</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">₹ 4,49,800</h4>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-2">
            &uarr; 10.12% <span className="text-slate-400 font-normal">vs 03-09 May</span>
          </p>
        </div>
      </div>

      {/* Row 2: GST Summary by Tax Rate (2 Cols) + Tax Donut (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table: GST Summary by Tax Rate */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              GST Summary (By Tax Rate)
            </h3>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Tax Rate</th>
                  <th className="py-2.5 px-3 text-right">Taxable Sales (₹)</th>
                  <th className="py-2.5 px-3 text-right">CGST (₹)</th>
                  <th className="py-2.5 px-3 text-right">SGST (₹)</th>
                  <th className="py-2.5 px-3 text-right">IGST (₹)</th>
                  <th className="py-2.5 px-3 text-right">Total Tax (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {gstRatesSummary.map((r) => (
                  <tr key={r.rate} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{r.rate}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-800">
                      ₹ {r.taxableSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      ₹ {r.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      ₹ {r.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      ₹ {r.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      ₹ {r.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Donut: Tax Collected by Type */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-900 mb-2">Tax Collected (By Type)</h4>
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="14" fill="transparent" />
                {/* IGST 50% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#3b82f6"
                  strokeWidth="14"
                  strokeDasharray="238.76"
                  strokeDashoffset="119.38"
                  fill="transparent"
                />
                {/* CGST 25% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeDasharray="238.76"
                  strokeDashoffset="179.07"
                  fill="transparent"
                />
                {/* SGST 25% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#f59e0b"
                  strokeWidth="14"
                  strokeDasharray="238.76"
                  strokeDashoffset="238.76"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] uppercase font-semibold text-slate-400">Total</span>
                <span className="text-xs font-black text-slate-900">₹ 4,49,800</span>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-xs w-full">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  CGST
                </span>
                <span className="font-bold">₹ 1,12,450.00 (25.00%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  SGST
                </span>
                <span className="font-bold">₹ 1,12,450.00 (25.00%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  IGST
                </span>
                <span className="font-bold">₹ 2,24,900.00 (50.00%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: GST Invoices Summary (2 Cols) + Filing Status & Summary (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              GST Invoices Summary
            </h3>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Invoice Type</th>
                  <th className="py-2.5 px-3 text-center">Total Invoices</th>
                  <th className="py-2.5 px-3 text-right">Taxable Sales (₹)</th>
                  <th className="py-2.5 px-3 text-right">CGST (₹)</th>
                  <th className="py-2.5 px-3 text-right">SGST (₹)</th>
                  <th className="py-2.5 px-3 text-right">IGST (₹)</th>
                  <th className="py-2.5 px-3 text-right">Total Tax (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {gstInvoicesSummary.map((inv) => (
                  <tr key={inv.invoiceType} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {inv.invoiceType}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                      {inv.totalInvoices}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-800">
                      ₹ {inv.taxableSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      ₹ {inv.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      ₹ {inv.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      ₹ {inv.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      ₹ {inv.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GST Filing Status & Quick Summary */}
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 mb-2">GST Filing Status</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Tax Period</span>
                <span className="font-semibold text-slate-800">May 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Return Filing Status</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  Not Filed
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Due Date</span>
                <span className="font-semibold text-slate-800">20 Jun 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Days Remaining</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  25 Days
                </span>
              </div>
            </div>

            <button
              onClick={() => alert('Initiating GST Return filing flow...')}
              className="w-full mt-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200"
            >
              File GST Return
            </button>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Quick Summary</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Opening Balance (Previous Period)</span>
                <span className="font-semibold text-slate-800">₹ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total GST Payable</span>
                <span className="font-semibold text-slate-800">₹ 4,49,800.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total GST Paid</span>
                <span className="font-semibold text-slate-800">₹ 0.00</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold">
                <span className="text-slate-800">Net GST Payable</span>
                <span className="text-rose-600">₹ 4,49,800.00</span>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-start gap-1.5 text-[11px] text-amber-800">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>You have not paid any GST for this period.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
