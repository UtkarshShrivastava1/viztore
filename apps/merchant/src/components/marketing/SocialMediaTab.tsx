import React, { useState } from 'react';
import { Share2, Instagram, Facebook, MessageCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { branding } from '../../lib/branding.js';

export const SocialMediaTab: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState(false);
  const storeUrl = `https://${branding.domain}/store/fashion-hub`;

  const copyStoreLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Social Media & Omnichannel</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Connect your catalog directly to Instagram Shopping, WhatsApp Catalog, and Facebook Shop.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Your Shareable Storefront Link</h3>
        <div className="flex items-center gap-2 max-w-xl">
          <input
            type="text"
            readOnly
            value={storeUrl}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700"
          />
          <button
            type="button"
            onClick={copyStoreLink}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Instagram */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
            <Instagram className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Instagram Shop</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Sync your products directly to Instagram tags and Reels.</p>
          </div>
          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            Connected (184 Items)
          </span>
        </div>

        {/* WhatsApp */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">WhatsApp Catalog</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Enable instant ordering via WhatsApp Business chat.</p>
          </div>
          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            Active
          </span>
        </div>

        {/* Facebook */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Facebook className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Facebook Shop</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Reach shoppers across Facebook marketplace feeds.</p>
          </div>
          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Disconnected
          </span>
        </div>
      </div>
    </div>
  );
};
