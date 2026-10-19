import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  ScanBarcode,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { useCatalogStore } from '../../../stores/catalogStore.js';
import { WizardHelpSidebar } from './WizardHelpSidebar.js';
import { mediaApi } from '../../../lib/api.js';

const samplePerspectiveViews = [
  {
    title: 'Front View',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
  },
  {
    title: 'Back View',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=200&q=80',
  },
  {
    title: 'Side View',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=200&q=80',
  },
  {
    title: 'Neck Shot',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=200&q=80',
  },
  {
    title: 'Fabric / Zoom',
    image: 'https://images.unsplash.com/photo-1622445268121-ac30457e24cb?auto=format&fit=crop&w=200&q=80',
  },
];

export const AddProductStep2: React.FC = () => {
  const { draftProduct, updateDraftProduct, setWizardStep } = useCatalogStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const images = draftProduct.images || [];
  const name = draftProduct.name || '';
  const barcode = draftProduct.barcode || '';
  const description = draftProduct.description || '';

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files) return;
    const maxAllowed = 10 - images.length;
    const limit = Math.min(files.length, maxAllowed);
    if (limit <= 0) return;

    setIsUploadingImage(true);
    setUploadProgress(`Uploading 1/${limit} to Cloudinary...`);

    const fileList = Array.from(files).slice(0, limit);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file) continue;
      setUploadProgress(`Uploading ${i + 1}/${fileList.length} to Cloudinary...`);
      try {
        const uploadRes = await mediaApi.uploadImage(file, 'products');
        if (uploadRes?.url) {
          const current = useCatalogStore.getState().draftProduct.images || [];
          if (current.length < 10) {
            updateDraftProduct({ images: [...current, uploadRes.url] });
          }
        }
      } catch (err) {
        console.warn('Cloudinary upload fallback to local preview:', err);
        // Fallback to data URL if network/offline
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            const current = useCatalogStore.getState().draftProduct.images || [];
            if (current.length < 10) {
              updateDraftProduct({ images: [...current, result] });
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }

    setIsUploadingImage(false);
    setUploadProgress(null);
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed || images.length >= 10) return;
    updateDraftProduct({ images: [...images, trimmed] });
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    const next = [...images];
    next.splice(index, 1);
    updateDraftProduct({ images: next });
  };

  const handleUseSampleImages = () => {
    updateDraftProduct({
      images: samplePerspectiveViews.map((s) => s.image),
    });
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setWizardStep(3);
  };

  return (
    <form onSubmit={handleContinue} className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Main Form Cards */}
        <div className="lg:col-span-8 space-y-4">
          {/* Card 1: Product Images */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="text-sm font-bold text-slate-900">Product Images</h3>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View Image Guidelines</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 ml-8 mb-4">
              Upload high quality images of your product (JPG, PNG or WEBP. Max 10MB each).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Drag & Drop Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  handleFilesSelected(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`md:col-span-6 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-blue-200/80 hover:border-blue-400 bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  disabled={isUploadingImage}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
                  {isUploadingImage ? (
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  ) : (
                    <UploadCloud className="w-6 h-6" />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-800">
                  {isUploadingImage ? 'Uploading to Cloudinary...' : 'Drag & drop images here'}
                </div>
                <div className="text-xs text-blue-600 font-semibold mt-0.5">
                  {isUploadingImage ? (uploadProgress || 'Optimizing & uploading CDN asset...') : 'or click to browse'}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Cloudinary CDN acceleration active • Up to 10 images (Max 10MB each)
                </div>
              </div>

              {/* Sample Perspective Views Guide */}
              <div className="md:col-span-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700">
                    Sample Images <span className="font-normal text-slate-400">(Recommended views)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleUseSampleImages}
                    className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Use Sample Photos
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {samplePerspectiveViews.map((view, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-full aspect-square rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shadow-2xs">
                        <img
                          src={view.image}
                          alt={view.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[9px] text-slate-500 font-medium mt-1 text-center truncate w-full">
                        {view.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Image URL input option */}
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImageUrl();
                  }
                }}
                placeholder="Or paste external photo URL (https://...)"
                className="w-full sm:flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                disabled={!imageUrlInput.trim() || images.length >= 10}
                className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Add URL
              </button>
            </div>

            {/* Uploaded Thumbnails Preview Gallery */}
            {images.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Uploaded Photos ({images.length}/10):
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-lg border border-slate-200 overflow-hidden shadow-2xs group"
                    >
                      <img
                        src={img}
                        alt={`Uploaded preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 w-4 h-4 rounded-full bg-slate-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-blue-600/90 text-[8px] font-bold text-white text-center py-0.5">
                          COVER
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Product Information */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Product Information</h3>
            </div>
            <p className="text-xs text-slate-500 ml-8 mb-2">
              Enter the listing title, barcode, and detailed description for your product.
            </p>

            {/* Row 1: Product Name & Barcode */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              {/* Product Name */}
              <div className="md:col-span-8">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Product Name <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">{name.length}/150</span>
                </div>
                <input
                  type="text"
                  maxLength={150}
                  value={name}
                  onChange={(e) => updateDraftProduct({ name: e.target.value })}
                  placeholder="e.g. Men Black Round Neck T-Shirt"
                  className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              {/* Barcode (Optional) */}
              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Barcode <span className="font-normal text-slate-400">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => updateDraftProduct({ barcode: e.target.value })}
                    placeholder="Enter barcode or SKU"
                    className="w-full pl-3 pr-9 py-2 text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <ScanBarcode className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Product Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Product Description <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {description.length}/1000
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={1000}
                value={description}
                onChange={(e) => updateDraftProduct({ description: e.target.value })}
                placeholder="Enter rich description highlighting fabric composition, fit details, style pairing, and key customer benefits..."
                className="w-full p-3 text-xs leading-relaxed text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Guidance Sidebar */}
        <div className="lg:col-span-4">
          <WizardHelpSidebar step={2} />
        </div>
      </div>

      {/* Sticky Bottom Navigation Footer */}
      <div className="sticky bottom-0 z-20 -mx-4 -mb-4 px-6 py-3.5 bg-white/95 backdrop-blur-sm border-t border-slate-200/80 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Step 2 of 3</span>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-bold text-slate-800">Product Images &amp; Information</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setWizardStep(1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>Continue to Step 3</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </form>
  );
};
