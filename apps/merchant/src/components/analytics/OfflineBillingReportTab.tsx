import React, { useState } from 'react';
import {
  Store,
  CreditCard,
  Receipt,
  Boxes,
  Search,
  ChevronDown,
  Info,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  Users,
  UserCheck,
  UserPlus,
} from 'lucide-react';

export const OfflineBillingReportTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All Payment Methods');
  const [staffFilter, setStaffFilter] = useState('All Staff');

  const billsData = [
    { id: 1, billNo: '#BIL-000342', date: '16 May 2024, 07:24 PM', customer: 'Rahul Sharma', items: 5, amount: 1245, payment: 'Cash', createdBy: 'Admin' },
    { id: 2, billNo: '#BIL-000341', date: '16 May 2024, 06:18 PM', customer: 'Walk-in Customer', items: 3, amount: 890, payment: 'UPI', createdBy: 'Admin' },
    { id: 3, billNo: '#BIL-000340', date: '16 May 2024, 05:45 PM', customer: 'Priya Verma', items: 4, amount: 2150, payment: 'Card', createdBy: 'Admin' },
    { id: 4, billNo: '#BIL-000339', date: '15 May 2024, 08:12 PM', customer: 'Walk-in Customer', items: 2, amount: 560, payment: 'Cash', createdBy: 'Admin' },
    { id: 5, billNo: '#BIL-000338', date: '15 May 2024, 07:36 PM', customer: 'Amit Kumar', items: 6, amount: 1980, payment: 'UPI', createdBy: 'Admin' },
    { id: 6, billNo: '#BIL-000337', date: '15 May 2024, 06:21 PM', customer: 'Sneha Patel', items: 1, amount: 399, payment: 'Card', createdBy: 'Admin' },
    { id: 7, billNo: '#BIL-000336', date: '14 May 2024, 08:05 PM', customer: 'Walk-in Customer', items: 4, amount: 1450, payment: 'Cash', createdBy: 'Admin' },
    { id: 8, billNo: '#BIL-000335', date: '14 May 2024, 04:18 PM', customer: 'Vikash Singh', items: 3, amount: 1120, payment: 'UPI', createdBy: 'Admin' },
    { id: 9, billNo: '#BIL-000334', date: '13 May 2024, 07:50 PM', customer: 'Neha Gupta', items: 5, amount: 2340, payment: 'Card', createdBy: 'Admin' },
    { id: 10, billNo: '#BIL-000333', date: '13 May 2024, 06:14 PM', customer: 'Walk-in Customer', items: 2, amount: 680, payment: 'Cash', createdBy: 'Admin' },
  ];

  const filteredBills = billsData.filter((b) => {
    if (searchTerm && !b.billNo.toLowerCase().includes(searchTerm.toLowerCase()) && !b.customer.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (paymentFilter !== 'All Payment Methods' && b.payment !== paymentFilter) {
      return false;
    }
    if (staffFilter !== 'All Staff' && b.createdBy !== staffFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-3.5">
      {/* 4 KPI Cards Matching 11.4.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Offline Bills */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Offline Bills</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">342</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 12.6%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Offline Sales */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Offline Sales (₹)</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 78,450.00</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 15.4%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Average Bill Value */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Average Bill Value (₹)</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 229.38</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 6.8%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Items Sold */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Items Sold (Offline)</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">1,125</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 11.2%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>
      </div>

      {/* Row 2: Offline Billing Trend + Payment Mode (Offline) Matching 11.4.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Trend Chart (2 cols) */}
        <div className="lg:col-span-2 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <h3 className="text-xs font-bold text-slate-900">Offline Billing Trend</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Sales (₹)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-300" /> Bills Count
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
              <span>₹ 20K</span>
              <span>₹ 15K</span>
              <span>₹ 10K</span>
              <span>₹ 5K</span>
              <span>₹ 0</span>
            </div>
            <svg className="w-full h-32" viewBox="0 0 600 130" preserveAspectRatio="none">
              {/* Bars for bills count */}
              {[
                { x: 45, h: 25 },
                { x: 135, h: 40 },
                { x: 225, h: 48 },
                { x: 315, h: 55 },
                { x: 405, h: 68 },
                { x: 495, h: 60 },
                { x: 555, h: 45 },
              ].map((bar, i) => (
                <rect key={i} x={bar.x} y={120 - bar.h} width={24} height={bar.h} rx={2} fill="#93c5fd" />
              ))}

              {/* Line for sales */}
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="57,90 147,82 237,82 327,78 417,45 507,60 567,70"
              />
              {[
                [57, 90],
                [147, 82],
                [237, 82],
                [327, 78],
                [417, 45],
                [507, 60],
                [567, 70],
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

        {/* Payment Mode (Offline) Donut */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1 mb-3">
            <h4 className="text-xs font-bold text-slate-900">Payment Mode (Offline)</h4>
            <Info className="w-3 h-3 text-slate-400" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="138.9 238.76" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="none" strokeDasharray="52.7 238.76" strokeDashoffset="-138.9" />
                <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="36.7 238.76" strokeDashoffset="-191.6" />
                <circle cx="50" cy="50" r="38" stroke="#ec4899" strokeWidth="12" fill="none" strokeDasharray="10.2 238.76" strokeDashoffset="-228.3" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-semibold">Total</span>
                <span className="text-[11px] font-black text-slate-900 leading-tight">₹ 78,450</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Cash
                </span>
                <span className="font-semibold text-slate-900">58.2% (₹ 45,650)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Card
                </span>
                <span className="font-semibold text-slate-900">22.1% (₹ 17,350)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  UPI
                </span>
                <span className="font-semibold text-slate-900">15.4% (₹ 12,100)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  Others
                </span>
                <span className="font-semibold text-slate-900">4.3% (₹ 3,350)</span>
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
              placeholder="Search by bill no., customer name, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>10 May 2024 - 16 May 2024</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </div>

          <div className="relative">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All Payment Methods">All Payment Methods</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All Staff">All Staff</option>
              <option value="Admin">Admin</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSearchTerm('');
              setPaymentFilter('All Payment Methods');
              setStaffFilter('All Staff');
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
              <h3 className="text-xs font-bold text-slate-900">Offline Bills</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-semibold bg-slate-50/50">
                    <th className="py-2 px-2.5">#</th>
                    <th className="py-2 px-2.5">Bill No.</th>
                    <th className="py-2 px-2.5">Date & Time</th>
                    <th className="py-2 px-2.5">Customer Name</th>
                    <th className="py-2 px-2.5 text-right">Items</th>
                    <th className="py-2 px-2.5 text-right">Amount (₹)</th>
                    <th className="py-2 px-2.5">Payment Method</th>
                    <th className="py-2 px-2.5">Created By</th>
                    <th className="py-2 px-2.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredBills.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-2.5 font-medium text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-2.5 font-bold text-blue-600 font-mono">{item.billNo}</td>
                      <td className="py-2 px-2.5 text-slate-500">{item.date}</td>
                      <td className="py-2 px-2.5 font-semibold text-slate-900">{item.customer}</td>
                      <td className="py-2 px-2.5 text-right font-medium">{item.items}</td>
                      <td className="py-2 px-2.5 text-right font-semibold text-slate-900">
                        ₹ {item.amount.toLocaleString('en-IN')}.00
                      </td>
                      <td className="py-2 px-2.5 text-slate-600">{item.payment}</td>
                      <td className="py-2 px-2.5 text-slate-500">{item.createdBy}</td>
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
            <span>Showing 1 - 10 of 342 bills</span>
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
              <button className="px-2 py-0.5 rounded-md hover:bg-slate-50">35</button>
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
          {/* Top Items Sold (Offline) */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-slate-900">Top Items Sold (Offline)</h4>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1.5">#</th>
                  <th className="pb-1.5">Product</th>
                  <th className="pb-1.5 text-right">Quantity Sold</th>
                  <th className="pb-1.5 text-right">Sales (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-1.5 text-slate-400">1</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[90px]">Men's Cotton Shirt</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">120</td>
                  <td className="py-1.5 text-right font-semibold">₹25,450</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">2</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[90px]">Women's Kurti</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">95</td>
                  <td className="py-1.5 text-right font-semibold">₹18,750</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">3</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[90px]">Denim Jeans</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">60</td>
                  <td className="py-1.5 text-right font-semibold">₹12,200</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">4</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[90px]">T-Shirt (Pack of 2)</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">45</td>
                  <td className="py-1.5 text-right font-semibold">₹9,450</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">5</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[90px]">Casual Shoes</span>
                  </td>
                  <td className="py-1.5 text-right font-medium">40</td>
                  <td className="py-1.5 text-right font-semibold">₹8,980</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Customer Type (Offline) */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-slate-900">Customer Type (Offline)</h4>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1.5">Customer Type</th>
                  <th className="pb-1.5 text-right">Bills</th>
                  <th className="pb-1.5 text-right">Sales (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                      <Users className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-900">Walk-in Customers</span>
                  </td>
                  <td className="py-2 text-right font-medium">180</td>
                  <td className="py-2 text-right font-semibold">₹ 38,650</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                      <UserCheck className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-900">Registered Customers</span>
                  </td>
                  <td className="py-2 text-right font-medium">110</td>
                  <td className="py-2 text-right font-semibold">₹ 26,900</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-2">
                    <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                      <UserPlus className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-900">New Customers</span>
                  </td>
                  <td className="py-2 text-right font-medium">52</td>
                  <td className="py-2 text-right font-semibold">₹ 12,900</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
