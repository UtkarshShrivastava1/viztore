import React, { useState } from 'react';
import {
  Camera,
  Trash2,
  Upload,
  CheckCircle2,
  Smartphone,
  Monitor,
  Eye,
  ArrowLeft,
  Check,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Search,
  Heart,
  ShoppingCart,
  Signal,
  Wifi,
  Battery,
  ChevronRight,
} from 'lucide-react';
import { useStoreManagementStore } from '../../stores/storeManagementStore.js';

export const ManageBannerLogoView: React.FC = () => {
  const {
    storeLogo,
    storeBanner,
    setStoreLogo,
    setStoreBanner,
    setActiveSubTab,
  } = useStoreManagementStore();

  const [logoPreview, setLogoPreview] = useState(
    storeLogo || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=512&auto=format&fit=crop&q=80'
  );
  const [webBannerPreview, setWebBannerPreview] = useState(
    storeBanner || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80'
  );
  const [mobileBannerPreview, setMobileBannerPreview] = useState(
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80'
  );
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      setStoreLogo(url);
      showNotice();
    }
  };

  const handleWebBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setWebBannerPreview(url);
      setStoreBanner(url);
      showNotice();
    }
  };

  const handleMobileBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMobileBannerPreview(url);
      showNotice();
    }
  };

  const showNotice = () => {
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Breadcrumb & Header (13.2.png) */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span
              className="hover:text-slate-600 cursor-pointer"
              onClick={() => setActiveSubTab('overview')}
            >
              Home
            </span>
            <span>&gt;</span>
            <span
              className="hover:text-slate-600 cursor-pointer"
              onClick={() => setActiveSubTab('overview')}
            >
              Store Management
            </span>
            <span>&gt;</span>
            <span className="text-slate-800 font-bold">Manage Banner / Logo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Manage Banner / Logo
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload and manage your store logo and banner images that appear in the customer app.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveSubTab('overview')}
          className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {isSavedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Brand assets updated and synchronized!</span>
        </div>
      )}

      {/* Main 2-Column Layout: Left Controls (7 cols) + Right Live Phone Mockup (5 cols) (13.2.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Section 1: Store Logo */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">1. Store Logo</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                This logo will be shown in your store profile on the customer app.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Logo Preview Square */}
              <div className="relative w-28 h-28 rounded-2xl bg-black border-2 border-slate-200 shadow-sm flex items-center justify-center text-white font-black text-center p-2 overflow-hidden shrink-0 group">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="space-y-0.5">
                    <span className="text-xs uppercase tracking-wider block">FASHION</span>
                    <span className="text-xs uppercase tracking-wider block">HUB</span>
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Replace</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>

              {/* Logo Metadata & Actions */}
              <div className="space-y-2.5 flex-1 text-center sm:text-left">
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <p className="font-bold text-slate-800">Recommended size</p>
                  <p><strong>512 × 512 px</strong> (PNG, JPG, Max 2 MB)</p>
                  <p className="text-slate-400">Square image for best quality</p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <label className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl cursor-pointer border border-blue-200 shadow-2xs transition-colors inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change Logo</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview('');
                      setStoreLogo('');
                      showNotice();
                    }}
                    className="p-1.5 border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Store Banner Images (13.2.png) */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">2. Store Banner Images</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add banner images for web and mobile. These banners will be shown in your store on the customer app.
              </p>
            </div>

            {/* Web Banner (Desktop) */}
            <div className="border border-slate-200 rounded-xl p-3.5 space-y-3 bg-slate-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">Web Banner (Desktop)</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Recommended size: 1920 × 600 px | PNG, JPG (Max 5 MB)
                </span>
              </div>

              {/* Preview image */}
              <div className="relative h-28 rounded-xl overflow-hidden border border-slate-200 shadow-xs group">
                <img
                  src={webBannerPreview}
                  alt="Web Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-transparent to-transparent flex flex-col justify-center px-4 text-white">
                  <span className="text-sm font-black leading-tight">New Collection</span>
                  <span className="text-[10px] text-blue-200">Trendy Styles for Every You</span>
                  <button
                    type="button"
                    className="mt-2 px-2.5 py-1 bg-white text-slate-900 font-bold text-[9px] rounded-lg self-start shadow-xs"
                  >
                    Shop Now
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <label className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer shadow-2xs flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Change Image</span>
                  <input type="file" accept="image/*" onChange={handleWebBannerUpload} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={() => window.open(webBannerPreview, '_blank')}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWebBannerPreview('');
                    setStoreBanner('');
                    showNotice();
                  }}
                  className="p-1 border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl"
                  title="Remove banner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mobile Banner */}
            <div className="border border-slate-200 rounded-xl p-3.5 space-y-3 bg-slate-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">Mobile Banner</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Recommended size: 1080 × 1350 px | PNG, JPG (Max 5 MB)
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-slate-200 shadow-xs shrink-0">
                  <img
                    src={mobileBannerPreview}
                    alt="Mobile Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-2 text-white">
                    <span className="text-[10px] font-bold">New Collection</span>
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <p className="text-[11px] text-slate-500 leading-snug">
                    This banner will be shown on mobile devices and tablet app interfaces.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <label className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer shadow-2xs flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Change Image</span>
                      <input type="file" accept="image/*" onChange={handleMobileBannerUpload} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => window.open(mobileBannerPreview, '_blank')}
                      className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileBannerPreview('');
                        showNotice();
                      }}
                      className="p-1 border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl"
                      title="Remove banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview (Customer App) (5 cols) (13.2.png) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Live Preview (Customer App)</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              See how your logo and banners will appear in the customer app.
            </p>
          </div>

          {/* Smartphone Frame (13.2.png) */}
          <div className="bg-slate-900 rounded-[2.2rem] p-3 shadow-2xl border-4 border-slate-800 mx-auto max-w-[270px]">
            {/* Status bar */}
            <div className="flex items-center justify-between px-3 pt-1 pb-2 text-white text-[10px]">
              <span className="font-bold">9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal className="w-2.5 h-2.5" />
                <Wifi className="w-2.5 h-2.5" />
                <Battery className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* App Screen Canvas */}
            <div className="bg-slate-50 rounded-2xl overflow-hidden p-2.5 space-y-2 text-slate-800">
              {/* Search Bar & Header */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Search className="w-3 h-3 text-slate-400" />
                  <span className="truncate">Search in Fashion Hub...</span>
                </div>
                <Heart className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <div className="relative shrink-0">
                  <ShoppingCart className="w-3.5 h-3.5 text-slate-500" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 text-white rounded-full text-[7px] flex items-center justify-center font-bold">
                    8
                  </span>
                </div>
              </div>

              {/* Store Profile Card */}
              <div className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-black text-white font-black text-[8px] flex items-center justify-center text-center p-1 overflow-hidden shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span>FH</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-black text-slate-900 truncate">Fashion Hub</span>
                    <CheckCircle2 className="w-3 h-3 text-blue-600 fill-blue-600 text-white shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-slate-500 mt-0.5">
                    <span className="text-amber-500 font-bold flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-500" />
                      4.5
                    </span>
                    <span>(1.2K)</span>
                    <span className="text-emerald-600 font-bold">• Open</span>
                  </div>
                  <span className="text-[8px] text-slate-400 block truncate mt-0.5">
                    📍 0.2 km • Boring Road, Patna, Bihar
                  </span>
                </div>
              </div>

              {/* Banner Slider Card */}
              <div className="relative h-24 rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                <img
                  src={webBannerPreview}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-transparent to-transparent flex flex-col justify-center px-3 text-white">
                  <span className="text-[11px] font-black leading-tight">New Collection</span>
                  <span className="text-[8px] text-blue-200">Trendy Styles for Every You</span>
                </div>
                {/* Dots */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="w-1 h-1 rounded-full bg-white/50" />
                  <span className="w-1 h-1 rounded-full bg-white/50" />
                </div>
              </div>

              {/* 4 Feature Pills */}
              <div className="grid grid-cols-4 gap-1 text-center">
                <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-2xs">
                  <Truck className="w-2.5 h-2.5 mx-auto text-blue-600 mb-0.5" />
                  <span className="text-[7px] font-bold block text-slate-800 leading-tight">Fast Delivery</span>
                  <span className="text-[6px] text-slate-400">&gt; ₹199</span>
                </div>
                <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-2xs">
                  <RotateCcw className="w-2.5 h-2.5 mx-auto text-emerald-600 mb-0.5" />
                  <span className="text-[7px] font-bold block text-slate-800 leading-tight">Easy Returns</span>
                  <span className="text-[6px] text-slate-400">7 days</span>
                </div>
                <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-2xs">
                  <ShieldCheck className="w-2.5 h-2.5 mx-auto text-purple-600 mb-0.5" />
                  <span className="text-[7px] font-bold block text-slate-800 leading-tight">Secure Pay</span>
                  <span className="text-[6px] text-slate-400">100% safe</span>
                </div>
                <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-2xs">
                  <Headphones className="w-2.5 h-2.5 mx-auto text-amber-600 mb-0.5" />
                  <span className="text-[7px] font-bold block text-slate-800 leading-tight">Support</span>
                  <span className="text-[6px] text-slate-400">24x7</span>
                </div>
              </div>

              {/* Subtabs bar */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 border-b border-slate-200 text-[8px] font-bold">
                <span className="text-blue-600 border-b-2 border-blue-600 pb-0.5">All Products</span>
                <span className="text-slate-500">New Arrivals</span>
                <span className="text-slate-500">Best Deals</span>
                <span className="text-slate-500">Top Picks</span>
              </div>

              {/* Section Preview Products */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-900">New Arrivals</span>
                  <span className="text-[8px] text-blue-600 font-bold">View All &gt;</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                    <div className="h-14 bg-slate-100 rounded mb-1 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80"
                        alt="T-shirt"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[8px] font-bold block truncate">Graphic Print Tee</span>
                    <span className="text-[8px] font-black block">₹399</span>
                    <button
                      type="button"
                      className="w-full py-0.5 mt-1 rounded bg-blue-50 text-blue-600 text-[7px] font-bold"
                    >
                      Add to Cart
                    </button>
                  </div>

                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                    <div className="h-14 bg-slate-100 rounded mb-1 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=100&auto=format&fit=crop&q=80"
                        alt="Striped Tee"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[8px] font-bold block truncate">Striped Round Neck</span>
                    <span className="text-[8px] font-black block">₹449</span>
                    <button
                      type="button"
                      className="w-full py-0.5 mt-1 rounded bg-blue-50 text-blue-600 text-[7px] font-bold"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
