import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Wallet,
  CheckCircle2,
  XCircle,
  Search,
  ChevronDown,
  Info,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  ShoppingBag,
  RotateCcw,
  CreditCard,
  Sliders,
} from 'lucide-react';

export const TransactionsReportTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Transaction Types');
  const [paymentFilter, setPaymentFilter] = useState('All Payment Methods');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const transactionsData = [
    { id: 1, txnId: '#TXN-000842', date: '16 May 2024, 07:24 PM', type: 'Order Payment', orderId: '#ORD-001245', customer: 'Rahul Sharma', payment: 'UPI', amount: 2450, status: 'Success' },
    { id: 2, txnId: '#TXN-000841', date: '16 May 2024, 06:18 PM', type: 'Order Payment', orderId: '#ORD-001244', customer: 'Walk-in Customer', payment: 'Card', amount: 1980, status: 'Success' },
    { id: 3, txnId: '#TXN-000840', date: '16 May 2024, 05:45 PM', type: 'Order Payment', orderId: '#ORD-001243', customer: 'Priya Verma', payment: 'UPI', amount: 3000, status: 'Success' },
    { id: 4, txnId: '#TXN-000839', date: '15 May 2024, 08:12 PM', type: 'Order Payment', orderId: '#ORD-001242', customer: 'Walk-in Customer', payment: 'Cash', amount: 560, status: 'Success' },
    { id: 5, txnId: '#TXN-000838', date: '15 May 2024, 07:36 PM', type: 'Order Payment', orderId: '#ORD-001241', customer: 'Amit Kumar', payment: 'Card', amount: 1450, status: 'Failed' },
    { id: 6, txnId: '#TXN-000837', date: '15 May 2024, 06:21 PM', type: 'Refund', orderId: '#ORD-001240', customer: 'Sneha Patel', payment: 'UPI', amount: -399, status: 'Success' },
    { id: 7, txnId: '#TXN-000836', date: '14 May 2024, 08:05 PM', type: 'Order Payment', orderId: '#ORD-001239', customer: 'Walk-in Customer', payment: 'Cash', amount: 1120, status: 'Success' },
    { id: 8, txnId: '#TXN-000835', date: '14 May 2024, 04:18 PM', type: 'Order Payment', orderId: '#ORD-001238', customer: 'Vikash Singh', payment: 'UPI', amount: 2340, status: 'Success' },
    { id: 9, txnId: '#TXN-000834', date: '13 May 2024, 07:50 PM', type: 'Order Payment', orderId: '#ORD-001237', customer: 'Neha Gupta', payment: 'Card', amount: 890, status: 'Success' },
    { id: 10, txnId: '#TXN-000833', date: '13 May 2024, 06:14 PM', type: 'Order Payment', orderId: '#ORD-001236', customer: 'Walk-in Customer', payment: 'Cash', amount: 680, status: 'Success' },
  ];

  const filtered = transactionsData.filter((t) => {
    if (searchTerm && !t.txnId.toLowerCase().includes(searchTerm.toLowerCase()) && !t.customer.toLowerCase().includes(searchTerm.toLowerCase()) && !t.orderId.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (typeFilter !== 'All Transaction Types' && t.type !== typeFilter) {
      return false;
    }
    if (paymentFilter !== 'All Payment Methods' && t.payment !== paymentFilter) {
      return false;
    }
    if (statusFilter !== 'All Status' && t.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-3.5">
      {/* 4 KPI Cards Matching 11.9.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Transactions */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total Transactions</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">1,842</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 12.6%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Amount */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total Amount</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,38,500.00</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 15.4%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Successful Transactions */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Successful Transactions</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">1,768</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 96.0%</span>
            <span className="text-slate-400 font-normal">success rate</span>
          </p>
        </div>

        {/* Failed Transactions */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Failed Transactions</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">74</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 4.0%</span>
            <span className="text-slate-400 font-normal">failure rate</span>
          </p>
        </div>
      </div>

      {/* Row 2: Transaction Trend + Transactions by Payment Method Matching 11.9.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Trend Chart (2 cols) */}
        <div className="lg:col-span-2 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <h3 className="text-xs font-bold text-slate-900">Transaction Trend</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Transaction Amount (₹)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-300" /> Transactions Count
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

        {/* Transactions by Payment Method Donut */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1 mb-3">
            <h4 className="text-xs font-bold text-slate-900">Transactions by Payment Method</h4>
            <Info className="w-3 h-3 text-slate-400" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="116.0 238.76" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="none" strokeDasharray="67.8 238.76" strokeDashoffset="-116.0" />
                <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="36.3 238.76" strokeDashoffset="-183.8" />
                <circle cx="50" cy="50" r="38" stroke="#ec4899" strokeWidth="12" fill="none" strokeDasharray="18.6 238.76" strokeDashoffset="-220.1" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-semibold">Total</span>
                <span className="text-[11px] font-black text-slate-900 leading-tight">₹ 1,38,500</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  UPI
                </span>
                <span className="font-semibold text-slate-900">48.6% (₹ 67,300)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Card
                </span>
                <span className="font-semibold text-slate-900">28.4% (₹ 39,200)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Cash
                </span>
                <span className="font-semibold text-slate-900">15.2% (₹ 21,000)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  Others
                </span>
                <span className="font-semibold text-slate-900">7.8% (₹ 11,000)</span>
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
              placeholder="Search by transaction ID, order ID, customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All Transaction Types">All Transaction Types</option>
              <option value="Order Payment">Order Payment</option>
              <option value="Refund">Refund</option>
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
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All Status">All Status</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
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
              setTypeFilter('All Transaction Types');
              setPaymentFilter('All Payment Methods');
              setStatusFilter('All Status');
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
              <h3 className="text-xs font-bold text-slate-900">Transactions</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-semibold bg-slate-50/50">
                    <th className="py-2 px-2.5">#</th>
                    <th className="py-2 px-2.5">Transaction ID</th>
                    <th className="py-2 px-2.5">Date & Time</th>
                    <th className="py-2 px-2.5">Type</th>
                    <th className="py-2 px-2.5">Order ID</th>
                    <th className="py-2 px-2.5">Customer</th>
                    <th className="py-2 px-2.5">Payment Method</th>
                    <th className="py-2 px-2.5 text-right">Amount (₹)</th>
                    <th className="py-2 px-2.5">Status</th>
                    <th className="py-2 px-2.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-2.5 font-medium text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-2.5 font-bold text-blue-600 font-mono">{item.txnId}</td>
                      <td className="py-2 px-2.5 text-slate-500">{item.date}</td>
                      <td className="py-2 px-2.5 text-slate-700 font-medium">{item.type}</td>
                      <td className="py-2 px-2.5 font-mono text-blue-600 font-medium">{item.orderId}</td>
                      <td className="py-2 px-2.5 font-semibold text-slate-900">{item.customer}</td>
                      <td className="py-2 px-2.5 text-slate-600">{item.payment}</td>
                      <td className={`py-2 px-2.5 text-right font-semibold ${item.amount < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                        {item.amount < 0 ? `- ₹ ${Math.abs(item.amount).toLocaleString('en-IN')}.00` : `₹ ${item.amount.toLocaleString('en-IN')}.00`}
                      </td>
                      <td className="py-2 px-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Success'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
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
            <span>Showing 1 - 10 of 1,842 transactions</span>
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
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">185</button>
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
          {/* Recent Failed Transactions */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-slate-900">Recent Failed Transactions</h4>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1.5">#</th>
                  <th className="pb-1.5">Txn ID</th>
                  <th className="pb-1.5 text-right">Amount (₹)</th>
                  <th className="pb-1.5">Reason</th>
                  <th className="pb-1.5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-1.5 text-slate-400">1</td>
                  <td className="py-1.5 font-mono text-blue-600">#TXN-000838</td>
                  <td className="py-1.5 text-right font-semibold">1,450.00</td>
                  <td className="py-1.5 text-rose-600 font-medium">Payment Declined</td>
                  <td className="py-1.5 text-right text-slate-400 text-[10px]">15 May, 07:36 PM</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">2</td>
                  <td className="py-1.5 font-mono text-blue-600">#TXN-000821</td>
                  <td className="py-1.5 text-right font-semibold">780.00</td>
                  <td className="py-1.5 text-rose-600 font-medium">Insufficient Balance</td>
                  <td className="py-1.5 text-right text-slate-400 text-[10px]">12 May, 04:12 PM</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">3</td>
                  <td className="py-1.5 font-mono text-blue-600">#TXN-000809</td>
                  <td className="py-1.5 text-right font-semibold">2,300.00</td>
                  <td className="py-1.5 text-rose-600 font-medium">Network Error</td>
                  <td className="py-1.5 text-right text-slate-400 text-[10px]">10 May, 08:21 PM</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">4</td>
                  <td className="py-1.5 font-mono text-blue-600">#TXN-000801</td>
                  <td className="py-1.5 text-right font-semibold">560.00</td>
                  <td className="py-1.5 text-rose-600 font-medium">Invalid UPI ID</td>
                  <td className="py-1.5 text-right text-slate-400 text-[10px]">09 May, 01:45 PM</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">5</td>
                  <td className="py-1.5 font-mono text-blue-600">#TXN-000799</td>
                  <td className="py-1.5 text-right font-semibold">1,120.00</td>
                  <td className="py-1.5 text-rose-600 font-medium">Card Failed</td>
                  <td className="py-1.5 text-right text-slate-400 text-[10px]">08 May, 06:18 PM</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Transactions by Type */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-slate-900">Transactions by Type</h4>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1.5">Type</th>
                  <th className="pb-1.5 text-right">Count</th>
                  <th className="pb-1.5 text-right">Amount (₹)</th>
                  <th className="pb-1.5 text-right">% Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1 bg-blue-50 text-blue-600 rounded">
                      <ShoppingBag className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-900">Order Payment</span>
                  </td>
                  <td className="py-2 text-right font-medium">1,620</td>
                  <td className="py-2 text-right font-semibold">1,42,650</td>
                  <td className="py-2 text-right font-bold text-slate-900">88.4%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1 bg-rose-50 text-rose-600 rounded">
                      <RotateCcw className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-900">Refund</span>
                  </td>
                  <td className="py-2 text-right font-medium">86</td>
                  <td className="py-2 text-right font-semibold text-rose-600">-5,720</td>
                  <td className="py-2 text-right font-bold text-slate-900">3.5%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1 bg-purple-50 text-purple-600 rounded">
                      <CreditCard className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-900">Wallet Top-up</span>
                  </td>
                  <td className="py-2 text-right font-medium">64</td>
                  <td className="py-2 text-right font-semibold">4,500</td>
                  <td className="py-2 text-right font-bold text-slate-900">2.8%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1 bg-emerald-50 text-emerald-600 rounded">
                      <ArrowLeftRight className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-900">Adjustment</span>
                  </td>
                  <td className="py-2 text-right font-medium">42</td>
                  <td className="py-2 text-right font-semibold text-rose-600">-2,930</td>
                  <td className="py-2 text-right font-bold text-slate-900">1.8%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1 bg-slate-100 text-slate-600 rounded">
                      <Sliders className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-900">Others</span>
                  </td>
                  <td className="py-2 text-right font-medium">30</td>
                  <td className="py-2 text-right font-semibold">2,000</td>
                  <td className="py-2 text-right font-bold text-slate-900">1.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
