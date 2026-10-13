import React, { useState } from 'react';
import {
  Search,
  Plus,
  Ticket,
  CheckCircle2,
  Clock,
  XCircle,
  Headphones,
  ChevronRight,
  ExternalLink,
  FileText,
  AlertCircle,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { useSupportStore, TicketStatus, TicketPriority } from '../../stores/supportStore.js';

export const SupportOverviewTab: React.FC = () => {
  const {
    tickets,
    helpTopics,
    setActiveTab,
    setSelectedTicketId,
    setIsCreateTicketModalOpen,
    setStatusFilter,
  } = useSupportStore();

  const [searchArticle, setSearchArticle] = useState('');

  const totalTickets = tickets.length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const openCount = tickets.filter((t) => t.status === 'open').length;

  const recentTickets = tickets.slice(0, 5);

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

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Row: Need Help & Raise a Ticket Cards (16.0.png) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Need Help Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Need Help?</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Search our help center for guides, FAQs and step-by-step instructions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchArticle}
                onChange={(e) => setSearchArticle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setActiveTab('help_center');
                }}
                placeholder="Search for help articles..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('help_center')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shrink-0 shadow-2xs"
            >
              <span>Go to Help Center</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Raise a Ticket Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Raise a Ticket</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Can't find what you're looking for? Our dedicated merchant support desk will get back to you.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsCreateTicketModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Your Support Overview 4 Mini KPI Cards (16.0.png) */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Your Support Overview</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total Tickets */}
          <div
            onClick={() => {
              setStatusFilter('all');
              setActiveTab('tickets');
            }}
            className="bg-blue-50/40 hover:bg-blue-50/70 cursor-pointer transition-all p-4 rounded-2xl border border-blue-100 flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="text-2xl font-black text-slate-900">{totalTickets}</div>
              <div className="text-xs font-semibold text-slate-600">Total Tickets</div>
              <div className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5 mt-1">
                <span>View all tickets</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
          </div>

          {/* Resolved */}
          <div
            onClick={() => {
              setStatusFilter('resolved');
              setActiveTab('tickets');
            }}
            className="bg-emerald-50/40 hover:bg-emerald-50/70 cursor-pointer transition-all p-4 rounded-2xl border border-emerald-100 flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="text-2xl font-black text-slate-900">{resolvedCount}</div>
              <div className="text-xs font-semibold text-slate-600">Resolved</div>
              <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5 mt-1">
                <span>View resolved</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* In Progress */}
          <div
            onClick={() => {
              setStatusFilter('in_progress');
              setActiveTab('tickets');
            }}
            className="bg-amber-50/40 hover:bg-amber-50/70 cursor-pointer transition-all p-4 rounded-2xl border border-amber-100 flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="text-2xl font-black text-slate-900">{inProgressCount}</div>
              <div className="text-xs font-semibold text-slate-600">In Progress</div>
              <div className="text-[10px] font-bold text-amber-700 flex items-center gap-0.5 mt-1">
                <span>View in progress</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Open */}
          <div
            onClick={() => {
              setStatusFilter('open');
              setActiveTab('tickets');
            }}
            className="bg-rose-50/40 hover:bg-rose-50/70 cursor-pointer transition-all p-4 rounded-2xl border border-rose-100 flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="text-2xl font-black text-slate-900">{openCount}</div>
              <div className="text-xs font-semibold text-slate-600">Open</div>
              <div className="text-[10px] font-bold text-rose-700 flex items-center gap-0.5 mt-1">
                <span>View open</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-100/70 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Recent Tickets (Left) + Support Availability & Help Topics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Tickets (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Recent Tickets</h3>
            <button
              type="button"
              onClick={() => setActiveTab('tickets')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All Tickets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Priority</th>
                  <th className="py-3 px-3">Last Updated</th>
                  <th className="py-3 px-2 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => {
                      setSelectedTicketId(t.id);
                      setActiveTab('tickets');
                    }}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {t.id}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {t.subject}
                      </div>
                      <div className="text-[10px] text-slate-400">{t.category}</div>
                    </td>
                    <td className="py-3.5 px-2 whitespace-nowrap">
                      {getStatusBadge(t.status)}
                    </td>
                    <td className="py-3.5 px-2 whitespace-nowrap">
                      {getPriorityBadge(t.priority)}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                      {t.lastUpdated}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Support Availability & Popular Help Topics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Support Availability Card (16.0.png) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">We're here for you!</h4>
                <p className="text-xs text-slate-500">Our support team is available</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="font-medium">Monday - Saturday</span>
                <span className="font-bold text-slate-900">9:00 AM - 9:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Sunday</span>
                <span className="font-bold text-slate-900">10:00 AM - 6:00 PM</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="font-medium">Average Response Time</span>
                <span className="font-bold text-emerald-600">Within 2 - 4 hours</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>For urgent issues, please raise a ticket and our team will prioritize it.</span>
            </div>
          </div>

          {/* Popular Help Topics Card (16.0.png) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">Popular Help Topics</h4>
              <button
                type="button"
                onClick={() => setActiveTab('help_center')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1">
              {helpTopics.slice(0, 5).map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setActiveTab('help_center')}
                  className="w-full py-2.5 px-2 flex items-center justify-between text-left hover:bg-slate-50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600 truncate">
                      {topic.title}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Help Banner (16.0.png) */}
      <div className="bg-blue-50/80 rounded-2xl border border-blue-200/80 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Still need help?</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Our support team is ready to assist you with any questions or issues.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className="px-4 py-2 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-600 font-bold text-xs shadow-2xs"
          >
            Contact Us
          </button>
          <button
            type="button"
            onClick={() => setIsCreateTicketModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
          >
            + Create New Ticket
          </button>
        </div>
      </div>
    </div>
  );
};
