import React from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Info,
} from 'lucide-react';

export const TotalOrdersReportTab: React.FC = () => {
  const mockOrders = [
    {
      id: '#ORD10045',
      dateTime: '16 May 2024, 10:30 AM',
      customer: 'Ravi Kumar',
      source: 'Online',
      channel: 'Website',
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      amount: 1250.0,
      status: 'Completed',
    },
    {
      id: '#ORD10044',
      dateTime: '16 May 2024, 09:15 AM',
      customer: 'Sneha Patel',
      source: 'Online',
      channel: 'Mobile App',
      paymentStatus: 'Paid',
      deliveryStatus: 'Shipped',
      amount: 2850.0,
      status: 'Completed',
    },
    {
      id: '#ORD10043',
      dateTime: '15 May 2024, 08:45 PM',
      customer: 'Amit Verma',
      source: 'Offline',
      channel: 'POS',
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      amount: 950.0,
      status: 'Completed',
    },
    {
      id: '#ORD10042',
      dateTime: '15 May 2024, 07:20 PM',
      customer: 'Neha Singh',
      source: 'Online',
      channel: 'Website',
      paymentStatus: 'Paid',
      deliveryStatus: 'Out for Delivery',
      amount: 1450.0,
      status: 'Pending',
    },
    {
      id: '#ORD10041',
      dateTime: '15 May 2024, 06:10 PM',
      customer: 'Suresh Yadav',
      source: 'Offline',
      channel: 'POS',
      paymentStatus: 'Partially Paid',
      deliveryStatus: 'Pending',
      amount: 3200.0,
      status: 'Pending',
    },
    {
      id: '#ORD10040',
      dateTime: '15 May 2024, 05:40 PM',
      customer: 'Pooja Sharma',
      source: 'Online',
      channel: 'Website',
      paymentStatus: 'Paid',
      deliveryStatus: 'Cancelled',
      amount: 1150.0,
      status: 'Cancelled',
    },
    {
      id: '#ORD10039',
      dateTime: '15 May 2024, 04:55 PM',
      customer: 'Vikram Joshi',
      source: 'Online',
      channel: 'Mobile App',
      paymentStatus: 'Paid',
      deliveryStatus: 'Returned',
      amount: 2750.0,
      status: 'Returned',
    },
    {
      id: '#ORD10038',
      dateTime: '15 May 2024, 04:20 PM',
      customer: 'Kavita Mehta',
      source: 'Offline',
      channel: 'POS',
      paymentStatus: 'Pending',
      deliveryStatus: 'Pending',
      amount: 650.0,
      status: 'Pending',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 5 KPI Cards Matching 12.3.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Orders */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Orders</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">1,245</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 8.72% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Completed Orders */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Completed Orders</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">890</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-3">
            &uarr; 9.15% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Pending Orders */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Pending Orders</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">180</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-rose-600 font-semibold mt-3">
            &darr; 4.76% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Cancelled Orders */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Cancelled Orders</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">95</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-rose-600 font-semibold mt-3">
            &darr; 6.86% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>

        {/* Return Orders */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Return Orders</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">80</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-rose-600 font-semibold mt-3">
            &darr; 3.61% <span className="text-slate-400 font-normal">vs 03 May - 09 May 2024</span>
          </p>
        </div>
      </div>

      {/* Row 2: Charts (Orders Trend + Order Status Donut + Orders by Source) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Trend */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-900 mb-3">Orders Trend</h4>
          <div className="h-36 w-full">
            <svg className="w-full h-full" viewBox="0 0 260 100" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                points="10,85 50,75 90,45 130,42 170,20 210,35 250,70"
              />
              <circle cx="10" cy="85" r="3" fill="#2563eb" />
              <circle cx="50" cy="75" r="3" fill="#2563eb" />
              <circle cx="90" cy="45" r="3" fill="#2563eb" />
              <circle cx="130" cy="42" r="3" fill="#2563eb" />
              <circle cx="170" cy="20" r="3" fill="#2563eb" />
              <circle cx="210" cy="35" r="3" fill="#2563eb" />
              <circle cx="250" cy="70" r="3" fill="#2563eb" />
            </svg>
            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
              <span>10 May</span>
              <span>12 May</span>
              <span>14 May</span>
              <span>16 May</span>
            </div>
          </div>
        </div>

        {/* Order Status Distribution Donut */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-900 mb-3">Order Status Distribution</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Completed
              </span>
              <span className="font-bold text-slate-900">890 (71.49%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Pending
              </span>
              <span className="font-bold text-slate-900">180 (14.46%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Cancelled
              </span>
              <span className="font-bold text-slate-900">95 (7.63%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Returned
              </span>
              <span className="font-bold text-slate-900">80 (6.42%)</span>
            </div>
          </div>
        </div>

        {/* Orders by Source Horizontal Bars */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-900 mb-3">Orders by Source</h4>
          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Online</span>
                <span className="font-bold">820 (65.86%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '65.86%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Offline</span>
                <span className="font-bold">325 (26.10%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: '26.1%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Mobile App</span>
                <span className="font-bold">70 (5.62%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '5.62%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Other</span>
                <span className="font-bold">30 (2.41%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '2.41%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Orders Details Table (2 Cols) vs Order Summary (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Orders Details</h3>
          </div>

          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Source</th>
                  <th className="py-3 px-3">Channel</th>
                  <th className="py-3 px-3">Payment Status</th>
                  <th className="py-3 px-3">Delivery Status</th>
                  <th className="py-3 px-3 text-right">Order Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {mockOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-blue-600 whitespace-nowrap">
                      {ord.id}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {ord.dateTime}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {ord.customer}
                    </td>
                    <td className="py-3 px-3 text-slate-700">{ord.source}</td>
                    <td className="py-3 px-3 text-slate-600">{ord.channel}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{ord.deliveryStatus}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                      ₹ {ord.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 border-t border-slate-100 text-[11px] text-slate-400 bg-slate-50/50">
            Showing 1 to {mockOrders.length} of 1,245 orders
          </div>
        </div>

        {/* Order Summary & Insights */}
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Order Summary</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Orders</span>
                <span className="font-bold text-slate-900">1,245</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Order Amount</span>
                <span className="font-bold text-slate-900">₹ 18,75,320.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Average Order Value</span>
                <span className="font-bold text-slate-900">₹ 1,507.46</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Completed Orders</span>
                <span className="font-bold text-emerald-600">890</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cancelled Orders</span>
                <span className="font-bold text-rose-600">95</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Return Orders</span>
                <span className="font-bold text-blue-600">80</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-500">Completion Rate</span>
                <span className="font-bold text-emerald-700">71.49%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cancellation Rate</span>
                <span className="font-bold text-rose-700">7.63%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Return Rate</span>
                <span className="font-bold text-slate-800">6.42%</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50/60 border border-blue-200/60 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              <span className="font-bold">Insight:</span> Order completion rate is 71.49% this week, which is 9.15% higher than last week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
