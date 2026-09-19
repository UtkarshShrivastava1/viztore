'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Footer } from '@/components/layout/Footer';
import { fetchProductBySlug } from '@/lib/api/catalog';
import { useCartStore } from '@/stores/cart.store';
import { 
  Star, ShoppingBag, Share2, ChevronRight, 
  Check, Minus, Plus, Package, 
  ChevronDown, ChevronUp, Zap
} from 'lucide-react';
import { ProductImageCarousel } from '@/features/pdp/ProductImageCarousel';
import { SizeSelector } from '@/features/pdp/SizeSelector';
import { ProductDeliveryInfo } from '@/features/pdp/ProductDeliveryInfo';
import { ProductOffers } from '@/features/pdp/ProductOffers';
import { StickyBottomBar } from '@/features/pdp/StickyBottomBar';
import { CrossSellRails } from '@/features/pdp/CrossSellRails';

interface ProductDetailClientProps {
  slug: string;
}

export function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showDetails, setShowDetails] = useState(true); // Open by default as per screenshot

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent pt-16">
        <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="skeleton aspect-square rounded-2xl" />
            <div className="space-y-4">
              <div className="skeleton h-8 w-3/4 rounded" />
              <div className="skeleton h-6 w-1/2 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-4/5 rounded" />
              <div className="skeleton h-12 w-40 rounded-xl mt-6" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-transparent pt-16">
        <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-20 text-center">
          <Package className="w-16 h-16 mx-auto text-surface-600 mb-4" />
          <h1 className="text-xl font-bold text-surface-700">Product not found</h1>
          <p className="text-sm text-surface-500 mt-2">This product may have been removed.</p>
          <Link href="/products" className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors">
            Browse Products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIdx] || product.variants[0];
  const allImages = selectedVariant?.images?.length > 0
    ? selectedVariant.images
    : product.variants.flatMap((v) => v.images).filter(Boolean);

  const discount = selectedVariant.mrp > 0
    ? Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)
    : 0;

  const sizes = Array.from(new Set(product.variants.filter((v) => v.size && v.isActive).map((v) => v.size!)));
  const colors = Array.from(new Set(product.variants.filter((v) => v.color && v.isActive).map((v) => v.color!)));

  const rawStoreId = product.storeId;
  const storeId = typeof rawStoreId === 'object' && rawStoreId !== null
    ? (rawStoreId as any)._id || String(rawStoreId)
    : String(rawStoreId || 'store-main');
  const storeName = product.storeName || (typeof rawStoreId === 'object' && (rawStoreId as any)?.name) || 'Official Store';

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    const success = addItem({
      productId: product._id,
      sku: selectedVariant.sku || product.variants[selectedVariantIdx]?.sku || `${product._id}-${selectedVariantIdx}`,
      name: product.name,
      imageUrl: allImages[0] || '',
      unitPrice: selectedVariant.price,
      storeId,
      storeName,
    }, qty);

    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
      openCart();
    }
  };

  const handleBuyNow = () => {
    if (!product || !selectedVariant) return;
    addItem({
      productId: product._id,
      sku: selectedVariant.sku || product.variants[selectedVariantIdx]?.sku || `${product._id}-${selectedVariantIdx}`,
      name: product.name,
      imageUrl: allImages[0] || '',
      unitPrice: selectedVariant.price,
      storeId,
      storeName,
    }, qty);

    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-transparent pt-14 pb-28 md:pb-0">
      <main className="max-w-[1920px] mx-auto md:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 md:py-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12">
          {/* ── MOBILE: IMAGE FULL WIDTH, DESKTOP: STICKY GALLERY ── */}
          <ProductImageCarousel
            productName={product.name}
            images={allImages}
            selectedImageIdx={selectedImageIdx}
            setSelectedImageIdx={setSelectedImageIdx}
          />

          {/* ── PRODUCT DETAILS & SELECTION ── */}
          <div className="px-4 py-5 md:p-0 space-y-5 bg-white md:bg-transparent -mt-4 md:mt-0 relative rounded-t-3xl md:rounded-none z-20">
            
            {/* Breadcrumbs (Desktop) */}
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-bold text-surface-500 mb-2">
              <Link href="/" className="hover:text-[#192168]">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/category/${product.category?.toLowerCase() || 'all'}`} className="hover:text-[#192168] capitalize">
                {product.category || 'Catalog'}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#192168] line-clamp-1 truncate">{product.name}</span>
            </div>

            {/* Brand & Share */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-surface-500 uppercase tracking-wider">
                {product.brand || product.storeName || 'Official Store'}
              </h2>
              <button className="hidden md:flex text-surface-400 hover:text-[#192168] transition-colors">
                <Share2 className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-[20px] md:text-2xl font-extrabold text-[#192168] leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                <span className="text-xs font-extrabold text-emerald-700">4.4</span>
                <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              </div>
              <span className="text-xs font-extrabold text-surface-400">|</span>
              <span className="text-xs font-extrabold text-surface-500">1.8k Ratings</span>
              <span className="text-xs font-extrabold text-surface-400">|</span>
              <button className="text-xs font-extrabold text-[#1668F6] flex items-center gap-0.5">
                120 Reviews <ChevronRight className="w-3 h-3" strokeWidth={3} />
              </button>
            </div>

            {/* Price Block */}
            <div className="space-y-1 mt-4">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-extrabold text-[#192168]">
                  ₹{selectedVariant.price.toLocaleString('en-IN')}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-lg font-bold text-surface-400 line-through mb-1">
                      ₹{selectedVariant.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-extrabold text-rose-500 mb-1.5">
                      ({discount}% OFF)
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] font-extrabold text-emerald-600">
                Inclusive of all taxes
              </p>
            </div>

            {/* Offer Tag */}
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 mt-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                <span className="text-xs font-extrabold text-[#192168]">Get ₹50 off on orders above ₹999</span>
              </div>
              <button className="text-[11px] font-extrabold text-[#1668F6] whitespace-nowrap">View Offers {'>'}</button>
            </div>

            <div className="h-px bg-surface-100 my-4" />

            {/* Colour */}
            {colors.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[13px] font-extrabold text-[#192168]">
                  Color: <span className="font-bold text-surface-500 ml-1 capitalize">{colors[0]}</span>
                </h3>
                <div className="flex items-center flex-wrap gap-2">
                  {colors.map((c, i) => (
                    <button
                      key={c}
                      className={`w-10 h-10 rounded-xl border-2 transition-all ${
                        i === 0 ? 'border-[#1668F6] p-[2px]' : 'border-surface-200 hover:border-surface-300'
                      }`}
                    >
                      <div className="w-full h-full rounded-lg" style={{ backgroundColor: c, border: '1px solid #e5e7eb' }} title={c} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Select Size */}
            <div className="pt-2">
              <SizeSelector sizes={sizes} />
            </div>

            {/* Quantity and Actions Row (Desktop) */}
            <div className="hidden md:flex items-center gap-4 pt-6">
              
              <div className="flex items-center justify-between w-[120px] h-12 border-2 border-surface-200 rounded-xl px-1">
                <button 
                  type="button"
                  onClick={() => setQty(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 flex items-center justify-center text-surface-400 hover:text-[#192168] transition-colors disabled:opacity-40"
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-extrabold text-[#192168] text-sm select-none">{qty}</span>
                <button 
                  type="button"
                  onClick={() => setQty(prev => Math.min(99, prev + 1))}
                  className="w-10 h-10 flex items-center justify-center text-surface-400 hover:text-[#192168] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button 
                type="button"
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-[#1668F6] text-[#1668F6] font-extrabold text-sm hover:bg-blue-50 active:scale-[0.98] transition-all"
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span className="text-emerald-600">Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" strokeWidth={2.5} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#1668F6] text-white font-extrabold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
              >
                <Zap className="w-5 h-5 fill-white" />
                Buy Now
              </button>

            </div>

            {/* Service Badges */}
            <div className="pt-4">
              <ProductOffers />
            </div>
            
          </div>
        </div>

        {/* ── FULL WIDTH PRODUCT INFO SECTION (Below Fold) ── */}
        <div className="px-4 md:px-0 pt-8 pb-4 space-y-8">
           
           {/* Details and Description */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
             
             {/* Product Details */}
             <div className="space-y-4">
               <button 
                 onClick={() => setShowDetails(!showDetails)}
                 className="flex items-center justify-between w-full group md:cursor-default"
               >
                 <h2 className="text-[15px] font-extrabold text-[#192168]">Product Details</h2>
                 <span className="md:hidden">
                   {showDetails ? (
                     <ChevronUp className="w-5 h-5 text-[#192168]" />
                   ) : (
                     <ChevronDown className="w-5 h-5 text-[#192168]" />
                   )}
                 </span>
               </button>
               
               <div className={`${showDetails ? 'block' : 'hidden md:block'} animate-fade-in`}>
                 <div className="flex flex-col border-t border-surface-100">
                   <div className="flex items-center py-2.5 border-b border-surface-100">
                     <div className="w-1/3 text-[13px] font-medium text-surface-500">Brand</div>
                     <div className="w-2/3 text-[13px] font-medium text-[#192168]">U.S. Polo Assn.</div>
                   </div>
                   <div className="flex items-center py-2.5 border-b border-surface-100">
                     <div className="w-1/3 text-[13px] font-medium text-surface-500">Fabric</div>
                     <div className="w-2/3 text-[13px] font-medium text-[#192168]">100% Cotton</div>
                   </div>
                   <div className="flex items-center py-2.5 border-b border-surface-100">
                     <div className="w-1/3 text-[13px] font-medium text-surface-500">Fit</div>
                     <div className="w-2/3 text-[13px] font-medium text-[#192168]">Regular Fit</div>
                   </div>
                   <div className="flex items-center py-2.5 border-b border-surface-100">
                     <div className="w-1/3 text-[13px] font-medium text-surface-500">Neck</div>
                     <div className="w-2/3 text-[13px] font-medium text-[#192168]">Round Neck</div>
                   </div>
                   <div className="flex items-center py-2.5 border-b border-surface-100">
                     <div className="w-1/3 text-[13px] font-medium text-surface-500">Sleeve</div>
                     <div className="w-2/3 text-[13px] font-medium text-[#192168]">Short Sleeve</div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Description */}
             <div className="space-y-4">
               <div className="flex items-center justify-between w-full group md:cursor-default">
                 <h2 className="text-[15px] font-extrabold text-[#192168]">Description</h2>
                 <span className="md:hidden">
                   {showDetails ? (
                     <ChevronUp className="w-5 h-5 text-[#192168]" />
                   ) : (
                     <ChevronDown className="w-5 h-5 text-[#192168]" />
                   )}
                 </span>
               </div>
               
               <div className={`${showDetails ? 'block' : 'hidden md:block'} animate-fade-in`}>
                 <p className="text-[13px] font-medium text-[#192168] leading-relaxed">
                   {product.description || 'Upgrade your everyday style with this solid round neck T-shirt from U.S. Polo Assn. Made from soft and breathable cotton fabric, this t-shirt offers all-day comfort and a timeless look. Pair it with jeans or chinos for a smart casual look.'}
                 </p>
                 <ul className="list-disc pl-5 mt-4 space-y-1.5 text-[13px] font-medium text-[#192168]">
                   <li>Pure cotton fabric for ultimate comfort</li>
                   <li>Classic round neck design</li>
                   <li>Regular fit</li>
                   <li>Embroidered logo on chest</li>
                   <li>Suitable for everyday wear</li>
                 </ul>
               </div>
             </div>

           </div>

           <div className="h-px bg-surface-100" />

           {/* Delivery Details */}
           <div className="w-full">
             <ProductDeliveryInfo />
           </div>

           <div className="h-px bg-surface-100" />

           {/* Ratings & Reviews */}
           <div className="space-y-5">
             <div className="flex items-center justify-between">
               <h2 className="text-[15px] font-extrabold text-[#192168]">Ratings & Reviews</h2>
               <button className="text-[13px] font-bold text-[#1668F6]">View All</button>
             </div>
             
             <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 md:px-4">
               {/* Overall */}
               <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-[#192168]">
                    <span className="text-4xl font-extrabold">4.3</span>
                    <Star className="w-6 h-6 fill-emerald-600 text-emerald-600" />
                  </div>
                  <span className="text-[12px] font-extrabold text-[#192168] mt-1">(1.2K Reviews)</span>
               </div>
               
               {/* Bars */}
               <div className="flex-1 max-w-sm space-y-2">
                  {[
                    { s: 5, p: 68, c: 'bg-emerald-600' },
                    { s: 4, p: 22, c: 'bg-emerald-600' },
                    { s: 3, p: 7, c: 'bg-emerald-300' },
                    { s: 2, p: 2, c: 'bg-emerald-300' },
                    { s: 1, p: 1, c: 'bg-emerald-300' },
                  ].map(b => (
                    <div key={b.s} className="flex items-center gap-2 text-[12px] font-extrabold text-[#192168]">
                      <span className="w-3 text-right">{b.s}</span>
                      <Star className="w-3 h-3 fill-emerald-600 text-emerald-600 -ml-0.5" />
                      <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                        <div className={`h-full ${b.c} rounded-full`} style={{ width: `${b.p}%` }} />
                      </div>
                      <span className="w-8 text-right font-extrabold text-[#192168]">{b.p}%</span>
                    </div>
                  ))}
               </div>
             </div>

             {/* Reviews List */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
               {[
                 { t: 'Great quality fabric and perfect fit.', a: 'Rahul Sharma', r: 5 },
                 { t: 'Comfortable and stylish. Loved it!', a: 'Amit Verma', r: 4 },
               ].map((rev, i) => (
                 <div key={i} className="p-4 bg-[#f4f5f9] rounded-xl space-y-2">
                   <div className="flex gap-0.5">
                     {Array.from({length: 5}).map((_, j) => (
                       <Star key={j} className={`w-3.5 h-3.5 ${j < rev.r ? 'fill-emerald-600 text-emerald-600' : 'fill-surface-200 text-surface-200'}`} />
                     ))}
                   </div>
                   <p className="text-[13px] font-extrabold text-[#192168]">{rev.t}</p>
                   <p className="text-[11px] font-medium text-[#192168] opacity-70">- {rev.a}</p>
                 </div>
               ))}
             </div>
           </div>

        </div>

        {/* ── RELATED PRODUCTS ── */}
        <div className="mt-8 space-y-8 px-4 md:px-0">
          <CrossSellRails title="More Products For You" products={[product, product]} />
          <CrossSellRails title="You May Also Like" products={[product, product]} />
        </div>
      </main>

      {/* ── MOBILE FIXED BOTTOM BAR ── */}
      <StickyBottomBar 
        onAddToCart={handleAddToCart}
        isAdded={isAdded}
      />
      
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
