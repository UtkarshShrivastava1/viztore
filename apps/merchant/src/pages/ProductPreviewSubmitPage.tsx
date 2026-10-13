import React, { useState } from 'react';
import {
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  Printer,
  Sparkles,
  Tag,
  Bookmark,
  Send,
} from 'lucide-react';
import { useCatalogStore } from '../stores/catalogStore.js';
import { ProductGalleryPreview } from '../components/catalog/preview/ProductGalleryPreview.js';
import { BarcodeLabelPreview } from '../components/catalog/preview/BarcodeLabelPreview.js';
import { SummaryReviewCards } from '../components/catalog/preview/SummaryReviewCards.js';
import { ProductLabelPrintModal } from '../components/catalog/ProductLabelPrintModal.js';

export const ProductPreviewSubmitPage: React.FC = () => {
  const {
    draftProduct,
    setWizardStep,
    setActiveView,
    saveDraftAsProduct,
    openPrintLabelModal,
  } = useCatalogStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBackToEdit = () => {
    setWizardStep(3);
    setActiveView('wizard');
  };

  const handleSaveProduct = async () => {
    setIsSubmitting(true);
    try {
      const saved = await saveDraftAsProduct();
      alert(`Product "${saved.name}" published successfully!`);
      setActiveView('list');
    } catch (err: any) {
      alert(`Failed to publish product: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndPrint = async () => {
    setIsSubmitting(true);
    try {
      const saved = await saveDraftAsProduct();
      openPrintLabelModal(saved);
    } catch (err: any) {
      alert(`Failed to publish product: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setIsSubmitting(true);
    try {
      await saveDraftAsProduct();
      alert('Product saved as draft!');
      setActiveView('list');
    } catch (err: any) {
      alert(`Failed to save draft: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mrp = Number(draftProduct.mrp ?? 699);
  const price = Number(draftProduct.price ?? 599);
  const cost = Number(draftProduct.costPrice ?? 350);
  const discountPct = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const margin = price - cost;
  const marginPct = price > 0 ? Math.round((margin / price) * 100) : 0;

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-16">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className="hover:text-slate-700 cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className="hover:text-slate-700 cursor-pointer"
            >
              Products / Catalog
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <button
              type="button"
              onClick={handleBackToEdit}
              className="hover:text-slate-700 cursor-pointer"
            >
              Add Product
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-semibold text-slate-700">Preview &amp; Submit</span>
          </nav>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Preview &amp; Submit
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review all product specifications and verify the barcode label before publishing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleBackToEdit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Edit</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAsDraft}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            onClick={handleSaveProduct}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Hero Preview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left (4 cols): Product Gallery Carousel */}
          <div className="lg:col-span-4">
            <ProductGalleryPreview images={draftProduct.images || []} />
          </div>

          {/* Center (5 cols): Product Details & Spec Chips */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {draftProduct.status === 'active' ? 'Active Listing' : 'Draft / Inactive'}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500">
                  {draftProduct.category} &gt; {draftProduct.subCategory}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
                {draftProduct.name || 'Men Black Round Neck T-Shirt'}
              </h2>

              <div className="mt-1 flex items-center gap-2 font-mono text-xs text-slate-500">
                <span>SKU: {draftProduct.sku}</span>
                <span>•</span>
                <span>Barcode: {draftProduct.barcode}</span>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                {mrp > price && (
                  <span className="text-sm font-medium text-slate-400 line-through">
                    ₹{mrp.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPct > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {discountPct}% OFF
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                <span>
                  Cost Price: <strong className="text-slate-700">₹{cost}</strong>
                </span>
                <span>•</span>
                <span>
                  Margin:{' '}
                  <strong className="text-emerald-600">
                    ₹{margin} ({marginPct}%)
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Tax: <strong className="text-slate-700">{draftProduct.tax?.rate || 5}%</strong>
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {draftProduct.description || 'No description provided.'}
              </p>
            </div>

            {/* Quick Attribute Chips */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Quick Specs
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Brand: <strong className="text-slate-900">{draftProduct.brand}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Size:{' '}
                  <strong className="text-slate-900">
                    {draftProduct.attributes?.size || 'M'}
                  </strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Color:{' '}
                  <strong className="text-slate-900">
                    {draftProduct.attributes?.color || 'Black'}
                  </strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Fit:{' '}
                  <strong className="text-slate-900">
                    {draftProduct.attributes?.fit || 'Regular'}
                  </strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Fabric:{' '}
                  <strong className="text-slate-900">
                    {draftProduct.attributes?.fabric || 'Cotton'}
                  </strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  HSN: <strong className="text-slate-900">{draftProduct.hsnCode}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right (3 cols): Actual-Size Barcode Label Preview */}
          <div className="lg:col-span-3 flex justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
            <BarcodeLabelPreview
              product={draftProduct}
              onPrint={() => openPrintLabelModal(draftProduct as any)}
            />
          </div>
        </div>
      </div>

      {/* 10 Review Cards Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Catalog Specification Review (10 Sections)
          </h3>
          <span className="text-xs text-slate-500">Click &ldquo;Edit&rdquo; to modify any section</span>
        </div>
        <SummaryReviewCards product={draftProduct} />
      </div>

      {/* Sticky Bottom Submission Footer */}
      <div className="fixed bottom-0 inset-x-0 z-30 px-6 py-3.5 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800">Ready for Listing</span>
            <span className="text-slate-400 mx-1.5">•</span>
            <span className="text-xs text-slate-500">10 of 10 specification sections complete</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleBackToEdit}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Back to Edit
          </button>

          <button
            type="button"
            onClick={handleSaveAndPrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span>Save &amp; Print Label</span>
          </button>

          <button
            type="button"
            onClick={handleSaveProduct}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Publishing...' : 'Save Product'}</span>
          </button>
        </div>
      </div>

      {/* Label Print Modal */}
      <ProductLabelPrintModal />
    </div>
  );
};
