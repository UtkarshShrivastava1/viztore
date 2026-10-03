import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Camera,
  Trash2,
  Upload,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Monitor,
  Eye,
  Plus,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { useStoreManagementStore } from '../../stores/storeManagementStore.js';
import { branding } from '../../lib/branding.js';

export const ManageBannerLogoView: React.FC = () => {
  const {
    storeLogo,
    storeBanner,
    storeDescription,
    setStoreLogo,
    setStoreBanner,
    setStoreDescription,
    setActiveSubTab,
  } = useStoreManagementStore();

  const [logoPreview, setLogoPreview] = useState(storeLogo);
  const [bannerPreview, setBannerPreview] = useState(storeBanner);
  const [bannerHeading, setBannerHeading] = useState('New Collection');
  const [bannerSubheading, setBannerSubheading] = useState('Trendy Styles for Every You');
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');

  const [promoBanners, setPromoBanners] = useState([
    {
      id: 'pb-1',
      title: 'Summer Splash Sale',
      subtitle: 'Flat 40% OFF on Summer Dresses',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      isActive: true,
      linkTo: "Today's Deal",
    },
    {
      id: 'pb-2',
      title: 'Ethnic Elegance',
      subtitle: 'Handcrafted Festive Kurta Sets',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      isActive: true,
      linkTo: 'New Arrivals',
    },
  ]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      setStoreLogo(url);
      showNotice();
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
      setStoreBanner(url);
      showNotice();
    }
  };

  const showNotice = () => {
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Breadcrumb & Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <button
            type="button"
            onClick={() => setActiveSubTab('overview')}
            className="hover:text-blue-600 transition-colors"
          >
            Store Management
          </button>
          <span>&gt;</span>
          <span className="text-slate-800">Manage Banner / Logo</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Manage Banner &amp; Logo
        </h1>
        <p className="text-xs text-slate-500">
          Upload and style the visuals that welcome customers to your digital storefront.
        </p>
      </div>

      {isSavedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Visual brand assets updated and synchronized with live storefront!</span>
        </div>
      )}

      {/* Main 2-Column Layout: Left Controls (7 cols) + Right Live Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Logo & Banner Editors (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Store Logo */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Store Logo</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Displayed in the app header, search results, invoice receipts, and store QR card.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Logo Preview Square */}
              <div className="relative w-32 h-32 rounded-2xl bg-[#081028] border-2 border-slate-200 shadow-md flex items-center justify-center text-white font-black text-center p-3 overflow-hidden shrink-0 group">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="space-y-1">
                    <span className="text-sm uppercase tracking-wider block">FASHION</span>
                    <span className="text-sm uppercase tracking-wider block">HUB</span>
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">Replace</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>

              {/* Logo Metadata & Actions */}
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Logo</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview('');
                      setStoreLogo('');
                      showNotice();
                    }}
                    className="px-3 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <p>• Recommended resolution: <strong>512 × 512 px</strong> (Square 1:1)</p>
                  <p>• Formats: <strong>PNG (transparent) or JPG</strong></p>
                  <p>• Maximum file size: <strong>2 MB</strong></p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Main Store Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Main Header Banner</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The flagship horizontal visual displayed at the very top of your storefront.
              </p>
            </div>

            {/* Banner Preview Frame */}
            <div className="relative h-44 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 overflow-hidden border border-slate-200 shadow-md group">
              <img
                src={bannerPreview}
                alt="Banner"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-blue-950/30 to-transparent flex flex-col justify-center px-6 text-white">
                <span className="text-xl font-black tracking-wide leading-tight drop-shadow-md">
                  {bannerHeading}
                </span>
                <span className="text-xs text-blue-200 mt-1 font-medium drop-shadow-sm">
                  {bannerSubheading}
                </span>
              </div>
              <label className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-colors">
                <Camera className="w-3.5 h-3.5" />
                <span>Change Banner</span>
                <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
              </label>
            </div>

            {/* Banner Text Overlays & Config */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Banner Main Heading
                </label>
                <input
                  type="text"
                  value={bannerHeading}
                  onChange={(e) => setBannerHeading(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. New Collection"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Banner Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={bannerSubheading}
                  onChange={(e) => setBannerSubheading(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Trendy Styles for Every You"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Recommended aspect ratio: 3:1 (1200 × 400 px)</span>
              <span>Max file size: 5 MB</span>
            </div>
          </div>

          {/* Section 3: Promotional Carousel Banners */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Promotional Slider Banners</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Secondary carousel slides rotated automatically on the storefront.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPromoBanners([
                    ...promoBanners,
                    {
                      id: `pb-${Date.now()}`,
                      title: 'Flash Weekend Offer',
                      subtitle: 'Extra 10% on UPI orders',
                      imageUrl:
                        'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
                      isActive: true,
                      linkTo: 'Best Sellers',
                    },
                  ]);
                  showNotice();
                }}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slide</span>
              </button>
            </div>

            <div className="space-y-3">
              {promoBanners.map((pb, idx) => (
                <div
                  key={pb.id}
                  className="flex items-center gap-4 p-3 bg-slate-50/70 border border-slate-200 rounded-xl"
                >
                  <img
                    src={pb.imageUrl}
                    alt={pb.title}
                    className="w-20 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{pb.title}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{pb.subtitle}</p>
                    <span className="text-[10px] font-semibold text-blue-600 mt-0.5 block">
                      Links to: {pb.linkTo}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPromoBanners(
                          promoBanners.map((p) =>
                            p.id === pb.id ? { ...p, isActive: !p.isActive } : p
                          )
                        );
                        showNotice();
                      }}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                        pb.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      {pb.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPromoBanners(promoBanners.filter((p) => p.id !== pb.id));
                        showNotice();
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Storefront Mockup Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 sticky top-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">Live Customer Preview</h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-slate-600 text-xs">
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1 rounded-md transition-colors ${
                  previewDevice === 'mobile' ? 'bg-white shadow-xs text-blue-600' : ''
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1 rounded-md transition-colors ${
                  previewDevice === 'desktop' ? 'bg-white shadow-xs text-blue-600' : ''
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Smartphone Frame or Card Frame */}
          <div className="mx-auto max-w-[280px] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800">
            {/* Screen Notch */}
            <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-2" />

            {/* Phone Screen Canvas */}
            <div className="bg-slate-50 rounded-2xl overflow-hidden text-left text-slate-800 space-y-3 pb-4">
              {/* App Bar */}
              <div className="bg-[#081028] text-white p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                    FH
                  </div>
                  <span className="text-xs font-bold truncate">Fashion Hub</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded-md">
                  ● Live
                </span>
              </div>

              {/* Main Banner Slide Preview */}
              <div className="px-3">
                <div className="relative h-28 rounded-xl overflow-hidden shadow-xs">
                  <img
                    src={bannerPreview}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                    <span className="text-xs font-black leading-tight">{bannerHeading}</span>
                    <span className="text-[9px] text-slate-200">{bannerSubheading}</span>
                  </div>
                </div>
              </div>

              {/* Quick Categories Bar */}
              <div className="px-3 flex gap-2 overflow-x-auto no-scrollbar py-1">
                {['Dresses', 'Denim', 'Footwear', 'Accessories'].map((cat) => (
                  <span
                    key={cat}
                    className="text-[9px] font-bold px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 shrink-0"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Mini Product Cards Preview */}
              <div className="px-3 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-900 block">Today's Deals</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="h-16 bg-slate-100 rounded-lg mb-1 flex items-center justify-center text-[10px] text-slate-400">
                      Product
                    </div>
                    <span className="text-[9px] font-bold text-slate-800 block truncate">
                      Cotton Kurta
                    </span>
                    <span className="text-[9px] font-bold text-blue-600 block">₹899</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="h-16 bg-slate-100 rounded-lg mb-1 flex items-center justify-center text-[10px] text-slate-400">
                      Product
                    </div>
                    <span className="text-[9px] font-bold text-slate-800 block truncate">
                      Slim Denim
                    </span>
                    <span className="text-[9px] font-bold text-blue-600 block">₹1,249</span>
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
