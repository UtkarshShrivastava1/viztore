import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Edit2,
  Trash2,
  ChevronDown,
  Calendar,
  Plus,
  X,
} from 'lucide-react';
import { useOrderStore } from '../stores/orderStore.js';
import { useInventoryStore } from '../stores/inventoryStore.js';

interface CreateOrderPageProps {
  onBack?: () => void;
}

interface OrderItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  iconType: 'tshirt' | 'jeans' | 'kurti' | 'saree';
}

const catalogOptions: OrderItem[] = [
  { id: 'item-1', name: 'Men T-shirt', variant: 'Black • Size: L', price: 599, quantity: 1, iconType: 'tshirt' },
  { id: 'item-2', name: 'Men Jeans', variant: 'Blue • Size: 32', price: 1299, quantity: 1, iconType: 'jeans' },
  { id: 'item-3', name: 'Embroidered Kurti', variant: 'Red • Size: M', price: 899, quantity: 1, iconType: 'kurti' },
  { id: 'item-4', name: 'Cotton Silk Saree', variant: 'Gold / Yellow', price: 2199, quantity: 1, iconType: 'saree' },
];

export const CreateOrderPage: React.FC<CreateOrderPageProps> = ({ onBack }) => {
  const { addManualOrder } = useOrderStore();

  // State
  const [customerType, setCustomerType] = useState<'existing' | 'new'>('existing');
  const [customerName, setCustomerName] = useState('Rohan Verma');
  const [customerEmail, setCustomerEmail] = useState('rohanverma@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [addressList, setAddressList] = useState<string[]>([
    '123, Green Park, Lajpat Nagar, New Delhi - 110024',
    'Flat 4B, Shanti Apartments, Andheri West, Mumbai - 400058',
  ]);
  const [deliveryAddress, setDeliveryAddress] = useState('123, Green Park, Lajpat Nagar, New Delhi - 110024');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressInput, setNewAddressInput] = useState('');

  const [deliveryDate, setDeliveryDate] = useState('14 May 2024');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('');
  const [deliveryPartner, setDeliveryPartner] = useState('');
  const [otp] = useState('4827');
  const [orderNotes, setOrderNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Items in Order matching Orders_09_Create_Order.png
  const [items, setItems] = useState<OrderItem[]>([
    { id: 'item-1', name: 'Men T-shirt', variant: 'Black • Size: L', price: 599, quantity: 1, iconType: 'tshirt' },
    { id: 'item-2', name: 'Men Jeans', variant: 'Blue • Size: 32', price: 1299, quantity: 1, iconType: 'jeans' },
  ]);

  // Calculations
  const itemsTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 0;
  const shippingCharge = 0;
  const packagingCharge = items.length > 0 ? 20 : 0;
  const orderTotal = itemsTotal - discount + shippingCharge + packagingCharge;

  // Quantity handlers
  const handleQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQ = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQ };
        }
        return item;
      })
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = (prod: OrderItem) => {
    const existing = items.find((i) => i.id === prod.id);
    if (existing) {
      handleQuantity(prod.id, 1);
    } else {
      setItems((prev) => [...prev, { ...prod, quantity: 1 }]);
    }
    setErrorMessage(null);
    setIsAddModalOpen(false);
  };

  // Submit
  const handleCreateOrder = () => {
    if (items.length === 0) {
      setErrorMessage('Please add at least one item to generate this order.');
      return;
    }

    setErrorMessage(null);
    const initials = customerName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const nextNum = Math.floor(10330 + Math.random() * 900);
    const assignedOrderNumber = `#ORD-${nextNum}`;

    addManualOrder({
      orderNumber: assignedOrderNumber,
      orderType: deliveryType === 'delivery' ? 'Online Order' : 'Manual In-Store',
      status: 'new',
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        avatarInitials: initials || 'CU',
      },
      deliveryAddress: {
        street: deliveryAddress,
        locality: 'Local Delivery Area',
        city: 'Local City',
        state: 'Local State',
        pincode: '110024',
        fullText: `${customerName}\n${deliveryAddress}`,
      },
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        variant: i.variant,
        price: i.price,
        quantity: i.quantity,
      })),
      itemsSummary: {
        count: items.reduce((acc, i) => acc + i.quantity, 0),
        title: items.map((i) => i.name).join(', '),
        categoryIconType: 'tshirt',
      },
      pricing: {
        itemsTotal,
        packagingFee: packagingCharge,
        deliveryFee: shippingCharge,
        totalAmount: orderTotal,
      },
      payment: {
        status: 'Paid',
        paymentMethod: 'Online Paid',
        mode: 'UPI',
      },
      otp: otp,
      notes: {
        customerInstructions: orderNotes,
        merchantNotes: internalNotes,
      },
    });

    // Synchronize inventory store: decrement stock and log audit transaction
    try {
      useInventoryStore.getState().recordSaleDeduction(
        items.map((i) => ({
          productId: i.id,
          sku: i.id,
          quantity: i.quantity,
        })),
        assignedOrderNumber.replace('#', ''),
        'manual_order',
        'Manual order created'
      );
    } catch (invErr) {
      console.warn('Inventory sync error on order creation:', invErr);
    }

    setIsSuccess(true);
    setTimeout(() => {
      onBack?.();
    }, 600);
  };

  return (
    <div className="space-y-4 w-full pb-8 font-sans animate-in fade-in-50 duration-200">
      {/* 1. Header Section matching Orders_09_Create_Order.png */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-1">
        <div>
          {/* Back link */}
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-semibold hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Orders</span>
          </button>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Create Order
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add customer, items and delivery details to create a new order.
          </p>
        </div>

        {/* Top Header Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateOrder}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            Create Order
          </button>
        </div>
      </div>

      {/* Inline Feedback Banners */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between animate-in fade-in-50 duration-150">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {isSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in-50 duration-150">
          Order created successfully! Redirecting to orders pipeline...
        </div>
      )}

      {/* 2. Top Row: 3 Columns matching reference proportions: [33.5% | 38% | 28.5%] */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.35fr_1fr] gap-4 items-stretch">
        {/* Card 1: Customer Details */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Customer Details</h2>

            {/* Radio Toggles */}
            <div className="flex items-center gap-6 mt-3.5 mb-3.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="customerType"
                  checked={customerType === 'existing'}
                  onChange={() => setCustomerType('existing')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-900">Existing Customer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="customerType"
                  checked={customerType === 'new'}
                  onChange={() => setCustomerType('new')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs font-medium text-slate-600">New Customer</span>
              </label>
            </div>

            {/* Customer Search Dropdown */}
            <div className="relative mb-3.5">
              <input
                type="text"
                readOnly
                placeholder="Search customer by name, phone or email..."
                className="w-full pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Verified / Editable Customer Card */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white relative shadow-2xs">
              {isEditingCustomer ? (
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-900">Edit Customer Information</div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingCustomer(false)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Save Details
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {customerName
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase() || 'CU'}
                  </div>

                  {/* Details */}
                  <div className="space-y-1 min-w-0 pr-12 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{customerName}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 leading-tight">
                        Verified
                      </span>
                    </div>

                    <div className="text-slate-700 font-semibold text-[11px]">{customerPhone}</div>

                    <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{customerEmail}</span>
                    </div>

                    <div className="text-slate-500 text-[11px] leading-tight pt-0.5">
                      {deliveryAddress}
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => setIsEditingCustomer(true)}
                    className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-blue-600 text-xs font-semibold hover:bg-slate-50 bg-white shadow-2xs transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Order Items */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Title & Add Item Trigger */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Order Items</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="text-blue-600 inline-flex items-center gap-1 text-xs font-semibold hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Table Header Bar */}
            <div className="bg-[#f8fafc] text-slate-600 font-semibold text-[11px] py-1.5 px-3 rounded-lg grid grid-cols-12 items-center mb-2 border border-slate-100">
              <span className="col-span-5">Product</span>
              <span className="col-span-2 text-right pr-2">Price</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Total</span>
              <span className="col-span-1"></span>
            </div>

            {/* Items Rows */}
            <div className="divide-y divide-slate-100 text-xs">
              {items.map((item) => (
                <div key={item.id} className="py-2.5 grid grid-cols-12 items-center gap-1">
                  {/* Product Details with realistic preview */}
                  <div className="col-span-5 flex items-center gap-2.5 min-w-0 pr-1">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                      {item.iconType === 'jeans' ? (
                        <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white">
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                            <path d="M6 3h12v4l-2 15h-3l-1-10-1 10H8L6 7V3z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-7 h-7 bg-slate-900 rounded flex items-center justify-center text-white">
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                            <path d="M16 2l4 4-2 3-2-1v14H8V8L6 9 4 6l4-4h2a3 3 0 004 0h2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">{item.variant}</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-right pr-2 font-bold text-slate-900 text-xs">
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="col-span-2 flex justify-center">
                    <div className="inline-flex items-center border border-slate-200 rounded-md bg-white shadow-2xs h-6 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleQuantity(item.id, -1)}
                        className="w-5 h-full flex items-center justify-center text-blue-600 hover:bg-slate-50 font-bold transition-colors text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 h-full flex items-center justify-center text-xs font-bold text-slate-900 border-x border-slate-200">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantity(item.id, 1)}
                        className="w-5 h-full flex items-center justify-center text-blue-600 hover:bg-slate-50 font-bold transition-colors text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="col-span-2 text-right font-black text-slate-900 text-xs">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>

                  {/* Trash Remove */}
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add More Items Button matching mockup */}
          <div className="mt-3 pt-1">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="w-full py-2 rounded-xl border border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50 text-blue-600 font-bold text-xs flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add More Items</span>
            </button>
          </div>
        </div>

        {/* Card 3: Order Summary */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-4">Order Summary</h2>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium">Items Total ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                <span className="font-bold text-slate-900">₹{itemsTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium">Discount</span>
                <span className="font-bold text-emerald-600">- ₹0</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium">Shipping Charge</span>
                <span className="font-bold text-slate-900">₹0</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium">Packaging Charge</span>
                <span className="font-bold text-slate-900">₹20</span>
              </div>
            </div>
          </div>

          {/* Order Total at bottom of Card 3 */}
          <div className="pt-4 border-t border-slate-100 mt-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Order Total</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Inclusive of all taxes</p>
              </div>
              <span className="text-base font-black text-slate-900">
                ₹{orderTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Delivery Details [71.5%] | Order Notes [28.5%] perfectly aligning with top row seam! */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.55fr_1fr] gap-4 items-stretch">
        {/* Card 4: Delivery Details */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-4">Delivery Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Delivery Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">Delivery Type</label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === 'delivery'}
                        onChange={() => setDeliveryType('delivery')}
                        className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span className="text-xs font-bold text-slate-900">Delivery</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === 'pickup'}
                        onChange={() => setDeliveryType('pickup')}
                        className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span className="text-xs font-medium text-slate-600">Self Pickup</span>
                    </label>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-800">Delivery Address</label>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(!isAddingAddress)}
                      className="text-blue-600 text-[11px] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isAddingAddress ? 'Cancel' : 'Add New Address'}</span>
                    </button>
                  </div>

                  {isAddingAddress && (
                    <div className="mb-2 p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                      <input
                        type="text"
                        placeholder="Enter street, area, city, pincode..."
                        value={newAddressInput}
                        onChange={(e) => setNewAddressInput(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (newAddressInput.trim()) {
                              setAddressList((prev) => [newAddressInput.trim(), ...prev]);
                              setDeliveryAddress(newAddressInput.trim());
                              setNewAddressInput('');
                              setIsAddingAddress(false);
                            }
                          }}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <select
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-900 outline-none appearance-none bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
                    >
                      {addressList.map((addr) => (
                        <option key={addr} value={addr}>
                          {addr}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Delivery Partner */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Delivery Partner</label>
                  <div className="relative">
                    <select
                      value={deliveryPartner}
                      onChange={(e) => setDeliveryPartner(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-400 outline-none appearance-none bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
                    >
                      <option value="">Select Delivery Partner (Optional)</option>
                      <option value="Delhivery">Delhivery</option>
                      <option value="Bluedart">Bluedart</option>
                      <option value="Shadowfax">Shadowfax</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Preferred Delivery Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Preferred Delivery Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-900 outline-none font-bold focus:ring-1 focus:ring-blue-500 shadow-2xs bg-white"
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Preferred Delivery Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Preferred Delivery Time
                  </label>
                  <div className="relative">
                    <select
                      value={deliveryTimeSlot}
                      onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-400 outline-none appearance-none bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
                    >
                      <option value="">Select Time Slot (Optional)</option>
                      <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (12:00 PM - 3:00 PM)">Afternoon (12:00 PM - 3:00 PM)</option>
                      <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Order OTP */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Order OTP <span className="font-normal text-slate-400">(for delivery verification)</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={otp}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs bg-white tracking-widest font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    This OTP will be required by the delivery partner.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Order Notes (Optional) */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between text-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3">
              Order Notes <span className="font-normal text-slate-400">(Optional)</span>
            </h2>

            <div className="space-y-4">
              <div>
                <textarea
                  rows={4}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Add order notes or special instructions..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 outline-none resize-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 text-xs mb-1.5">
                  Internal Note <span className="font-normal text-slate-400">(Visible only to you)</span>
                </label>
                <textarea
                  rows={4}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 outline-none resize-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Total & Action Bar matching Orders_09_Create_Order.png */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-baseline gap-4">
          <span className="font-bold text-slate-800 text-xs">Order Total</span>
          <span className="font-black text-slate-900 text-xl tracking-tight">
            ₹{orderTotal.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateOrder}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            Create Order
          </button>
        </div>
      </div>

      {/* Catalog Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 p-5 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Item From Catalog</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
              {catalogOptions.map((prod) => (
                <div
                  key={prod.id}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg"
                >
                  <div>
                    <div className="font-bold text-slate-900">{prod.name}</div>
                    <div className="text-[10px] text-slate-400">{prod.variant}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">₹{prod.price}</span>
                    <button
                      type="button"
                      onClick={() => handleAddItem(prod)}
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};