import React from 'react';
import {
  Phone,
  Mail,
  HelpCircle,
  BookOpen,
  MapPin,
  Lightbulb,
  Play,
  Clock,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { branding } from '../../lib/branding.js';
import { FaqAccordion, FaqItem } from '../../components/marketing/FaqAccordion.js';

interface ContactSupportPageProps {
  onNavigate: (route: string) => void;
}

export const ContactSupportPage: React.FC<ContactSupportPageProps> = ({ onNavigate }) => {
  const commonQuestions: FaqItem[] = [
    {
      question: 'What information should I share when contacting support?',
      answer:
        'Please have your registered mobile number, registered store name, and the specific Order ID (#ORD-xxxxx) or Invoice Number (INV-xxxx) ready so our team can immediately look up your account history.',
    },
    {
      question: 'What are your support timings?',
      answer:
        'Our regional merchant support desk operates Monday through Saturday, from 10:00 AM to 6:00 PM IST (excluding national holidays). Email support queries received outside these hours are queued and addressed first thing next morning.',
    },
    {
      question: 'How long does it take to get a response?',
      answer:
        'Phone support provides immediate live assistance during working hours. Email tickets sent to our support desk are typically responded to within 4 to 24 hours.',
    },
    {
      question: 'Can I get help with store setup and onboarding?',
      answer:
        'Absolutely! Our regional onboarding field agents in Durg, Bhilai, Raipur and beyond can assist you with bulk product ingestion, barcode scanning, store banner creation, and counter QR setup.',
    },
  ];

  return (
    <div className="w-full bg-white select-none">
      {/* 1. Header (Mockup 5.7.png) */}
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
              onClick={() => onNavigate('/help')}
              className="hover:text-[#0038ed] transition-colors cursor-pointer"
            >
              Help Centre
            </button>
            <span>&gt;</span>
            <span className="text-[#0038ed] font-bold">Contact Support</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0038ed] font-bold text-xs uppercase tracking-wider">
              HELP CENTRE
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Contact <span className="text-[#0038ed]">Support</span>
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              We're here to help you with any questions or issues related to your {branding.appName} store.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Content & Right-hand Rail (5.7.png) */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 8 Cols: Contact Cards & Common Questions */}
            <div className="lg:col-span-8 space-y-10">
              {/* Get in Touch Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Get in Touch with Our Support Team
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Choose the best way to reach us. Our team will be happy to assist you.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Call Support Card */}
                  <div className="p-6 sm:p-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4 hover:border-blue-300 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0038ed] flex items-center justify-center">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Call Us</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Speak directly with our support team for immediate assistance.
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50/70 rounded-2xl text-center">
                      <a
                        href="tel:+919109107251"
                        className="text-base font-extrabold text-[#0038ed] hover:underline"
                      >
                        +91 91091 07251
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Mon - Sat, 10:00 AM - 6:00 PM (Except public holidays)</span>
                    </div>
                  </div>

                  {/* Email Support Card */}
                  <div className="p-6 sm:p-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4 hover:border-rose-300 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Email Support</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Send us an email and our team will get back to you within 24 hours.
                      </p>
                    </div>

                    <div className="p-3 bg-rose-50/70 rounded-2xl text-center">
                      <a
                        href={`mailto:${branding.supportEmail}`}
                        className="text-xs sm:text-sm font-bold text-rose-700 hover:underline break-all"
                      >
                        {branding.supportEmail}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>We usually reply within 24 hours (Mon - Sat)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Common Support Questions (5.7.png) */}
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Common Support Questions
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Quick answers to frequently asked support related questions.
                  </p>
                </div>

                <FaqAccordion items={commonQuestions} showNumbers={true} defaultOpenIndex={0} />
              </div>
            </div>

            {/* Right 4 Cols: Other Help Resources (5.7.png) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
              <h4 className="text-base font-bold text-slate-900">Other Help Resources</h4>

              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => onNavigate('/faqs')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                        Frequently Asked Questions
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Find quick answers to common questions.
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0038ed] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/blog')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                        Seller Blog
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Learn tips, ideas and stories to grow.
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0038ed] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/how-it-works')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                        How It Works
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Understand platform tools and fulfillment.
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0038ed] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/how-it-works/localdiscovery')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                        Local Discovery
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Learn how nearby customers discover you.
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0038ed] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/learn/guides')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                        Business Guides
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Tips, best practices and growth strategies.
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0038ed] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/learn/tutorials')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0038ed] flex items-center justify-center shrink-0">
                      <Play className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-[#0038ed] transition-colors">
                        Video Tutorials
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Step-by-step videos to set up your store.
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0038ed] shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
