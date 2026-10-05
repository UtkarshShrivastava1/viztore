import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  HelpCircle,
  Percent,
  DollarSign,
  Truck,
  RotateCw,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  Rocket,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import { useMarketingStore, CouponItem } from '../../stores/marketingStore.js';
import { SelectProductsModal } from './SelectProductsModal.js';
import { SelectCategoriesModal } from './SelectCategoriesModal.js';

interface CreateCouponWizardProps {
  onClose?: () => void;
}

export const CreateCouponWizard: React.FC<CreateCouponWizardProps> = ({ onClose }) => {
  const { addCoupon, closeCreateCouponWizard, setActiveSubTab } = useMarketingStore();

  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [code, setCode] = useState('SUMMER20');
  const [name, setName] = useState('Summer Sale - 20% Off');
  const [description, setDescription] = useState(
    'Get 20% off on your favorite fashion styles this summer!'
  );
  const [discountType, setDiscountType] = useState<'Percentage' | 'Fixed Amount' | 'Free Shipping'>(
    'Percentage'
  );
  const [discountValue, setDiscountValue] = useState(20);
  const [maxDiscount, setMaxDiscount] = useState(1000);
  const [minOrderValue, setMinOrderValue] = useState(999);
  const [usageLimit, setUsageLimit] = useState<'Limited' | 'Unlimited'>('Limited');
  const [maxUsage, setMaxUsage] = useState(1000);
  const [applicableOn, setApplicableOn] = useState<
    'All Products' | 'Selected Products' | 'Selected Categories'
  >('All Products');

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([
    'PRD-001',
    'PRD-002',
    'PRD-003',
    'PRD-004',
    'PRD-005',
  ]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>([
    'Men Fashion',
    'Women Fashion',
  ]);

  const [startDate, setStartDate] = useState('2024-05-20');
  const [endDate, setEndDate] = useState('2024-06-20');
  const [showOnStore, setShowOnStore] = useState(true);
  const [multiplePerCustomer, setMultiplePerCustomer] = useState(true);
  const [combineOffers, setCombineOffers] = useState(false);
  const [confirmed, setConfirmed] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleGenerateCode = () => {
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    setCode(`SALE${randomChars}`);
  };

  const handleCreateCoupon = () => {
    const benefitText =
      discountType === 'Percentage'
        ? `${discountValue}% OFF Max ₹${maxDiscount}`
        : discountType === 'Fixed Amount'
        ? `₹${discountValue} Flat OFF`
        : 'Free Delivery';

    addCoupon({
      code: code.trim(),
      title: name.trim(),
      type: discountType,
      benefit: benefitText,
      applicableOn:
        applicableOn === 'All Products'
          ? 'All Products'
          : applicableOn === 'Selected Products'
          ? `${selectedProductIds.length} Products`
          : `${selectedCategoryNames.length} Categories`,
      startDate: '20 May 2024',
      endDate: '20 Jun 2024',
      totalLimit: usageLimit === 'Limited' ? maxUsage : 9999,
      status: 'Active',
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      if (onClose) onClose();
      else closeCreateCouponWizard();
      setActiveSubTab('discounts_coupons');
    }, 1200);
  };

  const handleCancel = () => {
    if (onClose) onClose();
    else closeCreateCouponWizard();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="hover:text-slate-600 cursor-pointer" onClick={handleCancel}>Home</span>
            <span>&gt;</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={handleCancel}>Marketing</span>
            <span>&gt;</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={handleCancel}>Discounts &amp; Coupons</span>
            <span>&gt;</span>
            <span className="text-slate-800 font-bold">Create Coupon</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Create Coupon
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create a coupon code to attract more customers and boost your sales.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Coupon setup guide')}
          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Need Help?</span>
        </button>
      </div>

      {/* 2-Step Stepper Bar (12.7a.png) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs">
        <div className="flex items-center justify-between max-w-xl mx-auto">
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
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                Fill the Information
              </span>
            </div>
          </div>

          <div className={`flex-1 h-0.5 mx-4 ${step > 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              2
            </div>
            <span className={`text-xs font-bold ${step === 2 ? 'text-slate-900' : 'text-slate-400'}`}>
              Review &amp; Create
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: FILL THE INFORMATION (12.7a.png) */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Form Fields (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* 1. Basic Information */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Basic Information</h3>
                <p className="text-[11px] text-slate-400">Set the basic details for your coupon.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Coupon Code */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Coupon Code <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SUMMER20"
                      className="w-full pl-3 pr-8 py-1.5 uppercase font-mono font-bold bg-white border border-slate-200 rounded-lg text-xs tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateCode}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 p-0.5"
                      title="Generate random code"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Use a unique and easy to remember code (e.g. SUMMER20)
                  </span>
                </div>

                {/* Coupon Name */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Coupon Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Summer Sale - 20% Off"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    This will be visible to customers.
                  </span>
                </div>
              </div>

              {/* Coupon Description */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    Coupon Description (Optional)
                  </label>
                  <span className="text-[10px] text-slate-400">{description.length}/100</span>
                </div>
                <textarea
                  rows={2}
                  maxLength={100}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Get 20% off on your favorite fashion styles this summer!"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* 2. Discount & Benefits */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Discount &amp; Benefits</h3>
                <p className="text-[11px] text-slate-400">Choose the type and value of discount.</p>
              </div>

              {/* 3 Type Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Percentage */}
                <div
                  onClick={() => setDiscountType('Percentage')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    discountType === 'Percentage'
                      ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Percent className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">Percentage</span>
                      <span className="text-[10px] text-slate-400">Discount on order value</span>
                    </div>
                  </div>
                  {discountType === 'Percentage' && (
                    <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {/* Fixed Amount */}
                <div
                  onClick={() => setDiscountType('Fixed Amount')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    discountType === 'Fixed Amount'
                      ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <span className="font-bold text-sm">₹</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">Fixed Amount</span>
                      <span className="text-[10px] text-slate-400">Flat discount amount</span>
                    </div>
                  </div>
                  {discountType === 'Fixed Amount' && (
                    <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {/* Free Shipping */}
                <div
                  onClick={() => setDiscountType('Free Shipping')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    discountType === 'Free Shipping'
                      ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">Free Shipping</span>
                      <span className="text-[10px] text-slate-400">Waive delivery charges</span>
                    </div>
                  </div>
                  {discountType === 'Free Shipping' && (
                    <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Discount inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Discount Value <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      className="w-full pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      {discountType === 'Percentage' ? '%' : '₹'}
                    </span>
                  </div>
                </div>

                {discountType === 'Percentage' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Maximum Discount (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={maxDiscount}
                        onChange={(e) => setMaxDiscount(Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Set a maximum discount limit per order.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Rules & Conditions */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Rules &amp; Conditions</h3>
                <p className="text-[11px] text-slate-400">Set when and where this coupon can be used.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Minimum Order Value (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={minOrderValue}
                      onChange={(e) => setMinOrderValue(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Enter minimum cart value to apply coupon.
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Usage Limit</label>
                  <select
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option>Limited</option>
                    <option>Unlimited</option>
                  </select>
                </div>

                {usageLimit === 'Limited' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Maximum Usage <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={maxUsage}
                      onChange={(e) => setMaxUsage(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Total number of times this coupon can be used.
                    </span>
                  </div>
                )}
              </div>

              {/* Applicable On Radios (12.7a.png) */}
              <div className="pt-2 border-t border-slate-100">
                <label className="text-[11px] font-bold text-slate-700 block mb-2">Applicable On</label>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="applicableOn"
                      checked={applicableOn === 'All Products'}
                      onChange={() => setApplicableOn('All Products')}
                      className="text-blue-600"
                    />
                    <span>All Products</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="applicableOn"
                      checked={applicableOn === 'Selected Products'}
                      onChange={() => {
                        setApplicableOn('Selected Products');
                        setIsProductModalOpen(true);
                      }}
                      className="text-blue-600"
                    />
                    <span>
                      Selected Products{' '}
                      {applicableOn === 'Selected Products' && (
                        <span className="text-blue-600 font-bold">({selectedProductIds.length})</span>
                      )}
                    </span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="applicableOn"
                      checked={applicableOn === 'Selected Categories'}
                      onChange={() => {
                        setApplicableOn('Selected Categories');
                        setIsCategoryModalOpen(true);
                      }}
                      className="text-blue-600"
                    />
                    <span>
                      Selected Categories{' '}
                      {applicableOn === 'Selected Categories' && (
                        <span className="text-blue-600 font-bold">
                          ({selectedCategoryNames.length})
                        </span>
                      )}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Validity, Settings & Live Preview (4 cols) (12.7a.png) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Validity Period */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Validity Period</h3>
                <p className="text-[11px] text-slate-400">Set the start and end date for your coupon.</p>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Additional Settings</h3>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Show coupon on store page
                    </span>
                    <span className="text-[10px] text-slate-400">Display this coupon to customers.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showOnStore}
                    onChange={(e) => setShowOnStore(e.target.checked)}
                    className="toggle rounded text-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Allow multiple usage per customer
                    </span>
                    <span className="text-[10px] text-slate-400">Let a customer use this coupon multiple times.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={multiplePerCustomer}
                    onChange={(e) => setMultiplePerCustomer(e.target.checked)}
                    className="toggle rounded text-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Combine with other offers
                    </span>
                    <span className="text-[10px] text-slate-400">Allow this coupon to be used with other discounts.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={combineOffers}
                    onChange={(e) => setCombineOffers(e.target.checked)}
                    className="toggle rounded text-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Live Coupon Preview Ticket (12.7a.png) */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">Coupon Preview</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  Preview
                </span>
              </div>

              {/* Realistic ticket */}
              <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-3 relative overflow-hidden flex items-center justify-between">
                <div className="space-y-1 min-w-0 pr-2">
                  <span className="font-mono text-sm font-black text-blue-900 block tracking-wider">
                    {code}
                  </span>
                  <p className="text-[10px] text-slate-600 line-clamp-2">{description}</p>
                  <div className="text-[9px] text-slate-400 pt-1">
                    Min. order ₹{minOrderValue} | Max. discount ₹{maxDiscount}
                  </div>
                </div>

                <div className="border-l border-dashed border-blue-300 pl-3 flex flex-col items-center justify-center shrink-0">
                  <span className="text-sm font-black text-blue-700">
                    {discountType === 'Percentage'
                      ? `${discountValue}%`
                      : discountType === 'Fixed Amount'
                      ? `₹${discountValue}`
                      : 'FREE'}
                  </span>
                  <span className="text-[9px] font-black text-blue-700 uppercase">OFF</span>
                </div>
              </div>
            </div>

            {/* Important Information card */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Important Information</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li>• Make sure the coupon code is easy to remember.</li>
                <li>• Set a reasonable validity period.</li>
                <li>• Track the performance of your coupons regularly.</li>
                <li>• You can edit or deactivate the coupon anytime.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: REVIEW & CREATE (12.7d.png) */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Full Review Card (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Review Coupon Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Please review all the details before creating the coupon. You can go back and edit if needed.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-lg border border-blue-200 flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Details</span>
              </button>
            </div>

            {/* Basic Information section */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Basic Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Coupon Code:</span>
                  <span className="font-mono font-bold text-slate-900">{code}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Coupon Name:</span>
                  <span className="font-bold text-slate-900">{name}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block text-[11px]">Description:</span>
                  <span className="text-slate-700">{description}</span>
                </div>
              </div>
            </div>

            {/* Discount & Benefits section */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Discount &amp; Benefits</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Discount Type:</span>
                  <span className="font-semibold text-slate-900">{discountType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Discount Value:</span>
                  <span className="font-bold text-slate-900">
                    {discountType === 'Percentage' ? `${discountValue}%` : `₹${discountValue}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Maximum Discount:</span>
                  <span className="font-semibold text-slate-900">₹{maxDiscount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Minimum Order Value:</span>
                  <span className="font-semibold text-slate-900">₹{minOrderValue}</span>
                </div>
              </div>
            </div>

            {/* Validity Period section */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Validity Period</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Start Date:</span>
                  <span className="font-semibold text-slate-900">20 May 2024</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">End Date:</span>
                  <span className="font-semibold text-slate-900">20 Jun 2024 (31 Days)</span>
                </div>
              </div>
            </div>

            {/* Rules & Conditions section */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Rules &amp; Conditions</h4>
              <div className="text-xs">
                <span className="text-slate-400 block text-[11px]">Usage Limit:</span>
                <span className="font-semibold text-slate-900">
                  {usageLimit === 'Limited' ? `Limited (${maxUsage.toLocaleString()} uses)` : 'Unlimited'}
                </span>
              </div>
            </div>

            {/* Applicable On section */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Applicable On</h4>
                  <span className="text-[11px] text-slate-400">
                    {applicableOn === 'All Products'
                      ? 'Applied to All Products'
                      : applicableOn === 'Selected Products'
                      ? `Selected Products (${selectedProductIds.length} products)`
                      : `Selected Categories (${selectedCategoryNames.length} categories)`}
                  </span>
                </div>
                {applicableOn !== 'All Products' && (
                  <button
                    type="button"
                    onClick={() =>
                      applicableOn === 'Selected Products'
                        ? setIsProductModalOpen(true)
                        : setIsCategoryModalOpen(true)
                    }
                    className="text-xs text-blue-600 font-bold"
                  >
                    View All
                  </button>
                )}
              </div>
            </div>

            {/* Additional Settings section */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Additional Settings</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-700">Show coupon on store page: Enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-700">Allow multiple usage per customer: Enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Combine with other offers: Disabled</span>
                </div>
              </div>
            </div>

            {/* Success alert */}
            {isSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Coupon created successfully!</span>
              </div>
            )}
          </div>

          {/* Right Column: Preview & Checklist (4 cols) (12.7d.png) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Live Coupon Preview */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">Coupon Preview</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  How it will appear
                </span>
              </div>

              <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-3 relative overflow-hidden flex items-center justify-between">
                <div className="space-y-1 min-w-0 pr-2">
                  <span className="font-mono text-sm font-black text-blue-900 block tracking-wider">
                    {code}
                  </span>
                  <p className="text-[10px] text-slate-600 line-clamp-2">{description}</p>
                  <div className="text-[9px] text-slate-400 pt-1">
                    Min. order ₹{minOrderValue} | Max. discount ₹{maxDiscount}
                  </div>
                </div>

                <div className="border-l border-dashed border-blue-300 pl-3 flex flex-col items-center justify-center shrink-0">
                  <span className="text-sm font-black text-blue-700">
                    {discountType === 'Percentage' ? `${discountValue}%` : `₹${discountValue}`}
                  </span>
                  <span className="text-[9px] font-black text-blue-700 uppercase">OFF</span>
                </div>
              </div>
            </div>

            {/* Before You Create Checklist */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900">Before You Create</h4>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Coupon code is unique and easy to remember</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All details are correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Validity period is set</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Rules and conditions are configured</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Coupon is ready to be published</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Step Actions Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => (step === 1 ? handleCancel() : setStep(1))}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
        >
          {step === 2 && <ArrowLeft className="w-4 h-4" />}
          <span>{step === 1 ? 'Cancel' : 'Back'}</span>
        </button>

        {step === 1 ? (
          <button
            type="button"
            disabled={!code.trim() || !name.trim()}
            onClick={() => setStep(2)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>I confirm that the above details are correct.</span>
            </label>

            <button
              type="button"
              disabled={!confirmed}
              onClick={handleCreateCoupon}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
            >
              <Rocket className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>
        )}
      </div>

      {/* Modals via createPortal */}
      <SelectProductsModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        selectedIds={selectedProductIds}
        onApply={(ids) => setSelectedProductIds(ids)}
      />

      <SelectCategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selectedCategories={selectedCategoryNames}
        onApply={(cats) => setSelectedCategoryNames(cats)}
      />
    </div>
  );
};
