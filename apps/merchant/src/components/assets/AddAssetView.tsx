import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Calendar,
  Plus,
  Home,
} from 'lucide-react';
import { useAssetStore, AssetCategory, AssetStatus } from '../../stores/assetStore.js';

interface AddAssetViewProps {
  onBack: () => void;
}

export const AddAssetView: React.FC<AddAssetViewProps> = ({ onBack }) => {
  const { addAsset, assets } = useAssetStore();

  const generatedCode = `AST-2026-00${(assets.length + 1).toString().padStart(2, '0')}`;

  // 1. Asset Details
  const [assetName, setAssetName] = useState('');
  const [assetCode, setAssetCode] = useState(generatedCode);
  const [category, setCategory] = useState<AssetCategory>('IT Equipment');
  const [subCategory, setSubCategory] = useState('');
  const [assetType, setAssetType] = useState('Tangible Asset');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  // 2. Purchase Information
  const [purchaseDate, setPurchaseDate] = useState('11 May 2024');
  const [purchaseValue, setPurchaseValue] = useState('');
  const [vendor, setVendor] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState('');
  const [purchaseNotes, setPurchaseNotes] = useState('');

  // 3. Asset Location & Assignment
  const [location, setLocation] = useState('Head Office');
  const [department, setDepartment] = useState('Operations');
  const [assignedTo, setAssignedTo] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [rackShelf, setRackShelf] = useState('');
  const [room, setRoom] = useState('');

  // 4. Depreciation & Accounting
  const [depreciationMethod, setDepreciationMethod] = useState('Straight Line Method');
  const [usefulLifeYears, setUsefulLifeYears] = useState('5');
  const [depreciationRate, setDepreciationRate] = useState('20');
  const [residualValue, setResidualValue] = useState('0');
  const [calculateDepreciation, setCalculateDepreciation] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');

  const numPurchaseValue = parseFloat(purchaseValue) || 0;

  const handleSave = (isDraft = false) => {
    if (!assetName.trim()) {
      setErrorMsg('Asset name is required.');
      return;
    }
    if (numPurchaseValue <= 0) {
      setErrorMsg('Please enter a valid purchase value.');
      return;
    }

    addAsset({
      name: assetName,
      code: assetCode || generatedCode,
      category,
      subCategory,
      location,
      purchaseDate,
      purchaseValue: numPurchaseValue,
      currentValue: numPurchaseValue, // initial current value equals purchase value
      status: isDraft ? 'Under Maintenance' : 'Active',
      assetType,
      brand,
      model,
      serialNumber,
      description,
      tags,
      vendor,
      invoiceNumber,
      warrantyExpiryDate,
      assignedTo,
      department,
      costCenter,
      rackShelf,
      room,
      depreciationMethod,
      usefulLifeYears: parseFloat(usefulLifeYears) || 5,
      depreciationRate: parseFloat(depreciationRate) || 20,
      residualValue: parseFloat(residualValue) || 0,
      calculateDepreciation,
      notes: purchaseNotes,
    });

    onBack();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Breadcrumb matching 9.1.png */}
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
          Asset Management
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800">Add Asset</span>
      </div>

      {/* Header matching 9.1.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add Asset</h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter asset details to add a new asset to your business.
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
              Save Asset
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

      {/* 1. Asset Details Card matching 9.1.png */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">1. Asset Details</h3>

        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Asset Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter asset name"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">E.g. Dell Inspiron Laptop</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Asset Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={assetCode}
              onChange={(e) => setAssetCode(e.target.value)}
              placeholder="Auto-generated"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 shadow-2xs"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Unique code for this asset</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AssetCategory)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                >
                  <option value="IT Equipment">IT Equipment</option>
                  <option value="Office Equipment">Office Equipment</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Safety Equipment">Safety Equipment</option>
                  <option value="Security">Security</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="button"
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Sub Category (Optional)
            </label>
            <div className="relative">
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
              >
                <option value="">Select sub category</option>
                <option value="Laptops">Laptops</option>
                <option value="Desktops">Desktops</option>
                <option value="Printers">Printers</option>
                <option value="Cooling Units">Cooling Units</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Asset Type <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
              >
                <option value="Tangible Asset">Tangible Asset</option>
                <option value="Intangible Asset">Intangible Asset</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Brand (Optional)
            </label>
            <div className="relative">
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
              >
                <option value="">Select brand</option>
                <option value="Dell">Dell</option>
                <option value="HP">HP</option>
                <option value="Featherlite">Featherlite</option>
                <option value="Voltas">Voltas</option>
                <option value="LG">LG</option>
                <option value="Samsung">Samsung</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Model (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Serial Number (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter serial number"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Description (Optional)
              </label>
              <span className="text-[10px] text-slate-400">{description.length}/250</span>
            </div>
            <textarea
              rows={2}
              maxLength={250}
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tags (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter tags and press enter"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Helps in quick identification
            </span>
          </div>
        </div>
      </div>

      {/* 2 & 3: Purchase & Location Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Section 2: Purchase Information */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">2. Purchase Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Purchase Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full pl-3.5 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Purchase Value (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter purchase value"
                value={purchaseValue}
                onChange={(e) => setPurchaseValue(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Purchase From (Vendor)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Select or add vendor"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
                <button
                  type="button"
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Invoice / Bill No. (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter invoice or bill number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Warranty Expiry Date (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select date"
                  value={warrantyExpiryDate}
                  onChange={(e) => setWarrantyExpiryDate(e.target.value)}
                  className="w-full pl-3.5 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Notes (Optional)</label>
                <span className="text-[10px] text-slate-400">{purchaseNotes.length}/200</span>
              </div>
              <textarea
                rows={2}
                maxLength={200}
                placeholder="Enter notes"
                value={purchaseNotes}
                onChange={(e) => setPurchaseNotes(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Asset Location & Assignment */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">3. Asset Location & Assignment</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                >
                  <option value="Head Office">Head Office</option>
                  <option value="Store - Indore">Store - Indore</option>
                  <option value="Store - Bhopal">Store - Bhopal</option>
                  <option value="Warehouse">Warehouse</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Department (Optional)
              </label>
              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                >
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                  <option value="IT Desk">IT Desk</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Assigned To (Optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Select or add user"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
                <button
                  type="button"
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cost Center (Optional)
              </label>
              <div className="relative">
                <select
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
                >
                  <option value="">Select cost center</option>
                  <option value="IT Infrastructure">IT Infrastructure</option>
                  <option value="Store Facilities">Store Facilities</option>
                  <option value="Logistics">Logistics</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Rack / Shelf (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter rack or shelf"
                value={rackShelf}
                onChange={(e) => setRackShelf(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Room (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Depreciation & Accounting Card matching 9.1.png */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">4. Depreciation & Accounting</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Depreciation Method
            </label>
            <div className="relative">
              <select
                value={depreciationMethod}
                onChange={(e) => setDepreciationMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-2xs cursor-pointer"
              >
                <option value="Straight Line Method">Straight Line Method</option>
                <option value="Written Down Value (WDV)">Written Down Value (WDV)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Useful Life (Years)
            </label>
            <input
              type="number"
              placeholder="Enter useful life"
              value={usefulLifeYears}
              onChange={(e) => setUsefulLifeYears(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Depreciation Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="Enter rate"
                value={depreciationRate}
                onChange={(e) => setDepreciationRate(e.target.value)}
                className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                %
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Residual Value (₹)
            </label>
            <input
              type="number"
              placeholder="Enter residual value"
              value={residualValue}
              onChange={(e) => setResidualValue(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div className="pb-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={calculateDepreciation}
                onChange={(e) => setCalculateDepreciation(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-slate-800">
                Calculate depreciation
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar matching 9.1.png */}
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
            Save Asset
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
