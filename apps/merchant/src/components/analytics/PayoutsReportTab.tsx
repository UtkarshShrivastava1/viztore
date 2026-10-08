import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  ChevronDown,
  Info,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  Building,
} from 'lucide-react';

export const PayoutsReportTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Payout Status');
  const [paymentFilter, setPaymentFilter] = useState('All Payment Methods');

  const payoutsData = [
    { id: 1, payoutId: '#PAY-000342', date: '16 May 2024, 07:24 PM', reference: 'ORD-001245', amount: 12450, status: 'Paid', method: 'Bank Transfer' },
    { id: 2, payoutId: '#PAY-000341', date: '16 May 2024, 06:18 PM', reference: 'ORD-001244', amount: 8950, status: 'Paid', method: 'UPI' },
    { id: 3, payoutId: '#PAY-000340', date: '16 May 2024, 05:45 PM', reference: 'ORD-001243', amount: 11200, status: 'Pending', method: 'Bank Transfer' },
    { id: 4, payoutId: '#PAY-000339', date: '15 May 2024, 08:12 PM', reference: 'ORD-001242', amount: 6780, status: 'Paid', method: 'UPI' },
    { id: 5, payoutId: '#PAY-000338', date: '15 May 2024, 07:36 PM', reference: 'ORD-001241', amount: 9450, status: 'Paid', method: 'Bank Transfer' },
    { id: 6, payoutId: '#PAY-000337', date: '15 May 2024, 06:21 PM', reference: 'ORD-001240', amount: 7320, status: 'Pending', method: 'UPI' },
    { id: 7, payoutId: '#PAY-000336', date: '14 May 2024, 08:05 PM', reference: 'ORD-001239', amount: 10850, status: 'Paid', method: 'Bank Transfer' },
    { id: 8, payoutId: '#PAY-000335', date: '14 May 2024, 04:18 PM', reference: 'ORD-001238', amount: 5940, status: 'Paid', method: 'UPI' },
    { id: 9, payoutId: '#PAY-000334', date: '13 May 2024, 07:50 PM', reference: 'ORD-001237', amount: 8100, status: 'Paid', method: 'Bank Transfer' },
    { id: 10, payoutId: '#PAY-000333', date: '13 May 2024, 06:14 PM', reference: 'ORD-001236', amount: 6430, status: 'Paid', method: 'UPI' },
  ];

  const filtered = payoutsData.filter((p) => {
    if (searchTerm && !p.payoutId.toLowerCase().includes(searchTerm.toLowerCase()) && !p.reference.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'All Payout Status' && p.status !== statusFilter) {
      return false;
    }
    if (paymentFilter !== 'All Payment Methods' && p.method !== paymentFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-3.5">
      {/* 4 KPI Cards Matching 11.6.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Payouts */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total Payouts</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,28,450</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 14.2%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Paid Payouts */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Paid Payouts</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,12,300</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 16.8%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Pending Payouts */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Pending Payouts</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 16,150</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 6.3%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Failed Payouts */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Failed Payouts</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 0</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold mt-2.5">
            — 0% vs 03 May - 09 May 2024
          </p>
        </div>
      </div>

      {/* Row 2: Payout Trend + Payout Status Matching 11.6.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Trend Chart (2 cols) */}
        <div className="lg:col-span-2 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <h3 className="text-xs font-bold text-slate-900">Payout Trend</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                <span className="w-2 h-2 rounded-full bg-blue-600" /> Payout Amount (₹)
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 border border-slate-200 rounded-lg px-2 py-0.5 bg-slate-50">
                <span>Daily</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="h-44 w-full pt-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>₹ 25K</span>
              <span>₹ 20K</span>
              <span>₹ 15K</span>
              <span>₹ 10K</span>
              <span>₹ 5K</span>
              <span>₹ 0</span>
            </div>
            <svg className="w-full h-32" viewBox="0 0 600 130" preserveAspectRatio="none">
              {[
                { x: 45, h: 25 },
                { x: 135, h: 42 },
                { x: 225, h: 42 },
                { x: 315, h: 48 },
                { x: 405, h: 72 },
                { x: 495, h: 52 },
                { x: 555, h: 45 },
              ].map((bar, i) => (
                <rect key={i} x={bar.x} y={120 - bar.h} width={24} height={bar.h} rx={2} fill="#93c5fd" />
              ))}
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="57,95 147,78 237,78 327,72 417,35 507,55 567,65"
              />
              {[
                [57, 95],
                [147, 78],
                [237, 78],
                [327, 72],
                [417, 35],
                [507, 55],
                [567, 65],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3.5" fill="#2563eb" />
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

        {/* Payout Status Donut */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1 mb-3">
            <h4 className="text-xs font-bold text-slate-900">Payout Status</h4>
            <Info className="w-3 h-3 text-slate-400" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="208.7 238.76" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="30.1 238.76" strokeDashoffset="-208.7" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-semibold">Total</span>
                <span className="text-[11px] font-black text-slate-900 leading-tight">₹ 1,28,450</span>
              </div>
            </div>

            <div className="space-y-2 text-[11px] flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Paid
                </span>
                <span className="font-semibold text-slate-900">1,12,300 (87.4%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Pending
                </span>
                <span className="font-semibold text-slate-900">16,150 (12.6%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Failed
                </span>
                <span className="font-semibold text-slate-900">0 (0.0%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[260px] flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by payout ID, order ID, bank account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All Payout Status">All Payout Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All Payment Methods">All Payment Methods</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>10 May 2024 - 16 May 2024</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All Payout Status');
              setPaymentFilter('All Payment Methods');
            }}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Reset
          </button>
          <button className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs">
            Apply
          </button>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left Table (8 Cols) */}
        <div className="lg:col-span-8 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 mb-3">
              <h3 className="text-xs font-bold text-slate-900">Payouts</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-semibold bg-slate-50/50">
                    <th className="py-2 px-2.5">#</th>
                    <th className="py-2 px-2.5">Payout ID</th>
                    <th className="py-2 px-2.5">Date & Time</th>
                    <th className="py-2 px-2.5">Reference</th>
                    <th className="py-2 px-2.5 text-right">Amount (₹)</th>
                    <th className="py-2 px-2.5">Status</th>
                    <th className="py-2 px-2.5">Payment Method</th>
                    <th className="py-2 px-2.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-2.5 font-medium text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-2.5 font-bold text-blue-600 font-mono">{item.payoutId}</td>
                      <td className="py-2 px-2.5 text-slate-500">{item.date}</td>
                      <td className="py-2 px-2.5 font-mono text-slate-600">{item.reference}</td>
                      <td className="py-2 px-2.5 text-right font-semibold text-slate-900">
                        ₹ {item.amount.toLocaleString('en-IN')}.00
                      </td>
                      <td className="py-2 px-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 text-slate-600">{item.method}</td>
                      <td className="py-2 px-2.5 text-center">
                        <button className="text-slate-400 hover:text-slate-600 p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Showing 1 - 10 of 156 payouts</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-400">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-semibold">1</button>
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">2</button>
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">3</button>
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">4</button>
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">5</button>
              <span className="px-1">...</span>
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">16</button>
              <button className="p-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-400">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1 ml-2">
                <span>Show</span>
                <select className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-[11px]">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Payouts by Payment Method */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1 mb-2.5">
              <h4 className="text-xs font-bold text-slate-900">Payouts by Payment Method</h4>
              <Info className="w-3 h-3 text-slate-400" />
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1.5">Payment Method</th>
                  <th className="pb-1.5 text-right">Amount (₹)</th>
                  <th className="pb-1.5 text-right">% Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                      <Building className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-900">Bank Transfer</span>
                  </td>
                  <td className="py-2 text-right font-medium">78,450</td>
                  <td className="py-2 text-right font-semibold">61.1%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg font-bold text-[10px]">UP</div>
                    <span className="font-medium text-slate-900">UPI</span>
                  </td>
                  <td className="py-2 text-right font-medium">38,120</td>
                  <td className="py-2 text-right font-semibold">29.7%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                      <CreditCard className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-900">Card</span>
                  </td>
                  <td className="py-2 text-right font-medium">8,950</td>
                  <td className="py-2 text-right font-semibold">7.0%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg font-bold text-[10px]">CA</div>
                    <span className="font-medium text-slate-900">Cash</span>
                  </td>
                  <td className="py-2 text-right font-medium">2,930</td>
                  <td className="py-2 text-right font-semibold">2.2%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Recent Payouts */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-slate-900">Recent Payouts</h4>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>

            <div className="space-y-2 text-[11px]">
              {[
                { id: '#PAY-000342', amount: '12,450', status: 'Paid', date: '16 May, 07:24 PM' },
                { id: '#PAY-000341', amount: '8,950', status: 'Paid', date: '16 May, 06:18 PM' },
                { id: '#PAY-000340', amount: '11,200', status: 'Pending', date: '16 May, 05:45 PM' },
                { id: '#PAY-000339', amount: '6,780', status: 'Paid', date: '15 May, 08:12 PM' },
                { id: '#PAY-000338', amount: '9,450', status: 'Paid', date: '15 May, 07:36 PM' },
              ].map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50/70">
                  <div>
                    <span className="font-bold text-blue-600 font-mono block">{p.id}</span>
                    <span className="text-[10px] text-slate-400">{p.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-900 block">₹ {p.amount}</span>
                    <span className={`text-[10px] font-bold ${p.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
