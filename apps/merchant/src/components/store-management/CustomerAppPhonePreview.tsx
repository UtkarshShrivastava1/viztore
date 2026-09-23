import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ShoppingCart,
  Search,
  ChevronDown,
  ChevronLeft,
  Heart,
  Share2,
  Home,
  Grid,
  ShoppingBag,
  Tag,
  User,
  Truck,
  Zap,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { useStoreManagementStore } from '../../stores/storeManagementStore.js';
import { useSettingsStore } from '../../stores/settingsStore.js';
import { branding } from '../../lib/branding.js';

interface CustomerAppPhonePreviewProps {
  mode?: 'customer_home' | 'storefront';
}

export const CustomerAppPhonePreview: React.FC<CustomerAppPhonePreviewProps> = ({
  mode = 'customer_home',
}) => {
  const { sections, curatedProducts } = useStoreManagementStore();
  const { storeInfo, storeFeatures, deliverySettings } = useSettingsStore();

  const [activeStoreTab, setActiveStoreTab] = useState<'shop' | 'categories' | 'about'>('shop');

  // Simulated countdown timer for "Today's Deal"
  const [timeLeft, setTimeLeft] = useState({
    hours: 6,
    minutes: 25,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 25, seconds: 30 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = () => {
    const h = String(timeLeft.hours).padStart(2, '0');
    const m = String(timeLeft.minutes).padStart(2, '0');
    const s = String(timeLeft.seconds).padStart(2, '0');
    return `${h} : ${m} : ${s}`;
  };

  // Active sections sorted by priority
  const activeSections = [...sections]
    .filter((s) => s.isActive)
    .sort((a, b) => a.priority - b.priority);

  return (
    <div className="w-full max-w-[340px] mx-auto select-none">
      <div className="text-center mb-3">
        <h3 className="text-sm font-bold text-slate-800">Customer App Preview</h3>
      </div>

      {/* Phone Outer Chassis */}
      <div className="relative mx-auto w-[320px] rounded-[42px] p-3 bg-slate-900 shadow-2xl border-4 border-slate-800">
        {/* Top Speaker / Dynamic Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center">
          <div className="w-10 h-1.5 bg-slate-800 rounded-full" />
          <div className="w-2.5 h-2.5 bg-slate-800/80 rounded-full ml-2" />
        </div>

        {/* Screen Glass Frame */}
        <div className="relative w-full h-[620px] bg-white rounded-[32px] overflow-hidden flex flex-col font-sans text-slate-800">
          {/* iOS Status Bar */}
          <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-900 shrink-0 z-20 bg-white">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              {/* Cellular Signal */}
              <div className="flex items-end gap-0.5 h-2.5">
                <span className="w-0.5 h-1 bg-slate-900 rounded-2xs" />
                <span className="w-0.5 h-1.5 bg-slate-900 rounded-2xs" />
                <span className="w-0.5 h-2 bg-slate-900 rounded-2xs" />
                <span className="w-0.5 h-2.5 bg-slate-900 rounded-2xs" />
              </div>
              {/* Wifi */}
              <svg className="w-3 h-3 fill-slate-900" viewBox="0 0 24 24">
                <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z" />
              </svg>
              {/* Battery */}
              <div className="w-5 h-2.5 border border-slate-900 rounded-2xs p-0.5 flex items-center">
                <div className="w-full h-full bg-slate-900 rounded-3xs" />
              </div>
            </div>
          </div>

          {/* Dual Content Modes */}
          {mode === 'customer_home' ? (
            /* Mode 1: Customer App Home (14.0.png, 14.1.png) */
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
              {/* Delivery Header */}
              <div className="px-4 py-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 block leading-none">Deliver to</span>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-0.5">
                      Malviya Nagar, Jaipur
                      <ChevronDown className="w-3 h-3 text-slate-500" />
                    </span>
                  </div>
                </div>
                <div className="relative p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                  <ShoppingCart className="w-4 h-4 text-slate-800" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                    2
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="px-4 py-1 shrink-0">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 text-slate-400 border border-slate-200/60">
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs truncate">Search for products, stores...</span>
                </div>
              </div>

              {/* Dynamic Scrollable Sections */}
              <div className="flex-1 px-4 py-2.5 space-y-4">
                {activeSections.map((sec) => {
                  const isDeal = sec.name.toLowerCase().includes('deal');
                  const isArrivals = sec.name.toLowerCase().includes('arrival');
                  const isBestSellers = sec.name.toLowerCase().includes('best');

                  return (
                    <div key={sec.id} className="space-y-2">
                      {/* Section Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{sec.name}</h4>
                          {isDeal && (
                            <span className="text-[10px] font-mono font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">
                              Ends in {formatTimer()}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-blue-600 hover:underline cursor-pointer">
                          View All
                        </span>
                      </div>

                      {/* Section Items Grid / Horizontal Rail */}
                      {isArrivals ? (
                        /* 3-card mini grid for New Arrivals */
                        <div className="grid grid-cols-3 gap-2">
                          {curatedProducts.slice(5, 8).map((p) => (
                            <div
                              key={p.id}
                              className="bg-white rounded-xl border border-slate-100 p-1.5 shadow-2xs space-y-1"
                            >
                              <div className="aspect-square rounded-lg bg-slate-50 overflow-hidden flex items-center justify-center">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-[10px] font-semibold text-slate-800 line-clamp-1">
                                {p.name}
                              </p>
                              <p className="text-[10px] font-bold text-slate-900">₹{p.price}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Horizontal Scroll rail for Deals & Best Sellers */
                        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                          {(isBestSellers ? curatedProducts.slice(3, 6) : curatedProducts.slice(0, 3)).map(
                            (p) => (
                              <div
                                key={p.id}
                                className="w-24 shrink-0 bg-white rounded-xl border border-slate-100 p-1.5 shadow-2xs space-y-1"
                              >
                                <div className="aspect-square rounded-lg bg-slate-50 overflow-hidden flex items-center justify-center relative">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <p className="text-[9px] font-medium text-slate-800 line-clamp-1 leading-tight">
                                  {p.name}
                                </p>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-[10px] font-bold text-slate-900">
                                    ₹{p.price}
                                  </span>
                                  {p.originalPrice && (
                                    <span className="text-[8px] text-slate-400 line-through">
                                      ₹{p.originalPrice}
                                    </span>
                                  )}
                                </div>
                                {p.discount && (
                                  <span className="text-[8px] font-bold text-emerald-600 block">
                                    {p.discount}
                                  </span>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Mode 2: Storefront Detail Mode (14.2.png) */
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
              {/* Storefront Hero with Cover & Back Controls */}
              <div className="relative h-28 shrink-0 bg-slate-800">
                <img
                  src={storeInfo.coverUrl}
                  alt="Store Cover"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-white">
                  <button type="button" className="p-1 rounded-full bg-black/40 hover:bg-black/60">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button type="button" className="p-1 rounded-full bg-black/40 hover:bg-black/60">
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded-full bg-black/40 hover:bg-black/60">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Floating Store Avatar & Info Badge */}
                <div className="absolute -bottom-6 left-3 flex items-end gap-2.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white font-extrabold text-base flex items-center justify-center border-2 border-white shadow-md shrink-0">
                    FH
                  </div>
                  <div className="text-white pb-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-black leading-tight drop-shadow-xs">
                        {storeInfo.storeName || branding.appName}
                      </span>
                      <CheckCircle className="w-3 h-3 text-blue-400 fill-blue-400" />
                    </div>
                    <p className="text-[9px] text-slate-200 drop-shadow-xs leading-none">
                      {storeInfo.tagline}
                    </p>
                    <p className="text-[9px] text-amber-300 drop-shadow-xs font-semibold mt-0.5">
                      ★ {storeInfo.rating} ({storeInfo.reviewCount})
                    </p>
                  </div>
                </div>
              </div>

              {/* USP Chips Bar */}
              <div className="pt-8 px-3 pb-2 shrink-0">
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="p-1 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-slate-800">
                      <Truck className="w-2.5 h-2.5 text-blue-600" />
                      Free Delivery
                    </div>
                    <span className="text-[8px] text-slate-400">
                      Above ₹{deliverySettings.freeDeliveryThreshold}
                    </span>
                  </div>
                  <div className="p-1 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-slate-800">
                      <Zap className="w-2.5 h-2.5 text-amber-500" />
                      Fast Delivery
                    </div>
                    <span className="text-[8px] text-slate-400">
                      {deliverySettings.estimatedTimeMin}–{deliverySettings.estimatedTimeMax} mins
                    </span>
                  </div>
                  <div className="p-1 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-slate-800">
                      <RotateCcw className="w-2.5 h-2.5 text-emerald-600" />
                      Easy Returns
                    </div>
                    <span className="text-[8px] text-slate-400">7 days return</span>
                  </div>
                </div>
              </div>

              {/* Storefront Navigation Tabs */}
              <div className="px-3 border-b border-slate-100 flex items-center gap-4 text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveStoreTab('shop')}
                  className={`py-1.5 border-b-2 transition-colors ${
                    activeStoreTab === 'shop'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500'
                  }`}
                >
                  Shop
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStoreTab('categories')}
                  className={`py-1.5 border-b-2 transition-colors ${
                    activeStoreTab === 'categories'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500'
                  }`}
                >
                  Categories
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStoreTab('about')}
                  className={`py-1.5 border-b-2 transition-colors ${
                    activeStoreTab === 'about'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500'
                  }`}
                >
                  About Us
                </button>
              </div>

              {/* Storefront Tab Body */}
              <div className="flex-1 p-3 space-y-3">
                {activeStoreTab === 'shop' && (
                  <>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">Today's Deal</span>
                        <span className="text-[10px] text-blue-600 font-semibold">View All</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {curatedProducts.slice(0, 2).map((p) => (
                          <div
                            key={p.id}
                            className="bg-white rounded-xl border border-slate-100 p-2 shadow-2xs space-y-1"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="aspect-square w-full rounded-lg object-cover"
                            />
                            <p className="text-[10px] font-semibold text-slate-800 truncate">
                              {p.name}
                            </p>
                            <p className="text-[10px] font-bold text-slate-900">₹{p.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">Best Sellers</span>
                        <span className="text-[10px] text-blue-600 font-semibold">View All</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {curatedProducts.slice(2, 4).map((p) => (
                          <div
                            key={p.id}
                            className="bg-white rounded-xl border border-slate-100 p-2 shadow-2xs space-y-1"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="aspect-square w-full rounded-lg object-cover"
                            />
                            <p className="text-[10px] font-semibold text-slate-800 truncate">
                              {p.name}
                            </p>
                            <p className="text-[10px] font-bold text-slate-900">₹{p.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeStoreTab === 'categories' && (
                  <div className="space-y-2">
                    {['Electronics', 'Wearables', 'Personal Care', 'Audio', 'Fragrance'].map((cat) => (
                      <div
                        key={cat}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700"
                      >
                        <span>{cat}</span>
                        <span className="text-[10px] text-slate-400">12 items</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeStoreTab === 'about' && (
                  <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">{storeInfo.storeName}</p>
                    <p className="text-[11px] leading-relaxed">{storeInfo.description}</p>
                    <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px]">
                      <p>📍 {storeInfo.address}</p>
                      <p>📞 {storeInfo.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom App Tab Bar */}
          <div className="h-12 border-t border-slate-200/80 bg-white px-3 flex items-center justify-around shrink-0 text-slate-400 z-20">
            <div className="flex flex-col items-center text-blue-600">
              <Home className="w-4 h-4" />
              <span className="text-[8px] font-bold mt-0.5">Home</span>
            </div>
            <div className="flex flex-col items-center hover:text-slate-600">
              <Grid className="w-4 h-4" />
              <span className="text-[8px] mt-0.5">Categories</span>
            </div>
            <div className="flex flex-col items-center hover:text-slate-600">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-[8px] mt-0.5">Orders</span>
            </div>
            <div className="flex flex-col items-center hover:text-slate-600">
              <Tag className="w-4 h-4" />
              <span className="text-[8px] mt-0.5">Offers</span>
            </div>
            <div className="flex flex-col items-center hover:text-slate-600">
              <User className="w-4 h-4" />
              <span className="text-[8px] mt-0.5">Account</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
