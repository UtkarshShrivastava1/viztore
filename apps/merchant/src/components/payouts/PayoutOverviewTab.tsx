import React from 'react';
import { Info, ArrowUpRight } from 'lucide-react';
import { usePayoutsStore } from '../../stores/payoutsStore.js';

export const PayoutOverviewTab: React.FC = () => {
  const {
    payouts,
    transactions,
    setActiveTab,
    setSelectedPayout,
    setIsPayoutDrawerOpen,
    setSelectedTransaction,
    setIsTransactionDrawerOpen,
  } = usePayoutsStore();

  const recentPayoutsList = payouts.slice(0, 5);

  const recentTransactionsList = [
    {
      dateTime: '18 May 2024, 10:30 AM',
      type: 'Order Credit',
      typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      orderId: '#ORD10045',
      description: 'Order amount for #ORD10045',
      debit: '-',
      credit: '1,049.00',
      balance: '12,450.00',
      status: 'Completed',
    },
    {
      dateTime: '18 May 2024, 10:30 AM',
      type: 'Shipping Charge',
      typeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      orderId: '#ORD10045',
      description: 'Shipping charge for #ORD10045',
      debit: '-',
      credit: '50.00',
      balance: '12,450.00',
      status: 'Completed',
    },
    {
      dateTime: '18 May 2024, 10:30 AM',
      type: 'Commission',
      typeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      orderId: '#ORD10045',
      description: 'Platform commission for #ORD10045',
      debit: '115.39',
      credit: '-',
      balance: '11,351.00',
      status: 'Completed',
    },
    {
      dateTime: '17 May 2024, 04:15 PM',
      type: 'Refund',
      typeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      orderId: '#ORD10041',
      description: 'Refund for order #ORD10041',
      debit: '899.00',
      credit: '-',
      balance: '11,466.39',
      status: 'Completed',
    },
    {
      dateTime: '15 May 2024, 11:20 AM',
      type: 'Payout',
      typeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      orderId: '#PAYOUT1234',
      description: 'Payout to HDFC Bank - 50200012345678',
      debit: '12,450.00',
      credit: '-',
      balance: '12,366.39',
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-3.5">
      {/* 3-Column Top Grid Matching 10.0.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Column 1: Payout Breakdown */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 mb-3">
              Payout Breakdown <span className="font-normal text-slate-500">(10 May - 16 May 2024)</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Order Amount</span>
                <span className="font-semibold text-slate-900">₹ 38,450.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Product Charges</span>
                <span className="text-slate-700 font-medium">- ₹ 3,845.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Charges</span>
                <span className="text-slate-700 font-medium">- ₹ 1,250.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax Collected</span>
                <span className="text-slate-700 font-medium">- ₹ 2,300.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Refunds</span>
                <span className="text-slate-700 font-medium">- ₹ 1,100.00</span>
              </div>

              <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-900">
                <span>Total Earnings</span>
                <span>₹ 29,955.00</span>
              </div>
              <div className="flex justify-between text-slate-600 items-center">
                <span className="flex items-center gap-1">
                  TDS <Info className="w-3 h-3 text-slate-400" />
                </span>
                <span className="text-slate-700 font-medium">- ₹ 1,499.75</span>
              </div>
            </div>
          </div>

          <div className="mt-3.5 p-2.5 bg-emerald-50/70 border border-emerald-200/70 rounded-xl flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-950">Payout Amount</span>
            <span className="text-sm font-black text-emerald-700">₹ 28,455.25</span>
          </div>
        </div>

        {/* Column 2: Payout Status Donut Chart Matching 10.0.png */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-900 mb-1">Payout Status</h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-1">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-slate-100"
                  strokeWidth="14"
                  fill="transparent"
                />
                {/* Paid Segment (74.11%) - Green */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeDasharray="238.76"
                  strokeDashoffset="61.8"
                  fill="transparent"
                />
                {/* Pending Segment (19.35%) - Amber */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#f59e0b"
                  strokeWidth="14"
                  strokeDasharray="238.76"
                  strokeDashoffset="192.5"
                  fill="transparent"
                />
                {/* On Hold Segment (6.54%) - Blue */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#3b82f6"
                  strokeWidth="14"
                  strokeDasharray="238.76"
                  strokeDashoffset="223.1"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Total</span>
                <span className="text-sm font-black text-slate-900">₹ 16,800.00</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-xs w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-slate-700 block">Paid</span>
                  <span className="text-[10px] text-slate-400">₹ 12,450.00 (74.11%)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-slate-700 block">Pending</span>
                  <span className="text-[10px] text-slate-400">₹ 3,250.00 (19.35%)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-slate-700 block">On Hold</span>
                  <span className="text-[10px] text-slate-400">₹ 1,100.00 (6.54%)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-slate-700 block">Failed</span>
                  <span className="text-[10px] text-slate-400">₹ 0.00 (0%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Recent Payouts Matching 10.0.png */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-slate-900">Recent Payouts</h3>
              <button
                onClick={() => setActiveTab('payment_history')}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-semibold uppercase">
                    <th className="py-1.5 px-2">Payout ID</th>
                    <th className="py-1.5 px-2">Date</th>
                    <th className="py-1.5 px-2">Amount</th>
                    <th className="py-1.5 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[11px]">
                  {recentPayoutsList.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => {
                        setSelectedPayout(p);
                        setIsPayoutDrawerOpen(true);
                      }}
                      className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                    >
                      <td className="py-2 px-2 font-bold text-slate-900">{p.payoutId}</td>
                      <td className="py-2 px-2 text-slate-500 whitespace-nowrap">
                        {p.date.split(',')[0]}
                      </td>
                      <td className="py-2 px-2 font-semibold text-slate-800">
                        ₹ {p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            p.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Transactions Matching 10.0.png */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900">Recent Transactions</h3>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] text-slate-500 font-semibold">
                <th className="py-2 px-2.5">Date & Time</th>
                <th className="py-2 px-2">Type</th>
                <th className="py-2 px-2">Order ID</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-2">Debit (₹)</th>
                <th className="py-2 px-2">Credit (₹)</th>
                <th className="py-2 px-2">Balance (₹)</th>
                <th className="py-2 px-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
              {recentTransactionsList.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2 px-2.5 text-slate-600 whitespace-nowrap">{t.dateTime}</td>
                  <td className="py-2 px-2 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${t.typeColor}`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="py-2 px-2 font-semibold text-slate-900 whitespace-nowrap">
                    {t.orderId}
                  </td>
                  <td className="py-2 px-3 text-slate-600 truncate max-w-[280px]" title={t.description}>
                    {t.description}
                  </td>
                  <td className="py-2 px-2 font-medium text-slate-800 whitespace-nowrap">
                    {t.debit}
                  </td>
                  <td className="py-2 px-2 font-medium text-slate-800 whitespace-nowrap">
                    {t.credit}
                  </td>
                  <td className="py-2 px-2 font-bold text-slate-900 whitespace-nowrap">
                    {t.balance}
                  </td>
                  <td className="py-2 px-2.5 text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-[11px] text-slate-400">
          Showing 1 to 5 of 25 transactions
        </div>
      </div>
    </div>
  );
};
