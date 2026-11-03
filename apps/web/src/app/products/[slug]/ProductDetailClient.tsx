'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchProductBySlug, fetchProducts } from '@/lib/api/catalog';
import { useCartStore } from '@/stores/cart.store';
import { useWishlistFlyoutStore } from '@/stores/wishlistFlyoutStore';
import { 
  ShoppingBag, Share2, ChevronRight, Heart, 
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

const COLOR_HEX_MAP: Record<string, string> = {
  'space black': '#1c1b1f',
  'black': '#111827',
  'jet black': '#0a0a0a',
  'natural titanium': '#9a958d',
  'desert titanium': '#c4b5a0',
  'white titanium': '#e3e4e5',
  'black titanium': '#282829',
  'silver': '#e5e7eb',
  'white': '#ffffff',
  'midnight': '#191f2c',
  'starlight': '#f0ece1',
  'deep blue': '#1e3a8a',
  'blue': '#2563eb',
  'navy': '#1e293b',
  'dark green': '#14532d',
  'green': '#16a34a',
  'red': '#dc2626',
  'gold': '#d4af37',
  'rose gold': '#b76e79',
  'purple': '#7c3aed',
  'yellow': '#eab308',
  'gray': '#6b7280',
  'grey': '#6b7280',
};

function resolveColorHex(colorName?: string, explicitHex?: string): string {
  if (explicitHex && explicitHex.startsWith('#')) return explicitHex;
  if (!colorName) return '#64748b';
  const clean = colorName.trim().toLowerCase();
  if (clean.startsWith('#')) return clean;
  return COLOR_HEX_MAP[clean] || '#64748b';
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
  const isWishlisted = useWishlistFlyoutStore((state) =>
    product ? state.items.some((i) => i.id === product._id || i.productId === product._id) : false
  );
  const toggleWishlistStore = useWishlistFlyoutStore((state) => state.toggleItem);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const productAttributesList = React.useMemo(() => {
    const list: Array<{ label: string; value: string }> = [];
    if (product?.brand) {
      list.push({ label: 'Brand', value: product.brand });
    }
    const catName = typeof product?.category === 'string' ? product.category : (product?.category as any)?.name;
    if (catName) {
      list.push({ label: 'Category', value: catName.charAt(0).toUpperCase() + catName.slice(1) });
    }
    if (product?.subCategory) {
      list.push({ label: 'Sub-Category', value: product.subCategory });
    }
    if (product?.subType) {
      list.push({ label: 'Product Type', value: product.subType });
    }

    const rawAttrs = product?.attributes;
    if (Array.isArray(rawAttrs)) {
      rawAttrs.forEach((attr: any) => {
        if (attr && attr.key && attr.value) {
          const keyLower = String(attr.key).toLowerCase().trim();
          if (keyLower !== 'hasvariants' && keyLower !== 'totalvariants' && keyLower !== 'brand') {
            list.push({ label: String(attr.key), value: String(attr.value) });
          }
        }
      });
    } else if (rawAttrs && typeof rawAttrs === 'object') {
      Object.entries(rawAttrs).forEach(([k, v]) => {
        const keyLower = k.toLowerCase().trim();
        if (keyLower !== 'hasvariants' && keyLower !== 'totalvariants' && keyLower !== 'brand' && v) {
          list.push({ label: k.charAt(0).toUpperCase() + k.slice(1), value: String(v) });
        }
      });
    }

    if ((product as any)?.hsnCode) {
      list.push({ label: 'HSN Code', value: String((product as any).hsnCode) });
    }
    if ((product as any)?.gstRate !== undefined && (product as any)?.gstRate !== null) {
      list.push({ label: 'GST Rate', value: String((product as any).gstRate) + '%' });
    }
    if ((product as any)?.countryOfOrigin) {
      list.push({ label: 'Country of Origin', value: (product as any).countryOfOrigin });
    }
    if ((product as any)?.warranty) {
      list.push({ label: 'Warranty', value: (product as any).warranty });
    }
    return list;
  }, [product]);


  // Safe extraction of store and category metadata for recommendations (unconditional hook execution)
  const rawStoreId = product?.storeId;
  const storeId = typeof rawStoreId === 'object' && rawStoreId !== null
    ? (rawStoreId as { _id?: string })._id || String(rawStoreId)
    : String(rawStoreId || 'store-main');
  const storeName = product?.storeName || (typeof rawStoreId === 'object' && (rawStoreId as { name?: string })?.name) || 'Official Store';
  const categoryParam = typeof product?.category === 'string' ? product.category : (product?.category as any)?.name;

  // Fetch store products for "More Products from this Store" (Called unconditionally before early returns)
  const { data: storeProducts = [] } = useQuery({
    queryKey: ['store-products-recommendations', storeId, product?._id],
    queryFn: async () => {
      if (!storeId || storeId === 'store-main') return [];
      try {
        const res = await fetchProducts({ storeId, limit: 8 });
        return (res.products || []).filter((p: any) => p._id !== product?._id);
      } catch {
        return [];
      }
    },
    enabled: !!storeId && storeId !== 'store-main' && !!product?._id,
  });

  // Fetch category products for "You May Also Like" (Called unconditionally before early returns)
  const { data: categoryProducts = [] } = useQuery({
    queryKey: ['category-products-recommendations', categoryParam, product?._id],
    queryFn: async () => {
      if (!categoryParam) return [];
      try {
        const res = await fetchProducts({ category: categoryParam, limit: 8 });
        return (res.products || []).filter((p: any) => p._id !== product?._id);
      } catch {
        return [];
      }
    },
    enabled: !!categoryParam && !!product?._id,
  });

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
      </div>
    );
  }

  const variants = Array.isArray(product.variants) && product.variants.length > 0 ? product.variants : [];
  const selectedVariant = variants[selectedVariantIdx] || variants[0] || {
    price: product.basePrice || 0,
    mrp: product.baseMrp || product.basePrice || 0,
    images: Array.isArray((product as any).images) && (product as any).images.length > 0 ? (product as any).images : [],
    sku: product._id || 'STD-01',
    stock: product.totalStock || 10,
    isActive: true,
  };
  const rawImages = (selectedVariant?.images && selectedVariant.images.length > 0)
    ? selectedVariant.images
    : variants.flatMap((v) => v.images || []).filter(Boolean);
  const allImages = rawImages.length > 0 ? rawImages : (Array.isArray((product as any).images) ? (product as any).images : []);

  const discount = selectedVariant && selectedVariant.mrp > 0
    ? Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)
    : 0;

  const sizes = Array.from(new Set(variants.filter((v) => v.size && v.isActive !== false).map((v) => v.size!)));
  const colors = Array.from(new Set(variants.filter((v) => v.color && v.isActive !== false).map((v) => v.color!)));

  const currentColor = selectedVariant?.color || (variants.find((v) => v.color)?.color) || '';
  const currentSize = selectedVariant?.size || (variants.find((v) => v.size)?.size) || '';

  const handleSelectColor = (colorName: string) => {
    const matchExact = variants.findIndex((v) => v.color?.toLowerCase() === colorName.toLowerCase() && v.size === currentSize && v.isActive !== false);
    if (matchExact !== -1) {
      setSelectedVariantIdx(matchExact);
      return;
    }
    const matchColor = variants.findIndex((v) => v.color?.toLowerCase() === colorName.toLowerCase() && v.isActive !== false);
    if (matchColor !== -1) {
      setSelectedVariantIdx(matchColor);
    }
  };

  const handleSelectSize = (sizeName: string) => {
    const matchExact = variants.findIndex((v) => v.size === sizeName && v.color?.toLowerCase() === currentColor.toLowerCase() && v.isActive !== false);
    if (matchExact !== -1) {
      setSelectedVariantIdx(matchExact);
      return;
    }
    const matchSize = variants.findIndex((v) => v.size === sizeName && v.isActive !== false);
    if (matchSize !== -1) {
      setSelectedVariantIdx(matchSize);
    }
  };

  const handleToggleWishlist = () => {
    if (!product || !selectedVariant) return;
    toggleWishlistStore({
      id: product._id,
      productId: product._id,
      title: product.name,
      storeId,
      storeName,
      price: selectedVariant.price,
      originalPrice: selectedVariant.mrp,
      imageUrl: allImages[0] || '',
      slug: product.slug,
    });
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: product?.name || 'Product',
      text: `Check out ${product?.name}!`,
      url: shareUrl,
    };

    if (navigator.share && typeof navigator.canShare === 'function' && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'name' in err && err.name === 'AbortError') return;
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.warn('Failed to copy to clipboard', err);
    }
  };

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
            isWishlisted={isWishlisted}
            onToggleWishlist={handleToggleWishlist}
            onShare={handleShare}
            isCopied={isCopied}
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

            {/* Brand, Wishlist & Share Action Bar */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-surface-500 uppercase tracking-wider">
                {product.brand || product.storeName || 'Official Store'}
              </h2>
              <div className="flex items-center gap-2">
                {/* Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  className={`p-2 rounded-full border transition-all ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-500 scale-105 shadow-xs'
                      : 'border-surface-200 text-surface-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/50'
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Share Button with Fallback Clipboard */}
                <button
                  type="button"
                  onClick={handleShare}
                  title="Share product link"
                  className="p-2 rounded-full border border-surface-200 text-surface-400 hover:text-[#1668F6] hover:border-blue-200 hover:bg-blue-50/50 transition-all relative"
                >
                  <Share2 className="w-4 h-4" strokeWidth={2.5} />
                  {isCopied && (
                    <span className="absolute -top-8 right-0 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap animate-in fade-in">
                      Link copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-[20px] md:text-2xl font-extrabold text-[#192168] leading-tight">
                {product.name}
              </h1>
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
                  Color: <span className="font-bold text-surface-500 ml-1 capitalize">{currentColor || colors[0]}</span>
                </h3>
                <div className="flex items-center flex-wrap gap-2.5">
                  {colors.map((c) => {
                    const isSelected = c.toLowerCase() === currentColor.toLowerCase();
                    const variantForColor = variants.find((v) => v.color?.toLowerCase() === c.toLowerCase());
                    const hex = resolveColorHex(c, (variantForColor as any)?.colorHex);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleSelectColor(c)}
                        title={c}
                        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-[#1668F6] bg-blue-50/50 shadow-xs'
                            : 'border-surface-200 bg-white hover:border-[#192168]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/15 shrink-0 shadow-inner"
                          style={{ backgroundColor: hex }}
                        />
                        <span className={`text-xs font-bold ${isSelected ? 'text-[#1668F6]' : 'text-surface-700'}`}>
                          {c}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Select Size */}
            <div className="pt-2">
              <SizeSelector
                sizes={sizes}
                selectedSize={currentSize}
                onSelectSize={handleSelectSize}
                category={categoryParam}
                subCategory={product.subCategory}
              />
            </div>

            {/* Quantity and Actions Row */}
            <div className="flex flex-col md:flex-row items-center gap-4 pt-6 w-full">
              
              <div className="flex items-center justify-between w-full md:w-[120px] h-12 border-2 border-surface-200 rounded-xl px-4 md:px-1">
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

              <div className="flex items-center gap-4 w-full">
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
               
               <div className={'animate-fade-in ' + (showDetails ? 'block' : 'hidden md:block')}>
                 <div className="flex flex-col border-t border-surface-100">
                   {productAttributesList.length > 0 ? (
                     productAttributesList.map((item, idx) => (
                       <div key={idx} className="flex items-center py-2.5 border-b border-surface-100">
                         <div className="w-1/3 text-[13px] font-medium text-surface-500">{item.label}</div>
                         <div className="w-2/3 text-[13px] font-medium text-[#192168]">{item.value}</div>
                       </div>
                     ))
                   ) : (
                     <div className="flex items-center py-2.5 border-b border-surface-100">
                       <div className="w-1/3 text-[13px] font-medium text-surface-500">Brand</div>
                       <div className="w-2/3 text-[13px] font-medium text-[#192168]">{product.brand || product.storeName || 'Official Store'}</div>
                     </div>
                   )}
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
               
               <div className={'animate-fade-in ' + (showDetails ? 'block' : 'hidden md:block')}>
                 <p className="text-[13px] font-medium text-[#192168] leading-relaxed whitespace-pre-line">
                   {product.description || 'No detailed specifications or description provided for this product.'}
                 </p>
               </div>
             </div>

           </div>

           <div className="h-px bg-surface-100" />

           {/* Delivery Details */}
           <div className="w-full">
             <ProductDeliveryInfo />
           </div>


        </div>

        {/* ── RELATED PRODUCTS ── */}
        <div className="mt-8 space-y-8 px-4 md:px-0">
          <CrossSellRails 
            title="More Products from this Store" 
            products={storeProducts} 
            viewAllHref={storeId && storeId !== 'store-main' ? `/stores/${storeId}` : '/products'}
          />
          <CrossSellRails 
            title="You May Also Like" 
            products={categoryProducts} 
            viewAllHref={categoryParam ? `/category/${categoryParam}` : '/products'}
          />
        </div>
      </main>

      {/* ── MOBILE FIXED BOTTOM BAR ── */}
      <StickyBottomBar 
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isAdded={isAdded}
      />
    </div>
  );
}
