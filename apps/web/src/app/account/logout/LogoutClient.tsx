'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Bell, LogOut,
  ArrowLeft, Lock, ShoppingCart, ShieldCheck
} from 'lucide-react';
import { AccountSidebar } from '@/components/account/AccountSidebar';

export function LogoutClient() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // TODO: Connect to backend API for logout
      // await authApi.logout();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Navigate to home after successful logout
      router.push('/account/logged-out');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    router.push('/account');
  };

  return (
    <div className="min-h-screen bg-[#ffffff] font-sans relative pb-24">
      <main className="max-w-[1680px] mx-auto px-4 lg:px-8 py-4 relative z-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Sidebar */}
        <AccountSidebar />

        <div className="flex-1 w-full min-w-0 flex flex-col pt-2">
          
          <div className="flex flex-col gap-5 relative z-10">
            
            {/* Header Area */}
            <div className="flex items-start justify-between relative">
              <div className="flex-1 min-w-0 z-10">
                <div className="flex items-center gap-2 mb-4">
                  <button type="button" onClick={() => router.back()} className="shrink-0 lg:hidden">
                    <ArrowLeft className="w-6 h-6 text-[#192168]" />
                  </button>
                  <h1 className="text-[28px] md:text-[32px] font-extrabold text-[#192168] leading-tight">Logout</h1>
                </div>
                <p className="text-[14px] text-surface-500 leading-relaxed max-w-[200px]">
                  Are you sure you want to logout from your account?
                </p>
              </div>

              {/* Decorative Graphic */}
              <div className="relative shrink-0 w-[120px] h-[140px] pointer-events-none z-0">
                <div className="absolute right-0 top-0 w-28 h-36 flex items-end justify-center z-10">
                  {/* Door Frame */}
                  <div className="w-20 h-32 bg-[#E8F0FE] rounded-t-lg relative border border-blue-200">
                    {/* Open Door */}
                    <div className="absolute bottom-0 left-0 w-full h-full bg-white border border-blue-200 origin-left transform skew-y-6 rounded-t-lg flex flex-col items-center justify-center shadow-lg z-20">
                      <div className="w-8 h-8 bg-[#E8F0FE] rounded-full flex items-center justify-center text-[#1668F6] mb-2">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="absolute right-2 top-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
                    </div>
                    {/* Inside Room (Darker) */}
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[#192168]/5 rounded-tr-lg z-10"></div>
                  </div>
                </div>
                
                {/* Exit Arrow */}
                <div className="absolute -left-2 top-1/3 w-10 h-10 bg-white border border-green-200 rounded-xl flex items-center justify-center z-30 shadow-sm">
                  <LogOut className="w-5 h-5 text-green-500" />
                </div>
                
                {/* Plant */}
                <div className="absolute -right-2 bottom-0 w-8 h-12 z-30 flex flex-col items-center justify-end">
                  <div className="w-4 h-6 bg-green-500 rounded-full rounded-bl-none transform -rotate-45 absolute bottom-4 right-1"></div>
                  <div className="w-4 h-6 bg-green-400 rounded-full rounded-br-none transform rotate-45 absolute bottom-3 left-0"></div>
                  <div className="w-2 h-4 bg-green-600 rounded-full absolute bottom-3"></div>
                  <div className="w-6 h-4 bg-surface-200 rounded-b-md rounded-t-sm z-10 border border-surface-300"></div>
                </div>

                <div className="absolute top-2 -left-2 text-blue-200 text-xs">✦</div>
                <div className="absolute top-10 right-28 text-blue-200 text-xs">✦</div>
              </div>
            </div>

            {/* Action Area */}
            <div className="mt-2">
              <h3 className="text-[15px] font-extrabold text-[#192168] mb-4">Logging out will</h3>
              
              <div className="flex flex-col gap-4 mb-6">
                {/* Security Card */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-[14px] flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-[13px] font-extrabold text-[#192168] mb-0.5">Keep your account secure</h4>
                    <p className="text-[11px] text-surface-500">You'll need to login again to access your account.</p>
                  </div>
                </div>

                {/* Devices Card */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-50 rounded-[14px] flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-[13px] font-extrabold text-[#192168] mb-0.5">Log you out from all devices</h4>
                    <p className="text-[11px] text-surface-500">You will be logged out from all devices for security.</p>
                  </div>
                </div>

                {/* Notifications Card */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-[14px] flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-[13px] font-extrabold text-[#192168] mb-0.5">Stop notifications</h4>
                    <p className="text-[11px] text-surface-500">You may stop receiving account related notifications.</p>
                  </div>
                </div>
              </div>

              {/* Privacy Shield */}
              <div className="bg-[#E8F0FE] rounded-2xl p-4 flex items-center gap-4 mb-6 relative overflow-hidden">
                <div className="w-12 h-12 bg-[#1668F6] rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div className="z-10 flex-1">
                  <h4 className="text-[13px] font-extrabold text-[#192168] mb-0.5">Your data is safe with us</h4>
                  <p className="text-[10px] text-[#192168]/70 leading-tight">We respect your privacy and ensure your data is always protected.</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full py-4 bg-[#F43F5E] hover:bg-[#E11D48] text-white rounded-[14px] text-[15px] font-extrabold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(244,63,94,0.3)]"
                >
                  <LogOut className="w-5 h-5" />
                  {isLoggingOut ? 'Logging out...' : 'Yes, Logout'}
                </button>
                <button 
                  onClick={handleCancel}
                  disabled={isLoggingOut}
                  className="w-full py-4 bg-white border border-[#1668F6] hover:bg-blue-50 text-[#1668F6] rounded-[14px] text-[15px] font-extrabold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

