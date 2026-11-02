import React, { useState, useMemo } from 'react';
import {
  FileDiff,
  FileMinus,
  Search,
  Filter,
  Eye,
  X,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useBillingStore, ICreditNote, IDebitNote, NoteStatus } from '../../stores/billingStore.js';

interface NotesTableViewProps {
  noteType: 'credit' | 'debit';
}

export const NotesTableView: React.FC<NotesTableViewProps> = ({ noteType }) => {
  const {
    creditNotes,
    debitNotes,
    creditNoteSearchQuery,
    setCreditNoteSearchQuery,
    creditNoteStatusFilter,
    setCreditNoteStatusFilter,
    debitNoteSearchQuery,
    setDebitNoteSearchQuery,
    debitNoteStatusFilter,
    setDebitNoteStatusFilter,
    setActiveView,
  } = useBillingStore();

  const isCredit = noteType === 'credit';
  const notes = isCredit ? creditNotes : debitNotes;
  const searchQuery = isCredit ? creditNoteSearchQuery : debitNoteSearchQuery;
  const setSearchQuery = isCredit ? setCreditNoteSearchQuery : setDebitNoteSearchQuery;
  const statusFilter = isCredit ? creditNoteStatusFilter : debitNoteStatusFilter;
  const setStatusFilter = isCredit ? setCreditNoteStatusFilter : setDebitNoteStatusFilter;

  const [selectedNote, setSelectedNote] = useState<ICreditNote | IDebitNote | null>(null);

  // Dynamic KPI calculations
  const { totalValue, totalUsed, totalUnused, activeCount } = useMemo(() => {
    let value = 0;
    let used = 0;
    let unused = 0;
    let active = 0;
    notes.forEach((n) => {
      value += n.totalAmount || 0;
      used += n.usedAmount || 0;
      unused += n.unusedAmount || 0;
      if (n.status === 'issued' || n.status === 'partially_used') {
        active += 1;
      }
    });
    return { totalValue: value, totalUsed: used, totalUnused: unused, activeCount: active };
  }, [notes]);

  const statusTabs: { label: string; key: string }[] = [
    { label: 'All', key: 'All' },
    { label: 'Issued / Active', key: 'issued' },
    { label: 'Used', key: 'used' },
    { label: 'Partially Used', key: 'partially_used' },
    { label: 'Expired', key: 'expired' },
    { label: 'Cancelled', key: 'cancelled' },
  ];

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      // Status filter
      if (statusFilter !== 'All' && statusFilter !== 'All Status') {
        if (n.status !== statusFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNo = n.noteNo.toLowerCase().includes(q);
        const matchInv = n.invoiceNo.toLowerCase().includes(q);
        const matchCustomer = n.customerName.toLowerCase().includes(q);
        const matchPhone = n.customerPhone?.includes(q);
        if (!matchNo && !matchInv && !matchCustomer && !matchPhone) return false;
      }

      return true;
    });
  }, [notes, statusFilter, searchQuery]);

  const getStatusBadge = (status: NoteStatus) => {
    switch (status) {
      case 'issued':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            Active / Issued
          </span>
        );
      case 'used':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            Fully Settled
          </span>
        );
      case 'partially_used':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            Partially Used
          </span>
        );
      case 'expired':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            Expired
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  const handleExportCsv = () => {
    if (filteredNotes.length === 0) return;
    const headers = ['Note No', 'Invoice No', 'Date', 'Expiry Date', 'Customer Name', 'Reason', 'Total Amount', 'Used Amount', 'Unused Amount', 'Status'];
    const rows = filteredNotes.map((n) => [
      n.noteNo,
      n.invoiceNo,
      n.date,
      n.expiryDate,
      `"${n.customerName.replace(/"/g, '""')}"`,
      `"${(n.reason || '').replace(/"/g, '""')}"`,
      n.totalAmount.toFixed(2),
      n.usedAmount.toFixed(2),
      n.unusedAmount.toFixed(2),
      n.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${isCredit ? 'Credit' : 'Debit'}_Notes_Register_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Total {isCredit ? 'Credit' : 'Debit'} Notes
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              {isCredit ? <FileDiff className="w-4 h-4" /> : <FileMinus className="w-4 h-4" />}
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">{notes.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {activeCount} active notes
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Adjustment Value</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">
            ₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Gross ledger value</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Adjusted / Used Amount</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">
            ₹{totalUsed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Settled against subsequent sales</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Available / Unused Balance</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">
            ₹{totalUnused.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-purple-600 font-medium mt-0.5">Ready for checkout redemption</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Status Tabs Bar */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-200 overflow-x-auto scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive =
              statusFilter === tab.key || (tab.key === 'All' && (statusFilter === 'All' || statusFilter === 'All Status'));
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Toolbar: Search, Filters & Export */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${isCredit ? 'credit' : 'debit'} note #, invoice #, customer...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filteredNotes.length === 0}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Note #</th>
                <th className="py-3 px-4">Against Invoice</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4 text-right">Note Amount</th>
                <th className="py-3 px-4 text-right">Unused Credit</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredNotes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      {isCredit ? (
                        <FileDiff className="w-10 h-10 text-slate-300 stroke-1" />
                      ) : (
                        <FileMinus className="w-10 h-10 text-slate-300 stroke-1" />
                      )}
                      <p className="text-sm font-semibold text-slate-700">
                        No {isCredit ? 'credit' : 'debit'} notes found
                      </p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        Credit notes are generated when items are returned or discounted post-sale.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 px-4 font-bold text-blue-600">
                      {note.noteNo}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 font-semibold">
                      {note.invoiceNo}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {note.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{note.customerName}</div>
                      <div className="text-[11px] text-slate-400">{note.customerPhone || 'Counter walk-in'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={note.reason}>
                      {note.reason || 'General Return / Price adjustment'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ₹{note.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-purple-600">
                      ₹{note.unusedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {getStatusBadge(note.status)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedNote(note)}
                        className="px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="View Note Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filteredNotes.length === 0 ? '0' : `1 to ${filteredNotes.length}`} of {notes.length} {isCredit ? 'credit' : 'debit'} notes
          </span>
          <span className="text-[11px] text-slate-400">All records synchronized</span>
        </div>
      </div>

      {/* Note Detail Drawer / Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isCredit ? 'Credit Note' : 'Debit Note'} — {selectedNote.noteNo}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Linked to Invoice: <span className="font-semibold text-slate-800">{selectedNote.invoiceNo}</span> | Date: {selectedNote.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Customer & Reason Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Customer:</span>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedNote.customerName}</div>
                  <div className="text-slate-500">{selectedNote.customerPhone || 'Counter sale'}</div>
                  {selectedNote.customerGstin && (
                    <div className="text-slate-500 font-mono mt-0.5">GSTIN: {selectedNote.customerGstin}</div>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Reason for Adjustment:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedNote.reason || 'General goods return'}</div>
                  <div className="mt-2 text-slate-500">
                    Expiry Date: <span className="font-semibold text-slate-700">{selectedNote.expiryDate || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Adjusted Line Items
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Item</th>
                        <th className="py-2.5 px-3 text-center">HSN</th>
                        <th className="py-2.5 px-3 text-center">Invoiced Qty</th>
                        <th className="py-2.5 px-3 text-center">Adjusted Qty</th>
                        <th className="py-2.5 px-3 text-right">Rate</th>
                        <th className="py-2.5 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedNote.items.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="py-2.5 px-3 font-medium text-slate-900">{item.name}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500">{item.hsnSac || '0000'}</td>
                          <td className="py-2.5 px-3 text-center font-semibold text-slate-600">{item.invoicedQty || item.quantity}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-blue-600">{item.returnedQty || item.quantity}</td>
                          <td className="py-2.5 px-3 text-right text-slate-700">₹{item.rate.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹{item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Subtotal:</span>
                    <span className="font-semibold">₹{selectedNote.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST Tax (18%):</span>
                    <span className="font-semibold">₹{selectedNote.taxTotal.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-sm text-slate-900">
                    <span>Total Note Value:</span>
                    <span>₹{selectedNote.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-xs text-purple-600 pt-1">
                    <span>Unused Available:</span>
                    <span>₹{selectedNote.unusedAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

