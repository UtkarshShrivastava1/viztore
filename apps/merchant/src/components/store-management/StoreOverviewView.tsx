import React, { useState, useMemo, useEffect } from 'react';
import {
  Monitor,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Layers,
  Boxes,
  MapPin,
  Clock,
  ShieldCheck,
  RotateCcw,
  Zap,
  Star,
  Search,
  ShoppingCart,
  ChevronRight,
  ChevronDown,
  Tag,
  ArrowRight,
  TrendingUp,
  Share2,
  Heart,
  Plus,
  Store,
} from 'lucide-react';
import { useStoreManagementStore, StoreSection } from '../../stores/storeManagementStore.js';
import { useAuthStore } from '../../stores/authStore.js';
import { useCatalogStore } from '../../stores/catalogStore.js';
import { branding } from '../../lib/branding.js';

export const StoreOverviewView: React.FC = () => {
  const {
    sections,
    curatedProducts,
    kpis,
    storeLogo,
    storeBanner,
    storeDescription,
    storeSlug,
    setActiveSubTab,
  } = useStoreManagementStore();

  const { currentStore } = useAuthStore();
  const { products, fetchProducts } = useCatalogStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Viewport switcher state: 'desktop' or 'mobile'
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTabName, setActiveTabName] = useState<string>('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Fallback values derived from active store context
  const resolvedStoreName =
    currentStore?.name || branding.appName;
  const resolvedSlug =
    storeSlug || currentStore?.slug || 'my-store';
  const resolvedLogo =
    storeLogo || currentStore?.logoUrl || '';
  const resolvedBanner =
    storeBanner ||
    currentStore?.bannerUrl ||
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80';
  const resolvedDescription =
    storeDescription ||
    currentStore?.description ||
    'Your premium neighbourhood store offering superfast hyperlocal delivery.';
  const resolvedRating = currentStore?.rating || 4.8;
  const resolvedRadius = currentStore?.deliveryRadiusKm || 4;
  const resolvedAddress =
    currentStore?.address?.street
      ? `${currentStore.address.street}, ${currentStore.address.city || ''}`
      : 'Main Commercial Market, City Center';

  // Active sections sorted by priority
  const activeSections = useMemo(() => {
    const active = sections
      .filter((s) => s.isActive || s.isAlwaysOn)
      .sort((a, b) => a.priority - b.priority);

    const hasAll = active.some((s) => s.name.toLowerCase() === 'all products');
    if (!hasAll) {
      return [
        {
          id: 'sec-all',
          name: 'All Products',
          type: 'Automatic' as const,
          sectionType: 'product' as const,
          productCount: products.length || curatedProducts.length,
          isActive: true,
          isAlwaysOn: true,
          priority: 0,
          productIds: [],
          description: 'All available products in store',
        },
        ...active,
      ];
    }
    return active;
  }, [sections, products, curatedProducts]);

  // Set default active tab
  useEffect(() => {
    if (activeSections.length > 0 && !activeSections.some((s) => s.name === activeTabName)) {
      setActiveTabName(activeSections[0]?.name || 'All Products');
    }
  }, [activeSections, activeTabName]);

  // Unified product list
  const displayProducts = useMemo(() => {
    const list = products.length > 0
      ? products.map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          price: p.price,
          originalPrice: p.mrp || (p.price > 0 ? Math.round(p.price * 1.15) : undefined),
          discount:
            p.mrp && p.mrp > p.price
              ? `${Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF`
              : 'Best Deal',
          stock: p.stock,
          image:
            p.images?.[0] ||
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
          category: p.category,
          brand: p.brand,
          sectionIds: ['sec-all'],
        }))
      : curatedProducts.map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          price: p.price,
          originalPrice: p.originalPrice,
          discount: p.discount || 'Special',
          stock: p.stock,
          image: p.image,
          category: p.category,
          brand: p.brand || 'Premium',
          sectionIds: ['sec-all'],
        }));

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    );
  }, [products, curatedProducts, searchQuery]);

  const handleCopyLink = () => {
    const url = `https://${branding.domain}/stores/${resolvedSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulatedAdd = (id: string) => {
    setAddedProductId(id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Header Toolbar with Live Status & Viewport Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Customer Storefront Replica
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Digital Twin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time replica of how nearby shoppers browse your store, layout sections, and catalog.
          </p>
        </div>

        {/* Viewport Switcher & External Link Controls */}
        <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-end">
          {/* Segmented Viewport Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-3xs">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewport === 'desktop'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop Storefront</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewport === 'mobile'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile App / Web</span>
            </button>
          </div>

          {/* Copy URL Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-3xs transition-colors cursor-pointer"
            title="Copy Public Storefront URL"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy URL</span>
              </>
            )}
          </button>

          {/* Open Storefront in New Window */}
          <a
            href={`/stores/${resolvedSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>Open Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. Top Storefront Readiness & Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Sections Active */}
        <div className="p-3.5 bg-white rounded-2xl border-t-4 border-t-blue-500 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Active Sections
            </span>
            <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
              {activeSections.length}{' '}
              <span className="text-xs font-normal text-slate-400">/ {sections.length} total</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubTab('sections')}
              className="text-[11px] text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5 mt-1"
            >
              <span>Manage Sections</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Discoverable Catalog */}
        <div className="p-3.5 bg-white rounded-2xl border-t-4 border-t-emerald-500 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Catalog Products
            </span>
            <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
              {displayProducts.length}{' '}
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md ml-1">
                Live &amp; In Stock
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Synchronized from Inventory &amp; Catalog
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Hyperlocal Delivery Coverage */}
        <div className="p-3.5 bg-white rounded-2xl border-t-4 border-t-purple-500 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Hyperlocal Radius
            </span>
            <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
              {resolvedRadius} km Radius
            </div>
            <button
              type="button"
              onClick={() => setActiveSubTab('banner_logo')}
              className="text-[11px] text-purple-600 font-bold hover:underline inline-flex items-center gap-0.5 mt-1"
            >
              <span>Update Banner &amp; Logo</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Realtime Storefront Digital Twin Canvas */}
      {viewport === 'desktop' ? (
        /* ================= DESKTOP STOREFRONT PREVIEW ================= */
        <div className="bg-slate-900/5 rounded-3xl p-3 sm:p-5 border border-slate-200/80 shadow-inner">
          {/* Simulated Browser Frame */}
          <div className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden flex flex-col">
            {/* Browser Header / Chrome Bar */}
            <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-3">
              {/* Traffic Light Window Controls */}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>

              {/* URL Address Bar */}
              <div className="flex-1 max-w-xl mx-auto bg-white border border-slate-200 rounded-lg px-3 py-1 flex items-center gap-2 text-xs text-slate-500 font-mono shadow-2xs truncate">
                <span className="text-emerald-600 font-bold">🔒</span>
                <span className="text-slate-400">https://</span>
                <span className="text-slate-800 font-medium">{branding.domain}</span>
                <span className="text-slate-400">/stores/</span>
                <span className="text-blue-600 font-bold">{resolvedSlug}</span>
              </div>

              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:block">
                Customer Viewport: 1280px
              </div>
            </div>

            {/* Customer Storefront Page Content */}
            <div className="p-4 sm:p-6 space-y-6 bg-slate-50/60 max-h-[800px] overflow-y-auto">
              {/* Customer Web Minimal Navigation Bar */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate max-w-[200px]">Deliver to: <strong>Civil Lines, 490020</strong></span>
                </div>

                <div className="relative flex-1 max-w-md hidden md:block">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search within ${resolvedStoreName}...`}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/70">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Cart (2)</span>
                  </div>
                </div>
              </div>

              {/* Store Hero Banner & Identity Card */}
              <div className="relative rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-sm">
                {/* Cover Banner */}
                <div className="relative w-full h-44 sm:h-52 bg-slate-900 overflow-hidden">
                  <img
                    src={resolvedBanner}
                    alt="Store Banner"
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                  {/* Top Share & Heart Badges */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button type="button" className="p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-800 hover:bg-white shadow-xs">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={handleCopyLink} className="p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-800 hover:bg-white shadow-xs">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Floating Store Profile Details */}
                <div className="px-5 pb-5 pt-3 relative">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-14 mb-3">
                    <div className="flex items-end gap-3.5">
                      {/* Logo Avatar */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 border-2 border-white shadow-lg overflow-hidden shrink-0">
                        {resolvedLogo ? (
                          <img
                            src={resolvedLogo}
                            alt="Logo"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-full rounded-xl bg-blue-600 text-white font-black text-xl flex items-center justify-center">
                            {resolvedStoreName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="pb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                            {resolvedStoreName}
                          </h1>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            Verified Retailer
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 max-w-xl line-clamp-1">
                          {resolvedDescription}
                        </p>
                      </div>
                    </div>

                    {/* Store Meta Chips */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{resolvedRating}</span>
                        <span className="text-[10px] text-amber-600 font-normal">(120+ reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>20–30 Mins</span>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                        <Zap className="w-3.5 h-3.5 text-blue-600" />
                        <span>{resolvedRadius} km Radius</span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Trust Badges Strip */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800 text-[11px]">Instant Delivery</div>
                        <div className="text-[10px] text-slate-400">Under 30 mins</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800 text-[11px]">7 Days Return</div>
                        <div className="text-[10px] text-slate-400">Hassle-free policy</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800 text-[11px]">100% Genuine</div>
                        <div className="text-[10px] text-slate-400">Local store warranty</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <Store className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800 text-[11px]">Neighbourhood Shop</div>
                        <div className="text-[10px] text-slate-400">{resolvedAddress}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Customer Section Tabs */}
              <div className="border-b border-slate-200 bg-white rounded-2xl p-2 shadow-2xs">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {activeSections.map((sec) => {
                    const isActive = activeTabName === sec.name;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setActiveTabName(sec.name)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                        }`}
                      >
                        <span>{sec.name}</span>
                        {sec.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                              isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {sec.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Products Section Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <span>{activeTabName}</span>
                    <span className="text-xs font-semibold text-slate-400 font-mono">
                      ({displayProducts.length} items)
                    </span>
                  </h3>
                  <span className="text-xs font-semibold text-blue-600">
                    Live Catalog Feed
                  </span>
                </div>

                {displayProducts.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                    <p className="font-bold text-slate-700 text-sm">No products in this section</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Add products in the Products / Catalog tab to display them here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {displayProducts.map((p) => {
                      const isAdded = addedProductId === p.id;
                      return (
                        <div
                          key={p.id}
                          className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                        >
                          <div>
                            {/* Product Image */}
                            <div className="relative aspect-square rounded-xl bg-slate-50 border border-slate-100 overflow-hidden mb-2.5">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                loading="lazy"
                              />
                              {p.discount && (
                                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-black shadow-xs">
                                  {p.discount}
                                </span>
                              )}
                            </div>

                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              {p.brand || p.category}
                            </span>
                            <h4
                              className="font-bold text-slate-900 text-xs line-clamp-2 mt-0.5"
                              title={p.name}
                            >
                              {p.name}
                            </h4>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div>
                              <div className="font-black text-slate-900 text-sm font-mono">
                                ₹{p.price.toLocaleString('en-IN')}
                              </div>
                              {p.originalPrice && p.originalPrice > p.price && (
                                <div className="text-[10px] text-slate-400 line-through font-mono">
                                  ₹{p.originalPrice.toLocaleString('en-IN')}
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleSimulatedAdd(p.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                isAdded
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Added!</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>Add</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= MOBILE PHONE PREVIEW ================= */
        <div className="bg-slate-900/5 rounded-3xl p-6 border border-slate-200/80 shadow-inner flex justify-center">
          {/* Phone Outer Chassis (iPhone 16 Pro Style) */}
          <div className="relative w-[340px] rounded-[50px] p-3.5 bg-slate-950 shadow-2xl border-4 border-slate-800">
            {/* Dynamic Island Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
              <div className="w-10 h-1.5 bg-slate-800 rounded-full" />
              <div className="w-2.5 h-2.5 bg-slate-800/80 rounded-full ml-2" />
            </div>

            {/* Screen Glass Frame */}
            <div className="relative w-full h-[650px] bg-slate-50 rounded-[38px] overflow-hidden flex flex-col font-sans text-slate-800 shadow-inner">
              {/* iOS Status Bar */}
              <div className="pt-3 px-6 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-900 shrink-0 z-20 bg-white">
                <span>9:41</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="font-bold">5G</span>
                  <div className="w-4 h-2.5 border border-slate-900 rounded-2xs p-0.5 flex items-center">
                    <div className="w-full h-full bg-slate-900 rounded-3xs" />
                  </div>
                </div>
              </div>

              {/* Scrollable Mobile Page */}
              <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
                {/* Mobile Hero Banner */}
                <div className="relative h-32 bg-slate-900">
                  <img
                    src={resolvedBanner}
                    alt="Banner"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Floating Avatar & Details */}
                  <div className="absolute -bottom-5 left-3.5 flex items-end gap-2.5">
                    <div className="w-12 h-12 rounded-xl bg-white p-0.5 border-2 border-white shadow-md overflow-hidden shrink-0">
                      {resolvedLogo ? (
                        <img src={resolvedLogo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="w-full h-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center rounded-lg">
                          {resolvedStoreName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="text-white pb-0.5">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-black drop-shadow-xs">{resolvedStoreName}</span>
                        <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400" />
                      </div>
                      <p className="text-[9px] text-slate-300 drop-shadow-xs truncate max-w-[170px]">
                        {resolvedDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating & ETA Bar */}
                <div className="pt-7 px-3.5 pb-2 flex items-center justify-between text-[10px] text-slate-600 border-b border-slate-200 bg-white">
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{resolvedRating}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" />
                    <span>20–30 mins</span>
                  </div>
                  <div className="text-slate-500 font-medium">
                    {resolvedRadius} km away
                  </div>
                </div>

                {/* Mobile Section Pills */}
                <div className="p-2.5 bg-white border-b border-slate-200">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {activeSections.map((sec) => {
                      const isActive = activeTabName === sec.name;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => setActiveTabName(sec.name)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {sec.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile 2-Column Product Grid */}
                <div className="p-3 space-y-2">
                  <span className="text-[11px] font-black text-slate-900 block">
                    {activeTabName}
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {displayProducts.slice(0, 6).map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-xl border border-slate-200/90 p-2 shadow-2xs flex flex-col justify-between"
                      >
                        <div className="aspect-square rounded-lg bg-slate-50 overflow-hidden mb-1.5 relative">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          {p.discount && (
                            <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-emerald-600 text-white text-[8px] font-black">
                              {p.discount}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{p.brand}</p>
                          <p className="text-[10px] font-bold text-slate-900 line-clamp-1">{p.name}</p>
                          <p className="text-[11px] font-black text-slate-900 font-mono mt-0.5">
                            ₹{p.price}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSimulatedAdd(p.id)}
                          className="w-full mt-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-[10px] font-bold transition-colors"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Customer Navigation Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 flex items-center justify-around text-[9px] font-bold text-slate-500">
                <div className="flex flex-col items-center gap-0.5 text-blue-600">
                  <Store className="w-4 h-4" />
                  <span>Store</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 relative">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-blue-600 text-white text-[8px] flex items-center justify-center font-bold">
                    2
                  </span>
                  <span>Cart</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
