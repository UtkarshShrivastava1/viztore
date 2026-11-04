import React from 'react';

export default function CartLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-4 sm:pt-6">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
        <div className="h-8 w-44 rounded-xl bg-slate-200/80 animate-pulse mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 flex gap-4 items-center">
                <div className="w-20 h-20 rounded-xl bg-slate-200/70 animate-pulse shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 rounded bg-slate-200/80 animate-pulse" />
                  <div className="h-3 w-1/3 rounded bg-slate-200/60 animate-pulse" />
                  <div className="h-5 w-20 rounded bg-slate-200/90 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 h-fit space-y-4">
            <div className="h-5 w-32 rounded bg-slate-200/80 animate-pulse" />
            <div className="space-y-2 pt-2 border-t border-slate-50">
              <div className="flex justify-between">
                <div className="h-3 w-20 rounded bg-slate-200/60 animate-pulse" />
                <div className="h-3 w-12 rounded bg-slate-200/60 animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-24 rounded bg-slate-200/60 animate-pulse" />
                <div className="h-3 w-14 rounded bg-slate-200/60 animate-pulse" />
              </div>
            </div>
            <div className="h-11 w-full rounded-xl bg-blue-200/80 animate-pulse pt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

