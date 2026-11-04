import React from 'react';

export default function StoresLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-4 sm:pt-6">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5">
            <div className="h-8 w-56 rounded-xl bg-slate-200/80 animate-pulse" />
            <div className="h-4 w-72 rounded bg-slate-200/60 animate-pulse" />
          </div>
          <div className="h-10 w-44 rounded-xl bg-slate-200/70 animate-pulse" />
        </div>

        {/* Stores Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs space-y-3">
              <div className="aspect-[16/10] w-full rounded-xl bg-slate-200/70 animate-pulse" />
              <div className="flex justify-between items-start">
                <div className="space-y-1 flex-1">
                  <div className="h-4 w-3/4 rounded bg-slate-200/80 animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-slate-200/60 animate-pulse" />
                </div>
                <div className="h-5 w-12 rounded-full bg-slate-200/70 animate-pulse" />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                <div className="h-3 w-20 rounded bg-slate-200/60 animate-pulse" />
                <div className="h-3 w-14 rounded bg-slate-200/60 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

