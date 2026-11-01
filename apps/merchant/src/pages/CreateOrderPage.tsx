import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Mail,
  Edit2,
  Trash2,
  ChevronDown,
  Calendar,
  Plus,
  X,
  UserPlus,
  CheckCircle2,
  Search,
  Sparkles,
  CreditCard,
  Wallet,
  Banknote,
  Truck,
  RotateCw,
  ShoppingBag,
  Store,
  MapPin,
  Clock,
  ShieldCheck,
  Tag,
  Receipt,
  Phone,
  Layers,
  User,
} from 'lucide-react';
import { useOrderStore } from '../stores/orderStore.js';
import { useCustomerStore, Customer } from '../stores/customerStore.js';
import { useInventoryStore } from '../stores/inventoryStore.js';
import { useCatalogStore, ProductItem } from '../stores/catalogStore.js';
import { useAuthStore } from '../stores/authStore.js';
import { ordersApi } from '../lib/api.js';
import { formatDateIST, branding } from '@repo/shared-types';

interface CreateOrderPageProps {
  onBack?: () => void;
}

export interface OrderItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  iconType?: 'tshirt' | 'jeans' | 'kurti' | 'saree' | 'general';
  image?: string;
  sku?: string;
  stock?: number;
}

export const CreateOrderPage: React.FC<CreateOrderPageProps> = ({ onBack }) => {
  const { addManualOrder } = useOrderStore();
  const { products: catalogProducts, fetchProducts } = useCatalogStore();
  const { currentStore } = useAuthStore();
  const customers = useCustomerStore((state) => state.customers);
  const fetchCustomers = useCustomerStore((state) => state.fetchCustomers);

  // Load real store data on mount
  useEffect(() => {
    if (catalogProducts.length === 0) {
      fetchProducts();
    }
    if (customers.length === 0) {
      fetchCustomers();
    }
  }, [catalogProducts.length, customers.length, fetchProducts, fetchCustomers]);

  // Customer State - decoupled between Existing Customer selection and New Customer registration
  const [customerType, setCustomerType] = useState<'existing' | 'new'>('existing');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Delivery & Location State
  const storeAddress = useMemo(() => {
    if (currentStore?.address) {
      const a = currentStore.address;
      return `${a.street}, ${a.city}, ${a.state} - ${a.pincode}`;
    }
    return 'Shop No. 12, City Mall, Supela, Bhilai, Chhattisgarh - 490023';
  }, [currentStore]);

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [addressList, setAddressList] = useState<string[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressInput, setNewAddressInput] = useState('');

  const [deliveryDate, setDeliveryDate] = useState(() => formatDateIST(new Date()));
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('Immediate (30-45 mins express)');
  const [deliveryPartner, setDeliveryPartner] = useState(
    `${branding.appName} Hyperlocal Rider (30-45 mins express)`
  );

  // Security OTP
  const [otp, setOtp] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));
  const regenerateOtp = () => {
    setOtp(String(Math.floor(1000 + Math.random() * 9000)));
  };

  // Payment Selection
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Cash' | 'Card' | 'Khata'>('UPI');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending'>('Paid');

  // Notes
  const [orderNotes, setOrderNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  // Modals & Feedback
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'catalog' | 'custom'>('catalog');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Custom Item Form State
  const [customItemName, setCustomItemName] = useState('');
  const [customItemVariant, setCustomItemVariant] = useState('Standard');
  const [customItemPrice, setCustomItemPrice] = useState<string>('499');
  const [customItemQty, setCustomItemQty] = useState<number>(1);

  // Items in Order - starts 100% clean and empty for genuine production order creation
  const [items, setItems] = useState<OrderItem[]>([]);

  // Adjust payment status automatically when payment mode changes
  useEffect(() => {
    if (paymentMode === 'Cash' && deliveryType === 'delivery') {
      setPaymentStatus('Pending');
    } else if (paymentMode === 'Khata') {
      setPaymentStatus('Pending');
    } else {
      setPaymentStatus('Paid');
    }
  }, [paymentMode, deliveryType]);

  // Financial Charges & Discounts
  const [discount, setDiscount] = useState<number>(0);
  const [shippingCharge, setShippingCharge] = useState<number>(0);
  const [packagingCharge, setPackagingCharge] = useState<number>(0);

  // Synchronize delivery logistics and addresses based on fulfillment mode & customer selection
  useEffect(() => {
    if (deliveryType === 'pickup') {
      setShippingCharge(0);
      setDeliveryPartner('In-Store Customer Pickup');
      setDeliveryAddress(`${currentStore?.name || 'Store'} Pickup Counter`);
    } else {
      setDeliveryPartner(`${branding.appName} Hyperlocal Rider (30-45 mins express)`);
      if (customerType === 'existing' && selectedCustomer?.billingAddress?.addressLine1) {
        const fullAddr = `${selectedCustomer.billingAddress.addressLine1}, ${selectedCustomer.billingAddress.city || 'Bhilai'} - ${selectedCustomer.billingAddress.pincode || '490006'}`;
        setDeliveryAddress(fullAddr);
      } else if (customerType === 'new' && newCustomer.address) {
        setDeliveryAddress(newCustomer.address);
      } else if (addressList.length > 0) {
        setDeliveryAddress(addressList[0] || '');
      } else {
        setDeliveryAddress('');
      }
    }
  }, [deliveryType, currentStore, customerType, selectedCustomer, newCustomer.address, addressList]);

  // Calculations
  const itemsTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const activePackaging = items.length > 0 ? packagingCharge : 0;
  const orderTotal = Math.max(0, itemsTotal - discount + shippingCharge + activePackaging);

  // Customer Filtering
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers.slice(0, 6);
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [customers, searchQuery]);

  const handleSelectCustomer = (c: Customer) => {
    setSelectedCustomer(c);
    if (c.billingAddress?.addressLine1) {
      const fullAddr = `${c.billingAddress.addressLine1}, ${c.billingAddress.city || 'Bhilai'} - ${
        c.billingAddress.pincode || '490006'
      }`;
      setDeliveryAddress(fullAddr);
      setAddressList((prev) => (prev.includes(fullAddr) ? prev : [fullAddr, ...prev]));
    }
    setSearchQuery('');
    setIsSearchOpen(false);
    setIsEditingCustomer(false);
    setErrorMessage(null);
  };

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

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) return;
    const priceNum = parseFloat(customItemPrice) || 0;
    const newItem: OrderItem = {
      id: `custom-${Date.now()}`,
      name: customItemName.trim(),
      variant: customItemVariant.trim() || 'Standard',
      price: priceNum,
      quantity: Math.max(1, customItemQty),
      iconType: 'general',
    };
    handleAddItem(newItem);
    setCustomItemName('');
    setCustomItemVariant('Standard');
    setCustomItemPrice('499');
    setCustomItemQty(1);
  };

  // Filter Catalog Products in Modal
  const modalFilteredProducts = useMemo(() => {
    let prods = catalogProducts;
    if (selectedCategoryFilter !== 'All') {
      prods = prods.filter((p) => p.category === selectedCategoryFilter);
    }
    if (catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase();
      prods = prods.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }
    return prods;
  }, [catalogProducts, selectedCategoryFilter, catalogSearch]);

  const categoriesList = useMemo(() => {
    const setCats = new Set<string>();
    catalogProducts.forEach((p) => {
      if (p.category) setCats.add(p.category);
    });
    return ['All', ...Array.from(setCats)];
  }, [catalogProducts]);

  // Reset order creation form for fresh order
  const handleResetForm = () => {
    setSelectedCustomer(null);
    setNewCustomer({ name: '', phone: '', email: '', address: '' });
    setCustomerType('existing');
    setItems([]);
    setDiscount(0);
    setShippingCharge(0);
    setPackagingCharge(0);
    setOrderNotes('');
    setInternalNotes('');
    setPaymentMode('UPI');
    setDeliveryType('delivery');
    setIsSuccess(false);
    setCreatedOrderId(null);
    setErrorMessage(null);
    regenerateOtp();
  };

  // Order Submission
  const handleCreateOrder = async () => {
    if (items.length === 0) {
      setErrorMessage('Please add at least one item from the catalog or custom creator to generate this order.');
      return;
    }

    let finalCustomerName = '';
    let finalCustomerPhone = '';
    let finalCustomerEmail = '';
    let finalDeliveryAddress = deliveryAddress;

    if (customerType === 'existing') {
      if (!selectedCustomer) {
        setErrorMessage('Please search and select an existing customer, or switch to "New Customer".');
        return;
      }
      finalCustomerName = selectedCustomer.name;
      finalCustomerPhone = selectedCustomer.phone;
      finalCustomerEmail =
        selectedCustomer.email ||
        `${selectedCustomer.name.toLowerCase().replace(/\s+/g, '')}@example.com`;
    } else {
      if (!newCustomer.name.trim() || !newCustomer.phone.trim()) {
        setErrorMessage('Please provide customer name and mobile phone number for the new customer.');
        return;
      }
      if (deliveryType === 'delivery' && !newCustomer.address.trim()) {
        setErrorMessage('Please provide a delivery address for the new customer.');
        return;
      }
      finalCustomerName = newCustomer.name.trim();
      finalCustomerPhone = newCustomer.phone.trim();
      finalCustomerEmail =
        newCustomer.email.trim() ||
        `${newCustomer.name.trim().toLowerCase().replace(/\s+/g, '')}@example.com`;
      if (deliveryType === 'delivery') {
        finalDeliveryAddress = newCustomer.address.trim();
      }

      // Register newly created customer in customerStore Khata
      useCustomerStore.getState().addCustomer({
        name: finalCustomerName,
        phone: finalCustomerPhone,
        email: finalCustomerEmail,
        customerType: 'Individual',
        paymentTerms: 'Immediate',
        creditPeriodDays: 0,
        status: 'active',
        location: 'Bhilai, Chhattisgarh',
        billingAddress: {
          addressLine1: finalDeliveryAddress,
          city: 'Bhilai',
          state: 'Chhattisgarh',
          pincode: '490006',
          country: 'India',
          sameAsShipping: true,
        },
      });
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const initials = finalCustomerName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const nextNum = Math.floor(10330 + Math.random() * 900);
    const assignedOrderNumber = `#ORD-${nextNum}`;

    // Real backend API persistence attempt
    try {
      const storeId = currentStore?._id || currentStore?.id;
      if (storeId) {
        await ordersApi.createOrder({
          storeId,
          items: items.map((i) => ({
            productId: i.id.startsWith('custom-') ? '665544332211009988776655' : i.id,
            sku: i.sku || 'SKU-MANUAL',
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.price,
            storeId,
          })),
          shippingAddress: {
            fullName: finalCustomerName,
            street: finalDeliveryAddress || 'Store Pickup Counter',
            city: 'Bhilai',
            state: 'Chhattisgarh',
            postalCode: '490006',
            country: 'IN',
            phone: finalCustomerPhone.replace(/[^\d+]/g, '').slice(-10) || '9876543210',
          },
          fulfilmentMode: deliveryType === 'delivery' ? 'deliver' : 'pickup',
        });
      }
    } catch (apiErr) {
      console.warn('Backend order creation notice, falling back to instant local store:', apiErr);
    } finally {
      setIsSubmitting(false);
    }

    addManualOrder({
      orderNumber: assignedOrderNumber,
      orderType: deliveryType === 'delivery' ? 'Online Order' : 'Manual In-Store',
      status: 'new',
      customer: {
        name: finalCustomerName,
        email: finalCustomerEmail,
        phone: finalCustomerPhone,
        avatarInitials: initials || 'CU',
      },
      deliveryAddress: {
        street: finalDeliveryAddress || (deliveryType === 'pickup' ? storeAddress : 'Local Bhilai Delivery'),
        locality: 'Bhilai Local Area',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        pincode: '490006',
        fullText: `${finalCustomerName}\n${finalDeliveryAddress || storeAddress}`,
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
        packagingFee: activePackaging,
        deliveryFee: shippingCharge,
        totalAmount: orderTotal,
      },
      payment: {
        status: paymentStatus,
        paymentMethod:
          paymentMode === 'Cash'
            ? 'Cash on Delivery'
            : paymentMode === 'Card'
            ? 'Card / POS'
            : 'Online Paid',
        mode: paymentMode === 'Khata' ? 'Cash' : paymentMode,
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
          sku: i.sku || i.id,
          quantity: i.quantity,
        })),
        assignedOrderNumber.replace('#', ''),
        'manual_order',
        'Manual order created'
      );
    } catch (invErr) {
      console.warn('Inventory sync error on order creation:', invErr);
    }

    setCreatedOrderId(assignedOrderNumber);
    setIsSuccess(true);
  };

  return (
    <div className="space-y-4 w-full pb-12 font-sans animate-in fade-in-50 duration-200">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-1">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-semibold hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders</span>
          </button>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Create Order</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add customer, items and delivery details to create a new manual order.
          </p>
        </div>

        {/* Top Header Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleCreateOrder}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Create Order</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Inline Feedback Banners */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between animate-in fade-in-50 duration-150">
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
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-xs animate-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-900">
                  Order {createdOrderId} Created Successfully!
                </h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Stock has been deducted from inventory and registered to your active orders pipeline.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                View in Orders Pipeline
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="px-3.5 py-2 border border-emerald-300 bg-white text-emerald-800 rounded-xl text-xs font-semibold hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                Create Another Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Top Row: 3 Columns [33.5% | 38% | 28.5%] */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.35fr_1fr] gap-4 items-stretch">
        {/* Card 1: Customer Details */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Customer Details</h2>
              <span className="text-[11px] text-slate-500 font-semibold">
                {customerType === 'existing' ? 'Known Buyer' : 'New Registration'}
              </span>
            </div>

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
                <span className="text-xs font-semibold text-slate-700">New Customer</span>
              </label>
            </div>

            {customerType === 'existing' ? (
              <>
                {/* Customer Search Dropdown */}
                <div ref={searchContainerRef} className="relative mb-3.5">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchOpen(true);
                      }}
                      onFocus={() => setIsSearchOpen(true)}
                      placeholder="Search customer by name, phone or email..."
                      className="w-full pl-8 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Autocomplete Dropdown List with Outside-Click & Escape Dismissal */}
                  {isSearchOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-slate-200 shadow-xl z-30 max-h-56 overflow-y-auto divide-y divide-slate-100">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleSelectCustomer(c)}
                            className="w-full px-3.5 py-2.5 text-left hover:bg-blue-50/50 flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-900">{c.name}</div>
                              <div className="text-[11px] text-slate-500">
                                {c.phone} {c.email ? `• ${c.email}` : ''}
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {c.customerType || 'Customer'}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="p-3.5 text-center text-xs space-y-2">
                          <p className="text-slate-400">No existing customers match "{searchQuery}"</p>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomerType('new');
                              setNewCustomer((prev) => ({ ...prev, name: searchQuery }));
                              setIsSearchOpen(false);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors cursor-pointer text-xs"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Register as New Customer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Customer Card or Clean Empty State */}
                {!selectedCustomer ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-center">
                    <User className="w-7 h-7 text-slate-300 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-slate-700">No Customer Selected</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Search above by name, phone or email, or pick from known buyers below:
                    </p>
                    {customers.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 text-left">
                          Quick Select from Directory:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {customers.slice(0, 3).map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => handleSelectCustomer(c)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 text-[11px] font-bold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span className="text-blue-600 font-black">+</span>
                              <span>{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white relative shadow-2xs">
                    {isEditingCustomer ? (
                      <div className="space-y-2.5">
                        <div className="text-xs font-bold text-slate-900">Edit Customer Information</div>
                        <div>
                          <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                            Customer Name
                          </label>
                          <input
                            type="text"
                            value={selectedCustomer.name}
                            onChange={(e) =>
                              setSelectedCustomer({ ...selectedCustomer, name: e.target.value })
                            }
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            value={selectedCustomer.phone}
                            onChange={(e) =>
                              setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })
                            }
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={selectedCustomer.email || ''}
                            onChange={(e) =>
                              setSelectedCustomer({ ...selectedCustomer, email: e.target.value })
                            }
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
                          {selectedCustomer.name
                            .split(' ')
                            .map((w) => w[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase() || 'CU'}
                        </div>

                        {/* Details */}
                        <div className="space-y-1 min-w-0 pr-16 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs truncate">
                              {selectedCustomer.name}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 leading-tight shrink-0">
                              Verified
                            </span>
                          </div>

                          <div className="text-slate-700 font-semibold text-[11px] flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{selectedCustomer.phone}</span>
                          </div>

                          {selectedCustomer.email && (
                            <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{selectedCustomer.email}</span>
                            </div>
                          )}

                          <div className="text-slate-500 text-[11px] leading-tight pt-0.5 flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{deliveryAddress}</span>
                          </div>
                        </div>

                        {/* Action Buttons: Change & Edit */}
                        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setIsEditingCustomer(true)}
                            className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 bg-white shadow-2xs transition-colors cursor-pointer"
                            title="Edit customer details"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCustomer(null);
                              setSearchQuery('');
                            }}
                            className="px-2 py-0.5 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 text-[10px] font-bold transition-colors cursor-pointer"
                            title="Change customer"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* Inline New Customer Registration Form (Starts completely empty!) */
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/20 space-y-3 shadow-2xs animate-in fade-in-50 duration-150">
                <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5 pb-1 border-b border-blue-100">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>New Customer Information</span>
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 font-semibold block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Agrawal"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold block mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="customer@example.com"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 font-semibold block mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="House/Plot No, Street, Locality, Bhilai - 490006"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Order Items */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Title & Add Item Trigger */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Order Items</h2>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="text-blue-600 inline-flex items-center gap-1 text-xs font-bold hover:underline cursor-pointer"
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
            {items.length === 0 ? (
              <div className="py-7 px-4 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">No items added to this order yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5 mb-3.5 max-w-xs mx-auto">
                  Select products from your catalog or enter custom line items.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setModalTab('catalog');
                      setIsAddModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Browse Store Catalog</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModalTab('custom');
                      setIsAddModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    <span>+ Custom / Ad-hoc Item</span>
                  </button>
                </div>

                {/* Quick Add Shelf from Store Catalog */}
                {catalogProducts.length > 0 && (
                  <div className="pt-3 border-t border-slate-200/80 text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Quick Add Popular Products:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {catalogProducts.slice(0, 4).map((p) => (
                        <div
                          key={p.id}
                          className="p-2 rounded-xl border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-2xs transition-all flex items-center justify-between text-xs group"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-slate-800 truncate text-[11px]">{p.name}</p>
                            <p className="text-[10px] text-slate-400">
                              ₹{p.price.toLocaleString('en-IN')} • {p.stock} in stock
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleAddItem({
                                id: p.id,
                                name: p.name,
                                variant: p.variants?.[0]?.color
                                  ? `${p.variants[0].color} • ${p.variants[0].size || 'M'}`
                                  : 'Standard',
                                price: p.price,
                                quantity: 1,
                                sku: p.sku,
                                image: p.images?.[0],
                                stock: p.stock,
                                iconType: 'tshirt',
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-[11px] transition-colors cursor-pointer shrink-0"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-2.5 grid grid-cols-12 items-center gap-1">
                    {/* Product Details with real thumbnail / icon */}
                    <div className="col-span-5 flex items-center gap-2.5 min-w-0 pr-1">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingBag className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate" title={item.name}>
                          {item.name}
                        </div>
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
            )}
          </div>

          {/* Add More Items Button */}
          <div className="mt-3 pt-1">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="w-full py-2 rounded-xl border border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50 text-blue-600 font-bold text-xs flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add From Catalog / Custom Item</span>
            </button>
          </div>
        </div>

        {/* Card 3: Order Summary & Payment Mode */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Order Summary</h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                GST Included
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium">
                  Items Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </span>
                <span className="font-bold text-slate-900">₹{itemsTotal.toLocaleString('en-IN')}</span>
              </div>

              {/* Editable Discount */}
              <div className="flex justify-between items-center text-slate-700">
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-emerald-600" />
                  <span className="font-medium">Discount (₹)</span>
                </div>
                <div className="w-20">
                  <input
                    type="number"
                    min="0"
                    max={itemsTotal}
                    value={discount === 0 ? '' : discount}
                    placeholder="0"
                    onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg text-right text-xs font-bold text-emerald-600 focus:ring-1 focus:ring-emerald-500 bg-slate-50"
                  />
                </div>
              </div>

              {/* Editable Shipping Charge */}
              <div className="flex justify-between items-center text-slate-700">
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-blue-600" />
                  <span className="font-medium">Delivery Fee</span>
                </div>
                <div className="w-20">
                  <input
                    type="number"
                    min="0"
                    value={shippingCharge === 0 ? '' : shippingCharge}
                    placeholder="0"
                    onChange={(e) => setShippingCharge(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg text-right text-xs font-bold text-slate-900 focus:ring-1 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
              </div>

              {/* Packaging Charge */}
              <div className="flex justify-between items-center text-slate-700">
                <div className="flex items-center gap-1">
                  <Receipt className="w-3 h-3 text-slate-500" />
                  <span className="font-medium">Packaging Fee</span>
                </div>
                <div className="w-20">
                  <input
                    type="number"
                    min="0"
                    value={packagingCharge === 0 ? '' : packagingCharge}
                    placeholder="0"
                    onChange={(e) => setPackagingCharge(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg text-right text-xs font-bold text-slate-900 focus:ring-1 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div className="pt-2 border-t border-slate-100">
                <label className="text-[11px] font-bold text-slate-800 block mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'UPI', label: 'UPI / Online', icon: Wallet },
                    { id: 'Cash', label: 'Cash / COD', icon: Banknote },
                    { id: 'Card', label: 'POS Card', icon: CreditCard },
                    { id: 'Khata', label: 'Khata (Credit)', icon: Receipt },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = paymentMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMode(m.id as any)}
                        className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-3 h-3 shrink-0" />
                        <span className="text-[11px] truncate">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
                  <span>Settlement Status:</span>
                  <span
                    className={`font-bold ${
                      paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    ● {paymentStatus === 'Paid' ? 'Paid' : 'Pending (Collect on Handshake)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Total at bottom of Card 3 */}
          <div className="pt-3 border-t border-slate-100 mt-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Grand Total</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Inclusive of GST & fees</p>
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">
                ₹{orderTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Delivery Details [71.5%] | Order Notes [28.5%] */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.55fr_1fr] gap-4 items-stretch">
        {/* Card 4: Delivery Details */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Delivery & Handshake Logistics</h2>
              <span className="text-[11px] font-semibold text-slate-500">
                {deliveryType === 'delivery' ? '3–4 km Hyperlocal Radius' : 'Store Counter Handover'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Delivery Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">Fulfillment Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        deliveryType === 'delivery'
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === 'delivery'}
                        onChange={() => setDeliveryType('delivery')}
                        className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-xs">Doorstep Delivery</span>
                    </label>

                    <label
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        deliveryType === 'pickup'
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === 'pickup'}
                        onChange={() => setDeliveryType('pickup')}
                        className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <Store className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-xs">Counter Pickup</span>
                    </label>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      {deliveryType === 'delivery' ? 'Delivery Address' : 'Pickup Counter Address'}
                    </label>
                    {deliveryType === 'delivery' && (
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(!isAddingAddress)}
                        className="text-blue-600 text-[11px] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isAddingAddress ? 'Cancel' : 'Add New Address'}</span>
                      </button>
                    )}
                  </div>

                  {isAddingAddress && (
                    <div className="mb-2 p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                      <input
                        type="text"
                        placeholder="Enter house, street, locality, Bhilai..."
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

                  {deliveryType === 'delivery' ? (
                    customerType === 'new' ? (
                      <div className="p-2.5 bg-blue-50/40 border border-blue-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>Destination Address</span>
                          </span>
                          <span className="text-[10px] text-blue-600 font-bold bg-white px-1.5 py-0.5 rounded border border-blue-200">
                            From Registration
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium">
                          {newCustomer.address.trim() || (
                            <span className="italic text-slate-400">
                              Please enter customer address in the registration form above.
                            </span>
                          )}
                        </p>
                      </div>
                    ) : !selectedCustomer ? (
                      <div className="p-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs flex items-center gap-2 text-amber-800">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Select a customer above to view their delivery address, or add an address below.</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <select
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-slate-900 outline-none appearance-none bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
                        >
                          {addressList.length > 0 ? (
                            addressList.map((addr) => (
                              <option key={addr} value={addr}>
                                {addr}
                              </option>
                            ))
                          ) : (
                            <option value="">No address on file for this customer</option>
                          )}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    )
                  ) : (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{storeAddress}</span>
                    </div>
                  )}
                </div>

                {/* Delivery Partner */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Delivery Partner / Dispatch
                  </label>
                  <div className="relative">
                    <select
                      value={deliveryPartner}
                      onChange={(e) => setDeliveryPartner(e.target.value)}
                      disabled={deliveryType === 'pickup'}
                      className="w-full border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-800 outline-none appearance-none bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer disabled:bg-slate-100 disabled:text-slate-500"
                    >
                      <option value={`${branding.appName} Hyperlocal Rider (30-45 mins express)`}>
                        {branding.appName} Hyperlocal Rider (30–45 mins express)
                      </option>
                      <option value="In-House Delivery Staff">Self / In-House Delivery Staff</option>
                      <option value="Delhivery Local Express">Delhivery Local Express</option>
                      <option value="Shadowfax Hyperlocal">Shadowfax Hyperlocal</option>
                      {deliveryType === 'pickup' && (
                        <option value="In-Store Customer Pickup">In-Store Customer Pickup</option>
                      )}
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
                    Order Scheduled Date
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
                    Preferred Time Slot
                  </label>
                  <div className="relative">
                    <select
                      value={deliveryTimeSlot}
                      onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-900 font-medium outline-none appearance-none bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
                    >
                      <option value="Immediate (30-45 mins express)">
                        Immediate (30–45 mins express)
                      </option>
                      <option value="Morning (9:00 AM - 12:00 PM)">
                        Morning (9:00 AM - 12:00 PM)
                      </option>
                      <option value="Afternoon (12:00 PM - 3:00 PM)">
                        Afternoon (12:00 PM - 3:00 PM)
                      </option>
                      <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Order OTP with Regenerate Action */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      Handshake OTP{' '}
                      <span className="font-normal text-slate-400">(Verification Code)</span>
                    </label>
                    <button
                      type="button"
                      onClick={regenerateOtp}
                      className="text-blue-600 hover:text-blue-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      title="Generate new 4-digit OTP"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Refresh</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={otp}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs bg-slate-50 tracking-widest font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Customer provides this 4-digit code to complete doorstep delivery or pickup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Order Notes */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col justify-between text-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3">
              Order Notes <span className="font-normal text-slate-400">(Optional)</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-800 text-xs mb-1">
                  Customer Instructions
                </label>
                <textarea
                  rows={3}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Please ring bell twice, call before arrival..."
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none resize-none focus:ring-1 focus:ring-blue-500 shadow-2xs bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 text-xs mb-1">
                  Internal Merchant Note{' '}
                  <span className="font-normal text-slate-400">(Staff Only)</span>
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Verified customer on phone, VIP buyer..."
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none resize-none focus:ring-1 focus:ring-blue-500 shadow-2xs bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Total & Action Bar */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-baseline gap-4">
          <span className="font-bold text-slate-800 text-xs">Order Total Payable:</span>
          <span className="font-black text-slate-900 text-2xl tracking-tight">
            ₹{orderTotal.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            ({items.reduce((acc, i) => acc + i.quantity, 0)} items · {paymentMode} · {paymentStatus})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleCreateOrder}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Creating Order...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Place Order</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5. Comprehensive Add Item Modal (Catalog & Custom Tabs) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-10 p-5 space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Add Item to Order</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <button
                type="button"
                onClick={() => setModalTab('catalog')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  modalTab === 'catalog'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                From Store Catalog ({catalogProducts.length})
              </button>
              <button
                type="button"
                onClick={() => setModalTab('custom')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  modalTab === 'custom'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                + Custom / Ad-hoc Item
              </button>
            </div>

            {modalTab === 'catalog' ? (
              <div className="space-y-3">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search store catalog by title, SKU, brand..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    {categoriesList.slice(0, 4).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer ${
                          selectedCategoryFilter === cat
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Catalog Products List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs pr-1">
                  {modalFilteredProducts.length > 0 ? (
                    modalFilteredProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                            {prod.images?.[0] ? (
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ShoppingBag className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">{prod.name}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                                {prod.sku}
                              </span>
                              <span>·</span>
                              <span className="text-emerald-700 font-semibold">
                                {prod.stock} in stock
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-black text-slate-900 text-xs">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleAddItem({
                                id: prod.id,
                                name: prod.name,
                                variant: prod.variants?.[0]?.color
                                  ? `${prod.variants[0].color} • ${prod.variants[0].size || 'M'}`
                                  : 'Standard',
                                price: prod.price,
                                quantity: 1,
                                sku: prod.sku,
                                image: prod.images?.[0],
                                stock: prod.stock,
                                iconType: 'tshirt',
                              })
                            }
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-400">
                      No catalog products found matching "{catalogSearch}".
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Custom / Ad-hoc Item Form */
              <form onSubmit={handleAddCustomItem} className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Item Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Custom Silk Scarf, Alteration Service..."
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Variant / Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Size L • Red"
                      value={customItemVariant}
                      onChange={(e) => setCustomItemVariant(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Unit Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="any"
                      placeholder="499"
                      value={customItemPrice}
                      onChange={(e) => setCustomItemPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={customItemQty}
                      onChange={(e) => setCustomItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Add Custom Item
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
