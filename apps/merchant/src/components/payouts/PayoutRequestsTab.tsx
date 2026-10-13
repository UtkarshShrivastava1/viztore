import React, { useState } from 'react';
import {
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  Receipt,
  Calendar,
  Filter,
  Plus,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  Download,
} from 'lucide-react';
import { usePayoutsStore, PayoutRequest } from '../../stores/payoutsStore.js';
import { downloadCSV } from '../../utils/csvExport.js';
import { RequestDetailsDrawer } from './RequestDetailsDrawer.js';
import { NewPayoutRequestModal } from './NewPayoutRequestModal.js';

export const PayoutRequestsTab: React.FC = () => {
  const {
    availableForPayout,
    requests,
    selectedRequest,
    setSelectedRequest,
    isRequestDrawerOpen,
    setIsRequestDrawerOpen,
    setIsNewRequestModalOpen,
    cancelPayoutRequest,
  } = usePayoutsStore();

  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateRange] = useState('01 Apr 2024 - 18 May 2024');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const pendingRequestsTotal = requests
    .filter((r) => r.status === 'Pending')
    .reduce((sum, r) => sum + r.requestedAmount, 0);

  const approvedRequestsTotal = requests
    .filter((r) => r.status === 'Approved')
    .reduce((sum, r) => sum + (r.approvedAmount || r.requestedAmount), 0);

  const rejectedRequestsTotal = requests
    .filter((r) => r.status === 'Rejected')
    .reduce((sum, r) => sum + r.requestedAmount, 0);

  const totalRequestedAllTime = requests.reduce(
    (sum, r) => sum + r.requestedAmount,
    0
  );

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'All Status' && r.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: PayoutRequest['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Rejected
          </span>
        );
    }
  };

  const handleOpenDetails = (req: PayoutRequest) => {
    setSelectedRequest(req);
    setIsRequestDrawerOpen(true);
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6">
      {/* 5 KPI Cards Matching Purchases (Bills) unified layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Available for Payout */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Available for Payout</span>
            <div className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
              ₹ {availableForPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">Next payout on 22 May 2024</span>
          </div>
        </div>

        {/* Card 2: Pending Requests */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Pending Requests</span>
            <div className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
              ₹ {pendingRequestsTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
              {requests.filter((r) => r.status === 'Pending').length} Requests
            </span>
          </div>
        </div>

        {/* Card 3: Approved Requests */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Approved Requests</span>
            <div className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
              ₹ {approvedRequestsTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
              {requests.filter((r) => r.status === 'Approved').length} Requests
            </span>
          </div>
        </div>

        {/* Card 4: Rejected Requests */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Rejected Requests</span>
            <div className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
              ₹ {rejectedRequestsTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
              {requests.filter((r) => r.status === 'Rejected').length} Requests
            </span>
          </div>
        </div>

        {/* Card 5: Total Requested */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Total Requested</span>
            <div className="text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
              ₹ {totalRequestedAllTime.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">All Time</span>
          </div>
        </div>
      </div>

      {/* Filter Bar Matching 11.4.png */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Payout Account */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Payout Account
            </span>
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[200px]">
                <option value="hdfc">HDFC Bank - 50200012345678</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Status
            </span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[130px]"
              >
                <option value="All Status">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Request Date */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Request Date
            </span>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={dateRange}
                className="bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-700 min-w-[190px]"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={() => setStatusFilter('All Status')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-2"
          >
            Clear All
          </button>
          <button
            onClick={() => {
              downloadCSV(
                `payout_requests_${new Date().toISOString().slice(0, 10)}.csv`,
                ['Request ID', 'Date & Time', 'Payout Account', 'Requested Amount', 'Approved Amount', 'Status', 'Remarks'],
                filteredRequests.map((r) => [
                  r.id,
                  r.requestDateTime,
                  r.payoutAccount,
                  r.requestedAmount,
                  r.approvedAmount || '-',
                  r.status,
                  r.remarks || '',
                ])
              );
            }}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter</span>
          </button>
          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Payout Request</span>
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-visible">
        <div className="overflow-x-auto min-h-[350px]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-3">Request Date & Time</th>
                <th className="py-3 px-3">Payout Account</th>
                <th className="py-3 px-3">Requested Amount (₹)</th>
                <th className="py-3 px-3">Approved Amount (₹)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Requested On</th>
                <th className="py-3 px-3">Processed On</th>
                <th className="py-3 px-3">Remarks</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRequests.map((req) => {
                const isMenuOpen = activeMenuId === req.id;
                return (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {req.requestId}
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {req.requestDateTime}
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-medium whitespace-nowrap">
                      {req.payoutAccount}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      ₹ {req.requestedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-600 whitespace-nowrap">
                      {req.approvedAmount !== undefined
                        ? `₹ ${req.approvedAmount.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}`
                        : '-'}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">{getStatusBadge(req.status)}</td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {req.requestedOn}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {req.processedOn || '-'}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {req.remarks || '-'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap relative">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenDetails(req)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-l-lg transition-colors inline-flex items-center gap-1"
                        >
                          <span>View Details</span>
                        </button>
                        <button
                          onClick={() => setActiveMenuId(isMenuOpen ? null : req.id)}
                          className="p-1 text-slate-400 hover:text-slate-600 border border-l-0 border-slate-200 rounded-r-lg hover:bg-slate-50 transition-colors"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Dropdown Menu Matching 11.5.png */}
                      {isMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-30"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-4 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-left text-xs animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={() => handleOpenDetails(req)}
                              className="w-full px-3.5 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Eye className="w-4 h-4 text-slate-500" />
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                alert(`Editing request ${req.requestId}`);
                              }}
                              className="w-full px-3.5 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Pencil className="w-4 h-4 text-slate-500" />
                              <span>Edit Request</span>
                            </button>
                            {req.status === 'Pending' && (
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  cancelPayoutRequest(req.id);
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2 text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-rose-600" />
                                <span>Cancel Request</span>
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 border-t border-slate-100 text-[11px] text-slate-400 bg-slate-50/50">
          Showing all payout requests
        </div>
      </div>

      {/* Slide-over Drawer & Modal */}
      <RequestDetailsDrawer
        isOpen={isRequestDrawerOpen}
        onClose={() => setIsRequestDrawerOpen(false)}
        request={selectedRequest}
      />
      <NewPayoutRequestModal />
    </div>
  );
};
