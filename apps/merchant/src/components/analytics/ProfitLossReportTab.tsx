import React, { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  Percent,
  Receipt,
  Info,
  ChevronDown,
  Package,
  Truck,
  Building,
} from 'lucide-react';

export const ProfitLossReportTab: React.FC = () => {
  const [trendPeriod, setTrendPeriod] = useState('Daily');

  return (
    <div className="space-y-3.5">
      {/* 4 KPI Cards Matching 11.1.png */}
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

        {/* Total Expenses */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total Expenses</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 86,780.00</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 8.3%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Net Profit */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Net Profit</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 58,450.00</h4>
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

        {/* Profit Margin */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Profit Margin</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">40.3%</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 3.1%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>
      </div>

      {/* Row 2: Profit & Loss Trend + Profit & Loss Breakdown Matching 11.1.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* P&L Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1">
              <h3 className="text-xs font-bold text-slate-900">Profit & Loss Trend</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Revenue
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Expenses
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> Net Profit
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 border border-slate-200 rounded-lg px-2 py-0.5 bg-slate-50">
                <span>{trendPeriod}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="h-56 w-full pt-3">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>₹ 60K</span>
              <span>₹ 45K</span>
              <span>₹ 30K</span>
              <span>₹ 15K</span>
              <span>₹ 0</span>
            </div>
            <svg className="w-full h-40" viewBox="0 0 600 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pnlRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="pnlExpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="20" y1="30" x2="580" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="20" y1="70" x2="580" y2="70" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="20" y1="110" x2="580" y2="110" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="20" y1="150" x2="580" y2="150" stroke="#e2e8f0" />

              {/* Revenue line (Blue) */}
              <polyline
                fill="url(#pnlRevGrad)"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="30,120 120,95 210,80 300,75 390,30 480,55 570,70"
              />
              {[
                [30, 120],
                [120, 95],
                [210, 80],
                [300, 75],
                [390, 30],
                [480, 55],
                [570, 70],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3.5" fill="#2563eb" />
              ))}

              {/* Expenses line (Rose) */}
              <polyline
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="30,130 120,118 210,110 300,105 390,85 480,95 570,102"
              />
              {[
                [30, 130],
                [120, 118],
                [210, 110],
                [300, 105],
                [390, 85],
                [480, 95],
                [570, 102],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3" fill="#f43f5e" />
              ))}

              {/* Net Profit line (Emerald) */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="30,145 120,130 210,120 300,118 390,95 480,110 570,118"
              />
              {[
                [30, 145],
                [120, 130],
                [210, 120],
                [300, 118],
                [390, 95],
                [480, 110],
                [570, 118],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3.5" fill="#10b981" />
              ))}
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-4">
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

        {/* Profit & Loss Breakdown (1 Col) */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 mb-2.5">
              <h3 className="text-xs font-bold text-slate-900">Profit & Loss Breakdown</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between p-1.5 bg-blue-50/70 rounded-lg text-blue-900 font-bold border border-blue-100/60">
                <span>Total Revenue</span>
                <span>1,45,230.00</span>
              </div>
              <div className="flex justify-between px-2 py-0.5 text-slate-600">
                <span>Product Sales</span>
                <span>1,38,500.00</span>
              </div>
              <div className="flex justify-between px-2 py-0.5 text-slate-600">
                <span>Other Income</span>
                <span>6,730.00</span>
              </div>

              <div className="flex justify-between p-1.5 bg-rose-50/70 rounded-lg text-rose-900 font-bold border border-rose-100/60 mt-1">
                <span>Total Expenses</span>
                <span>₹ 86,780.00</span>
              </div>
              <div className="flex justify-between px-2 py-0.5 text-slate-600">
                <span>Cost of Goods Sold (COGS)</span>
                <span>52,400.00</span>
              </div>
              <div className="flex justify-between px-2 py-0.5 text-slate-600">
                <span>Shipping Charges</span>
                <span>₹ 8,450.00</span>
              </div>
              <div className="flex justify-between px-2 py-0.5 text-slate-600">
                <span>Commission & Fees</span>
                <span>12,630.00</span>
              </div>
              <div className="flex justify-between px-2 py-0.5 text-slate-600">
                <span>Other Expenses</span>
                <span>13,300.00</span>
              </div>

              <div className="flex justify-between p-1.5 bg-emerald-50/70 rounded-lg text-emerald-900 font-bold border border-emerald-100/60 mt-1">
                <span>Net Profit</span>
                <span>₹ 58,450.00</span>
              </div>
              <div className="flex justify-between px-2 py-0.5 text-slate-900 font-bold">
                <span>Profit Margin</span>
                <span className="text-blue-600 font-black">40.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Revenue vs Expenses + Top Expense Categories Matching 11.1.png */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Revenue vs Expenses Donut SVG */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1 mb-3">
            <h4 className="text-xs font-bold text-slate-900">Revenue vs Expenses</h4>
            <Info className="w-3 h-3 text-slate-400" />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="12" fill="none" strokeDasharray="227 238.76" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="11 238.76" strokeDashoffset="-227" />
                <circle cx="50" cy="50" r="38" stroke="#f43f5e" strokeWidth="12" fill="none" strokeDasharray="142 238.76" strokeDashoffset="-140" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-semibold">Total</span>
                <span className="text-xs font-black text-slate-900">₹ 1,45,230</span>
              </div>
            </div>

            <div className="space-y-2 text-[11px] flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Product Sales
                </span>
                <span className="font-semibold text-slate-900">95.4% (₹ 1,38,500)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Other Income
                </span>
                <span className="font-semibold text-slate-900">4.6% (₹ 6,730)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Total Expenses
                </span>
                <span className="font-semibold text-slate-900">59.8% (₹ 86,780)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Expense Categories Table */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-slate-900">Top Expense Categories</h4>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1.5 font-medium">Category</th>
                  <th className="pb-1.5 font-medium text-right">Amount (₹)</th>
                  <th className="pb-1.5 font-medium text-right">% of Expenses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-slate-900">Cost of Goods Sold (COGS)</span>
                  </td>
                  <td className="py-2 text-right font-semibold">52,400.00</td>
                  <td className="py-2 text-right font-medium">60.4%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                      <Percent className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-slate-900">Commission & Fees</span>
                  </td>
                  <td className="py-2 text-right font-semibold">12,630.00</td>
                  <td className="py-2 text-right font-medium">14.6%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                      <Receipt className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-slate-900">Other Expenses</span>
                  </td>
                  <td className="py-2 text-right font-semibold">13,300.00</td>
                  <td className="py-2 text-right font-medium">15.3%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-slate-900">Shipping Charges</span>
                  </td>
                  <td className="py-2 text-right font-semibold">8,450.00</td>
                  <td className="py-2 text-right font-medium">9.7%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
