import React, { useState } from 'react';
import {
  X,
  Search,
  ChevronRight,
  ChevronDown,
  Headphones,
} from 'lucide-react';
import { branding } from '@repo/shared-types/branding.config';

interface HelpSupportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSupport?: () => void;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    id: '1',
    question: 'How do I create a new order?',
    answer: 'You can create a manual order by clicking "Create Order" from Quick Actions or from the Orders Management screen.',
  },
  {
    id: '2',
    question: 'How can I manage my products?',
    answer: 'Navigate to "Products / Catalog" from the sidebar. You can add individual SKUs or use "Bulk Upload" to import multiple products using a CSV sheet.',
  },
  {
    id: '3',
    question: 'How do I update stock?',
    answer: 'Go to "Inventory" or click "Adjust Stock" on your dashboard to modify real-time stock levels for any product variant.',
  },
  {
    id: '4',
    question: 'How do I generate an invoice?',
    answer: 'Click "Create New Bill" from the dashboard or "Billing & Invoicing" to generate Tax Invoices, Quotations, or Credit Notes with GST calculations.',
  },
  {
    id: '5',
    question: 'How do payouts work?',
    answer: 'Payouts are calculated from completed orders and settled directly to your registered bank account every Tuesday.',
  },
  {
    id: '6',
    question: 'How can I track my orders?',
    answer: 'Click "Orders" in the sidebar to see real-time statuses (Pending, Confirmed, Packed, Shipped, Delivered) and verify delivery OTPs.',
  },
  {
    id: '7',
    question: 'What is the Returns & Refund policy?',
    answer: 'Customers can initiate returns within 7 days of delivery. You can review and approve return requests under "Returns & Refunds".',
  },
  {
    id: '8',
    question: 'How do I add staff members?',
    answer: 'Open "Settings" > "Staff & Permissions" to invite team members with restricted role-based access.',
  },
  {
    id: '9',
    question: `How can I contact ${branding.appName} support?`,
    answer: `Reach our merchant support team 24/7 via phone at 1800-123-4567 or email at ${branding.supportEmail}.`,
  },
];

export const HelpSupportDrawer: React.FC<HelpSupportDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToSupport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredFaqs = faqItems.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="relative w-full max-w-[420px] bg-white text-slate-800 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Help & Support</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Greeting */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Hi! How can we help you?</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Find quick answers to common questions below.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help topics..."
              className="w-full pl-9 pr-9 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 opacity-70" />
          </div>

          {/* FAQ Accordion List - Individual Rounded Cards */}
          <div className="space-y-2">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="w-full px-3.5 py-3 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-semibold text-slate-800 leading-snug">{faq.question}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-3.5 pb-3 text-xs text-slate-600 bg-slate-50/40 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still need help? Card */}
          <div className="pt-4 pb-2 text-center space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900">Still need help?</h4>
            <p className="text-[11px] text-slate-500">Our support team is here for you.</p>

            <button
              type="button"
              onClick={() => {
                if (onNavigateToSupport) {
                  onClose();
                  onNavigateToSupport();
                } else {
                  window.open(`mailto:${branding.supportEmail}?subject=Merchant%20Support%20Request`, '_blank');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white text-blue-600 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <Headphones className="w-4 h-4 text-blue-600" />
              <span>Contact Support</span>
            </button>

            <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
              <p>Call us: <span className="font-semibold text-slate-700">1800-123-4567</span></p>
              <p>Email: <span className="font-semibold text-blue-600 hover:underline cursor-pointer">{branding.supportEmail}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
