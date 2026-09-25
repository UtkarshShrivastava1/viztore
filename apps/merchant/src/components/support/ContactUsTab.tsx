import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { branding } from '../../lib/branding.js';

export const ContactUsTab: React.FC = () => {
  const [callerName, setCallerName] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('Payment / Settlement Issue');
  const [preferredTime, setPreferredTime] = useState('Immediately (Within 30 mins)');
  const [submitted, setSubmitted] = useState(false);

  const handleCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callerName || !phone) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Contact Merchant Support</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Connect directly with dedicated merchant operations officers via direct phone line, WhatsApp, or request an instant callback.
        </p>
      </div>

      {/* 3 Direct Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Phone Hotline */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Toll-Free Merchant Line</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Speak with a merchant specialist</p>
          </div>
          <div className="text-sm font-black text-blue-600">1800-123-4567</div>
          <div className="text-[10px] text-slate-400">Available Mon-Sat, 9 AM - 9 PM</div>
        </div>

        {/* WhatsApp Support */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">WhatsApp Desk</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Quick chat & screenshot resolution</p>
          </div>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="inline-block text-xs font-bold text-emerald-600 hover:underline"
          >
            +91 98765 43210 ↗
          </a>
          <div className="text-[10px] text-slate-400">Typical response under 15 mins</div>
        </div>

        {/* Email Support */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Email Assistance</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Formal escalations and tax compliance</p>
          </div>
          <a
            href={`mailto:${branding.supportEmail}`}
            className="inline-block text-xs font-bold text-purple-600 hover:underline truncate max-w-full"
          >
            {branding.supportEmail}
          </a>
          <div className="text-[10px] text-slate-400">Responds within 24 hours</div>
        </div>
      </div>

      {/* Request Callback Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs max-w-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Request an Instant Callback</span>
        </h3>
        <p className="text-xs text-slate-500">
          Enter your contact number and our account manager will call you back at your preferred convenience.
        </p>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block">Callback Request Received!</span>
              <span>Our support agent will call you at {phone} within the designated window.</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCallback} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Contact Person Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Call</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
                >
                  <option>Payment / Settlement Issue</option>
                  <option>Hardware & Barcode Scanner Setup</option>
                  <option>Catalog & Product Approval</option>
                  <option>GST Billing Inquiry</option>
                  <option>Other Operational Assistance</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Time Window</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
                >
                  <option>Immediately (Within 30 mins)</option>
                  <option>Today Afternoon (2:00 PM - 5:00 PM)</option>
                  <option>Tomorrow Morning (10:00 AM - 1:00 PM)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Submit Callback Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
