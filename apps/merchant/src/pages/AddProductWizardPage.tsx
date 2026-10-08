import React from 'react';
import { ChevronRight, Bookmark, ArrowLeft, Eye } from 'lucide-react';
import { useCatalogStore } from '../stores/catalogStore.js';
import { CatalogWizardStepper } from '../components/catalog/wizard/CatalogWizardStepper.js';
import { AddProductStep1 } from '../components/catalog/wizard/AddProductStep1.js';
import { AddProductStep2 } from '../components/catalog/wizard/AddProductStep2.js';
import { AddProductStep3 } from '../components/catalog/wizard/AddProductStep3.js';

export const AddProductWizardPage: React.FC = () => {
  const { wizardStep, setWizardStep, setActiveView, saveDraftAsProduct } = useCatalogStore();

  const handleCancel = () => {
    setActiveView('list');
  };

  const handleSaveAsDraft = async () => {
    try {
      await saveDraftAsProduct();
      alert('Product saved as draft!');
      setActiveView('list');
    } catch (err: any) {
      alert(`Failed to save draft: ${err?.message || 'Unknown error'}`);
    }
  };

  const getStepSubtitle = () => {
    switch (wizardStep) {
      case 1:
        return 'List your product in 3 simple steps';
      case 2:
        return 'Add product images and basic information.';
      case 3:
        return 'Set pricing, inventory, shipping and other details to complete your listing.';
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {/* Breadcrumbs */}
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
            <span className="font-semibold text-slate-700">Add Product</span>
          </nav>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add Product</h1>
          <p className="text-xs text-slate-500 mt-0.5">{getStepSubtitle()}</p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCancel}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200/90 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveAsDraft}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-blue-600" />
            <span>Save as Draft</span>
          </button>

          {wizardStep > 1 && (
            <button
              type="button"
              onClick={() => setWizardStep((wizardStep - 1) as 1 | 2)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {wizardStep === 3 && (
            <button
              type="button"
              onClick={() => setActiveView('preview')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview &amp; Submit</span>
            </button>
          )}
        </div>
      </div>

      {/* 3-Step Stepper Header */}
      <CatalogWizardStepper />

      {/* Step Content */}
      {wizardStep === 1 && <AddProductStep1 />}
      {wizardStep === 2 && <AddProductStep2 />}
      {wizardStep === 3 && <AddProductStep3 />}
    </div>
  );
};
