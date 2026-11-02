import React from 'react';
import { Info, ArrowUpRight } from 'lucide-react';
import { usePayoutsStore } from '../../stores/payoutsStore.js';

export const PayoutOverviewTab: React.FC = () => {
  const {
    availableForPayout,
    pendingBalance,
    onHold,
    totalPayoutsMonth,
    payouts,
    transactions,
    setActiveTab,
    setSelectedPayout,
    setIsPayoutDrawerOpen,
    setSelectedTransaction,
    setIsTransactionDrawerOpen,
  } = usePayoutsStore();

  const now = new Date();
  const pastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  const currentPeriodStr = `${pastWeek.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;

  const orderAmount = availableForPayout > 0 ? Math.round(availableForPayout * 1.064 * 100) / 100 : 0;
  const commission = Math.round(orderAmount * 0.05 * 100) / 100;
  const shippingCharges = 0;
  const taxCollected = 0;
  const refunds = 0;
  const totalEarnings = availableForPayout > 0 ? availableForPayout : 0;
  const tds = Math.round(orderAmount * 0.01 * 100) / 100;
  const payoutAmount = availableForPayout > 0 ? availableForPayout : 0;

  const paidAmount = totalPayoutsMonth || 0;
  const pendingAmount = pendingBalance || 0;
  const onHoldAmount = onHold || 0;
  const failedAmount = 0;
  const totalPayoutStatus = paidAmount + pendingAmount + onHoldAmount + failedAmount;

  const paidPct = totalPayoutStatus > 0 ? (paidAmount / totalPayoutStatus) * 100 : 0;
  const pendingPct = totalPayoutStatus > 0 ? (pendingAmount / totalPayoutStatus) * 100 : 0;
  const onHoldPct = totalPayoutStatus > 0 ? (onHoldAmount / totalPayoutStatus) * 100 : 0;
  const failedPct = totalPayoutStatus > 0 ? (failedAmount / totalPayoutStatus) * 100 : 0;

  const circumference = 238.76;
  const paidOffset = circumference - (circumference * paidPct) / 100;
  const pendingOffset = paidOffset - (circumference * pendingPct) / 100;
  const onHoldOffset = pendingOffset - (circumference * onHoldPct) / 100;

  const recentPayoutsList = payouts.slice(0, 5);
  const recentTransactionsList = transactions.slice(0, 5);

  return (
    <div className="space-y-3.5">
      {/* 3-Column Top Grid Matching 10.0.png */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Column 1: Payout Breakdown */}
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 mb-3">
              Payout Breakdown <span className="font-normal text-slate-500">({currentPeriodStr})</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Order Amount</span>
                <span className="font-semibold text-slate-900">₹ {orderAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Product Charges</span>
                <span className="text-slate-700 font-medium">- ₹ {commission.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Charges</span>
                <span className="text-slate-700 font-medium">- ₹ {shippingCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax Collected</span>
                <span className="text-slate-700 font-medium">- ₹ {taxCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Refunds</span>
                <span className="text-slate-700 font-medium">- ₹ {refunds.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-900">
                <span>Total Earnings</span>
                <span>₹ {totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600 items-center">
                <span className="flex items-center gap-1">
                  TDS <Info className="w-3 h-3 text-slate-400" />
                </span>
                <span className="text-slate-700 font-medium">- ₹ {tds.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="mt-3.5 p-2.5 bg-emerald-50/70 border border-emerald-200/70 rounded-xl flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-950">Payout Amount</span>
            <span className="text-sm font-black text-emerald-700">₹ {payoutAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
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
                {totalPayoutStatus > 0 && (
                  <>
                    {/* Paid Segment - Green */}
                    {paidPct > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#10b981"
                        strokeWidth="14"
                        strokeDasharray={circumference}
                        strokeDashoffset={paidOffset}
                        fill="transparent"
                      />
                    )}
                    {/* Pending Segment - Amber */}
                    {pendingPct > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#f59e0b"
                        strokeWidth="14"
                        strokeDasharray={circumference}
                        strokeDashoffset={pendingOffset}
                        fill="transparent"
                      />
                    )}
                    {/* On Hold Segment - Blue */}
                    {onHoldPct > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#3b82f6"
                        strokeWidth="14"
                        strokeDasharray={circumference}
                        strokeDashoffset={onHoldOffset}
                        fill="transparent"
                      />
                    )}
                  </>
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Total</span>
                <span className="text-sm font-black text-slate-900">₹ {totalPayoutStatus.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-xs w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-slate-700 block">Paid</span>
                  <span className="text-[10px] text-slate-400">₹ {paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({paidPct.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-slate-700 block">Pending</span>
                  <span className="text-[10px] text-slate-400">₹ {pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({pendingPct.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-slate-700 block">On Hold</span>
                  <span className="text-[10px] text-slate-400">₹ {onHoldAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({onHoldPct.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-slate-700 block">Failed</span>
                  <span className="text-[10px] text-slate-400">₹ {failedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (0%)</span>
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
                  {recentPayoutsList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400">
                        No recent payouts
                      </td>
                    </tr>
                  ) : (
                    recentPayoutsList.map((p) => (
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
                    ))
                  )}
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
              {recentTransactionsList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No recent transactions found
                  </td>
                </tr>
              ) : (
                recentTransactionsList.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-2.5 text-slate-600 whitespace-nowrap">{t.dateTime}</td>
                    <td className="py-2 px-2 whitespace-nowrap">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-slate-50 text-slate-700 border-slate-200"
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
                      {typeof t.fee === 'number' && t.fee > 0 ? t.fee.toFixed(2) : '-'}
                    </td>
                    <td className="py-2 px-2 font-medium text-slate-800 whitespace-nowrap">
                      {t.amount > 0 ? t.amount.toFixed(2) : '-'}
                    </td>
                    <td className="py-2 px-2 font-bold text-slate-900 whitespace-nowrap">
                      {typeof t.netAmount === 'number' ? t.netAmount.toFixed(2) : '-'}
                    </td>
                    <td className="py-2 px-2.5 text-center whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-[11px] text-slate-400">
          Showing {recentTransactionsList.length > 0 ? `1 to ${recentTransactionsList.length} of ${transactions.length}` : '0'} transactions
        </div>
      </div>
    </div>
  );
};
