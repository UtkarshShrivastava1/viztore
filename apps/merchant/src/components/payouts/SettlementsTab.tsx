import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Truck,
  Percent,
  Calendar,
  Filter,
  Download,
  ChevronDown,
} from 'lucide-react';
import { usePayoutsStore, SettlementRecord } from '../../stores/payoutsStore.js';

export const SettlementsTab: React.FC = () => {
  const { settlements } = usePayoutsStore();

  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateRange] = useState('01 Apr 2024 - 18 May 2024');

  const filteredSettlements = settlements.filter((s) => {
    if (statusFilter !== 'All Status' && s.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: SettlementRecord['status']) => {
    switch (status) {
      case 'Settled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Settled
          </span>
        );
      case 'In Transit':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            In Transit
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 5 KPI Cards Matching 11.2.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Settlements */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Settlements</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,24,560.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">45 Settlements</p>
        </div>

        {/* Card 2: Total Settled Amount */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Settled Amount</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 1,18,450.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Completed</p>
        </div>

        {/* Card 3: In Transit */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">In Transit</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 6,110.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">2 Settlements</p>
        </div>

        {/* Card 4: Total Deductions */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Deductions</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">₹ 3,245.00</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">All Time</p>
        </div>

        {/* Card 5: Next Settlement */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Next Settlement</span>
              <h4 className="text-xl font-black text-slate-900 mt-1">22 May 2024</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">₹ 6,110.00</p>
        </div>
      </div>

      {/* Filter Bar Matching 11.2.png */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Payout Account */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Payout Account
            </span>
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[200px]">
                <option value="hdfc">HDFC Bank - 50200012345678</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Settlement Status */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Settlement Status
            </span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[130px]"
              >
                <option value="All Status">All Status</option>
                <option value="Settled">Settled</option>
                <option value="In Transit">In Transit</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Settlement Date */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Settlement Date
            </span>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={dateRange}
                className="bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[190px]"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={() => setStatusFilter('All Status')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-2"
          >
            Clear All
          </button>
          <button className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter</span>
          </button>
          <button
            onClick={() => alert('Exporting settlements log...')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Settlement ID</th>
                <th className="py-3 px-3">Settlement Date</th>
                <th className="py-3 px-3">Payout Account</th>
                <th className="py-3 px-3">Order Range</th>
                <th className="py-3 px-3">Settlement Amount (₹)</th>
                <th className="py-3 px-3">Deductions (₹)</th>
                <th className="py-3 px-3">Net Amount (₹)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">UTR / Reference No.</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSettlements.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-blue-600 whitespace-nowrap">
                    {s.settlementId}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {s.settlementDate}
                  </td>
                  <td className="py-3 px-3 text-slate-800 whitespace-nowrap font-medium">
                    {s.payoutAccount}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {s.orderRange}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    ₹ {s.settlementAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-rose-600 whitespace-nowrap font-medium">
                    ₹ {s.deductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                    ₹ {s.netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">{getStatusBadge(s.status)}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {s.utrNumber || '-'}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => alert(`Settlement ${s.settlementId}: Net ₹${s.netAmount}`)}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
