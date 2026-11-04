import React, { useState } from 'react';
import {
  ShoppingBag,
  ClipboardList,
  Boxes,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  Check,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Store,
  Wallet,
  Activity,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore.js';
import { useOrderStore } from '../../stores/orderStore.js';
import { useCatalogStore } from '../../stores/catalogStore.js';

export const GreetingHeader: React.FC = () => {
  const { user, currentStore, isStoreActive } = useAuthStore();
  const { fetchOrders } = useOrderStore();
  const { fetchProducts } = useCatalogStore();

  const [selectedRange, setSelectedRange] = useState('Last 7 Days');
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const storeName = currentStore?.name || user?.fullName || 'Star Electronics';
  const storeId = currentStore?._id || currentStore?.id || '';

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: '🌅' };
    if (hour < 17) return { text: 'Good Afternoon', icon: '☀️' };
    return { text: 'Good Evening', icon: '🌙' };
  };

  const greeting = getTimeGreeting();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const sid = currentStore?._id || currentStore?.id;
      await Promise.all([fetchOrders(sid), fetchProducts(sid)]);
    } catch {
      // silently handle
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const dateRanges = [
    'Today',
    'Yesterday',
    'Last 7 Days',
    'Last 30 Days',
    'This Month',
    'This Quarter',
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/30 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg">{greeting.icon}</span>
          <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {greeting.text}, <span className="text-blue-600">{user?.fullName || storeName}</span>!
          </h1>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 shadow-2xs">
            <Store className="w-3 h-3 text-blue-600" />
            <span>{storeName}</span>
          </span>
          {isStoreActive ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live & Accepting Orders</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Offline</span>
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
          <span>Real-time retail overview and sales performance dashboard</span>
          {storeId && (
            <>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-[10px] text-slate-400">ID: #{storeId.slice(-4)}</span>
            </>
          )}
        </p>
      </div>

      {/* Date Filter & Manual Refresh */}
      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 shadow-2xs transition-all cursor-pointer group"
          title="Refresh dashboard data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{selectedRange}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
              <div className="absolute right-0 mt-1.5 w-44 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Select Time Range
                </div>
                {dateRanges.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => {
                      setSelectedRange(range);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-blue-50/60 transition-colors cursor-pointer ${
                      selectedRange === range ? 'font-bold text-blue-600 bg-blue-50/80' : 'text-slate-700'
                    }`}
                  >
                    <span>{range}</span>
                    {selectedRange === range && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const KpiCards: React.FC = () => {
  const { orders, isLoading: ordersLoading } = useOrderStore();
  const { products, isLoading: productsLoading } = useCatalogStore();

  const totalSalesAmount = orders.reduce((sum, o) => sum + (o.pricing?.totalAmount || 0), 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalSalesAmount / orders.length) : 0;
  const isInitialLoading = (ordersLoading && orders.length === 0) || (productsLoading && products.length === 0);

  const kpis = [
    {
      title: 'Total Revenue',
      value: isInitialLoading ? '...' : `₹${Math.round(totalSalesAmount).toLocaleString('en-IN')}`,
      change: orders.length > 0 ? '+100%' : '0%',
      timeframe: 'vs last 7 days',
      subtitle: `Avg. Basket: ₹${avgOrderValue.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      iconGradient: 'from-blue-600 to-indigo-600',
      glowColor: 'group-hover:border-blue-400/50',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
    {
      title: 'Total Orders',
      value: isInitialLoading ? '...' : `${orders.length}`,
      change: orders.length > 0 ? '+100%' : '0%',
      timeframe: 'vs last 7 days',
      subtitle: `${orders.filter((o) => o.status === 'delivered').length} delivered • ${orders.filter((o) => o.status === 'shipped').length} active`,
      icon: ClipboardList,
      iconGradient: 'from-emerald-600 to-teal-600',
      glowColor: 'group-hover:border-emerald-400/50',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
    {
      title: 'Products Listed',
      value: isInitialLoading ? '...' : `${products.length}`,
      change: products.length > 0 ? '+100%' : '0%',
      timeframe: 'active in catalog',
      subtitle: `${products.filter((p) => p.stock > 0).length} in stock • 100% active`,
      icon: Boxes,
      iconGradient: 'from-purple-600 to-pink-600',
      glowColor: 'group-hover:border-purple-400/50',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.title}
            className={`p-4 bg-gradient-to-b from-white via-white to-slate-50/70 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md ${kpi.glowColor} hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group`}
          >
            {/* Top Shine Highlight on Hover */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                  {kpi.title}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 truncate block">
                  {kpi.value}
                </span>
              </div>

              {/* Gradient Icon Medallion */}
              <div
                className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${kpi.iconGradient} text-white flex items-center justify-center shrink-0 shadow-md shadow-black/10 group-hover:scale-105 transition-transform duration-300`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Bottom Metrics & Delta */}
            <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-[11px] gap-2">
              <div className="flex items-center gap-1.5 truncate">
                <span className={`inline-flex items-center font-extrabold text-[10px] px-1.5 py-0.5 rounded-full border ${kpi.badgeBg} gap-0.5`}>
                  <ArrowUpRight className="w-3 h-3" />
                  {kpi.change}
                </span>
                <span className="text-slate-400 text-[10px] truncate">{kpi.timeframe}</span>
              </div>

              <span className="text-[10px] font-semibold text-slate-500 truncate text-right">
                {kpi.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const SalesOverview: React.FC = () => {
  return (
    <div className="space-y-4">
      <GreetingHeader />
      <KpiCards />
    </div>
  );
};
