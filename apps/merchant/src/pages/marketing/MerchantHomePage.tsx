import React from 'react';
import {
  ArrowRight,
  Play,
  ShoppingBag,
  Store,
  Package,
  Truck,
  Layers,
  FileText,
  BarChart3,
  MapPin,
  Users,
  Smartphone,
  Headphones,
  GraduationCap,
  Sparkles,
  Shirt,
  Footprints,
  Gem,
  Armchair,
  Gift,
  Trophy,
  Tag,
  Zap,
  Award,
  ShoppingCart,
  TrendingUp,
  Camera,
  Compass,
  Eye,
  Heart,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { MARKETING_DATA } from '../../data/marketingData.js';
import { useVideoModal } from '../../components/marketing/MerchantPublicLayout.js';

interface MerchantHomePageProps {
  onNavigate: (route: string) => void;
  onStartSelling: () => void;
}

export const MerchantHomePage: React.FC<MerchantHomePageProps> = ({
  onNavigate,
  onStartSelling,
}) => {
  const { openVideoModal } = useVideoModal();

  const handleWatchVideo = () => {
    openVideoModal({
      id: 'intro-video',
      title: `Take Your Local Store Online with ${branding.appName}`,
      duration: '2:45',
      category: 'Overview',
      description:
        'See how local retailers digitize their shops, list products, and start receiving neighborhood delivery and pickup orders.',
    });
  };

  return (
    <div className="w-full bg-white select-none">
      {/* 1. HERO SECTION (Matching Mockup 1.0.png) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eef5ff] via-[#f7faff] to-white pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Hero Copy & Actions */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0055ff]">
                FOR LOCAL RETAILERS
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[52px] font-black text-slate-900 tracking-tight leading-[1.12]">
                Take Your Local Store Online with{' '}
                <span className="text-[#0055ff]">{branding.appName}</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Create your online store, list your products, receive local orders, manage fulfillment
                and get discovered by nearby customers.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-7 py-3.5 rounded-xl bg-[#0052ff] hover:bg-[#0042d0] text-white font-bold text-sm sm:text-base shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Start Selling</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleWatchVideo}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0052ff] flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-[#0052ff] ml-0.5" />
                  </div>
                  <span>See How It Works</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Device Mockup (Matching 1.0.png) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end pt-4 lg:pt-0">
              <div className="relative w-full max-w-[620px]">
                <img
                  src="/images/homepage-hero-devices.png"
                  alt="Merchant Web Dashboard & Customer Mobile Storefront"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR VALUE PILLS BAR (Matching Mockup 1.0.png) */}
      <section className="py-6 sm:py-8 bg-white border-b border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MARKETING_DATA.heroValuePills.map((pill, i) => {
              const Icon =
                pill.icon === 'Award'
                  ? Award
                  : pill.icon === 'MapPin'
                  ? MapPin
                  : pill.icon === 'Zap'
                  ? Zap
                  : Truck;

              return (
                <div
                  key={i}
                  className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:border-blue-100 transition-colors"
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${pill.badgeColor}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {pill.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-tight">
                      {pill.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. WHY SELL ON {branding.appName}? SECTION (Matching Mockup 1.0.png) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Sell on {branding.appName}?
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              All the tools you need to run and grow your retail business, designed specifically for local stores.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 4 Feature Cards (7 cols) with pastel backgrounds matching 1.0.png */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Card 1: Local Customer Discovery */}
              <div className="p-6 rounded-3xl bg-[#f2fbf7] border border-[#d1f2e2] space-y-3 hover:shadow-xs transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-[#dcfce7] text-[#16a34a] flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Local Customer Discovery</h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Get discovered by nearby customers who are actively looking for products in your area.
                </p>
              </div>

              {/* Card 2: Your Digital Store */}
              <div className="p-6 rounded-3xl bg-[#f0f7ff] border border-[#d6e8ff] space-y-3 hover:shadow-xs transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-[#dbeafe] text-[#2563eb] flex items-center justify-center">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Your Digital Store</h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Create a professional online store with your brand, products, images and store details.
                </p>
              </div>

              {/* Card 3: Easy Product Listing */}
              <div className="p-6 rounded-3xl bg-[#fdf2f4] border border-[#fed7dc] space-y-3 hover:shadow-xs transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-[#fee2e2] text-[#e11d48] flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Easy Product Listing</h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Add products with images, prices, categories, sizes and variants in minutes.
                </p>
              </div>

              {/* Card 4: Orders & Delivery */}
              <div className="p-6 rounded-3xl bg-[#fffaf0] border border-[#feebc8] space-y-3 hover:shadow-xs transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Orders &amp; Delivery</h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Receive orders, manage fulfillment and offer pickup or local delivery to customers.
                </p>
              </div>
            </div>

            {/* Right Card: Real Photo of smiling shopkeeper with floating "New Order" card (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[420px] group">
                {/* Background image of retail shopkeeper */}
                <img
                  src="/images/merchant-shopkeeper.jpg"
                  alt="Retail Store Merchant with tablet"
                  className="w-full h-[420px] object-cover group-hover:scale-102 transition-transform duration-500"
                />

                {/* Subtle gradient vignette at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Overlaid Floating "New Order" Card matching 1.0.png */}
                <div className="absolute left-6 bottom-6 bg-white text-slate-900 rounded-2xl p-4 shadow-2xl border border-slate-100 flex flex-col gap-2.5 min-w-[220px]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0055ff] flex items-center justify-center shrink-0">
                      <Shirt className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">New Order</div>
                      <div className="text-[11px] text-slate-700 font-medium">Men's Shirt (M)</div>
                      <div className="text-[10px] text-slate-400">1 Item • Pickup Order</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('/sell-online/ordersdelivery')}
                    className="w-full py-2 rounded-lg bg-[#0055ff] hover:bg-[#0042d0] text-white text-xs font-bold text-center transition-colors cursor-pointer"
                  >
                    View Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EVERYTHING YOU NEED TO START SELLING (Matching Mockup 1.0.png) */}
      <section className="py-16 sm:py-20 bg-slate-50/60 border-y border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to Start Selling
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Powerful features to manage your store, products, orders and customers — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: 6 Features (2 cols x 3 rows = 7 cols) matching 1.0.png */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Create Your Store */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0055ff] flex items-center justify-center mb-3">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Create Your Store</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Set up your store profile, logo, cover image, description, contact details and more.
                </p>
              </div>

              {/* 2. Add Products */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0055ff] flex items-center justify-center mb-3">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Add Products</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload product images, add details, set categories, variants and pricing.
                </p>
              </div>

              {/* 3. Manage Inventory */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0055ff] flex items-center justify-center mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Manage Inventory</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Keep your stock updated and get low stock alerts.
                </p>
              </div>

              {/* 4. Billing & Invoicing */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0055ff] flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Billing &amp; Invoicing</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Create bills and invoices with GST details.
                </p>
              </div>

              {/* 5. Orders & Delivery */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0055ff] flex items-center justify-center mb-3">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Orders &amp; Delivery</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  View and manage orders with pickup or local delivery options.
                </p>
              </div>

              {/* 6. Business Insights */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0055ff] flex items-center justify-center mb-3">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Business Insights</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Get insights on sales, popular products and customer trends.
                </p>
              </div>
            </div>

            {/* Right: Boutique Background with Phone Chassis showing Product Details (5 cols) matching 1.0.png */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full rounded-3xl overflow-hidden min-h-[420px] flex items-center justify-center p-6 group">
                {/* Background Boutique Shop Rack */}
                <img
                  src="/images/boutique-store.jpg"
                  alt="Boutique Shop"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-90 group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]" />

                {/* Floating iPhone Chassis showing Kurti Product Card */}
                <div className="relative w-[210px] sm:w-[230px] bg-white rounded-[32px] p-2.5 shadow-2xl border-4 border-slate-900 z-10">
                  {/* Dynamic Island */}
                  <div className="w-14 h-3.5 bg-black rounded-full mx-auto mb-2" />

                  {/* Product Card Screen */}
                  <div className="bg-white rounded-[22px] overflow-hidden space-y-2 text-left">
                    {/* Kurti Image with Heart */}
                    <div className="relative w-full h-36 bg-rose-50 rounded-xl overflow-hidden">
                      <img
                        src="/images/kurti-product.jpg"
                        alt="Women's Kurti"
                        className="w-full h-full object-cover"
                      />
                      <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 text-rose-500 flex items-center justify-center shadow-xs">
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Women's Kurti</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-black text-[#0055ff] text-sm">₹1,299</span>
                        <span className="text-[10px] text-slate-400 line-through">₹1,999</span>
                        <span className="text-[9px] text-emerald-600 font-bold">35% Off</span>
                      </div>
                    </div>

                    {/* Size Selector */}
                    <div>
                      <div className="text-[9px] font-semibold text-slate-400 mb-1">Select Size</div>
                      <div className="flex items-center gap-1.5">
                        {['S', 'M', 'L', 'XL'].map((size, idx) => (
                          <span
                            key={size}
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold ${
                              idx === 1
                                ? 'bg-[#0055ff] text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-1 space-y-1.5">
                      <button className="w-full py-2 bg-[#0055ff] text-white rounded-lg text-[10px] font-bold shadow-xs">
                        Add to Cart
                      </button>
                      <button className="w-full py-1.5 bg-white border border-[#0055ff] text-[#0055ff] rounded-lg text-[9px] font-bold">
                        Reserve (Pickup)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW SELLING IN {branding.appName} WORKS (Matching Mockup 1.0.png) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              How Selling in {branding.appName} Works
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Get your online store live and start receiving orders in just a few simple steps.
            </p>
          </div>

          {/* 5 Steps in a horizontal flow with connector lines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-4 relative">
            {/* Step 1 */}
            <div className="text-center flex flex-col items-center group relative">
              <div className="w-14 h-14 rounded-full bg-[#e8f1ff] text-[#0055ff] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0055ff] mb-1">01</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Create Seller Account</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[180px]">
                Sign up and verify your details.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center flex flex-col items-center group relative">
              <div className="w-14 h-14 rounded-full bg-[#e8f1ff] text-[#0055ff] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Store className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0055ff] mb-1">02</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Create Your Store</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[180px]">
                Set up your store profile and customize it.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center flex flex-col items-center group relative">
              <div className="w-14 h-14 rounded-full bg-[#e8f1ff] text-[#0055ff] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0055ff] mb-1">03</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Add Products</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[180px]">
                Upload images, set prices and organize your catalog.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center flex flex-col items-center group relative">
              <div className="w-14 h-14 rounded-full bg-[#e8f1ff] text-[#0055ff] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0055ff] mb-1">04</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Start Receiving Orders</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[180px]">
                Get orders from nearby customers.
              </p>
            </div>

            {/* Step 5 */}
            <div className="text-center flex flex-col items-center group relative">
              <div className="w-14 h-14 rounded-full bg-[#e8f1ff] text-[#0055ff] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-xs font-black text-[#0055ff] mb-1">05</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Fulfil &amp; Grow</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[180px]">
                Manage fulfillment and use insights to grow your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MAKE YOUR LOCAL STORE DISCOVERABLE (Matching Mockup 1.0.png) */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#eff6ff] via-[#e5f0ff] to-[#d8e9ff] rounded-[32px] p-8 sm:p-12 lg:p-14 relative overflow-hidden border border-blue-100 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Copy (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  Make Your Local Store Discoverable
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Customers in your area can search for products, discover your store, check availability and place orders for pickup or local delivery.
                </p>

                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0055ff] text-white flex items-center justify-center shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      Showcase your products with clear images and details
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0055ff] text-white flex items-center justify-center shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      Reach nearby customers searching for what you sell
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0055ff] text-white flex items-center justify-center shrink-0">
                      <Eye className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      Get more visibility and turn product views into orders
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('/how-it-works/localdiscovery')}
                    className="px-6 py-3 rounded-xl bg-white hover:bg-blue-50 border border-[#0055ff] text-[#0055ff] font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Learn About Local Discovery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right: Interactive Discovery Map Preview matching 1.0.png */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-[480px]">
                  <img
                    src="/images/homepage-discovery-radar.png"
                    alt="Customer Discovery Mobile App & Radar Pins"
                    className="w-full h-auto object-contain rounded-2xl shadow-xl border border-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BUILT FOR LOCAL RETAIL (9 Categories matching Mockup 1.0.png) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Built for Local Retail
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Whether you run a single store or multiple outlets, {branding.appName} works for every type of retail business.
            </p>
          </div>

          {/* 9 Category Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
            {MARKETING_DATA.retailCategories.map((cat, i) => {
              const Icon =
                cat.icon === 'Shirt'
                  ? Shirt
                  : cat.icon === 'Footprints'
                  ? Footprints
                  : cat.icon === 'Headphones'
                  ? Headphones
                  : cat.icon === 'Gem'
                  ? Gem
                  : cat.icon === 'Sparkles'
                  ? Sparkles
                  : cat.icon === 'Armchair'
                  ? Armchair
                  : cat.icon === 'Gift'
                  ? Gift
                  : cat.icon === 'Trophy'
                  ? Trophy
                  : ShoppingBag;

              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-[#0055ff]/40 transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50/70 text-[#0055ff] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {cat.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. TOOLS THAT HELP YOU GROW (Matching Mockup 1.0.png) */}
      <section className="py-16 sm:py-20 bg-slate-50/60 border-t border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tools That Help You Grow
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              More features to run your store better, attract more customers and increase sales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tool 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Tag className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Promotions &amp; Offers</h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                Create discounts and special offers to attract more customers.
              </p>
            </div>

            {/* Tool 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0055ff] flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Business Insights</h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                Understand your sales, products and customer activity.
              </p>
            </div>

            {/* Tool 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0055ff] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Customer Management</h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                Build and retain relationships with your customers.
              </p>
            </div>

            {/* Tool 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0055ff] flex items-center justify-center mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Mobile Access</h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                Manage your store anytime, anywhere with the {branding.appName} mobile app.
              </p>
            </div>

            {/* Tool 5 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0055ff] flex items-center justify-center mb-4">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Seller Support</h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                Our team is here to help you with setup and operations.
              </p>
            </div>

            {/* Tool 6 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0055ff] flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Learning Resources</h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                Guides and tutorials to help you grow your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PRE-FOOTER CTA BANNER (Matching Mockup 1.0.png) */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0038ed] via-[#0047ff] to-[#0066ff] rounded-[32px] p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Background Arrow Curve */}
            <div className="absolute right-12 top-0 bottom-0 w-80 opacity-15 pointer-events-none">
              <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-white" stroke="currentColor">
                <path d="M20 180C80 180 120 120 170 30M170 30H120M170 30V80" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="space-y-2 max-w-xl relative z-10 text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                READY TO GET STARTED?
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Take Your Store Online with {branding.appName}
              </h2>
              <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                Create your online store, list your products and start receiving orders from nearby customers.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <button
                type="button"
                onClick={onStartSelling}
                className="px-8 py-4 rounded-xl bg-white hover:bg-blue-50 text-[#0038ed] font-extrabold text-sm sm:text-base shadow-xl flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <span>Start Selling</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
