import React from 'react';
import {
  ArrowRight,
  Package,
  Layers,
  Truck,
  Wrench,
  QrCode,
  FileText,
  BarChart3,
  Share2,
  Upload,
  Zap,
  Eye,
  Users,
  Settings,
  Tag,
  Download,
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

  const handleTabChange = (tab: SellOnlineTab) => {
    setActiveTab(tab);
    onNavigate(`/sell-online/${tab}`);
  };

  return (
    <div className="w-full bg-white select-none">
      {/* Top Breadcrumbs & Sub-Navigation Header */}
      <div className="bg-[#f0f6ff] border-b border-blue-100 py-6">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#0038ed] transition-colors"
            >
              Home
            </button>
            <span>&gt;</span>
            <span className="text-slate-700">Sell Online</span>
            <span>&gt;</span>
            <span className="text-[#0038ed] font-bold capitalize">
              {activeTab === 'listproducts'
                ? 'List Products'
                : activeTab === 'managestore'
                ? 'Manage Your Store'
                : activeTab === 'ordersdelivery'
                ? 'Orders & Delivery'
                : 'Seller Tools'}
            </span>
          </div>

          {/* Subnav Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleTabChange('listproducts')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'listproducts'
                  ? 'bg-[#0038ed] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>List Products</span>
            </button>

            <button
              onClick={() => handleTabChange('managestore')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'managestore'
                  ? 'bg-[#0038ed] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Manage Store</span>
            </button>

            <button
              onClick={() => handleTabChange('ordersdelivery')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'ordersdelivery'
                  ? 'bg-[#0038ed] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Orders &amp; Delivery</span>
            </button>

            <button
              onClick={() => handleTabChange('sellertools')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'sellertools'
                  ? 'bg-[#0038ed] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Seller Tools</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: LIST PRODUCTS (Mockup 1.1.png) */}
      {activeTab === 'listproducts' && (
        <div>
          {/* Hero */}
          <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f0f6ff] to-white border-b border-slate-100">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0038ed] font-bold text-xs uppercase tracking-wider">
                    SELL ONLINE
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    List Products on{' '}
                    <span className="text-[#0038ed]">{branding.appName}</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                    Create your digital product catalog, add images, prices and details — and make
                    your products visible to nearby customers.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onStartSelling}
                      className="px-7 py-3.5 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span>Start Listing Products</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right Hero Graphic Mockup */}
                <div className="lg:col-span-6">
                  <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 text-white">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                      <div className="flex items-center gap-2 font-bold text-blue-400">
                        <Package className="w-4 h-4" />
                        <span>Products / Catalog Manager</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        1,248 Active SKUs
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="p-3 bg-slate-800/80 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs">
                            👕
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">Handloom Cotton Kurta</div>
                            <div className="text-[10px] text-slate-400">SKU: PRD-KURTA-01 • In Stock (20)</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-white">₹899</div>
                          <div className="text-[10px] text-emerald-400 font-semibold">Active</div>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-800/80 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-purple-600/30 text-purple-400 flex items-center justify-center font-bold text-xs">
                            🧣
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">Chanderi Silk Dupatta</div>
                            <div className="text-[10px] text-slate-400">SKU: PRD-DUP-02 • In Stock (15)</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-white">₹499</div>
                          <div className="text-[10px] text-emerald-400 font-semibold">Active</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4 Value Pills */}
          <div className="py-8 bg-white border-b border-slate-100">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#0038ed]" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Easy to Add</div>
                  <div className="text-[11px] text-slate-500">List products in minutes.</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
                <Package className="w-5 h-5 text-[#0038ed]" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Organized Catalog</div>
                  <div className="text-[11px] text-slate-500">Categories, variants, tags.</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
                <Eye className="w-5 h-5 text-[#0038ed]" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Visible to Customers</div>
                  <div className="text-[11px] text-slate-500">Discovered by nearby buyers.</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-[#0038ed]" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Real-time Control</div>
                  <div className="text-[11px] text-slate-500">Instant price and stock sync.</div>
                </div>
              </div>
            </div>
          </div>

          {/* 6-Step Listing Workflow */}
          <section className="py-16 sm:py-20 bg-[#f8fbff]">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  How to List Your Products
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Get your products live in just a few simple steps.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs font-black text-[#0038ed] mb-1">01</div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Add Product</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Enter product name &amp; details.</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs font-black text-[#0038ed] mb-1">02</div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Upload Images</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Add clear attractive photos.</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs font-black text-[#0038ed] mb-1">03</div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Set Category</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Organize for customer browsing.</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs font-black text-[#0038ed] mb-1">04</div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Add Variants</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Configure size and colors.</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs font-black text-[#0038ed] mb-1">05</div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Set Price &amp; Stock</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Enter price, MRP, quantities.</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-xs font-black text-[#0038ed] mb-1">06</div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Publish</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Visible to nearby shoppers.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: MANAGE STORE (Mockup 1.2.png) */}
      {activeTab === 'managestore' && (
        <div>
          <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f0f6ff] to-white border-b border-slate-100">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0038ed] font-bold text-xs uppercase tracking-wider">
                    OPERATIONAL CONTROLS
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    Manage Your Store on{' '}
                    <span className="text-[#0038ed]">{branding.appName}</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                    Easily manage your inventory, billing, customers and more. Everything you need to
                    run and grow your local retail business in one place.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onStartSelling}
                      className="px-7 py-3.5 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span>Start Selling</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="font-bold text-sm text-slate-800">Operational Hub</div>
                      <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        Online Sync Ready
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 bg-blue-50/50 rounded-xl">
                        <div className="text-xs text-slate-500">Orders</div>
                        <div className="text-base font-bold text-[#0038ed]">248</div>
                      </div>
                      <div className="p-3 bg-blue-50/50 rounded-xl">
                        <div className="text-xs text-slate-500">Revenue</div>
                        <div className="text-base font-bold text-slate-900">₹1,24,560</div>
                      </div>
                      <div className="p-3 bg-blue-50/50 rounded-xl">
                        <div className="text-xs text-slate-500">Products</div>
                        <div className="text-base font-bold text-slate-900">1,284</div>
                      </div>
                      <div className="p-3 bg-blue-50/50 rounded-xl">
                        <div className="text-xs text-slate-500">Customers</div>
                        <div className="text-base font-bold text-slate-900">890</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8 Operational Tool Cards Grid (1.2.png) */}
          <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Everything You Need to Manage Your Store
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Powerful tools to run your retail business efficiently.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#0038ed]/40 transition-colors">
                  <Package className="w-6 h-6 text-[#0038ed] mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">Product Management</h4>
                  <p className="text-xs text-slate-500 mt-1">Add, edit and organize catalog items.</p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#0038ed]/40 transition-colors">
                  <Layers className="w-6 h-6 text-emerald-600 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">Inventory Management</h4>
                  <p className="text-xs text-slate-500 mt-1">Track stock and receive low-stock alerts.</p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#0038ed]/40 transition-colors">
                  <FileText className="w-6 h-6 text-amber-600 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">Billing &amp; Invoicing</h4>
                  <p className="text-xs text-slate-500 mt-1">Generate compliant GST invoices.</p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#0038ed]/40 transition-colors">
                  <Truck className="w-6 h-6 text-rose-600 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">Orders &amp; Delivery</h4>
                  <p className="text-xs text-slate-500 mt-1">Fulfill pickup and delivery orders.</p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#0038ed]/40 transition-colors">
                  <Users className="w-6 h-6 text-indigo-600 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">Customer Management</h4>
                  <p className="text-xs text-slate-500 mt-1">Store details and repeat order history.</p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#0038ed]/40 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">Reports &amp; Analytics</h4>
                  <p className="text-xs text-slate-500 mt-1">Sales insights and popular trends.</p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#0038ed]/40 transition-colors">
                  <Tag className="w-6 h-6 text-yellow-600 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">Promotions &amp; Offers</h4>
                  <p className="text-xs text-slate-500 mt-1">Create coupons and seasonal discounts.</p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#0038ed]/40 transition-colors">
                  <Settings className="w-6 h-6 text-slate-700 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">Store Settings</h4>
                  <p className="text-xs text-slate-500 mt-1">Manage profile, hours, and banners.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 3: ORDERS & DELIVERY (Mockup 1.3.png) */}
      {activeTab === 'ordersdelivery' && (
        <div>
          <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f0f6ff] to-white border-b border-slate-100">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0038ed] font-bold text-xs uppercase tracking-wider">
                    FULFILLMENT &amp; LOGISTICS
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    Orders &amp; <span className="text-[#0038ed]">Delivery</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                    Receive orders, manage fulfillment and offer pickup or local delivery to your
                    customers.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onStartSelling}
                      className="px-7 py-3.5 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span>Start Selling</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="font-bold text-sm text-slate-800">Live Orders Pipeline</div>
                      <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full">
                        Delivery OTP Guard Active
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                        <div>
                          <div className="font-bold text-slate-900">#ORD-78241 • Arjun Sharma</div>
                          <div className="text-slate-500">2 items • Home Delivery</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 font-bold">
                          Ready for Pickup
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                        <div>
                          <div className="font-bold text-slate-900">#ORD-78240 • Priya Singh</div>
                          <div className="text-slate-500">1 item • Store Pickup</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold">
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5-Step Fulfillment Timeline (1.3.png) */}
          <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How It Works</h2>
                <p className="text-sm text-slate-500 mt-2">
                  Start receiving and fulfilling orders in a few simple steps.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
                <div className="p-5 bg-[#f8fbff] rounded-2xl border border-blue-100">
                  <div className="text-xs font-black text-[#0038ed] mb-1">01</div>
                  <h4 className="text-sm font-bold text-slate-900">Receive Orders</h4>
                  <p className="text-xs text-slate-500 mt-1">Orders from nearby customers.</p>
                </div>
                <div className="p-5 bg-[#f8fbff] rounded-2xl border border-blue-100">
                  <div className="text-xs font-black text-[#0038ed] mb-1">02</div>
                  <h4 className="text-sm font-bold text-slate-900">Process Orders</h4>
                  <p className="text-xs text-slate-500 mt-1">Confirm order items.</p>
                </div>
                <div className="p-5 bg-[#f8fbff] rounded-2xl border border-blue-100">
                  <div className="text-xs font-black text-[#0038ed] mb-1">03</div>
                  <h4 className="text-sm font-bold text-slate-900">Prepare Package</h4>
                  <p className="text-xs text-slate-500 mt-1">Pack for pickup or delivery.</p>
                </div>
                <div className="p-5 bg-[#f8fbff] rounded-2xl border border-blue-100">
                  <div className="text-xs font-black text-[#0038ed] mb-1">04</div>
                  <h4 className="text-sm font-bold text-slate-900">Handover</h4>
                  <p className="text-xs text-slate-500 mt-1">Deliver or hand over to customer.</p>
                </div>
                <div className="p-5 bg-[#f8fbff] rounded-2xl border border-blue-100">
                  <div className="text-xs font-black text-[#0038ed] mb-1">05</div>
                  <h4 className="text-sm font-bold text-slate-900">Order Completed</h4>
                  <p className="text-xs text-slate-500 mt-1">Customer verified via OTP.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 4: SELLER TOOLS (Mockup 1.4.png) */}
      {activeTab === 'sellertools' && (
        <div>
          <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f0f6ff] to-white border-b border-slate-100">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0038ed] font-bold text-xs uppercase tracking-wider">
                    OPERATIONAL EXPANSION
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    Seller Tools on{' '}
                    <span className="text-[#0038ed]">{branding.appName}</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                    Powerful tools to manage, grow and streamline your retail business — all in one
                    place.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onStartSelling}
                      className="px-7 py-3.5 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span>Start Selling</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Featured QR Code Deep-Dive Box */}
                <div className="lg:col-span-6">
                  <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
                      <QrCode className="w-4 h-4 text-white" />
                      <span>Featured Tool: Store QR &amp; Link</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black">
                      Printable Counter QR Standees
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Download high-resolution QR standees and table tents. Shoppers scan at your
                      counter to explore your full catalog and order online.
                    </p>
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={onStartSelling}
                        className="px-5 py-2.5 rounded-xl bg-white text-[#0038ed] font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Generate Store QR</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 11-Tool Exploration Grid (1.4.png) */}
          <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Explore Seller Tools
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Manage, automate and grow your store with powerful tools designed for local
                  retailers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#0038ed]/40 transition-colors flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">QR Code Generator</h4>
                    <p className="text-xs text-slate-500 mt-1">Download and share store QR.</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#0038ed]/40 transition-colors flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Store Link</h4>
                    <p className="text-xs text-slate-500 mt-1">Share on WhatsApp &amp; Instagram.</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#0038ed]/40 transition-colors flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Product Bulk Import</h4>
                    <p className="text-xs text-slate-500 mt-1">Upload via Excel/CSV spreadsheet.</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#0038ed]/40 transition-colors flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Billing &amp; Invoicing</h4>
                    <p className="text-xs text-slate-500 mt-1">Create GST invoices &amp; thermal bills.</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#0038ed]/40 transition-colors flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Reports &amp; Analytics</h4>
                    <p className="text-xs text-slate-500 mt-1">Sales reports and customer trends.</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#0038ed]/40 transition-colors flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Marketing Tools</h4>
                    <p className="text-xs text-slate-500 mt-1">Offers, coupons &amp; promotional ads.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Universal Pre-Footer Banner */}
      <section className="bg-[#0038ed] text-white py-12 select-none">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black">
              Ready to sell online with {branding.appName}?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100">
              Join thousands of local retail merchants scaling their stores today.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartSelling}
            className="px-6 py-3 rounded-xl bg-white text-[#0038ed] font-bold text-sm shadow-md hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            Start Selling Now &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};
