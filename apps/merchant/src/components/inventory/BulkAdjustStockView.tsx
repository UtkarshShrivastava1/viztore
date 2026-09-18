import React, { useState } from 'react';
import {
  ChevronRight,
  History,
  Info,
  ChevronDown,
  Boxes,
} from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore.js';
import { InventoryFilterBar } from './InventoryFilterBar.js';

interface RowAdjustment {
  productId: string;
  adjustmentType: 'increase' | 'decrease';
  quantity: number;
  reason: string;
  reference: string;
  notes: string;
}

export const BulkAdjustStockView: React.FC = () => {
  const {
    items,
    setViewMode,
    bulkAdjustStock,
    totalProductCount,
  } = useInventoryStore();

  // Initialize row adjustments with mockup defaults or zeroes
  const [adjustments, setAdjustments] = useState<Record<string, RowAdjustment>>(() => {
    const initial: Record<string, RowAdjustment> = {};
    const defaultDeltas: Record<string, { type: 'increase' | 'decrease'; qty: number }> = {
      'inv-1': { type: 'increase', qty: 50 },
      'inv-2': { type: 'increase', qty: 25 },
      'inv-3': { type: 'decrease', qty: 15 },
      'inv-4': { type: 'increase', qty: 10 },
      'inv-5': { type: 'decrease', qty: 5 },
      'inv-6': { type: 'increase', qty: 20 },
      'inv-7': { type: 'decrease', qty: 10 },
      'inv-8': { type: 'increase', qty: 30 },
    };

    items.forEach((item) => {
      const def = defaultDeltas[item.id] || { type: 'increase', qty: 0 };
      initial[item.id] = {
        productId: item.id,
        adjustmentType: def.type,
        quantity: def.qty,
        reason: '',
        reference: '',
        notes: '',
      };
    });
    return initial;
  });

  const handleTypeChange = (productId: string, type: 'increase' | 'decrease') => {
    setAdjustments((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {
          productId,
          adjustmentType: type,
          quantity: 0,
          reason: '',
          reference: '',
          notes: '',
        }),
        adjustmentType: type,
      },
    }));
  };

  const handleQuantityChange = (productId: string, val: number) => {
    const safeQty = Math.max(0, val || 0);
    setAdjustments((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {
          productId,
          adjustmentType: 'increase',
          quantity: 0,
          reason: '',
          reference: '',
          notes: '',
        }),
        quantity: safeQty,
      },
    }));
  };

  const handleFieldChange = (
    productId: string,
    field: 'reason' | 'reference' | 'notes',
    value: string
  ) => {
    setAdjustments((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {
          productId,
          adjustmentType: 'increase',
          quantity: 0,
          reason: '',
          reference: '',
          notes: '',
        }),
        [field]: value,
      },
    }));
  };

  const handleApply = () => {
    const updates = Object.values(adjustments).filter((a) => a.quantity > 0);
    if (updates.length === 0) {
      alert('No adjustments specified. Setting quantities first.');
      return;
    }
    bulkAdjustStock(updates);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Breadcrumb & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
            <button
              type="button"
              onClick={() => setViewMode('overview')}
              className="hover:text-blue-600 cursor-pointer"
            >
              Inventory
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Adjust Stock</span>
          </nav>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Adjust Stock</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Update stock quantity for one or more products.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setViewMode('stock_history')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-2xs transition-colors cursor-pointer"
        >
          <History className="w-4 h-4 text-blue-600" />
          <span>Stock History</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <InventoryFilterBar showProductType={false} />

      {/* Batch Adjust Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px] text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <th className="px-4 py-3.5">Product</th>
                <th className="px-4 py-3.5">SKU &amp; Barcode</th>
                <th className="px-4 py-3.5 text-center">Current Stock (Units)</th>
                <th className="px-4 py-3.5">
                  <div className="inline-flex items-center gap-1">
                    <span>Adjustment (Units)</span>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3.5 text-center">New Stock (Units)</th>
                <th className="px-4 py-3.5">Reason (Optional)</th>
                <th className="px-4 py-3.5">Reference (Optional)</th>
                <th className="px-4 py-3.5">Notes (Optional)</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-150 bg-white text-slate-700">
              {items.map((item) => {
                const adj = adjustments[item.id] || {
                  productId: item.id,
                  adjustmentType: 'increase',
                  quantity: 0,
                  reason: '',
                  reference: '',
                  notes: '',
                };

                const isInc = adj.adjustmentType === 'increase';
                const signedDelta = isInc ? adj.quantity : -adj.quantity;
                const newStock = Math.max(0, item.stock + signedDelta);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Size: {item.size} • Color: {item.color}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SKU & Barcode */}
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                      <span className="block font-semibold text-slate-700">{item.sku}</span>
                      <span className="text-slate-400">{item.barcode}</span>
                    </td>

                    {/* Current Stock */}
                    <td className="px-4 py-3 text-center font-bold text-slate-900 text-sm">
                      {item.stock}
                    </td>

                    {/* Adjustment Units input with Increase/Decrease selector */}
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                        <input
                          type="number"
                          min={0}
                          value={adj.quantity === 0 ? '' : adj.quantity}
                          placeholder="0"
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          className="w-16 px-2.5 py-1.5 text-center text-xs font-bold text-slate-900 focus:outline-none"
                        />
                        <div className="border-l border-slate-200">
                          <select
                            value={adj.adjustmentType}
                            onChange={(e) => handleTypeChange(item.id, e.target.value as any)}
                            className={`appearance-none bg-transparent pl-2.5 pr-6 py-1.5 text-xs font-bold focus:outline-none cursor-pointer ${
                              isInc ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            <option value="increase">Increase</option>
                            <option value="decrease">Decrease</option>
                          </select>
                        </div>
                      </div>
                    </td>

                    {/* Live Recomputed New Stock */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-sm font-black tabular-nums ${
                          adj.quantity === 0
                            ? 'text-slate-700'
                            : isInc
                            ? 'text-emerald-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {newStock}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="px-4 py-3">
                      <div className="relative min-w-[140px]">
                        <select
                          value={adj.reason}
                          onChange={(e) => handleFieldChange(item.id, 'reason', e.target.value)}
                          className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 pr-6 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="">Select reason</option>
                          <option value="Purchase Received">Purchase Received</option>
                          <option value="Damaged Stock">Damaged Stock</option>
                          <option value="Stock Audit">Stock Audit</option>
                          <option value="Returned to Supplier">Returned to Supplier</option>
                          <option value="Sold via POS">Sold via POS</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </td>

                    {/* Reference */}
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={adj.reference}
                        onChange={(e) => handleFieldChange(item.id, 'reference', e.target.value)}
                        placeholder="e.g. PO#1234"
                        className="w-28 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={adj.notes}
                        onChange={(e) => handleFieldChange(item.id, 'notes', e.target.value)}
                        placeholder="Add note..."
                        className="w-32 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 p-4 shadow-xl z-20 flex items-center justify-between sm:ml-64 transition-all">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-xs sm:text-sm">
          <Boxes className="w-5 h-5 text-blue-600" />
          <span>Total Products: {totalProductCount.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode('overview')}
            className="px-5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2 rounded-xl bg-[#1a56db] hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            Apply Stock Adjustment
          </button>
        </div>
      </div>
    </div>
  );
};
