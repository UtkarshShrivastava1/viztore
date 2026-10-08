import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  Clock,
  XCircle,
  RotateCcw,
  Search,
  ChevronDown,
  Info,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CreditCard,
  Building,
} from 'lucide-react';

export const TotalOrdersReportTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Order Status');
  const [paymentFilter, setPaymentFilter] = useState('All Payment Methods');

  const ordersData = [
    { id: 1, orderId: '#ORD-001245', date: '16 May 2024, 10:24 AM', customer: 'Rahul Sharma', amount: 2450, payment: 'UPI', status: 'Delivered' },
    { id: 2, orderId: '#ORD-001244', date: '16 May 2024, 09:18 AM', customer: 'Priya Verma', amount: 1890, payment: 'Card', status: 'Pending' },
    { id: 3, orderId: '#ORD-001243', date: '15 May 2024, 08:45 PM', customer: 'Amit Kumar', amount: 3250, payment: 'COD', status: 'Delivered' },
    { id: 4, orderId: '#ORD-001242', date: '15 May 2024, 06:12 PM', customer: 'Sneha Patel', amount: 1200, payment: 'UPI', status: 'Cancelled' },
    { id: 5, orderId: '#ORD-001241', date: '15 May 2024, 04:36 PM', customer: 'Vikash Singh', amount: 2990, payment: 'Card', status: 'Delivered' },
    { id: 6, orderId: '#ORD-001240', date: '14 May 2024, 02:15 PM', customer: 'Neha Gupta', amount: 1450, payment: 'UPI', status: 'Returned' },
    { id: 7, orderId: '#ORD-001239', date: '14 May 2024, 11:28 AM', customer: 'Suresh Yadav', amount: 2750, payment: 'COD', status: 'Delivered' },
    { id: 8, orderId: '#ORD-001238', date: '13 May 2024, 07:50 PM', customer: 'Kavita Rao', amount: 1980, payment: 'Card', status: 'Pending' },
    { id: 9, orderId: '#ORD-001237', date: '13 May 2024, 05:14 PM', customer: 'Manoj Kumar', amount: 3100, payment: 'UPI', status: 'Delivered' },
    { id: 10, orderId: '#ORD-001236', date: '13 May 2024, 01:20 PM', customer: 'Pooja Mehta', amount: 890, payment: 'UPI', status: 'Cancelled' },
  ];

  const filteredOrders = ordersData.filter((o) => {
    if (searchTerm && !o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) && !o.customer.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'All Order Status' && o.status !== statusFilter) {
      return false;
    }
    if (paymentFilter !== 'All Payment Methods' && o.payment !== paymentFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-3.5">
      {/* 5 KPI Cards Matching 11.3.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
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

        {/* Delivered Orders */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Delivered Orders</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">890</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 12.5%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Pending Orders */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Pending Orders</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">180</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 6.3%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Cancelled Orders */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Cancelled Orders</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">95</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 4.1%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Returned Orders */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Returned Orders</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">80</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-purple-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 10.2%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>
      </div>

      {/* Row 2: Orders Trend + Order Status Breakdown Matching 11.3.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Orders Trend Chart */}
        <div className="lg:col-span-2 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <h3 className="text-xs font-bold text-slate-900">Orders Trend</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 border border-slate-200 rounded-lg px-2 py-0.5 bg-slate-50">
              <span>Daily</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          <div className="h-44 w-full pt-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>250</span>
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            <svg className="w-full h-32" viewBox="0 0 600 130" preserveAspectRatio="none">
              <defs>
                <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                fill="url(#orderGrad)"
                points="30,110 120,95 210,80 300,75 390,30 480,55 570,70 570,130 30,130"
              />
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="30,110 120,95 210,80 300,75 390,30 480,55 570,70"
              />
              {[
                [30, 110],
                [120, 95],
                [210, 80],
                [300, 75],
                [390, 30],
                [480, 55],
                [570, 70],
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

        {/* Order Status Breakdown Donut */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1 mb-3">
            <h4 className="text-xs font-bold text-slate-900">Order Status Breakdown</h4>
            <Info className="w-3 h-3 text-slate-400" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="170.7 238.76" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="34.6 238.76" strokeDashoffset="-170.7" />
                <circle cx="50" cy="50" r="38" stroke="#f43f5e" strokeWidth="12" fill="none" strokeDasharray="18.1 238.76" strokeDashoffset="-205.3" />
                <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="12" fill="none" strokeDasharray="15.3 238.76" strokeDashoffset="-223.4" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-semibold">Total</span>
                <span className="text-[12px] font-black text-slate-900 leading-tight">1,245</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Delivered
                </span>
                <span className="font-semibold text-slate-900">890 (71.5%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Pending
                </span>
                <span className="font-semibold text-slate-900">180 (14.5%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Cancelled
                </span>
                <span className="font-semibold text-slate-900">95 (7.6%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Returned
                </span>
                <span className="font-semibold text-slate-900">80 (6.4%)</span>
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
              placeholder="Search by Order ID, customer name, product..."
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
              <option value="All Order Status">All Order Status</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
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
              <option value="COD">COD</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All Order Status');
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
              <h3 className="text-xs font-bold text-slate-900">Total Orders</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-semibold bg-slate-50/50">
                    <th className="py-2 px-2.5">#</th>
                    <th className="py-2 px-2.5">Order ID</th>
                    <th className="py-2 px-2.5">Date & Time</th>
                    <th className="py-2 px-2.5">Customer Name</th>
                    <th className="py-2 px-2.5 text-right">Amount (₹)</th>
                    <th className="py-2 px-2.5">Payment Method</th>
                    <th className="py-2 px-2.5">Status</th>
                    <th className="py-2 px-2.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredOrders.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-2.5 font-medium text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-2.5 font-bold text-blue-600 font-mono">{item.orderId}</td>
                      <td className="py-2 px-2.5 text-slate-500">{item.date}</td>
                      <td className="py-2 px-2.5 font-semibold text-slate-900">{item.customer}</td>
                      <td className="py-2 px-2.5 text-right font-semibold text-slate-900">
                        ₹ {item.amount.toLocaleString('en-IN')}.00
                      </td>
                      <td className="py-2 px-2.5 text-slate-600">{item.payment}</td>
                      <td className="py-2 px-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : item.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : item.status === 'Cancelled'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                              : 'bg-purple-50 text-purple-700 border border-purple-200/60'
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
            <span>Showing 1 - 10 of 1,245 orders</span>
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
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">125</button>
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
          {/* Orders by Payment Method */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1 mb-2.5">
              <h4 className="text-xs font-bold text-slate-900">Orders by Payment Method</h4>
              <Info className="w-3 h-3 text-slate-400" />
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1.5">Payment Method</th>
                  <th className="pb-1.5 text-right">Orders</th>
                  <th className="pb-1.5 text-right">% Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg font-bold text-[10px]">UP</div>
                    <span className="font-medium text-slate-900">UPI</span>
                  </td>
                  <td className="py-2 text-right font-medium">560</td>
                  <td className="py-2 text-right font-semibold">45.0%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg font-bold text-[10px]">CO</div>
                    <span className="font-medium text-slate-900">COD</span>
                  </td>
                  <td className="py-2 text-right font-medium">310</td>
                  <td className="py-2 text-right font-semibold">24.9%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                      <CreditCard className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-900">Card</span>
                  </td>
                  <td className="py-2 text-right font-medium">280</td>
                  <td className="py-2 text-right font-semibold">22.5%</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Building className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-900">Net Banking</span>
                  </td>
                  <td className="py-2 text-right font-medium">95</td>
                  <td className="py-2 text-right font-semibold">7.6%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Top Selling Products (by Orders) */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-slate-900">Top Selling Products (by Orders)</h4>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1.5">Product</th>
                  <th className="pb-1.5 text-right">Orders</th>
                  <th className="pb-1.5 text-right">% Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[100px]">Men's Cotton Shirt</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">320</td>
                  <td className="py-1.5 text-right font-semibold">25.7%</td>
                </tr>
                <tr>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[100px]">Women's Kurti</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">280</td>
                  <td className="py-1.5 text-right font-semibold">22.5%</td>
                </tr>
                <tr>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[100px]">Denim Jeans</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">240</td>
                  <td className="py-1.5 text-right font-semibold">19.3%</td>
                </tr>
                <tr>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[100px]">T-Shirt (Pack of 2)</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">210</td>
                  <td className="py-1.5 text-right font-semibold">16.9%</td>
                </tr>
                <tr>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[100px]">Casual Shoes</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">180</td>
                  <td className="py-1.5 text-right font-semibold">14.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
