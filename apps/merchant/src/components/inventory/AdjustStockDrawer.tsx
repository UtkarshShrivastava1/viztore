import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Info } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore.js';

export const AdjustStockDrawer: React.FC = () => {
  const { adjustDrawerItem, closeAdjustDrawer, adjustStock } = useInventoryStore();

  const [adjustmentType, setAdjustmentType] = useState<'increase' | 'decrease' | 'set'>('increase');
  const [quantity, setQuantity] = useState<number>(50);
  const [reason, setReason] = useState<string>('Purchase Received');
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (adjustDrawerItem) {
      setAdjustmentType('increase');
      setQuantity(50);
      setReason('Purchase Received');
      setReference('');
      setNotes('');
    }
  }, [adjustDrawerItem]);

  if (!adjustDrawerItem) return null;

  const currentStock = adjustDrawerItem.stock;
  const currentReserved = adjustDrawerItem.reserved;
  const currentAvailable = adjustDrawerItem.available;

  let computedNewStock = currentStock;
  let summaryText = '';

  if (adjustmentType === 'increase') {
    computedNewStock = currentStock + quantity;
    summaryText = `Stock will be increased by ${quantity} units. New stock will be ${computedNewStock} units.`;
  } else if (adjustmentType === 'decrease') {
    computedNewStock = Math.max(0, currentStock - quantity);
    summaryText = `Stock will be decreased by ${quantity} units. New stock will be ${computedNewStock} units.`;
  } else {
    computedNewStock = Math.max(0, quantity);
    const delta = quantity - currentStock;
    summaryText = `Stock will be set to ${quantity} units (${delta >= 0 ? '+' : ''}${delta} units change). New stock will be ${computedNewStock} units.`;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      alert('Please select a reason for stock adjustment');
      return;
    }
    adjustStock(
      adjustDrawerItem.id,
      adjustmentType,
      quantity,
      reason,
      reference.trim() || undefined,
      notes.trim() || undefined
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={closeAdjustDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <h2 className="text-base font-bold text-slate-900">Adjust Stock</h2>
          <button
            type="button"
            onClick={closeAdjustDrawer}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Product Header Card */}
          <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <img
              src={adjustDrawerItem.imageUrl}
              alt={adjustDrawerItem.name}
              className="w-14 h-14 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-xs truncate">
                {adjustDrawerItem.name}
              </h3>
              <div className="mt-1 space-y-0.5 text-[11px] text-slate-500">
                <p>SKU: <span className="font-mono text-slate-600 font-semibold">{adjustDrawerItem.sku}</span></p>
                <p>Barcode: <span className="text-slate-600">{adjustDrawerItem.barcode}</span></p>
                <p>Size: <span className="font-semibold text-slate-700">{adjustDrawerItem.size}</span> • Color: <span className="font-semibold text-slate-700">{adjustDrawerItem.color}</span></p>
                <p>Brand: <span className="font-semibold text-slate-700">{adjustDrawerItem.brand}</span></p>
              </div>
            </div>
          </div>

          {/* Current Stat Bar */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                Current Stock (Units)
              </span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">
                {currentStock}
              </span>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                Reserved
              </span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">
                {currentReserved}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                Available
              </span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">
                {currentAvailable}
              </span>
            </div>
          </div>

          {/* Adjustment Type Radio Group */}
          <div>
            <label className="font-bold text-slate-900 block mb-2">
              Adjustment Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'increase', label: 'Increase Stock' },
                { id: 'decrease', label: 'Decrease Stock' },
                { id: 'set', label: 'Set New Stock' },
              ].map((type) => (
                <label
                  key={type.id}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    adjustmentType === type.id
                      ? 'border-blue-600 bg-blue-50/40 text-blue-700 font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="adjustmentType"
                    checked={adjustmentType === type.id}
                    onChange={() => setAdjustmentType(type.id as any)}
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs leading-tight">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div>
            <label className="font-bold text-slate-900 block mb-2">
              Quantity <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 0))}
                className="flex-1 bg-transparent text-center font-bold text-sm text-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reason Dropdown (Required) */}
          <div>
            <label className="font-bold text-slate-900 block mb-1.5">
              Reason <span className="text-rose-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Purchase Received">Purchase Received</option>
              <option value="Damaged Stock">Damaged Stock</option>
              <option value="Stock Audit / Discrepancy">Stock Audit / Discrepancy</option>
              <option value="Returned to Supplier">Returned to Supplier</option>
              <option value="Sold via Offline / POS">Sold via Offline / POS</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Reference (Optional) */}
          <div>
            <label className="font-bold text-slate-900 block mb-1.5">
              Reference (Optional)
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. PO#1234, GRN#5678, Note"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes (Optional) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-900 block">
                Notes (Optional)
              </label>
              <span className="text-[10px] text-slate-400">
                {notes.length} / 200
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={200}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note..."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Dynamic Alert */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">
              {summaryText}
            </p>
          </div>

          {/* Footer inside form */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={closeAdjustDrawer}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-5 py-2.5 rounded-xl bg-[#1a56db] hover:bg-blue-700 text-white font-bold transition-colors shadow-sm cursor-pointer text-center"
            >
              Adjust Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
