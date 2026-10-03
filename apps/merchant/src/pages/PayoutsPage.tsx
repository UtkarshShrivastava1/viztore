import React from 'react';
import {
  Settings,
  Download,
  LayoutDashboard,
  ReceiptText,
  Boxes,
  ArrowLeftRight,
  SendHorizontal,
} from 'lucide-react';
import { usePayoutsStore, PayoutTab } from '../stores/payoutsStore.js';
import { PayoutOverviewTab } from '../components/payouts/PayoutOverviewTab.js';
import { PaymentHistoryTab } from '../components/payouts/PaymentHistoryTab.js';
import { SettlementsTab } from '../components/payouts/SettlementsTab.js';
import { TransactionsTab } from '../components/payouts/TransactionsTab.js';
import { PayoutRequestsTab } from '../components/payouts/PayoutRequestsTab.js';
import { PayoutSettingsTab } from '../components/payouts/PayoutSettingsTab.js';

interface PayoutsPageProps {
  onNavigateHome?: () => void;
}

export const PayoutsPage: React.FC<PayoutsPageProps> = ({ onNavigateHome }) => {
  const { activeTab, setActiveTab } = usePayoutsStore();

  const handleDownloadStatement = () => {
    alert('Generating financial settlement statement PDF...');
  };

  const tabs: { id: PayoutTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'payment_history', label: 'Payment History', icon: ReceiptText },
    { id: 'settlements', label: 'Settlements', icon: Boxes },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'payout_requests', label: 'Payout Requests', icon: SendHorizontal },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
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
          {activeTab !== 'overview' && (
            <>
              <span>&gt;</span>
              <span className="text-slate-800 font-semibold capitalize">
                {activeTab.replace(/_/g, ' ')}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'payout_settings'
                ? 'Payout Settings'
                : activeTab === 'payout_requests'
                ? 'Payout Requests'
                : activeTab === 'payment_history'
                ? 'Payout History'
                : activeTab === 'settlements'
                ? 'Settlements'
                : activeTab === 'transactions'
                ? 'Transactions'
                : 'Payouts & Settlements'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'payout_settings'
                ? 'Manage your payout preferences, bank account, and payout configuration.'
                : activeTab === 'payout_requests'
                ? 'View and manage all your payout requests.'
                : activeTab === 'payment_history'
                ? 'Track all payouts made to your account.'
                : activeTab === 'settlements'
                ? 'View and manage all your settlement details.'
                : activeTab === 'transactions'
                ? 'View all payout related transactions in detail.'
                : 'Track your payouts, settlements, and transaction history.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('payout_settings')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-colors shadow-2xs flex items-center gap-1.5 ${
                activeTab === 'payout_settings'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'text-slate-700 bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Payout Settings</span>
            </button>

            <button
              onClick={handleDownloadStatement}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download Statement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Matching Mockups */}
      <div className="border-b border-slate-200 flex items-center gap-4 sm:gap-6 overflow-x-auto text-xs font-semibold">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
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

        {activeTab === 'payout_settings' && (
          <button
            onClick={() => setActiveTab('payout_settings')}
            className="py-3.5 border-b-2 border-blue-600 text-blue-600 flex items-center gap-2 whitespace-nowrap"
          >
            <Settings className="w-4 h-4" />
            <span>Payout Settings</span>
          </button>
        )}
      </div>

      {/* Tab View Content */}
      {activeTab === 'overview' && <PayoutOverviewTab />}
      {activeTab === 'payment_history' && <PaymentHistoryTab />}
      {activeTab === 'settlements' && <SettlementsTab />}
      {activeTab === 'transactions' && <TransactionsTab />}
      {activeTab === 'payout_requests' && <PayoutRequestsTab />}
      {activeTab === 'payout_settings' && <PayoutSettingsTab />}
    </div>
  );
};
