import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, Search, Heart, ShoppingBag, MapPin, ChevronDown, ChevronRight,
  ArrowUpDown, Filter, Star, CheckCircle2, ShieldCheck, Truck, RotateCcw, Headset
} from 'lucide-react';
import type { IProduct } from '@repo/shared-types';

interface MobileProductsPLPProps {
  products: IProduct[];
  totalProducts: number;
}

const CATEGORY_PILLS = [
  { label: 'All', icon: <div className="w-4 h-4 grid grid-cols-2 gap-[2px]"><div className="bg-white rounded-[2px]" /><div className="bg-white rounded-[2px]" /><div className="bg-white rounded-[2px]" /><div className="bg-white rounded-[2px]" /></div>, active: true },
  { label: 'Round Neck', image: '/categories/fashion_couple.png' },
  { label: 'V Neck', image: '/categories/fashion_couple.png' },
  { label: 'Polo T-shirts', image: '/categories/fashion_couple.png' },
  { label: 'Printed', image: '/categories/fashion_couple.png' },
  { label: 'Striped', image: '/categories/fashion_couple.png' },
  { label: 'Full Sleeve', image: '/categories/fashion_couple.png' },
  { label: 'More', icon: <div className="flex gap-1"><div className="w-1 h-1 bg-[#192168] rounded-full"/><div className="w-1 h-1 bg-[#192168] rounded-full"/><div className="w-1 h-1 bg-[#192168] rounded-full"/></div> }
];

