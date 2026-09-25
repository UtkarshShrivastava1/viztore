import React from 'react';
import {
  Search,
  Plus,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { useSupportStore, TicketStatus, TicketPriority } from '../../stores/supportStore.js';

export const SupportTicketsTab: React.FC = () => {
  const {
    tickets,
    searchQuery,
    statusFilter,
    priorityFilter,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    setSelectedTicketId,
    setIsCreateTicketModalOpen,
  } = useSupportStore();

  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">My Support Tickets</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track inquiries, system requests, and resolution statuses with platform specialists.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateTicketModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Ticket</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by ID, subject or category..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            {['all', 'open', 'in_progress', 'resolved'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  statusFilter === st ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Priority Select */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-3">Subject & Category</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Created Date</th>
                <th className="py-3 px-3">Last Activity</th>
                <th className="py-3 px-3">Messages</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {t.id}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {t.subject}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>Category: {t.category}</span>
                      {t.orderRef && (
                        <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                          Ref: {t.orderRef}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {getStatusBadge(t.status)}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {getPriorityBadge(t.priority)}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                    {t.createdAt}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                    {t.lastUpdated}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      <MessageSquare className="w-3 h-3 text-slate-400" />
                      <span>{t.messages.length}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTicketId(t.id);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-800"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
