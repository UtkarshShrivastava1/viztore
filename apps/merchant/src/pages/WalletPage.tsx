import React from 'react';
import { Plus, History, Home, ChevronRight } from 'lucide-react';
import { useWalletStore } from '../stores/walletStore.js';
import { WalletKPIBar } from '../components/wallet/WalletKPIBar.js';
import { WalletTransactionTable } from '../components/wallet/WalletTransactionTable.js';
import { WalletSecurityBanner } from '../components/wallet/WalletSecurityBanner.js';
import { AddMoneyDrawer } from '../components/wallet/AddMoneyDrawer.js';
import { TransactionDetailDrawer } from '../components/wallet/TransactionDetailDrawer.js';
import { TransactionHistoryDrawer } from '../components/wallet/TransactionHistoryDrawer.js';

interface WalletPageProps {
  onNavigateHome?: () => void;
  onNavigateSupport?: () => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({
  onNavigateHome,
  onNavigateSupport,
}) => {
  const {
    isAddMoneyDrawerOpen,
    setIsAddMoneyDrawerOpen,
    isHistoryDrawerOpen,
    setIsHistoryDrawerOpen,
    selectedTransaction,
    setSelectedTransaction,
  } = useWalletStore();

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-3.5">
      {/* Breadcrumb + Header compact block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-0.5">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              <Home className="w-3 h-3" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800">Wallet</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Wallet</h1>
          <p className="text-[11px] text-slate-500">
            Manage your wallet balance, transactions and add funds.
          </p>
        </div>

        {/* Header Action Buttons matching 7.0.png */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddMoneyDrawerOpen(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Money</span>
          </button>

          <button
            type="button"
            onClick={() => setIsHistoryDrawerOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Transaction History</span>
          </button>
        </div>
      </div>

      {/* 2 KPI Metrics Cards matching 7.0.png */}
      <WalletKPIBar />

      {/* Transaction Ledger Table matching 7.0.png */}
      <WalletTransactionTable
        onViewTransaction={(txn) => setSelectedTransaction(txn)}
      />

      {/* Security Banner matching 7.0.png */}
      <WalletSecurityBanner onLearnMore={onNavigateSupport} />

      {/* Slide-Over Drawers (Mounted to document.body via Portal) */}
      <AddMoneyDrawer
        isOpen={isAddMoneyDrawerOpen}
        onClose={() => setIsAddMoneyDrawerOpen(false)}
      />
      <TransactionHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        onSelectTransaction={(txn) => setSelectedTransaction(txn)}
      />
      <TransactionDetailDrawer
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onContactSupport={onNavigateSupport}
      />
    </div>
  );
};
