import React, { useState } from 'react';
import {
  Building,
  CheckCircle2,
  Eye,
  EyeOff,
  Pencil,
  Info,
  Calendar,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { usePayoutsStore } from '../../stores/payoutsStore.js';

export const PayoutSettingsTab: React.FC = () => {
  const { settings, updateSettings, setActiveTab } = usePayoutsStore();

  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [payoutMode, setPayoutMode] = useState(settings.payoutMode);
  const [payoutFrequency, setPayoutFrequency] = useState(settings.payoutFrequency);
  const [payoutDay, setPayoutDay] = useState(settings.payoutDay);
  const [enableThreshold, setEnableThreshold] = useState(settings.enableThreshold);
  const [thresholdAmount, setThresholdAmount] = useState(settings.thresholdAmount);

  const handleSave = () => {
    updateSettings({
      payoutMode,
      payoutFrequency,
      payoutDay,
      enableThreshold,
      thresholdAmount,
    });
    alert('Payout settings saved successfully!');
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Payout Account */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900">Payout Account</h3>
              <button
                type="button"
                onClick={() => alert('Account management modal')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-500" />
                <span>Manage Account</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Manage the bank account where your payouts will be transferred.
            </p>

            <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {settings.bankName}
                      </span>
                      {settings.isVerified && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">Account Number</span>
                      <span className="font-mono text-xs font-semibold text-slate-800">
                        {showAccountNumber
                          ? settings.accountNumber
                          : `•••• •••• •••• ${settings.accountNumber.slice(-4)}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAccountNumber(!showAccountNumber)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {showAccountNumber ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">IFSC Code</span>
                  <span className="font-bold text-slate-800">{settings.ifscCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">
                    Account Holder Name
                  </span>
                  <span className="font-bold text-slate-800">{settings.accountName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Account Type</span>
                  <span className="font-bold text-slate-800">{settings.accountType}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Branch</span>
                  <span className="font-semibold text-slate-700">{settings.branch}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">UPI ID (Optional)</span>
                  <span className="font-semibold text-slate-700">{settings.upiId}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Status</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Payout Cycle */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">Payout Cycle</h3>
            <p className="text-xs text-slate-500 mb-5">
              Set how often you want to receive your payouts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Payout Frequency
                </label>
                <select
                  value={payoutFrequency}
                  onChange={(e) => setPayoutFrequency(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Payout Day
                </label>
                <select
                  value={payoutDay}
                  onChange={(e) => setPayoutDay(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
            </div>

            {/* Next Payout Date Card */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  Next Payout Date
                </span>
                <p className="text-sm font-black text-slate-900">20 May 2024</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Payouts will be initiated every Monday.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Payout Threshold */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Payout Threshold <span className="text-xs text-slate-400 font-normal">(Optional)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Set a minimum balance threshold for payouts. Payouts will be initiated only when your available balance reaches this amount.
            </p>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableThreshold}
                  onChange={(e) => setEnableThreshold(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Enable Payout Threshold
                </span>
              </label>

              {enableThreshold && (
                <div className="max-w-xs">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Minimum Threshold Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={thresholdAmount}
                      onChange={(e) => setThresholdAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Recommended: ₹ 1,000 or more
                  </span>
                </div>
              )}

              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-start gap-2 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  If disabled, payouts will be initiated on your payout day regardless of balance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Card 2: Payout Preferences */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Payout Preferences</h3>
            <p className="text-xs text-slate-500">
              Choose how you want to receive your payouts.
            </p>

            <div className="space-y-3 pt-2">
              <label
                className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors ${
                  payoutMode === 'NEFT / RTGS'
                    ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payoutMode"
                  checked={payoutMode === 'NEFT / RTGS'}
                  onChange={() => setPayoutMode('NEFT / RTGS')}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500/20"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">NEFT / RTGS</p>
                  <p className="text-[11px] text-slate-500">Direct bank transfer</p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors ${
                  payoutMode === 'UPI'
                    ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payoutMode"
                  checked={payoutMode === 'UPI'}
                  onChange={() => setPayoutMode('UPI')}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500/20"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">UPI</p>
                  <p className="text-[11px] text-slate-500">Instant transfer to UPI ID</p>
                </div>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between w-full"
              >
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  Learn more about payout modes
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Explainer Card: How Payouts Work */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              How Payouts Work?
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Payouts are initiated on your selected payout day.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>It may take 1-2 business days for the amount to reflect in your account.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Make sure your bank details are correct to avoid delays.</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between w-full"
              >
                <span>View Payout Policy</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
