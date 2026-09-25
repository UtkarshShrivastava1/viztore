import React, { useState } from 'react';
import {
  Megaphone,
  Users,
  Ticket,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
  Percent,
  Bell,
  Eye,
  Info,
  Lightbulb,
} from 'lucide-react';
import { useMarketingStore } from '../../stores/marketingStore.js';

export const MarketingOverviewTab: React.FC = () => {
  const { setActiveSubTab, setActiveCampaignView, campaigns } = useMarketingStore();
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  const recentCampaigns = campaigns.slice(0, 5);

  const topPerforming = [
    { rank: 1, name: 'Summer Sale - Get 20% Off', redemptions: 320, revenue: 12450 },
    { rank: 2, name: 'Weekend Special Offer', redemptions: 210, revenue: 6750 },
    { rank: 3, name: 'New User Welcome Offer', redemptions: 185, revenue: 4600 },
    { rank: 4, name: 'Refer & Earn', redemptions: 130, revenue: 3250 },
    { rank: 5, name: 'Flash Sale - Today Only', redemptions: 98, revenue: 2150 },
  ];

  return (
    <div className="space-y-6">
      {/* 5 KPI Cards (13.0.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Campaigns */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Campaigns
            </span>
            <div className="text-2xl font-black text-slate-900">12</div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>20% vs last 30 days</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Total Reach */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Reach
            </span>
            <div className="text-2xl font-black text-slate-900">18,450</div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>15% vs last 30 days</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Total Redemptions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Redemptions
            </span>
            <div className="text-2xl font-black text-slate-900">1,245</div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>18% vs last 30 days</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Revenue Generated */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Revenue Generated
            </span>
            <div className="text-2xl font-black text-slate-900">₹ 48,750.00</div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>22% vs last 30 days</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

        {/* Card 5: Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Conversion Rate
            </span>
            <div className="text-2xl font-black text-slate-900">6.75%</div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>1.2% vs last 30 days</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Middle 3-Column Layout (13.0.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Campaigns & Campaign Type Distribution (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Campaigns Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Recent Campaigns</h3>
              <button
                type="button"
                onClick={() => {
                  setActiveSubTab('campaigns');
                  setActiveCampaignView('list');
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentCampaigns.map((camp) => (
                <div key={camp.id} className="py-3 flex items-start gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition-colors">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60 flex items-center justify-center">
                    <img
                      src={camp.bannerImageUrl}
                      alt={camp.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{camp.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          camp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : camp.status === 'Scheduled'
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : camp.status === 'Completed'
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{camp.startDate} - {camp.endDate}</div>
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-1 border-t border-slate-50 text-[10px]">
                      <div>
                        <span className="text-slate-400 block">Reach</span>
                        <span className="font-bold text-slate-700">{camp.reach > 0 ? camp.reach.toLocaleString() : '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Redemptions</span>
                        <span className="font-bold text-slate-700">{camp.redemptions > 0 ? camp.redemptions : '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Revenue</span>
                        <span className="font-bold text-slate-700">{camp.revenue > 0 ? `₹ ${camp.revenue.toLocaleString()}` : '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Type Distribution Donut Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Campaign Type Distribution</h3>
            <div className="flex items-center justify-center py-2">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Donut segments */}
                  {/* Discount: 41.67% -> strokeDasharray 41.67 58.33 */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="41.67 58.33" strokeDashoffset="0" />
                  {/* Free Delivery: 25% -> strokeDasharray 25 75 */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="25 75" strokeDashoffset="-41.67" />
                  {/* Welcome: 16.67% */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#06b6d4" strokeWidth="12" strokeDasharray="16.67 83.33" strokeDashoffset="-66.67" />
                  {/* Referral: 8.33% */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="8.33 91.67" strokeDashoffset="-83.34" />
                  {/* Others: 8.33% */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f43f5e" strokeWidth="12" strokeDasharray="8.33 91.67" strokeDashoffset="-91.67" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] text-slate-400 font-medium">Total</span>
                  <span className="text-xl font-black text-slate-900 leading-tight">12</span>
                  <span className="text-[9px] text-slate-400">Campaigns</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-600 font-medium">Discount Campaigns</span>
                </div>
                <span className="font-bold text-slate-800">5 (41.67%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Free Delivery</span>
                </div>
                <span className="font-bold text-slate-800">3 (25.00%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span className="text-slate-600 font-medium">Welcome Offers</span>
                </div>
                <span className="font-bold text-slate-800">2 (16.67%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Referral Program</span>
                </div>
                <span className="font-bold text-slate-800">1 (8.33%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600 font-medium">Others</span>
                </div>
                <span className="font-bold text-slate-800">1 (8.33%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Performance Overview & Reach Distribution (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Performance Overview</h3>
              <select
                aria-label="Filter performance overview time range"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none"
              >
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>This Month</option>
                <option>All Time</option>
              </select>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-slate-600 font-medium">Reach</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 font-medium">Redemptions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                <span className="text-slate-600 font-medium">Revenue (₹)</span>
              </div>
            </div>

            {/* Multi-line Trend SVG Chart */}
            <div className="mt-4 pt-2">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Reach / Redemptions</span>
                <span>Revenue (₹)</span>
              </div>
              <div className="h-52 w-full">
                <svg viewBox="0 0 450 180" className="w-full h-full overflow-visible">
                  {/* Grid lines */}
                  <line x1="30" y1="20" x2="420" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="30" y1="60" x2="420" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="30" y1="100" x2="420" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="30" y1="140" x2="420" y2="140" stroke="#f1f5f9" strokeDasharray="3 3" />

                  {/* Left Axis Labels */}
                  <text x="25" y="24" textAnchor="end" className="text-[9px] fill-slate-400">4K</text>
                  <text x="25" y="64" textAnchor="end" className="text-[9px] fill-slate-400">3K</text>
                  <text x="25" y="104" textAnchor="end" className="text-[9px] fill-slate-400">2K</text>
                  <text x="25" y="144" textAnchor="end" className="text-[9px] fill-slate-400">1K</text>
                  <text x="25" y="165" textAnchor="end" className="text-[9px] fill-slate-400">0</text>

                  {/* Right Axis Labels */}
                  <text x="425" y="24" textAnchor="start" className="text-[9px] fill-slate-400">20K</text>
                  <text x="425" y="64" textAnchor="start" className="text-[9px] fill-slate-400">15K</text>
                  <text x="425" y="104" textAnchor="start" className="text-[9px] fill-slate-400">10K</text>
                  <text x="425" y="144" textAnchor="start" className="text-[9px] fill-slate-400">5K</text>
                  <text x="425" y="165" textAnchor="start" className="text-[9px] fill-slate-400">0</text>

                  {/* Reach Line (Blue) */}
                  <path
                    d="M 50 110 Q 110 80 170 95 T 260 70 T 340 90 T 410 75"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="110" r="3.5" fill="#2563eb" />
                  <circle cx="170" cy="95" r="3.5" fill="#2563eb" />
                  <circle cx="260" cy="70" r="3.5" fill="#2563eb" />
                  <circle cx="340" cy="90" r="3.5" fill="#2563eb" />
                  <circle cx="410" cy="75" r="3.5" fill="#2563eb" />

                  {/* Revenue Line (Purple) */}
                  <path
                    d="M 50 90 Q 110 95 170 88 T 260 88 T 340 98 T 410 85"
                    fill="none"
                    stroke="#9333ea"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="90" r="3.5" fill="#9333ea" />
                  <circle cx="170" cy="88" r="3.5" fill="#9333ea" />
                  <circle cx="260" cy="88" r="3.5" fill="#9333ea" />
                  <circle cx="340" cy="98" r="3.5" fill="#9333ea" />
                  <circle cx="410" cy="85" r="3.5" fill="#9333ea" />

                  {/* Redemptions Line (Green) */}
                  <path
                    d="M 50 145 Q 110 150 170 142 T 260 145 T 340 145 T 410 138"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="145" r="3.5" fill="#10b981" />
                  <circle cx="170" cy="142" r="3.5" fill="#10b981" />
                  <circle cx="260" cy="145" r="3.5" fill="#10b981" />
                  <circle cx="340" cy="145" r="3.5" fill="#10b981" />
                  <circle cx="410" cy="138" r="3.5" fill="#10b981" />

                  {/* X Axis Date Labels */}
                  <text x="50" y="172" textAnchor="middle" className="text-[9px] fill-slate-400">16 Apr</text>
                  <text x="140" y="172" textAnchor="middle" className="text-[9px] fill-slate-400">23 Apr</text>
                  <text x="230" y="172" textAnchor="middle" className="text-[9px] fill-slate-400">30 Apr</text>
                  <text x="320" y="172" textAnchor="middle" className="text-[9px] fill-slate-400">07 May</text>
                  <text x="410" y="172" textAnchor="middle" className="text-[9px] fill-slate-400">14 May</text>
                </svg>
              </div>
            </div>

            {/* Reach by Type Distribution Progress Bars */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-3">Reach Type Distribution</h4>
              <div className="space-y-3">
                {/* Push Notification */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Push Notification</span>
                    <span className="font-bold text-slate-800">8,450 (45.8%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '45.8%' }} />
                  </div>
                </div>

                {/* SMS */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">SMS</span>
                    <span className="font-bold text-slate-800">4,120 (22.3%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '22.3%' }} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Email</span>
                    <span className="font-bold text-slate-800">3,250 (17.6%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: '17.6%' }} />
                  </div>
                </div>

                {/* In-App Banner */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">In-App Banner</span>
                    <span className="font-bold text-slate-800">2,630 (14.3%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: '14.3%' }} />
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Social Media</span>
                    <span className="font-bold text-slate-800">- (0%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-slate-300 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Top Performing Campaigns & Quick Actions (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Performing Campaigns Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Top Performing Campaigns</h3>
              <button
                type="button"
                onClick={() => {
                  setActiveSubTab('campaigns');
                  setActiveCampaignView('list');
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                View All
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 border-b border-slate-100 pb-1">
                <span>Campaign</span>
                <div className="flex gap-4">
                  <span>Redemptions</span>
                  <span>Revenue (₹)</span>
                </div>
              </div>

              {topPerforming.map((item) => (
                <div key={item.rank} className="flex items-center justify-between text-xs py-1.5 hover:bg-slate-50 rounded-lg px-1 transition-colors">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        item.rank === 1
                          ? 'bg-amber-100 text-amber-800 font-bold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <span className="font-semibold text-slate-800 truncate text-[11px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex gap-6 shrink-0 text-[11px] text-right">
                    <span className="font-bold text-slate-700 w-8">{item.redemptions}</span>
                    <span className="font-bold text-slate-900 w-12">{item.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setActiveSubTab('campaigns');
                  setActiveCampaignView('create');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Create New Campaign</h5>
                    <p className="text-[10px] text-slate-400">Run a new campaign to promote offers</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('discounts')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Create Discount / Offer</h5>
                    <p className="text-[10px] text-slate-400">Create discounts and offers for customers</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('coupons')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Create Coupon</h5>
                    <p className="text-[10px] text-slate-400">Create and manage coupons</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('push')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Send Push Notification</h5>
                    <p className="text-[10px] text-slate-400">Send notifications to your customers</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveSubTab('campaigns');
                  setActiveCampaignView('list');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">View All Campaigns</h5>
                    <p className="text-[10px] text-slate-400">View and manage all campaigns</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tip Banner (13.0.png) */}
      <div className="rounded-2xl bg-blue-50/80 border border-blue-200/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">
              <span className="font-bold">Tip:</span> Run targeted campaigns and offer personalized discounts to increase customer engagement and boost sales.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setActiveSubTab('campaigns')}
          className="px-4 py-2 rounded-xl bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 font-bold text-xs shadow-2xs whitespace-nowrap"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};