export function MobileProductsPLP({ products, totalProducts }: MobileProductsPLPProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      {/* 1. Header */}
      {/* <div className="px-4 py-3 flex items-center justify-between sticky top-0 bg-white z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-[#1668F6]">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <Image src="/logo.png" alt="Viztore" width={90} height={30} className="object-contain" />
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[#1668F6]">
            <Heart className="w-6 h-6" />
          </button>
          <div className="relative text-[#1668F6]">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-[#1668F6] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </div>
        </div>
      </div> */}

      {/* 2. Search Bar */}
      {/* <div className="px-4 pb-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#192168]" />
          <input 
            type="text" 
            placeholder="Search for T-shirts..."
            className="w-full bg-white border border-surface-200 rounded-full py-2.5 pl-10 pr-10 text-sm focus:outline-none shadow-sm"
          />
          <svg className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#192168]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
      </div> */}

      {/* 3. Location Bar */}
      {/* <div className="bg-[#F5F8FF] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <MapPin className="w-4 h-4 text-[#192168] shrink-0" />
          <span className="text-[12px] font-bold text-[#192168] truncate">Deliver to: Harish Kumar - Q No- 6/B, Street -13, Sector -2, Bhilai</span>
        </div>
        <ChevronDown className="w-4 h-4 text-[#192168] shrink-0 ml-2" />
      </div> */}

      {/* 4. Title Area */}
      <div className="px-4 py-4 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#192168] leading-tight">T-shirts for Men</h1>
          <p className="text-[12px] font-bold text-[#192168] mt-1">{totalProducts.toLocaleString()}+ Products</p>
        </div>
        <div className="flex items-center gap-3 text-[#192168]">
          <Search className="w-5 h-5" />
          <Heart className="w-5 h-5" />
          <ShoppingBag className="w-5 h-5" />
        </div>
      </div>

      {/* 5. Subcategory Carousel */}
      <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar pb-2">
        {CATEGORY_PILLS.map((pill, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 overflow-hidden ${pill.active ? 'border-[#1668F6] bg-[#1668F6]' : 'border-transparent bg-surface-100'}`}>
              {pill.image ? (
                <Image src={pill.image} alt={pill.label} width={56} height={56} className="object-cover w-full h-full" />
              ) : (
                pill.icon
              )}
            </div>
            <span className={`text-[10px] font-bold text-center leading-tight ${pill.active ? 'text-[#1668F6]' : 'text-[#192168]'}`}>
              {pill.label}
            </span>
          </div>
        ))}
      </div>

      {/* 6. Filter/Sort Chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar border-b border-surface-100">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-surface-200 bg-white text-[#192168] text-[12px] font-bold shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5" /> Sort <ChevronRight className="w-3 h-3 text-surface-400 ml-1" />
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-surface-200 bg-white text-[#192168] text-[12px] font-bold shrink-0">
          Size <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-surface-200 bg-white text-[#192168] text-[12px] font-bold shrink-0">
          Color <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-surface-200 bg-white text-[#192168] text-[12px] font-bold shrink-0">
          Brand <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-surface-200 bg-white text-[#192168] text-[12px] font-bold shrink-0 ml-auto">
          Filter <Filter className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 7. Promo Banners */}
      <div className="flex gap-3 px-4 py-4 overflow-x-auto hide-scrollbar snap-x">
        <div className="shrink-0 w-[280px] h-[120px] rounded-xl bg-[#EEF4FF] relative overflow-hidden snap-start">
          <div className="absolute right-0 bottom-0 h-full w-1/2">
            <Image src="/categories/fashion_couple.png" alt="Promo" layout="fill" objectFit="cover" className="object-top" />
          </div>
          <div className="p-4 relative z-10 w-2/3 flex flex-col justify-between h-full">
            <div>
              <p className="text-[10px] font-extrabold text-[#192168] uppercase tracking-wide">Autumn Winter'26</p>
              <h3 className="text-[16px] font-black text-[#192168] leading-tight mt-1">TRENDING<br/>T-SHIRTS</h3>
            </div>
            <button className="text-[10px] font-extrabold text-[#192168] flex items-center gap-1">Explore Now &rarr;</button>
          </div>
        </div>
        <div className="shrink-0 w-[280px] h-[120px] rounded-xl bg-[#FFF5E5] relative overflow-hidden snap-start">
          <div className="absolute right-0 bottom-0 h-full w-1/2">
            <Image src="/categories/fashion_couple.png" alt="Promo" layout="fill" objectFit="cover" className="object-top" />
          </div>
          <div className="p-4 relative z-10 w-2/3 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-[16px] font-black text-[#192168] leading-tight mb-1">CLASSIC<br/>T-SHIRTS</h3>
              <p className="text-[10px] font-bold text-[#192168] leading-tight">Button Up For<br/>The Season</p>
            </div>
            <button className="text-[10px] font-extrabold text-[#192168] flex items-center gap-1">Explore Now &rarr;</button>
          </div>
        </div>
      </div>

      {/* 8. Products Count & Sort */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-b border-surface-50 bg-[#F9FAFB]">
        <span className="text-[12px] font-extrabold text-[#192168]">{(totalProducts || 1248).toLocaleString()} Products</span>
        <button className="flex items-center gap-1 text-[12px] font-extrabold text-[#192168]">
          Popularity <ChevronDown className="w-3.5 h-3.5 text-[#1668F6]" />
        </button>
      </div>

      {/* 9. Product Grid */}
      <div className="bg-[#F9FAFB] p-4">
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => {
            const discount = product.baseMrp > 0
              ? Math.round(((product.baseMrp - product.basePrice) / product.baseMrp) * 100)
              : 0;
            const image = product.variants?.[0]?.images?.[0] || '/categories/fashion_couple.png';
            
            return (
              <div key={product._id} className="bg-white rounded-xl overflow-hidden border border-surface-100 flex flex-col relative">
                {/* Image */}
                <div className="relative aspect-square bg-[#F5F8FF] p-2">
                  <Image src={image} alt={product.name} layout="fill" objectFit="contain" className="mix-blend-multiply" />
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-white bg-[#1668F6] text-[8px] font-extrabold z-10">
                      {discount}% OFF
                    </span>
                  )}
                  <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white z-10 text-[#192168] shadow-sm">
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {/* Details */}
                <div className="p-2.5 flex flex-col flex-1">
                  <h3 className="text-[11px] font-bold text-[#192168] line-clamp-2 leading-tight mb-1">{product.name}</h3>
                  <div className="flex items-end gap-1.5 mb-1.5">
                    <span className="text-[14px] font-black text-[#192168]">₹{product.basePrice}</span>
                    {discount > 0 && (
                      <span className="text-[11px] font-medium text-surface-400 line-through mb-[1px]">₹{product.baseMrp}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {product.rating > 0 && (
                      <div className="flex items-center gap-0.5">
                        <span className="text-[11px] font-extrabold text-[#192168]">{product.rating.toFixed(1)}</span>
                        <Star className="w-3 h-3 text-[#06B95F] fill-[#06B95F]" />
                      </div>
                    )}
                    <span className="text-[10px] font-medium text-surface-400">({product.reviewCount ? (product.reviewCount > 1000 ? '2.1K' : product.reviewCount) : '2.1K'})</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-surface-100">
                    <div className="w-3.5 h-3.5 rounded text-[#1668F6] flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </div>
                    <span className="text-[10px] font-bold text-[#192168] truncate">{product.storeName || 'Fashion Hub'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 10. Promo Strip */}
      <div className="bg-[#FFF0F5] px-4 py-3 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[#E11D48]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
          <span className="text-[11px] font-extrabold text-[#192168]">Extra 10% OFF on prepaid orders</span>
        </div>
        <button className="text-[11px] font-extrabold text-[#E11D48] flex items-center">
          Shop Now <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 11. Trust Value Props */}
      <div className="px-4 pb-6">
        <div className="bg-[#F5F8FF] rounded-2xl p-4 grid grid-cols-2 gap-y-4 gap-x-2">
          <div className="flex items-start gap-2">
            <Truck className="w-5 h-5 text-[#1668F6] shrink-0" strokeWidth={1.5} />
            <div>
              <h4 className="text-[10px] font-extrabold text-[#192168] leading-tight">Fast Delivery</h4>
              <p className="text-[9px] font-medium text-surface-500 leading-tight">On orders above ₹199</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RotateCcw className="w-5 h-5 text-[#1668F6] shrink-0" strokeWidth={1.5} />
            <div>
              <h4 className="text-[10px] font-extrabold text-[#192168] leading-tight">Easy Returns</h4>
              <p className="text-[9px] font-medium text-surface-500 leading-tight">7 days return policy</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1668F6] shrink-0" strokeWidth={1.5} />
            <div>
              <h4 className="text-[10px] font-extrabold text-[#192168] leading-tight">Secure Payments</h4>
              <p className="text-[9px] font-medium text-surface-500 leading-tight">100% secure payments</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Headset className="w-5 h-5 text-[#1668F6] shrink-0" strokeWidth={1.5} />
            <div>
              <h4 className="text-[10px] font-extrabold text-[#192168] leading-tight">Support</h4>
              <p className="text-[9px] font-medium text-surface-500 leading-tight">24x7 assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
