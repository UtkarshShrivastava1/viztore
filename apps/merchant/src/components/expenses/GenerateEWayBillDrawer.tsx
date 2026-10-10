import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Truck, Calendar, Building, Info, RefreshCw } from 'lucide-react';

interface GenerateEWayBillDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: () => void;
}

export const GenerateEWayBillDrawer: React.FC<GenerateEWayBillDrawerProps> = ({
  isOpen,
  onClose,
  onGenerated,
}) => {
  const [txnType, setTxnType] = useState<'outward' | 'inward'>('outward');
  const [sourceDoc, setSourceDoc] = useState('Purchase Invoice');
  const [invoiceNo, setInvoiceNo] = useState('BILL-2024-000123');
  const [invoiceDate, setInvoiceDate] = useState('11/05/2024');
  const [mode, setMode] = useState('Road');
  const [transporter, setTransporter] = useState('VRL Logistics');
  const [vehicleNo, setVehicleNo] = useState('CG07AB1234');
  const [distance, setDistance] = useState('245');

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel matching mockup 8.13.png */}
      <div className="relative w-full max-w-xl bg-white h-screen shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header - flush with top edge */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">Generate E-Way Bill</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Create and generate e-way bill for your purchase or stock movement.
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

        {/* Content Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Transaction Type Radio */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Transaction Type <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="txnType"
                  checked={txnType === 'outward'}
                  onChange={() => setTxnType('outward')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-slate-800">Outward (Purchase)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="txnType"
                  checked={txnType === 'inward'}
                  onChange={() => setTxnType('inward')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-slate-800">Inward (Return)</span>
              </label>
            </div>
          </div>

          {/* Source Document & Invoices */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Source Document <span className="text-rose-500">*</span>
              </label>
              <select
                value={sourceDoc}
                onChange={(e) => setSourceDoc(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              >
                <option value="Purchase Invoice">Purchase Invoice</option>
                <option value="Delivery Challan">Delivery Challan</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Invoice No. <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setInvoiceNo('BILL-2024-000124')}
                  className="absolute right-2 text-slate-400 hover:text-blue-600 p-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Invoice Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* From Card */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                From (Supplier / Dispatch From)
              </span>
              <button
                type="button"
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                Change
              </button>
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Sharma Enterprises</h4>
            <p className="text-[11px] text-slate-500">
              Plot No. 12, Industrial Area, Durg, Chhattisgarh - 490024
            </p>
            <p className="text-[10px] font-mono text-slate-500">GSTIN: 22ABCDE1234F1Z5</p>
          </div>

          {/* To Card */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                To (Ship To / Bill To)
              </span>
              <button
                type="button"
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                Change
              </button>
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Fashion Hub</h4>
            <p className="text-[11px] text-slate-500">
              Shop No. 8, City Mall, Bhilai, Chhattisgarh - 490001
            </p>
            <p className="text-[10px] font-mono text-slate-500">GSTIN: 22FGHIJ5678K1Z9</p>
          </div>

          {/* Place of Dispatch / Delivery */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Place of Dispatch <span className="text-rose-500">*</span>
              </label>
              <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs">
                <option>Chhattisgarh (22)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Place of Delivery <span className="text-rose-500">*</span>
              </label>
              <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs">
                <option>Chhattisgarh (22)</option>
              </select>
            </div>
          </div>

          {/* Transportation Details */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">Transportation Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Mode of Transport <span className="text-rose-500">*</span>
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                >
                  <option value="Road">Road</option>
                  <option value="Rail">Rail</option>
                  <option value="Air">Air</option>
                  <option value="Ship">Ship</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Transporter Name
                </label>
                <input
                  type="text"
                  value={transporter}
                  onChange={(e) => setTransporter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Vehicle No. <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Distance (in KM) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => alert('Calculating distance via Google Maps API...')}
                    className="px-2.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-blue-600 text-xs font-semibold rounded-xl shadow-2xs shrink-0"
                  >
                    Calculate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">Item Details</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <tr>
                    <th className="py-2 px-2.5 w-6">#</th>
                    <th className="py-2 px-2.5">Item Name</th>
                    <th className="py-2 px-2">HSN Code</th>
                    <th className="py-2 px-2">Quantity</th>
                    <th className="py-2 px-2">Unit</th>
                    <th className="py-2 px-2.5 text-right">Value (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-2.5 text-slate-400">1</td>
                    <td className="py-2 px-2.5 font-bold text-slate-900">Men's T-Shirt</td>
                    <td className="py-2 px-2 font-mono text-slate-600">6109</td>
                    <td className="py-2 px-2 text-slate-800">100</td>
                    <td className="py-2 px-2 text-slate-600">Pcs</td>
                    <td className="py-2 px-2.5 text-right font-medium text-slate-900">50,000.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2.5 text-slate-400">2</td>
                    <td className="py-2 px-2.5 font-bold text-slate-900">Men's Jeans</td>
                    <td className="py-2 px-2 font-mono text-slate-600">6203</td>
                    <td className="py-2 px-2 text-slate-800">50</td>
                    <td className="py-2 px-2 text-slate-600">Pcs</td>
                    <td className="py-2 px-2.5 text-right font-medium text-slate-900">75,000.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-500">Total Quantity: <strong className="text-slate-900">150</strong></span>
                <div className="flex items-center gap-1 text-[11px] text-slate-600">
                  <span>E-Way Bill Applicable</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    Yes
                  </span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">Total Value (₹)</span>
                <span className="text-base font-black text-slate-900">₹ 1,25,000.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
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
              onGenerated();
              onClose();
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
          >
            Generate E-Way Bill
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
