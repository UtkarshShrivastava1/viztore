import React, { useState } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Paperclip,
  User,
  Headphones,
  RotateCcw,
} from 'lucide-react';
import { useSupportStore, TicketStatus, TicketPriority } from '../../stores/supportStore.js';

export const TicketDetailsDrawer: React.FC = () => {
  const {
    tickets,
    selectedTicketId,
    setSelectedTicketId,
    addTicketMessage,
    updateTicketStatus,
  } = useSupportStore();

  const [replyText, setReplyText] = useState('');

  if (!selectedTicketId) return null;

  const ticket = tickets.find((t) => t.id === selectedTicketId);
  if (!ticket) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addTicketMessage(ticket.id, replyText.trim(), 'merchant');
    setReplyText('');
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>In Progress</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Resolved</span>
          </span>
        );
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Open</span>
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Closed</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setSelectedTicketId(null)}
      />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-xl bg-white text-slate-800 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250 border-l border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black text-blue-600">{ticket.id}</span>
              {getStatusBadge(ticket.status)}
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {ticket.priority} priority
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm mt-1">{ticket.subject}</h3>
          </div>

          <button
            type="button"
            onClick={() => setSelectedTicketId(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket Metadata Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div>
            <span className="text-slate-400">Category:</span>{' '}
            <span className="font-semibold text-slate-700">{ticket.category}</span>
          </div>
          <div>
            <span className="text-slate-400">Created:</span>{' '}
            <span className="font-semibold text-slate-700">{ticket.createdAt}</span>
          </div>
          {ticket.orderRef && (
            <div>
              <span className="text-slate-400">Ref:</span>{' '}
              <span className="font-mono font-semibold text-slate-700">{ticket.orderRef}</span>
            </div>
          )}
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {ticket.messages.map((msg) => {
            const isMerchant = msg.sender === 'merchant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  isMerchant ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isMerchant
                      ? 'bg-blue-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isMerchant ? <User className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
                </div>

                <div>
                  <div
                    className={`flex items-center gap-2 text-[10px] text-slate-400 mb-1 ${
                      isMerchant ? 'justify-end' : ''
                    }`}
                  >
                    <span className="font-bold text-slate-600">{msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isMerchant
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions & Reply Box */}
        <div className="p-4 border-t border-slate-200 bg-white space-y-3">
          {/* Quick status actions */}
          <div className="flex items-center justify-between text-xs pb-1">
            <span className="text-slate-500 font-medium">Quick Status Action:</span>
            {ticket.status !== 'resolved' ? (
              <button
                type="button"
                onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-800"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Resolved</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reopen Ticket</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSendReply} className="space-y-2">
            <div className="relative">
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to support team..."
                className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => alert('Attachments supported: PNG, JPG, PDF up to 5MB')}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!replyText.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Reply</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
