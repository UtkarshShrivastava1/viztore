import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Plus, Minus, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { useCatalogStore } from '../../stores/catalogStore.js';

export const UpdateStockModal: React.FC = () => {
  const { isStockModalOpen, closeStockModal, selectedProductForStock, updateStock } =
    useCatalogStore();

  const [quantity, setQuantity] = useState(0);
  const [lowThreshold, setLowThreshold] = useState(10);
  const [reason, setReason] = useState('Restock / New Inward');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProductForStock) {
      setQuantity(selectedProductForStock.stock);
      setLowThreshold(selectedProductForStock.lowStockThreshold || 10);
      setReason('Restock / New Inward');
      setNote('');
      setErrorMessage(null);
    }
  }, [selectedProductForStock]);

  if (!isStockModalOpen || !selectedProductForStock) return null;

  const product = selectedProductForStock;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await updateStock(product.id, Math.max(0, quantity), Math.max(0, lowThreshold));
      closeStockModal();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update stock. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const diff = quantity - product.stock;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Update Stock Count</h3>
              <p className="text-xs text-slate-500">Adjust on-hand inventory quantity</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeStockModal}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Product Summary */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover bg-slate-200 border border-slate-300/80 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 line-clamp-1">{product.name}</div>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">{product.sku}</div>
              <div className="text-[11px] text-slate-600 mt-1">
                Current Stock:{' '}
                <strong className="text-slate-900 font-semibold">{product.stock} units</strong>
              </div>
            </div>
          </div>

          {/* New Stock Adjustment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              New Stock Quantity <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
                className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                className="flex-1 py-2 px-3 text-center text-base font-bold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {diff !== 0 && (
              <p
                className={`text-[11px] mt-1 font-medium ${
                  diff > 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                Adjustment: {diff > 0 ? `+${diff}` : diff} units ({product.stock} → {quantity})
              </p>
            )}
          </div>

          {/* Low Stock Alert Threshold */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Low Stock Alert Threshold
            </label>
            <input
              type="number"
              min="1"
              value={lowThreshold}
              onChange={(e) => setLowThreshold(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full py-2 px-3 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Trigger automated restock warning when stock drops to or below this level.
            </p>
          </div>

          {/* Reason for Adjustment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reason for Adjustment
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full py-2 px-3 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="Restock / New Inward">Restock / New Inward</option>
              <option value="Physical Stock Audit">Physical Stock Audit</option>
              <option value="Customer Return">Customer Return</option>
              <option value="Damaged / Expired">Damaged / Expired Goods</option>
              <option value="Internal Transfer">Internal Warehouse Transfer</option>
            </select>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Internal Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Inward PO #4928"
              className="w-full py-2 px-3 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Error Message if Update Fails */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={closeStockModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>{isSubmitting ? 'Saving...' : 'Update Stock'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
