import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useMarketingStore, AdType } from '../../stores/marketingStore.js';
import { Step1AdTypeSelect } from './Step1AdTypeSelect.js';
import { Step2TargetEntity } from './Step2TargetEntity.js';
import { Step3BudgetBidding } from './Step3BudgetBidding.js';
import { Step4AdPreviewReview } from './Step4AdPreviewReview.js';

interface CreateAdvertisementWizardProps {
  onClose?: () => void;
}

export const CreateAdvertisementWizard: React.FC<CreateAdvertisementWizardProps> = ({ onClose }) => {
  const { addAdvertisement, closeCreateAdWizard, setActiveSubTab, draftAd } = useMarketingStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedType, setSelectedType] = useState<AdType>(draftAd.type || 'Sponsored Product');

  // Step 2 product selection
  const [selectedProduct, setSelectedProduct] = useState({
    id: draftAd.productId || 'PRD-10245',
    name: draftAd.productName || 'Men Checked Shirt',
    sku: draftAd.productSku || '#P54321',
    price: draftAd.productPrice || 699,
    rating: draftAd.productRating || 4.5,
    reviews: draftAd.productReviews || 120,
    sizes: 'M, L, XL',
    color: 'Red',
    category: draftAd.productCategory || 'Men',
    subcategory: draftAd.productSubcategory || 'Top Wear',
    image:
      draftAd.productImage ||
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&auto=format&fit=crop&q=80',
    stock: 18,
  });

  // Step 3 Duration & Schedule
  const [selectedDuration, setSelectedDuration] = useState<'3 Days' | '7 Days' | '15 Days' | '30 Days'>(
    draftAd.planDuration || '7 Days'
  );
  const [startDate, setStartDate] = useState('2024-05-20');
  const [endDate, setEndDate] = useState('2024-05-26');
  const [isSuccess, setIsSuccess] = useState(false);

  const durationPricing = {
    '3 Days': { price: 499, perDay: 166 },
    '7 Days': { price: 1299, perDay: 185 },
    '15 Days': { price: 2499, perDay: 167 },
    '30 Days': { price: 3999, perDay: 133 },
  };

  const currentPrice = durationPricing[selectedDuration].price;

  const handleLaunchAd = () => {
    addAdvertisement({
      name:
        selectedType === 'Sponsored Product'
          ? selectedProduct.name
          : selectedType === 'Sponsored Store'
          ? 'Fashion Hub Store Spotlight'
          : selectedType === 'Category Promotion'
          ? `${selectedProduct.category} Category Spotlight`
          : 'Promotional Banner Ad',
      subtitle:
        selectedType === 'Sponsored Product'
          ? `Product: ${selectedProduct.color}, ${selectedProduct.sizes.split(',')[0]}`
          : 'Active Store Showcase',
      type: selectedType,
      duration: selectedDuration,
      amount: currentPrice,
      budgetDaily: durationPricing[selectedDuration].perDay,
      startDate: startDate,
      endDate: endDate,
      status: 'Active',
      imageUrl: selectedProduct.image,
      targetId: selectedProduct.sku,
      targetName: selectedProduct.name,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      if (onClose) onClose();
      else closeCreateAdWizard();
      setActiveSubTab('advertisements');
    }, 1200);
  };

  const handleBackToAdvertisements = () => {
    if (onClose) onClose();
    else closeCreateAdWizard();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Breadcrumb & Header (12.2.png) */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="hover:text-slate-600 cursor-pointer" onClick={handleBackToAdvertisements}>
              Home
            </span>
            <span>&gt;</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={handleBackToAdvertisements}>
              Marketing
            </span>
            <span>&gt;</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={handleBackToAdvertisements}>
              Advertisements
            </span>
            <span>&gt;</span>
            <span className="text-slate-800 font-bold">Create Advertisement</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Create Advertisement
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose the right type of advertisement to promote your products, offers and store.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Advertisement guidelines & bidding documentation')}
          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Need Help?</span>
        </button>
      </div>

      {/* 4-Step Stepper Bar (12.2a.png) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step > 1 ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
              }`}
            >
              {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
            </div>
            <div className="text-left">
              <span
                className={`text-xs font-bold block leading-tight ${
                  step >= 1 ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                Select Type
              </span>
              {step > 1 && <span className="text-[10px] text-slate-400 block">{selectedType}</span>}
            </div>
          </div>

          <div className={`flex-1 h-0.5 mx-3 ${step > 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step > 2
                  ? 'bg-blue-600 text-white'
                  : step === 2
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {step > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
            </div>
            <div className="text-left">
              <span
                className={`text-xs font-bold block leading-tight ${
                  step >= 2 ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                Target Entity
              </span>
              {step > 2 && (
                <span className="text-[10px] text-slate-400 block truncate max-w-[100px]">
                  {selectedProduct.name}
                </span>
              )}
            </div>
          </div>

          <div className={`flex-1 h-0.5 mx-3 ${step > 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />

          {/* Step 3 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step > 3
                  ? 'bg-blue-600 text-white'
                  : step === 3
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {step > 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
            </div>
            <div className="text-left">
              <span
                className={`text-xs font-bold block leading-tight ${
                  step >= 3 ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                Duration &amp; Bidding
              </span>
              {step > 3 && <span className="text-[10px] text-slate-400 block">{selectedDuration}</span>}
            </div>
          </div>

          <div className={`flex-1 h-0.5 mx-3 ${step > 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />

          {/* Step 4 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 4 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              4
            </div>
            <div className="text-left">
              <span
                className={`text-xs font-bold block leading-tight ${
                  step === 4 ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                Review &amp; Pay
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {isSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs font-bold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Campaign launched successfully! Deducted ₹{currentPrice.toLocaleString()} from store wallet. Redirecting to active campaigns...
          </span>
        </div>
      )}

      {/* Step Components Rendering */}
      <div>
        {step === 1 ? (
          <Step1AdTypeSelect
            selectedType={selectedType}
            onSelectType={(type) => setSelectedType(type)}
            onNext={() => setStep(2)}
            onCancel={handleBackToAdvertisements}
          />
        ) : step === 2 ? (
          <Step2TargetEntity
            selectedType={selectedType}
            selectedProduct={selectedProduct}
            onSelectProduct={(product) => setSelectedProduct(product)}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        ) : step === 3 ? (
          <Step3BudgetBidding
            selectedDuration={selectedDuration}
            onSelectDuration={(d) => setSelectedDuration(d)}
            startDate={startDate}
            endDate={endDate}
            onSetDates={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        ) : (
          <Step4AdPreviewReview
            selectedType={selectedType}
            selectedProduct={selectedProduct}
            selectedDuration={selectedDuration}
            startDate={startDate}
            endDate={endDate}
            onLaunch={handleLaunchAd}
            onBack={() => setStep(3)}
          />
        )}
      </div>
    </div>
  );
};
