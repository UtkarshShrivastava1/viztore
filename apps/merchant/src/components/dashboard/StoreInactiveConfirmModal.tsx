import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface StoreInactiveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const StoreInactiveConfirmModal: React.FC<StoreInactiveConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog (1.0a(V1).png) */}
      <div className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon: Amber circle with exclamation mark (!) */}
        <div className="w-16 h-16 rounded-full border-2 border-amber-300 bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4.5 shadow-2xs">
          <span className="text-3xl font-black font-sans leading-none">!</span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 text-center leading-snug mb-2.5">
          Are you sure you want to make your store inactive?
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 text-center leading-relaxed mb-6 px-2">
          Your store will not be visible to customers and new orders will not be received.
          However, your billing and other charges will continue as per your current plan.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-2.5 px-4 rounded-xl border border-blue-600 hover:bg-blue-50/50 text-blue-600 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-1/2 py-2.5 px-4 rounded-xl bg-[#ef4444] hover:bg-red-600 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Yes, Make Inactive
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
