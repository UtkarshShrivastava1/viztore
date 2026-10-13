import React, { useState } from 'react';
import {
  Download,
  ChevronDown,
  Info,
  Wallet,
  Clock,
  Pause,
  TrendingUp,
  Filter,
  Calendar,
  Home,
  CreditCard,
  Boxes,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { usePayoutsStore, PayoutTab } from '../stores/payoutsStore.js';
import { PayoutOverviewTab } from '../components/payouts/PayoutOverviewTab.js';
import { PaymentHistoryTab } from '../components/payouts/PaymentHistoryTab.js';
import { SettlementsTab } from '../components/payouts/SettlementsTab.js';
import { TransactionsTab } from '../components/payouts/TransactionsTab.js';
import { PayoutDetailDrawer } from '../components/payouts/PayoutDetailDrawer.js';
import { SettlementDetailDrawer } from '../components/payouts/SettlementDetailDrawer.js';
import { TransactionDetailDrawer } from '../components/payouts/TransactionDetailDrawer.js';

interface PayoutsPageProps {
  onNavigateHome?: () => void;
}

export const PayoutsPage: React.FC<PayoutsPageProps> = ({ onNavigateHome }) => {
  const {
    activeTab,
    setActiveTab,
    availableForPayout,
    pendingBalance,
    onHold,
    totalPayoutsMonth,
    payoutAccountFilter,
    setPayoutAccountFilter,
    dateRangeFilter,
    downloadStatement,
    selectedPayout,
    isPayoutDrawerOpen,
    setIsPayoutDrawerOpen,
    selectedSettlement,
    isSettlementDrawerOpen,
    setIsSettlementDrawerOpen,
    selectedTransaction,
    isTransactionDrawerOpen,
    setIsTransactionDrawerOpen,
  } = usePayoutsStore();

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const subTabs: { id: PayoutTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'payment_history', label: 'Payment History', icon: CreditCard },
    { id: 'settlements', label: 'Settlements', icon: Boxes },
    { id: 'transactions', label: 'Transactions', icon: FileText },
  ];

  const getBreadcrumbTabLabel = () => {
    switch (activeTab) {
      case 'payment_history':
        return 'Payment History';
      case 'settlements':
        return 'Settlements';
      case 'transactions':
        return 'Transactions';
      default:
        return null;
    }
  };

  const handleSelectDownload = (type: 'Payment History' | 'Settlements' | 'Transactions') => {
    downloadStatement(type);
    setIsDownloadOpen(false);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-3.5">
      {/* Header Section Matching 10.0-10.3 */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 font-medium">
            <span
              className="hover:text-slate-600 cursor-pointer"
              onClick={onNavigateHome}
            >
              Home
            </span>
            <span>&gt;</span>
            <span
              className={`cursor-pointer ${
                activeTab === 'overview' ? 'text-slate-800 font-semibold' : 'hover:text-slate-600'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Payouts & Settlements
            </span>
            {getBreadcrumbTabLabel() && (
              <>
                <span>&gt;</span>
                <span className="text-slate-800 font-semibold">
                  {getBreadcrumbTabLabel()}
                </span>
              </>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Payouts & Settlements
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your payouts, settlements, and transaction history.
          </p>
        </div>

        {/* Download Statement Dropdown Button Matching 10.0.png */}
        <div className="relative self-start sm:self-auto">
          <button
            onClick={() => setIsDownloadOpen(!isDownloadOpen)}
            className="px-3.5 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white hover:bg-slate-50 border border-blue-200 rounded-xl transition-colors shadow-2xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Statement</span>
            <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
          </button>

          {isDownloadOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsDownloadOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => handleSelectDownload('Payment History')}
                  className="w-full px-3.5 py-2.5 flex items-start gap-2.5 text-slate-700 hover:bg-slate-50 text-left transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">
                      Payment History
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                      Download payment history (CSV)
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectDownload('Settlements')}
                  className="w-full px-3.5 py-2.5 flex items-start gap-2.5 text-slate-700 hover:bg-slate-50 text-left transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">
                      Settlements
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                      Download settlements (CSV)
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectDownload('Transactions')}
                  className="w-full px-3.5 py-2.5 flex items-start gap-2.5 text-slate-700 hover:bg-slate-50 text-left transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">
                      Transactions
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                      Download transactions (CSV)
                    </span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4 Compact KPI Cards Matching 10.0-10.3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Available for Payout */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 leading-tight">
              Available for Payout
              <Info className="w-3 h-3 text-slate-400" />
            </span>
            <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-1">
              ₹ {availableForPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h4>
            <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
              Next payout on 22 May 2024
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Balance */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 leading-tight">
              Pending Balance
              <Info className="w-3 h-3 text-slate-400" />
            </span>
            <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-1">
              ₹ {pendingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h4>
            <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
              From 12 Orders
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* On Hold */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 leading-tight">
              On Hold
              <Info className="w-3 h-3 text-slate-400" />
            </span>
            <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-1">
              ₹ {onHold.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h4>
            <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
              From 3 Orders
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
            <Pause className="w-5 h-5" />
          </div>
        </div>

        {/* Total Payouts (This Month) */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 leading-tight">
              Total Payouts (This Month)
              <Info className="w-3 h-3 text-slate-400" />
            </span>
            <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-1">
              ₹ {totalPayoutsMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h4>
            <span className="text-[10px] text-emerald-600 font-semibold block leading-tight mt-0.5">
              &uarr; 12.5% <span className="text-slate-400 font-normal">vs Last Month</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Top Filter Row Matching 10.0-10.3 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Payout Account */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Payout Account</span>
            <div className="relative">
              <select
                value={payoutAccountFilter}
                onChange={(e) => setPayoutAccountFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[210px]"
              >
                <option value="HDFC Bank - 50200012345678">
                  HDFC Bank - 50200012345678
                </option>
                <option value="ICICI Bank - 001205012345">
                  ICICI Bank - 001205012345
                </option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Date Range</span>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 min-w-[190px] justify-between">
              <span>{dateRangeFilter}</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => alert('Filter applied')}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
        >
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span>Filter</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs Matching 10.0-10.3 */}
      <div className="border-b border-slate-200 flex items-center gap-6 overflow-x-auto text-xs font-semibold">
        {subTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab View Content */}
      {activeTab === 'overview' && <PayoutOverviewTab />}
      {activeTab === 'payment_history' && <PaymentHistoryTab />}
      {activeTab === 'settlements' && <SettlementsTab />}
      {activeTab === 'transactions' && <TransactionsTab />}

      {/* Drawers mounted via createPortal to document.body */}
      <PayoutDetailDrawer
        isOpen={isPayoutDrawerOpen}
        onClose={() => setIsPayoutDrawerOpen(false)}
        payout={selectedPayout}
      />

      <SettlementDetailDrawer
        isOpen={isSettlementDrawerOpen}
        onClose={() => setIsSettlementDrawerOpen(false)}
        settlement={selectedSettlement}
      />

      <TransactionDetailDrawer
        isOpen={isTransactionDrawerOpen}
        onClose={() => setIsTransactionDrawerOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
};
