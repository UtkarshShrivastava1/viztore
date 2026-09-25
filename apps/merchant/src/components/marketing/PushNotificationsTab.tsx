import React, { useState } from 'react';
import {
  Bell,
  Send,
  Users,
  Clock,
  CheckCircle2,
  Smartphone,
  Plus,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface PushMessage {
  id: string;
  title: string;
  body: string;
  target: string;
  sentAt: string;
  sentCount: number;
  openRate: string;
  status: 'Sent' | 'Scheduled';
}

export const PushNotificationsTab: React.FC = () => {
  const [messages, setMessages] = useState<PushMessage[]>([
    {
      id: 'PUSH-1',
      title: 'Flash Sale Alert! ⚡ 20% Off Everything',
      body: 'Grab your favorite summer apparel with extra 20% discount until midnight!',
      target: 'All App Users',
      sentAt: '15 May 2024, 06:00 PM',
      sentCount: 12450,
      openRate: '24.8%',
      status: 'Sent',
    },
    {
      id: 'PUSH-2',
      title: 'Weekend Special is LIVE! 🛍️',
      body: 'Discover new arrivals and get free delivery on all orders above ₹499.',
      target: 'Active Buyers (Last 30 Days)',
      sentAt: '11 May 2024, 10:00 AM',
      sentCount: 4850,
      openRate: '31.2%',
      status: 'Sent',
    },
    {
      id: 'PUSH-3',
      title: 'Items waiting in your cart 👀',
      body: 'Complete your checkout today and get flat ₹100 cashback to your wallet.',
      target: 'Abandoned Cart Users',
      sentAt: '18 May 2024, 07:00 PM',
      sentCount: 890,
      openRate: '-',
      status: 'Scheduled',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newTarget, setNewTarget] = useState('All App Users');

  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newBody) return;

    const push: PushMessage = {
      id: `PUSH-${messages.length + 1}`,
      title: newTitle,
      body: newBody,
      target: newTarget,
      sentAt: 'Just now',
      sentCount: newTarget === 'All App Users' ? 12450 : 3200,
      openRate: '0.0%',
      status: 'Sent',
    };

    setMessages([push, ...messages]);
    setNewTitle('');
    setNewBody('');
    alert('Push notification broadcast queued successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Push Notifications</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast rich real-time mobile push notifications to engage shoppers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Compose Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Compose Push Broadcast</span>
          </h3>

          <form onSubmit={handleSendPush} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
              <select
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
              >
                <option>All App Users (12,450 customers)</option>
                <option>Active Buyers (Last 30 Days) (4,850 customers)</option>
                <option>Abandoned Cart Users (890 customers)</option>
                <option>Inactive Users (60+ days) (2,100 customers)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Notification Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={60}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Flash Sale Alert! ⚡ 20% Off"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Notification Message Body <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                maxLength={140}
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="e.g. Shop our latest arrivals today and get free express delivery on all orders!"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 block text-right mt-0.5">{newBody.length}/140</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Broadcast Now</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Notification Live Simulation */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h4 className="text-xs font-bold text-slate-900">Lockscreen Preview</h4>
          <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-inner">
            <div className="text-[10px] text-slate-400 mb-2 flex items-center justify-between">
              <span>NOTIFICATION SIMULATOR</span>
              <span>NOW</span>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                V
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">
                  {newTitle || 'Summer Sale Alert! ⚡ 20% Off Everything'}
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                  {newBody || 'Grab your favorite summer apparel with extra 20% discount until midnight!'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900">
            <span className="font-bold">Delivery Guarantee:</span> Push notifications are delivered within 60 seconds with active deeplinking to designated offers.
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Broadcast History</h3>
          <span className="text-xs text-slate-400">{messages.length} broadcasts sent</span>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
              <th className="py-3 px-4">Title & Message</th>
              <th className="py-3 px-3">Target</th>
              <th className="py-3 px-3">Sent Time</th>
              <th className="py-3 px-3">Recipients</th>
              <th className="py-3 px-3">Open Rate</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {messages.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{m.title}</div>
                  <div className="text-[11px] text-slate-500 truncate max-w-sm">{m.body}</div>
                </td>
                <td className="py-3 px-3 text-slate-600">{m.target}</td>
                <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{m.sentAt}</td>
                <td className="py-3 px-3 font-bold text-slate-900">{m.sentCount.toLocaleString()}</td>
                <td className="py-3 px-3 font-bold text-emerald-600">{m.openRate}</td>
                <td className="py-3 px-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      m.status === 'Sent'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
