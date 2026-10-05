import React, { useState } from 'react';
import { X, Send, AlertCircle, Paperclip } from 'lucide-react';
import { useSupportStore, TicketPriority } from '../../stores/supportStore.js';

export const CreateTicketModal: React.FC = () => {
  const { isCreateTicketModalOpen, setIsCreateTicketModalOpen, addTicket } = useSupportStore();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Inventory');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [orderRef, setOrderRef] = useState('');
  const [message, setMessage] = useState('');

  if (!isCreateTicketModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    addTicket({
      subject: subject.trim(),
      category,
      priority,
      status: 'open',
      orderRef: orderRef.trim() || undefined,
      initialMessage: message.trim(),
    });

    setSubject('');
    setMessage('');
    setOrderRef('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Create New Support Ticket</h3>
            <p className="text-xs text-slate-500">Submit an inquiry or report an operational issue.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateTicketModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Issue Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Barcode scan failed during offline billing"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option>Inventory</option>
                <option>Payments & Payouts</option>
                <option>Store Settings</option>
                <option>Invoicing & Tax</option>
                <option>Product Catalog</option>
                <option>Orders & Delivery</option>
                <option>Account & Security</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High (Urgent)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Reference ID (Order / Bill / SKU)
            </label>
            <input
              type="text"
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value)}
              placeholder="e.g. ORD-9821 or INV-2024-0089"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide details of what happened, steps to reproduce, or exact error messages..."
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => alert('Attachments can be added after ticket creation or via direct drag & drop.')}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 font-semibold"
            >
              <Paperclip className="w-4 h-4" />
              <span>Attach File</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreateTicketModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
