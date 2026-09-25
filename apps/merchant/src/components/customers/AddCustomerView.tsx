import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Check } from 'lucide-react';
import { useCustomerStore, CustomerType } from '../../stores/customerStore.js';

interface AddCustomerViewProps {
  onBack: () => void;
}

export const AddCustomerView: React.FC<AddCustomerViewProps> = ({ onBack }) => {
  const { addCustomer } = useCustomerStore();

  const [customerType, setCustomerType] = useState<'Individual' | 'Business'>('Individual');
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Billing address
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Madhya Pradesh');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');

  // Additional details
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [customerCode, setCustomerCode] = useState('');
  const [creditLimit, setCreditLimit] = useState('');

  // Payment & Terms
  const [paymentTerms, setPaymentTerms] = useState('15 Days');
  const [creditPeriodDays, setCreditPeriodDays] = useState('15');
  const [openingBalance, setOpeningBalance] = useState('0.00');

  // Notes
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const states = [
    'Madhya Pradesh',
    'Maharashtra',
    'Delhi',
    'Gujarat',
    'Karnataka',
    'Rajasthan',
    'Uttar Pradesh',
    'Tamil Nadu',
    'Telangana',
    'West Bengal',
  ];

  const handleSave = (isDraft = false) => {
    if (!customerName.trim()) {
      setErrorMsg('Customer name is required.');
      return;
    }
    if (!mobileNumber.trim()) {
      setErrorMsg('Mobile number is required.');
      return;
    }

    const typeValue: CustomerType = customerType === 'Business' ? 'Wholesaler' : 'Individual';

    addCustomer({
      name: customerName,
      customerType: typeValue,
      phone: mobileNumber.startsWith('+91') ? mobileNumber : `+91 ${mobileNumber}`,
      email: emailAddress || `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      displayName: displayName || customerName,
      gstin: gstin.toUpperCase(),
      pan: pan.toUpperCase(),
      customerCode,
      creditLimit: parseFloat(creditLimit) || 0,
      paymentTerms,
      creditPeriodDays: parseInt(creditPeriodDays, 10) || 15,
      openingBalance: parseFloat(openingBalance) || 0,
      billingAddress: {
        addressLine1: addressLine1 || 'Main Market Road',
        addressLine2,
        city: city || 'Indore',
        state,
        pincode: pincode || '452001',
        country,
        sameAsShipping,
      },
      notes,
      status: isDraft ? 'inactive' : 'active',
    });

    onBack();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Breadcrumb matching 6.1.png */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          Customers
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800">Add Customer</span>
      </div>

      {/* Header + Actions matching 6.1.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add Customer</h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter customer details to add a new customer to your business.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors shadow-2xs"
          >
            Save as Draft
          </button>
          <div className="inline-flex rounded-xl shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
            >
              Save Customer
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-2 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs transition-colors border-l border-blue-500"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold animate-in fade-in">
          {errorMsg}
        </div>
      )}

      {/* Grid: 2 columns top row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* 1. Customer Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Customer Details</h3>

          {/* Customer Type Radio Group */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Customer Type <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                <input
                  type="radio"
                  name="custType"
                  checked={customerType === 'Individual'}
                  onChange={() => setCustomerType('Individual')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span>Individual</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                <input
                  type="radio"
                  name="custType"
                  checked={customerType === 'Business'}
                  onChange={() => setCustomerType('Business')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span>Business</span>
              </label>
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shrink-0">
                +91 ⌵
              </div>
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email address (optional)"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Customer Display Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Customer Display Name
            </label>
            <input
              type="text"
              maxLength={100}
              placeholder="Enter display name (optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
              <span>This name will be shown in documents</span>
              <span>{displayName.length}/100</span>
            </div>
          </div>
        </div>

        {/* 2. Billing Address Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Billing Address</h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Same as shipping address</span>
            </label>
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Address Line 1 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="House no., Building name, Street name"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Address Line 2
            </label>
            <input
              type="text"
              placeholder="Area, Landmark (optional)"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* City, State, Pincode 3-col */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                State <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                >
                  {states.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pincode <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Country <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
              >
                <option value="India">India</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 columns second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* 3. Additional Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Additional Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN</label>
              <input
                type="text"
                placeholder="Enter GSTIN (optional)"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">15 characters GSTIN number</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">PAN Number</label>
              <input
                type="text"
                placeholder="Enter PAN (optional)"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">10 characters PAN number</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Code</label>
              <input
                type="text"
                placeholder="Enter customer code (optional)"
                value={customerCode}
                onChange={(e) => setCustomerCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">For internal reference</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Credit Limit</label>
              <input
                type="number"
                placeholder="Enter credit limit"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Leave empty for no limit</span>
            </div>
          </div>
        </div>

        {/* 4. Payment & Terms Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Payment & Terms</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Terms</label>
              <div className="relative">
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                >
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="45 Days">45 Days</option>
                  <option value="Immediate">Immediate</option>
                  <option value="Custom">Custom</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Credit Period (Days)
              </label>
              <input
                type="number"
                placeholder="Enter credit period"
                value={creditPeriodDays}
                onChange={(e) => setCreditPeriodDays(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">e.g. 30, 45, 60</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Opening Balance (₹)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Initial outstanding amount</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Notes Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700">Notes (Optional)</label>
          <span className="text-[10px] text-slate-400">{notes.length}/500</span>
        </div>
        <textarea
          rows={4}
          maxLength={500}
          placeholder="Add any additional notes about this customer..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
        />
      </div>
    </div>
  );
};
