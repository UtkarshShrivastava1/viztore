import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useReturnsStore } from '../../stores/returnsStore.js';

export const RejectReturnModal: React.FC = () => {
  const {
    isRejectModalOpen,
    setIsRejectModalOpen,
    returnToReject,
    setReturnToReject,
    rejectReturn,
  } = useReturnsStore();

  const [reason, setReason] = useState(
    'Item returned does not match serial dispatch security seal.'
  );
  const [customReason, setCustomReason] = useState('');

  if (!isRejectModalOpen || !returnToReject) return null;

  const handleClose = () => {
    setIsRejectModalOpen(false);
    setReturnToReject(null);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = reason === 'Other' ? customReason : reason;
    rejectReturn(returnToReject.id, finalReason);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Reject Return Request
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {returnToReject.returnNumber} &bull; {returnToReject.customer.name}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleConfirmReject} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Select Reason for Rejection <span className="text-rose-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800"
            >
              <option value="Item returned does not match serial dispatch security seal.">
                Item does not match serial dispatch security seal
              </option>
              <option value="Returned item is physically damaged, altered, or stained.">
                Item is physically damaged, altered, or stained
              </option>
              <option value="Return request initiated outside the 7-day return policy window.">
                Return initiated outside the 7-day policy window
              </option>
              <option value="Missing original product tags, accessories, or original box.">
                Missing original tags, accessories, or box
              </option>
              <option value="Other">Other / Custom reason</option>
            </select>
          </div>

          {reason === 'Other' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Custom Rejection Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Explain why this return is being rejected..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800 placeholder-slate-400"
              />
            </div>
          )}

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-500 text-[11px]">
            The customer will be notified via email & SMS with this rejection notice.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-2xs"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
