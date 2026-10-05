import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  HelpCircle,
  ShoppingBag,
  Store,
  FolderTree,
  Tag,
  Image as ImageIcon,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Wallet,
  CreditCard,
  QrCode,
  Shield,
  Star,
  ExternalLink,
  Edit2,
  Rocket,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import { useMarketingStore, AdType } from '../../stores/marketingStore.js';

interface CreateAdvertisementWizardProps {
  onClose?: () => void;
}

export const CreateAdvertisementWizard: React.FC<CreateAdvertisementWizardProps> = ({ onClose }) => {
  const { addAdvertisement, closeCreateAdWizard, setActiveSubTab } = useMarketingStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedType, setSelectedType] = useState<AdType>('Sponsored Product');

  // Step 2 product selection
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    sku: string;
    price: number;
    rating: number;
    reviews: number;
    sizes: string;
    color: string;
    category: string;
    subcategory: string;
    image: string;
    stock: number;
  }>({
    id: 'TS001',
    name: 'Men Checked Shirt',
    sku: '#P54321',
    price: 699,
    rating: 4.5,
    reviews: 120,
    sizes: 'M, L, XL',
    color: 'Red',
    category: 'Men',
    subcategory: 'Top Wear',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&auto=format&fit=crop&q=80',
    stock: 18,
  });

  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('Men');
  const [productSubcategory, setProductSubcategory] = useState('Top Wear');
  const [productType, setProductType] = useState('T-Shirt');

  // Step 3 Duration & Schedule
  const [selectedDuration, setSelectedDuration] = useState<'3 Days' | '7 Days' | '15 Days' | '30 Days'>('7 Days');
  const [startDate, setStartDate] = useState('2024-05-20');
  const [endDate, setEndDate] = useState('2024-05-26');

  // Step 4 Payment & Review
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'upi' | 'card'>('wallet');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const durationPricing = {
    '3 Days': { price: 499, perDay: 166 },
    '7 Days': { price: 1299, perDay: 185 },
    '15 Days': { price: 2499, perDay: 167 },
    '30 Days': { price: 3999, perDay: 133 },
  };

  const currentPrice = durationPricing[selectedDuration].price;

  const catalogProducts = [
    {
      id: 'TS001',
      name: 'Men Round Neck T-Shirt',
      sku: '#TS001',
      price: 699,
      rating: 4.5,
      reviews: 120,
      sizes: 'M, L, XL',
      color: 'Black',
      category: 'Men',
      subcategory: 'Top Wear',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80',
      stock: 18,
    },
    {
      id: 'TS002',
      name: 'Men Printed T-Shirt',
      sku: '#TS002',
      price: 749,
      rating: 4.3,
      reviews: 95,
      sizes: 'M, L, XL',
      color: 'White',
      category: 'Men',
      subcategory: 'Top Wear',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&auto=format&fit=crop&q=80',
      stock: 25,
    },
    {
      id: 'TS003',
      name: 'Men Polo T-Shirt',
      sku: '#TS003',
      price: 899,
      rating: 4.6,
      reviews: 140,
      sizes: 'M, L, XL',
      color: 'Navy',
      category: 'Men',
      subcategory: 'Top Wear',
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=200&auto=format&fit=crop&q=80',
      stock: 12,
    },
    {
      id: 'TS004',
      name: 'Men V-Neck T-Shirt',
      sku: '#TS004',
      price: 799,
      rating: 4.4,
      reviews: 80,
      sizes: 'M, L, XL',
      color: 'Red',
      category: 'Men',
      subcategory: 'Top Wear',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&auto=format&fit=crop&q=80',
      stock: 20,
    },
    {
      id: 'TS005',
      name: 'Men Oversized T-Shirt',
      sku: '#TS005',
      price: 849,
      rating: 4.7,
      reviews: 210,
      sizes: 'M, L, XL',
      color: 'Green',
      category: 'Men',
      subcategory: 'Top Wear',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=200&auto=format&fit=crop&q=80',
      stock: 30,
    },
  ];

  const handleLaunchAd = () => {
    addAdvertisement({
      name: selectedType === 'Sponsored Product' ? selectedProduct.name : 'Store Promotion',
      subtitle: selectedType === 'Sponsored Product' ? `Product: ${selectedProduct.color}, ${selectedProduct.sizes.split(',')[0]}` : 'Store Campaign',
      type: selectedType,
      duration: selectedDuration,
      amount: currentPrice,
      startDate: '20 May 2024',
      endDate: '26 May 2024',
      status: 'Active',
      imageUrl: selectedProduct.image,
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      if (onClose) onClose();
      else closeCreateAdWizard();
      setActiveSubTab('advertisements');
    }, 1500);
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
            <span className="hover:text-slate-600 cursor-pointer" onClick={handleBackToAdvertisements}>Home</span>
            <span>&gt;</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={handleBackToAdvertisements}>Marketing</span>
            <span>&gt;</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={handleBackToAdvertisements}>Advertisements</span>
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
          onClick={() => alert('Advertisement support guide')}
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
                step > 1 ? 'bg-blue-600 text-white' : step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
            </div>
            <div className="text-left">
              <span className={`text-xs font-bold block leading-tight ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
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
                step > 2 ? 'bg-blue-600 text-white' : step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {step > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
            </div>
            <div className="text-left">
              <span className={`text-xs font-bold block leading-tight ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
                Choose Content
              </span>
              {step > 2 && <span className="text-[10px] text-slate-400 block truncate max-w-[100px]">{selectedProduct.name}</span>}
            </div>
          </div>

          <div className={`flex-1 h-0.5 mx-3 ${step > 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />

          {/* Step 3 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step > 3 ? 'bg-blue-600 text-white' : step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {step > 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
            </div>
            <div className="text-left">
              <span className={`text-xs font-bold block leading-tight ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>
                Set Duration
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
            <span className={`text-xs font-bold ${step === 4 ? 'text-slate-900' : 'text-slate-400'}`}>
              Review & Pay
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: SELECT AD TYPE (12.2.png) */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">1. Select Advertisement Type</h2>
              <p className="text-xs text-slate-500 mt-0.5">Choose what you want to promote.</p>
            </div>

            {/* 5 Type Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Sponsored Product */}
              <div
                onClick={() => setSelectedType('Sponsored Product')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center relative ${
                  selectedType === 'Sponsored Product'
                    ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {selectedType === 'Sponsored Product' && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-tight">Sponsored Product</h3>
                <p className="text-[11px] text-slate-500 mt-1">Promote a specific product</p>
                <span className="text-[10px] text-blue-600 font-medium mt-3">Get more product views and sales</span>
              </div>

              {/* Sponsored Store */}
              <div
                onClick={() => setSelectedType('Sponsored Store')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center relative ${
                  selectedType === 'Sponsored Store'
                    ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {selectedType === 'Sponsored Store' && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-tight">Sponsored Store</h3>
                <p className="text-[11px] text-slate-500 mt-1">Increase visibility for your store</p>
                <span className="text-[10px] text-purple-600 font-medium mt-3">Showcase your store to more customers</span>
              </div>

              {/* Category Promotion */}
              <div
                onClick={() => setSelectedType('Category Promotion')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center relative ${
                  selectedType === 'Category Promotion'
                    ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {selectedType === 'Category Promotion' && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <FolderTree className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-tight">Category Promotion</h3>
                <p className="text-[11px] text-slate-500 mt-1">Show your products in a category</p>
                <span className="text-[10px] text-emerald-600 font-medium mt-3">Get featured in relevant categories</span>
              </div>

              {/* Best Deals Promotion */}
              <div
                onClick={() => setSelectedType('Best Deals Promotion')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center relative ${
                  selectedType === 'Best Deals Promotion'
                    ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {selectedType === 'Best Deals Promotion' && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                  <Tag className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-tight">Best Deals Promotion</h3>
                <p className="text-[11px] text-slate-500 mt-1">Promote your offers & discounts</p>
                <span className="text-[10px] text-rose-600 font-medium mt-3">Attract more customers with great deals</span>
              </div>

              {/* Banner Advertisement */}
              <div
                onClick={() => setSelectedType('Banner Advertisement')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center relative ${
                  selectedType === 'Banner Advertisement'
                    ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {selectedType === 'Banner Advertisement' && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-tight">Banner Advertisement</h3>
                <p className="text-[11px] text-slate-500 mt-1">Display banner with contact details</p>
                <span className="text-[10px] text-indigo-600 font-medium mt-3">Increase brand visibility with banners</span>
              </div>
            </div>
          </div>

          {/* Banner Promo Strip (12.2.png) */}
          <div className="bg-gradient-to-r from-blue-600/10 via-indigo-500/10 to-transparent rounded-xl border border-blue-200/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900">Reach more customers with advertisements</h3>
              <p className="text-[11px] text-slate-600">
                Promote your products, offers and store to get higher visibility among local shoppers.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="text-slate-700 text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>More Visibility</span>
                </div>
                <div className="text-slate-700 text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Higher Sales</span>
                </div>
                <div className="text-slate-700 text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                  <span>Targeted Reach</span>
                </div>
                <div className="text-slate-700 text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span>Easy Setup</span>
                </div>
              </div>
            </div>
            <div className="w-28 h-20 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0 border border-blue-300">
              <Rocket className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          {/* Bottom 2 Cards (12.2.png) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Tips for Better Advertisements</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li>• Use high-quality images and clear product information.</li>
                <li>• Set competitive prices and attractive offers.</li>
                <li>• Target the right category and audience.</li>
                <li>• Run ads during festivals and weekends for better results.</li>
                <li>• Track performance and optimize your ads regularly.</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Where Your Ad Will Appear</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li>• Home page banners &amp; highlights</li>
                <li>• Category pages and filter results</li>
                <li>• Search results top placements</li>
                <li>• Product listing recommendations</li>
                <li>• Dedicated store page badge</li>
              </ul>
            </div>
          </div>

          {/* Step 1 Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleBackToAdvertisements}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CHOOSE CONTENT (12.2a.png) */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Product Selection Table & Filters (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">2. Choose Content</h2>
              <p className="text-xs text-slate-500 mt-0.5">Select the products you want to promote.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-bold text-blue-600 border-b-2 border-blue-600"
              >
                Search Products
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Select from Catalog
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Recently Added
              </button>
            </div>

            {/* Dropdown Filters & Search */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Category</label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option>Men</option>
                  <option>Women</option>
                  <option>Kids</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Subcategory</label>
                <select
                  value={productSubcategory}
                  onChange={(e) => setProductSubcategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option>Top Wear</option>
                  <option>Bottom Wear</option>
                  <option>Footwear</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Product Type</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option>T-Shirt</option>
                  <option>Shirt</option>
                  <option>Jeans</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Search</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-7 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Products Table (12.2a.png) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                    <th className="py-2 px-3 w-8">#</th>
                    <th className="py-2 px-3">Product</th>
                    <th className="py-2 px-2.5">SKU</th>
                    <th className="py-2 px-2.5">Price</th>
                    <th className="py-2 px-2.5">Stock</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {catalogProducts.map((p) => {
                    const isSelected = selectedProduct.id === p.id;
                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          isSelected ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <td className="py-2 px-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => setSelectedProduct(p)}
                            className="rounded border-slate-300 text-blue-600"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block truncate">{p.name}</span>
                              <span className="text-[10px] text-slate-400">
                                {p.color} | {p.sizes}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-2.5 font-mono text-[11px] text-slate-600">{p.sku}</td>
                        <td className="py-2 px-2.5 font-bold text-slate-900">₹{p.price}</td>
                        <td className="py-2 px-2.5 text-slate-600">{p.stock}</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedProduct(p)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                              isSelected
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Nav Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Selection Summary & Live Preview (4 cols) (12.2a.png) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Selection Summary */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">Selection Summary</h3>
                <span className="text-[11px] text-blue-600 font-bold cursor-pointer" onClick={() => setStep(1)}>
                  Edit
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ad Type:</span>
                  <span className="font-bold text-slate-800">{selectedType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-bold text-slate-800">{productCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Subcategory:</span>
                  <span className="font-bold text-slate-800">{productSubcategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Product Type:</span>
                  <span className="font-bold text-slate-800">{productType}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-1.5">
                  <span className="text-slate-400">Products Selected:</span>
                  <span className="font-bold text-blue-600">1 product</span>
                </div>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Preview (How it will appear)</h3>
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                    Sponsored
                  </span>
                </div>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-36 object-cover rounded-lg border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{selectedProduct.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-black text-slate-900">₹{selectedProduct.price}</span>
                    <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span>{selectedProduct.rating} ({selectedProduct.reviews})</span>
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-2 bg-blue-600 text-white font-bold text-xs rounded-lg"
                >
                  View Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: SET DURATION (12.2b.png) */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">3. Set Duration &amp; Schedule</h2>
              <p className="text-xs text-slate-500 mt-0.5">Choose how many days you want to run this advertisement.</p>
            </div>

            {/* 4 Plan Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['3 Days', '7 Days', '15 Days', '30 Days'] as const).map((dur) => {
                const plan = durationPricing[dur];
                const isSelected = selectedDuration === dur;
                return (
                  <div
                    key={dur}
                    onClick={() => setSelectedDuration(dur)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all relative text-center ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {dur === '7 Days' && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                        Popular
                      </span>
                    )}
                    <div className="flex justify-center mb-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900 block">{dur}</span>
                    <span className="text-base font-black text-slate-900 block mt-1">₹ {plan.price.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">₹{plan.perDay} per day</span>
                  </div>
                );
              })}
            </div>

            {/* Schedule Dates */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">Schedule Dates (Optional)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="text-center sm:text-right pt-2">
                  <span className="text-[10px] text-slate-400 block">Total Duration</span>
                  <span className="text-sm font-black text-blue-600 block">{selectedDuration}</span>
                </div>
              </div>
            </div>

            {/* Promo banner */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Get Better Results with Sponsored Ads</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Target popular products and peak hours to double your conversion rate.
                </p>
              </div>
              <Rocket className="w-8 h-8 text-blue-600 shrink-0" />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Preview & Cost Summary (4 cols) (12.2b.png) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Cost Summary */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Cost Summary</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Selected Plan:</span>
                  <span className="font-semibold text-slate-900">{selectedDuration}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Price per Day:</span>
                  <span className="font-semibold text-slate-900">₹{durationPricing[selectedDuration].perDay}</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total Amount:</span>
                  <span className="text-base font-black text-blue-600">₹ {currentPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Ad Preview */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Advertisement Preview</h3>
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                  Sponsored
                </span>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <h4 className="text-xs font-bold text-slate-900">{selectedProduct.name}</h4>
                <span className="text-xs font-black text-slate-900">₹{selectedProduct.price}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & PAY (12.2c.png) */}
      {step === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Details Summary, Payment Options, Terms (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            {/* Ad Details Summary Card */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">Advertisement Details</h3>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Advertisement Type</span>
                  <span className="font-bold text-slate-900">{selectedType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Product</span>
                  <span className="font-bold text-slate-900">{selectedProduct.name}</span>
                  <span className="text-[10px] text-slate-400 block">SKU: {selectedProduct.sku}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Duration</span>
                  <span className="font-bold text-slate-900">{selectedDuration}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Start &amp; End Date</span>
                  <span className="font-bold text-slate-900">20 May 2024 — 26 May 2024</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector (12.2c.png) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Payment Method</h3>
              <p className="text-[11px] text-slate-500">Choose a payment method to continue.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Pay from Wallet */}
                <div
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'wallet'
                      ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Wallet className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Pay from Wallet</span>
                      <span className="text-[10px] text-slate-400">Available: ₹32,450</span>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'wallet' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'wallet' && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>

                {/* UPI / QR */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'upi'
                      ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">UPI / QR</span>
                      <span className="text-[10px] text-slate-400">Pay using any UPI app</span>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'upi' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'upi' && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>

                {/* Card / Net Banking */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Card / Net Banking</span>
                      <span className="text-[10px] text-slate-400">Credit / Debit Card</span>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'card' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'card' && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="border-t border-slate-100 pt-3 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 mt-0.5"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer">
                I agree to the advertising policy and terms of service.
              </label>
            </div>

            {/* Success notification */}
            {isSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Advertisement launched successfully!</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={!agreeTerms}
                onClick={handleLaunchAd}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
              >
                <Rocket className="w-4 h-4" />
                <span>Pay &amp; Launch (₹{currentPrice.toLocaleString()})</span>
              </button>
            </div>
          </div>

          {/* Right Column: Preview & Final Breakdown (4 cols) (12.2c.png) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Cost Summary</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Ad Plan ({selectedDuration}):</span>
                  <span className="font-semibold text-slate-900">₹{currentPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Convenience Fee:</span>
                  <span className="font-semibold text-slate-900">₹0</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total Amount:</span>
                  <span className="text-base font-black text-blue-600">₹{currentPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900">Tips Before You Launch</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li>• Review your product details and images.</li>
                <li>• Choose the right duration for better reach.</li>
                <li>• Ensure stock is sufficient to meet high demand.</li>
                <li>• Track performance in the Advertisements section.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
