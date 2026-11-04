import React from 'react';

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-4 sm:pt-6">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 rounded bg-slate-200/60 animate-pulse mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-start">
          {/* Left Column: Image Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-3xl bg-slate-200/70 animate-pulse border border-slate-100" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-20 h-20 rounded-2xl bg-slate-200/60 animate-pulse shrink-0" />
              ))}
            </div>
          </div>

          {/* Right Column: Details & Actions Skeleton */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-2.5">
              <div className="h-4 w-28 rounded-full bg-blue-100/70 animate-pulse" />
              <div className="h-8 w-4/5 rounded-xl bg-slate-200/80 animate-pulse" />
              <div className="h-4 w-1/3 rounded bg-slate-200/60 animate-pulse" />
            </div>

            {/* Price Box Skeleton */}
            <div className="p-4 rounded-2xl bg-slate-50 space-y-2">
              <div className="h-7 w-32 rounded bg-slate-200/90 animate-pulse" />
              <div className="h-3 w-48 rounded bg-slate-200/60 animate-pulse" />
            </div>

            {/* Variant Pills Skeleton */}
            <div className="space-y-3">
              <div className="h-4 w-24 rounded bg-slate-200/70 animate-pulse" />
              <div className="flex gap-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 w-20 rounded-xl bg-slate-200/60 animate-pulse" />
                ))}
              </div>
            </div>

            {/* CTA Buttons Skeleton */}
            <div className="flex gap-4 pt-4">
              <div className="h-12 flex-1 rounded-2xl bg-blue-200/70 animate-pulse" />
              <div className="h-12 w-14 rounded-2xl bg-slate-200/70 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

