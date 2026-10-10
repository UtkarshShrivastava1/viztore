import React from 'react';
import {
  Megaphone,
  IndianRupee,
  Ticket,
  BarChart3,
  Shirt,
  Store,
  LayoutGrid,
  Percent,
  Image as ImageIcon,
  ChevronRight,
  ChevronDown,
  Calendar,
  Sparkles,
  Lightbulb,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useMarketingStore, AdType } from '../../stores/marketingStore.js';

export const MarketingOverviewTab: React.FC = () => {
  const { setActiveSubTab, setAdView, updateDraftAd, setCouponView } = useMarketingStore();

  const handleCreateAd = (type: AdType) => {
    updateDraftAd({ type });
    setActiveSubTab('advertisements');
    setAdView('create');
  };

  const handleCreateCoupon = () => {
    setActiveSubTab('discounts_coupons');
    setCouponView('create');
  };

  return (
    <div className="space-y-3.5">
      {/* 4 KPI Cards Matching Purchases (Bills) Standard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Active Promotions */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Active Promotions</span>
            <span className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate block">5</span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5 truncate">
              <span>↑ 25%</span>
              <span className="text-slate-400 font-normal">vs last 30d</span>
            </div>
          </div>
        </div>

        {/* Total Ad Spend */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Total Ad Spend</span>
            <span className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate block">₹ 12,450</span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5 truncate">
              <span>↑ 18.6%</span>
              <span className="text-slate-400 font-normal">vs last 30d</span>
            </div>
          </div>
        </div>

        {/* Total Coupon Redemptions */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Total Coupon Redemptions</span>
            <span className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate block">1,245</span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5 truncate">
              <span>↑ 22.3%</span>
              <span className="text-slate-400 font-normal">vs last 30d</span>
            </div>
          </div>
        </div>

        {/* Revenue from Promotions */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Revenue from Promotions</span>
            <span className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate block">₹ 48,750</span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5 truncate">
              <span>↑ 31.4%</span>
              <span className="text-slate-400 font-normal">vs last 30d</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Create a New Advertisement + Get More Customers with Ads Matching 12.0.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: 5 Ad Type Cards (8 Cols) */}
        <div className="lg:col-span-8 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Create a New Advertisement</h3>
              <p className="text-[11px] text-slate-500">
                Choose what you want to promote and get more visibility for your store.
              </p>
            </div>
            <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">
              View Pricing
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {/* Sponsored Product */}
            <div className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-200 transition-all flex flex-col justify-between text-center group">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-2">
                  <Shirt className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Sponsored Product</h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                  Promote a specific product
                </p>
              </div>
              <button
                onClick={() => handleCreateAd('Sponsored Product')}
                className="mt-3 w-full py-1 px-1.5 text-[10px] font-bold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Create Ad</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Sponsored Store */}
            <div className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-purple-50/30 hover:border-purple-200 transition-all flex flex-col justify-between text-center group">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-purple-100/70 text-purple-600 flex items-center justify-center mb-2">
                  <Store className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Sponsored Store</h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                  Increase visibility for your store
                </p>
              </div>
              <button
                onClick={() => handleCreateAd('Sponsored Store')}
                className="mt-3 w-full py-1 px-1.5 text-[10px] font-bold text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-600 hover:text-white transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Create Ad</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Category Promotion */}
            <div className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-emerald-50/30 hover:border-emerald-200 transition-all flex flex-col justify-between text-center group">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center mb-2">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Category Promotion</h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                  Show your products in a category
                </p>
              </div>
              <button
                onClick={() => handleCreateAd('Category Promotion')}
                className="mt-3 w-full py-1 px-1.5 text-[10px] font-bold text-emerald-600 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Create Ad</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Best Deals Promotion */}
            <div className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-rose-50/30 hover:border-rose-200 transition-all flex flex-col justify-between text-center group">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-rose-100/70 text-rose-600 flex items-center justify-center mb-2">
                  <Percent className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Best Deals</h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                  Promote your offers & discounts
                </p>
              </div>
              <button
                onClick={() => handleCreateAd('Best Deals Promotion')}
                className="mt-3 w-full py-1 px-1.5 text-[10px] font-bold text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-600 hover:text-white transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Create Ad</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Banner Advertisement */}
            <div className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-amber-50/30 hover:border-amber-200 transition-all flex flex-col justify-between text-center group">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center mb-2">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Banner Ad</h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                  Display custom banner
                </p>
              </div>
              <button
                onClick={() => handleCreateAd('Banner Advertisement')}
                className="mt-3 w-full py-1 px-1.5 text-[10px] font-bold text-amber-600 bg-white border border-amber-200 rounded-lg hover:bg-amber-600 hover:text-white transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Create Ad</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Get More Customers with Ads (4 Cols) */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border border-blue-200/80 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
              Boost Your Sales
            </span>
          </div>

          <div>
            <h3 className="text-sm font-black text-slate-900 pr-24">
              Get More Customers with Ads
            </h3>
            <p className="text-[11px] text-slate-600 mt-1.5 max-w-[240px]">
              Promote your products, offers and store to thousands of local shoppers.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => handleCreateAd('Sponsored Product')}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Create Advertisement</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Advertisements + Discounts & Coupons Matching 12.0.png */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Recent Advertisements Table */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-slate-900">Recent Advertisements</h3>
              <button
                onClick={() => setActiveSubTab('advertisements')}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold bg-slate-50/50">
                  <th className="py-1.5 px-2">Ad Name</th>
                  <th className="py-1.5 px-2">Type</th>
                  <th className="py-1.5 px-2">Duration</th>
                  <th className="py-1.5 px-2 text-right">Amount</th>
                  <th className="py-1.5 px-2 text-center">Status</th>
                  <th className="py-1.5 px-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  { name: 'Men Solid Cotton Shirt', type: 'Product', duration: '7 Days', amount: 1499, status: 'Active', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=80' },
                  { name: 'Fashion Hub Store', type: 'Store', duration: '15 Days', amount: 2999, status: 'Active', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&auto=format&fit=crop&q=80' },
                  { name: "Men's Fashion", type: 'Category', duration: '7 Days', amount: 1999, status: 'Scheduled', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&auto=format&fit=crop&q=80' },
                  { name: 'Weekend Sale', type: 'Best Deals', duration: '3 Days', amount: 999, status: 'Completed', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100&auto=format&fit=crop&q=80' },
                  { name: 'Summer Banner', type: 'Banner', duration: '15 Days', amount: 2499, status: 'Active', img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=100&auto=format&fit=crop&q=80' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2">
                      <div className="flex items-center gap-1.5">
                        <img src={row.img} alt="" className="w-5 h-5 rounded object-cover border border-slate-200" />
                        <span className="font-semibold text-slate-900 truncate max-w-[110px]">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-slate-600">{row.type}</td>
                    <td className="py-1.5 px-2 text-slate-600">{row.duration}</td>
                    <td className="py-1.5 px-2 text-right font-semibold text-slate-900">₹{row.amount.toLocaleString('en-IN')}</td>
                    <td className="py-1.5 px-2 text-center">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                          row.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : row.status === 'Scheduled'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <button className="text-[10px] font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-0.5 mx-auto">
                        <span>View</span>
                        <ChevronDown className="w-2.5 h-2.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Discounts & Coupons Table */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-slate-900">Discounts & Coupons</h3>
              <button
                onClick={() => setActiveSubTab('discounts_coupons')}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-semibold bg-slate-50/50">
                  <th className="py-1.5 px-2">Coupon Code</th>
                  <th className="py-1.5 px-2">Discount</th>
                  <th className="py-1.5 px-2">Valid Till</th>
                  <th className="py-1.5 px-2 text-center">Status</th>
                  <th className="py-1.5 px-2 text-right">Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  { code: 'WELCOME100', discount: '₹100 OFF Min. order ₹999', valid: '20 May 2024', status: 'Active', usage: 145 },
                  { code: 'FASHION20', discount: '20% OFF Max. ₹1,000', valid: '25 May 2024', status: 'Active', usage: 320 },
                  { code: 'FREESHIP', discount: 'Free Delivery Min. order ₹499', valid: '31 May 2024', status: 'Active', usage: 210 },
                  { code: 'B1G1', discount: 'Buy 1 Get 1 Selected products', valid: '28 May 2024', status: 'Active', usage: 98 },
                  { code: 'SUMMER50', discount: '₹50 OFF Min. order ₹699', valid: '18 May 2024', status: 'Expired', usage: 560 },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50/70 px-1.5 py-0.5 rounded text-[10px] border border-blue-200/50">
                        {row.code}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-slate-700">{row.discount}</td>
                    <td className="py-1.5 px-2 text-slate-500">{row.valid}</td>
                    <td className="py-1.5 px-2 text-center">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                          row.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-right font-medium text-slate-800">{row.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 4: Upcoming Sales + Quick Actions + Tips Matching 12.0.png */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Upcoming Sale Notifications */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900">Upcoming Sale Notifications</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Let customers subscribe to your sales and get notified.</p>
            <div className="my-4 py-4 px-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
              <Calendar className="w-6 h-6 text-slate-400 mb-1.5" />
              <span className="text-xs font-bold text-slate-800">No upcoming sales</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Create a sale or offer and allow customers to subscribe.</p>
              <button
                onClick={handleCreateCoupon}
                className="mt-3 px-3 py-1 text-[11px] font-bold text-blue-600 bg-white border border-slate-200 hover:bg-blue-50 rounded-lg shadow-2xs transition-colors"
              >
                Create Sale
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => handleCreateAd('Sponsored Product')}
                className="w-full p-2.5 rounded-xl border border-slate-200/80 hover:bg-blue-50/40 hover:border-blue-200 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-600">Create Advertisement</span>
                    <span className="text-[10px] text-slate-500">Promote your products</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={handleCreateCoupon}
                className="w-full p-2.5 rounded-xl border border-slate-200/80 hover:bg-rose-50/40 hover:border-rose-200 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-rose-600">Create Coupon</span>
                    <span className="text-[10px] text-slate-500">Add discount for customers</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Tips to Grow with Marketing */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-slate-900">Tips to Grow with Marketing</h4>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside">
            <li>Promote best selling products for higher visibility.</li>
            <li>Use attractive banners with clear offers and contact number.</li>
            <li>Create special discounts during festivals and weekends.</li>
            <li>Encourage customers to subscribe to your upcoming sales.</li>
            <li>Track performance and renew successful promotions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
