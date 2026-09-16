import React from 'react';
import { Heart, Share2, Search, Package } from 'lucide-react';

interface ProductImageCarouselProps {
  productName: string;
  images: string[];
  selectedImageIdx: number;
  setSelectedImageIdx: (idx: number) => void;
}

export function ProductImageCarousel({
  productName,
  images,
  selectedImageIdx,
  setSelectedImageIdx,
}: ProductImageCarouselProps) {
  return (
    <div className="md:sticky md:top-24 h-max flex flex-col md:flex-row gap-4">
      
      {/* Desktop Thumbnails (Vertical on Left) */}
      <div className="hidden md:flex flex-col gap-3 w-16 lg:w-[72px] shrink-0 max-h-[80vh] overflow-y-auto scrollbar-hide">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImageIdx(idx)}
            className={`w-full aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all bg-[#f4f5f9] ${
              selectedImageIdx === idx ? 'border-[#1668F6]' : 'border-transparent hover:border-surface-300'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 aspect-[4/5] md:aspect-[3/4] bg-[#f4f5f9] md:rounded-2xl overflow-hidden w-full">
        {images.length > 0 ? (
          <img
            src={images[selectedImageIdx] || images[0]}
            alt={productName}
            className="w-full h-full object-contain p-4 md:p-0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-20 h-20 text-surface-300" />
          </div>
        )}

        {/* Top Right Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#192168] hover:text-rose-500 transition-colors border border-surface-200">
            <Heart className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#192168] hover:text-[#1668F6] transition-colors border border-surface-200">
            <Share2 className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Zoom Button (Bottom Right Desktop) */}
        <div className="hidden md:flex absolute bottom-4 right-4 z-10">
          <button className="h-9 px-4 rounded-full bg-white shadow-sm flex items-center gap-1.5 text-[#192168] hover:text-[#1668F6] transition-colors font-bold text-xs border border-surface-200">
            <Search className="w-4 h-4" strokeWidth={2.5} />
            Zoom
          </button>
        </div>

        {/* Pagination Dots (Mobile primarily) */}
        {images.length > 1 && (
          <div className="md:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIdx(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === selectedImageIdx ? 'w-4 bg-[#192168]' : 'w-1.5 bg-surface-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
