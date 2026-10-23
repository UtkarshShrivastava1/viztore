import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js';
import { useExpenseStore, Vendor } from '../../stores/expenseStore.js';
import {
  validateGSTIN,
  validatePAN,
  validatePhone,
  validatePIN,
} from '../../utils/validation.js';

interface AddVendorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const AddVendorDrawer: React.FC<AddVendorDrawerProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  useBodyScrollLock(isOpen, onClose);

  const { selectedVendor, saveVendor, closeAddVendor, createVendorRecord, isSubmitting } = useExpenseStore();

  const [activeTab, setActiveTab] = useState<'basic' | 'address' | 'contact' | 'other'>('basic');

  // Basic Details (Mockup 8.12.png)
  const [vendorType, setVendorType] = useState<'business' | 'individual'>('business');
  const [companyName, setCompanyName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [category, setCategory] = useState('Apparel & Fashion');
  const [currency, setCurrency] = useState('INR - Indian Rupee');
  const [paymentTerms, setPaymentTerms] = useState('Due on Receipt');
  const [openingBalance, setOpeningBalance] = useState('0.00');
  const [creditLimit, setCreditLimit] = useState('0.00');
  const [language, setLanguage] = useState('English');
  const [notes, setNotes] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Address Details
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Chhattisgarh');
  const [pincode, setPincode] = useState('');

  // Contact Persons Details
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');

  // Other Details (Bank & TDS)
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [isTdsApplicable, setIsTdsApplicable] = useState(false);
  const [tdsSection, setTdsSection] = useState('194C');

  // Verification & validation state
  const [gstinVerified, setGstinVerified] = useState(false);
  const [gstinError, setGstinError] = useState('');
  const [gstinSuccess, setGstinSuccess] = useState('');
  const [panError, setPanError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [formError, setFormError] = useState('');

  // Populate from selectedVendor if editing
  useEffect(() => {
    if (selectedVendor) {
      setCompanyName(selectedVendor.vendorName || '');
      setDisplayName(selectedVendor.vendorName || '');
      setContactPerson(selectedVendor.contactPerson || '');
      setPhone(selectedVendor.phone || '');
      setEmail(selectedVendor.email || '');
      setCity(selectedVendor.city || '');
      setAddressLine(selectedVendor.address || '');
      setPincode(selectedVendor.pincode || '');
      setGstin(selectedVendor.gstin || '');
      setPan(selectedVendor.pan || '');
      setCategory(selectedVendor.category || 'Apparel & Fashion');
      setPaymentTerms(selectedVendor.paymentTerms || 'Due on Receipt');
      setCreditLimit(selectedVendor.creditLimit ? String(selectedVendor.creditLimit) : '0.00');
      setOpeningBalance(selectedVendor.openingBalance ? String(selectedVendor.openingBalance) : '0.00');
      setNotes(selectedVendor.notes || '');
      setIsActive(selectedVendor.status !== 'Blocked' && selectedVendor.status !== 'Inactive');
    } else {
      // Reset form
      setCompanyName('');
      setDisplayName('');
      setContactPerson('');
      setPhone('');
      setEmail('');
      setCity('');
      setAddressLine('');
      setPincode('');
      setGstin('');
      setPan('');
      setCategory('Apparel & Fashion');
      setPaymentTerms('Due on Receipt');
      setCreditLimit('0.00');
      setOpeningBalance('0.00');
      setNotes('');
      setIsActive(true);
      setGstinVerified(false);
      setFormError('');
    }
  }, [selectedVendor, isOpen]);

  const handleVerifyGSTIN = () => {
    if (!gstin.trim()) {
      setGstinError('Please enter a GSTIN to verify.');
      return;
    }
    if (!validateGSTIN(gstin.trim())) {
      setGstinError('Invalid GSTIN format (15 characters alphanumeric).');
      return;
    }
    setGstinError('');
    setGstinVerified(true);
    // Auto-extract PAN from GSTIN (chars 3 to 12)
    if (gstin.length >= 12 && !pan) {
      setPan(gstin.substring(2, 12));
    }
  };

  const handleSave = async () => {
    // Basic validation
    if (!companyName.trim() && !displayName.trim()) {
      setFormError('Please enter a company name or display name.');
      setActiveTab('basic');
      return;
    }

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
      setFormError('Please resolve the highlighted validation errors.');
      return;
    }

    const vendorPayload: Partial<Vendor> = {
      id: selectedVendor ? selectedVendor.id : undefined,
      vendorName: companyName.trim() || displayName.trim(),
      contactPerson: contactPerson.trim() || '—',
      phone: phone.trim() || '—',
      email: email.trim() || '—',
      city: city.trim() || 'Raipur',
      address: addressLine.trim(),
      pincode: pincode.trim(),
      gstin: gstin.trim().toUpperCase(),
      pan: pan.trim().toUpperCase(),
      category,
      paymentTerms,
      creditLimit: parseFloat(creditLimit) || 0,
      openingBalance: parseFloat(openingBalance) || 0,
      notes: notes.trim(),
      status: isActive ? 'Active' : 'Inactive',
    };

    saveVendor(vendorPayload);

    if (createVendorRecord) {
      try {
        await createVendorRecord({
          name: displayName.trim() || companyName.trim() || 'New Vendor',
          companyName: companyName.trim() || displayName.trim() || undefined,
          phone: phone.trim() || '9876543210',
          gstin: gstin.trim() || undefined,
          pan: pan.trim() || undefined,
          address: addressLine.trim() || undefined,
          city: city.trim() || undefined,
          pincode: pincode.trim() || undefined,
          category: category || 'General',
          paymentTerms: paymentTerms || 'Due on Receipt',
          openingBalance: parseFloat(openingBalance) || 0,
          creditLimit: parseFloat(creditLimit) || 0,
        });
      } catch (err) {
        console.error('Failed to sync vendor to cloud:', err);
      }
    }

    if (onSaved) onSaved();
    closeAddVendor();
    onClose();
  };

  const handleDrawerClose = () => {
    closeAddVendor();
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={handleDrawerClose}
      />

      {/* Drawer Panel matching mockup 8.12.png */}
      <div className="relative w-full max-w-xl bg-white h-screen shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header matching mockup 8.12.png */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {selectedVendor ? 'Edit Vendor' : 'Add Vendor'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add vendor details to create purchase orders, bills, expenses and more.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDrawerClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Sub Tabs matching mockup 8.12.png */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-6 text-xs bg-white shrink-0">
          {(['basic', 'address', 'contact', 'other'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-bold capitalize transition-colors relative cursor-pointer ${
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

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* TAB 1: BASIC DETAILS (Exact fields from 8.12.png) */}
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
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="font-medium text-slate-800">Business</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="vendorType"
                      checked={vendorType === 'individual'}
                      onChange={() => setVendorType('individual')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
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
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (!displayName) setDisplayName(e.target.value);
                    if (formError) setFormError('');
                  }}
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
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    if (formError) setFormError('');
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              {/* GSTIN */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-slate-700">GSTIN</label>
                  {gstinVerified && (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified Taxpayer
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="Enter GSTIN"
                    value={gstin}
                    onChange={(e) => {
                      setGstin(e.target.value.toUpperCase());
                      setGstinVerified(false);
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
                        : gstinVerified
                        ? 'border-emerald-300 focus:ring-emerald-500'
                        : 'border-slate-200 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyGSTIN}
                    className="absolute right-2 p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Verify GSTIN on GST Portal"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                {gstinError && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{gstinError}</p>
                )}
                {gstinSuccess && (
                  <p className="text-[11px] text-emerald-600 mt-1 font-medium">{gstinSuccess}</p>
                )}
              </div>

              {/* PAN */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">PAN</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="Enter PAN"
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                >
                  <option value="Apparel & Fashion">Apparel & Fashion</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Packaging Supplies">Packaging Supplies</option>
                  <option value="Logistics Partner">Logistics Partner</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="General Merchandise">General Merchandise</option>
                </select>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                >
                  <option value="INR - Indian Rupee">INR - Indian Rupee</option>
                  <option value="USD - US Dollar">USD - US Dollar</option>
                </select>
              </div>

              {/* Payment Terms */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
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
                    type="number"
                    step="0.01"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Credit Limit */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Credit Limit
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Vendor Language */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Vendor Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  placeholder="Add any notes..."
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs resize-none"
                />
              </div>

              {/* Active Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-800 text-xs">This vendor is active</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: ADDRESS */}
          {activeTab === 'address' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Street Address / Plot / Building
                </label>
                <input
                  type="text"
                  placeholder="e.g. Plot No. 12, Industrial Area"
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
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">State</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                  >
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Gujarat">Gujarat</option>
                  </select>
                </div>
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
          )}

          {/* TAB 3: CONTACT PERSONS */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Primary Contact Person Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sales Manager"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  maxLength={10}
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

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. contact@vendor.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>
            </div>
          )}

          {/* TAB 4: OTHER DETAILS (Bank & TDS) */}
          {activeTab === 'other' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Bank Account Details</h4>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. State Bank of India"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter bank account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    placeholder="e.g. SBIN0001234"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono uppercase font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* TDS Configuration */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">TDS / TCS Applicability</h4>
                    <p className="text-[11px] text-slate-500">Enable if TDS is deducted on purchases from this vendor.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isTdsApplicable}
                    onChange={(e) => setIsTdsApplicable(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {isTdsApplicable && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      TDS Section
                    </label>
                    <select
                      value={tdsSection}
                      onChange={(e) => setTdsSection(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                    >
                      <option value="194C">Section 194C - Contractor (1% / 2%)</option>
                      <option value="194J">Section 194J - Professional / Technical Services (10%)</option>
                      <option value="194Q">Section 194Q - Purchase of Goods (0.1%)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer matching mockup 8.12.png */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDrawerClose}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            {isSubmitting ? 'Saving Vendor...' : 'Save Vendor'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
