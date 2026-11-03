import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { WizardStep, useCatalogStore } from '../../../stores/catalogStore.js';

interface WizardHelpSidebarProps {
  step: WizardStep;
}

export const LiveProductInfoCard: React.FC = () => {
  const draftProduct = useCatalogStore((s) => s.draftProduct);

  const primaryImage = draftProduct.images?.[0];
  const hasVariants = Array.isArray(draftProduct.variants) && draftProduct.variants.length > 0;
  const priceVal =
    draftProduct.price !== undefined && draftProduct.price !== null && Number(draftProduct.price) > 0
      ? Number(draftProduct.price)
      : null;
  const mrpVal =
    draftProduct.mrp !== undefined && draftProduct.mrp !== null && Number(draftProduct.mrp) > 0
      ? Number(draftProduct.mrp)
      : null;

  return (
    <div className="bg-white rounded-xl border border-blue-200/80 p-4 shadow-2xs relative overflow-hidden">
      {/* Top Accent Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 pt-0.5">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
            Live Product Snapshot
          </h5>
        </div>
        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-full">
          Real-Time
        </span>
      </div>

      {/* Product Mini Header (when name or photo exists) */}
      {(primaryImage || draftProduct.name) && (
        <div className="flex items-center gap-2.5 p-2 mb-3 bg-slate-50/80 rounded-lg border border-slate-200/70">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt="Product thumbnail"
              className="w-10 h-10 rounded-md object-cover border border-slate-200 shrink-0 bg-white"
            />
          ) : (
            <div className="w-10 h-10 rounded-md bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/50">
              <Package className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate">
              {draftProduct.name || 'Untitled Product'}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {draftProduct.brand || 'Generic / Unbranded'} • {draftProduct.category || 'Category'}
            </p>
          </div>
        </div>
      )}

      {/* Live Fields Grid */}
      <div className="space-y-2 text-xs divide-y divide-slate-100">
        {draftProduct.name && (
          <div className="flex items-start justify-between gap-2 pt-1.5 first:pt-0">
            <span className="text-slate-500 shrink-0">Product Name:</span>
            <span className="font-semibold text-slate-800 text-right truncate max-w-[65%]">
              {draftProduct.name}
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-2 pt-1.5 first:pt-0">
          <span className="text-slate-500 shrink-0">Category:</span>
          <span className="font-semibold text-slate-800 text-right">
            {draftProduct.category ? (
              <span className="text-slate-800">{draftProduct.category}</span>
            ) : (
              <span className="text-slate-400 italic">Not selected</span>
            )}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2 pt-1.5">
          <span className="text-slate-500 shrink-0">Sub-category:</span>
          <span className="font-semibold text-slate-800 text-right">
            {draftProduct.subCategory ? (
              <span className="text-slate-800">{draftProduct.subCategory}</span>
            ) : (
              <span className="text-slate-400 italic">Not selected</span>
            )}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2 pt-1.5">
          <span className="text-slate-500 shrink-0">Product Type:</span>
          <span className="font-semibold text-slate-800 text-right">
            {draftProduct.productType ? (
              <span className="text-slate-800">{draftProduct.productType}</span>
            ) : (
              <span className="text-slate-400 italic">Not selected</span>
            )}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2 pt-1.5">
          <span className="text-slate-500 shrink-0">Brand:</span>
          <span className="text-right">
            {draftProduct.brand && draftProduct.brand !== 'Generic / Unbranded' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200">
                {draftProduct.brand}
              </span>
            ) : (
              <span className="font-medium text-slate-600">Generic / Unbranded</span>
            )}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2 pt-1.5">
          <span className="text-slate-500 shrink-0">HSN Code:</span>
          <span className="font-mono text-right">
            {draftProduct.hsnCode ? (
              <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                {draftProduct.hsnCode}
              </span>
            ) : (
              <span className="text-slate-400 italic font-sans">Not entered</span>
            )}
          </span>
        </div>

        {/* Pricing if available */}
        {(priceVal !== null || mrpVal !== null) && (
          <div className="flex items-start justify-between gap-2 pt-1.5">
            <span className="text-slate-500 shrink-0">Price:</span>
            <div className="text-right">
              {priceVal !== null && (
                <span className="font-bold text-slate-900">
                  ₹{priceVal.toLocaleString('en-IN')}
                </span>
              )}
              {mrpVal !== null && (
                <span className="text-[11px] text-slate-400 line-through ml-1.5">
                  ₹{mrpVal.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Variants / Stock if available */}
        {(hasVariants || (typeof draftProduct.stock === 'number' && draftProduct.stock > 0)) && (
          <div className="flex items-start justify-between gap-2 pt-1.5">
            <span className="text-slate-500 shrink-0">Variants / Stock:</span>
            <span className="font-semibold text-slate-800 text-right">
              {hasVariants
                ? `${draftProduct.variants!.length} Matrix Variants`
                : `${draftProduct.stock} Units`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const WizardHelpSidebar: React.FC<WizardHelpSidebarProps> = ({ step }) => {
  const [openSection1, setOpenSection1] = useState(true);
  const [openSection2, setOpenSection2] = useState(true);

  if (step === 1) {
    return (
      <div className="space-y-4">
        {/* Real-Time Product Info Snapshot (Replaces static Example card) */}
        <LiveProductInfoCard />

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
          {/* Header */}
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Need Help?</h4>
          </div>

          {/* Accordion Item 1 */}
          <div className="border-b border-slate-100 py-2.5">
            <button
              type="button"
              onClick={() => setOpenSection1(!openSection1)}
              className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <span>How to choose the right category?</span>
              {openSection1 ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
            {openSection1 && (
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                Select the most relevant category, sub-category and product type for your product.
                This helps customers find your product easily and improves search ranking.
              </p>
            )}
          </div>

          {/* Accordion Item 2 */}
          <div className="pt-2.5">
            <button
              type="button"
              onClick={() => setOpenSection2(!openSection2)}
              className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <span>Brand Guidelines</span>
              {openSection2 ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
            {openSection2 && (
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                List products only under brands that you are authorized to sell. If your brand is
                not listed, you can request for approval. Approval usually takes 1–3 business days.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        {/* Real-Time Product Info Snapshot (Replaces static Example card) */}
        <LiveProductInfoCard />

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
          {/* Header */}
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Need Help?</h4>
          </div>

          {/* Accordion Item 1: Image Guidelines */}
          <div className="border-b border-slate-100 py-2.5">
            <button
              type="button"
              onClick={() => setOpenSection1(!openSection1)}
              className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <span>Image Guidelines</span>
              {openSection1 ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
            {openSection1 && (
              <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-slate-500">
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Upload clear, high-resolution images (min. 500x500 px).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Use a plain white or neutral clean background.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Show multiple angles (front, back, side, neck shot, zoom).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Supported formats: JPG, PNG, WEBP (Max 10MB each).</span>
                </li>
              </ul>
            )}
          </div>

          {/* Accordion Item 2: Product Title Guidelines */}
          <div className="pt-2.5">
            <button
              type="button"
              onClick={() => setOpenSection2(!openSection2)}
              className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <span>Product Title Guidelines</span>
              {openSection2 ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
            {openSection2 && (
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                Use a clear and descriptive title with key details like brand, product type, color,
                and key fabric. Avoid all caps or promotional spam.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 3 guidance
  return (
    <div className="space-y-4">
      {/* Real-Time Product Info Snapshot */}
      <LiveProductInfoCard />

      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
          <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Need Help?</h4>
        </div>

        <div className="space-y-3 text-xs text-slate-600">
          <div>
            <h6 className="font-semibold text-slate-800">Pricing & Tax</h6>
            <p className="text-[11px] text-slate-500 mt-1">
              Ensure selling price is less than or equal to MRP. Correct tax rates ensure GST
              compliance on invoicing.
            </p>
          </div>
          <div>
            <h6 className="font-semibold text-slate-800">Storage & Warehouse</h6>
            <p className="text-[11px] text-slate-500 mt-1">
              Providing bin and shelf coordinates speeds up dispatch runner order picking by up to
              60%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardHelpSidebar;
