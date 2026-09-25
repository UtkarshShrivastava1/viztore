import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const EmailSmsTab: React.FC = () => {
  const [channel, setChannel] = useState<'sms' | 'email'>('sms');
  const [template, setTemplate] = useState('Festive Offer 20% Off');
  const [recipientGroup, setRecipientGroup] = useState('All Customers');

  const campaigns = [
    { id: 1, type: 'SMS', title: 'Weekend Flash 15% OFF', sentAt: '12 May 2024', recipients: 4200, delivered: '99.4%', clicks: 310 },
    { id: 2, type: 'Email', title: 'New Arrivals Summer Catalogue', sentAt: '08 May 2024', recipients: 6800, delivered: '98.8%', clicks: 820 },
    { id: 3, type: 'SMS', title: 'Order Pickup Reminder', sentAt: '02 May 2024', recipients: 150, delivered: '100%', clicks: 112 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Email & SMS Marketing</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Reach customers directly via transactional SMS and branded HTML marketing newsletters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex gap-2 border-b border-slate-100 pb-3">
            <button
              type="button"
              onClick={() => setChannel('sms')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                channel === 'sms' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>SMS Broadcast</span>
            </button>
            <button
              type="button"
              onClick={() => setChannel('email')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                channel === 'email' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Newsletter</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Customer Segment</label>
              <select
                value={recipientGroup}
                onChange={(e) => setRecipientGroup(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
              >
                <option>All Customers (12,450)</option>
                <option>High Value VIP Customers (1,240)</option>
                <option>Inactive Customers (30+ Days) (3,800)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Preset Template</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
              >
                <option>Festive Offer 20% Off</option>
                <option>Weekend Clearance Sale</option>
                <option>We Miss You! ₹100 Coupon</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Message Content</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                defaultValue={
                  channel === 'sms'
                    ? 'Dear Customer, Enjoy 20% OFF storewide this weekend! Use code SUMMER20 at checkout. Free home delivery available. Shop now: https://store.local/summer'
                    : 'Exclusive summer collection is now available at our store! Browse 500+ fresh styles with discounts up to 30%. Visit our storefront now.'
                }
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => alert(`Broadcast queued for ${recipientGroup}!`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Send {channel.toUpperCase()} Broadcast</span>
              </button>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase">Messaging Credits</h4>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Available SMS Credits</span>
              <span className="text-xl font-black text-slate-900">45,200</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Available Email Credits</span>
              <span className="text-xl font-black text-slate-900">92,400</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Previous Dispatches</h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
              <th className="py-3 px-4">Channel</th>
              <th className="py-3 px-3">Campaign Subject</th>
              <th className="py-3 px-3">Dispatched Date</th>
              <th className="py-3 px-3">Recipients</th>
              <th className="py-3 px-3">Delivery Rate</th>
              <th className="py-3 px-3">Clicks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-blue-600">{c.type}</td>
                <td className="py-3 px-3 font-semibold text-slate-900">{c.title}</td>
                <td className="py-3 px-3 text-slate-500">{c.sentAt}</td>
                <td className="py-3 px-3 font-bold text-slate-800">{c.recipients.toLocaleString()}</td>
                <td className="py-3 px-3 font-bold text-emerald-600">{c.delivered}</td>
                <td className="py-3 px-3 font-bold text-slate-800">{c.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
