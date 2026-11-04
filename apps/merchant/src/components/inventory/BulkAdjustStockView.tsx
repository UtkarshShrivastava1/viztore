import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  History,
  Info,
  ChevronDown,
  Boxes,
  Loader2,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle,
  Hash,
  FileText,
  Search,
} from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore.js';
import { InventoryFilterBar } from './InventoryFilterBar.js';
import { matchesCategory } from '../../utils/formatters.js';

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
    searchQuery,
    categoryFilter,
    subcategoryFilter,
    brandFilter,
    statusFilter,
  } = useInventoryStore();

  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  // Initialize row adjustments with zeroes
  const [adjustments, setAdjustments] = useState<Record<string, RowAdjustment>>(() => {
    const initial: Record<string, RowAdjustment> = {};
    items.forEach((item) => {
      initial[item.id] = {
        productId: item.id,
        adjustmentType: 'increase',
        quantity: 0,
        reason: '',
        reference: '',
        notes: '',
      };
    });
    return initial;
  });

  // Filter items matching search and dropdown filters
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchSku = item.sku.toLowerCase().includes(q);
        const matchBarcode = item.barcode.toLowerCase().includes(q);
        const matchBrand = item.brand.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchBarcode && !matchBrand) return false;
      }

      if (categoryFilter !== 'All Categories' && !matchesCategory(item.category, categoryFilter)) {
        return false;
      }

      if (subcategoryFilter !== 'All Sub-categories' && !matchesCategory(item.subcategory, subcategoryFilter)) {
        return false;
      }

      if (brandFilter !== 'All Brands' && !matchesCategory(item.brand, brandFilter)) {
        return false;
      }

      if (statusFilter !== 'All Status') {
        if (statusFilter === 'in_stock' && item.status !== 'in_stock') return false;
        if (statusFilter === 'low_stock' && item.status !== 'low_stock') return false;
        if (statusFilter === 'out_of_stock' && item.status !== 'out_of_stock') return false;
      }

      return true;
    });
  }, [items, searchQuery, categoryFilter, subcategoryFilter, brandFilter, statusFilter]);

  // Compute live adjustment metrics
  const adjustmentStats = useMemo(() => {
    let modifiedCount = 0;
    let netDelta = 0;
    Object.values(adjustments).forEach((adj) => {
      if (adj.quantity > 0) {
        modifiedCount++;
        netDelta += adj.adjustmentType === 'increase' ? adj.quantity : -adj.quantity;
      }
    });
    return { modifiedCount, netDelta };
  }, [adjustments]);

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

  const handleResetAdjustments = () => {
    setAdjustments((prev) => {
      const reset: Record<string, RowAdjustment> = {};
      Object.keys(prev).forEach((id) => {
        reset[id] = {
          productId: id,
          adjustmentType: 'increase',
          quantity: 0,
          reason: '',
          reference: '',
          notes: '',
        };
      });
      return reset;
    });
  };

  const handleApply = async () => {
    const updates = Object.values(adjustments).filter((a) => a.quantity > 0);
    if (updates.length === 0) {
      setFeedbackMessage({
        text: 'No adjustments specified. Please enter quantities before applying.',
        type: 'error',
      });
      return;
    }
    setIsSaving(true);
    setFeedbackMessage(null);
    try {
      await bulkAdjustStock(updates);
      setFeedbackMessage({
        text: `Successfully updated stock for ${updates.length} product(s)!`,
        type: 'success',
      });
      handleResetAdjustments();
    } catch (err) {
      console.error('Failed to apply bulk stock adjustments:', err);
      setFeedbackMessage({
        text: 'Failed to apply stock adjustments. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to parse messy variant strings into clean micro-chips
  const renderVariantChips = (item: (typeof items)[0]) => {
    const sizeStr = item.size || '';
    const colorStr = item.color || '';

    // Check for "N Variants"
    const variantMatch = sizeStr.match(/(\d+)\s*Variants?/i);
    const variantCount = variantMatch ? variantMatch[1] : null;

    if (variantCount) {
      return (
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Layers className="w-3 h-3 text-blue-500" />
            <span>{variantCount} Variants</span>
          </span>
          {colorStr && colorStr !== 'Standard' && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 truncate max-w-[150px]">
              {colorStr.split(',').slice(0, 2).join(', ')}
            </span>
          )}
        </div>
      );
    }

    const chips: string[] = [];
    if (sizeStr && sizeStr !== 'Standard') chips.push(`Size: ${sizeStr}`);
    if (colorStr && colorStr !== 'Standard') chips.push(`Color: ${colorStr}`);

    if (chips.length === 0) return null;

    return (
      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 font-medium">
        {chips.map((c, i) => (
          <span key={i} className="inline-block px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200/80">
            {c}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Breadcrumb & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
            <button
              type="button"
              onClick={() => setViewMode('overview')}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              Inventory
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Adjust Stock</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Adjust Stock</h1>
            {adjustmentStats.modifiedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 animate-in fade-in duration-200">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{adjustmentStats.modifiedCount} adjusted</span>
                <span className="text-slate-400 font-normal">•</span>
                <span
                  className={
                    adjustmentStats.netDelta >= 0
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }
                >
                  {adjustmentStats.netDelta >= 0
                    ? `+${adjustmentStats.netDelta} units`
                    : `${adjustmentStats.netDelta} units`}
                </span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit inventory levels, record physical variances, and adjust stock quantities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {adjustmentStats.modifiedCount > 0 && (
            <button
              type="button"
              onClick={handleResetAdjustments}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 shadow-3xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Values</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setViewMode('stock_history')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-3xs transition-colors cursor-pointer"
          >
            <History className="w-4 h-4 text-blue-600" />
            <span>Stock History</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <InventoryFilterBar showProductType={false} />

      {/* Feedback Alert Banner */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-150 ${
            feedbackMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="font-bold text-xs ml-2 cursor-pointer hover:opacity-75"
          >
            &times;
          </button>
        </div>
      )}

      {/* Batch Adjust Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <th className="px-4 py-3.5 min-w-[220px]">Product</th>
                <th className="px-3.5 py-3.5 min-w-[130px]">SKU &amp; Barcode</th>
                <th className="px-3.5 py-3.5 text-center min-w-[90px]">Current</th>
                <th className="px-4 py-3.5 min-w-[180px]">
                  <div className="inline-flex items-center gap-1">
                    <span>Adjustment</span>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="px-3.5 py-3.5 text-center min-w-[100px]">New Stock</th>
                <th className="px-3.5 py-3.5 min-w-[140px]">Reason (Optional)</th>
                <th className="px-3.5 py-3.5 min-w-[110px]">Reference</th>
                <th className="px-3.5 py-3.5 min-w-[120px]">Notes</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-1">
                      <p className="font-semibold text-slate-600 text-sm">No products found</p>
                      <p className="text-xs text-slate-400">
                        Try resetting your search query or adjusting the category filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
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
                  const isModified = adj.quantity > 0;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isModified ? 'bg-blue-50/20' : ''
                      }`}
                    >
                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shrink-0"
                            loading="lazy"
                          />
                          <div className="min-w-0 max-w-[220px]">
                            <span
                              className="font-bold text-slate-900 block text-xs truncate"
                              title={item.name}
                            >
                              {item.name}
                            </span>
                            {renderVariantChips(item)}
                          </div>
                        </div>
                      </td>

                      {/* SKU & Barcode */}
                      <td className="px-3.5 py-3 font-mono text-[11px]">
                        <span className="block font-semibold text-slate-800 tracking-tight">
                          {item.sku}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {item.barcode || '—'}
                        </span>
                      </td>

                      {/* Current Stock */}
                      <td className="px-3.5 py-3 text-center">
                        <span className="font-black text-slate-900 text-sm font-mono block">
                          {item.stock}
                        </span>
                        <span
                          className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                            item.stock <= 0
                              ? 'bg-rose-50 text-rose-600 border border-rose-200'
                              : item.stock <= (item.lowStockThreshold || 10)
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {item.stock <= 0
                            ? 'Out of Stock'
                            : item.stock <= (item.lowStockThreshold || 10)
                            ? 'Low'
                            : 'In Stock'}
                        </span>
                      </td>

                      {/* Adjustment Selector & Quantity */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="inline-flex p-0.5 rounded-xl bg-slate-100 border border-slate-200 shadow-3xs">
                            <button
                              type="button"
                              onClick={() => handleTypeChange(item.id, 'increase')}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                isInc
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                              title="Increase Stock (+)"
                            >
                              + Add
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTypeChange(item.id, 'decrease')}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                !isInc
                                  ? 'bg-rose-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                              title="Deduct Stock (-)"
                            >
                              - Deduct
                            </button>
                          </div>
                          <input
                            type="number"
                            min={0}
                            value={adj.quantity === 0 ? '' : adj.quantity}
                            placeholder="0"
                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                            className={`w-16 px-2.5 py-1 text-center text-xs font-black rounded-xl border focus:outline-none transition-all font-mono ${
                              adj.quantity > 0
                                ? isInc
                                  ? 'border-emerald-300 bg-emerald-50/60 text-emerald-800 focus:ring-2 focus:ring-emerald-400/20'
                                  : 'border-rose-300 bg-rose-50/60 text-rose-800 focus:ring-2 focus:ring-rose-400/20'
                                : 'border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                            }`}
                          />
                        </div>
                      </td>

                      {/* Live Recomputed New Stock */}
                      <td className="px-3.5 py-3 text-center">
                        <div className="font-mono">
                          <span
                            className={`text-sm font-black tabular-nums ${
                              !isModified
                                ? 'text-slate-800'
                                : isInc
                                ? 'text-emerald-600'
                                : 'text-rose-600'
                            }`}
                          >
                            {newStock}
                          </span>
                          {isModified && (
                            <div
                              className={`text-[10px] font-bold flex items-center justify-center gap-0.5 mt-0.5 ${
                                isInc ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {isInc ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              <span>{isInc ? `+${adj.quantity}` : `-${adj.quantity}`}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="px-3.5 py-3">
                        <div className="relative min-w-[130px]">
                          <select
                            value={adj.reason}
                            onChange={(e) => handleFieldChange(item.id, 'reason', e.target.value)}
                            className="w-full appearance-none bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 pr-6 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-colors"
                          >
                            <option value="">Reason...</option>
                            <option value="Purchase Received">📦 Purchase Received</option>
                            <option value="Stock Audit">📋 Stock Audit</option>
                            <option value="Damaged Stock">⚠️ Damaged Stock</option>
                            <option value="Returned to Supplier">↩️ Returned to Supplier</option>
                            <option value="Sold via POS">⚡ Sold via POS</option>
                            <option value="Other">📝 Other</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>

                      {/* Reference */}
                      <td className="px-3.5 py-3">
                        <div className="relative min-w-[100px]">
                          <Hash className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={adj.reference}
                            onChange={(e) => handleFieldChange(item.id, 'reference', e.target.value)}
                            placeholder="PO / Ref#"
                            className="w-full pl-6 pr-2 py-1.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-mono"
                          />
                        </div>
                      </td>

                      {/* Notes */}
                      <td className="px-3.5 py-3">
                        <div className="relative min-w-[110px]">
                          <FileText className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={adj.notes}
                            onChange={(e) => handleFieldChange(item.id, 'notes', e.target.value)}
                            placeholder="Add note..."
                            className="w-full pl-6 pr-2 py-1.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3.5 px-6 shadow-xl z-20 flex items-center justify-between sm:ml-[var(--sidebar-width,16rem)] transition-all">
        <div className="flex items-center gap-3 font-semibold text-slate-700 text-xs sm:text-sm">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900">{filteredItems.length} Products</span>
            <span className="text-slate-400 text-xs font-normal ml-1">
              (Total Catalog: {totalProductCount.toLocaleString()})
            </span>
          </div>
          {adjustmentStats.modifiedCount > 0 && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 ml-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{adjustmentStats.modifiedCount} ready to commit</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode('overview')}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving || adjustmentStats.modifiedCount === 0}
            onClick={handleApply}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Applying Adjustments...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply Stock Adjustment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
