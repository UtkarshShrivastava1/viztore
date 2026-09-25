import React, { useState } from 'react';
import { Plus, RotateCcw, Landmark, Home, ChevronRight } from 'lucide-react';
import { useWalletStore, WalletTransaction } from '../stores/walletStore.js';
import { WalletKPIBar } from '../components/wallet/WalletKPIBar.js';
import { WalletTransactionTable } from '../components/wallet/WalletTransactionTable.js';
import { WalletSecurityBanner } from '../components/wallet/WalletSecurityBanner.js';
import { AddMoneyModal } from '../components/wallet/AddMoneyModal.js';
import { RequestWithdrawalModal } from '../components/wallet/RequestWithdrawalModal.js';
import { TransactionDetailModal } from '../components/wallet/TransactionDetailModal.js';

interface WalletPageProps {
  onNavigateHome?: () => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({ onNavigateHome }) => {
  const {
    isAddMoneyModalOpen,
    setIsAddMoneyModalOpen,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    selectedTransaction,
    setSelectedTransaction,
    setActiveTab,
  } = useWalletStore();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb matching mockup 7.0.png */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={onNavigateHome}
          className="hover:text-blue-600 flex items-center gap-1"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800">Wallet</span>
      </div>

      {/* Page Header matching mockup 7.0.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Wallet</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your wallet balance, transactions and add funds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Landmark className="w-3.5 h-3.5 text-slate-500" />
            <span>Withdraw Now</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Transaction History</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddMoneyModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Money</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards matching 7.0.png */}
      <WalletKPIBar />

      {/* Transactions Table matching 7.0.png */}
      <WalletTransactionTable
        onViewTransaction={(txn) => setSelectedTransaction(txn)}
      />

      {/* Bottom Security Banner matching 7.0.png */}
      <WalletSecurityBanner />

      {/* Add Money Modal */}
      <AddMoneyModal
        isOpen={isAddMoneyModalOpen}
        onClose={() => setIsAddMoneyModalOpen(false)}
      />

      {/* Request Settlement Modal */}
      <RequestWithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
      />

      {/* Transaction Detail Receipt Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};
