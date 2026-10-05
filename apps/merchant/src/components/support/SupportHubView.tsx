import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  MessageSquare,
  BookOpen,
  Lightbulb,
  Truck,
  CreditCard,
  Package,
  Store,
  Settings,
  RotateCcw,
  Clock,
  Mail,
  Copy,
  Check,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { useSupportStore } from '../../stores/supportStore.js';

interface SupportHubViewProps {
  onNavigateToTopic?: (topicCategory: string) => void;
}

export const SupportHubView: React.FC<SupportHubViewProps> = ({ onNavigateToTopic }) => {
  const { setActiveView, helpTopics, setSelectedHelpTopicId } = useSupportStore();
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const topics = [
    {
      id: 'orders',
      title: 'Orders & Delivery',
      subtitle: 'Track orders, delivery settings, partner integration',
      icon: Truck,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      subtitle: 'Invoices, wallet, payouts, GST and billing issues',
      icon: CreditCard,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'products',
      title: 'Products & Inventory',
      subtitle: 'Add products, manage stock, catalog and variants',
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'store',
      title: 'Store Management',
      subtitle: 'Store profile, timings, pickup settings and store details',
      icon: Store,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'account',
      title: 'Account & Settings',
      subtitle: 'Profile, security, notifications and other settings',
      icon: Settings,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'returns',
      title: 'Returns & Refunds',
      subtitle: 'Return requests, refunds and related issues',
      icon: RotateCcw,
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header & Call Banner (15.0.png) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Support</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            We are here to help. Get support for orders, billing, technical issues and more.
          </p>
        </div>

        {/* Call Banner Box */}
        <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Talk to our support team</p>
              <p className="text-lg font-black text-blue-700 tracking-tight leading-tight">
                +91 98765 43210
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                Mon - Sat, 9:00 AM - 7:00 PM | Sun, 10:00 AM - 5:00 PM
              </p>
            </div>
          </div>

          <a
            href="tel:+919876543210"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Now</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Left Center Column (col-span-8) + Right Column (col-span-4) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="xl:col-span-8 space-y-6">
          {/* Action Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Raise a Support Request */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Raise a Support Request</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Create a ticket and get help with orders, billing, technical issues or any other query.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('create_ticket')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Create Support Ticket
              </button>
            </div>

            {/* Card 2: Help Center */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl border border-blue-200 bg-blue-50/50 text-blue-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Help Center</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Find guides, tutorials and FAQs to resolve common issues.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const first = helpTopics[0];
                  if (first) setSelectedHelpTopicId(first.id);
                  setActiveFaq(first?.id || null);
                }}
                className="w-full py-2.5 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold transition-colors"
              >
                Browse Help Center
              </button>
            </div>
          </div>

          {/* Popular Help Topics */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Popular Help Topics</h3>
                <p className="text-xs text-slate-500">Find quick answers to common questions.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {topics.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      if (onNavigateToTopic) onNavigateToTopic(t.title);
                      else setActiveView('create_ticket');
                    }}
                    className="p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/20 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-start gap-3.5 pr-2">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {t.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {t.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-4 space-y-5">
          {/* Support Hours Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Support Hours</h3>
                <p className="text-[11px] text-slate-500">Our support team is available to help you.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2 text-xs">
              <div>
                <p className="font-bold text-slate-800">Monday - Saturday</p>
                <p className="text-[11px] text-slate-600 font-semibold">9:00 AM - 7:00 PM</p>
              </div>
              <div className="pt-2 border-t border-slate-200/60">
                <p className="font-bold text-slate-800">Sunday</p>
                <p className="text-[11px] text-slate-600 font-semibold">10:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Contact Details</h3>
                <p className="text-[11px] text-slate-500">Reach us through the following channels.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {/* WhatsApp / Phone */}
              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">+91 98765 43210</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('+919876543210', 'phone')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors"
                  title="Copy Phone"
                >
                  {copiedPhone ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Email */}
              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">support@viztore.com</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('support@viztore.com', 'email')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors"
                  title="Copy Email"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Frequently Asked Questions</h3>
                <p className="text-[11px] text-slate-500">Find answers to common questions.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {helpTopics.map((topic) => {
                const isOpen = activeFaq === topic.id;
                return (
                  <div key={topic.id} className="py-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : topic.id)}
                      className="w-full flex items-center justify-between text-left group"
                    >
                      <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600 transition-colors pr-2">
                        {topic.title}
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 transition-transform ${
                          isOpen ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-2 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 leading-relaxed animate-in fade-in">
                        <p>{topic.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
