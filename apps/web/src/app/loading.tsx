import React from 'react';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Banner Skeleton */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 pt-4 sm:pt-6 space-y-4">
        <div className="h-44 sm:h-64 md:h-80 w-full rounded-3xl bg-slate-200/70 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-2xl bg-slate-200/60 animate-pulse" />
          ))}
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 mt-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-7 w-48 rounded-lg bg-slate-200/80 animate-pulse" />
          <div className="h-4 w-20 rounded bg-slate-200/60 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 border border-slate-100 space-y-3">
              <div className="aspect-[16/10] w-full rounded-xl bg-slate-200/70 animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-slate-200/80 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-slate-200/60 animate-pulse" />
              <div className="h-5 w-1/3 rounded bg-slate-200/90 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

