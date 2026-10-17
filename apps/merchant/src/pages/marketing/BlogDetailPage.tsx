import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  FileText,
  Check,
  Search,
  ChevronRight,
  Phone,
  Mail,
  Headphones,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { MARKETING_DATA, BlogPost } from '../../data/marketingData.js';

interface BlogDetailPageProps {
  slug: string;
  onNavigate: (route: string) => void;
  onSelectPost: (slug: string) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({
  slug,
  onNavigate,
  onSelectPost,
}) => {
  const post: BlogPost =
    MARKETING_DATA.blogPosts.find((p) => p.slug === slug) || (MARKETING_DATA.blogPosts[0] as BlogPost);

  const relatedPosts = MARKETING_DATA.blogPosts.filter((p) => p.slug !== post.slug);

  const categories = [
    { name: 'Getting Started', count: 5 },
    { name: 'Product Management', count: 4 },
    { name: 'Orders & Delivery', count: 4 },
    { name: 'Billing & GST', count: 3 },
    { name: 'Marketing & Growth', count: 3 },
    { name: 'Success Stories', count: 3 },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Header (Mockup 5.6a.png) */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-[#f0f6ff] to-white border-b border-slate-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => onNavigate('/blog')}
              className="text-xs font-bold text-[#0038ed] flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Seller Blog</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button
                onClick={() => onNavigate('/')}
                className="hover:text-[#0038ed] transition-colors cursor-pointer"
              >
                Home
              </button>
              <span>&gt;</span>
              <button
                onClick={() => onNavigate('/blog')}
                className="hover:text-[#0038ed] transition-colors cursor-pointer"
              >
                Seller Blog
              </button>
              <span>&gt;</span>
              <span className="text-[#0038ed] font-bold line-clamp-1">{post.title}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0038ed] font-bold text-xs uppercase tracking-wider">
                {post.category}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {post.title}
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                {post.summary}
              </p>

              <div className="flex items-center gap-5 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{post.date}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{post.readTime}</span>
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-[#0038ed] font-bold hover:underline cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Laptop Preview Mockup */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="w-full bg-slate-900 rounded-3xl p-4 shadow-xl border border-slate-800 text-white">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                  <span className="font-bold text-blue-400">Products Catalog</span>
                  <span className="text-emerald-400 font-semibold">+ Add Product</span>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl my-2 text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Men's T-Shirt</span>
                    <span className="text-emerald-400 font-bold">₹499 (Active)</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Women's Kurti</span>
                    <span className="text-emerald-400 font-bold">₹699 (Active)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Body Content & Right Rail */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 8 Cols */}
            <div className="lg:col-span-8 space-y-8">
              {/* What You'll Learn Box */}
              <div className="p-6 sm:p-7 bg-blue-50/70 rounded-3xl border border-blue-100/90 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0038ed] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">What You'll Learn</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-[13px] text-slate-700">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>How to add a new product to your store</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>Update product stock and details</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>Add product images, prices and descriptions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>Tips to keep your catalog organized</span>
                  </div>
                </div>
              </div>

              {/* Formatted Article Content */}
              <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  1. Go to Products Section
                </h2>
                <p>
                  Log in to your {branding.appName} seller account. From the left navigation menu,
                  click on Products. Here you can view all your existing catalog items and add new
                  ones.
                </p>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  2. Add a New Product
                </h2>
                <p>
                  Click on the '+ Add Product' button at the top right. Fill in the product name,
                  category, price, stock quantity, and description. You can upload multiple product
                  photos showing different angles.
                </p>

                {post.content.map((paragraph, pi) => (
                  <p key={pi}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Right 4 Cols: Related Posts & Categories */}
            <div className="lg:col-span-4 space-y-6">
              {/* Search Articles */}
              <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Search Articles
                </h4>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search all posts..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0038ed]"
                  />
                </div>
              </div>

              {/* Related Posts */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Related Posts</h4>
                <div className="space-y-3">
                  {relatedPosts.map((rel, ri) => (
                    <div
                      key={ri}
                      onClick={() => onSelectPost(rel.slug)}
                      className="p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors line-clamp-1">
                          {rel.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{rel.readTime}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0038ed] shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Categories</h4>
                <div className="space-y-1 text-xs">
                  {categories.map((c, ci) => (
                    <div
                      key={ci}
                      onClick={() => onNavigate('/blog')}
                      className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 cursor-pointer text-slate-700 hover:text-[#0038ed]"
                    >
                      <span>{c.name}</span>
                      <span className="text-slate-400 font-semibold">{c.count} posts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Still Need Help? Banner */}
      <section className="py-12 bg-[#edf4ff] border-t border-blue-100">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                <Headphones className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Still Need Help?</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Our regional team is here to support you. Get in touch with us anytime.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Call Us</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">+91 91091 07251</div>
                  <div className="text-[10px] text-slate-500">Mon - Sat, 10:00 AM - 6:00 PM</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Email Support</div>
                  <div className="text-xs sm:text-sm font-bold text-[#0038ed]">{branding.supportEmail}</div>
                  <div className="text-[10px] text-slate-500">We reply within 24 hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
