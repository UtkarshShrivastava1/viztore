import React, { useState } from 'react';
import {
  Landmark,
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

export const SettlementsReportTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Settlement Status');
  const [paymentFilter, setPaymentFilter] = useState('All Payment Methods');

  const settlementsData = [
    { id: 1, setId: '#SET-000342', date: '16 May 2024, 07:24 PM', period: '10 May - 16 May 2024', orders: 28, amount: 12450, status: 'Processed', method: 'Bank Transfer' },
    { id: 2, setId: '#SET-000341', date: '15 May 2024, 06:18 PM', period: '09 May - 15 May 2024', orders: 26, amount: 8950, status: 'Processed', method: 'UPI' },
    { id: 3, setId: '#SET-000340', date: '14 May 2024, 05:45 PM', period: '08 May - 14 May 2024', orders: 31, amount: 11200, status: 'Pending', method: 'Bank Transfer' },
    { id: 4, setId: '#SET-000339', date: '13 May 2024, 08:12 PM', period: '07 May - 13 May 2024', orders: 22, amount: 6780, status: 'Processed', method: 'UPI' },
    { id: 5, setId: '#SET-000338', date: '12 May 2024, 07:36 PM', period: '06 May - 12 May 2024', orders: 24, amount: 9450, status: 'Processed', method: 'Bank Transfer' },
    { id: 6, setId: '#SET-000337', date: '11 May 2024, 06:21 PM', period: '05 May - 11 May 2024', orders: 18, amount: 7320, status: 'Processed', method: 'UPI' },
    { id: 7, setId: '#SET-000336', date: '10 May 2024, 08:05 PM', period: '04 May - 10 May 2024', orders: 21, amount: 10850, status: 'Processed', method: 'Bank Transfer' },
    { id: 8, setId: '#SET-000335', date: '09 May 2024, 04:18 PM', period: '03 May - 09 May 2024', orders: 16, amount: 5940, status: 'Processed', method: 'UPI' },
    { id: 9, setId: '#SET-000334', date: '08 May 2024, 07:50 PM', period: '26 Apr - 02 May 2024', orders: 19, amount: 8100, status: 'Processed', method: 'Bank Transfer' },
    { id: 10, setId: '#SET-000333', date: '07 May 2024, 06:14 PM', period: '19 Apr - 25 Apr 2024', orders: 14, amount: 6430, status: 'Processed', method: 'UPI' },
  ];

  const filtered = settlementsData.filter((s) => {
    if (searchTerm && !s.setId.toLowerCase().includes(searchTerm.toLowerCase()) && !s.period.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'All Settlement Status' && s.status !== statusFilter) {
      return false;
    }
    if (paymentFilter !== 'All Payment Methods' && s.method !== paymentFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-3.5">
      {/* 4 KPI Cards Matching 11.7.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Settlements */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total Settlements</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,12,450</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 15.4%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Settlements Processed */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Settlements Processed</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">24</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 20.0%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Settlement Pending */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Settlement Pending</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 8,650</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 8.3%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Settlement Failed */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Settlement Failed</span>
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

      {/* Row 2: Settlement Trend + Settlement Status Matching 11.7.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Trend Chart (2 cols) */}
        <div className="lg:col-span-2 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <h3 className="text-xs font-bold text-slate-900">Settlement Trend</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Settlement Amount (₹)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-300" /> Settlements Count
                </span>
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
                { x: 45, h: 28 },
                { x: 135, h: 36 },
                { x: 225, h: 42 },
                { x: 315, h: 48 },
                { x: 405, h: 76 },
                { x: 495, h: 56 },
                { x: 555, h: 48 },
              ].map((bar, i) => (
                <rect key={i} x={bar.x} y={120 - bar.h} width={24} height={bar.h} rx={2} fill="#93c5fd" />
              ))}
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="57,80 147,72 237,72 327,65 417,30 507,48 567,58"
              />
              {[
                [57, 80],
                [147, 72],
                [237, 72],
                [327, 65],
                [417, 30],
                [507, 48],
                [567, 58],
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

        {/* Settlement Status Donut */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1 mb-3">
            <h4 className="text-xs font-bold text-slate-900">Settlement Status</h4>
            <Info className="w-3 h-3 text-slate-400" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="204.6 238.76" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="34.1 238.76" strokeDashoffset="-204.6" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-semibold">Total</span>
                <span className="text-[11px] font-black text-slate-900 leading-tight">₹ 1,12,450</span>
              </div>
            </div>

            <div className="space-y-2 text-[11px] flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Processed
                </span>
                <span className="font-semibold text-slate-900">24 (85.7%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Pending
                </span>
                <span className="font-semibold text-slate-900">4 (14.3%)</span>
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
              placeholder="Search by settlement ID, order ID, bank account..."
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
              <option value="All Settlement Status">All Settlement Status</option>
              <option value="Processed">Processed</option>
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
              setStatusFilter('All Settlement Status');
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
              <h3 className="text-xs font-bold text-slate-900">Settlements</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-semibold bg-slate-50/50">
                    <th className="py-2 px-2.5">#</th>
                    <th className="py-2 px-2.5">Settlement ID</th>
                    <th className="py-2 px-2.5">Date & Time</th>
                    <th className="py-2 px-2.5">Settlement Period</th>
                    <th className="py-2 px-2.5 text-right">Orders</th>
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
                      <td className="py-2 px-2.5 font-bold text-blue-600 font-mono">{item.setId}</td>
                      <td className="py-2 px-2.5 text-slate-500">{item.date}</td>
                      <td className="py-2 px-2.5 text-slate-600">{item.period}</td>
                      <td className="py-2 px-2.5 text-right font-medium text-slate-700">{item.orders}</td>
                      <td className="py-2 px-2.5 text-right font-semibold text-slate-900">
                        ₹ {item.amount.toLocaleString('en-IN')}.00
                      </td>
                      <td className="py-2 px-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Processed'
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
            <span>Showing 1 - 10 of 24 settlements</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-400">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-semibold">1</button>
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">2</button>
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">3</button>
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
          {/* Settlements by Payment Method */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1 mb-2.5">
              <h4 className="text-xs font-bold text-slate-900">Settlements by Payment Method</h4>
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
                  <td className="py-2 text-right font-semibold">69.8%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg font-bold text-[10px]">UP</div>
                    <span className="font-medium text-slate-900">UPI</span>
                  </td>
                  <td className="py-2 text-right font-medium">28,320</td>
                  <td className="py-2 text-right font-semibold">25.2%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                      <Building className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-900">Card</span>
                  </td>
                  <td className="py-2 text-right font-medium">5,680</td>
                  <td className="py-2 text-right font-semibold">5.0%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg font-bold text-[10px]">CA</div>
                    <span className="font-medium text-slate-900">Cash</span>
                  </td>
                  <td className="py-2 text-right font-medium">0</td>
                  <td className="py-2 text-right font-semibold">0.0%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Recent Settlements */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-slate-900">Recent Settlements</h4>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>

            <div className="space-y-2 text-[11px]">
              {[
                { id: '#SET-000342', amount: '12,450', status: 'Processed', date: '16 May, 07:24 PM' },
                { id: '#SET-000341', amount: '8,950', status: 'Processed', date: '15 May, 06:18 PM' },
                { id: '#SET-000340', amount: '11,200', status: 'Pending', date: '14 May, 05:45 PM' },
                { id: '#SET-000339', amount: '6,780', status: 'Processed', date: '13 May, 08:12 PM' },
                { id: '#SET-000338', amount: '9,450', status: 'Processed', date: '12 May, 07:36 PM' },
              ].map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50/70">
                  <div>
                    <span className="font-bold text-blue-600 font-mono block">{s.id}</span>
                    <span className="text-[10px] text-slate-400">{s.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-900 block">₹ {s.amount}</span>
                    <span className={`text-[10px] font-bold ${s.status === 'Processed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {s.status}
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
