import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Wallet,
  Landmark,
  Bell,
  Info,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  Percent,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore.js';

export const PaymentsWalletTab: React.FC = () => {
  const { paymentsWallet, updatePaymentsWallet } = useSettingsStore();
  const [formData, setFormData] = useState({ ...paymentsWallet });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    updatePaymentsWallet(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Middle Column (Form) */}
      <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
        {/* Section 1: Accepted Payment Methods */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Accepted Payment Methods</h2>
              <p className="text-xs text-slate-500">
                Choose which payment methods are available for your customers.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Cards */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Credit / Debit Cards</h4>
                  <p className="text-[11px] text-slate-500">Visa, Mastercard, Rupay and more.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, acceptCards: !formData.acceptCards })
                  }
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.acceptCards ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      formData.acceptCards ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Configure
                </button>
              </div>
            </div>

            {/* UPI */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">UPI Payments</h4>
                  <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm and more.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, acceptUpi: !formData.acceptUpi })
                  }
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.acceptUpi ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      formData.acceptUpi ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Configure
                </button>
              </div>
            </div>

            {/* Wallet */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Wallet Payments</h4>
                  <p className="text-[11px] text-slate-500">Allow customers to pay using Viztore Wallet.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, acceptWallet: !formData.acceptWallet })
                  }
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.acceptWallet ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      formData.acceptWallet ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Payout Settings */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Payout Settings</h3>
                <p className="text-xs text-slate-500">
                  Manage how and when your earnings are transferred to your bank account.
                </p>
              </div>
            </div>
            <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              Add / Manage Bank Accounts
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Bank Account</label>
              <select
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="HDFC Bank - 1234">HDFC Bank - 1234</option>
                <option value="State Bank of India - 5678">State Bank of India - 5678</option>
                <option value="ICICI Bank - 9012">ICICI Bank - 9012</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Payout Frequency</label>
              <select
                value={formData.payoutFrequency}
                onChange={(e) => setFormData({ ...formData, payoutFrequency: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Weekly (Every Monday)">Weekly (Every Monday)</option>
                <option value="Daily">Daily</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-2.5 text-xs text-blue-800">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Payouts are initiated every Monday for all completed orders and refunds (if any).</span>
          </div>
        </div>

        {/* Section 3: Transaction Notifications */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Transaction Notifications</h3>
              <p className="text-xs text-slate-500">Get notified about payments, payouts and refunds.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/60 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifyPaymentReceived}
                onChange={(e) =>
                  setFormData({ ...formData, notifyPaymentReceived: e.target.checked })
                }
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Payment received from customers</p>
                <p className="text-[11px] text-slate-500">Get notified when a customer makes a payment.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/60 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifyPayoutUpdates}
                onChange={(e) =>
                  setFormData({ ...formData, notifyPayoutUpdates: e.target.checked })
                }
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Payout status updates</p>
                <p className="text-[11px] text-slate-500">Get notified when payout is processed or completed.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 mr-auto flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Payment settings saved!
            </span>
          )}
          <button
            type="button"
            onClick={() => setFormData({ ...paymentsWallet })}
            className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Right Column (Cards) */}
      <div className="xl:col-span-4 space-y-5">
        {/* Wallet Balance Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Your Wallet Balance</p>
              <p className="text-[10px] text-slate-400">Available for payouts</p>
            </div>
          </div>

          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹ {formData.walletBalance.toLocaleString('en-IN')}
          </div>

          <button
            type="button"
            className="w-full py-2.5 px-3 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Transactions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Next Payout Box */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-slate-900">Next payout on {formData.nextPayoutDate}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                ₹ {formData.nextPayoutAmount.toLocaleString('en-IN')} will be credited to your bank account.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">Recent Transactions</h3>
            <button type="button" className="text-[11px] font-bold text-blue-600 hover:text-blue-700">
              View All
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {formData.recentTransactions.map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      tx.type === 'credit'
                        ? 'bg-emerald-50 text-emerald-600'
                        : tx.type === 'debit'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-purple-50 text-purple-600'
                    }`}
                  >
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                    ) : tx.type === 'debit' ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <Percent className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 leading-snug">{tx.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{tx.date}</p>
                  </div>
                </div>

                <span
                  className={`font-bold ${
                    tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-800'
                  }`}
                >
                  {tx.amount > 0 ? `+ ₹ ${tx.amount.toLocaleString('en-IN')}` : `- ₹ ${Math.abs(tx.amount).toLocaleString('en-IN')}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
