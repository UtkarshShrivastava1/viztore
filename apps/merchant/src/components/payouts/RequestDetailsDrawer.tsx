import React from 'react';
import { X, CheckCircle2, Download, Clock } from 'lucide-react';
import { PayoutRequest } from '../../stores/payoutsStore.js';

interface RequestDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request: PayoutRequest | null;
}

export const RequestDetailsDrawer: React.FC<RequestDetailsDrawerProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  if (!isOpen || !request) return null;

  const handleDownloadReceipt = () => {
    window.print();
  };

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Request Details</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader ID + Status */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">{request.requestId}</span>
            {getStatusBadge(request.status)}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-700">
            {/* Request Summary */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Request Summary
              </span>

              <div className="flex justify-between">
                <span className="text-slate-500">Request ID</span>
                <span className="font-bold text-slate-900">{request.requestId}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span>{getStatusBadge(request.status)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Request Date & Time</span>
                <span className="font-semibold text-slate-800">{request.requestDateTime}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Requested On</span>
                <span className="text-slate-700">{request.requestedOn}</span>
              </div>

              {request.processedOn && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Processed On</span>
                  <span className="text-slate-700">{request.processedOn}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-500">Payout Account</span>
                <span className="font-semibold text-slate-800 text-right">
                  {request.payoutAccount}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Requested Amount</span>
                <span className="font-bold text-slate-900">
                  ₹ {request.requestedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {request.approvedAmount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Approved Amount</span>
                  <span className="font-bold text-emerald-600">
                    ₹ {request.approvedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-500">Remarks</span>
                <span className="text-slate-600">{request.remarks || '-'}</span>
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Bank Details
              </span>

              <div className="flex justify-between">
                <span className="text-slate-500">Account Holder Name</span>
                <span className="font-semibold text-slate-900">
                  {request.bankDetails.accountHolderName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Account Number</span>
                <span className="font-mono text-slate-800">
                  {request.bankDetails.accountNumber}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">IFSC Code</span>
                <span className="font-mono text-slate-800">
                  {request.bankDetails.ifscCode}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Bank Name</span>
                <span className="text-slate-800">{request.bankDetails.bankName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Account Type</span>
                <span className="text-slate-800">{request.bankDetails.accountType}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Timeline
              </span>

              <div className="relative pl-6 space-y-4">
                {/* Vertical line */}
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-emerald-200" />

                {/* Event 1 */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <p className="font-bold text-slate-900">Request Created</p>
                  <p className="text-[11px] text-slate-400">{request.timeline.created}</p>
                </div>

                {/* Event 2 */}
                {request.timeline.approved && (
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <p className="font-bold text-slate-900">Request Approved</p>
                    <p className="text-[11px] text-slate-400">{request.timeline.approved}</p>
                    {request.timeline.approvedBy && (
                      <p className="text-[10px] text-slate-400">
                        Approved by: {request.timeline.approvedBy}
                      </p>
                    )}
                  </div>
                )}

                {/* Event 3 */}
                {request.timeline.processed && (
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <p className="font-bold text-slate-900">Payment Processed</p>
                    <p className="text-[11px] text-slate-400">{request.timeline.processed}</p>
                    {request.timeline.utr && (
                      <p className="text-[10px] font-mono text-emerald-700">
                        UTR: {request.timeline.utr}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <button
              onClick={handleDownloadReceipt}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
