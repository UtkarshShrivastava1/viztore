import React from 'react';
import {
  Wallet,
  Clock,
  PauseCircle,
  TrendingUp,
  Receipt,
  Info,
  ChevronRight,
} from 'lucide-react';
import { usePayoutsStore } from '../../stores/payoutsStore.js';

export const PayoutOverviewTab: React.FC = () => {
  const {
    availableForPayout,
    pendingBalance,
    onHold,
    totalPayoutsMonth,
    totalSettlementsAllTime,
    payouts,
    transactions,
    setActiveTab,
    setIsNewRequestModalOpen,
  } = usePayoutsStore();

  const recentPayoutsList = payouts.slice(0, 5);
  const recentTransactionsList = transactions.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Success':
      case 'Paid':
      case 'Completed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {status}
          </span>
        );
      case 'Pending':
      case 'In Process':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            {status}
          </span>
        );
      case 'Failed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case 'Order Credit':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Order Credit
          </span>
        );
      case 'Shipping Charge':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Shipping Charge
          </span>
        );
      case 'Commission':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Commission
          </span>
        );
      case 'Refund':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Refund
          </span>
        );
      case 'Payout':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Payout
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 5 KPI Cards Matching 11.0.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Available for Payout */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                Available for Payout
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
              ₹ {availableForPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">Next payout on 22 May 2024</p>
          </div>
          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="mt-4 w-full py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs text-center"
          >
            Request Payout
          </button>
        </div>

        {/* Card 2: Pending Balance */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              Pending Balance
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
            ₹ {pendingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">From 12 Orders</p>
        </div>

        {/* Card 3: On Hold */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              On Hold
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <PauseCircle className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
            ₹ {onHold.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">From 3 Orders</p>
        </div>

        {/* Card 4: Total Payouts (This Month) */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              Total Payouts (This Month)
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
            ₹ {totalPayoutsMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h4>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>&uarr; 12.5%</span>
            <span className="text-slate-400 font-normal">vs Last Month</span>
          </p>
        </div>

        {/* Card 5: Total Settlements */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              Total Settlements
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
            ₹ {totalSettlementsAllTime.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">All Time</p>
        </div>
      </div>

      {/* Middle Row: 3 Columns (Breakdown, Donut Status, Recent Payouts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Payout Breakdown */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Payout Breakdown (10 May - 16 May 2024)
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Order Amount</span>
                <span className="font-semibold text-slate-900">₹ 38,450.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Product Charges</span>
                <span className="text-rose-600 font-medium">- ₹ 3,845.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Charges</span>
                <span className="text-rose-600 font-medium">- ₹ 1,250.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax Collected</span>
                <span className="text-rose-600 font-medium">- ₹ 2,300.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Refunds</span>
                <span className="text-rose-600 font-medium">- ₹ 1,100.00</span>
              </div>

              <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-900">
                <span>Total Earnings</span>
                <span>₹ 29,955.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  TDS <Info className="w-3 h-3 text-slate-400" />
                </span>
                <span className="text-rose-600 font-medium">- ₹ 1,499.75</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-900">Payout Amount</span>
            <span className="text-sm font-black text-emerald-700">₹ 28,455.25</span>
          </div>
        </div>

        {/* Column 2: Payout Status Donut Chart */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Payout Status</h3>

          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-40 h-40 flex items-center justify-center">
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
                {/* Paid Segment (74.11%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeDasharray="238.76"
                  strokeDashoffset="61.8"
                  fill="transparent"
                  strokeLinecap="round"
                />
                {/* Pending Segment (19.35%) */}
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
                {/* On Hold Segment (6.54%) */}
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
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs w-full">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-[11px] font-semibold text-slate-700">Paid</p>
                  <p className="text-[10px] text-slate-400">₹ 12,450.00 (74.11%)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div>
                  <p className="text-[11px] font-semibold text-slate-700">Pending</p>
                  <p className="text-[10px] text-slate-400">₹ 3,250.00 (19.35%)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <div>
                  <p className="text-[11px] font-semibold text-slate-700">On Hold</p>
                  <p className="text-[10px] text-slate-400">₹ 1,100.00 (6.54%)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div>
                  <p className="text-[11px] font-semibold text-slate-700">Failed</p>
                  <p className="text-[10px] text-slate-400">₹ 0.00 (0%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Recent Payouts */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Recent Payouts</h3>
              <button
                onClick={() => setActiveTab('payment_history')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentPayoutsList.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{p.payoutId}</p>
                    <p className="text-[10px] text-slate-400">{p.date.split(',')[0]}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      ₹ {p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="mt-0.5">{getStatusBadge(p.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 border border-blue-100 bg-blue-50/60 px-3 py-1.5 rounded-xl transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-3">Debit (₹)</th>
                <th className="py-3 px-3">Credit (₹)</th>
                <th className="py-3 px-3">Balance (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentTransactionsList.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                    {tx.dateTime}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getTransactionTypeBadge(tx.type)}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                    {tx.referenceId}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {tx.description}
                  </td>
                  <td className="py-3 px-3 font-semibold text-rose-600 whitespace-nowrap">
                    {tx.debit
                      ? `₹ ${tx.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                      : '-'}
                  </td>
                  <td className="py-3 px-3 font-semibold text-emerald-600 whitespace-nowrap">
                    {tx.credit
                      ? `₹ ${tx.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                      : '-'}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                    ₹ {tx.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(tx.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 border-t border-slate-100 text-[11px] text-slate-400 bg-slate-50/50">
          Showing 1 to {recentTransactionsList.length} of 25 transactions
        </div>
      </div>
    </div>
  );
};
