import React from 'react';
import {
  FileText,
  DollarSign,
  Receipt,
  Percent,
  TrendingUp,
  Eye,
} from 'lucide-react';
import { useAnalyticsStore } from '../../stores/analyticsStore.js';

export const OfflineBillingReportTab: React.FC = () => {
  const { offlineBills } = useAnalyticsStore();

  return (
    <div className="space-y-6">
      {/* 6 KPI Cards Matching 12.4.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Offline Bills */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Total Offline Bills</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">1,032</h4>
            </div>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-2">
            &uarr; 8.45% <span className="text-slate-400 font-normal">vs 03-09 May</span>
          </p>
        </div>

        {/* Total Offline Sales */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Total Offline Sales</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">₹ 12,45,320</h4>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-2">
            &uarr; 10.23% <span className="text-slate-400 font-normal">vs 03-09 May</span>
          </p>
        </div>

        {/* Average Bill Value */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Average Bill Value</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">₹ 1,206.51</h4>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-2">
            &uarr; 1.63% <span className="text-slate-400 font-normal">vs 03-09 May</span>
          </p>
        </div>

        {/* Total Tax Collected */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Total Tax Collected</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">₹ 1,12,450</h4>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-2">
            &uarr; 9.15% <span className="text-slate-400 font-normal">vs 03-09 May</span>
          </p>
        </div>

        {/* Total Discounts */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Total Discounts</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">₹ 65,230</h4>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-rose-600 font-semibold mt-2">
            &darr; 4.21% <span className="text-slate-400 font-normal">vs 03-09 May</span>
          </p>
        </div>

        {/* Net Offline Sales */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Net Offline Sales</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">₹ 11,67,640</h4>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-2">
            &uarr; 10.87% <span className="text-slate-400 font-normal">vs 03-09 May</span>
          </p>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Offline Sales Trend */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-900 mb-3">Offline Sales Trend</h4>
          <div className="h-36 w-full">
            <svg className="w-full h-full" viewBox="0 0 250 100" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                points="10,85 50,70 90,40 130,50 170,45 210,25 240,40"
              />
              <circle cx="10" cy="85" r="3" fill="#2563eb" />
              <circle cx="50" cy="70" r="3" fill="#2563eb" />
              <circle cx="90" cy="40" r="3" fill="#2563eb" />
              <circle cx="130" cy="50" r="3" fill="#2563eb" />
              <circle cx="170" cy="45" r="3" fill="#2563eb" />
              <circle cx="210" cy="25" r="3" fill="#2563eb" />
              <circle cx="240" cy="40" r="3" fill="#2563eb" />
            </svg>
            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
              <span>10 May</span>
              <span>12 May</span>
              <span>14 May</span>
              <span>16 May</span>
            </div>
          </div>
        </div>

        {/* Bills by Time of Day */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-900 mb-3">Bills by Time of Day</h4>
          <div className="h-36 w-full flex items-end justify-between gap-2 pt-4">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-purple-500 rounded-t" style={{ height: '35px' }} />
              <span className="text-[8px] text-slate-400 mt-1 text-center">6-9 AM</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-purple-500 rounded-t" style={{ height: '70px' }} />
              <span className="text-[8px] text-slate-400 mt-1 text-center">9-12 PM</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-purple-500 rounded-t" style={{ height: '100px' }} />
              <span className="text-[8px] text-slate-400 mt-1 text-center">12-3 PM</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-purple-500 rounded-t" style={{ height: '75px' }} />
              <span className="text-[8px] text-slate-400 mt-1 text-center">3-6 PM</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-purple-500 rounded-t" style={{ height: '65px' }} />
              <span className="text-[8px] text-slate-400 mt-1 text-center">6-9 PM</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-purple-500 rounded-t" style={{ height: '45px' }} />
              <span className="text-[8px] text-slate-400 mt-1 text-center">9-12 AM</span>
            </div>
          </div>
        </div>

        {/* Offline Sales by Payment Method */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-900 mb-3">Sales by Payment Method</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Cash
              </span>
              <span className="font-bold text-slate-900">55.02% (₹ 6,85,320)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                UPI
              </span>
              <span className="font-bold text-slate-900">33.13% (₹ 4,12,450)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Card
              </span>
              <span className="font-bold text-slate-900">8.86% (₹ 1,10,300)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Other
              </span>
              <span className="font-bold text-slate-900">2.99% (₹ 37,250)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Offline Bills Table + Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Offline Bills</h3>
          </div>

          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3">Bill No.</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3 text-center">Items</th>
                  <th className="py-3 px-3 text-right">Bill Amount (₹)</th>
                  <th className="py-3 px-3 text-right">Discount (₹)</th>
                  <th className="py-3 px-3 text-right">Tax (₹)</th>
                  <th className="py-3 px-3 text-right">Net Amount (₹)</th>
                  <th className="py-3 px-3">Payment Method</th>
                  <th className="py-3 px-3">Cashier</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {offlineBills.map((b) => (
                  <tr key={b.billNo} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-blue-600 whitespace-nowrap">
                      {b.billNo}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {b.dateTime}
                    </td>
                    <td className="py-3 px-3 text-slate-800">{b.customer}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      {b.items}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-800 whitespace-nowrap">
                      ₹ {b.billAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right text-rose-600 whitespace-nowrap">
                      ₹ {b.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 whitespace-nowrap">
                      ₹ {b.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                      ₹ {b.netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-800">
                        {b.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {b.cashier}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => alert(`Receipt #${b.billNo}: ₹${b.netAmount}`)}
                        className="px-2 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 border border-slate-200 rounded-lg hover:bg-blue-50 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 border-t border-slate-100 text-[11px] text-slate-400 bg-slate-50/50">
            Showing 1 to {offlineBills.length} of 1,032 bills
          </div>
        </div>

        {/* Top Categories (Offline) & Summary */}
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 mb-2">
              Top Categories (Offline Sales)
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-700">Men's Wear</span>
                <span className="font-bold">₹ 4,25,320 (34.17%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Women's Wear</span>
                <span className="font-bold">₹ 3,22,150 (25.91%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Footwear</span>
                <span className="font-bold">₹ 2,15,480 (17.32%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Accessories</span>
                <span className="font-bold">₹ 1,38,450 (11.13%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Others</span>
                <span className="font-bold">₹ 43,920 (3.53%)</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Summary</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Bills</span>
                <span className="font-bold text-slate-900">1,032</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Items Sold</span>
                <span className="font-bold text-slate-900">4,568</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Offline Sales</span>
                <span className="font-bold text-slate-900">₹ 12,45,320.00</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span className="text-slate-500 font-semibold">Net Offline Sales</span>
                <span className="font-black text-emerald-700">₹ 11,67,640.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
