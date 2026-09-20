import React from 'react';
import {
  X,
  CheckCircle2,
  ChevronRight,
  LogOut,
  User,
  Building,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Lock,
  Bell,
  Star,
} from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore.js';

interface SellerProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfileInfo: () => void;
}

export const SellerProfileDrawer: React.FC<SellerProfileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenProfileInfo,
}) => {
  const { user, currentStore, logout } = useAuthStore();

  if (!isOpen) return null;

  const storeName = currentStore?.name || user?.fullName || 'My Store';
  const email = currentStore?.email || user?.email || 'merchant@example.com';
  const phone = currentStore?.phone || user?.phone || '+91 98765 43210';
  const sellerId = currentStore?._id ? `SLR-${String(currentStore._id).slice(-5).toUpperCase()}` : 'SLR-10245';
  const businessType = currentStore?.category ? `${currentStore.category} Store` : 'Retail Store';
  const gstin = currentStore?.legalDetails?.gstin || '22ABCDE1234F1Z5';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="relative w-full max-w-[420px] bg-white text-slate-800 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Seller Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Avatar & Verified Banner */}
          <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-md shrink-0">
              {storeName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-900">{storeName}</h3>
                <CheckCircle2 className="w-4 h-4 fill-blue-600 text-white" />
              </div>
              <span className="inline-block mt-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                Verified Seller
              </span>
            </div>
          </div>

          {/* Seller Metadata List */}
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="flex items-center gap-2 text-slate-500">
                <User className="w-3.5 h-3.5" /> Seller ID
              </span>
              <span className="font-semibold text-slate-800 font-mono">{sellerId}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="flex items-center gap-2 text-slate-500">
                <Building className="w-3.5 h-3.5" /> Business Type
              </span>
              <span className="font-semibold text-slate-800">{businessType}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="flex items-center gap-2 text-slate-500">
                <FileText className="w-3.5 h-3.5" /> GSTIN
              </span>
              <span className="font-semibold text-slate-800 font-mono">{gstin}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="flex items-center gap-2 text-slate-500">
                <Mail className="w-3.5 h-3.5" /> Business Email
              </span>
              <span className="font-medium text-slate-800 truncate max-w-[200px]">{email}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="flex items-center gap-2 text-slate-500">
                <Phone className="w-3.5 h-3.5" /> Phone Number
              </span>
              <span className="font-medium text-slate-800">{phone}</span>
            </div>

            <div className="flex items-start justify-between py-1 border-b border-slate-50">
              <span className="flex items-center gap-2 text-slate-500 shrink-0">
                <MapPin className="w-3.5 h-3.5" /> Business Address
              </span>
              <span className="font-medium text-slate-800 text-right max-w-[220px] text-[11px] leading-tight">
                {currentStore?.address ? (
                  <>
                    {currentStore.name}<br />
                    {currentStore.address.street}{currentStore.address.landmark ? `, ${currentStore.address.landmark}` : ''},<br />
                    {currentStore.address.city}, {currentStore.address.state} - {currentStore.address.pincode}
                  </>
                ) : (
                  <>
                    Store Location<br />
                    Station Road, Ganj Para,<br />
                    Durg, Chhattisgarh - 491001
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-3.5 h-3.5" /> Member Since
              </span>
              <span className="font-medium text-slate-800">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '12 Jan 2024'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-2 text-slate-500">
                <CreditCard className="w-3.5 h-3.5" /> Plan
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs">Professional Plan</span>
                <button
                  type="button"
                  className="px-2.5 py-0.5 rounded-md border border-slate-200 text-[10px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Manage Plan
                </button>
              </div>
            </div>
          </div>

          {/* Store Performance Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900">Store Performance</h4>
              <button type="button" className="text-[11px] font-semibold text-blue-600 hover:underline">
                View Analytics
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-sm">
                  <span>4.7</span>
                  <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 block">Average Rating</span>
              </div>

              <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                <span className="text-emerald-600 font-bold text-sm block">98%</span>
                <span className="text-[9px] text-slate-400 mt-0.5 block">Positive Reviews</span>
              </div>

              <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                <span className="text-slate-900 font-bold text-sm block">1,245</span>
                <span className="text-[9px] text-slate-400 mt-0.5 block">Total Orders</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Total Sales</span>
              <span className="text-sm font-extrabold text-emerald-600">₹3.2L+</span>
            </div>
          </div>

          {/* Account Settings Links */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 px-0.5 mb-1">Account Settings</h4>
            <button
              type="button"
              onClick={onOpenProfileInfo}
              className="w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-xs font-medium text-slate-700 hover:bg-slate-50 border border-slate-100 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-slate-400" /> Profile Information
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => alert('Change Password flow')}
              className="w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-xs font-medium text-slate-700 hover:bg-slate-50 border border-slate-100 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-slate-400" /> Change Password
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => alert('Notification Preferences')}
              className="w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-xs font-medium text-slate-700 hover:bg-slate-50 border border-slate-100 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-slate-400" /> Notification Preferences
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Bottom Logout Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
