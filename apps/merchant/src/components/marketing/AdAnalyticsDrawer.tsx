import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  Eye,
  MousePointer,
  Percent,
  IndianRupee,
  Calendar,
  Play,
  Pause,
  Plus,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShoppingBag,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useMarketingStore, AdvertisementItem } from '../../stores/marketingStore.js';

interface AdAnalyticsDrawerProps {
  ad: AdvertisementItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdAnalyticsDrawer: React.FC<AdAnalyticsDrawerProps> = ({ ad, isOpen, onClose }) => {
  const { toggleAdStatus, topUpAdBudget, updateAd, walletBalance } = useMarketingStore();

  const [topUpAmount, setTopUpAmount] = useState<number>(1000);
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(ad?.name || '');
  const [editBudgetDaily, setEditBudgetDaily] = useState(ad?.budgetDaily || 200);

  if (!isOpen || !ad) return null;

  // Chart timeseries data for impressions vs clicks
  const chartData = [
    { date: 'Day 1', impressions: Math.round(ad.impressions * 0.08), clicks: Math.round(ad.clicks * 0.07) },
    { date: 'Day 2', impressions: Math.round(ad.impressions * 0.12), clicks: Math.round(ad.clicks * 0.11) },
    { date: 'Day 3', impressions: Math.round(ad.impressions * 0.16), clicks: Math.round(ad.clicks * 0.15) },
    { date: 'Day 4', impressions: Math.round(ad.impressions * 0.18), clicks: Math.round(ad.clicks * 0.19) },
    { date: 'Day 5', impressions: Math.round(ad.impressions * 0.22), clicks: Math.round(ad.clicks * 0.21) },
    { date: 'Day 6', impressions: Math.round(ad.impressions * 0.14), clicks: Math.round(ad.clicks * 0.16) },
    { date: 'Day 7', impressions: Math.round(ad.impressions * 0.10), clicks: Math.round(ad.clicks * 0.11) },
  ];

  const conversions = Math.round(ad.clicks * 0.076) || 12;
  const conversionRate = ad.clicks > 0 ? ((conversions / ad.clicks) * 100).toFixed(1) : '0.0';
  const cpc = ad.clicks > 0 ? (ad.totalSpend / ad.clicks).toFixed(2) : '0.00';
  const cpa = conversions > 0 ? (ad.totalSpend / conversions).toFixed(2) : '0.00';

  const handleTopUp = () => {
    if (walletBalance >= topUpAmount) {
      topUpAdBudget(ad.id, topUpAmount);
      setTopUpSuccess(true);
      setTimeout(() => setTopUpSuccess(false), 2500);
    } else {
      alert('Insufficient wallet balance. Please add funds to your wallet.');
    }
  };

  const handleSaveEdit = () => {
    updateAd(ad.id, {
      name: editName.trim() || ad.name,
      budgetDaily: Number(editBudgetDaily) || ad.budgetDaily,
    });
    setIsEditing(false);
  };

  const isAdActive = ad.status === 'Active';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/60 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <img
              src={ad.imageUrl}
              alt={ad.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] font-bold text-slate-400">
                  {ad.id}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {ad.type}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    ad.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : ad.status === 'Paused'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {ad.status}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 truncate mt-0.5">
                {ad.name}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                {ad.startDate} - {ad.endDate} ({ad.duration})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Status Toggle */}
            <button
              type="button"
              onClick={() => toggleAdStatus(ad.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs ${
                isAdActive
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isAdActive ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body Scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* 6 Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Impressions */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-semibold">Impressions</span>
                <Eye className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <span className="text-base sm:text-lg font-black text-slate-900">
                {ad.impressions.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                +14.2% reach
              </span>
            </div>

            {/* Clicks */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-semibold">Total Clicks</span>
                <MousePointer className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <span className="text-base sm:text-lg font-black text-slate-900">
                {ad.clicks.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                +8.9% engagement
              </span>
            </div>

            {/* CTR */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-semibold">CTR</span>
                <Percent className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="text-base sm:text-lg font-black text-slate-900">
                {ad.ctr.toFixed(2)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Industry avg: 2.1%
              </span>
            </div>

            {/* Spend */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-semibold">Total Spend</span>
                <IndianRupee className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <span className="text-base sm:text-lg font-black text-slate-900">
                ₹{ad.totalSpend.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Budget: ₹{ad.amount.toLocaleString()}
              </span>
            </div>

            {/* Revenue Generated */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-semibold">Revenue</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="text-base sm:text-lg font-black text-slate-900">
                ₹{ad.revenueGenerated.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                Net return
              </span>
            </div>

            {/* ROAS */}
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between text-emerald-700 mb-1">
                <span className="text-[11px] font-bold">ROAS</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-base sm:text-lg font-black text-emerald-700">
                {ad.roas.toFixed(2)}x
              </span>
              <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                High Performance
              </span>
            </div>
          </div>

          {/* Recharts Impressions vs Clicks Dual Curve */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Performance Curve: Impressions vs. Clicks
                </h3>
                <p className="text-[11px] text-slate-500">
                  Daily tracking curve over campaign lifetime
                </p>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                Live Telemetry
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '11px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="impressions"
                    name="Impressions"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorImpressions)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="clicks"
                    name="Clicks"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Efficiency & Conversion Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 text-center">
              <span className="text-[10px] text-slate-500 font-semibold block">Conversions</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">{conversions} orders</span>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 text-center">
              <span className="text-[10px] text-slate-500 font-semibold block">Conversion Rate</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">{conversionRate}%</span>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 text-center">
              <span className="text-[10px] text-slate-500 font-semibold block">Cost / Click (CPC)</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">₹{cpc}</span>
            </div>
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 text-center">
              <span className="text-[10px] text-slate-500 font-semibold block">Cost / Order (CPA)</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">₹{cpa}</span>
            </div>
          </div>

          {/* Product Breakdown Table (12.6a.png) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">
                Target Entity Performance Breakdown
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">
                SKU: {ad.targetId || 'PRD-10245'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2 px-2.5">Entity</th>
                    <th className="py-2 px-2 text-right">Impressions</th>
                    <th className="py-2 px-2 text-right">Clicks</th>
                    <th className="py-2 px-2 text-right">CTR</th>
                    <th className="py-2 px-2 text-right">Orders</th>
                    <th className="py-2 px-2 text-right">Spend</th>
                    <th className="py-2 px-2.5 text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-2.5 font-bold text-slate-800 flex items-center gap-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate max-w-[140px]">{ad.targetName || ad.name}</span>
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-600">{ad.impressions.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right text-slate-600">{ad.clicks.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right font-semibold text-slate-800">{ad.ctr.toFixed(2)}%</td>
                    <td className="py-2.5 px-2 text-right font-semibold text-emerald-600">{conversions}</td>
                    <td className="py-2.5 px-2 text-right text-slate-700 font-medium">₹{ad.totalSpend.toLocaleString()}</td>
                    <td className="py-2.5 px-2.5 text-right font-black text-emerald-700">{ad.roas.toFixed(2)}x</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Budget Top-Up Action Section */}
          <div className="bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-white rounded-xl border border-blue-200/80 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Top-Up Campaign Budget
                </h3>
                <p className="text-[11px] text-slate-500">
                  Add funds instantly to keep this campaign running at maximum velocity.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Available in Wallet</span>
                <span className="text-xs font-black text-slate-900">₹{walletBalance.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[500, 1000, 2500, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    topUpAmount === amt
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  +₹{amt.toLocaleString()}
                </button>
              ))}

              <button
                type="button"
                onClick={handleTopUp}
                className="ml-auto px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Top Up Now</span>
              </button>
            </div>

            {topUpSuccess && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>₹{topUpAmount.toLocaleString()} successfully added to campaign budget from wallet!</span>
              </div>
            )}
          </div>

          {/* Quick Edit Settings Modal / Expandable */}
          {isEditing ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">Edit Campaign Parameters</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Campaign Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Daily Budget Cap (₹)</label>
                  <input
                    type="number"
                    value={editBudgetDaily}
                    onChange={(e) => setEditBudgetDaily(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-3.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Edit Campaign Details</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
