'use client';

import React from 'react';
import { Search, Package, RotateCcw, CreditCard, User, Store, ChevronRight, MessageSquare, PhoneCall, Mail, ShieldCheck } from 'lucide-react';
import { branding } from '@repo/shared-types';

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-white pb-24 pt-4">
      <div className="mx-auto max-w-3xl px-5">
        
        {/* Hero Section */}
        <div className="relative mb-6">
          <div className="pr-32">
            <h1 className="text-[22px] font-bold text-[#192168] mb-4">Help & Support</h1>
            <h2 className="text-sm font-bold text-gray-900 mb-1">We're here to help you!</h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">Find answers to your questions or contact our support team.</p>
          </div>
          {/* Mock Graphic Container */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-contain bg-no-repeat bg-right opacity-90"
               style={{ backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/3249/3249880.png')" }}>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-8 rounded-xl border border-gray-200 p-1.5 focus-within:border-[#1668F6] focus-within:ring-1 focus-within:ring-[#1668F6] transition-all shadow-sm">
          <div className="pl-3 text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search for help topics, e.g., order, refund, payment"
            className="flex-1 bg-transparent py-2.5 px-2 text-xs font-medium text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Quick Help */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-[#192168] mb-4">Quick Help</h3>
          <div className="flex justify-between items-start gap-2 overflow-x-auto scrollbar-hide">
            <QuickHelpIcon icon={<Package className="h-5 w-5 text-blue-500" />} label="Orders & Delivery" bg="bg-blue-50" border="border-blue-100" />
            <QuickHelpIcon icon={<RotateCcw className="h-5 w-5 text-amber-500" />} label="Returns & Refunds" bg="bg-amber-50" border="border-amber-100" />
            <QuickHelpIcon icon={<CreditCard className="h-5 w-5 text-emerald-500" />} label="Payments & Offers" bg="bg-emerald-50" border="border-emerald-100" />
            <QuickHelpIcon icon={<User className="h-5 w-5 text-purple-500" />} label="Account & Profile" bg="bg-purple-50" border="border-purple-100" />
            <QuickHelpIcon icon={<Store className="h-5 w-5 text-pink-500" />} label={`Selling on ${branding.appName}`} bg="bg-pink-50" border="border-pink-100" />
          </div>
        </div>

        {/* Top Help Topics */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#192168]">Top Help Topics</h3>
            <button className="text-[11px] font-bold text-[#1668F6]">View All</button>
          </div>
          <div className="flex flex-col">
            <HelpTopic text="How do I track my order?" />
            <HelpTopic text="How can I return or replace an item?" />
            <HelpTopic text="When will I get my refund?" />
            <HelpTopic text="How do I apply a coupon?" />
            <HelpTopic text="How do I update my address?" />
          </div>
        </div>

        {/* Contact Us */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-[#192168] mb-1">Contact Us</h3>
          <p className="text-[11px] text-gray-500 mb-4">Choose the best way to reach us</p>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5 md:mx-0 md:px-0">
            <ContactCard 
              icon={<MessageSquare className="h-5 w-5 text-blue-500" />}
              bg="bg-blue-50"
              title="Chat with Us"
              desc="Chat instantly with our support team"
              action="Available 9AM - 9PM"
              actionColor="text-emerald-600"
            />
            <ContactCard 
              icon={<PhoneCall className="h-5 w-5 text-emerald-500" />}
              bg="bg-emerald-50"
              title="Call Us"
              desc="Speak with our customer care executive"
              action="1800-123-4567"
              actionColor="text-emerald-600"
            />
            <ContactCard 
              icon={<Mail className="h-5 w-5 text-purple-500" />}
              bg="bg-purple-50"
              title="Email Us"
              desc="Drop us an email and we'll get back to you"
              action={branding.supportEmail}
              actionColor="text-[#1668F6]"
            />
          </div>
        </div>

        {/* Security Banner */}
        <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100 relative overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1668F6] shadow-sm z-10">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="z-10 relative pr-12">
            <h4 className="font-bold text-gray-900 text-sm">Safe & Secure</h4>
            <p className="mt-0.5 text-[10px] text-gray-600 leading-tight">Your information is safe with us. We never share your data with anyone.</p>
          </div>
          <ShieldCheck className="absolute -right-4 -bottom-4 h-24 w-24 text-blue-500/10 z-0" strokeWidth={1} />
        </div>

      </div>
    </main>
  );
}

type QuickHelpIconProps = {
  icon: React.ReactNode;
  label: string;
  bg: string;
  border: string;
};

function QuickHelpIcon({ icon, label, bg, border }: QuickHelpIconProps) {
  return (
    <div className="flex flex-col items-center w-[72px] shrink-0 gap-2 cursor-pointer group">
      <div className={`flex h-14 w-14 items-center justify-center rounded-full border ${border} ${bg} transition-transform group-hover:scale-105`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">
        {label.split(' ').map((word: string, i: number) => <React.Fragment key={i}>{word}<br/></React.Fragment>)}
      </span>
    </div>
  );
}

function HelpTopic({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-4 cursor-pointer hover:bg-gray-50 -mx-5 px-5 md:mx-0 md:px-2 rounded-lg transition-colors">
      <span className="text-sm font-medium text-gray-700">{text}</span>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </div>
  );
}

type ContactCardProps = {
  icon: React.ReactNode;
  bg: string;
  title: string;
  desc: string;
  action: string;
  actionColor: string;
};

function ContactCard({ icon, bg, title, desc, action, actionColor }: ContactCardProps) {
  return (
    <div className="flex w-[160px] shrink-0 flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm cursor-pointer hover:border-[#1668F6] transition-colors">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} mb-3`}>
        {icon}
      </div>
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        <ChevronRight className="h-3 w-3 text-gray-400" />
      </div>
      <p className="text-[10px] text-gray-500 leading-snug mb-3 flex-1">{desc}</p>
      <div className={`text-[10px] font-bold ${actionColor}`}>
        {action}
      </div>
    </div>
  );
}
