import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js';
import {
  validateGSTIN,
  validatePAN,
  validatePhone,
  validatePIN,
} from '../../utils/validation.js';

interface AddVendorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const AddVendorDrawer: React.FC<AddVendorDrawerProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  useBodyScrollLock(isOpen, onClose);

  const [activeTab, setActiveTab] = useState<'basic' | 'address' | 'contact' | 'other'>('basic');
  const [vendorType, setVendorType] = useState<'business' | 'individual'>('business');
  const [companyName, setCompanyName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [phone, setPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [category, setCategory] = useState('Apparel & Fashion');
  const [currency, setCurrency] = useState('INR - Indian Rupee');
  const [paymentTerms, setPaymentTerms] = useState('Due on Receipt');
  const [openingBalance, setOpeningBalance] = useState('0.00');
  const [creditLimit, setCreditLimit] = useState('0.00');
  const [language, setLanguage] = useState('English');
  const [notes, setNotes] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Validation errors
  const [gstinError, setGstinError] = useState('');
  const [panError, setPanError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel matching mockup 8.12.png */}
      <div className="relative w-full max-w-xl bg-white h-screen shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header - flush with top edge */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add Vendor</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add vendor details to create purchase orders, bills, expenses and more.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Tabs */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-6 text-xs">
          {(['basic', 'address', 'contact', 'other'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-bold capitalize transition-colors relative ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'basic'
                ? 'Basic Details'
                : tab === 'address'
                ? 'Address'
                : tab === 'contact'
                ? 'Contact Persons'
                : 'Other Details'}
            </button>
          ))}
        </div>

        {/* Content Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {formError}
            </div>
          )}

          {activeTab === 'basic' && (
            <div className="space-y-4">
              {/* Vendor Type */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Vendor Type <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="vendorType"
                      checked={vendorType === 'business'}
                      onChange={() => setVendorType('business')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-800">Business</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="vendorType"
                      checked={vendorType === 'individual'}
                      onChange={() => setVendorType('individual')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-800">Individual</span>
                  </label>
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Display Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              {/* GSTIN */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">GSTIN</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="e.g. 23AAAAA0000A1Z5"
                    value={gstin}
                    onChange={(e) => {
                      setGstin(e.target.value.toUpperCase());
                      if (gstinError) setGstinError('');
                    }}
                    onBlur={() => {
                      if (gstin.trim() && !validateGSTIN(gstin.trim())) {
                        setGstinError('Invalid GSTIN format (15 characters alphanumeric).');
                      } else {
                        setGstinError('');
                      }
                    }}
                    className={`w-full pl-3 pr-10 py-2 bg-white border rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 shadow-2xs font-mono uppercase transition-colors ${
                      gstinError
                        ? 'border-rose-400 focus:ring-rose-400'
                        : 'border-slate-200 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => alert('Verifying GSTIN against portal...')}
                    className="absolute right-2 p-1 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Verify GSTIN"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                {gstinError && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{gstinError}</p>
                )}
              </div>

              {/* PAN */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">PAN</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. ABCDE1234F"
                  value={pan}
                  onChange={(e) => {
                    setPan(e.target.value.toUpperCase());
                    if (panError) setPanError('');
                  }}
                  onBlur={() => {
                    if (pan.trim() && !validatePAN(pan.trim())) {
                      setPanError('Invalid PAN format (10 characters alphanumeric).');
                    } else {
                      setPanError('');
                    }
                  }}
                  className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 shadow-2xs font-mono uppercase transition-colors ${
                    panError
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-200 focus:ring-blue-500'
                  }`}
                />
                {panError && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{panError}</p>
                )}
              </div>

              {/* Vendor Category */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Vendor Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                >
                  <option value="Apparel & Fashion">Apparel & Fashion</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Packaging Supplies">Packaging Supplies</option>
                  <option value="Logistics Partner">Logistics Partner</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="6-digit PIN"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                      if (pincodeError) setPincodeError('');
                    }}
                    onBlur={() => {
                      if (pincode.trim() && !validatePIN(pincode.trim())) {
                        setPincodeError('Please enter a valid 6-digit Indian PIN code.');
                      } else {
                        setPincodeError('');
                      }
                    }}
                    className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 shadow-2xs transition-colors ${
                      pincodeError
                        ? 'border-rose-400 focus:ring-rose-400'
                        : 'border-slate-200 focus:ring-blue-500'
                    }`}
                  />
                  {pincodeError && (
                    <p className="text-[11px] text-rose-500 mt-1 font-medium">{pincodeError}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  placeholder="Primary contact name"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number (e.g. 9876543210)"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  onBlur={() => {
                    if (phone.trim() && !validatePhone(phone.trim())) {
                      setPhoneError('Please enter a valid 10-digit Indian mobile number.');
                    } else {
                      setPhoneError('');
                    }
                  }}
                  className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 shadow-2xs transition-colors ${
                    phoneError
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-200 focus:ring-blue-500'
                  }`}
                />
                {phoneError && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{phoneError}</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'other' && (
            <div className="space-y-4">
              {/* Payment Terms */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                </select>
              </div>

              {/* Opening Balance */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Opening Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="text"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Credit Limit */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Credit Limit</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="text"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  placeholder="Add any notes..."
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              {/* Active Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-800 text-xs">This vendor is active</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Action Bar with shrink-0 */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              let hasErr = false;
              if (gstin.trim() && !validateGSTIN(gstin.trim())) {
                setGstinError('Invalid GSTIN format (15 characters alphanumeric).');
                hasErr = true;
              }
              if (pan.trim() && !validatePAN(pan.trim())) {
                setPanError('Invalid PAN format (10 characters alphanumeric).');
                hasErr = true;
              }
              if (phone.trim() && !validatePhone(phone.trim())) {
                setPhoneError('Please enter a valid 10-digit Indian mobile number.');
                hasErr = true;
              }
              if (pincode.trim() && !validatePIN(pincode.trim())) {
                setPincodeError('Please enter a valid 6-digit Indian PIN code.');
                hasErr = true;
              }
              if (hasErr) {
                setFormError('Please resolve validation errors before saving.');
                return;
              }
              setFormError('');
              onSaved();
              onClose();
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
          >
            Save Vendor
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
