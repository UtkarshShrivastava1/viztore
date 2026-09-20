import React from 'react';
import { X, Edit2, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore.js';

interface ProfileInformationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileInformationDrawer: React.FC<ProfileInformationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, currentStore } = useAuthStore();

  if (!isOpen) return null;

  const storeName = currentStore?.name || user?.fullName || 'My Store';
  const email = currentStore?.email || user?.email || 'merchant@example.com';
  const phone = currentStore?.phone || user?.phone || '+91 98765 43210';
  const description = currentStore?.description || 'Your local store delivering fresh, quality products right to your doorstep.';
  const bankName = currentStore?.bankDetails?.bankName || 'HDFC Bank';
  const accountHolder = currentStore?.bankDetails?.accountHolderName || storeName;
  const accountNumber = currentStore?.bankDetails?.accountNumber || '50200012345678';
  const ifscCode = currentStore?.bankDetails?.ifscCode || 'HDFC0001234';

  const categories = [
    { name: currentStore?.category || 'Retail', active: true },
    { name: 'Apparel', active: false },
    { name: 'Essentials', active: false },
    { name: 'Accessories', active: false },
  ];

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
          <h2 className="text-base font-bold text-slate-900">Profile Information</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
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

          {/* Section 1: Basic Information */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Basic Information</h3>
              <button
                type="button"
                onClick={() => alert('Edit Basic Info')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-500">Store Name</span>
                <span className="font-semibold text-slate-800">{storeName}</span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-500">Business Email</span>
                <span className="font-medium text-slate-800">{email}</span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-500">Phone Number</span>
                <span className="font-medium text-slate-800">{phone}</span>
              </div>
              <div className="flex items-start justify-between py-0.5">
                <span className="text-slate-500 shrink-0">Business Address</span>
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
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Section 2: Bank Details */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Bank Details</h3>
              <button
                type="button"
                onClick={() => alert('Edit Bank Details')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-500">Bank Name</span>
                <span className="font-semibold text-slate-800">{bankName}</span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-500">Account Holder Name</span>
                <span className="font-semibold text-slate-800">{accountHolder}</span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-500">Account Number</span>
                <span className="font-mono text-slate-800 font-semibold">{accountNumber}</span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-500">IFSC Code</span>
                <span className="font-mono text-slate-800 font-semibold">{ifscCode}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Section 3: Store Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Store Details</h3>
              <button
                type="button"
                onClick={() => alert('Edit Store Details')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between">
                <span className="text-slate-500 shrink-0">Store Description</span>
                <span className="font-medium text-slate-800 text-right max-w-[220px] text-[11px] leading-tight">
                  {description}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block mb-2 font-medium">Store Category</span>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <span
                      key={cat.name}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        cat.active
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">Store Logo</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
                    {storeName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block leading-tight">{storeName}</span>
                    <button
                      type="button"
                      onClick={() => alert('Change Logo')}
                      className="text-[11px] font-medium text-blue-600 hover:underline mt-0.5 block"
                    >
                      View / Change
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Close Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
