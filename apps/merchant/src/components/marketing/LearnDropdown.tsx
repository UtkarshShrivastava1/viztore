import React from 'react';
import {
  BookOpen,
  MapPin,
  Lightbulb,
  Play,
  FileText,
  HelpCircle,
  GraduationCap,
  Headphones,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';

interface LearnDropdownProps {
  onNavigate: (route: string) => void;
  onClose: () => void;
}

export const LearnDropdown: React.FC<LearnDropdownProps> = ({
  onNavigate,
  onClose,
}) => {
  const handleClick = (route: string) => {
    onNavigate(route);
    onClose();
  };

  return (
    <div className="w-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="grid grid-cols-2 gap-2 p-2">
        {/* Left Column */}
        <div className="space-y-1">
          {/* How It Works */}
          <button
            type="button"
            onClick={() => handleClick('/how-it-works')}
            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0 group-hover:bg-[#0038ed] group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                How It Works
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                Understand how {branding.appName} helps your business grow.
              </div>
            </div>
          </button>

          {/* Local Discovery */}
          <button
            type="button"
            onClick={() => handleClick('/how-it-works/localdiscovery')}
            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0 group-hover:bg-[#0038ed] group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                Local Discovery
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                Learn how customers find your store and products.
              </div>
            </div>
          </button>

          {/* Business Guides */}
          <button
            type="button"
            onClick={() => handleClick('/learn/guides')}
            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0 group-hover:bg-[#0038ed] group-hover:text-white transition-colors">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                Business Guides
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                Tips, best practices and growth strategies.
              </div>
            </div>
          </button>

          {/* Video Tutorials */}
          <button
            type="button"
            onClick={() => handleClick('/learn/tutorials')}
            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0 group-hover:bg-[#0038ed] group-hover:text-white transition-colors">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                Video Tutorials
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                Step-by-step videos to set up and use {branding.appName}.
              </div>
            </div>
          </button>
        </div>

        {/* Right Column */}
        <div className="space-y-1">
          {/* Help Centre */}
          <button
            type="button"
            onClick={() => handleClick('/help')}
            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0 group-hover:bg-[#0038ed] group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                Help Centre
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                Get answers to common questions.
              </div>
            </div>
          </button>

          {/* FAQs */}
          <button
            type="button"
            onClick={() => handleClick('/faqs')}
            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0 group-hover:bg-[#0038ed] group-hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                FAQs
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                Quick answers about features, pricing and more.
              </div>
            </div>
          </button>

          {/* Seller Blog */}
          <button
            type="button"
            onClick={() => handleClick('/blog')}
            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0 group-hover:bg-[#0038ed] group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                Seller Blog
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                Latest updates, retail insights and success stories.
              </div>
            </div>
          </button>

          {/* Contact Support */}
          <button
            type="button"
            onClick={() => handleClick('/help/contact')}
            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0 group-hover:bg-[#0038ed] group-hover:text-white transition-colors">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                Contact Support
              </div>
              <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                Get help from our team whenever you need.
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
