import React, { useState, useMemo } from 'react';
import {
  FileText,
  BadgePercent,
  Calendar,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  ArrowUpDown,
  RotateCcw,
  CheckSquare,
  Square,
} from 'lucide-react';
import { useBillingStore, IDebitNote, NoteStatus } from '../../stores/billingStore.js';

interface DebitNotesTableViewProps {
  onCreateDebitNoteClick: () => void;
}

export const DebitNotesTableView: React.FC<DebitNotesTableViewProps> = ({
  onCreateDebitNoteClick,
}) => {
  const {
    debitNotes,
    debitNoteSearchQuery,
    setDebitNoteSearchQuery,
    debitNoteStatusFilter,
    setDebitNoteStatusFilter,
    debitNoteDateRange,
    setDebitNoteDateRange,
    debitNoteCurrentTab,
    setDebitNoteCurrentTab,
    clearDebitNoteFilters,
    updateDebitNoteStatus,
  } = useBillingStore();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // 5 KPI Cards matching 5.8.png
  const kpiCards = [
    {
      id: 'total-debit-notes',
      title: 'Total Debit Notes',
      value: '38',
      subtitle: 'All time',
      icon: FileText,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      id: 'total-debit-amount',
      title: 'Total Debit Note Amount',
      value: '₹ 2,85,430.00',
      subtitle: 'All time',
      icon: BadgePercent,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      id: 'used-debit-amount',
      title: 'Used Debit Amount',
      value: '₹ 1,62,750.00',
      subtitle: 'All time',
      icon: FileText,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
    {
      id: 'unused-debit-amount',
      title: 'Unused Debit Amount',
      value: '₹ 1,22,680.00',
      subtitle: 'All time',
      icon: FileText,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
    },
    {
      id: 'debit-notes-month',
      title: 'Debit Notes This Month',
      value: '9',
      subtitle: 'May 2024',
      icon: Calendar,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
  ];

  const statusTabs = [
    { key: 'All', label: 'All (38)' },
    { key: 'Draft', label: 'Draft (4)' },
    { key: 'Issued', label: 'Issued (9)' },
    { key: 'Used', label: 'Used (13)' },
    { key: 'Partially Used', label: 'Partially Used (6)' },
    { key: 'Expired', label: 'Expired (3)' },
    { key: 'Cancelled', label: 'Cancelled (3)' },
  ];

  // Filtered Debit Notes
  const filteredNotes = useMemo(() => {
    return debitNotes.filter((dn) => {
      // Tab filter
      if (debitNoteCurrentTab !== 'All') {
        const tabKey = debitNoteCurrentTab.toLowerCase().replace(' ', '_');
        if (dn.status !== tabKey) return false;
      }

      // Search query
      if (debitNoteSearchQuery.trim()) {
        const q = debitNoteSearchQuery.toLowerCase();
        const matchNote = dn.noteNo.toLowerCase().includes(q);
        const matchInv = dn.invoiceNo.toLowerCase().includes(q);
        const matchCust = dn.customerName.toLowerCase().includes(q);
        if (!matchNote && !matchInv && !matchCust) return false;
      }

      // Status dropdown
      if (debitNoteStatusFilter !== 'All Status') {
        const sKey = debitNoteStatusFilter.toLowerCase().replace(' ', '_');
        if (dn.status !== sKey) return false;
      }

      return true;
    });
  }, [debitNotes, debitNoteCurrentTab, debitNoteSearchQuery, debitNoteStatusFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotes.map((n) => n.id));
    }
  };

  const getStatusBadge = (status: NoteStatus) => {
    switch (status) {
      case 'used':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            Used
          </span>
        );
      case 'partially_used':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            Partially Used
          </span>
        );
      case 'issued':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            Issued
          </span>
        );
      case 'draft':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            Draft
          </span>
        );
      case 'expired':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200">
            Expired
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-500 border border-slate-200 line-through">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">{card.title}</span>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                  {card.value}
                </div>
                <div className="mt-2 text-xs text-slate-400">{card.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar & Filters (5.8.png) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search with Ctrl + K */}
          <div className="flex-1 min-w-[260px] relative">
            <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={debitNoteSearchQuery}
              onChange={(e) => setDebitNoteSearchQuery(e.target.value)}
              placeholder="Search by debit note no., customer name, invoice no., or phone..."
              className="w-full pl-9 pr-20 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shadow-3xs">
              Ctrl + K
            </kbd>
          </div>

          {/* Filters trigger button */}
          <button
            type="button"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-3xs"
          >
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            Filters
          </button>

          {/* Status Dropdown */}
          <div>
            <select
              value={debitNoteStatusFilter}
              onChange={(e) => setDebitNoteStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Issued">Issued</option>
              <option value="Used">Used</option>
              <option value="Partially Used">Partially Used</option>
              <option value="Draft">Draft</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Date Range with Calendar Icon */}
          <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-xs font-medium text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{debitNoteDateRange}</span>
          </div>

          {/* More Filters & Clear */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-3xs"
            >
              More Filters &darr;
            </button>
            <button
              type="button"
              onClick={clearDebitNoteFilters}
              className="px-2.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* 7 Status Tabs with Counts */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive = debitNoteCurrentTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setDebitNoteCurrentTab(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600 rounded-b-none bg-blue-50/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Debit Notes Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <button type="button" onClick={toggleSelectAll} className="p-0.5">
                    {selectedIds.length === filteredNotes.length && filteredNotes.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Debit Note No.</th>
                <th className="py-3 px-4">Invoice No.</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <span>Debit Note Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Debit Note Amount</th>
                <th className="py-3 px-4 text-right">Used Amount</th>
                <th className="py-3 px-4 text-right">Unused Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Expiry Date</th>
                <th className="py-3 px-4 text-center w-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredNotes.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    No debit notes found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredNotes.map((dn) => {
                  const isSelected = selectedIds.includes(dn.id);
                  return (
                    <tr
                      key={dn.id}
                      className={`hover:bg-slate-50/70 transition-colors group ${
                        isSelected ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => toggleSelect(dn.id)}
                          className="p-0.5"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-600 hover:underline cursor-pointer">
                        {dn.noteNo}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {dn.invoiceNo}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {dn.customerName}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {dn.date}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                        ₹ {dn.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-700 tabular-nums">
                        ₹ {dn.usedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-700 tabular-nums">
                        ₹ {dn.unusedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center">{getStatusBadge(dn.status)}</td>
                      <td className="py-3 px-4 text-center text-slate-600 whitespace-nowrap">
                        {dn.expiryDate}
                      </td>
                      <td className="py-3 px-4 text-center relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(activeMenuId === dn.id ? null : dn.id)
                          }
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === dn.id && (
                          <div className="absolute right-4 top-8 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-left animate-in fade-in zoom-in-95">
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                alert(`Viewing Debit Note ${dn.noteNo}`);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                window.print();
                              }}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              Print Debit Note
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                updateDebitNoteStatus(dn.id, 'used');
                                alert(`Debit Note ${dn.noteNo} marked as settled!`);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              Mark as Settled
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
