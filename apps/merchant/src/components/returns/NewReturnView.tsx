import React, { useState } from 'react';
import {
  ChevronRight,
  Search,
  Clock,
  Calendar,
  User,
  CreditCard,
  Receipt,
  Minus,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Package,
} from 'lucide-react';
import {
  useReturnsStore,
  initialAvailableOrders,
  OrderLookupOption,
  ReturnType,
} from '../../stores/returnsStore.js';

interface NewReturnViewProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export const NewReturnView: React.FC<NewReturnViewProps> = ({
  onCancel,
  onSuccess,
}) => {
  const { addReturn } = useReturnsStore();

  const [availableOrders] = useState<OrderLookupOption[]>(initialAvailableOrders);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderLookupOption>(
    initialAvailableOrders[0]!
  );

  const [returnQty, setReturnQty] = useState<number>(1);
  const [reason, setReason] = useState<string>('Size issue');
  const [comments, setComments] = useState<string>('');
  const [returnType, setReturnType] = useState<ReturnType>('Return');
  const [refundMethod, setRefundMethod] = useState<string>('Original Payment Method');
  const [pickupDate, setPickupDate] = useState<string>('2024-05-19');
  const [pickupTime, setPickupTime] = useState<string>('10:00 AM - 01:00 PM');
  const [internalNote, setInternalNote] = useState<string>('');
  const [notifyCustomer, setNotifyCustomer] = useState<boolean>(true);

  // Filter orders for the selector list
  const filteredOrders = availableOrders.filter((ord) => {
    if (!orderSearchQuery.trim()) return true;
    const q = orderSearchQuery.toLowerCase();
    return (
      ord.orderNumber.toLowerCase().includes(q) ||
      ord.customerName.toLowerCase().includes(q) ||
      ord.customerEmail.toLowerCase().includes(q) ||
      ord.customerPhone.includes(q)
    );
  });

  const itemTotal = selectedOrder.product.price * returnQty;
  const shippingCharges = 0;
  const discount = 0;
  const totalRefund = itemTotal + shippingCharges - discount;

  const handleSelectOrder = (order: OrderLookupOption) => {
    setSelectedOrder(order);
    setReturnQty(1);
  };

  const handleSaveReturn = (e: React.FormEvent) => {
    e.preventDefault();

    addReturn({
      orderNumber: selectedOrder.orderNumber,
      customer: {
        name: selectedOrder.customerName,
        email: selectedOrder.customerEmail,
        phone: selectedOrder.customerPhone,
        address: selectedOrder.customerAddress,
      },
      product: {
        name: selectedOrder.product.name,
        variant: selectedOrder.product.variant,
        sku: selectedOrder.product.sku,
        price: selectedOrder.product.price,
        quantity: selectedOrder.product.quantity,
        returnQuantity: returnQty,
        imageUrl: selectedOrder.product.imageUrl,
      },
      returnType,
      reason,
      amount: totalRefund,
      status: 'Pending',
      refundMethod,
      refundAmount: totalRefund,
      pickupDate,
      pickupTime,
      pickupAddress: selectedOrder.customerAddress,
      comments: comments.trim() ? comments : undefined,
      internalNote: internalNote.trim() ? internalNote : undefined,
      notifyCustomer,
    });

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
          <span className="hover:text-slate-600 cursor-pointer" onClick={onCancel}>
            Home
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="hover:text-slate-600 cursor-pointer" onClick={onCancel}>
            Returns & Refunds
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-semibold">New Return</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              New Return
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create a new return request for an order.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveReturn}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
            >
              Save Return
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Forms & Details) - 2 cols span */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: 1. Select Order */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold text-slate-900">1. Select Order</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Choose the order for which you want to create a return request.
            </p>

            {/* Order Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, Phone..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Recent Orders List */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Recent Orders
              </span>

              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {filteredOrders.map((ord) => {
                  const isSelected = selectedOrder.orderNumber === ord.orderNumber;
                  return (
                    <label
                      key={ord.orderNumber}
                      onClick={() => handleSelectOrder(ord)}
                      className={`flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="selected_order"
                          checked={isSelected}
                          onChange={() => handleSelectOrder(ord)}
                          className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500/20"
                        />
                        <span className="text-xs font-bold text-slate-900">
                          {ord.orderNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <p className="text-xs font-semibold text-slate-900">
                            {ord.customerName}
                          </p>
                          <p className="text-[11px] text-slate-400">{ord.customerEmail}</p>
                        </div>

                        <div>
                          <p className="text-[11px] text-slate-500">
                            {ord.orderDate.split(',')[0]}
                          </p>
                          <p className="text-xs font-bold text-slate-900">
                            ₹ {ord.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>View all orders</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: 2. Order & Product Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold text-slate-900">
                2. Order & Product Details
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Review the order and select the product(s) to return.
            </p>

            {/* Order Meta Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl mb-4 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Order ID
                </span>
                <p className="font-bold text-slate-900 mt-1">
                  {selectedOrder.orderNumber}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Order Date
                </span>
                <p className="font-semibold text-slate-800 mt-1 truncate">
                  {selectedOrder.orderDate}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  Customer
                </span>
                <p className="font-semibold text-slate-800 mt-1 truncate">
                  {selectedOrder.customerName}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-slate-400" />
                  Payment Method
                </span>
                <p className="font-semibold text-slate-800 mt-1">
                  {selectedOrder.paymentMethod}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Receipt className="w-3 h-3 text-slate-400" />
                  Order Amount
                </span>
                <p className="font-bold text-slate-900 mt-1">
                  ₹ {selectedOrder.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Product Table */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden mb-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Variant</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3 text-center">Quantity</th>
                    <th className="py-2.5 px-3 text-center">Return Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={selectedOrder.product.imageUrl}
                          alt={selectedOrder.product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {selectedOrder.product.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            SKU: {selectedOrder.product.sku}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {selectedOrder.product.variant}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      ₹ {selectedOrder.product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-800">
                      {selectedOrder.product.quantity}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => setReturnQty(Math.max(1, returnQty - 1))}
                            disabled={returnQty <= 1}
                            className="p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold text-slate-900 text-xs">
                            {returnQty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setReturnQty(
                                Math.min(selectedOrder.product.quantity, returnQty + 1)
                              )
                            }
                            disabled={returnQty >= selectedOrder.product.quantity}
                            className="p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1">
                          Max: {selectedOrder.product.quantity}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Reason & Comments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Reason for Return <span className="text-rose-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                >
                  <option value="Size issue">Size issue</option>
                  <option value="Product not as described">Product not as described</option>
                  <option value="Fabric quality">Fabric quality</option>
                  <option value="Received wrong item">Received wrong item</option>
                  <option value="Too large">Too large</option>
                  <option value="Need different size">Need different size</option>
                  <option value="Damaged / Defective">Damaged / Defective</option>
                  <option value="Changed mind">Changed mind</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Comments <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">{comments.length}/250</span>
                </div>
                <textarea
                  rows={2}
                  maxLength={250}
                  placeholder="Add any additional comments..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Card 3: 3. Return Type */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold text-slate-900">3. Return Type</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Select how the customer will return the product.
            </p>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors ${
                  returnType === 'Return'
                    ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="returnType"
                  checked={returnType === 'Return'}
                  onChange={() => setReturnType('Return')}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500/20"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Return</p>
                  <p className="text-[11px] text-slate-500">Send item back to seller</p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors ${
                  returnType === 'Exchange'
                    ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="returnType"
                  checked={returnType === 'Exchange'}
                  onChange={() => setReturnType('Exchange')}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500/20"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Exchange</p>
                  <p className="text-[11px] text-slate-500">Replace with different product</p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-colors ${
                  returnType === 'Refund Only'
                    ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="returnType"
                  checked={returnType === 'Refund Only'}
                  onChange={() => setReturnType('Refund Only')}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500/20"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Refund Only</p>
                  <p className="text-[11px] text-slate-500">No need to return the item</p>
                </div>
              </label>
            </div>
          </div>

          {/* Card 4: 4. Refund Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold text-slate-900">4. Refund Details</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Choose how the refund should be issued.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Refund Method <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={refundMethod}
                    onChange={(e) => setRefundMethod(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                  >
                    <option value="Original Payment Method">Original Payment Method</option>
                    <option value="Store Credit / Wallet">Store Credit / Wallet</option>
                    <option value="Bank Transfer / UPI">Bank Transfer / UPI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Refund Amount
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={`₹ ${totalRefund.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}`}
                      className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Refund Summary Box */}
              <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs space-y-2.5">
                <span className="font-bold text-slate-900 block mb-2">
                  Refund Summary
                </span>

                <div className="flex justify-between text-slate-600">
                  <span>Item Total</span>
                  <span className="font-semibold text-slate-900">
                    ₹ {itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Shipping Charges</span>
                  <span>
                    ₹ {shippingCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Discount</span>
                  <span>
                    ₹ {discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Refund</span>
                  <span>
                    ₹ {totalRefund.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: 5. Pickup Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold text-slate-900">5. Pickup Details</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              We will pickup the item from the customer.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pickup Address <span className="text-rose-500">*</span>
                </label>
                <select className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700">
                  <option value="customer_address">Customer Address</option>
                  <option value="alternate_address">Alternate Address</option>
                </select>
              </div>

              {/* Address Preview Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-0.5">
                <p className="font-bold text-slate-900">{selectedOrder.customerName}</p>
                <p className="text-slate-600">{selectedOrder.customerAddress}</p>
                <p className="text-slate-500 pt-1 font-medium">{selectedOrder.customerPhone}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Pickup Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Pickup Time <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                  >
                    <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM</option>
                    <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM</option>
                    <option value="05:00 PM - 08:00 PM">05:00 PM - 08:00 PM</option>
                  </select>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Pickup will be scheduled within 24-48 hours.
              </p>
            </div>
          </div>

          {/* Card 6: 6. Additional Information (Optional) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold text-slate-900">
                6. Additional Information (Optional)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Add any additional notes or instructions.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Internal Note
                  </label>
                  <span className="text-[10px] text-slate-400">{internalNote.length}/250</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={250}
                  placeholder="Add internal note..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400"
                />
              </div>

              <div className="pt-1">
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Customer Notification
                </span>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyCustomer}
                    onChange={(e) => setNotifyCustomer(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                  />
                  <span className="text-xs text-slate-700">
                    Send email & SMS notification to customer
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Return Summary & Policy Reminders (1 col) */}
        <div className="space-y-6">
          {/* Return Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Return Summary</h3>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-800">
                  {returnQty} {returnQty === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900">
                ₹ {itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Return Type</span>
                <span className="font-semibold text-slate-800">{returnType}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Refund Method</span>
                <span className="font-semibold text-slate-800 text-right">
                  {refundMethod}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <span className="text-xs text-slate-500 block">Total Refund</span>
              <p className="text-xl font-black text-slate-900 mt-1">
                ₹ {totalRefund.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Return Policy Reminder Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-start gap-2.5 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-amber-800 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="font-medium">
                Ensure the return is eligible as per your return policy.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Return window: 7 days</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Item should be unused and in original condition</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Original packaging is required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
