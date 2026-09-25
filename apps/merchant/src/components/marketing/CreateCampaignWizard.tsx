import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Upload,
  Calendar,
  Clock,
  ChevronDown,
  Info,
  Sparkles,
  Search,
  ShoppingBag,
  ExternalLink,
  Edit,
  Lightbulb,
  Radio,
  Sliders,
  Users,
  Eye,
  Smartphone,
  Tag,
  IndianRupee,
  Layers,
} from 'lucide-react';
import { useMarketingStore } from '../../stores/marketingStore.js';

export const CreateCampaignWizard: React.FC = () => {
  const {
    wizardStep,
    setWizardStep,
    draftCampaign,
    updateDraftCampaign,
    launchDraftCampaign,
    saveDraftCampaign,
    resetDraftCampaign,
    setActiveCampaignView,
  } = useMarketingStore();

  const [activeBannerTab, setActiveBannerTab] = useState<'upload' | 'design'>('upload');

  const steps = [
    { number: 1, title: 'Campaign Details', subtitle: 'Name, goal and duration' },
    { number: 2, title: 'Banner & Content', subtitle: 'Design your banner and content' },
    { number: 3, title: 'Target Audience', subtitle: 'Choose who will see this' },
    { number: 4, title: 'Display Settings', subtitle: 'Where and how to show' },
    { number: 5, title: 'Review & Launch', subtitle: 'Review and launch campaign' },
  ];

  const handleNext = () => {
    if (wizardStep < 5) {
      setWizardStep(wizardStep + 1);
    } else {
      launchDraftCampaign();
    }
  };

  const handleBack = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      updateDraftCampaign({ bannerImageUrl: fakeUrl });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row (13.2.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Create Campaign</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create engaging in-app campaigns to promote offers and drive more sales.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={saveDraftCampaign}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={launchDraftCampaign}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            Launch Campaign
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout: Left Stepper, Middle Form Step, Right Mobile Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 5-Step Stepper (2.5 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-4">
            {steps.map((s) => {
              const isCurrent = wizardStep === s.number;
              const isPast = wizardStep > s.number;

              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => setWizardStep(s.number)}
                  className={`w-full flex items-start gap-3 text-left p-2.5 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-blue-50/80 border border-blue-200'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isPast
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : s.number}
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`text-xs font-bold leading-tight ${
                        isCurrent ? 'text-blue-900' : 'text-slate-700'
                      }`}
                    >
                      {s.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-snug truncate">
                      {s.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Need Help Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <h5 className="text-xs font-bold text-slate-900">Need Help?</h5>
            <p className="text-[11px] text-slate-500 mt-1">Learn how campaigns work</p>
            <button
              type="button"
              onClick={() => alert('Opening interactive merchant marketing video guide...')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 mt-3"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Watch Guide</span>
            </button>
          </div>
        </div>

        {/* Middle Column: Current Step Interactive Form (5.5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          {/* STEP 1: CAMPAIGN DETAILS (13.2.png) */}
          {wizardStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Campaign Details</h3>
                <p className="text-xs text-slate-500">Set basic details for your campaign.</p>
              </div>

              {/* Campaign Name & Goal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Campaign Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={draftCampaign.name}
                    onChange={(e) => updateDraftCampaign({ name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Summer Sale - Get 20% Off"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Campaign Goal
                  </label>
                  <select
                    value={draftCampaign.goal}
                    onChange={(e) => updateDraftCampaign({ goal: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                  >
                    <option>Increase Sales</option>
                    <option>Customer Acquisition</option>
                    <option>Promote Products</option>
                    <option>Brand Awareness</option>
                    <option>Clearance Inventory</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Description (Optional)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {draftCampaign.description.length}/200
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={draftCampaign.description}
                  onChange={(e) => updateDraftCampaign({ description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Flat 20% off on all Men's Wear products."
                />
              </div>

              {/* Campaign Duration */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Campaign Duration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Start Date & Time <span className="text-rose-500">*</span>
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={draftCampaign.startDate}
                        onChange={(e) => updateDraftCampaign({ startDate: e.target.value })}
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl"
                      />
                      <input
                        type="text"
                        value={draftCampaign.startTime}
                        onChange={(e) => updateDraftCampaign({ startTime: e.target.value })}
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl"
                        placeholder="10:00 AM"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      End Date & Time <span className="text-rose-500">*</span>
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={draftCampaign.endDate}
                        onChange={(e) => updateDraftCampaign({ endDate: e.target.value })}
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl"
                      />
                      <input
                        type="text"
                        value={draftCampaign.endTime}
                        onChange={(e) => updateDraftCampaign({ endTime: e.target.value })}
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl"
                        placeholder="11:59 PM"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner Upload Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Banner</label>
                <p className="text-[11px] text-slate-500 mb-3">
                  Upload or design the banner that will be shown in the app.
                </p>

                <div className="flex border-b border-slate-200 mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveBannerTab('upload')}
                    className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all ${
                      activeBannerTab === 'upload'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Upload Banner
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveBannerTab('design')}
                    className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                      activeBannerTab === 'design'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span>Design Banner</span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1 rounded-sm">
                      New
                    </span>
                  </button>
                </div>

                <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
                  Upload Banner Image <span className="text-rose-500">*</span>
                  <span className="text-[10px] text-slate-400 font-normal ml-2">
                    Recommended size: 1200 x 600 px (JPG, PNG)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="h-28 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
                    <img
                      src={draftCampaign.bannerImageUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <label className="h-28 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 cursor-pointer flex flex-col items-center justify-center p-3 text-center transition-all">
                    <Upload className="w-5 h-5 text-blue-600 mb-1" />
                    <span className="text-xs font-bold text-slate-800">
                      Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG up to 2MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Alt Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={draftCampaign.bannerAltText}
                    onChange={(e) => updateDraftCampaign({ bannerAltText: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
                    placeholder="Summer Sale Banner"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BANNER & CONTENT (13.21.png) */}
          {wizardStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Banner & Content</h3>
                <p className="text-xs text-slate-500">Create the banner and content for your campaign.</p>
              </div>

              {/* Banner preview & change */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Banner Image <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-slate-400 block mb-2">
                  Recommended size: 1200 x 600 px (JPG, PNG)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="relative h-28 rounded-xl border border-slate-200 overflow-hidden bg-slate-900 group">
                    <img
                      src={draftCampaign.bannerImageUrl}
                      alt="Banner"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer px-3 py-1 bg-white text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
                        <Edit className="w-3 h-3" />
                        <span>Change Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <label className="h-28 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 cursor-pointer flex flex-col items-center justify-center p-3 text-center transition-all">
                    <Upload className="w-5 h-5 text-blue-600 mb-1" />
                    <span className="text-xs font-bold text-slate-800">Upload New Image</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">or drag and drop JPG, PNG up to 2MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Banner Content inputs */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-slate-800">Banner Content</h4>
                <p className="text-[11px] text-slate-500">
                  Add text, button and other content that will appear on the banner.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={draftCampaign.title}
                      onChange={(e) => updateDraftCampaign({ title: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subtitle <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={draftCampaign.subtitle}
                      onChange={(e) => updateDraftCampaign({ subtitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">Description</label>
                    <span className="text-[10px] text-slate-400">
                      {draftCampaign.description.length}/60
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={60}
                    value={draftCampaign.description}
                    onChange={(e) => updateDraftCampaign({ description: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Button Text <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {draftCampaign.buttonText.length}/20
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={20}
                      value={draftCampaign.buttonText}
                      onChange={(e) => updateDraftCampaign({ buttonText: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Button Action <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={draftCampaign.buttonAction}
                      onChange={(e) => updateDraftCampaign({ buttonAction: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium"
                    >
                      <option>Go to Offer Page</option>
                      <option>Open Category</option>
                      <option>Open Product</option>
                      <option>External URL</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Offer (Optional)
                  </label>
                  <select
                    value={draftCampaign.selectedOffer}
                    onChange={(e) => updateDraftCampaign({ selectedOffer: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    <option>Summer Sale - 20% Off</option>
                    <option>Weekend Special - ₹100 Off</option>
                    <option>Free Delivery on orders above ₹499</option>
                    <option>None</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TARGET AUDIENCE (13.22.png) */}
          {wizardStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Target Audience</h3>
                <p className="text-xs text-slate-500">Choose the customers who will see your campaign.</p>
              </div>

              {/* Audience Type 3 Cards */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">Audience Type</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'All Customers',
                      title: 'All Customers',
                      desc: 'Show to all your app users',
                      icon: Users,
                    },
                    {
                      id: 'Specific Segment',
                      title: 'Specific Segment',
                      desc: 'Show to a specific customer segment',
                      icon: Users,
                    },
                    {
                      id: 'Custom Audience',
                      title: 'Custom Audience',
                      desc: 'Create your own audience using filters',
                      icon: Sliders,
                    },
                  ].map((type) => {
                    const isSelected = draftCampaign.audienceType === type.id;
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() =>
                          updateDraftCampaign({
                            audienceType: type.id as any,
                            estimatedReach: type.id === 'All Customers' ? 12450 : type.id === 'Specific Segment' ? 4850 : 2600,
                          })
                        }
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        <div className="font-bold text-xs text-slate-800">{type.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{type.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Audience Filters */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Audience Filters</span>
                <p className="text-[11px] text-slate-500 mb-3">Narrow down your audience using filters (optional).</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Customer Location</label>
                    <select
                      value={draftCampaign.audienceLocation}
                      onChange={(e) => updateDraftCampaign({ audienceLocation: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option>All Locations</option>
                      <option>Local (Within 5 km)</option>
                      <option>Citywide</option>
                      <option>Statewide</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Customer Group</label>
                    <select
                      value={draftCampaign.audienceGroup}
                      onChange={(e) => updateDraftCampaign({ audienceGroup: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option>All Groups</option>
                      <option>New Customers</option>
                      <option>Returning Buyers</option>
                      <option>VIP Members</option>
                      <option>Inactive Users (30+ days)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Gender</label>
                    <select
                      value={draftCampaign.audienceGender}
                      onChange={(e) => updateDraftCampaign({ audienceGender: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option>All</option>
                      <option>Men</option>
                      <option>Women</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Age</label>
                    <select
                      value={draftCampaign.audienceAge}
                      onChange={(e) => updateDraftCampaign({ audienceAge: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option>All Ages</option>
                      <option>18 - 24</option>
                      <option>25 - 34</option>
                      <option>35 - 50</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Last Order Date</label>
                    <select
                      value={draftCampaign.audienceLastOrder}
                      onChange={(e) => updateDraftCampaign({ audienceLastOrder: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option>Anytime</option>
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>Over 60 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Order Count</label>
                    <select
                      value={draftCampaign.audienceOrderCount}
                      onChange={(e) => updateDraftCampaign({ audienceOrderCount: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option>Any</option>
                      <option>First Time (0)</option>
                      <option>1 - 5 Orders</option>
                      <option>5+ Orders</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Total Spent</label>
                    <select
                      value={draftCampaign.audienceTotalSpent}
                      onChange={(e) => updateDraftCampaign({ audienceTotalSpent: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option>Any Amount</option>
                      <option>₹0 - ₹1,000</option>
                      <option>₹1,000 - ₹5,000</option>
                      <option>₹5,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tags</label>
                    <select
                      value={draftCampaign.audienceTags}
                      onChange={(e) => updateDraftCampaign({ audienceTags: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option>All Tags</option>
                      <option>Frequent Buyer</option>
                      <option>Festive Shopper</option>
                      <option>Bargain Hunter</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Preview Audience Size Card */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Preview Audience Size</div>
                    <div className="text-[10px] text-slate-500">This is an estimate of customers who will see this campaign.</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Estimated Reach</span>
                  <span className="text-base font-black text-blue-700">{draftCampaign.estimatedReach.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 ml-1">customers</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DISPLAY SETTINGS (13.23.png) */}
          {wizardStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Display Settings</h3>
                <p className="text-xs text-slate-500">Choose where and how your campaign will appear in the app.</p>
              </div>

              {/* 1. Placement */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">1. Placement</span>
                <p className="text-[11px] text-slate-500 mb-3">Select where you want to display your campaign.</p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { id: 'Homepage Banner', title: 'Homepage Banner', desc: 'Show on homepage banner section' },
                    { id: 'Category Page', title: 'Category Page', desc: 'Show on specific category pages' },
                    { id: 'Product Page', title: 'Product Page', desc: 'Show on product details page' },
                    { id: 'Offer Page', title: 'Offer Page', desc: 'Show on offer section' },
                    { id: 'Others', title: 'Others', desc: 'Show on other sections' },
                  ].map((place) => {
                    const isSelected = draftCampaign.placement === place.id;
                    return (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => updateDraftCampaign({ placement: place.id as any })}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-2xs font-bold'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs text-slate-800 leading-tight mb-1">{place.title}</div>
                        <div className="text-[9px] text-slate-400 font-normal leading-snug">{place.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Banner Position */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  2. Banner Position (Homepage Banner)
                </span>
                <p className="text-[11px] text-slate-500 mb-3">Choose the position of your banner on the homepage.</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'Top Banner', title: 'Top Banner', badge: 'Recommended', sketchY: 10 },
                    { id: 'Below Search Bar', title: 'Below Search Bar', sketchY: 25 },
                    { id: 'Middle Banner', title: 'Middle Banner', sketchY: 45 },
                    { id: 'Bottom Banner', title: 'Bottom Banner', sketchY: 65 },
                  ].map((pos) => {
                    const isSelected = draftCampaign.bannerPosition === pos.id;
                    return (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => updateDraftCampaign({ bannerPosition: pos.id as any })}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40 shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Miniature layout sketch */}
                        <div className="w-16 h-20 mx-auto bg-slate-100 rounded-md border border-slate-300 p-1 relative mb-2">
                          <div className="w-full h-2 bg-slate-200 rounded-xs mb-1" />
                          <div
                            className={`w-full h-4 rounded-xs transition-colors ${
                              isSelected ? 'bg-blue-600' : 'bg-slate-400'
                            }`}
                            style={{ marginTop: `${pos.sketchY - 10}px` }}
                          />
                        </div>
                        <div className="text-xs font-bold text-slate-800 leading-tight">{pos.title}</div>
                        {pos.badge && (
                          <span className="text-[9px] text-blue-600 font-semibold mt-0.5 block">{pos.badge}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Display Behavior */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">3. Display Behavior</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Display Frequency</label>
                    <select
                      value={draftCampaign.displayFrequency}
                      onChange={(e) => updateDraftCampaign({ displayFrequency: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option>Show every time</option>
                      <option>Once per day</option>
                      <option>Once per session</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Banner Dismissal</label>
                    <select
                      value={draftCampaign.allowDismiss ? 'Yes, allow dismiss' : 'No, do not allow dismiss'}
                      onChange={(e) => updateDraftCampaign({ allowDismiss: e.target.value === 'Yes, allow dismiss' })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option>Yes, allow dismiss</option>
                      <option>No, do not allow dismiss</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Auto Rotation</label>
                    <select
                      value={draftCampaign.autoRotate ? 'Yes, rotate' : 'No, keep static'}
                      onChange={(e) => updateDraftCampaign({ autoRotate: e.target.value === 'Yes, rotate' })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option>Yes, rotate</option>
                      <option>No, keep static</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rotation Interval</label>
                    <select
                      value={draftCampaign.rotationInterval}
                      onChange={(e) => updateDraftCampaign({ rotationInterval: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                    >
                      <option>5 seconds</option>
                      <option>10 seconds</option>
                      <option>15 seconds</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & LAUNCH (13.24.png) */}
          {wizardStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Review & Launch</h3>
                  <p className="text-xs text-slate-500">Review your campaign details, budget and estimated reach before launching.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-3 py-1.5 text-xs font-bold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50"
                >
                  Edit Campaign
                </button>
              </div>

              {/* Campaign Summary card */}
              <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-3.5 flex items-center gap-4">
                <div className="w-24 h-16 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                  <img
                    src={draftCampaign.bannerImageUrl}
                    alt="Summary"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="text-xs font-bold text-slate-900">{draftCampaign.name}</div>
                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Goal:</span> {draftCampaign.goal}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-600">Duration:</span> {draftCampaign.startDate} - {draftCampaign.endDate}
                  </div>
                </div>
              </div>

              {/* 3 Review Sub-Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Target Audience Recap */}
                <div className="bg-white rounded-xl border border-slate-200 p-3 text-xs space-y-1.5 relative">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <span className="font-bold text-slate-800">Target Audience</span>
                    <button type="button" onClick={() => setWizardStep(3)} className="text-[10px] text-blue-600 font-bold">Edit</button>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div><span className="text-slate-400">Type:</span> {draftCampaign.audienceType}</div>
                    <div><span className="text-slate-400">Location:</span> {draftCampaign.audienceLocation}</div>
                    <div><span className="text-slate-400">Age:</span> {draftCampaign.audienceAge}</div>
                    <div><span className="text-slate-400">Reach:</span> <span className="font-bold text-blue-600">{draftCampaign.estimatedReach.toLocaleString()}</span></div>
                  </div>
                </div>

                {/* Display Settings Recap */}
                <div className="bg-white rounded-xl border border-slate-200 p-3 text-xs space-y-1.5 relative">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <span className="font-bold text-slate-800">Display Settings</span>
                    <button type="button" onClick={() => setWizardStep(4)} className="text-[10px] text-blue-600 font-bold">Edit</button>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div><span className="text-slate-400">Placement:</span> {draftCampaign.placement}</div>
                    <div><span className="text-slate-400">Position:</span> {draftCampaign.bannerPosition}</div>
                    <div><span className="text-slate-400">Dismissal:</span> {draftCampaign.allowDismiss ? 'Allowed' : 'Fixed'}</div>
                    <div><span className="text-slate-400">Auto-Rotate:</span> {draftCampaign.autoRotate ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                {/* Banner & Content Recap */}
                <div className="bg-white rounded-xl border border-slate-200 p-3 text-xs space-y-1.5 relative">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <span className="font-bold text-slate-800">Banner & Content</span>
                    <button type="button" onClick={() => setWizardStep(2)} className="text-[10px] text-blue-600 font-bold">Edit</button>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div><span className="text-slate-400">Title:</span> {draftCampaign.title}</div>
                    <div><span className="text-slate-400">Subtitle:</span> {draftCampaign.subtitle}</div>
                    <div><span className="text-slate-400">CTA:</span> {draftCampaign.buttonText}</div>
                    <div><span className="text-slate-400">Action:</span> {draftCampaign.buttonAction}</div>
                  </div>
                </div>
              </div>

              {/* Campaign Cost & Budget Card */}
              <div className="rounded-xl border border-red-200 bg-red-50/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Campaign Cost (One-time)</span>
                    <div className="text-xl font-black text-blue-700">
                      ₹ {(draftCampaign.baseCost + draftCampaign.reachCost + draftCampaign.platformFee).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      This is the total cost to run this campaign for the selected duration and audience.
                    </span>
                  </div>

                  <div className="text-right text-xs space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 mb-1">Cost Breakdown</div>
                    <div className="flex justify-between gap-4 text-[11px] text-slate-600">
                      <span>Base Cost:</span>
                      <span className="font-bold">₹ {draftCampaign.baseCost}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-[11px] text-slate-600">
                      <span>Reach Cost:</span>
                      <span className="font-bold">₹ {draftCampaign.reachCost}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-[11px] text-slate-600">
                      <span>Platform Fee (5%):</span>
                      <span className="font-bold">₹ {draftCampaign.platformFee}</span>
                    </div>
                    <div className="border-t border-slate-100 pt-1 flex justify-between gap-4 text-xs font-black text-slate-900">
                      <span>Total Cost:</span>
                      <span className="text-blue-600">
                        ₹ {draftCampaign.baseCost + draftCampaign.reachCost + draftCampaign.platformFee}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-center gap-2 p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Once launched, your campaign will be live for the selected duration and audience.</span>
              </div>
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                resetDraftCampaign();
                setActiveCampaignView('list');
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {wizardStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold"
                >
                  Back
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                {wizardStep === 5 ? 'Launch Campaign' : 'Save & Continue'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: In-App Mobile Frame Preview (4 cols) */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900">In-App Preview</h4>
              <span className="text-[10px] text-slate-400">Live Phone Simulation</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">
              This is how your campaign banner and promotion will appear to customers in the app.
            </p>

            {/* Mobile Phone Mockup Device Frame */}
            <div className="w-[280px] mx-auto rounded-[36px] bg-slate-900 p-3 shadow-xl border-4 border-slate-800">
              <div className="bg-slate-50 rounded-[28px] overflow-hidden flex flex-col text-slate-800 min-h-[440px]">
                {/* Status Bar */}
                <div className="px-4 pt-2 pb-1 flex items-center justify-between text-[10px] font-bold text-slate-900">
                  <span>9:41</span>
                  <div className="w-16 h-3 bg-black rounded-full" />
                  <span>100%</span>
                </div>

                {/* App Search Bar */}
                <div className="px-3 py-2 flex items-center gap-2">
                  <div className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 flex items-center gap-1.5 text-[10px] text-slate-400 shadow-2xs">
                    <Search className="w-3 h-3 text-slate-400" />
                    <span>Search for products...</span>
                  </div>
                  <div className="relative">
                    <ShoppingBag className="w-4 h-4 text-slate-700" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 text-white text-[8px] flex items-center justify-center font-bold">
                      2
                    </span>
                  </div>
                </div>

                {/* Main Dynamic Promo Banner (Updates live!) */}
                <div className="px-3 my-1">
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-900 text-white p-3 shadow-md min-h-[110px] flex flex-col justify-between">
                    <img
                      src={draftCampaign.bannerImageUrl}
                      alt="Banner"
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                    />
                    <div className="relative z-10">
                      <span className="text-[11px] font-black tracking-wider block uppercase">
                        {draftCampaign.title || 'SUMMER SALE'}
                      </span>
                      <span className="text-[13px] font-black text-amber-300 leading-tight block">
                        {draftCampaign.subtitle || 'GET 20% OFF'}
                      </span>
                      <span className="text-[9px] text-slate-200 block mt-0.5 line-clamp-1">
                        {draftCampaign.description || "ON ALL MEN'S WEAR"}
                      </span>
                    </div>

                    <div className="relative z-10 flex items-center justify-between mt-2">
                      <button
                        type="button"
                        className="px-2 py-0.5 bg-white text-blue-900 rounded-md text-[9px] font-black tracking-wide shadow-xs uppercase"
                      >
                        {draftCampaign.buttonText || 'SHOP NOW'}
                      </button>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mini Categories Row */}
                <div className="px-3 py-2">
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {['All', 'Men', 'Women', 'Kids', 'Shoes'].map((cat, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                          {cat[0]}
                        </div>
                        <span className="text-[8px] text-slate-600 mt-0.5 font-medium">{cat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Offers Section */}
                <div className="px-3 py-1 flex-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-800 mb-1">
                    <span>Top Offers for You</span>
                    <span className="text-blue-600 text-[8px]">View All</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="bg-amber-50/80 rounded-lg p-1.5 border border-amber-200/60">
                      <span className="text-[8px] font-bold text-amber-900 block leading-tight">Weekend Special</span>
                      <span className="text-[7px] text-amber-700 block">Up to 30% Off</span>
                    </div>
                    <div className="bg-blue-50/80 rounded-lg p-1.5 border border-blue-200/60">
                      <span className="text-[8px] font-bold text-blue-900 block leading-tight">Free Delivery</span>
                      <span className="text-[7px] text-blue-700 block">On ₹499+ orders</span>
                    </div>
                  </div>
                </div>

                {/* Bottom App Navigation */}
                <div className="bg-white border-t border-slate-200 px-3 py-1.5 flex items-center justify-around text-[8px] text-slate-400">
                  <span className="text-blue-600 font-bold">Home</span>
                  <span>Categories</span>
                  <span>Orders</span>
                  <span>Offers</span>
                  <span>Account</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tip Card Below Preview */}
          <div className="bg-blue-50/60 rounded-2xl border border-blue-200 p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span>Tip</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Use eye-catching banners with a clear message and strong CTA button to get better customer engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
