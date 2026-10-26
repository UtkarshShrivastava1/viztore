'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Share2, ZoomIn, ArrowLeft, Star, CheckCircle, Package } from 'lucide-react';

interface ProductImageCarouselProps {
  productName: string;
  images: string[];
  storeName?: string;
  storeRating?: number;
  selectedImageIdx: number;
  setSelectedImageIdx: (idx: number) => void;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
}

export function ProductImageCarousel({
  productName,
  images,
  storeName = 'Official Store',
  storeRating = 4.7,
  selectedImageIdx,
  setSelectedImageIdx,
  onAddToCart,
  onBuyNow,
}: ProductImageCarouselProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  // Normalize images to have at least 1 image, and ensure array supports up to 8 slides/dots as per Mob 2.2
  const displayImages = images.length > 0 ? images : [''];
  // Pad up to 8 dots if product has multiple images or duplicate for carousel demo
  const dotCount = Math.min(8, Math.max(displayImages.length, 4));

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productName,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2000);
    }
  };

  return (
    <div className="md:sticky md:top-24 flex flex-col md:flex-row gap-4 h-fit">
      {/* ── DESKTOP: Vertical Thumbnail Strip (Left) ── */}
      <div className="hidden md:flex flex-col gap-2.5 w-16 lg:w-[72px] shrink-0 max-h-[580px] overflow-y-auto scrollbar-hide py-1">
        {displayImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedImageIdx(idx)}
            className={`w-full aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all bg-surface-100 ${
              selectedImageIdx === idx
                ? 'border-[#1668F6] ring-2 ring-blue-100 shadow-xs'
                : 'border-surface-200 hover:border-surface-300 opacity-80 hover:opacity-100'
            }`}
          >
            {img ? (
              <img src={img} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-6 h-6 text-surface-300" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* ── PRIMARY HERO IMAGE SHOWCASE ── */}
      <div className="flex-1 flex flex-col">
        <div className="relative aspect-[4/5] sm:aspect-square md:aspect-[3/4] bg-surface-100 md:rounded-3xl overflow-hidden w-full group">
          {displayImages[selectedImageIdx] ? (
            <img
              src={displayImages[selectedImageIdx]}
              alt={productName}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105 cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-20 h-20 text-surface-300" />
            </div>
          )}

          {/* ── FLOATING CONTROLS (Mob 2.2) ── */}
          {/* Back Button (Mobile only) */}
          <button
            type="button"
            onClick={() => router.back()}
            className="md:hidden absolute top-3 left-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-surface-200/80 flex items-center justify-center text-[#061842] active:scale-95 transition-all z-20"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Floating Wishlist & Share Pills (Right) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2.5 z-20">
            <button
              type="button"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-surface-200/80 flex items-center justify-center transition-all active:scale-90 ${
                isWishlisted ? 'text-rose-600 bg-rose-50' : 'text-surface-700 hover:text-rose-500'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-surface-200/80 flex items-center justify-center text-surface-700 hover:text-[#1668F6] transition-all active:scale-90"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Indicator (Desktop) */}
          <div className="hidden md:flex absolute bottom-4 right-4 z-10">
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className="h-8 px-3 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-surface-200 text-[#061842] hover:text-[#1668F6] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{isZoomed ? 'Reset' : 'Zoom'}</span>
            </button>
          </div>

          {/* ── 8-DOT CAROUSEL PAGINATION (Mob 2.2) ── */}
          <div className="md:hidden absolute bottom-3.5 left-0 right-0 flex justify-center items-center gap-1.5 z-10">
            {Array.from({ length: dotCount }).map((_, idx) => {
              const isActive = idx === (selectedImageIdx % dotCount);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx % displayImages.length)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isActive ? 'w-5 bg-[#1668F6]' : 'w-1.5 bg-surface-300/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* ── SELLER TRUST PILL (Mob 2.2 / Web 2.2) ── */}
        <div className="flex items-center justify-between mt-3 px-2">
          <div className="flex items-center gap-1.5 text-xs text-surface-600 font-semibold">
            <span>Sold by</span>
            <span className="font-extrabold text-[#061842]">{storeName}</span>
            <span className="inline-flex items-center text-emerald-600 font-bold text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle className="w-3 h-3 mr-0.5" /> Verified
            </span>
          </div>

          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black">
            <span>{storeRating}</span>
            <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" />
          </div>
        </div>

        {/* ── DESKTOP DUAL CTAs DIRECTLY UNDERNEATH GALLERY (Web 2.2) ── */}
        {(onAddToCart || onBuyNow) && (
          <div className="hidden md:flex items-center gap-3 mt-5">
            {onAddToCart && (
              <button
                type="button"
                onClick={onAddToCart}
                className="flex-1 h-12 rounded-2xl border-2 border-[#1668F6] text-[#1668F6] font-black text-sm hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Add to Cart</span>
              </button>
            )}
            {onBuyNow && (
              <button
                type="button"
                onClick={onBuyNow}
                className="flex-1 h-12 rounded-2xl bg-[#1668F6] hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Buy Now</span>
              </button>
            )}
          </div>
        )}

        {sharedToast && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#061842] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-50 animate-fade-in">
            Link copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
}
