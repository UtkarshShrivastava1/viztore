import React from 'react';

export default function StoreDetailLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-3 sm:pt-6">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 space-y-6">
        {/* Store Hero Banner Skeleton */}
        <div className="w-full rounded-3xl bg-white border border-slate-100 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="h-40 sm:h-52 w-full rounded-2xl bg-slate-200/70 animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-200/90 animate-pulse shrink-0 -mt-10 border-4 border-white shadow-md" />
            <div className="space-y-1.5 flex-1">
              <div className="h-6 w-48 rounded bg-slate-200/80 animate-pulse" />
              <div className="h-3.5 w-64 rounded bg-slate-200/60 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Section Tabs Skeleton */}
        <div className="flex gap-2 border-b border-slate-200/80 pb-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-28 rounded-xl bg-slate-200/70 animate-pulse" />
          ))}
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 border border-slate-100/90 shadow-2xs space-y-2.5">
              <div className="aspect-square w-full rounded-xl bg-slate-200/70 animate-pulse" />
              <div className="h-3.5 w-4/5 rounded bg-slate-200/80 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-slate-200/60 animate-pulse" />
              <div className="h-5 w-20 rounded bg-slate-200/90 animate-pulse pt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

