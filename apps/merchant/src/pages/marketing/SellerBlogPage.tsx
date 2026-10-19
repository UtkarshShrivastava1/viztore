import React, { useState } from 'react';
import {
  ArrowRight,
  Search,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Headphones,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { MARKETING_DATA } from '../../data/marketingData.js';
import { StillNeedHelpBanner } from '../../components/marketing/StillNeedHelpBanner.js';

interface SellerBlogPageProps {
  onNavigate: (route: string) => void;
  onSelectPost: (slug: string) => void;
}

export const SellerBlogPage: React.FC<SellerBlogPageProps> = ({
  onNavigate,
  onSelectPost,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All Posts');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All Posts',
    'Getting Started',
    'Product Management',
    'Orders & Delivery',
    'Billing & GST',
    'Marketing & Growth',
    'Success Stories',
  ];

  const filteredPosts = MARKETING_DATA.blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All Posts' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularPosts = MARKETING_DATA.blogPosts.slice(0, 5);

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Header (Mockup 5.6.png) */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f0f6ff] to-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 Cols: Title & Breadcrumbs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#0052ff] transition-colors cursor-pointer"
                >
                  Home
                </button>
                <span>&gt;</span>
                <button
                  onClick={() => onNavigate('/learn/guides')}
                  className="hover:text-[#0052ff] transition-colors cursor-pointer"
                >
                  Learn
                </button>
                <span>&gt;</span>
                <span className="text-[#0052ff] font-bold">Seller Blog</span>
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0052ff] font-bold text-xs uppercase tracking-wider">
                SELLER BLOG
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Tips, Ideas and Stories for Your Business
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                Practical guides, tips and real stories to help you manage and grow your store on {branding.appName}.
              </p>
            </div>

            {/* Right 5 Cols: Hero Mockup Image (5.6.png) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <img
                src="/images/blog-hero.png"
                alt="Seller Blog"
                className="w-full max-w-[440px] h-auto object-contain drop-shadow-md rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Tabs & Search Bar */}
      <div className="py-6 bg-white border-b border-slate-100 sticky top-20 z-20 bg-white/95 backdrop-blur-md">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
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

          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0038ed]"
            />
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Posts Grid + Popular Posts Rail */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 8 Cols: Blog Posts Grid (5.6.png) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredPosts.map((post, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectPost(post.slug)}
                  className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-[#0038ed]/30 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-slate-900 to-blue-950 p-5 text-white flex flex-col justify-between relative">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{post.readTime}</span>
                    </div>

                    <div className="text-center font-bold text-xs text-slate-200 line-clamp-2">
                      {post.title}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{post.date}</span>
                      <span>By {post.author}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0038ed]">
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right 4 Cols: Popular Posts Sidebar (5.6.png) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Popular Posts</span>
                </div>
                <span className="text-xs text-[#0038ed] font-semibold cursor-pointer hover:underline">
                  View All
                </span>
              </div>

              <div className="space-y-4">
                {popularPosts.map((pop, pi) => (
                  <div
                    key={pi}
                    onClick={() => onSelectPost(pop.slug)}
                    className="flex items-start gap-3.5 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {pi + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors line-clamp-2 leading-snug">
                        {pop.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{pop.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Still Need Help? Banner */}
      <StillNeedHelpBanner />
    </div>
  );
};
