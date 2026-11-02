import React from 'react';
import { Check } from 'lucide-react';
import { useCatalogStore, WizardStep } from '../../../stores/catalogStore.js';

interface StepDef {
  number: WizardStep;
  title: string;
  activeSubtitle: string;
  defaultSubtitle: string;
}

const steps: StepDef[] = [
  {
    number: 1,
    title: 'Category & Product Setup',
    activeSubtitle: 'Set category, product type and basic details',
    defaultSubtitle: 'Set category, product type and basic details',
  },
  {
    number: 2,
    title: 'Product Images & Information',
    activeSubtitle: 'Upload images and add product details',
    defaultSubtitle: 'Add product images and product details',
  },
  {
    number: 3,
    title: 'Pricing, Inventory & Compliance',
    activeSubtitle: 'Fill remaining details and submit',
    defaultSubtitle: 'Set price, stock, shipping and more',
  },
];

export const CatalogWizardStepper: React.FC = () => {
  const { wizardStep, setWizardStep, draftProduct } = useCatalogStore();

  const getCompletedSummary = (stepNum: WizardStep) => {
    if (stepNum === 1) {
      const cat = draftProduct.category || 'Category';
      const sub = draftProduct.subCategory || 'Sub-category';
      const type = draftProduct.productType || 'Product Type';
      const brand = draftProduct.brand && draftProduct.brand !== 'Generic / Unbranded' ? ` • Brand: ${draftProduct.brand}` : '';
      return `${cat} > ${sub} > ${type}${brand}`;
    }
    if (stepNum === 2) {
      const imgCount = draftProduct.images?.length || 0;
      return `${imgCount} image${imgCount !== 1 ? 's' : ''} uploaded • Info set`;
    }
    return 'Completed';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs mb-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {steps.map((step, index) => {
          const isCurrent = wizardStep === step.number;
          const isCompleted = wizardStep > step.number;
          const isClickable = isCompleted;

          return (
            <React.Fragment key={step.number}>
              <div
                onClick={() => isClickable && setWizardStep(step.number)}
                className={`flex items-center gap-3.5 flex-1 ${
                  isClickable ? 'cursor-pointer group' : ''
                }`}
              >
                {/* Circle / Badge */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                    isCompleted
                      ? 'bg-blue-600 text-white'
                      : isCurrent
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.number}
                </div>

                {/* Text Labels */}
                <div className="min-w-0">
                  <div
                    className={`text-xs font-bold leading-snug transition-colors ${
                      isCurrent
                        ? 'text-blue-600'
                        : isCompleted
                          ? 'text-slate-800 group-hover:text-blue-600'
                          : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {isCompleted
                      ? getCompletedSummary(step.number)
                      : isCurrent
                        ? step.activeSubtitle
                        : step.defaultSubtitle}
                  </div>
                </div>
              </div>

              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block w-12 lg:w-16 h-0.5 bg-slate-200 mx-2 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
