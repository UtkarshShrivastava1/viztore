'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Smartphone, Bell, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export default function LogoutPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <main className="min-h-screen bg-[#f4f5f9] pb-24 pt-4 flex flex-col">
      <div className="mx-auto max-w-3xl px-5 flex-1 flex flex-col">
        
        {/* Header Section */}
        <div className="relative mb-6">
          <div className="pr-32">
            <h1 className="text-[28px] font-bold text-[#192168] mb-2">Logout</h1>
            <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">Are you sure you want to logout from your account?</p>
          </div>
          {/* Mock Graphic Container */}
          <div className="absolute -top-4 right-0 w-32 h-32 bg-contain bg-no-repeat bg-right opacity-90"
               style={{ backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/4034/4034219.png')" }}>
          </div>
        </div>

        {/* Logging out will... */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-surface-200/50 mb-6">
          <h3 className="text-sm font-bold text-[#192168] mb-4">Logging out will</h3>
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                <Lock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-0.5">Keep your account secure</h4>
                <p className="text-[11px] text-gray-500">You'll need to login again to access your account.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50">
                <Smartphone className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-0.5">Log you out from all devices</h4>
                <p className="text-[11px] text-gray-500">You will be logged out from all devices for security.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <Bell className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-0.5">Stop notifications</h4>
                <p className="text-[11px] text-gray-500">You may stop receiving account related notifications.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Banner */}
        <div className="flex items-center gap-4 rounded-xl bg-blue-50 p-4 border border-blue-100 mb-8">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1668F6] text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#192168] text-sm">Your data is safe with us</h4>
            <p className="mt-0.5 text-[11px] text-blue-800/80 leading-tight">We respect your privacy and ensure your data is always protected.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto space-y-3">
          <button 
            onClick={() => {
              logout();
              router.push('/account/logged-out');
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF3B30] py-3.5 text-sm font-bold text-white shadow-sm hover:bg-red-600 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Yes, Logout
          </button>
          
          <button 
            onClick={() => router.back()}
            className="flex w-full items-center justify-center rounded-xl border-2 border-[#1668F6] bg-white py-3 text-sm font-bold text-[#1668F6] hover:bg-blue-50 transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </main>
  );
}
