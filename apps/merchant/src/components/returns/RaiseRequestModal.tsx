import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, ChevronDown, CheckCircle2, FileText, Trash2 } from 'lucide-react';
import { ReturnRecord, useReturnsStore } from '../../stores/returnsStore.js';

interface RaiseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnRecord: ReturnRecord | null;
}

export const RaiseRequestModal: React.FC<RaiseRequestModalProps> = ({
  isOpen,
  onClose,
  returnRecord,
}) => {
  const { submitRaiseRequest } = useReturnsStore();

  const [requestType, setRequestType] = useState<'Complaint' | 'Request'>('Complaint');
  const [reason, setReason] = useState('Item not returned');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !returnRecord) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((f) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      }));
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRaiseRequest({
      returnId: returnRecord.id,
      requestType,
      reason,
      description,
      files: files.map((f) => f.name),
    });
    alert(`Request submitted successfully for ${returnRecord.returnNumber}!`);
    onClose();
  };

  const reasonOptions = [
    'Item not returned',
    'Wrong item returned',
    'Product is used / damaged',
    'Not eligible as per return policy',
    'Incomplete return (missing items)',
    'Fake return request',
    'Other',
  ];

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Raise Request
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tell us why this return should not be processed.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 sm:p-6 space-y-4 max-h-[calc(85vh-140px)] overflow-y-auto">
            {/* Top Product Banner Matching 9.3.png */}
            <div className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={returnRecord.product.imageUrl}
                  alt={returnRecord.product.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {returnRecord.returnNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      {returnRecord.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                    {returnRecord.product.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {returnRecord.product.variant} | SKU: {returnRecord.product.sku}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 border-l border-slate-200 pl-4">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Order ID
                </span>
                <span className="font-semibold text-slate-800 text-xs">
                  {returnRecord.orderNumber}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-1">
                  Customer
                </span>
                <span className="font-semibold text-slate-800 text-xs">
                  {returnRecord.customer.name}
                </span>
              </div>
            </div>

            {/* Request Type Radio Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Request Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Complaint Option */}
                <div
                  onClick={() => setRequestType('Complaint')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    requestType === 'Complaint'
                      ? 'border-blue-600 bg-blue-50/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                        requestType === 'Complaint'
                          ? 'border-blue-600'
                          : 'border-slate-300'
                      }`}
                    >
                      {requestType === 'Complaint' && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">Complaint</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        Report an issue with this return request (e.g. item not returned, wrong item, damage, etc.)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Option */}
                <div
                  onClick={() => setRequestType('Request')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    requestType === 'Request'
                      ? 'border-blue-600 bg-blue-50/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                        requestType === 'Request'
                          ? 'border-blue-600'
                          : 'border-slate-300'
                      }`}
                    >
                      {requestType === 'Request' && (
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">Request</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        Request to deny this refund (e.g. product is usable, policy not eligible, etc.)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Reason <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {reasonOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Description
                </label>
                <span className="text-[11px] text-slate-400">
                  {description.length}/500
                </span>
              </div>
              <textarea
                value={description}
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed description of why this return should be reviewed or denied..."
                rows={3}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400 resize-none"
              />
            </div>

            {/* Supporting Evidence (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-0.5">
                Supporting Evidence <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                You can add images or documents to support your request.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100/70 border border-blue-200 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Files</span>
                </button>
                <span className="text-[11px] text-slate-400">
                  PNG, JPG, PDF up to 5MB each (Max 5 files)
                </span>
              </div>

              {files.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-medium text-slate-800 truncate">
                          {file.name}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          ({file.size})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
