import React, { useRef } from 'react';
import { X, Printer, Tag, Sparkles } from 'lucide-react';
import { useCatalogStore } from '../../stores/catalogStore.js';
import { useAuthStore } from '../../stores/authStore.js';
import { branding } from '@repo/shared-types/branding.config';
import { printHtmlDocument } from '../../lib/pdfEngine.js';
import { getBarcodeStickerSpecs } from '../../lib/taxonomyHelper.js';

export const ProductLabelPrintModal: React.FC = () => {
  const { isPrintLabelModalOpen, closePrintLabelModal, selectedProductForLabel } =
    useCatalogStore();
  const { currentStore, user } = useAuthStore();
  const storeDisplayName = (currentStore?.name || user?.fullName || branding.appName).toUpperCase();
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isPrintLabelModalOpen || !selectedProductForLabel) return null;

  const product = selectedProductForLabel;
  const mrp = product.mrp || product.price || 0;
  const sellingPrice = product.price;
  const savings = Math.max(0, mrp - sellingPrice);
  const discountPct = mrp > 0 ? Math.round((savings / mrp) * 100) : 0;
  const { subtitle } = React.useMemo(() => getBarcodeStickerSpecs(product), [product]);

  const handlePrint = () => {
    if (printAreaRef.current) {
      const labelHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Label - ${product.name} | ${storeDisplayName}</title>
  <style>
    @page { size: 50mm 35mm; margin: 1mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      width: 48mm;
      height: 33mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #ffffff !important;
      color: #000000;
      font-size: 9px;
      line-height: 1.2;
      text-align: center;
      padding: 2px;
    }
    div, p, span { color: inherit; }
  </style>
</head>
<body>
  ${printAreaRef.current.innerHTML}
</body>
</html>`;
      printHtmlDocument(labelHtml);
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Print Product Barcode Label</h3>
              <p className="text-xs text-slate-500">Retail shelf tag & packaging thermal sticker</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closePrintLabelModal}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Sticker Preview */}
        <div className="p-6 bg-slate-50 flex flex-col items-center justify-center">
          <p className="text-xs font-medium text-slate-500 mb-3 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            <span>Actual-Size 50mm × 35mm Thermal Label Preview</span>
          </p>

          {/* Actual Print Sticker Container */}
          <div
            ref={printAreaRef}
            id="printable-barcode-label"
            className="w-[320px] bg-white rounded-xl border-2 border-slate-300 shadow-md p-4 flex flex-col items-center text-center select-none"
          >
            {/* Header: Dynamic Merchant Store Name */}
            <div className="w-full flex items-center justify-between border-b border-dashed border-slate-300 pb-2 mb-2 gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 truncate text-left" title={storeDisplayName}>
                {storeDisplayName}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-200 shrink-0">
                GENUINE
              </span>
            </div>

            {/* Product Title & Attributes */}
            <div className="w-full text-left">
              <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600 font-medium truncate">
                {subtitle && <span><strong className="text-slate-900">{subtitle}</strong></span>}
                {subtitle && <span>•</span>}
                <span>{product.brand || 'GEN'}</span>
              </div>
            </div>

            {/* Price Tag with Savings Badge */}
            <div className="w-full mt-2.5 p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-medium">
                  MRP: <span className="line-through">₹{mrp}</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900 leading-tight">
                  ₹{sellingPrice}
                </div>
              </div>
              {savings > 0 && (
                <div className="text-right">
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm">
                    <Sparkles className="w-2.5 h-2.5" />
                    SAVE ₹{savings} ({discountPct}% OFF)
                  </span>
                  <div className="text-[9px] text-slate-400 mt-0.5">Incl. of all taxes</div>
                </div>
              )}
            </div>

            {/* Barcode Graphic SVG */}
            <div className="w-full mt-3 flex flex-col items-center">
              <svg className="w-56 h-12" viewBox="0 0 200 40">
                {/* Barcode bars simulation */}
                <rect x="5" y="0" width="3" height="32" fill="#1e293b" />
                <rect x="11" y="0" width="2" height="32" fill="#1e293b" />
                <rect x="15" y="0" width="4" height="32" fill="#1e293b" />
                <rect x="22" y="0" width="1" height="32" fill="#1e293b" />
                <rect x="26" y="0" width="3" height="32" fill="#1e293b" />
                <rect x="32" y="0" width="2" height="32" fill="#1e293b" />
                <rect x="37" y="0" width="4" height="32" fill="#1e293b" />
                <rect x="44" y="0" width="2" height="32" fill="#1e293b" />
                <rect x="49" y="0" width="1" height="32" fill="#1e293b" />
                <rect x="53" y="0" width="3" height="32" fill="#1e293b" />
                <rect x="59" y="0" width="2" height="32" fill="#1e293b" />
                <rect x="64" y="0" width="4" height="32" fill="#1e293b" />
                <rect x="71" y="0" width="2" height="32" fill="#1e293b" />
                <rect x="76" y="0" width="1" height="32" fill="#1e293b" />
                <rect x="80" y="0" width="3" height="32" fill="#1e293b" />
                <rect x="86" y="0" width="3" height="32" fill="#1e293b" />
                <rect x="92" y="0" width="1" height="32" fill="#1e293b" />
                <rect x="96" y="0" width="4" height="32" fill="#1e293b" />
                <rect x="103" y="0" width="2" height="32" fill="#1e293b" />
                <rect x="108" y="0" width="2" height="32" fill="#1e293b" />
                <rect x="113" y="0" width="4" height="32" fill="#1e293b" />
                <rect x="120" y="0" width="1" height="32" fill="#1e293b" />
                <rect x="124" y="0" width="3" height="32" fill="#1e293b" />
                <rect x="130" y="0" width="2" height="32" fill="#1e293b" />
                <rect x="135" y="0" width="3" height="32" fill="#1e293b" />
                <rect x="141" y="0" width="1" height="32" fill="#1e293b" />
                <rect x="145" y="0" width="4" height="32" fill="#1e293b" />
                <rect x="152" y="0" width="2" height="32" fill="#1e293b" />
                <rect x="157" y="0" width="3" height="32" fill="#1e293b" />
                <rect x="163" y="0" width="1" height="32" fill="#1e293b" />
                <rect x="167" y="0" width="3" height="32" fill="#1e293b" />
                <rect x="173" y="0" width="2" height="32" fill="#1e293b" />
                <rect x="178" y="0" width="4" height="32" fill="#1e293b" />
                <rect x="185" y="0" width="2" height="32" fill="#1e293b" />
                <rect x="190" y="0" width="3" height="32" fill="#1e293b" />
                {/* Numbers */}
                <text
                  x="100"
                  y="39"
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="monospace"
                  fill="#475569"
                  letterSpacing="3"
                >
                  {product.barcode}
                </text>
              </svg>

              {/* Monospace SKU */}
              <div className="mt-1 font-mono text-[10px] text-slate-500 tracking-wider">
                SKU: {product.sku}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-white">
          <button
            type="button"
            onClick={closePrintLabelModal}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Label</span>
          </button>
        </div>
      </div>
    </div>
  );
};
