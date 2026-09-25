import React from 'react';
import {
  CreditCard,
  TrendingUp,
  ShoppingBag,
  Store,
  Receipt,
  Download,
  FileSpreadsheet,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';
import { useAnalyticsStore, AnalyticsReportTab } from '../../stores/analyticsStore.js';

export const AnalyticsOverviewTab: React.FC = () => {
  const { setActiveTab } = useAnalyticsStore();

  return (
    <div className="space-y-6">
      {/* 5 KPI Summary Cards Matching 12.0.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Revenue</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,45,230.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <span>&uarr; 12.5%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Profit */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Profit</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 28,450.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <span>&uarr; 15.2%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Orders</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">1,245</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <span>&uarr; 8.7%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Offline Billing */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Offline Billing</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 32,450.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <span>&uarr; 10.1%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Tax (GST) */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Tax (GST)</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 12,450.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center gap-1">
            <span>&uarr; 9.3%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>
      </div>

      {/* Row 2: Profit & Loss Overview + Revenue Trend + Orders Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profit & Loss Overview */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Profit & Loss Overview</h3>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Revenue</span>
                <span className="font-semibold text-slate-900">₹ 1,45,230.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total COGS</span>
                <span className="font-semibold text-slate-900">₹ 86,780.00</span>
              </div>
              <div className="flex justify-between text-slate-600 font-bold border-t border-slate-100 pt-1.5">
                <span className="text-emerald-700">Gross Profit</span>
                <span className="text-emerald-700">₹ 58,450.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Expenses</span>
                <span className="font-semibold text-slate-900">₹ 30,000.00</span>
              </div>
              <div className="flex justify-between text-slate-600 font-bold border-t border-slate-100 pt-1.5">
                <span className="text-emerald-700">Net Profit</span>
                <span className="text-emerald-700">₹ 28,450.00</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Profit Margin</span>
            <span className="text-sm font-black text-slate-900">19.59%</span>
          </div>
        </div>

        {/* Revenue Trend SVG Chart */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">Revenue Trend</h3>
            <span className="text-[11px] font-semibold text-slate-500 border border-slate-200 rounded-lg px-2 py-0.5">
              Daily
            </span>
          </div>

          <div className="h-40 w-full pt-4">
            <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="10,95 55,75 105,45 155,48 205,20 250,35 290,70"
              />
              <circle cx="10" cy="95" r="3.5" fill="#2563eb" />
              <circle cx="55" cy="75" r="3.5" fill="#2563eb" />
              <circle cx="105" cy="45" r="3.5" fill="#2563eb" />
              <circle cx="155" cy="48" r="3.5" fill="#2563eb" />
              <circle cx="205" cy="20" r="3.5" fill="#2563eb" />
              <circle cx="250" cy="35" r="3.5" fill="#2563eb" />
              <circle cx="290" cy="70" r="3.5" fill="#2563eb" />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
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
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">Orders Trend</h3>
            <span className="text-[11px] font-semibold text-slate-500 border border-slate-200 rounded-lg px-2 py-0.5">
              Daily
            </span>
          </div>

          <div className="h-40 w-full pt-4">
            <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="10,90 55,75 105,35 155,45 205,25 250,35 290,75"
              />
              <circle cx="10" cy="90" r="3.5" fill="#10b981" />
              <circle cx="55" cy="75" r="3.5" fill="#10b981" />
              <circle cx="105" cy="35" r="3.5" fill="#10b981" />
              <circle cx="155" cy="45" r="3.5" fill="#10b981" />
              <circle cx="205" cy="25" r="3.5" fill="#10b981" />
              <circle cx="250" cy="35" r="3.5" fill="#10b981" />
              <circle cx="290" cy="75" r="3.5" fill="#10b981" />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
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

      {/* Row 3: 5 Module Reports Preview Grid Matching 12.0.png */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Product Wise Report */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">Product Wise Report</h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-700">
                <span className="truncate">Men's Cotton Shirt</span>
                <span className="font-semibold">₹ 25,450</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="truncate">Women's Kurti</span>
                <span className="font-semibold">₹ 18,750</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="truncate">Denim Jeans</span>
                <span className="font-semibold">₹ 15,200</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="truncate">Casual Shoes</span>
                <span className="font-semibold">₹ 12,980</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="truncate">T-Shirt (Pack of 2)</span>
                <span className="font-semibold">₹ 10,450</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('product_wise')}
            className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between w-full pt-2 border-t border-slate-100"
          >
            <span>View Full Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Orders Report */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">Total Orders Report</h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-700">
                <span>Delivered</span>
                <span className="font-semibold">890 (₹1,02,450)</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Pending</span>
                <span className="font-semibold">180 (₹18,750)</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Cancelled</span>
                <span className="font-semibold">95 (₹9,250)</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Returned</span>
                <span className="font-semibold">80 (₹12,780)</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('total_orders')}
            className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between w-full pt-2 border-t border-slate-100"
          >
            <span>View Full Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Offline Billing Report */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">Offline Billing Report</h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-700">
                <span>Cash</span>
                <span className="font-semibold">120 (₹18,250)</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>UPI</span>
                <span className="font-semibold">85 (₹9,800)</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Card</span>
                <span className="font-semibold">40 (₹4,400)</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('offline_billing')}
            className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between w-full pt-2 border-t border-slate-100"
          >
            <span>View Full Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* GST Report */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">GST Report</h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-700">
                <span>5% Slab</span>
                <span className="font-semibold">₹ 1,622.50</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>12% Slab</span>
                <span className="font-semibold">₹ 5,493.60</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>18% Slab</span>
                <span className="font-semibold">₹ 7,077.60</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>28% Slab</span>
                <span className="font-semibold">₹ 3,416.00</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('gst_report')}
            className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between w-full pt-2 border-t border-slate-100"
          >
            <span>View Full Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* High Selling Products */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">High Selling Products</h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-700">
                <span className="truncate">Men's Cotton Shirt</span>
                <span className="font-semibold">320 sold</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="truncate">Women's Kurti</span>
                <span className="font-semibold">280 sold</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="truncate">T-Shirt (Pack of 2)</span>
                <span className="font-semibold">240 sold</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="truncate">Denim Jeans</span>
                <span className="font-semibold">210 sold</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('high_selling')}
            className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between w-full pt-2 border-t border-slate-100"
          >
            <span>View Full Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 4: Top Categories + Payment Method + Business Summary + Download Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Top Categories Donut */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <h4 className="text-sm font-bold text-slate-900 mb-3">Top Categories</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Men's Wear
              </span>
              <span className="font-bold text-slate-900">42% (₹ 61,050)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                Women's Wear
              </span>
              <span className="font-bold text-slate-900">28% (₹ 40,650)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Footwear
              </span>
              <span className="font-bold text-slate-900">15% (₹ 21,780)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Accessories
              </span>
              <span className="font-bold text-slate-900">10% (₹ 14,500)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                Others
              </span>
              <span className="font-bold text-slate-900">5% (₹ 7,250)</span>
            </div>
          </div>
        </div>

        {/* Payment Method Overview */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <h4 className="text-sm font-bold text-slate-900 mb-3">Payment Method Overview</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                UPI
              </span>
              <span className="font-bold text-slate-900">45% (₹ 65,350)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                COD
              </span>
              <span className="font-bold text-slate-900">30% (₹ 43,650)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Card
              </span>
              <span className="font-bold text-slate-900">15% (₹ 21,780)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Net Banking
              </span>
              <span className="font-bold text-slate-900">10% (₹ 14,450)</span>
            </div>
          </div>
        </div>

        {/* Business Summary */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <h4 className="text-sm font-bold text-slate-900 mb-2">Business Summary</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Average Order Value</span>
              <span className="font-bold text-slate-900">₹ 1,165.36</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Repeat Customer Rate</span>
              <span className="font-bold text-slate-900">36.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Customers</span>
              <span className="font-bold text-slate-900">2,450</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">New Customers</span>
              <span className="font-bold text-slate-900">850</span>
            </div>
          </div>
        </div>

        {/* Download Center */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Download Center</h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Download various reports in your preferred format.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  Profit & Loss Report
                </span>
                <span className="text-[10px] text-slate-400 font-mono">PDF, Excel</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                  Product Wise Report
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Excel, CSV</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
                  GST Report
                </span>
                <span className="text-[10px] text-slate-400 font-mono">PDF, Excel</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
                  Orders Report
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Excel, CSV</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => alert('Opening export center')}
            className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between pt-2 border-t border-slate-100"
          >
            <span>View All Reports</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
