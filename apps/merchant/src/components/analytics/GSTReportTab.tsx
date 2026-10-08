import React, { useState } from 'react';
import {
  Receipt,
  Percent,
  FileText,
  Search,
  ChevronDown,
  Info,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Calendar,
} from 'lucide-react';

export const GSTReportTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gstRateFilter, setGstRateFilter] = useState('All GST Rates');
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState('All Invoice Types');

  const invoicesData = [
    { id: 1, invoiceNo: '#INV-000342', date: '16 May 2024, 07:24 PM', customer: 'Rahul Sharma', type: 'Sale', taxable: 2076, rate: '12%', gst: 249, total: 2325 },
    { id: 2, invoiceNo: '#INV-000341', date: '16 May 2024, 06:18 PM', customer: 'Walk-in Customer', type: 'Sale', taxable: 1598, rate: '18%', gst: 288, total: 1886 },
    { id: 3, invoiceNo: '#INV-000340', date: '16 May 2024, 05:45 PM', customer: 'Priya Verma', type: 'Sale', taxable: 3000, rate: '18%', gst: 540, total: 3540 },
    { id: 4, invoiceNo: '#INV-000339', date: '15 May 2024, 08:12 PM', customer: 'Walk-in Customer', type: 'Sale', taxable: 474, rate: '5%', gst: 24, total: 498 },
    { id: 5, invoiceNo: '#INV-000338', date: '15 May 2024, 07:36 PM', customer: 'Amit Kumar', type: 'Sale', taxable: 1780, rate: '12%', gst: 214, total: 1994 },
    { id: 6, invoiceNo: '#INV-000337', date: '15 May 2024, 06:21 PM', customer: 'Sneha Patel', type: 'Sale', taxable: 1250, rate: '18%', gst: 225, total: 1475 },
    { id: 7, invoiceNo: '#INV-000336', date: '14 May 2024, 08:05 PM', customer: 'Walk-in Customer', type: 'Sale', taxable: 921, rate: '12%', gst: 111, total: 1032 },
    { id: 8, invoiceNo: '#INV-000335', date: '14 May 2024, 04:18 PM', customer: 'Vikash Singh', type: 'Sale', taxable: 2000, rate: '18%', gst: 360, total: 2360 },
    { id: 9, invoiceNo: '#INV-000334', date: '13 May 2024, 07:50 PM', customer: 'Neha Gupta', type: 'Sale', taxable: 1983, rate: '5%', gst: 99, total: 2082 },
    { id: 10, invoiceNo: '#INV-000333', date: '13 May 2024, 06:14 PM', customer: 'Walk-in Customer', type: 'Sale', taxable: 576, rate: '28%', gst: 161, total: 737 },
  ];

  const filteredInvoices = invoicesData.filter((inv) => {
    if (searchTerm && !inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) && !inv.customer.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (gstRateFilter !== 'All GST Rates' && inv.rate !== gstRateFilter) {
      return false;
    }
    if (invoiceTypeFilter !== 'All Invoice Types' && inv.type !== invoiceTypeFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-3.5">
      {/* 4 KPI Cards Matching 11.5.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Sales (Incl. GST) */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total Sales (Incl. GST)</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,38,500.00</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 15.4%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total GST Collected */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total GST Collected</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 21,087.00</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 12.8%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Taxable Value */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total Taxable Value</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,17,413.00</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 16.2%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Total Invoices */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Total Invoices</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mt-1">342</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2.5 flex items-center gap-1">
            <span className="font-bold">↑ 11.9%</span>
            <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>
      </div>

      {/* Row 2: GST Collection Trend + GST by Tax Rate Matching 11.5.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Trend Chart (2 cols) */}
        <div className="lg:col-span-2 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <h3 className="text-xs font-bold text-slate-900">GST Collection Trend</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Total Sales (₹)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-300" /> GST Collected (₹)
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
              {/* Bars for GST collected */}
              {[
                { x: 45, h: 35 },
                { x: 135, h: 48 },
                { x: 225, h: 54 },
                { x: 315, h: 60 },
                { x: 405, h: 75 },
                { x: 495, h: 65 },
                { x: 555, h: 50 },
              ].map((bar, i) => (
                <rect key={i} x={bar.x} y={120 - bar.h} width={24} height={bar.h} rx={2} fill="#93c5fd" />
              ))}

              {/* Line for total sales */}
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="57,85 147,75 237,75 327,70 417,40 507,55 567,65"
              />
              {[
                [57, 85],
                [147, 75],
                [237, 75],
                [327, 70],
                [417, 40],
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

        {/* GST by Tax Rate Donut */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1 mb-3">
            <h4 className="text-xs font-bold text-slate-900">GST by Tax Rate</h4>
            <Info className="w-3 h-3 text-slate-400" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="27.7 238.76" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="none" strokeDasharray="65.4 238.76" strokeDashoffset="-27.7" />
                <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="123.7 238.76" strokeDashoffset="-93.1" />
                <circle cx="50" cy="50" r="38" stroke="#ec4899" strokeWidth="12" fill="none" strokeDasharray="21.9 238.76" strokeDashoffset="-216.8" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-semibold">Total GST</span>
                <span className="text-[11px] font-black text-slate-900 leading-tight">₹ 21,087</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  5%
                </span>
                <span className="font-semibold text-slate-900">₹ 2,450 (11.6%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  12%
                </span>
                <span className="font-semibold text-slate-900">₹ 5,780 (27.4%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  18%
                </span>
                <span className="font-semibold text-slate-900">₹ 10,920 (51.8%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  28%
                </span>
                <span className="font-semibold text-slate-900">₹ 1,937 (9.2%)</span>
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
              placeholder="Search by invoice no., customer name, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <select
              value={gstRateFilter}
              onChange={(e) => setGstRateFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All GST Rates">All GST Rates</option>
              <option value="5%">5%</option>
              <option value="12%">12%</option>
              <option value="18%">18%</option>
              <option value="28%">28%</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={invoiceTypeFilter}
              onChange={(e) => setInvoiceTypeFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="All Invoice Types">All Invoice Types</option>
              <option value="Sale">Sale</option>
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
              setGstRateFilter('All GST Rates');
              setInvoiceTypeFilter('All Invoice Types');
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
              <h3 className="text-xs font-bold text-slate-900">GST Report</h3>
              <Info className="w-3 h-3 text-slate-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-semibold bg-slate-50/50">
                    <th className="py-2 px-2.5">#</th>
                    <th className="py-2 px-2.5">Invoice No.</th>
                    <th className="py-2 px-2.5">Date & Time</th>
                    <th className="py-2 px-2.5">Customer Name</th>
                    <th className="py-2 px-2.5">Invoice Type</th>
                    <th className="py-2 px-2.5 text-right">Taxable Value (₹)</th>
                    <th className="py-2 px-2.5 text-center">GST Rate</th>
                    <th className="py-2 px-2.5 text-right">GST Amount (₹)</th>
                    <th className="py-2 px-2.5 text-right">Total Amount (₹)</th>
                    <th className="py-2 px-2.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredInvoices.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-2.5 font-medium text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-2.5 font-bold text-blue-600 font-mono">{item.invoiceNo}</td>
                      <td className="py-2 px-2.5 text-slate-500">{item.date}</td>
                      <td className="py-2 px-2.5 font-semibold text-slate-900">{item.customer}</td>
                      <td className="py-2 px-2.5 text-slate-600">{item.type}</td>
                      <td className="py-2 px-2.5 text-right text-slate-600">
                        ₹ {item.taxable.toLocaleString('en-IN')}.00
                      </td>
                      <td className="py-2 px-2.5 text-center font-bold text-slate-900">{item.rate}</td>
                      <td className="py-2 px-2.5 text-right font-medium text-slate-700">
                        ₹ {item.gst.toLocaleString('en-IN')}.00
                      </td>
                      <td className="py-2 px-2.5 text-right font-semibold text-slate-900">
                        ₹ {item.total.toLocaleString('en-IN')}.00
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
            <span>Showing 1 - 10 of 342 invoices</span>
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
          {/* Top Products by GST Amount */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-slate-900">Top Products by GST Amount</h4>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1.5">#</th>
                  <th className="pb-1.5">Product</th>
                  <th className="pb-1.5 text-right">Taxable (₹)</th>
                  <th className="pb-1.5 text-right">GST (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-1.5 text-slate-400">1</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[80px]">Men's Cotton Shirt</span>
                  </td>
                  <td className="py-1.5 text-right text-slate-600">₹ 48,650</td>
                  <td className="py-1.5 text-right font-semibold text-slate-900">₹ 8,757</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">2</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[80px]">Women's Kurti</span>
                  </td>
                  <td className="py-1.5 text-right text-slate-600">₹ 36,820</td>
                  <td className="py-1.5 text-right font-semibold text-slate-900">₹ 6,628</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">3</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[80px]">Denim Jeans</span>
                  </td>
                  <td className="py-1.5 text-right text-slate-600">₹ 18,450</td>
                  <td className="py-1.5 text-right font-semibold text-slate-900">₹ 3,321</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">4</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[80px]">T-Shirt (Pack of 2)</span>
                  </td>
                  <td className="py-1.5 text-right text-slate-600">₹ 8,960</td>
                  <td className="py-1.5 text-right font-semibold text-slate-900">₹ 1,433</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-400">5</td>
                  <td className="py-1.5 flex items-center gap-1.5 font-medium text-slate-900">
                    <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 rounded object-cover" />
                    <span className="truncate max-w-[80px]">Casual Shoes</span>
                  </td>
                  <td className="py-1.5 text-right text-slate-600">₹ 4,533</td>
                  <td className="py-1.5 text-right font-semibold text-slate-900">₹ 948</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* GST by Product Category */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-slate-900">GST by Product Category</h4>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                  <th className="pb-1.5">Category</th>
                  <th className="pb-1.5 text-right">Taxable (₹)</th>
                  <th className="pb-1.5 text-right">GST (₹)</th>
                  <th className="pb-1.5 text-right">% Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr>
                  <td className="py-1.5 font-medium text-slate-900">Men's Wear</td>
                  <td className="py-1.5 text-right text-slate-600">₹ 48,650</td>
                  <td className="py-1.5 text-right font-semibold">₹ 8,757</td>
                  <td className="py-1.5 text-right font-bold text-slate-900">41.5%</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-medium text-slate-900">Women's Wear</td>
                  <td className="py-1.5 text-right text-slate-600">₹ 36,820</td>
                  <td className="py-1.5 text-right font-semibold">₹ 6,628</td>
                  <td className="py-1.5 text-right font-bold text-slate-900">31.5%</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-medium text-slate-900">Footwear</td>
                  <td className="py-1.5 text-right text-slate-600">₹ 18,450</td>
                  <td className="py-1.5 text-right font-semibold">₹ 3,321</td>
                  <td className="py-1.5 text-right font-bold text-slate-900">15.8%</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-medium text-slate-900">Accessories</td>
                  <td className="py-1.5 text-right text-slate-600">₹ 8,960</td>
                  <td className="py-1.5 text-right font-semibold">₹ 1,433</td>
                  <td className="py-1.5 text-right font-bold text-slate-900">6.8%</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-medium text-slate-900">Others</td>
                  <td className="py-1.5 text-right text-slate-600">₹ 4,533</td>
                  <td className="py-1.5 text-right font-semibold">₹ 948</td>
                  <td className="py-1.5 text-right font-bold text-slate-900">4.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
