import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  UploadCloud,
  Plus,
  Calendar,
  FileText,
  X,
  Home,
} from 'lucide-react';
import { useExpenseStore, ExpenseCategory, ExpensePaymentMethod } from '../../stores/expenseStore.js';

interface AddExpenseViewProps {
  onBack: () => void;
}

export const AddExpenseView: React.FC<AddExpenseViewProps> = ({ onBack }) => {
  const { addExpense } = useExpenseStore();

  const [expenseName, setExpenseName] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Rent');
  const [vendor, setVendor] = useState('Property Owners');
  const [description, setDescription] = useState('');

  // Information
  const [expenseDate, setExpenseDate] = useState('11 May 2024');
  const [paymentMethod, setPaymentMethod] = useState<ExpensePaymentMethod>('Bank Transfer');
  const [amount, setAmount] = useState('');
  const [tax, setTax] = useState('');
  const [currency, setCurrency] = useState('INR - Indian Rupee (₹)');
  const [expenseType, setExpenseType] = useState<'Business Expense' | 'Personal Expense'>('Business Expense');

  // Additional Information
  const [project, setProject] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);

  const [errorMsg, setErrorMsg] = useState('');

  const numAmount = parseFloat(amount) || 0;
  const numTax = parseFloat(tax) || 0;
  const totalAmount = numAmount + numTax;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;
      setUploadedFile({ name: file.name, size: sizeStr });
    }
  };

  const handleSave = (isDraft = false) => {
    if (!expenseName.trim()) {
      setErrorMsg('Expense name is required.');
      return;
    }
    if (numAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }
    if (!vendor.trim()) {
      setErrorMsg('Vendor or Paid To name is required.');
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    addExpense({
      date: expenseDate,
      time: timeStr,
      name: expenseName,
      subtitle: description || `${category} expense`,
      category,
      vendor,
      paymentMethod,
      amount: numAmount,
      tax: numTax,
      totalAmount,
      currency: 'INR',
      status: isDraft ? 'Needs Review' : 'Paid',
      expenseType,
      isReimbursable: expenseType === 'Personal Expense',
      project,
      costCenter,
      referenceNumber,
      notes,
      receiptName: uploadedFile?.name,
      receiptSize: uploadedFile?.size,
    });

    onBack();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Breadcrumb matching 8.1.png */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-blue-600 flex items-center gap-1"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button
          type="button"
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          Expenses
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800">Add Expense</span>
      </div>

      {/* Header matching 8.1.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add Expense</h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter expense details to record a new business expense.
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
              Save Expense
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

      {/* 2 Columns Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Card 1: Expense Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Expense Details</h3>

          {/* Expense Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Expense Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter expense name"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              E.g. Office Rent, Fuel, Internet Bill
            </span>
          </div>

          {/* Category with + button */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                >
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Meals & Entertainment">Meals & Entertainment</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Software">Software</option>
                  <option value="Travel">Travel</option>
                  <option value="Salaries">Salaries</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="button"
                onClick={() => alert('Add custom category modal')}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
                title="Add Category"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Vendor / Paid To with + button */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vendor / Paid To <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                >
                  <option value="Property Owners">Property Owners</option>
                  <option value="State Electricity Board">State Electricity Board</option>
                  <option value="Airtel Business">Airtel Business</option>
                  <option value="Printo Press">Printo Press</option>
                  <option value="The Food Corner">The Food Corner</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Tally Solutions">Tally Solutions</option>
                  <option value="Auto Rickshaw">Auto Rickshaw</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="button"
                onClick={() => {
                  const newVen = prompt('Enter new vendor name:');
                  if (newVen) setVendor(newVen);
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
                title="Add Vendor"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Description (Optional)
              </label>
              <span className="text-[10px] text-slate-400">{description.length}/250</span>
            </div>
            <textarea
              rows={3}
              maxLength={250}
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Card 2: Expense Information */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Expense Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Expense Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Expense Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full pl-3.5 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Payment Method <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as ExpensePaymentMethod)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Cash">Cash</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>
            </div>

            {/* Tax */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tax (₹)
              </label>
              <input
                type="number"
                placeholder="Enter tax amount (optional)"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            {/* Total Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Total Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  ₹
                </span>
                <input
                  type="text"
                  readOnly
                  value={totalAmount > 0 ? totalAmount.toFixed(2) : ''}
                  placeholder="Total amount"
                  className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 shadow-2xs"
                />
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Currency
              </label>
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                >
                  <option value="INR - Indian Rupee (₹)">INR - Indian Rupee (₹)</option>
                  <option value="USD - US Dollar ($)">USD - US Dollar ($)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Expense Type Radio Group */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2">Expense Type</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                <input
                  type="radio"
                  name="expenseTypeGroup"
                  checked={expenseType === 'Business Expense'}
                  onChange={() => setExpenseType('Business Expense')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span>Business Expense</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                <input
                  type="radio"
                  name="expenseTypeGroup"
                  checked={expenseType === 'Personal Expense'}
                  onChange={() => setExpenseType('Personal Expense')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span>Personal Expense</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Additional Information */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Additional Information</h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Bill / Receipt Dropzone */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Bill / Receipt
            </label>
            {uploadedFile ? (
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileText className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-xs text-slate-900 block truncate">
                      {uploadedFile.name}
                    </span>
                    <span className="text-[10px] text-slate-500">{uploadedFile.size}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-xs font-bold text-slate-900">Upload Bill / Receipt</span>
                <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, PDF up to 5MB</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Right Inputs: Project, Cost Center, Reference, Notes */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project (Optional)
                </label>
                <div className="relative">
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                  >
                    <option value="">Select project</option>
                    <option value="Store Expansion">Store Expansion</option>
                    <option value="Summer Sale 2026">Summer Sale 2026</option>
                    <option value="IT Infrastructure">IT Infrastructure</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cost Center (Optional)
                </label>
                <div className="relative">
                  <select
                    value={costCenter}
                    onChange={(e) => setCostCenter(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                  >
                    <option value="">Select cost center</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Administration">Administration</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reference Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter reference number"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Notes (Optional)</label>
                <span className="text-[10px] text-slate-400">{notes.length}/250</span>
              </div>
              <textarea
                rows={3}
                maxLength={250}
                placeholder="Add any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar matching 8.1.png */}
      <div className="flex items-center justify-end gap-2.5 pt-4">
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
            Save Expense
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
  );
};
