import React, { useState } from 'react';
import {
  UploadCloud,
  ChevronRight,
  Lightbulb,
  FileText,
  Phone,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useSupportStore, TicketPriority } from '../../stores/supportStore.js';
import { validatePhone } from '../../utils/validation.js';

interface CreateSupportTicketViewProps {
  onBack?: () => void;
}

export const CreateSupportTicketView: React.FC<CreateSupportTicketViewProps> = ({ onBack }) => {
  const { setActiveView, addTicket } = useSupportStore();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [contactPhone, setContactPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setErrorMessage('Please enter a subject for your ticket.');
      return;
    }
    if (!category) {
      setErrorMessage('Please select a category for your issue.');
      return;
    }
    if (contactPhone.trim() && !validatePhone(contactPhone.trim())) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please enter a description of the issue.');
      return;
    }

    setPhoneError('');
    setErrorMessage('');
    addTicket({
      subject,
      category,
      priority,
      status: 'open',
      initialMessage: description,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setActiveView('hub');
    }, 1500);
  };

  const handleCancel = () => {
    if (onBack) onBack();
    else setActiveView('hub');
  };

  const commonTopics = [
    'Orders & Delivery',
    'Billing & Payments',
    'Products & Inventory',
    'Store Management',
    'Account & Settings',
    'Returns & Refunds',
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header & Breadcrumb (15.1.png) */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
          <span className="hover:text-slate-800 cursor-pointer">Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span
            onClick={handleCancel}
            className="hover:text-slate-800 cursor-pointer"
          >
            Support
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">Create Support Ticket</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Create Support Ticket
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Raise a request and get help from our support team.
        </p>
      </div>

      {/* Main Grid: Form (col-span-8) + Side Info (col-span-4) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Form Column */}
        <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Ticket submitted successfully! Returning to Support Hub...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter a short subject for your issue (e.g. Order not received)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                <option value="Orders & Delivery">Orders & Delivery</option>
                <option value="Billing & Payments">Billing & Payments</option>
                <option value="Products & Inventory">Products & Inventory</option>
                <option value="Store Management">Store Management</option>
                <option value="Account & Settings">Account & Settings</option>
                <option value="Returns & Refunds">Returns & Refunds</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Priority <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Low */}
                <div
                  onClick={() => setPriority('low')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    priority === 'low'
                      ? 'border-blue-500 bg-blue-50/20 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      priority === 'low' ? 'border-blue-600' : 'border-slate-300'
                    }`}
                  >
                    {priority === 'low' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Low</h4>
                    <p className="text-[10px] text-slate-400">General query</p>
                  </div>
                </div>

                {/* Medium */}
                <div
                  onClick={() => setPriority('medium')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    priority === 'medium'
                      ? 'border-blue-500 bg-blue-50/20 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      priority === 'medium' ? 'border-blue-600' : 'border-slate-300'
                    }`}
                  >
                    {priority === 'medium' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Medium</h4>
                    <p className="text-[10px] text-slate-400">Need help soon</p>
                  </div>
                </div>

                {/* High */}
                <div
                  onClick={() => setPriority('high')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    priority === 'high'
                      ? 'border-blue-500 bg-blue-50/20 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      priority === 'high' ? 'border-blue-600' : 'border-slate-300'
                    }`}
                  >
                    {priority === 'high' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">High</h4>
                    <p className="text-[10px] text-slate-400">Urgent issue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Mobile Phone (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Contact Mobile Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number for callback (e.g. 9876543210)"
                value={contactPhone}
                maxLength={10}
                onChange={(e) => {
                  setContactPhone(e.target.value);
                  if (phoneError) setPhoneError('');
                }}
                onBlur={() => {
                  if (contactPhone.trim() && !validatePhone(contactPhone.trim())) {
                    setPhoneError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
                  } else {
                    setPhoneError('');
                  }
                }}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                  phoneError
                    ? 'border-rose-400 focus:ring-rose-400/20 focus:border-rose-400'
                    : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
              {phoneError && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{phoneError}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Description <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-medium text-slate-400">
                  {description.length}/1000
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={1000}
                placeholder="Please describe your issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Attachments */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Attachments (Optional)</label>
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-blue-50/20 cursor-pointer transition-all">
                <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  <span className="text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, PDF (Max 5 files, 10 MB each)
                </p>
                <input type="file" multiple className="hidden" />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-4 space-y-5">
          {/* Need Immediate Help Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Need Immediate Help?</h3>
                <p className="text-[11px] text-slate-500">Talk to our support team</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50/80 border border-blue-100 rounded-xl text-center space-y-1">
              <p className="text-lg font-black text-blue-700 tracking-tight leading-tight">
                +91 98765 43210
              </p>
              <p className="text-[11px] text-slate-500">
                Mon - Sat, 9:00 AM - 7:00 PM | Sun, 10:00 AM - 5:00 PM
              </p>
            </div>
          </div>

          {/* Support Guidelines Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
              <Lightbulb className="w-4 h-4" />
              <span>Support Guidelines</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>Provide a clear and detailed description of your issue.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>Add relevant screenshots or documents for faster resolution.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>Choose the correct category and priority.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>Our team will get back to you as soon as possible.</span>
              </li>
            </ul>
          </div>

          {/* Common Topics Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Common Topics</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {commonTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setCategory(topic)}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-blue-600 transition-colors group"
                >
                  <span className="text-slate-700 group-hover:text-blue-600">{topic}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
