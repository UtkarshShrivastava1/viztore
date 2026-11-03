import React from 'react';
import {
  Edit2,
  FolderTree,
  FileCheck,
  Award,
  Image,
  FileText,
  Tag,
  Sliders,
  MapPin,
  CircleDollarSign,
  Package,
} from 'lucide-react';
import { ProductItem, WizardStep, useCatalogStore } from '../../../stores/catalogStore.js';
import { getDisplayAttributes } from '../../../lib/taxonomyHelper.js';

interface SummaryReviewCardsProps {
  product: Partial<ProductItem>;
}

export const SummaryReviewCards: React.FC<SummaryReviewCardsProps> = ({ product }) => {
  const { setWizardStep, setActiveView } = useCatalogStore();

  const handleJumpToStep = (step: WizardStep) => {
    setWizardStep(step);
    setActiveView('wizard');
  };

  const displayAttrs = React.useMemo(() => getDisplayAttributes(product), [product]);
  const attrs = product.attributes || {};
  const storage = product.storageLocation || { warehouse: 'Main Warehouse' };
  const tax = product.tax || { category: 'Apparel (5%)', rate: 5, inclusive: false };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Category & Type */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <FolderTree className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">1. Category &amp; Product Type</h4>
          </div>
          <button
            type="button"
            onClick={() => handleJumpToStep(1)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400">Category:</span>
            <span className="font-semibold text-slate-800">{product.category || 'General'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Sub-category:</span>
            <span className="font-semibold text-slate-800">{product.subCategory || 'General'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Product Type:</span>
            <span className="font-semibold text-slate-800">
              {product.productType || 'Standard'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Product Identification */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileCheck className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">2. Product Identification</h4>
          </div>
          <button
            type="button"
            onClick={() => handleJumpToStep(1)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400">Listing Type:</span>
            <span className="font-semibold text-slate-800">
              {product.productIdentification === 'existing'
                ? 'Existing Catalog Item'
                : 'New Independent Product'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Master Catalog Sync:</span>
            <span className="text-emerald-600 font-semibold">Enabled</span>
          </div>
        </div>
      </div>

      {/* 3. Brand & HSN Setup */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">3. Brand &amp; HSN Compliance</h4>
          </div>
          <button
            type="button"
            onClick={() => handleJumpToStep(1)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400">Brand / Manufacturer:</span>
            <span className="font-semibold text-slate-800">{product.brand || 'Generic / In-House'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">HSN Code:</span>
            <span className="font-mono font-semibold text-slate-800">
              {product.hsnCode || 'Standard Tax Code'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Product Images */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Image className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">4. Photos &amp; Media</h4>
          </div>
          <button
            type="button"
            onClick={() => handleJumpToStep(2)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2 overflow-hidden py-1">
            {product.images?.slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={img}
                alt="preview"
                className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-2xs"
              />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-600">
            {product.images?.length || 0} photo{(product.images?.length || 0) !== 1 ? 's' : ''} uploaded
          </span>
        </div>
      </div>

      {/* 5. Product Information & Description */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs md:col-span-2">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">5. Title &amp; Description</h4>
          </div>
          <button
            type="button"
            onClick={() => handleJumpToStep(2)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="space-y-1.5 text-xs text-slate-600">
          <div>
            <span className="text-slate-400">Title: </span>
            <span className="font-bold text-slate-800">{product.name}</span>
          </div>
          <div>
            <span className="text-slate-400">Description: </span>
            <span className="text-slate-700 leading-relaxed">{product.description}</span>
          </div>
        </div>
      </div>

      {/* 6. Keywords & Tags */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">6. Search Keywords</h4>
          </div>
          <button
            type="button"
            onClick={() => handleJumpToStep(3)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {product.tags?.map((t, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 7. Product Attributes & Variants */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">7. Product Attributes</h4>
          </div>
          <button
            type="button"
            onClick={() => handleJumpToStep(3)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        {displayAttrs.length > 0 ? (
          <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600">
            {displayAttrs.map((da, idx) => (
              <div key={idx} className="truncate">
                {da.label}: <strong className="text-slate-800">{da.value}</strong>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic py-1">
            Standard specifications (no custom attributes specified)
          </div>
        )}
      </div>

      {/* 8. Storage Location */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">8. Storage Location</h4>
          </div>
          <button
            type="button"
            onClick={() => handleJumpToStep(3)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="space-y-1 text-xs text-slate-600">
          <div>Warehouse: <strong className="text-slate-800">{storage.warehouse || "Not specified"}</strong></div>
          <div>
            Location: {storage.room ? `${storage.room} â€¢ ` : ''}Rack: {storage.rack || '-'} â€¢ Shelf: {storage.shelf || '-'} â€¢ Bin: {storage.bin || '-'}
          </div>
        </div>
      </div>

      {/* 9. Pricing & Taxes */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <CircleDollarSign className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">9. Pricing &amp; Taxes</h4>
          </div>
          <button
            type="button"
            onClick={() => handleJumpToStep(3)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600">
          <div>Selling Price: <strong className="text-slate-900">{product.price ? `₹${product.price}` : "Not set"}</strong></div>
          <div>MRP: <strong className="text-slate-500 line-through">{product.mrp ? `₹${product.mrp}` : "-"}</strong></div>
          <div>Tax Rate: <strong className="text-slate-800">{tax.rate}% ({(tax.category || 'Standard').replace(/\s*\(\d+%\)/, '')})</strong></div>
          <div>Tax Inclusive: <strong className="text-slate-800">{tax.inclusive ? 'Yes' : 'No'}</strong></div>
        </div>
      </div>

      {/* 10. Inventory & Compliance */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs md:col-span-2">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">10. Inventory &amp; Compliance</h4>
          </div>
          <button
            type="button"
            onClick={() => handleJumpToStep(3)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600">
          <div>Stock: <strong className="text-slate-900">{product.stock} units</strong></div>
          <div>Low Alert: <strong className="text-slate-800">{product.lowStockThreshold} units</strong></div>
          <div>Origin: <strong className="text-slate-800">{product.countryOfOrigin || 'India'}</strong></div>
          <div>Returnable: <strong className="text-slate-800">{product.isReturnable ? 'Yes' : 'No'}</strong></div>
        </div>
      </div>
    </div>
  );
};
