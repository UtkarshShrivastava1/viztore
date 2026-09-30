'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, MapPin, Heart, Ticket, Store, MessageSquare,
  HeadphonesIcon, Shield, FileText, LogOut, User, Bell,
  Calendar, ShoppingBasket, Pencil, CalendarDays, CheckCircle2,
  Settings, ChevronRight, Briefcase, Truck, RotateCcw, Star
} from 'lucide-react';
import { branding } from '@repo/shared-types';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { useAuthStore } from '@/stores/auth.store';

export function AccountClient() {
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const [isEditingMobile, setIsEditingMobile] = useState(false);

  const [formData] = useState({
    fullName: user?.fullName || 'Harish Kumar',
    mobileNumber: user?.phone ? `+91 ${user.phone}` : '+91 91234 56789',
    email: user?.email || 'harishkumar@gmail.com',
    dob: '15 Mar 2002',
    gender: 'Male',
  });

  // Mobile Dashboard View
  if (isEditingMobile) {
    return (
      <div className="min-h-screen bg-white font-sans relative pb-28">
        <main className="max-w-xl mx-auto px-4 pt-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setIsEditingMobile(false)} className="text-[#192168] p-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h1 className="text-[20px] font-bold text-[#192168]">Edit Profile</h1>
          </div>

          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-[14px] font-bold text-[#192168] mb-0.5">Profile Picture</h3>
                <p className="text-[12px] text-surface-500">Update your profile picture</p>
              </div>
              <div className="relative">
                <div className="w-20 h-20 bg-[#E8F0FE] rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-[#1668F6]" fill="currentColor" />
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border border-surface-200 shadow-sm flex items-center justify-center text-[#1668F6]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label className="text-[13px] font-bold text-[#192168] mb-1.5 block">Full Name</label>
                <div className="relative">
                  <input type="text" defaultValue={formData.fullName} className="w-full bg-white border border-surface-200 rounded-lg px-4 py-3 text-[14px] font-medium text-[#192168] focus:border-[#1668F6] focus:outline-none" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#192168]">
                    <User className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-[13px] font-bold text-[#192168] mb-1.5 block">Mobile Number</label>
                <div className="relative flex items-center bg-white border border-surface-200 rounded-lg pr-1">
                  <input type="tel" defaultValue={formData.mobileNumber} className="flex-1 bg-transparent px-4 py-3 text-[14px] font-medium text-[#192168] focus:outline-none rounded-lg" />
                  <div className="flex items-center gap-2 pr-3">
                    <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                      <span className="text-[11px] font-bold">Verified</span>
                    </div>
                    <div className="w-px h-5 bg-surface-200"></div>
                    <button className="p-1 text-[#192168]">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="text-[13px] font-bold text-[#192168] mb-1.5 block">Email Address</label>
                <div className="relative flex items-center bg-white border border-surface-200 rounded-lg pr-1">
                  <input type="email" defaultValue={formData.email} className="flex-1 bg-transparent px-4 py-3 text-[14px] font-medium text-[#192168] focus:outline-none rounded-lg" />
                  <div className="flex items-center gap-2 pr-3">
                    <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                      <span className="text-[11px] font-bold">Verified</span>
                    </div>
                    <div className="w-px h-5 bg-surface-200"></div>
                    <button className="p-1 text-[#192168]">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="text-[13px] font-bold text-[#192168] mb-1.5 block">Date of Birth</label>
                <div className="relative">
                  <input type="text" defaultValue={formData.dob} className="w-full bg-white border border-surface-200 rounded-lg px-4 py-3 text-[14px] font-medium text-[#192168] focus:border-[#1668F6] focus:outline-none" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#192168]">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-[13px] font-bold text-[#192168] mb-1.5 block">Gender</label>
                <div className="relative">
                  <select className="w-full bg-white border border-surface-200 rounded-lg px-4 py-3 text-[14px] font-medium text-[#192168] appearance-none focus:border-[#1668F6] focus:outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#192168] pointer-events-none">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

            </div>

            {/* Security Notice */}
            <div className="mt-8 bg-blue-50/50 rounded-xl p-4 flex items-start gap-3">
              <div className="mt-0.5">
                <Shield className="w-5 h-5 text-[#1668F6]" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#192168]">Your information is safe with us</h4>
                <p className="text-[11px] text-surface-500 mt-0.5">We never share your personal details with anyone.</p>
              </div>
            </div>

            {/* Save Button */}
            <button className="w-full mt-6 bg-[#1668F6] hover:bg-blue-700 text-white font-bold text-[15px] py-3.5 rounded-xl transition-colors">
              Save Changes
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f9] relative font-sans">
      <main className="max-w-[1680px] mx-auto px-4 lg:px-8 pt-6 pb-28 lg:pb-6 relative z-10">
        
        {/* ================= MOBILE VIEW ================= */}
        <div className="block lg:hidden space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[24px] font-bold text-[#1668F6] mb-2">My Account</h1>
              <p className="text-[12px] text-surface-600 font-medium">Manage your profile, orders and preferences</p>
            </div>
            <button className="w-10 h-10 flex items-center justify-center text-[#192168]">
              <Settings className="w-6 h-6" />
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-surface-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-[#E8F0FE] rounded-full flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-[#1668F6]" />
              </div>
              <div>
                <h2 className="text-[14px] font-bold text-[#192168]">{isAuthenticated ? formData.fullName : 'Guest'}</h2>
                <p className="text-[11px] font-medium text-surface-600 mt-0.5">{isAuthenticated ? formData.mobileNumber : 'Sign in'}</p>
                {isAuthenticated && <p className="text-[10px] text-surface-500">{formData.email}</p>}
              </div>
            </div>
            <button onClick={() => setIsEditingMobile(true)} className="flex items-center text-[12px] font-bold text-[#1668F6]">
              Edit Profile <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>

          {/* My Orders */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-surface-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold text-[#192168]">My Orders</h3>
              <Link href="/account/orders" className="text-[12px] font-bold text-[#1668F6] flex items-center">
                View All Orders <ChevronRight className="w-3 h-3 ml-0.5" />
              </Link>
            </div>
            <div className="flex justify-between px-2">
              <OrderStat icon={<Briefcase className="w-6 h-6 text-purple-500" />} bg="bg-purple-50" count="2" label="All Orders" />
              <OrderStat icon={<Truck className="w-6 h-6 text-orange-500" />} bg="bg-orange-50" count="1" label="To Be Delivered" />
              <OrderStat icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />} bg="bg-emerald-50" count="3" label="Delivered" />
              <OrderStat icon={<RotateCcw className="w-6 h-6 text-rose-500" />} bg="bg-rose-50" count="0" label="Returns" />
            </div>
          </div>

          {/* Reserve / Pickup Orders */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/account/orders/reserve" className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-surface-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-[9px] font-bold text-[#192168]">Reserve Orders</h4>
                  <p className="text-[9px] text-surface-500">View your reserved items</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-surface-400" />
            </Link>
            <Link href="/account/orders/pickup" className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-surface-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                  <ShoppingBasket className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-[12px] font-bold text-[#192168]">Pickup Orders</h4>
                  <p className="text-[10px] text-surface-500">View items to be picked up</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-surface-400" />
            </Link>
          </div>

          {/* Favourite Stores */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-surface-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold text-[#192168]">Favourite Stores</h3>
              <Link href="/account/stores" className="text-[12px] font-bold text-[#1668F6] flex items-center">
                View All Fav Stores <ChevronRight className="w-3 h-3 ml-0.5" />
              </Link>
            </div>
            <div className="flex overflow-x-auto gap-3 pb-2 -mx-1 px-1 hide-scrollbar">
              <StoreCard name="Fashion Hub" category="Clothing, Accessories" rating="4.5" reviews="1.2K" color="bg-black text-white" />
              <StoreCard name="Tech World" category="Electronics" rating="4.3" reviews="856" color="bg-emerald-900 text-yellow-400" />
              <StoreCard name="Home Delight" category="Home & Kitchen" rating="4.6" reviews="1.1K" color="bg-rose-900 text-white" />
              <StoreCard name="Beauty Glow" category="Beauty & Personal Care" rating="4.2" reviews="732" color="bg-pink-100 text-pink-600" />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden">
            <div className="divide-y divide-surface-100">
              <MobileNav icon={<MapPin className="w-5 h-5 text-blue-500" />} bg="bg-blue-50" title="Manage Addresses" desc="Manage your saved addresses" href="/account/addresses" />
              <MobileNav icon={<Bell className="w-5 h-5 text-amber-500" />} bg="bg-amber-50" title="Notifications" desc="View your notifications and updates" href="/account/notifications" />
              <MobileNav icon={<Heart className="w-5 h-5 text-rose-500" />} bg="bg-rose-50" title="Wishlist" desc="View your favourite items" href="/account/wishlist" />
              <MobileNav icon={<Ticket className="w-5 h-5 text-emerald-500" />} bg="bg-emerald-50" title="Coupons & Offers" desc="View available offers and discounts" href="/account/coupons" />
              <MobileNav 
                icon={<Store className="w-5 h-5 text-blue-500" />} 
                bg="bg-blue-50" 
                title="Sell on Viztore" 
                desc="Start selling and grow your business" 
                href="/account/sell" 
                badge="New"
              />
              <MobileNav icon={<MessageSquare className="w-5 h-5 text-orange-400" />} bg="bg-orange-50" title="Feedback" desc="Share your feedback with us" href="/account/feedback" />
              <MobileNav icon={<HeadphonesIcon className="w-5 h-5 text-orange-500" />} bg="bg-orange-50" title="Help & Support" desc="Get help or raise a ticket" href="/account/support" />
              <MobileNav icon={<Shield className="w-5 h-5 text-blue-600" />} bg="bg-blue-50" title="Privacy Policy" desc="Read our privacy policy" href="/account/privacy" />
              <MobileNav icon={<FileText className="w-5 h-5 text-emerald-500" />} bg="bg-emerald-50" title="Terms & Conditions" desc="Read our terms and conditions" href="/account/terms" />
              <MobileNav icon={<LogOut className="w-5 h-5 text-rose-500" />} bg="bg-rose-50" title="Logout" desc="Logout from your account" href="/account/logout" />
            </div>
          </div>

        </div>

        {/* ================= DESKTOP VIEW ================= */}
        <div className="hidden lg:flex gap-6 items-start">
          {/* Left Sidebar */}
          <AccountSidebar />

          {/* Right Main Content */}
          <div className="flex-1 w-full flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-[24px] font-bold text-[#192168]">Profile Information</h1>
                <p className="text-[14px] text-surface-500 mt-1">Manage your personal information and account details.</p>
              </div>
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1668F6] text-white text-[14px] font-bold rounded-lg hover:bg-blue-700 transition self-start sm:self-auto">
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-surface-200/60 p-6 space-y-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-[18px] font-bold text-[#192168]">Personal Information</h3>
                  <p className="text-[13px] text-surface-500">Keep your personal details up to date.</p>
                </div>
                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="text-[13px] font-bold text-[#192168] mb-1.5 block">Full Name</label>
                    <input type="text" readOnly value={formData.fullName} className="w-full bg-white border border-surface-200 rounded-lg px-4 py-2.5 text-[14px] text-surface-700 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[13px] font-bold text-[#192168] mb-1.5 block">Date of Birth</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2"><CalendarDays className="w-5 h-5 text-surface-400" /></div>
                      <input type="text" readOnly value={formData.dob} className="w-full lg:w-64 bg-white border border-surface-200 rounded-lg pl-10 pr-4 py-2.5 text-[14px] text-surface-700 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-bold text-[#192168] mb-2 block">Gender</label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.gender === 'Male' ? 'border-[#1668F6]' : 'border-surface-300'}`}>
                          {formData.gender === 'Male' && <div className="w-2.5 h-2.5 rounded-full bg-[#1668F6]" />}
                        </div>
                        <span className="text-[14px] text-surface-700">Male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.gender === 'Female' ? 'border-[#1668F6]' : 'border-surface-300'}`}>
                          {formData.gender === 'Female' && <div className="w-2.5 h-2.5 rounded-full bg-[#1668F6]" />}
                        </div>
                        <span className="text-[14px] text-surface-700">Female</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="border-surface-100" />
              <div className="space-y-4">
                <div>
                  <h3 className="text-[18px] font-bold text-[#192168]">Contact Information</h3>
                  <p className="text-[13px] text-surface-500">This information will be used for order updates and account communications.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                  <div>
                    <label className="text-[13px] font-bold text-[#192168] mb-1.5 block">Email Address</label>
                    <div className="flex items-center gap-3">
                      <input type="email" readOnly value={formData.email} className="flex-1 bg-white border border-surface-200 rounded-lg px-4 py-2.5 text-[14px] text-surface-700 focus:outline-none" />
                      <button className="flex items-center gap-1.5 text-[#1668F6] text-[13px] font-bold hover:underline"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] font-bold text-emerald-700">Verified</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-bold text-[#192168] mb-1.5 block">Mobile Number</label>
                    <div className="flex items-center gap-3">
                      <input type="tel" readOnly value={formData.mobileNumber} className="flex-1 bg-white border border-surface-200 rounded-lg px-4 py-2.5 text-[14px] text-surface-700 focus:outline-none" />
                      <button className="flex items-center gap-1.5 text-[#1668F6] text-[13px] font-bold hover:underline"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] font-bold text-emerald-700">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

// Subcomponents for mobile dashboard
function OrderStat({ icon, bg, count, label }: any) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-2 shadow-[0_2px_10px_rgba(0,0,0,0.03)]`}>
        {icon}
      </div>
      <span className="font-extrabold text-[16px] text-[#192168] leading-tight">{count}</span>
      <span className="text-[10px] text-surface-500 text-center font-medium mt-0.5 whitespace-nowrap">{label}</span>
    </div>
  );
}

function StoreCard({ name, category, rating, reviews, color }: any) {
  return (
    <div className="min-w-[140px] border border-surface-100 rounded-xl p-3 flex flex-col items-center text-center bg-white shadow-sm shrink-0">
      <div className="w-full flex justify-end mb-1">
        <Heart className="w-3.5 h-3.5 text-surface-400" />
      </div>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-center text-[12px] leading-tight mb-2 ${color}`}>
        {name.split(' ').map((n: string) => n[0]).join('') !== name ? name.split(' ').join('\n') : name}
      </div>
      <h4 className="text-[13px] font-bold text-[#192168] mb-0.5 line-clamp-1">{name}</h4>
      <p className="text-[10px] text-surface-500 mb-1.5">{category}</p>
      <div className="flex items-center gap-1 text-[10px] font-bold text-surface-600">
        <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
        <span className="text-emerald-600">{rating}</span>
        <span className="font-normal text-surface-400">({reviews})</span>
      </div>
    </div>
  );
}

function MobileNav({ icon, bg, title, desc, href, badge }: any) {
  return (
    <Link href={href} className="flex items-center justify-between p-4 bg-white hover:bg-surface-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-[13px] font-bold text-[#192168]">{title}</h4>
            {badge && <span className="px-1.5 py-0.5 bg-[#1668F6] text-white text-[9px] font-bold rounded-md">{badge}</span>}
          </div>
          <p className="text-[11px] text-surface-500">{desc}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-surface-400" />
    </Link>
  );
}

