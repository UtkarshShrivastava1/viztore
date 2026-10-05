import React, { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  ShoppingBag,
  Store,
  Receipt,
  ChevronRight,
  Info,
  ChevronDown,
  ArrowUpRight,
  Users,
  Repeat,
  UserPlus,
} from 'lucide-react';
import { useAnalyticsStore } from '../../stores/analyticsStore.js';

export const AnalyticsOverviewTab: React.FC = () => {
  const { setActiveTab } = useAnalyticsStore();
  const [revenuePeriod, setRevenuePeriod] = useState('Daily');
  const [ordersPeriod, setOrdersPeriod] = useState('Daily');

  return (
    <div className="space-y-3.5">
      {/* 4 KPI Summary Cards Matching 11.0.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Revenue */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total Revenue</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,45,230.00</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 12.5%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Profit */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total Profit</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 28,450.00</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 15.2%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total Orders</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">1,245</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 8.7%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Offline Billing */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Offline Billing</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 32,450.00</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 10.1%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>
      </div>

      {/* Row 2: Profit & Loss Overview + Revenue Trend + Orders Trend Matching 11.0.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Profit & Loss Overview */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1">
                <h3 className="text-xs font-bold text-slate-900">Profit & Loss Overview</h3>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Revenue</span>
                <span className="font-semibold text-slate-900">₹ 1,45,230.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total COGS</span>
                <span className="font-semibold text-slate-900">₹ 86,780.00</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold border-t border-slate-100 pt-1.5">
                <span>Gross Profit</span>
                <span>₹ 58,450.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Expenses</span>
                <span className="font-semibold text-slate-900">₹ 30,000.00</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-50/70 p-1.5 rounded-lg text-emerald-700 font-bold border border-emerald-100/60">
                <span>Net Profit</span>
                <span>₹ 28,450.00</span>
              </div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Profit Margin</span>
            <span className="text-xs font-black text-slate-900">19.59%</span>
          </div>
        </div>

        {/* Revenue Trend SVG Chart */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1">
              <h3 className="text-xs font-bold text-slate-900">Revenue Trend</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 border border-slate-200 rounded-lg px-2 py-0.5 bg-slate-50">
              <span>{revenuePeriod}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          <div className="h-36 w-full pt-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>₹ 40K</span>
              <span>₹ 30K</span>
              <span>₹ 20K</span>
              <span>₹ 10K</span>
              <span>₹ 0</span>
            </div>
            <svg className="w-full h-24" viewBox="0 0 300 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                fill="url(#revGrad)"
                points="10,70 55,58 105,35 155,37 205,15 250,28 290,52 290,90 10,90"
              />
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="10,70 55,58 105,35 155,37 205,15 250,28 290,52"
              />
              <circle cx="10" cy="70" r="3" fill="#2563eb" />
              <circle cx="55" cy="58" r="3" fill="#2563eb" />
              <circle cx="105" cy="35" r="3" fill="#2563eb" />
              <circle cx="155" cy="37" r="3" fill="#2563eb" />
              <circle cx="205" cy="15" r="3" fill="#2563eb" />
              <circle cx="250" cy="28" r="3" fill="#2563eb" />
              <circle cx="290" cy="52" r="3" fill="#2563eb" />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>10 May</span>
              <span>11 May</span>
              <span>12 May</span>
              <span>13 May</span>
              <span>14 May</span>
              <span>15 May</span>
              <span>16 May</span>
            </div>
          </div>
        </div>

        {/* Orders Trend SVG Chart */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1">
              <h3 className="text-xs font-bold text-slate-900">Orders Trend</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 border border-slate-200 rounded-lg px-2 py-0.5 bg-slate-50">
              <span>{ordersPeriod}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          <div className="h-36 w-full pt-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>800</span>
              <span>600</span>
              <span>400</span>
              <span>200</span>
              <span>0</span>
            </div>
            <svg className="w-full h-24" viewBox="0 0 300 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                fill="url(#ordGrad)"
                points="10,75 55,62 105,28 155,36 205,18 250,28 290,62 290,90 10,90"
              />
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="10,75 55,62 105,28 155,36 205,18 250,28 290,62"
              />
              <circle cx="10" cy="75" r="3" fill="#10b981" />
              <circle cx="55" cy="62" r="3" fill="#10b981" />
              <circle cx="105" cy="28" r="3" fill="#10b981" />
              <circle cx="155" cy="36" r="3" fill="#10b981" />
              <circle cx="205" cy="18" r="3" fill="#10b981" />
              <circle cx="250" cy="28" r="3" fill="#10b981" />
              <circle cx="290" cy="62" r="3" fill="#10b981" />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>10 May</span>
              <span>11 May</span>
              <span>12 May</span>
              <span>13 May</span>
              <span>14 May</span>
              <span>15 May</span>
              <span>16 May</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: 4 Module Reports Preview Grid Matching 11.0.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Product Wise Report */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <h4 className="text-xs font-bold text-slate-900">Product Wise Report</h4>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1 font-medium">Product</th>
                  <th className="pb-1 font-medium text-right">Sales (₹)</th>
                  <th className="pb-1 font-medium text-right">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-1 font-medium truncate max-w-[100px]">Men's Cotton Shirt</td>
                  <td className="py-1 text-right font-semibold">₹ 25,450.00</td>
                  <td className="py-1 text-right">120</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium truncate max-w-[100px]">Women's Kurti</td>
                  <td className="py-1 text-right font-semibold">₹ 18,750.00</td>
                  <td className="py-1 text-right">95</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium truncate max-w-[100px]">Denim Jeans</td>
                  <td className="py-1 text-right font-semibold">₹ 15,200.00</td>
                  <td className="py-1 text-right">60</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium truncate max-w-[100px]">Casual Shoes</td>
                  <td className="py-1 text-right font-semibold">₹ 12,980.00</td>
                  <td className="py-1 text-right">45</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium truncate max-w-[100px]">T-Shirt (Pack of 2)</td>
                  <td className="py-1 text-right font-semibold">₹ 10,450.00</td>
                  <td className="py-1 text-right">80</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            onClick={() => setActiveTab('product_wise')}
            className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Full Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Orders Report */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <h4 className="text-xs font-bold text-slate-900">Total Orders Report</h4>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1 font-medium">Status</th>
                  <th className="pb-1 font-medium text-right">Orders</th>
                  <th className="pb-1 font-medium text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-1 font-medium">Delivered</td>
                  <td className="py-1 text-right">890</td>
                  <td className="py-1 text-right font-semibold">₹ 1,02,450.00</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Pending</td>
                  <td className="py-1 text-right">180</td>
                  <td className="py-1 text-right font-semibold">₹ 18,750.00</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Cancelled</td>
                  <td className="py-1 text-right">95</td>
                  <td className="py-1 text-right font-semibold">₹ 9,250.00</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Returned</td>
                  <td className="py-1 text-right">80</td>
                  <td className="py-1 text-right font-semibold">₹ 12,780.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            onClick={() => setActiveTab('total_orders')}
            className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Full Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Offline Billing Report */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <h4 className="text-xs font-bold text-slate-900">Offline Billing Report</h4>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1 font-medium">Payment Method</th>
                  <th className="pb-1 font-medium text-right">Bills</th>
                  <th className="pb-1 font-medium text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-1 font-medium">Cash</td>
                  <td className="py-1 text-right">120</td>
                  <td className="py-1 text-right font-semibold">₹ 18,250.00</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">UPI</td>
                  <td className="py-1 text-right">85</td>
                  <td className="py-1 text-right font-semibold">₹ 9,800.00</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Card</td>
                  <td className="py-1 text-right">40</td>
                  <td className="py-1 text-right font-semibold">₹ 4,400.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            onClick={() => setActiveTab('offline_billing')}
            className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Full Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* GST Report */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <h4 className="text-xs font-bold text-slate-900">GST Report</h4>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1 font-medium">Tax Rate</th>
                  <th className="pb-1 font-medium text-right">Taxable (₹)</th>
                  <th className="pb-1 font-medium text-right">GST (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-1 font-medium">0%</td>
                  <td className="py-1 text-right">₹ 15,230.00</td>
                  <td className="py-1 text-right font-semibold">₹ 0.00</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">5%</td>
                  <td className="py-1 text-right">₹ 32,450.00</td>
                  <td className="py-1 text-right font-semibold">₹ 1,622.50</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">12%</td>
                  <td className="py-1 text-right">₹ 45,780.00</td>
                  <td className="py-1 text-right font-semibold">₹ 5,493.60</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">18%</td>
                  <td className="py-1 text-right">₹ 39,320.00</td>
                  <td className="py-1 text-right font-semibold">₹ 7,077.60</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">28%</td>
                  <td className="py-1 text-right">₹ 12,200.00</td>
                  <td className="py-1 text-right font-semibold">₹ 3,416.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            onClick={() => setActiveTab('gst_report')}
            className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Full Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 4: Top Categories + Payment Method + Business Summary Matching 11.0.png */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Top Categories Donut SVG */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1 mb-3">
            <h4 className="text-xs font-bold text-slate-900">Top Categories</h4>
            <Info className="w-3 h-3 text-slate-400" />
          </div>
          <div className="flex items-center gap-4">
            {/* Donut SVG */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="none" strokeDasharray="100.28 238.76" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" stroke="#ec4899" strokeWidth="12" fill="none" strokeDasharray="66.85 238.76" strokeDashoffset="-100.28" />
                <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="35.81 238.76" strokeDashoffset="-167.13" />
                <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="12" fill="none" strokeDasharray="23.88 238.76" strokeDashoffset="-202.94" />
                <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="11.94 238.76" strokeDashoffset="-226.82" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-semibold">Total</span>
                <span className="text-[11px] font-black text-slate-900 leading-tight">₹ 1,45,230</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-[11px] flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Men's Wear
                </span>
                <span className="font-semibold text-slate-900">42% (₹ 61,050)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  Women's Wear
                </span>
                <span className="font-semibold text-slate-900">28% (₹ 40,650)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Footwear
                </span>
                <span className="font-semibold text-slate-900">15% (₹ 21,780)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Accessories
                </span>
                <span className="font-semibold text-slate-900">10% (₹ 14,500)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Others
                </span>
                <span className="font-semibold text-slate-900">5% (₹ 7,250)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Overview */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1 mb-3">
            <h4 className="text-xs font-bold text-slate-900">Payment Method Overview</h4>
          </div>
          <div className="flex items-center gap-4">
            {/* Donut SVG */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="none" strokeDasharray="107.44 238.76" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="71.63 238.76" strokeDashoffset="-107.44" />
                <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="35.81 238.76" strokeDashoffset="-179.07" />
                <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="12" fill="none" strokeDasharray="23.88 238.76" strokeDashoffset="-214.88" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-semibold">Total</span>
                <span className="text-[11px] font-black text-slate-900 leading-tight">₹ 1,45,230</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-[11px] flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  UPI
                </span>
                <span className="font-semibold text-slate-900">45% (₹ 65,350)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  COD
                </span>
                <span className="font-semibold text-slate-900">30% (₹ 43,650)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Card
                </span>
                <span className="font-semibold text-slate-900">15% (₹ 21,780)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Net Banking
                </span>
                <span className="font-semibold text-slate-900">10% (₹ 14,450)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Summary */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900">Business Summary</h4>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-600 font-medium">Average Order Value</span>
              </div>
              <div className="text-right">
                <span className="font-black text-slate-900">₹ 1,165.36</span>
                <span className="text-[10px] text-emerald-600 font-bold ml-1.5">↑ 7.2%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Repeat className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-600 font-medium">Repeat Customer Rate</span>
              </div>
              <div className="text-right">
                <span className="font-black text-slate-900">36.8%</span>
                <span className="text-[10px] text-emerald-600 font-bold ml-1.5">↑ 5.6%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-600 font-medium">Total Customers</span>
              </div>
              <div className="text-right">
                <span className="font-black text-slate-900">2,450</span>
                <span className="text-[10px] text-emerald-600 font-bold ml-1.5">↑ 6.1%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                  <UserPlus className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-600 font-medium">New Customers</span>
              </div>
              <div className="text-right">
                <span className="font-black text-slate-900">850</span>
                <span className="text-[10px] text-emerald-600 font-bold ml-1.5">↑ 8.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
