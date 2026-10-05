import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronDown,
  User,
  Store,
  Building2,
  Info,
} from 'lucide-react';
import { useCustomerStore, Customer, CustomerType } from '../../stores/customerStore.js';

interface AddCustomerViewProps {
  onBack: () => void;
  editingCustomer?: Customer | null;
}

export const AddCustomerView: React.FC<AddCustomerViewProps> = ({
  onBack,
  editingCustomer,
}) => {
  const { addCustomer, updateCustomer } = useCustomerStore();

  const [customerType, setCustomerType] = useState<CustomerType>('Individual');
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
  const [creditLimit, setCreditLimit] = useState('');

  // Notes
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isEditMode = !!editingCustomer;

  useEffect(() => {
    if (editingCustomer) {
      setCustomerType(editingCustomer.customerType);
      setCustomerName(editingCustomer.name);
      setMobileNumber(editingCustomer.phone.replace('+91', '').trim());
      setEmailAddress(editingCustomer.email);
      setDisplayName(editingCustomer.displayName || editingCustomer.name);
      setAddressLine1(editingCustomer.billingAddress?.addressLine1 || '');
      setAddressLine2(editingCustomer.billingAddress?.addressLine2 || '');
      setCity(editingCustomer.billingAddress?.city || '');
      setState(editingCustomer.billingAddress?.state || 'Madhya Pradesh');
      setPincode(editingCustomer.billingAddress?.pincode || '');
      setCountry(editingCustomer.billingAddress?.country || 'India');
      setGstin(editingCustomer.gstin || '');
      setPan(editingCustomer.pan || '');
      setCreditLimit(editingCustomer.creditLimit ? editingCustomer.creditLimit.toString() : '');
      setNotes(editingCustomer.notes || '');
    }
  }, [editingCustomer]);

  const indianStates = [
    'Madhya Pradesh',
    'Maharashtra',
    'Chhattisgarh',
    'Gujarat',
    'Rajasthan',
    'Delhi',
    'Uttar Pradesh',
    'Karnataka',
    'Tamil Nadu',
    'Telangana',
    'West Bengal',
    'Jharkhand',
  ];

  const handleSave = () => {
    if (!customerName.trim()) {
      setErrorMsg('Customer name is required.');
      return;
    }

    if (isEditMode && editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: customerName,
        customerType,
        phone: mobileNumber.trim(),
        email: emailAddress || `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        displayName: displayName || customerName,
        gstin: gstin.toUpperCase(),
        pan: pan.toUpperCase(),
        creditLimit: parseFloat(creditLimit) || 0,
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
      });
    } else {
      addCustomer({
        name: customerName,
        customerType,
        phone: mobileNumber.trim(),
        email: emailAddress || `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        displayName: displayName || customerName,
        gstin: gstin.toUpperCase(),
        pan: pan.toUpperCase(),
        creditLimit: parseFloat(creditLimit) || 0,
        paymentTerms: '15 Days',
        creditPeriodDays: 15,
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
        status: 'active',
      });
    }

    onBack();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Breadcrumb (6.5.png) */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-blue-600 transition-colors"
        >
          Customers
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800">
          {isEditMode ? 'Edit Customer' : 'Add Customer'}
        </span>
      </div>

      {/* Header (6.5.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isEditMode ? 'Edit Customer' : 'Add Customer'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter customer details to add a new customer to your business.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors shadow-2xs"
          >
            Cancel
          </button>

          <div className="inline-flex rounded-xl shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>{isEditMode ? 'Update Customer' : 'Save Customer'}</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-2.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs transition-colors border-l border-blue-500"
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

      {/* Top 2 Columns Grid: Left = Customer Details, Right = Billing Address (6.5.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Customer Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Customer Details</h2>

          {/* Customer ID (Readonly) */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-bold text-slate-700">Customer ID</label>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <input
              type="text"
              readOnly
              value={editingCustomer ? editingCustomer.id : 'CUS-1009'}
              className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-500 select-none cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              This ID will be automatically allocated.
            </span>
          </div>

          {/* Customer Type 3 Big Cards */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Customer Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* 1. Individual */}
              <button
                type="button"
                onClick={() => setCustomerType('Individual')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  customerType === 'Individual'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>Individual</span>
              </button>

              {/* 2. Retailer */}
              <button
                type="button"
                onClick={() => setCustomerType('Retailer')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  customerType === 'Retailer'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <Store className="w-4 h-4 text-blue-600" />
                <span>Retailer</span>
              </button>

              {/* 3. Wholesaler */}
              <button
                type="button"
                onClick={() => setCustomerType('Wholesaler')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  customerType === 'Wholesaler'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Wholesaler</span>
              </button>
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Mobile Number
            </label>
            <div className="flex items-center gap-2">
              <div className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1 shadow-2xs">
                <span>+91</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email address (optional)"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          {/* Customer Display Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Customer Display Name
            </label>
            <input
              type="text"
              maxLength={100}
              placeholder="Enter display name (optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
              <span>This name will be shown in documents</span>
              <span>{displayName.length}/100</span>
            </div>
          </div>
        </div>

        {/* Right Column: Billing Address (6.5.png) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Billing Address</h2>
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
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Address Line 1 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="House no., Building name, Street name"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Address Line 2
            </label>
            <input
              type="text"
              placeholder="Area, Landmark (optional)"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          {/* City, State, Pincode 3-Col Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                State <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Pincode <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
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

      {/* Additional Details Card (6.5.png) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Additional Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">GSTIN</label>
            <input
              type="text"
              placeholder="Enter GSTIN (optional)"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">15 characters GSTIN number</span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">PAN Number</label>
            <input
              type="text"
              placeholder="Enter PAN (optional)"
              value={pan}
              onChange={(e) => setPan(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">10 characters PAN number</span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Credit Limit</label>
            <input
              type="number"
              placeholder="Enter credit limit"
              value={creditLimit}
              onChange={(e) => setCreditLimit(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Leave empty for no limit</span>
          </div>
        </div>
      </div>

      {/* Notes Card (6.5.png) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 block">Notes (Optional)</label>
          <span className="text-[10px] text-slate-400">{notes.length}/500</span>
        </div>
        <textarea
          rows={4}
          maxLength={500}
          placeholder="Add any additional notes about this customer..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
        />
      </div>
    </div>
  );
};
