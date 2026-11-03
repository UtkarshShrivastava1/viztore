import React from 'react';
import { Printer, Sparkles } from 'lucide-react';
import { ProductItem } from '../../../stores/catalogStore.js';
import { useAuthStore } from '../../../stores/authStore.js';
import { branding } from '@repo/shared-types/branding.config';
import { getBarcodeStickerSpecs } from '../../../lib/taxonomyHelper.js';

interface BarcodeLabelPreviewProps {
  product: Partial<ProductItem>;
  storeName?: string;
  onPrint?: () => void;
}

export const BarcodeLabelPreview: React.FC<BarcodeLabelPreviewProps> = ({
  product,
  storeName,
  onPrint,
}) => {
  const { currentStore, user } = useAuthStore();
  const storeDisplayName = (storeName || currentStore?.name || user?.fullName || branding.appName).toUpperCase();
  const mrp = Number(product.mrp ?? 899);
  const sellingPrice = Number(product.price ?? 599);
  const savings = Math.max(0, mrp - sellingPrice);
  const discountPct = mrp > 0 ? Math.round((savings / mrp) * 100) : 0;
  const { subtitle } = React.useMemo(() => getBarcodeStickerSpecs(product), [product]);
  const barcode = product.barcode || '8901234567890';
  const sku = product.sku || 'PRD-TSHIRT-RD-BLK-M';

  return (
    <div className="flex flex-col items-center">
      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <span>Actual-Size Label Preview</span>
      </div>

      <div className="w-full max-w-[270px] bg-white rounded-xl border-2 border-slate-300 shadow-sm p-3.5 flex flex-col items-center text-center select-none">
        {/* Merchant Store Header */}
        <div className="w-full flex items-center justify-between border-b border-dashed border-slate-300 pb-1.5 mb-1.5 gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 truncate text-left" title={storeDisplayName}>
            {storeDisplayName}
          </span>
          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded-sm border border-emerald-200 shrink-0">
            GENUINE
          </span>
        </div>

        {/* Product Title */}
        <div className="w-full text-left">
          <h4 className="text-[11px] font-bold text-slate-900 line-clamp-2 leading-snug">
            {product.name || 'Product Item'}
          </h4>
          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-600 font-medium truncate">
            <span>{subtitle}</span>
          </div>
        </div>

        {/* Price & Savings */}
        <div className="w-full mt-2 p-1.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
          <div className="text-left">
            <div className="text-[9px] text-slate-400 font-medium">
              MRP: <span className="line-through">₹{mrp}</span>
            </div>
            <div className="text-xs font-extrabold text-slate-900 leading-tight">
              ₹{sellingPrice}
            </div>
          </div>
          {savings > 0 && (
            <div className="text-right">
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.5 rounded-sm">
                <Sparkles className="w-2.5 h-2.5" />
                SAVE ₹{savings} ({discountPct}%)
              </span>
            </div>
          )}
        </div>

        {/* Barcode Graphic */}
        <div className="w-full mt-2 flex flex-col items-center">
          <svg className="w-48 h-9" viewBox="0 0 200 36">
            <rect x="5" y="0" width="3" height="26" fill="#1e293b" />
            <rect x="11" y="0" width="2" height="26" fill="#1e293b" />
            <rect x="15" y="0" width="4" height="26" fill="#1e293b" />
            <rect x="22" y="0" width="1" height="26" fill="#1e293b" />
            <rect x="26" y="0" width="3" height="26" fill="#1e293b" />
            <rect x="32" y="0" width="2" height="26" fill="#1e293b" />
            <rect x="37" y="0" width="4" height="26" fill="#1e293b" />
            <rect x="44" y="0" width="2" height="26" fill="#1e293b" />
            <rect x="49" y="0" width="1" height="26" fill="#1e293b" />
            <rect x="53" y="0" width="3" height="26" fill="#1e293b" />
            <rect x="59" y="0" width="2" height="26" fill="#1e293b" />
            <rect x="64" y="0" width="4" height="26" fill="#1e293b" />
            <rect x="71" y="0" width="2" height="26" fill="#1e293b" />
            <rect x="76" y="0" width="1" height="26" fill="#1e293b" />
            <rect x="80" y="0" width="3" height="26" fill="#1e293b" />
            <rect x="86" y="0" width="3" height="26" fill="#1e293b" />
            <rect x="92" y="0" width="1" height="26" fill="#1e293b" />
            <rect x="96" y="0" width="4" height="26" fill="#1e293b" />
            <rect x="103" y="0" width="2" height="26" fill="#1e293b" />
            <rect x="108" y="0" width="2" height="26" fill="#1e293b" />
            <rect x="113" y="0" width="4" height="26" fill="#1e293b" />
            <rect x="120" y="0" width="1" height="26" fill="#1e293b" />
            <rect x="124" y="0" width="3" height="26" fill="#1e293b" />
            <rect x="130" y="0" width="2" height="26" fill="#1e293b" />
            <rect x="135" y="0" width="3" height="26" fill="#1e293b" />
            <rect x="141" y="0" width="1" height="26" fill="#1e293b" />
            <rect x="145" y="0" width="4" height="26" fill="#1e293b" />
            <rect x="152" y="0" width="2" height="26" fill="#1e293b" />
            <rect x="157" y="0" width="3" height="26" fill="#1e293b" />
            <rect x="163" y="0" width="1" height="26" fill="#1e293b" />
            <rect x="167" y="0" width="3" height="26" fill="#1e293b" />
            <rect x="173" y="0" width="2" height="26" fill="#1e293b" />
            <rect x="178" y="0" width="4" height="26" fill="#1e293b" />
            <rect x="185" y="0" width="2" height="26" fill="#1e293b" />
            <rect x="190" y="0" width="3" height="26" fill="#1e293b" />
            <text
              x="100"
              y="34"
              textAnchor="middle"
              fontSize="7"
              fontFamily="monospace"
              fill="#475569"
              letterSpacing="2"
            >
              {barcode}
            </text>
          </svg>
          <div className="mt-0.5 font-mono text-[9px] text-slate-500">SKU: {sku}</div>
        </div>
      </div>

      {onPrint && (
        <button
          type="button"
          onClick={onPrint}
          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Sticker</span>
        </button>
      )}
    </div>
  );
};
