import React from 'react';
import {
  CreditCard,
  TrendingUp,
  Wallet,
  PieChart,
  Info,
} from 'lucide-react';

export const ProfitLossReportTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 4 KPI Cards Matching 12.1.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 12.5% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Gross Profit */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Gross Profit</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 58,450.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 15.2% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Net Profit */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Net Profit</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 28,450.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 15.2% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Profit Margin */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Profit Margin</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">19.59%</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 2.15% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>
      </div>

      {/* Main Grid: P&L Statement (Left 2 Cols) vs Right Charts (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profit & Loss Statement Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Profit & Loss Statement</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </h3>
          </div>

          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-2.5 px-4">Particulars</th>
                  <th className="py-2.5 px-4 text-right">
                    This Period <span className="block text-[9px] font-normal">10 May - 16 May 2024</span>
                  </th>
                  <th className="py-2.5 px-4 text-right">
                    Previous Period <span className="block text-[9px] font-normal">03 May - 09 May 2024</span>
                  </th>
                  <th className="py-2.5 px-4 text-right">Change (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* Income */}
                <tr className="bg-slate-50/70 font-bold text-slate-900">
                  <td colSpan={4} className="py-2 px-4 text-[11px] uppercase">
                    Income
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 pl-6">Total Revenue</td>
                  <td className="py-2.5 px-4 text-right font-medium">₹ 1,45,230.00</td>
                  <td className="py-2.5 px-4 text-right text-slate-500">₹ 1,29,050.00</td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-600">&uarr; 12.54%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 pl-6">Other Income</td>
                  <td className="py-2.5 px-4 text-right font-medium">₹ 2,450.00</td>
                  <td className="py-2.5 px-4 text-right text-slate-500">₹ 1,950.00</td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-600">&uarr; 25.64%</td>
                </tr>
                <tr className="font-bold text-slate-900 bg-slate-50/40">
                  <td className="py-2.5 px-4">Total Income</td>
                  <td className="py-2.5 px-4 text-right">₹ 1,47,680.00</td>
                  <td className="py-2.5 px-4 text-right text-slate-500">₹ 1,31,000.00</td>
                  <td className="py-2.5 px-4 text-right text-emerald-600">&uarr; 12.73%</td>
                </tr>

                {/* Expenses */}
                <tr className="bg-slate-50/70 font-bold text-slate-900">
                  <td colSpan={4} className="py-2 px-4 text-[11px] uppercase">
                    Expenses
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 pl-6">Cost of Goods Sold (COGS)</td>
                  <td className="py-2.5 px-4 text-right font-medium">₹ 86,780.00</td>
                  <td className="py-2.5 px-4 text-right text-slate-500">₹ 74,650.00</td>
                  <td className="py-2.5 px-4 text-right text-rose-600">&uarr; 16.27%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 pl-6">Operating Expenses</td>
                  <td className="py-2.5 px-4 text-right font-medium">₹ 18,450.00</td>
                  <td className="py-2.5 px-4 text-right text-slate-500">₹ 16,230.00</td>
                  <td className="py-2.5 px-4 text-right text-rose-600">&uarr; 13.67%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 pl-6">Employee Expenses</td>
                  <td className="py-2.5 px-4 text-right font-medium">₹ 6,240.00</td>
                  <td className="py-2.5 px-4 text-right text-slate-500">₹ 5,620.00</td>
                  <td className="py-2.5 px-4 text-right text-rose-600">&uarr; 11.03%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 pl-6">Marketing Expenses</td>
                  <td className="py-2.5 px-4 text-right font-medium">₹ 3,180.00</td>
                  <td className="py-2.5 px-4 text-right text-slate-500">₹ 2,890.00</td>
                  <td className="py-2.5 px-4 text-right text-rose-600">&uarr; 10.03%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 pl-6">Other Expenses</td>
                  <td className="py-2.5 px-4 text-right font-medium">₹ 2,580.00</td>
                  <td className="py-2.5 px-4 text-right text-slate-500">₹ 2,360.00</td>
                  <td className="py-2.5 px-4 text-right text-rose-600">&uarr; 9.32%</td>
                </tr>
                <tr className="font-bold text-slate-900 bg-slate-50/40">
                  <td className="py-2.5 px-4">Total Expenses</td>
                  <td className="py-2.5 px-4 text-right">₹ 1,17,230.00</td>
                  <td className="py-2.5 px-4 text-right text-slate-500">₹ 1,01,750.00</td>
                  <td className="py-2.5 px-4 text-right text-rose-600">&uarr; 15.21%</td>
                </tr>

                {/* Summaries */}
                <tr className="font-bold text-emerald-800 bg-emerald-50/50">
                  <td className="py-3 px-4">Gross Profit</td>
                  <td className="py-3 px-4 text-right">₹ 58,450.00</td>
                  <td className="py-3 px-4 text-right">₹ 44,630.00</td>
                  <td className="py-3 px-4 text-right text-emerald-700">&uarr; 30.96%</td>
                </tr>
                <tr className="font-semibold text-slate-800">
                  <td className="py-2.5 px-4">Net Profit Before Tax</td>
                  <td className="py-2.5 px-4 text-right">₹ 30,450.00</td>
                  <td className="py-2.5 px-4 text-right text-slate-500">₹ 24,210.00</td>
                  <td className="py-2.5 px-4 text-right text-emerald-600">&uarr; 25.78%</td>
                </tr>
                <tr className="text-slate-600">
                  <td className="py-2.5 px-4">Tax (Estimated)</td>
                  <td className="py-2.5 px-4 text-right">₹ 2,000.00</td>
                  <td className="py-2.5 px-4 text-right text-slate-500">₹ 1,760.00</td>
                  <td className="py-2.5 px-4 text-right text-rose-600">&uarr; 13.64%</td>
                </tr>
                <tr className="font-black text-slate-900 bg-blue-50/40 text-sm">
                  <td className="py-3.5 px-4">Net Profit</td>
                  <td className="py-3.5 px-4 text-right text-blue-700">₹ 28,450.00</td>
                  <td className="py-3.5 px-4 text-right text-slate-600">₹ 22,450.00</td>
                  <td className="py-3.5 px-4 text-right text-emerald-600">&uarr; 26.73%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-100 text-[11px] text-slate-400 bg-slate-50/50">
            All amounts are shown in INR.
          </div>
        </div>

        {/* Right Column: Profit Trend + Income vs Expenses + Expense Breakdown */}
        <div className="space-y-6">
          {/* Profit Trend Chart */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-900 mb-3">Profit Trend</h4>
            <div className="h-36 w-full">
              <svg className="w-full h-full" viewBox="0 0 250 100" preserveAspectRatio="none">
                {/* Previous Period Dashed */}
                <polyline
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  points="10,80 50,75 90,65 130,60 170,50 210,65 240,75"
                />
                {/* This Period Solid Blue */}
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  points="10,75 50,65 90,45 130,42 170,20 210,35 240,60"
                />
              </svg>
              <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                <span>10 May</span>
                <span>12 May</span>
                <span>14 May</span>
                <span>16 May</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-600 mt-2">
              <span className="flex items-center gap-1 font-semibold text-blue-600">
                &mdash; This Period
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                - - - Previous Period
              </span>
            </div>
          </div>

          {/* Income vs Expenses Donut */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-900 mb-3">Income vs Expenses</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Total Income
                </span>
                <span className="font-bold text-slate-900">₹ 1,47,680.00 (100%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Total Expenses
                </span>
                <span className="font-bold text-slate-900">₹ 1,17,230.00 (79.41%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  Net Profit
                </span>
                <span className="font-bold text-slate-900">₹ 28,450.00 (19.59%)</span>
              </div>
            </div>
          </div>

          {/* Expense Breakdown Donut */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-900 mb-3">Expense Breakdown</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Cost of Goods Sold (COGS)
                </span>
                <span className="font-bold text-slate-900">74.02% (₹ 86,780)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Operating Expenses
                </span>
                <span className="font-bold text-slate-900">15.76% (₹ 18,450)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Employee Expenses
                </span>
                <span className="font-bold text-slate-900">5.32% (₹ 6,240)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Marketing Expenses
                </span>
                <span className="font-bold text-slate-900">2.71% (₹ 3,180)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  Other Expenses
                </span>
                <span className="font-bold text-slate-900">2.20% (₹ 2,580)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
