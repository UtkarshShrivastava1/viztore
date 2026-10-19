import React from 'react';
import {
  ArrowRight,
  Play,
  Check,
  ChevronRight,
  Zap,
  Box,
  Eye,
  BarChart3,
  Clock,
  TrendingUp,
  ShoppingCart,
  Truck,
  CheckCircle2,
  Users,
  Bell,
  Sliders,
  QrCode,
  Link as LinkIcon,
  Upload,
  Image as ImageIcon,
  Layers,
  FileText,
  Tag,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';

export type SellOnlineTab =
  | 'listproducts'
  | 'managestore'
  | 'ordersdelivery'
  | 'sellertools';

interface SellOnlinePageProps {
  initialTab?: SellOnlineTab;
  onNavigate: (route: string) => void;
  onStartSelling: () => void;
}

export const SellOnlinePage: React.FC<SellOnlinePageProps> = ({
  initialTab = 'listproducts',
  onNavigate,
  onStartSelling,
}) => {
  const [activeTab, setActiveTab] = React.useState<SellOnlineTab>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="w-full bg-white select-none">
      {/* =========================================================================
          TAB 1: LIST PRODUCTS (Mockup 1.1.png)
          ========================================================================= */}
      {activeTab === 'listproducts' && (
        <div className="w-full">
          {/* Hero Section */}
          <section className="pt-6 pb-12 sm:pb-16 bg-gradient-to-b from-[#f5f9ff] via-white to-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#0052ff] transition-colors cursor-pointer"
                >
                  Home
                </button>
                <span>&gt;</span>
                <span className="text-slate-600">Sell Online</span>
                <span>&gt;</span>
                <span className="text-[#0052ff] font-semibold">List Products</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left Column */}
                <div className="lg:col-span-5 space-y-5">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0052ff] font-bold text-xs uppercase tracking-wider">
                    SELL ONLINE
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0c1427] tracking-tight leading-[1.15]">
                    List Products on{' '}
                    <span className="text-[#0052ff]">{branding.appName}</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                    Create your digital product catalog, add images, prices and details — and make
                    your products visible to nearby customers.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3.5">
                    <button
                      type="button"
                      onClick={onStartSelling}
                      className="px-6 py-3.5 rounded-xl bg-[#0052ff] hover:bg-[#0043d9] text-white font-bold text-sm shadow-sm hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Start Listing Products</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('/learn/tutorials')}
                      className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200/90 shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                        <Play className="w-2.5 h-2.5 fill-[#0052ff] ml-0.5" />
                      </div>
                      <span>Watch How It Works</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Laptop Catalog Chassis */}
                <div className="lg:col-span-7 flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-[620px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white">
                    <img
                      src="/images/list-products-hero.png"
                      alt="Merchant Catalog Management Screen"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4 Value Pills */}
          <section className="py-6 bg-white border-y border-slate-100">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">Easy to Add</div>
                    <div className="text-xs text-slate-500">List products in minutes.</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">Organized Catalog</div>
                    <div className="text-xs text-slate-500">Categories, variants and details.</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">Visible to Customers</div>
                    <div className="text-xs text-slate-500">Discovered by nearby buyers.</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">Real-time Control</div>
                    <div className="text-xs text-slate-500">Manage stock and price anytime.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Everything You Need to Create Your Product Catalog */}
          <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
                    Everything You Need to Create Your Product Catalog
                  </h2>
                  <p className="text-sm text-slate-500 mt-2">
                    List your products with complete details and keep your catalog organized.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('/sell-online/managestore')}
                  className="text-sm font-bold text-[#0052ff] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>View Full Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Add Product Details */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center mb-4">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0c1427]">Add Product Details</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2">
                    Add product name, description, price, images and key details.
                  </p>
                </div>

                {/* 2. Category Management */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0c1427]">Category Management</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2">
                    Organize your products into categories for easy customer browsing.
                  </p>
                </div>

                {/* 3. Variants & Options */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <Box className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0c1427]">Variants &amp; Options</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2">
                    Manage size, colour, style and other product variants.
                  </p>
                </div>

                {/* 4. High Quality Images */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0c1427]">High Quality Images</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2">
                    Upload clear product images to showcase your products.
                  </p>
                </div>

                {/* 5. Pricing & Offers */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                    <Tag className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0c1427]">Pricing &amp; Offers</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2">
                    Set prices, discounts and special offers for your products.
                  </p>
                </div>

                {/* 6. Inventory Tracking */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0c1427]">Inventory Tracking</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2">
                    Keep stock updated and manage availability in real-time.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How to List Your Products (6-Step Sequence) */}
          <section className="py-16 sm:py-20 bg-[#f8fbff] border-y border-slate-100">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
                  How to List Your Products
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Get your products live in just a few simple steps.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3 shadow-2xs">
                    <Box className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">01</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Add Product</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Enter product name, description and basic details.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3 shadow-2xs">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">02</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Upload Images</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Add clear and attractive product images.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3 shadow-2xs">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">03</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Set Category</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Choose the right category for your product.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3 shadow-2xs">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">04</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Add Variants</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Manage size, colour and other options.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3 shadow-2xs">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">05</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Set Price &amp; Stock</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Enter price, offers and available stock quantity.
                  </p>
                </div>

                {/* Step 6 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3 shadow-2xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">06</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Publish</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Your product is now live and visible to customers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Create a Professional Product Catalog (Split Form Section) */}
          <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 space-y-5">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0052ff] font-bold text-xs uppercase tracking-wider">
                    PRODUCT CATALOG
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0c1427] tracking-tight leading-tight">
                    Create a Professional Product Catalog
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Showcase your products with clear images, accurate details and organized
                    categories. Help customers easily find what they are looking for in your store.
                  </p>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Clean and easy product listing
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Organized categories and filters
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Manage variants and inventory
                      </span>
                    </div>
                  </div>
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={onStartSelling}
                      className="px-6 py-3.5 rounded-xl bg-[#0052ff] hover:bg-[#0043d9] text-white font-bold text-sm shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <span>Start Listing Products</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 flex justify-center">
                  <div className="w-full max-w-[500px]">
                    <img
                      src="/images/list-products-form.png"
                      alt="Add Product Form & Preview"
                      className="w-full h-auto object-contain rounded-2xl shadow-xl border border-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Make Your Products Visible to Nearby Customers */}
          <section className="py-16 sm:py-20 bg-[#f8fbff] border-t border-slate-100">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0052ff] font-bold text-xs uppercase tracking-wider">
                    BE DISCOVERED LOCALLY
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0c1427] tracking-tight leading-tight">
                    Make Your Products Visible to Nearby Customers
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Once you list your products, customers in your area can discover them while
                    searching on {branding.appName}. Get more visibility and turn product views into
                    store visits and orders.
                  </p>
                </div>

                <div className="lg:col-span-7 flex justify-center">
                  <div className="w-full max-w-[520px]">
                    <img
                      src="/images/list-products-discovery.png"
                      alt="Local Discovery Mobile Preview"
                      className="w-full h-auto object-contain rounded-2xl shadow-lg border border-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pre-Footer Banner */}
          <section className="py-12 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-[#0052ff] to-[#0038ed] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2 text-center md:text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                    READY TO START?
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black">List Your Products Today</h3>
                  <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                    Create your product catalog and start reaching nearby customers with{' '}
                    {branding.appName}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-6 py-3.5 rounded-xl bg-white text-[#0052ff] hover:bg-slate-50 font-bold text-sm shadow-md transition-all cursor-pointer shrink-0"
                >
                  Start Listing Products &rarr;
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =========================================================================
          TAB 2: MANAGE STORE (Mockup 1.2.png)
          ========================================================================= */}
      {activeTab === 'managestore' && (
        <div className="w-full">
          {/* Hero Section */}
          <section className="pt-6 pb-12 sm:pb-16 bg-gradient-to-b from-[#f5f9ff] via-white to-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#0052ff] transition-colors cursor-pointer"
                >
                  Home
                </button>
                <span>&gt;</span>
                <span className="text-slate-600">Sell Online</span>
                <span>&gt;</span>
                <span className="text-[#0052ff] font-semibold">Manage Your Store</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left Column */}
                <div className="lg:col-span-5 space-y-5">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0052ff] font-bold text-xs uppercase tracking-wider">
                    SELL ONLINE
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0c1427] tracking-tight leading-[1.15]">
                    Manage Your Store on{' '}
                    <span className="text-[#0052ff]">{branding.appName}</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                    Easily manage your inventory, billing, customers and more. Everything you need to
                    run and grow your local retail business in one place.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3.5">
                    <button
                      type="button"
                      onClick={onStartSelling}
                      className="px-6 py-3.5 rounded-xl bg-[#0052ff] hover:bg-[#0043d9] text-white font-bold text-sm shadow-sm hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Start Selling</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('/learn/tutorials')}
                      className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200/90 shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                        <Play className="w-2.5 h-2.5 fill-[#0052ff] ml-0.5" />
                      </div>
                      <span>Watch How It Works</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Laptop + Phone */}
                <div className="lg:col-span-7 flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-[620px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white">
                    <img
                      src="/images/manage-store-hero.png"
                      alt="Merchant Dashboard & Customer Mobile App"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4 Value Pills */}
          <section className="py-6 bg-white border-y border-slate-100">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">
                      All-in-One Store Management
                    </div>
                    <div className="text-xs text-slate-500">
                      Products, orders, inventory, billing, customers.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">Easy to Use</div>
                    <div className="text-xs text-slate-500">
                      Simple interface designed for local retailers.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">Save Time</div>
                    <div className="text-xs text-slate-500">
                      Automate daily tasks and focus on growth.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">Grow Faster</div>
                    <div className="text-xs text-slate-500">
                      Get better insights and make smarter decisions.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Everything You Need to Manage Your Store (9 Feature Cards Grid) */}
          <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
                  Everything You Need to Manage Your Store
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Powerful tools to run your retail business efficiently.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Product Management */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
                      <Box className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Product Management
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Add, edit and organize your products with images, prices, categories and
                        variants.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 2. Inventory Management */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Inventory Management
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Track stock, get low stock alerts and manage product availability in
                        real-time.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 3. Billing & Invoicing */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Billing &amp; Invoicing
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Create bills and invoices with GST details for your customers.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 4. Orders & Delivery */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Orders &amp; Delivery
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Manage orders with pickup or local delivery options.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 5. Customer Management */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Customer Management
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Keep customer details and order history to build long-term relationships.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 6. Reports & Analytics */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Reports &amp; Analytics
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Get insights on sales, popular products and customer trends.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 7. Promotions & Offers */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                      <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Promotions &amp; Offers
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Create discounts and special offers to attract more customers.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 8. Store Settings */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                      <Sliders className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Store Settings
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Manage your store profile, logo, address, timings and more.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 9. Seller Support */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Seller Support
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Get help whenever you need with our dedicated support team.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>
              </div>
            </div>
          </section>

          {/* How It Works (5-Step Sequence) */}
          <section className="py-16 sm:py-20 bg-[#f8fbff] border-y border-slate-100">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
                  How It Works
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Get your store up and running in just a few simple steps.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">01</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Create Seller Account</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Sign up and verify your details.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                    <Box className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">02</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Set Up Your Store</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Add your store profile, logo and basic details.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">03</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Add Products</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Upload images, set prices and manage inventory.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">04</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Start Receiving Orders</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Get orders from nearby customers.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">05</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Fulfil &amp; Grow</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Manage your store and reach more customers in your area.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Take Your Store to More Customers */}
          <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 space-y-5">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0c1427] tracking-tight leading-tight">
                    Take Your Store to More Customers
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Get discovered by nearby customers, increase your sales and build a strong local
                    presence with {branding.appName}.
                  </p>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Showcase your products with clear images and details
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Reach nearby customers searching for what you sell
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Get more visibility and turn product views into orders
                      </span>
                    </div>
                  </div>
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => onNavigate('/how-it-works/localdiscovery')}
                      className="px-6 py-3.5 rounded-xl bg-[#0052ff] hover:bg-[#0043d9] text-white font-bold text-sm shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <span>Learn About Local Discovery</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 flex justify-center">
                  <div className="w-full max-w-[500px]">
                    <img
                      src="/images/manage-store-discovery.png"
                      alt="Customer Local Discovery Map & Phone"
                      className="w-full h-auto object-contain rounded-2xl shadow-xl border border-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pre-Footer Banner */}
          <section className="py-12 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-[#0052ff] to-[#0038ed] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2 text-center md:text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                    READY TO GET STARTED?
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black">
                    Manage Your Store on {branding.appName}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                    Create your seller account and start listing your products today.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-6 py-3.5 rounded-xl bg-white text-[#0052ff] hover:bg-slate-50 font-bold text-sm shadow-md transition-all cursor-pointer shrink-0"
                >
                  Start Selling &rarr;
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ORDERS & DELIVERY (Mockup 1.3.png)
          ========================================================================= */}
      {activeTab === 'ordersdelivery' && (
        <div className="w-full">
          {/* Hero Section */}
          <section className="pt-6 pb-12 sm:pb-16 bg-gradient-to-b from-[#f5f9ff] via-white to-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#0052ff] transition-colors cursor-pointer"
                >
                  Home
                </button>
                <span>&gt;</span>
                <span className="text-slate-600">Sell Online</span>
                <span>&gt;</span>
                <span className="text-[#0052ff] font-semibold">Orders &amp; Delivery</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left Column */}
                <div className="lg:col-span-5 space-y-5">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0052ff] font-bold text-xs uppercase tracking-wider">
                    SELL ONLINE
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0c1427] tracking-tight leading-[1.15]">
                    Orders &amp; <span className="text-[#0052ff]">Delivery</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                    Receive orders, manage fulfillment and offer pickup or local delivery to your
                    customers.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3.5">
                    <button
                      type="button"
                      onClick={onStartSelling}
                      className="px-6 py-3.5 rounded-xl bg-[#0052ff] hover:bg-[#0043d9] text-white font-bold text-sm shadow-sm hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Start Selling</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('/learn/tutorials')}
                      className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200/90 shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                        <Play className="w-2.5 h-2.5 fill-[#0052ff] ml-0.5" />
                      </div>
                      <span>Watch How It Works</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Laptop + Delivery Partner */}
                <div className="lg:col-span-7 flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-[620px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white">
                    <img
                      src="/images/orders-delivery-hero.png"
                      alt="Orders Pipeline & Delivery Partner"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4 Value Pills */}
          <section className="py-6 bg-white border-y border-slate-100">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">Manage All Orders</div>
                    <div className="text-xs text-slate-500">Online &amp; in one place.</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">Pickup &amp; Local Delivery</div>
                    <div className="text-xs text-slate-500">Flexible fulfillment options.</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">Real-time Updates</div>
                    <div className="text-xs text-slate-500">Keep customers informed.</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">Efficient Order Management</div>
                    <div className="text-xs text-slate-500">Save time and reduce errors.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Everything You Need to Manage Orders and Delivery (4 Cards) */}
          <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
                  Everything You Need to Manage Orders and Delivery
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Handle your orders, fulfillment and delivery operations with simple and powerful
                  tools.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                      Order Management
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                      View, process and track all online orders in one place.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center mb-4">
                      <Truck className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                      Delivery Settings
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                      Configure pickup and local delivery options for your store.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                      Live Order Tracking
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                      Keep customers updated with real-time order status.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                      Order History &amp; Reports
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                      Analyze orders, delivery performance and trends.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>
              </div>
            </div>
          </section>

          {/* How It Works (Split Section) */}
          <section className="py-16 sm:py-20 bg-[#f8fbff] border-y border-slate-100">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
                  How It Works
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Start receiving and fulfilling orders in a few simple steps.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* 5-Step Vertical Flow */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                      <div className="text-xs font-bold text-[#0052ff] mb-1">01</div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0c1427]">Receive Orders</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Orders from nearby customers.</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                      <div className="text-xs font-bold text-[#0052ff] mb-1">02</div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0c1427]">Process Orders</h4>
                      <p className="text-[11px] text-slate-500 mt-1">View details &amp; confirm items.</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                      <div className="text-xs font-bold text-[#0052ff] mb-1">03</div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0c1427]">Prepare</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Pack for pickup or delivery.</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                      <div className="text-xs font-bold text-[#0052ff] mb-1">04</div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0c1427]">Pickup / Delivery</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Hand over or arrange local run.</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                      <div className="text-xs font-bold text-[#0052ff] mb-1">05</div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0c1427]">Completed</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Customer verified via OTP.</p>
                    </div>
                  </div>
                </div>

                {/* Right: Shopkeeper + Order Notification Toast */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-[420px] rounded-2xl overflow-hidden shadow-xl border border-slate-100">
                    <img
                      src="/images/orders-delivery-split.png"
                      alt="Order Processing & Toast Notification"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Benefits */}
          <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight mb-10">
                Additional Benefits
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0c1427]">
                    Multiple Fulfillment Options
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2">
                    Offer both pickup and local delivery to suit your customers.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center mb-4">
                    <Box className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0c1427]">
                    Manage by Store/Location
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2">
                    If you have multiple outlets, manage orders separately.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0c1427]">
                    Customer Notifications
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2">
                    Keep customers informed with automated order updates.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0c1427]">
                    Reduce Manual Effort
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2">
                    Automate order flow and minimize errors across staff.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pre-Footer Banner */}
          <section className="py-12 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-[#0052ff] to-[#0038ed] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2 text-center md:text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                    READY TO GET STARTED?
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black">
                    Start Receiving Orders on {branding.appName}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                    Create your seller account and start managing orders, pickup and local delivery
                    today.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-6 py-3.5 rounded-xl bg-white text-[#0052ff] hover:bg-slate-50 font-bold text-sm shadow-md transition-all cursor-pointer shrink-0"
                >
                  Start Selling &rarr;
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =========================================================================
          TAB 4: SELLER TOOLS (Mockup 1.4.png)
          ========================================================================= */}
      {activeTab === 'sellertools' && (
        <div className="w-full">
          {/* Hero Section */}
          <section className="pt-6 pb-12 sm:pb-16 bg-gradient-to-b from-[#f5f9ff] via-white to-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#0052ff] transition-colors cursor-pointer"
                >
                  Home
                </button>
                <span>&gt;</span>
                <span className="text-slate-600">Sell Online</span>
                <span>&gt;</span>
                <span className="text-[#0052ff] font-semibold">Seller Tools</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left Column */}
                <div className="lg:col-span-5 space-y-5">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0052ff] font-bold text-xs uppercase tracking-wider">
                    SELL ONLINE
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0c1427] tracking-tight leading-[1.15]">
                    Seller Tools on{' '}
                    <span className="text-[#0052ff]">{branding.appName}</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                    Powerful tools to manage, grow and streamline your retail business — all in one
                    place.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3.5">
                    <button
                      type="button"
                      onClick={onStartSelling}
                      className="px-6 py-3.5 rounded-xl bg-[#0052ff] hover:bg-[#0043d9] text-white font-bold text-sm shadow-sm hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Start Selling</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('/learn/tutorials')}
                      className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200/90 shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                        <Play className="w-2.5 h-2.5 fill-[#0052ff] ml-0.5" />
                      </div>
                      <span>Watch How It Works</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Laptop + Phone */}
                <div className="lg:col-span-7 flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-[620px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white">
                    <img
                      src="/images/seller-tools-hero.png"
                      alt="Seller Tools Hub & QR Generator Preview"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4 Value Pills */}
          <section className="py-6 bg-white border-y border-slate-100">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">All-in-One Tools</div>
                    <div className="text-xs text-slate-500">
                      Everything you need to run your store efficiently.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">Easy to Use</div>
                    <div className="text-xs text-slate-500">
                      Simple and clean interface for local retailers.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">Save Time</div>
                    <div className="text-xs text-slate-500">
                      Automate repetitive tasks and focus on sales.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fbff] border border-blue-50 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0c1427]">Grow Business</div>
                    <div className="text-xs text-slate-500">
                      Get more visibility and reach nearby customers.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Explore Seller Tools (12 Feature Cards Grid) */}
          <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
                  Explore Seller Tools
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Manage, automate and grow your store with powerful tools designed for local
                  retailers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. QR Code Generator */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        QR Code Generator
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Create and download your store QR code to share with customers.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 2. Store Link */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
                      <LinkIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Store Link
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Get a unique store link to share on WhatsApp, Instagram and more.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 3. Product Import */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Product Import
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Bulk upload products using Excel/CSV for quick setup.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 4. Image Tools */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Image Tools
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Enhance product images, remove background and optimize for catalog.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 5. Catalog Management */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Catalog Management
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Organize products, categories and variants efficiently.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 6. Inventory Tools */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                      <Box className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Inventory Tools
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Track stock, low stock alerts and manage inventory.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 7. Billing & Invoicing */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Billing &amp; Invoicing
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Create GST invoices, manage bills and download reports.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 8. Reports & Analytics */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Reports &amp; Analytics
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        View sales reports, popular products and customer trends.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 9. Marketing Tools */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                      <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Marketing Tools
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Create offers, discounts and promotions to attract more customers.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 10. Customer Management */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Customer Management
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Manage customer details and purchase history.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 11. Integrations */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Integrations
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Connect with third-party tools and services.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>

                {/* 12. Store Settings */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052ff] flex items-center justify-center shrink-0">
                      <Sliders className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0c1427] group-hover:text-[#0052ff] transition-colors">
                        Store Settings
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                        Manage store profile, logo, address, timings and more.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052ff] shrink-0 mt-1" />
                </div>
              </div>
            </div>
          </section>

          {/* Featured Tool: QR Code Generator */}
          <section className="py-16 sm:py-20 bg-[#f8fbff] border-y border-slate-100">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 space-y-5">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0c1427] tracking-tight leading-tight">
                    Featured Tool: QR Code Generator
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Create your store QR code in seconds and start getting orders from nearby
                    customers.
                  </p>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Generate unique QR code for your store
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Download in high quality
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Share on WhatsApp, Instagram and print materials
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0052ff] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Get more visibility from local customers
                      </span>
                    </div>
                  </div>
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={onStartSelling}
                      className="px-6 py-3.5 rounded-xl bg-[#0052ff] hover:bg-[#0043d9] text-white font-bold text-sm shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <span>Generate My Store QR</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 flex justify-center">
                  <div className="w-full max-w-[500px]">
                    <img
                      src="/images/seller-tools-qr.png"
                      alt="Store QR Code Generator & Counter Standee"
                      className="w-full h-auto object-contain rounded-2xl shadow-xl border border-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works (4-Step Sequence) */}
          <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="text-2xl sm:text-3xl font-black text-[#0c1427] tracking-tight">
                  How It Works
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Start using seller tools and manage your store in a few simple steps.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">01</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Login to Your Account</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Sign in to your {branding.appName} seller account.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">02</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Choose a Tool</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Select the tool you want to use from seller tools.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">03</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Configure &amp; Use</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Set up and start using the tool.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-[#0052ff] text-[#0052ff] flex items-center justify-center font-bold text-sm mb-3">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#0052ff] mb-1">04</div>
                  <h4 className="text-sm font-bold text-[#0c1427]">Manage Your Business</h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    Save time, reduce manual work and grow faster.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pre-Footer Banner */}
          <section className="py-12 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-[#0052ff] to-[#0038ed] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2 text-center md:text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-200">
                    READY TO GET STARTED?
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black">
                    Use Powerful Seller Tools on {branding.appName}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                    Simplify your store operations and grow your local retail business today.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onStartSelling}
                  className="px-6 py-3.5 rounded-xl bg-white text-[#0052ff] hover:bg-slate-50 font-bold text-sm shadow-md transition-all cursor-pointer shrink-0"
                >
                  Start Selling &rarr;
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
