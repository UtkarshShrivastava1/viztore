import React from 'react';

export default function DealsLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-4 sm:pt-6">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 space-y-6">
        <div className="space-y-1.5">
          <div className="h-8 w-48 rounded-xl bg-slate-200/80 animate-pulse" />
          <div className="h-4 w-64 rounded bg-slate-200/60 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs space-y-2.5">
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

