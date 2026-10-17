import React from 'react';
import {
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
  CheckCircle2,
  ArrowRight,
  Store,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { MARKETING_DATA, GuideArticle } from '../../data/marketingData.js';

interface GuideDetailPageProps {
  slug: string;
  onNavigate: (route: string) => void;
  onSelectGuide: (slug: string) => void;
  onStartSelling: () => void;
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({
  slug,
  onNavigate,
  onSelectGuide,
  onStartSelling,
}) => {
  const guide: GuideArticle =
    MARKETING_DATA.guides.find((g) => g.slug === slug) || (MARKETING_DATA.guides[0] as GuideArticle);

  const relatedGuides = MARKETING_DATA.guides.filter((g) => g.slug !== guide.slug);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: guide.title,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Header & Breadcrumbs (Mockup 5.2a.png) */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-[#f0f6ff] to-white border-b border-slate-100">
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
            <button
              onClick={() => onNavigate('/learn/guides')}
              className="hover:text-[#0038ed] transition-colors cursor-pointer"
            >
              Business Guides
            </button>
            <span>&gt;</span>
            <span className="text-[#0038ed] font-bold line-clamp-1">{guide.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0038ed] font-bold text-xs uppercase tracking-wider">
                {guide.category}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {guide.title}
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                {guide.summary}
              </p>

              {/* Meta bar */}
              <div className="flex items-center gap-5 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{guide.date}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{guide.readTime}</span>
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

            {/* Laptop Preview Frame */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="w-full bg-slate-900 rounded-3xl p-4 shadow-xl border border-slate-800 text-white">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                  <span className="font-bold text-blue-400">Store Setup Step 1 of 4</span>
                  <span className="text-emerald-400">● Live Preview</span>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl my-2 text-xs">
                  <div className="font-bold text-white mb-1">Trendy Fashions Hub</div>
                  <div className="text-[11px] text-slate-400">Category: Women's Clothing</div>
                  <div className="text-[11px] text-slate-400">Civic Centre, Bhilai, 490006</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content & Right-hand Rail (5.2a.png) */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 8 Cols: Article Body */}
            <div className="lg:col-span-8 space-y-10">
              {/* What You'll Learn Box */}
              <div className="p-6 sm:p-7 bg-blue-50/70 rounded-3xl border border-blue-100/90 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0038ed] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">What You'll Learn</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-[13px] text-slate-700">
                  {guide.whatYouLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-100 text-[#0038ed] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Numbered Step-by-Step Guide */}
              <div className="space-y-10">
                {guide.steps.map((step) => (
                  <div key={step.number} className="space-y-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-[#0038ed] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {step.number}
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                          {step.title}
                        </h2>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {step.details && (
                      <ul className="ml-12 space-y-2 text-xs sm:text-sm text-slate-600">
                        {step.details.map((detail, di) => (
                          <li key={di} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0038ed] shrink-0 mt-2" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Step Visual Showcase Mockup */}
                    {step.number === 1 && (
                      <div className="ml-12 p-6 bg-slate-50 rounded-2xl border border-slate-200/90 max-w-lg space-y-3">
                        <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                          <Store className="w-4 h-4 text-[#0038ed]" />
                          <span>Sign Up as a Seller</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            disabled
                            value="+91 91091 07251"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
                          />
                          <button
                            type="button"
                            className="px-4 py-2 bg-[#0038ed] text-white text-xs font-bold rounded-lg shrink-0"
                          >
                            Send OTP
                          </button>
                        </div>
                      </div>
                    )}

                    {step.number === 4 && (
                      <div className="ml-12 p-6 bg-emerald-50/80 rounded-2xl border border-emerald-200 max-w-lg flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-emerald-950">
                              Your Store is Live!
                            </div>
                            <div className="text-xs text-emerald-700">
                              Now visible to nearby shoppers in your city.
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={onStartSelling}
                          className="px-4 py-2 rounded-xl bg-[#0038ed] text-white text-xs font-bold shrink-0 hover:bg-[#002fcf] transition-colors cursor-pointer"
                        >
                          Go to Dashboard
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 Cols: Related Articles & Support Box */}
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
                    placeholder="Search all guides..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0038ed]"
                  />
                </div>
              </div>

              {/* Related Articles */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Related Articles</h4>
                <div className="space-y-3">
                  {relatedGuides.map((rel, ri) => (
                    <div
                      key={ri}
                      onClick={() => onSelectGuide(rel.slug)}
                      className="p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors line-clamp-1">
                          {rel.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{rel.readTime}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0038ed] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Still Need Help? Support Card (5.2a.png) */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-[#edf4ff] rounded-3xl border border-blue-200/80 shadow-2xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0038ed] text-white flex items-center justify-center shadow-xs">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Still Need Help?</h4>
                    <p className="text-[11px] text-slate-500">Our regional team is here anytime.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('/help/contact')}
                  className="w-full py-2.5 rounded-xl bg-[#0038ed] hover:bg-[#002fcf] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Contact Support</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="space-y-3 pt-3 border-t border-blue-200/60 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-[#0038ed] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">+91 91091 07251</div>
                      <div className="text-[11px] text-slate-500">Mon - Sat, 10:00 AM - 6:00 PM</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#0038ed] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">{branding.supportEmail}</div>
                      <div className="text-[11px] text-slate-500">We reply within 24 hours.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
