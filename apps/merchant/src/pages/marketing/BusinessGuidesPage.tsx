import React, { useState } from 'react';
import {
  ArrowRight,
  FileSpreadsheet,
  FileText,
  Camera,
  Lightbulb,
  Search,
  Store,
  Package,
  Truck,
  CreditCard,
  TrendingUp,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { MARKETING_DATA } from '../../data/marketingData.js';
import { VideoCard, VideoTutorialItem } from '../../components/marketing/VideoCard.js';
import { useVideoModal } from '../../components/marketing/MerchantPublicLayout.js';

interface BusinessGuidesPageProps {
  onNavigate: (route: string) => void;
  onSelectGuide: (slug: string) => void;
  onStartSelling: () => void;
}

export const BusinessGuidesPage: React.FC<BusinessGuidesPageProps> = ({
  onNavigate,
  onSelectGuide,
  onStartSelling,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All Guides');
  const [searchQuery, setSearchQuery] = useState('');
  const { openVideoModal } = useVideoModal();

  const categories = [
    'All Guides',
    'Getting Started',
    'Product Management',
    'Orders & Delivery',
    'Store Setup',
    'Marketing & Growth',
    'Billing & Payments',
  ];

  const filteredGuides = MARKETING_DATA.guides.filter((guide) => {
    const matchesCategory =
      activeCategory === 'All Guides' || guide.category === activeCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredVideos: VideoTutorialItem[] = MARKETING_DATA.videos.slice(0, 4);

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Header Section (Mockup 5.2.png) */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f0f6ff] to-white border-b border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#0038ed] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>&gt;</span>
            <button
              onClick={() => onNavigate('/learn/guides')}
              className="hover:text-[#0038ed] transition-colors cursor-pointer"
            >
              Learn
            </button>
            <span>&gt;</span>
            <span className="text-[#0038ed] font-bold">Business Guides</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0038ed] font-bold text-xs uppercase tracking-wider">
                BUSINESS GUIDES
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Practical Guides for{' '}
                <span className="text-[#0038ed]">Local Retailers</span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                Tips, best practices and step-by-step guides to help you set up, manage and grow your
                store on {branding.appName}.
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

            {/* Right Summary Card */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-blue-200/90 shadow-xl space-y-3">
                <div className="p-3 bg-blue-50/70 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0038ed] flex items-center justify-center font-bold">
                    📈
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">More Store Visits</div>
                    <div className="text-[11px] text-slate-500">Reach more nearby customers.</div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/70 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    🛒
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">More Orders</div>
                    <div className="text-[11px] text-slate-500">Turn store visits into orders.</div>
                  </div>
                </div>

                <div className="p-3 bg-purple-50/70 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    👥
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Business Growth</div>
                    <div className="text-[11px] text-slate-500">Build a loyal customer base.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Tabs & Search Bar */}
      <div className="py-6 bg-white border-b border-slate-100 sticky top-20 z-20 bg-white/95 backdrop-blur-md">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#0038ed] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0038ed] focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 3. Featured Guides Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Featured Guides</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Start with these helpful guides to set up and grow your store on {branding.appName}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGuides.map((guide, idx) => (
              <div
                key={idx}
                onClick={() => onSelectGuide(guide.slug)}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-[#0038ed]/30 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Visual Top Preview */}
                <div className="aspect-[16/10] bg-gradient-to-br from-blue-900 to-slate-900 p-4 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                      {guide.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{guide.readTime}</span>
                  </div>

                  <div className="text-center font-bold text-xs text-white/90 line-clamp-2">
                    {guide.title}
                  </div>

                  <div className="w-full bg-slate-800/80 h-1 rounded-full" />
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors line-clamp-2 mb-2">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {guide.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0038ed]">
                    <span>Read Guide</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Popular Topics Tiles */}
      <section className="py-12 bg-[#f8fbff] border-y border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Popular Topics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div
              onClick={() => setActiveCategory('Store Setup')}
              className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#0038ed] cursor-pointer transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 text-[#0038ed]" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Store Setup</div>
                  <div className="text-[10px] text-slate-400">5 articles</div>
                </div>
              </div>
            </div>

            <div
              onClick={() => setActiveCategory('Product Management')}
              className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#0038ed] cursor-pointer transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Products</div>
                  <div className="text-[10px] text-slate-400">6 articles</div>
                </div>
              </div>
            </div>

            <div
              onClick={() => setActiveCategory('Orders & Delivery')}
              className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#0038ed] cursor-pointer transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-rose-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Orders &amp; Delivery</div>
                  <div className="text-[10px] text-slate-400">5 articles</div>
                </div>
              </div>
            </div>

            <div
              onClick={() => setActiveCategory('Marketing & Growth')}
              className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#0038ed] cursor-pointer transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Marketing</div>
                  <div className="text-[10px] text-slate-400">6 articles</div>
                </div>
              </div>
            </div>

            <div
              onClick={() => setActiveCategory('Billing & Payments')}
              className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#0038ed] cursor-pointer transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Billing</div>
                  <div className="text-[10px] text-slate-400">4 articles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Step-by-Step Video Guides Row */}
      <section className="py-16 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Step-by-Step Video Guides</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Watch short videos to learn how to use {branding.appName}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/learn/tutorials')}
              className="text-xs font-bold text-[#0038ed] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Videos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={(v) => openVideoModal(v)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Helpful Resources (Download Templates) */}
      <section className="py-16 bg-[#f8fbff] border-t border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Helpful Resources</h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-8">
            Download templates, checklists and other tools to make your work easier.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4 hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Product Upload Template</h4>
                <div className="text-[11px] text-slate-500">Excel (.xlsx) file</div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4 hover:border-rose-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Store Launch Checklist</h4>
                <div className="text-[11px] text-slate-500">PDF printable</div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4 hover:border-purple-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Product Photography Tips</h4>
                <div className="text-[11px] text-slate-500">PDF visual guide</div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4 hover:border-amber-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Marketing Ideas for Stores</h4>
                <div className="text-[11px] text-slate-500">PDF playbook</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pre-Footer Banner (Visit Help Centre) */}
      <section className="bg-[#0038ed] text-white py-12 select-none">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <div className="text-xs font-bold text-blue-200 uppercase tracking-widest">
              NEED MORE HELP?
            </div>
            <h3 className="text-xl sm:text-2xl font-black">Visit Help Centre</h3>
            <p className="text-xs sm:text-sm text-blue-100">
              Get detailed articles, video tutorials and answers to common questions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/help')}
            className="px-6 py-3 rounded-xl bg-white text-[#0038ed] font-bold text-sm shadow-md hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            Go to Help Centre &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};
