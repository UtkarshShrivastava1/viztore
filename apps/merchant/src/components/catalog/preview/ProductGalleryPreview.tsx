import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { getCategoryFallbackImage } from '../../../lib/taxonomyHelper.js';

interface ProductGalleryPreviewProps {
  images: string[];
  category?: string;
  subCategory?: string;
  name?: string;
}

export const ProductGalleryPreview: React.FC<ProductGalleryPreviewProps> = ({ images, category, subCategory, name }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const fallback = getCategoryFallbackImage(category, subCategory, name);
  const validImages =
    images && images.length > 0
      ? images
      : [fallback];

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Main Image Display */}
      <div className="relative w-full aspect-square rounded-xl bg-slate-100 border border-slate-200 overflow-hidden group shadow-2xs">
        <img
          src={validImages[currentIndex]}
          alt={`Product photo ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />

        {/* Counter Badge */}
        <div className="absolute bottom-2 right-2 bg-slate-900/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />
          <span>
            {currentIndex + 1} / {validImages.length}
          </span>
        </div>

        {/* Nav Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-md text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-md text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {validImages.map((imgUrl, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-12 h-12 rounded-lg border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'border-blue-600 ring-2 ring-blue-100 shadow-2xs'
                  : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={imgUrl}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
