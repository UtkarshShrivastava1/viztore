'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchProductBySlug, fetchFeaturedProducts } from '@/lib/api/catalog';
import { useCartStore } from '@/stores/cart.store';
import { usePdpStore } from '@/stores/pdp.store';
import { ChevronRight, Package, Minus, Plus, ShoppingBag, Zap, Check } from 'lucide-react';
import { ProductImageCarousel } from '@/features/pdp/ProductImageCarousel';
import { SizeSelector } from '@/features/pdp/SizeSelector';
import { ProductCoupons } from '@/features/pdp/ProductCoupons';
import { ProductSpecs } from '@/features/pdp/ProductSpecs';
import { ProductReviews } from '@/features/pdp/ProductReviews';
import { StickyBottomBar } from '@/features/pdp/StickyBottomBar';
import { CrossSellRails } from '@/features/pdp/CrossSellRails';

interface ProductDetailClientProps {
  slug: string;
}

export function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const {
    activeImageIndex,
    setActiveImageIndex,
    resetPdpState,
  } = usePdpStore();

  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Clean PDP store state on mount/unmount
  useEffect(() => {
    return () => {
      resetPdpState();
    };
  }, [resetPdpState]);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => fetchFeaturedProducts(6),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent pt-4 sm:pt-8 pb-16">
        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-pulse">
          <div className="h-5 w-48 bg-surface-200 rounded-md mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-6 aspect-[4/5] bg-surface-200 rounded-3xl" />
            <div className="lg:col-span-6 space-y-5">
              <div className="h-4 w-28 bg-surface-200 rounded" />
              <div className="h-8 w-4/5 bg-surface-200 rounded-lg" />
              <div className="h-10 w-44 bg-surface-200 rounded-lg" />
              <div className="h-24 w-full bg-surface-200 rounded-2xl" />
              <div className="h-12 w-full bg-surface-200 rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-transparent pt-16">
        <main className="max-w-[1440px] mx-auto px-4 py-20 text-center">
          <Package className="w-16 h-16 mx-auto text-surface-400 mb-4" />
          <h1 className="text-xl font-black text-[#061842]">Product Not Found</h1>
          <p className="text-sm text-surface-500 mt-2">
            The requested product is currently unavailable or has been relocated.
          </p>
          <Link
            href="/products"
            className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-[#1668F6] text-white text-sm font-extrabold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Explore Catalog
          </Link>
        </main>
      </div>
    );
  }

  // Determine active variant
  const selectedVariant = product.variants?.[0] || {
    sku: `${product._id}-0`,
    price: product.basePrice,
    mrp: product.baseMrp || product.basePrice,
    images: [],
    stock: 10,
    isActive: true,
  };

  const allImages = (product.variants?.flatMap((v) => v.images).filter(Boolean).length > 0
    ? Array.from(new Set(product.variants.flatMap((v) => v.images).filter(Boolean)))
    : [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
      ]) as string[];

  const discount =
    selectedVariant.mrp > selectedVariant.price
      ? Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)
      : 0;

  const sizes = Array.from(
    new Set(product.variants?.filter((v) => v.size).map((v) => v.size!) || ['S', 'M', 'L', 'XL', 'XXL'])
  );
  const outOfStockSizes = ['XXL']; // Demo slash representation as per Mob 2.2 specs
  const colors = Array.from(
    new Set(product.variants?.filter((v) => v.color).map((v) => v.color!) || ['#1E293B', '#1668F6', '#10B981'])
  );

  const rawStoreId = product.storeId;
  const storeId =
    typeof rawStoreId === 'object' && rawStoreId !== null
      ? (rawStoreId as { _id?: string })._id || String(rawStoreId)
      : String(rawStoreId || 'store-main');
  const storeName =
    product.storeName ||
    (typeof rawStoreId === 'object' && (rawStoreId as { name?: string })?.name) ||
    'Official Store';

  const handleAddToCart = () => {
    const success = addItem(
      {
        productId: product._id,
        sku: selectedVariant.sku || `${product._id}-0`,
        name: product.name,
        imageUrl: allImages[activeImageIndex] || allImages[0] || '',
        unitPrice: selectedVariant.price,
        storeId,
        storeName,
      },
      qty
    );

    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
      openCart();
    }
  };

  const handleBuyNow = () => {
    addItem(
      {
        productId: product._id,
        sku: selectedVariant.sku || `${product._id}-0`,
        name: product.name,
        imageUrl: allImages[activeImageIndex] || allImages[0] || '',
        unitPrice: selectedVariant.price,
        storeId,
        storeName,
      },
      qty
    );
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-transparent pb-28 md:pb-16">
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-10">
        {/* ── BREADCRUMB TRAIL ── */}
        <nav
          aria-label="Breadcrumb"
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-surface-500"
        >
          <Link href="/" className="hover:text-[#061842] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/category/${product.category?.toString().toLowerCase() || 'catalog'}`}
            className="hover:text-[#061842] transition-colors capitalize"
          >
            {product.category?.toString().replace('_', ' ') || 'Catalog'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#061842] font-extrabold truncate max-w-sm">
            {product.name}
          </span>
        </nav>

        {/* ── UPPER VIEWPORT: HERO SHOWCASE & PRODUCT DETAILS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Gallery (Web 2.2 / Mob 2.2) */}
          <div className="lg:col-span-7">
            <ProductImageCarousel
              productId={product._id}
              productPrice={selectedVariant.price}
              productMrp={selectedVariant.mrp || product.baseMrp}
              productName={product.name}
              images={allImages}
              storeName={storeName}
              storeId={storeId}
              storeRating={4.7}
              selectedImageIdx={activeImageIndex}
              setSelectedImageIdx={setActiveImageIndex}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>

          {/* Right Selection & Pricing Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Brand & Name */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#1668F6] uppercase tracking-wider">
                  {product.brand || storeName}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  In Stock ({product.totalStock || 12} left)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#061842] leading-tight mt-1">
                {product.name}
              </h1>
            </div>

            {/* Price Block */}
            <div className="p-4 rounded-2xl bg-surface-50 border border-surface-200">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#061842]">
                  ₹{selectedVariant.price.toLocaleString('en-IN')}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-base sm:text-lg font-bold text-surface-400 line-through">
                      ₹{selectedVariant.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs font-bold text-emerald-700 mt-1">
                Inclusive of all taxes • Free delivery available
              </p>
            </div>

            {/* Promotional Voucher Cards (Web 2.2) */}
            <ProductCoupons />

            <div className="h-px bg-surface-200 w-full" />

            {/* Variant Matrix (Size & Color) */}
            <SizeSelector
              sizes={sizes}
              colors={colors}
              outOfStockSizes={outOfStockSizes}
            />

            {/* Quantity Selector & Action Buttons (Desktop) */}
            <div className="hidden lg:flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-between w-32 h-12 border-2 border-surface-200 rounded-2xl px-2 bg-white">
                  <button
                    type="button"
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    disabled={qty <= 1}
                    className="w-8 h-8 flex items-center justify-center text-surface-400 hover:text-[#061842] disabled:opacity-30 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <span className="font-black text-[#061842] text-sm select-none">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((prev) => Math.min(10, prev + 1))}
                    className="w-8 h-8 flex items-center justify-center text-surface-400 hover:text-[#061842] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 h-12 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-98 ${
                    isAdded
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                      : 'border-[#1668F6] text-[#1668F6] hover:bg-blue-50/50'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-12 rounded-2xl bg-[#1668F6] hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Instant Buy Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── LOWER VIEWPORT: SPECIFICATIONS & REVIEWS (Web 2.3 / Mob 2.3) ── */}
        <div className="pt-8 border-t border-surface-200 space-y-12">
          {/* Specifications Matrix & Trust Badges */}
          <ProductSpecs product={product} />

          {/* Verified Customer Reviews */}
          <ProductReviews />

          {/* Cross-Sell & Similar Items Rail */}
          {relatedProducts.length > 0 && (
            <div className="pt-6">
              <CrossSellRails
                title="Similar Items You May Like"
                products={relatedProducts}
              />
            </div>
          )}
        </div>
      </main>

      {/* ── MOBILE STICKY BOTTOM BAR (Mob 2.2) ── */}
      <StickyBottomBar
        price={selectedVariant.price}
        mrp={selectedVariant.mrp}
        discount={discount}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isAdded={isAdded}
      />
    </div>
  );
}
