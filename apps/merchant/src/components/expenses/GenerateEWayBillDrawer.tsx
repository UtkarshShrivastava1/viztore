import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, RefreshCw, Info, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js';
import { useExpenseStore, EWayBillItem } from '../../stores/expenseStore.js';

interface GenerateEWayBillDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated?: () => void;
}

interface LineItem {
  id: string;
  name: string;
  hsn: string;
  quantity: number;
  unit: string;
  value: number;
}

export const GenerateEWayBillDrawer: React.FC<GenerateEWayBillDrawerProps> = ({
  isOpen,
  onClose,
  onGenerated,
}) => {
  useBodyScrollLock(isOpen, onClose);

  const { ewayBills, addEWayBill } = useExpenseStore();

  const [txnType, setTxnType] = useState<'outward' | 'inward'>('outward');
  const [sourceDoc, setSourceDoc] = useState('Purchase Invoice');
  const [invoiceNo, setInvoiceNo] = useState('BILL-2024-000123');
  const [invoiceDate, setInvoiceDate] = useState('11/05/2024');

  // Supplier & Recipient info
  const [supplierName, setSupplierName] = useState('Sharma Enterprises');
  const [supplierAddress, setSupplierAddress] = useState(
    'Plot No. 12, Industrial Area, Durg, Chhattisgarh - 490024'
  );
  const [supplierGstin, setSupplierGstin] = useState('GSTIN: 22ABCDE1234F1Z5');

  const [recipientName, setRecipientName] = useState('Fashion Hub');
  const [recipientAddress, setRecipientAddress] = useState(
    'Shop No. 8, City Mall, Bhilai, Chhattisgarh - 490001'
  );
  const [recipientGstin, setRecipientGstin] = useState('GSTIN: 22FGHIJ5678K1Z9');

  const [placeOfDispatch, setPlaceOfDispatch] = useState('Chhattisgarh (22)');
  const [placeOfDelivery, setPlaceOfDelivery] = useState('Chhattisgarh (22)');

  // Transport details
  const [mode, setMode] = useState('Road');
  const [transporter, setTransporter] = useState('VRL Logistics');
  const [vehicleNo, setVehicleNo] = useState('CG07AB1234');
  const [distance, setDistance] = useState('245');
  const [isCalculated, setIsCalculated] = useState(true);

  // Line Items matching mockup 8.13.png
  const [items, setItems] = useState<LineItem[]>([
    {
      id: '1',
      name: "Men's T-Shirt",
      hsn: '6109',
      quantity: 100,
      unit: 'Pcs',
      value: 50000.0,
    },
    {
      id: '2',
      name: "Men's Jeans",
      hsn: '6203',
      quantity: 50,
      unit: 'Pcs',
      value: 75000.0,
    },
  ]);

  const totalValue = items.reduce((acc, item) => acc + item.value, 0);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const isApplicable = totalValue >= 50000; // Statutory GST threshold for E-Way Bill

  const handleCalculateDistance = () => {
    // Dynamic calculate simulation
    setDistance('245');
    setIsCalculated(true);
  };

  const handleGenerate = () => {
    const nextBillNo = `EWB-2024-${String(ewayBills.length + 46).padStart(6, '0')}`;
    const newBill: EWayBillItem = {
      id: `ewb-${Date.now()}`,
      eWayBillNo: nextBillNo,
      date: invoiceDate,
      invoiceBillNo: invoiceNo,
      vendor: txnType === 'outward' ? supplierName : recipientName,
      fromTo: `${placeOfDispatch.split(' ')[0]} → ${placeOfDelivery.split(' ')[0]}`,
      distanceKm: parseInt(distance, 10) || 245,
      validTill: '14/05/2024',
      time: '12:00 PM',
      status: 'Active',
      vehicleNo: vehicleNo.toUpperCase().trim(),
      totalValue,
      itemsCount: items.length,
    };

    if (addEWayBill) {
      addEWayBill(newBill);
    }

    if (onGenerated) onGenerated();
    onClose();
  };

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
        {/* Header */}
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
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* 1. Transaction Type Radio (Mockup 8.13.png) */}
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
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="font-medium text-slate-800">Outward (Purchase)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="txnType"
                  checked={txnType === 'inward'}
                  onChange={() => setTxnType('inward')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="font-medium text-slate-800">Inward (Return)</span>
              </label>
            </div>
          </div>

          {/* 2. Source Document & Invoices */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Source Document <span className="text-rose-500">*</span>
              </label>
              <select
                value={sourceDoc}
                onChange={(e) => setSourceDoc(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
              >
                <option value="Purchase Invoice">Purchase Invoice</option>
                <option value="Delivery Challan">Delivery Challan</option>
                <option value="Credit Note">Credit Note</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Invoice No. <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <select
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer appearance-none"
                >
                  <option value="BILL-2024-000123">BILL-2024-000123</option>
                  <option value="BILL-2024-000124">BILL-2024-000124</option>
                  <option value="BILL-2024-000125">BILL-2024-000125</option>
                </select>
                <button
                  type="button"
                  onClick={() => setInvoiceNo('BILL-2024-000123')}
                  className="absolute right-2 text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                  title="Reload invoice"
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

          {/* 3. From (Supplier / Dispatch From) Card matching mockup 8.13.png */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                From (Supplier / Dispatch From)
              </span>
              <button
                type="button"
                onClick={() => {
                  const newName = prompt('Enter supplier name:', supplierName);
                  if (newName) setSupplierName(newName);
                }}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Change
              </button>
            </div>
            <h4 className="font-bold text-slate-900 text-xs">{supplierName}</h4>
            <p className="text-[11px] text-slate-500">{supplierAddress}</p>
            <p className="text-[10px] font-mono text-slate-500">{supplierGstin}</p>
          </div>

          {/* 4. To (Ship To / Bill To) Card matching mockup 8.13.png */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                To (Ship To / Bill To)
              </span>
              <button
                type="button"
                onClick={() => {
                  const newName = prompt('Enter recipient name:', recipientName);
                  if (newName) setRecipientName(newName);
                }}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Change
              </button>
            </div>
            <h4 className="font-bold text-slate-900 text-xs">{recipientName}</h4>
            <p className="text-[11px] text-slate-500">{recipientAddress}</p>
            <p className="text-[10px] font-mono text-slate-500">{recipientGstin}</p>
          </div>

          {/* 5. Place of Dispatch / Delivery */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Place of Dispatch <span className="text-rose-500">*</span>
              </label>
              <select
                value={placeOfDispatch}
                onChange={(e) => setPlaceOfDispatch(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
              >
                <option value="Chhattisgarh (22)">Chhattisgarh (22)</option>
                <option value="Maharashtra (27)">Maharashtra (27)</option>
                <option value="Madhya Pradesh (23)">Madhya Pradesh (23)</option>
                <option value="Odisha (21)">Odisha (21)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Place of Delivery <span className="text-rose-500">*</span>
              </label>
              <select
                value={placeOfDelivery}
                onChange={(e) => setPlaceOfDelivery(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
              >
                <option value="Chhattisgarh (22)">Chhattisgarh (22)</option>
                <option value="Maharashtra (27)">Maharashtra (27)</option>
                <option value="Madhya Pradesh (23)">Madhya Pradesh (23)</option>
                <option value="Odisha (21)">Odisha (21)</option>
              </select>
            </div>
          </div>

          {/* 6. Transportation Details matching mockup 8.13.png */}
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
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
                <select
                  value={transporter}
                  onChange={(e) => setTransporter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                >
                  <option value="VRL Logistics">VRL Logistics</option>
                  <option value="Safechem Cargo">Safechem Cargo</option>
                  <option value="TCI Express">TCI Express</option>
                  <option value="Gati KWE">Gati KWE</option>
                  <option value="Blue Dart Express">Blue Dart Express</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Vehicle No. <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Distance (in KM) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={handleCalculateDistance}
                    className="px-2.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-blue-600 text-xs font-semibold rounded-xl shadow-2xs shrink-0 cursor-pointer"
                  >
                    Calculate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Item Details Table matching mockup 8.13.png */}
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
                  {items.map((it, idx) => (
                    <tr key={it.id}>
                      <td className="py-2 px-2.5 text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-2.5 font-bold text-slate-900">{it.name}</td>
                      <td className="py-2 px-2 font-mono text-slate-600">{it.hsn}</td>
                      <td className="py-2 px-2 text-slate-800">{it.quantity}</td>
                      <td className="py-2 px-2 text-slate-600">{it.unit}</td>
                      <td className="py-2 px-2.5 text-right font-medium text-slate-900 font-mono">
                        {it.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total summary block matching mockup 8.13.png */}
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-500">
                  Total Quantity: <strong className="text-slate-900">{totalQuantity}</strong>
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <span>E-Way Bill Applicable</span>
                  <span
                    className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                      isApplicable
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isApplicable ? 'Yes' : 'No'}
                  </span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
              </div>

              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">Total Value (₹)</span>
                <span className="text-base font-black text-slate-900 font-mono">
                  ₹ {totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            Generate E-Way Bill
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
