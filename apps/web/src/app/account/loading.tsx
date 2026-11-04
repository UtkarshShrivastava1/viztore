import React from 'react';

export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-4 sm:pt-6">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4 h-fit">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-slate-200/80 animate-pulse" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-3/4 rounded bg-slate-200/80 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-slate-200/60 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 w-full rounded-xl bg-slate-200/60 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Main Area Skeleton */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="h-7 w-48 rounded-xl bg-slate-200/80 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-2xl bg-slate-100/80 animate-pulse p-4 space-y-2">
                    <div className="h-4 w-1/2 rounded bg-slate-200/70" />
                    <div className="h-3 w-3/4 rounded bg-slate-200/50" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

