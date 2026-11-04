import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Barcode,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  QrCode,
  User,
  Phone,
  ArrowLeft,
  Sparkles,
  Zap,
  Percent,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Check,
  X,
  FileCheck,
  Coins,
  ShieldCheck,
  PlusCircle,
  Edit2,
  MapPin,
  Clock,
} from 'lucide-react';
import { useCatalogStore, ProductItem } from '../../stores/catalogStore.js';
import { useInventoryStore } from '../../stores/inventoryStore.js';
import { useBillingStore, IInvoice, IInvoiceItem } from '../../stores/billingStore.js';
import { useCustomerStore, Customer } from '../../stores/customerStore.js';
import { PrintReceiptModal } from './PrintReceiptModal.js';
import { INDIAN_STATES, DEFAULT_INDIAN_STATE } from '@repo/shared-types';

interface CounterPOSViewProps {
  onBack?: () => void;
}

export const CounterPOSView: React.FC<CounterPOSViewProps> = ({ onBack }) => {
  const { products: catalogProducts } = useCatalogStore();
  const { items: inventoryItems } = useInventoryStore();
  const { completePOSSale, invoices, settings } = useBillingStore();
  const { customers, addCustomer } = useCustomerStore();

  // Unified available POS items (prefers catalog products with pricing, merges inventory)
  const posProducts = useMemo(() => {
    if (catalogProducts && catalogProducts.length > 0) {
      return catalogProducts;
    }
    return inventoryItems.map((inv) => ({
      id: inv.id,
      name: inv.name,
      sku: inv.sku,
      barcode: inv.barcode || inv.sku,
      category: inv.category,
      subCategory: inv.subcategory,
      productType: inv.productType,
      brand: inv.brand,
      stock: inv.stock,
      lowStockThreshold: 5,
      status: inv.status === 'out_of_stock' ? ('out_of_stock' as const) : ('active' as const),
      price: inv.stock > 0 ? Math.round(inv.stockValue / inv.stock) : 100,
      images: inv.imageUrl ? [inv.imageUrl] : [],
      attributes: {},
      storageLocation: { warehouse: 'Main' },
      tax: { category: 'Standard', rate: 18, inclusive: false },
      updatedAt: inv.lastUpdated,
    }));
  }, [catalogProducts, inventoryItems]);

  // POS State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cartItems, setCartItems] = useState<IInvoiceItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Unified Mode: Retail (B2C) vs Formal GST Tax Invoice (B2B)
  const [invoiceMode, setInvoiceMode] = useState<'retail' | 'b2b'>('retail');
  const [isB2BDrawerOpen, setIsB2BDrawerOpen] = useState<boolean>(false);

  // Customer Context
  const [customerMode, setCustomerMode] = useState<'walkin' | 'existing' | 'new'>('walkin');
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState<boolean>(false);

  // Customer Form Fields
  const [customerName, setCustomerName] = useState<string>('Walk-in Retail Customer');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [customerGstin, setCustomerGstin] = useState<string>('');
  const [customerState, setCustomerState] = useState<string>(DEFAULT_INDIAN_STATE);

  // B2B & Tax Compliance Details
  const [invoiceType, setInvoiceType] = useState<'Tax Invoice' | 'Bill of Supply'>('Tax Invoice');
  const [placeOfSupply, setPlaceOfSupply] = useState<string>(() => settings?.state || DEFAULT_INDIAN_STATE);
  const [paymentTerms, setPaymentTerms] = useState<string>('Immediate');
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0] || '';
  });
  const [invoiceNotes, setInvoiceNotes] = useState<string>('');
  const [referenceNo, setReferenceNo] = useState<string>('');

  // Settlement Context
  const [settlementMode, setSettlementMode] = useState<'cash' | 'upi' | 'card' | 'credit'>('cash');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [isPartialPayment, setIsPartialPayment] = useState<boolean>(false);
  const [partialPaidAmount, setPartialPaidAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Modals & Popovers
  const [lastInvoiceForPrint, setLastInvoiceForPrint] = useState<IInvoice | null>(null);
  const [printFormatMode, setPrintFormatMode] = useState<'thermal-80mm' | 'a4-tax-invoice'>('thermal-80mm');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isClearRegisterConfirmOpen, setIsClearRegisterConfirmOpen] = useState<boolean>(false);
  
  // Custom Non-Catalog Item Dialog
  const [isCustomItemModalOpen, setIsCustomItemModalOpen] = useState<boolean>(false);
  const [customItemName, setCustomItemName] = useState<string>('');
  const [customItemRate, setCustomItemRate] = useState<number>(100);
  const [customItemHsn, setCustomItemHsn] = useState<string>('9987');
  const [customItemQty, setCustomItemQty] = useState<number>(1);

  // Editable Price in Cart
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingRate, setEditingRate] = useState<string>('');

  // Search input ref
  const searchInputRef = useRef<HTMLInputElement>(null);
  const customerDropdownRef = useRef<HTMLDivElement>(null);

  // Audio Beep Generator for Barcode / Scan events
  const playScanChime = (freq = 880, duration = 0.08) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // AudioContext not allowed before user interaction
    }
  };

  // Auto-calculate Due Date based on Payment Terms
  useEffect(() => {
    const now = new Date();
    let daysToAdd = 0;
    if (paymentTerms === '7 Days') daysToAdd = 7;
    else if (paymentTerms === '15 Days') daysToAdd = 15;
    else if (paymentTerms === '30 Days') daysToAdd = 30;
    else if (paymentTerms === '45 Days') daysToAdd = 45;
    else if (paymentTerms === '60 Days') daysToAdd = 60;

    now.setDate(now.getDate() + daysToAdd);
    setDueDate(now.toISOString().split('T')[0] || '');
  }, [paymentTerms]);

  // Handle outside click for customer dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(e.target as Node)) {
        setIsCustomerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard Shortcuts (F2: Thermal, Ctrl+P: A4, F3 / Ctrl+K: Focus Search)
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // F2 hotkey: Quick Charge & Print Thermal Slip
      if (e.key === 'F2') {
        e.preventDefault();
        handleCheckout('thermal-80mm');
        return;
      }

      // Ctrl+P / Cmd+P hotkey inside register: Charge & Print A4 Invoice
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        if (cartItems.length > 0) {
          e.preventDefault();
          handleCheckout('a4-tax-invoice');
          return;
        }
      }

      // F3 or Ctrl+K: Focus search
      if (e.key === 'F3' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Hardware barcode scanner detection
      const now = Date.now();
      const diff = now - lastKeyTime;
      lastKeyTime = now;

      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === 'Enter') {
        if (buffer.length >= 3 && diff < 80) {
          e.preventDefault();
          handleBarcodeScanned(buffer);
          buffer = '';
        } else if (!isInput && buffer.length >= 3) {
          handleBarcodeScanned(buffer);
          buffer = '';
        }
        return;
      }

      if (e.key.length === 1) {
        if (diff > 120 && isInput) {
          buffer = e.key;
        } else {
          buffer += e.key;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartItems, posProducts, customerName, customerPhone, customerGstin, placeOfSupply]);

  const handleBarcodeScanned = (code: string) => {
    const clean = code.toLowerCase().trim();
    const matched = posProducts.find(
      (p) =>
        (p.barcode && p.barcode.toLowerCase() === clean) ||
        (p.sku && p.sku.toLowerCase() === clean) ||
        p.id.toLowerCase() === clean
    );

    if (matched) {
      playScanChime(1046, 0.1);
      addToCart(matched);
      showNotification(`Scanned: ${matched.name} (+1)`, 'success');
    } else {
      playScanChime(300, 0.2);
      showNotification(`Unrecognized barcode: "${code}"`, 'error');
    }
  };

  const showNotification = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Add Item to Bill Register
  const addToCart = (product: ProductItem | any) => {
    playScanChime(880, 0.05);
    setCartItems((prev) => {
      const existing = prev.find((it) => it.productId === product.id);
      if (existing) {
        return prev.map((it) =>
          it.productId === product.id
            ? { ...it, quantity: it.quantity + 1, amount: (it.quantity + 1) * it.rate }
            : it
        );
      }
      const unitRate = product.price || 100;
      return [
        ...prev,
        {
          id: 'pos-it-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          productId: product.id,
          name: product.name,
          hsnSac: product.hsnCode || '85171300',
          quantity: 1,
          rate: unitRate,
          discountPercent: 0,
          taxPercent: 18,
          amount: unitRate,
          unit: 'Pcs',
        },
      ];
    });
  };

  // Add Custom / Non-Catalog Item to Register
  const handleAddCustomItem = () => {
    if (!customItemName.trim()) {
      showNotification('Please enter an item or service name', 'error');
      return;
    }
    const rate = Math.max(0, customItemRate || 0);
    const qty = Math.max(1, customItemQty || 1);
    const newItem: IInvoiceItem = {
      id: 'custom-it-' + Date.now(),
      productId: 'custom-' + Date.now(),
      name: customItemName.trim(),
      hsnSac: customItemHsn.trim() || '9987',
      quantity: qty,
      rate,
      discountPercent: 0,
      taxPercent: 18,
      amount: rate * qty,
      unit: 'Pcs',
    };

    setCartItems((prev) => [...prev, newItem]);
    playScanChime(987, 0.08);
    showNotification(`Added custom item: ${newItem.name}`, 'success');
    setIsCustomItemModalOpen(false);
    setCustomItemName('');
    setCustomItemRate(100);
    setCustomItemQty(1);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.id !== id) return it;
          const newQty = Math.max(1, it.quantity + delta);
          return { ...it, quantity: newQty, amount: newQty * it.rate };
        })
        .filter((it) => it.quantity > 0)
    );
  };

  // On-the-fly Price Edit
  const handleSaveRateEdit = (id: string) => {
    const parsed = parseFloat(editingRate);
    if (!isNaN(parsed) && parsed >= 0) {
      setCartItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, rate: parsed, amount: it.quantity * parsed } : it
        )
      );
      playScanChime(1046, 0.06);
    }
    setEditingItemId(null);
    setEditingRate('');
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  };

  const clearRegister = () => {
    if (cartItems.length === 0) return;
    setIsClearRegisterConfirmOpen(true);
  };

  const confirmClearRegister = () => {
    setCartItems([]);
    setCashTendered(0);
    setDiscountPercent(0);
    setIsPartialPayment(false);
    setPartialPaidAmount(0);
    setIsClearRegisterConfirmOpen(false);
    showNotification('Bill register cleared', 'info');
  };

  // Filter Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    posProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [posProducts]);

  // Filter Products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return posProducts.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.barcode && p.barcode.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [posProducts, searchQuery, selectedCategory]);

  // Deduplicate and filter Customers for Autocomplete
  const filteredCustomerList = useMemo(() => {
    const q = customerSearch.toLowerCase().trim();
    if (!q) return customers.slice(0, 8);
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.displayName && c.displayName.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [customers, customerSearch]);

  // Select Existing Customer
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setCustomerGstin(customer.gstin || '');
    setCustomerAddress(customer.billingAddress?.addressLine1 || customer.location || '');
    setCustomerState(customer.billingAddress?.state || DEFAULT_INDIAN_STATE);
    setIsCustomerDropdownOpen(false);
    setCustomerSearch('');

    // If customer has a GSTIN, auto-prompt/enable B2B mode
    if (customer.gstin) {
      setInvoiceMode('b2b');
      setIsB2BDrawerOpen(true);
      showNotification(`Loaded B2B Profile: ${customer.name} (GSTIN: ${customer.gstin})`, 'info');
    } else {
      showNotification(`Customer Selected: ${customer.name}`, 'info');
    }
  };

  // Indian GST Calculation Math (Intra-state CGST+SGST vs Inter-state IGST)
  const isInterState = useMemo(() => {
    const storeState = settings?.state || DEFAULT_INDIAN_STATE;
    return placeOfSupply !== storeState;
  }, [placeOfSupply, settings?.state]);

  const subTotal = cartItems.reduce((sum, it) => sum + it.quantity * it.rate, 0);
  const discountAmount = Math.round(((subTotal * discountPercent) / 100) * 100) / 100;
  const taxableAmount = Math.max(0, subTotal - discountAmount);

  const cgstAmount = isInterState ? 0 : Math.round(taxableAmount * 0.09 * 100) / 100;
  const sgstAmount = isInterState ? 0 : Math.round(taxableAmount * 0.09 * 100) / 100;
  const igstAmount = isInterState ? Math.round(taxableAmount * 0.18 * 100) / 100 : 0;
  const taxTotal = Math.round((cgstAmount + sgstAmount + igstAmount) * 100) / 100;

  const exactGrandTotal = taxableAmount + taxTotal;
  const netPayable = Math.round(exactGrandTotal);
  const roundOff = Number((netPayable - exactGrandTotal).toFixed(2));

  // Partial Payment & Due Calculation
  const actualPaidAmount = useMemo(() => {
    if (settlementMode === 'credit') return 0;
    if (isPartialPayment) return Math.min(netPayable, Math.max(0, partialPaidAmount));
    return netPayable;
  }, [settlementMode, isPartialPayment, partialPaidAmount, netPayable]);

  const actualDueAmount = Math.max(0, netPayable - actualPaidAmount);

  // Change Return Calculation
  const changeDue = settlementMode === 'cash' && cashTendered > netPayable ? cashTendered - netPayable : 0;

  // Unified Checkout Handler
  const handleCheckout = async (targetPrintFormat: 'thermal-80mm' | 'a4-tax-invoice' | null = 'thermal-80mm') => {
    if (cartItems.length === 0) {
      showNotification('Bill register is empty. Please add items to proceed.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const isWalkIn = customerMode === 'walkin';
      const customerFinalName = isWalkIn ? 'Walk-in Retail Customer' : customerName.trim() || 'Retail Customer';

      // If B2B mode with custom GSTIN, clean and uppercase
      const cleanGstin = customerGstin ? customerGstin.trim().toUpperCase() : undefined;

      const result = await completePOSSale({
        customerName: customerFinalName,
        customerPhone: isWalkIn ? '' : customerPhone,
        customerGstin: cleanGstin,
        customerAddress: isWalkIn ? undefined : customerAddress || undefined,
        state: isWalkIn ? DEFAULT_INDIAN_STATE : customerState,
        placeOfSupply,
        paymentTerms,
        dueDate,
        notes: invoiceNotes || undefined,
        invoiceType: invoiceType === 'Bill of Supply' ? 'bill_of_supply' : 'tax_invoice',
        paidAmount: actualPaidAmount,
        dueAmount: actualDueAmount,
        items: cartItems,
        settlementMode: settlementMode === 'credit' ? 'bank_transfer' : settlementMode,
        tenderedCashAmount: settlementMode === 'cash' ? (cashTendered || netPayable) : undefined,
        changeReturnAmount: changeDue,
        paperSize: targetPrintFormat === 'a4-tax-invoice' ? 'a4' : '80mm',
        discountPercent,
      });

      playScanChime(1318, 0.15); // Celebration E beep
      showNotification(`Invoice ${result.invoice.invoiceNo} Recorded Successfully!`, 'success');

      // Reset Bill & Register
      setCartItems([]);
      setCashTendered(0);
      setDiscountPercent(0);
      setIsPartialPayment(false);
      setPartialPaidAmount(0);

      // Open Print Modal if print format requested
      if (targetPrintFormat) {
        setLastInvoiceForPrint(result.invoice);
        setPrintFormatMode(targetPrintFormat);
        setIsPrintModalOpen(true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error processing transaction', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 min-h-[calc(100vh-140px)]">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : notification.type === 'error'
              ? 'bg-rose-600 text-white border-rose-500'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4 text-blue-400" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* LEFT COLUMN: VISUAL CATALOG, QUICK ADD & BARCODE SCANNER   */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                title="Back to Invoices"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  In-House Counter POS
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <Zap className="w-3 h-3 fill-current text-emerald-600" />
                  Live Register
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Scan barcode with handheld scanner or click items to add to bill.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Non-Catalog Item CTA */}
            <button
              type="button"
              onClick={() => setIsCustomItemModalOpen(true)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>+ Quick Item / Service</span>
            </button>

            {/* Hardware Scanner Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50/80 border border-blue-200/60 rounded-xl text-blue-700 text-xs font-bold">
              <Barcode className="w-4 h-4" />
              <span>Scanner Ready</span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const q = searchQuery.trim().toLowerCase();
                  if (!q) return;
                  const matched = posProducts.find(
                    (p) =>
                      (p.barcode && p.barcode.toLowerCase() === q) ||
                      (p.sku && p.sku.toLowerCase() === q) ||
                      p.id.toLowerCase() === q ||
                      p.name.toLowerCase().includes(q)
                  );
                  if (matched && matched.stock > 0) {
                    playScanChime(1046, 0.1);
                    addToCart(matched);
                    showNotification(`Added: ${matched.name}`, 'success');
                    setSearchQuery('');
                  } else if (matched && matched.stock <= 0) {
                    playScanChime(300, 0.2);
                    showNotification(`${matched.name} is out of stock`, 'error');
                  } else {
                    playScanChime(300, 0.2);
                    showNotification(`No product matched "${searchQuery}"`, 'error');
                  }
                }
              }}
              placeholder="Search products by title, SKU, or type barcode... (Press Enter to add, F3 / Ctrl+K)"
              className="w-full pl-10 pr-20 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              F3
            </span>
          </div>

          {/* Category Chips Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-320px)]">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Barcode className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">No matching products found</p>
              <p className="text-xs text-slate-400">Try adjusting your search query or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock <= 0;
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => addToCart(p)}
                    className={`relative p-3 rounded-xl border text-left flex flex-col justify-between transition-all group ${
                      isOutOfStock
                        ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200'
                        : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md active:scale-98 cursor-pointer'
                    }`}
                  >
                    <div>
                      {/* Image / Icon container */}
                      <div className="w-full h-24 rounded-lg bg-slate-100 mb-2 overflow-hidden flex items-center justify-center border border-slate-100">
                        {p.images && p.images[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <ShoppingCart className="w-6 h-6 text-slate-300" />
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                        {p.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        SKU: {p.sku || p.barcode || 'N/A'}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs font-black text-slate-900">
                        ₹{(p.price || 0).toLocaleString('en-IN')}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isOutOfStock
                            ? 'bg-red-100 text-red-700'
                            : p.stock <= 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isOutOfStock ? '0 Stock' : `${p.stock} left`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* RIGHT COLUMN: UNIFIED REGISTER & ADVANCED INVOICING STATION */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[460px] bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden shrink-0">
        {/* Register Top Header: Mode Switcher */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white tracking-wide uppercase">
              Active Register ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </h3>
          </div>

          {/* Unified Mode Toggle: Retail vs GST B2B */}
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => {
                setInvoiceMode('retail');
                setIsB2BDrawerOpen(false);
              }}
              className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${
                invoiceMode === 'retail'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Retail (B2C)
            </button>
            <button
              type="button"
              onClick={() => {
                setInvoiceMode('b2b');
                setIsB2BDrawerOpen(true);
              }}
              className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors flex items-center gap-1 ${
                invoiceMode === 'b2b'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Tax Invoice (B2B)</span>
            </button>
          </div>
        </div>

        {/* Customer Header & CRM Selector */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Customer Mode:</span>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setCustomerMode('walkin');
                  setSelectedCustomer(null);
                  setCustomerName('Walk-in Retail Customer');
                  setCustomerPhone('');
                  setCustomerGstin('');
                  setCustomerAddress('');
                }}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${
                  customerMode === 'walkin' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Walk-in
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomerMode('existing');
                  setIsCustomerDropdownOpen(true);
                }}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${
                  customerMode === 'existing' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Store Buyer / Khata
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomerMode('new');
                  setSelectedCustomer(null);
                  setCustomerName('');
                  setCustomerPhone('');
                }}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${
                  customerMode === 'new' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                + New
              </button>
            </div>
          </div>

          {/* Autocomplete Customer Selector */}
          {customerMode === 'existing' && (
            <div className="relative" ref={customerDropdownRef}>
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={selectedCustomer ? `${selectedCustomer.name} (${selectedCustomer.phone})` : customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setSelectedCustomer(null);
                      setIsCustomerDropdownOpen(true);
                    }}
                    onFocus={() => setIsCustomerDropdownOpen(true)}
                    placeholder="Type buyer name or 10-digit mobile..."
                    className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:ring-1 focus:ring-blue-500"
                  />
                  {selectedCustomer && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCustomer(null);
                        setCustomerSearch('');
                        setIsCustomerDropdownOpen(true);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Customer Dropdown Results */}
              {isCustomerDropdownOpen && !selectedCustomer && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-30 max-h-52 overflow-y-auto divide-y divide-slate-100">
                  {filteredCustomerList.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-400">
                      No matching store buyer. Click <b>+ New</b> to add.
                    </div>
                  ) : (
                    filteredCustomerList.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCustomer(c)}
                        className="w-full p-2.5 text-left hover:bg-blue-50/60 flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <p className="font-bold text-slate-900 leading-snug">{c.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{c.phone}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              c.outstandingAmount > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {c.outstandingAmount > 0 ? `₹${c.outstandingAmount} due` : 'Khata Clean'}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* New Customer Inline Entry */}
          {customerMode === 'new' && (
            <div className="grid grid-cols-2 gap-2 pt-1 animate-in fade-in duration-150">
              <input
                type="text"
                placeholder="Buyer / Company Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              />
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Phone (10 digits) *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
              />
            </div>
          )}
        </div>

        {/* 🏢 Formal GST / B2B Compliance Accordion (When B2B is Active) */}
        {(invoiceMode === 'b2b' || customerGstin) && (
          <div className="bg-purple-50/60 border-b border-purple-200/80 p-3 space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-600" />
                <span>GST Tax Invoice Details</span>
              </span>
              <button
                type="button"
                onClick={() => setIsB2BDrawerOpen(!isB2BDrawerOpen)}
                className="text-[10px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-0.5"
              >
                <span>{isB2BDrawerOpen ? 'Collapse' : 'Expand'}</span>
                {isB2BDrawerOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {isB2BDrawerOpen && (
              <div className="space-y-2 pt-1 text-xs">
                {/* GSTIN & Invoice Type */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-purple-900 block mb-0.5">
                      Buyer GSTIN (Optional)
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="e.g. 22AAAAA0000A1Z5"
                      value={customerGstin}
                      onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())}
                      className="w-full px-2 py-1 text-xs rounded border border-purple-200 bg-white font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-purple-900 block mb-0.5">
                      Invoice Type
                    </label>
                    <select
                      value={invoiceType}
                      onChange={(e) => setInvoiceType(e.target.value as any)}
                      className="w-full px-2 py-1 text-xs rounded border border-purple-200 bg-white"
                    >
                      <option value="Tax Invoice">Tax Invoice (Regular GST)</option>
                      <option value="Bill of Supply">Bill of Supply (Composition)</option>
                    </select>
                  </div>
                </div>

                {/* Place of Supply & Tax Breakup Indicator */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-purple-900 block mb-0.5">
                      Place of Supply (POS)
                    </label>
                    <select
                      value={placeOfSupply}
                      onChange={(e) => setPlaceOfSupply(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-purple-200 bg-white"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st.code} value={st.label}>
                          {st.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-purple-900 block mb-0.5">
                      Payment Terms
                    </label>
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-purple-200 bg-white"
                    >
                      <option value="Immediate">Immediate / Due upon Receipt</option>
                      <option value="7 Days">Net 7 Days</option>
                      <option value="15 Days">Net 15 Days</option>
                      <option value="30 Days">Net 30 Days</option>
                      <option value="45 Days">Net 45 Days</option>
                      <option value="60 Days">Net 60 Days</option>
                    </select>
                  </div>
                </div>

                {/* Billing Address if B2B */}
                <div>
                  <input
                    type="text"
                    placeholder="Buyer Billing Address / Shop Details..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded border border-purple-200 bg-white"
                  />
                </div>

                {/* Tax Split Tag */}
                <div className="text-[10px] text-purple-700 bg-purple-100/70 p-1.5 rounded flex items-center justify-between">
                  <span>
                    GST Treatment: <b>{isInterState ? 'Inter-State (IGST 18%)' : 'Intra-State (CGST 9% + SGST 9%)'}</b>
                  </span>
                  <span>Due Date: <b>{dueDate}</b></span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Item Rows in Cart */}
        <div className="flex-1 p-3 overflow-y-auto divide-y divide-slate-100 min-h-[160px] max-h-[260px]">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <ShoppingCart className="w-7 h-7 mx-auto text-slate-300 mb-1.5" />
              <p className="text-xs font-semibold text-slate-600">Register is empty</p>
              <p className="text-[10px] text-slate-400">Click items on the left or scan a barcode</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="py-2 flex items-center justify-between gap-2 group">
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{item.name}</h5>
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1 rounded">
                      HSN: {item.hsnSac || '8517'}
                    </span>
                  </div>

                  {/* Inline Price Editor */}
                  {editingItemId === item.id ? (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[11px] font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        value={editingRate}
                        onChange={(e) => setEditingRate(e.target.value)}
                        className="w-16 px-1.5 py-0.5 text-xs font-mono font-bold rounded border border-blue-500 bg-white"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveRateEdit(item.id)}
                        className="p-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingItemId(null)}
                        className="p-1 rounded bg-slate-200 text-slate-600 hover:bg-slate-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItemId(item.id);
                          setEditingRate(item.rate.toString());
                        }}
                        className="hover:text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                        title="Click to override rate"
                      >
                        <span>₹{item.rate.toFixed(2)}</span>
                        <Edit2 className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100 text-blue-600" />
                      </button>
                      <span>× {item.quantity} =</span>
                      <span className="font-bold text-slate-800">₹{item.amount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Stepper Buttons */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 rounded text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center font-bold text-xs text-slate-900 font-mono">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 rounded text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Calculation & Settlement Station */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/90 space-y-2.5">
          {/* Discount Presets */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-blue-600" />
              <span>Bill Discount:</span>
            </span>
            <div className="flex items-center gap-1">
              {[0, 5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDiscountPercent(pct)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    discountPercent === pct
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Math Breakup */}
          <div className="space-y-1 text-xs border-y border-slate-200/80 py-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono">₹{subTotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({discountPercent}%):</span>
                <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            {isInterState ? (
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>IGST (18%):</span>
                <span className="font-mono">₹{igstAmount.toFixed(2)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>CGST (9%):</span>
                  <span className="font-mono">₹{cgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>SGST (9%):</span>
                  <span className="font-mono">₹{sgstAmount.toFixed(2)}</span>
                </div>
              </>
            )}

            {roundOff !== 0 && (
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Round Off:</span>
                <span className="font-mono">
                  {roundOff > 0 ? `+₹${roundOff.toFixed(2)}` : `-₹${Math.abs(roundOff).toFixed(2)}`}
                </span>
              </div>
            )}

            <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-200">
              <span>Net Payable:</span>
              <span className="font-mono text-blue-700">₹{netPayable.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Mode Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <label className="font-bold text-slate-700">Payment Mode:</label>
              {/* Partial Payment Toggle */}
              <button
                type="button"
                onClick={() => {
                  const next = !isPartialPayment;
                  setIsPartialPayment(next);
                  if (next) setPartialPaidAmount(Math.round(netPayable / 2));
                }}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                  isPartialPayment
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {isPartialPayment ? '✓ Split / Partial Active' : '+ Split / Partial Khata'}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'cash', label: 'Cash', icon: Banknote },
                { id: 'upi', label: 'UPI / QR', icon: QrCode },
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'credit', label: 'Khata Credit', icon: User },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = settlementMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSettlementMode(m.id as any);
                      if (m.id === 'cash') setCashTendered(netPayable);
                    }}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[10px]">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Partial Payment Breakdown */}
          {isPartialPayment && settlementMode !== 'credit' && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-900">Paid Now:</span>
                <input
                  type="number"
                  value={partialPaidAmount || ''}
                  onChange={(e) => setPartialPaidAmount(Number(e.target.value))}
                  className="w-24 text-right font-mono font-bold text-xs p-1 rounded border border-amber-300 bg-white"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 pt-1 border-t border-amber-200/80">
                <span>Khata Balance Due:</span>
                <span className="font-mono">₹{actualDueAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Quick Cash Presets if Mode is Cash */}
          {settlementMode === 'cash' && (
            <div className="p-2 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-semibold">Cash Tendered:</span>
                <input
                  type="number"
                  value={cashTendered || ''}
                  onChange={(e) => setCashTendered(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-24 text-right font-mono font-bold text-xs p-1 rounded border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Preset Cash Buttons */}
              <div className="flex flex-wrap gap-1">
                {[netPayable, 500, 1000, 2000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCashTendered(preset)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-mono font-bold text-slate-700"
                  >
                    {preset === netPayable ? 'Exact' : `₹${preset}`}
                  </button>
                ))}
              </div>

              {/* Change Return Alert */}
              {changeDue > 0 && (
                <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs font-bold">
                  <span>Change to Return:</span>
                  <span className="font-mono text-xs">₹{changeDue.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {/* Dynamic Counter UPI QR */}
          {settlementMode === 'upi' && (
            <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center gap-3">
              <div className="w-14 h-14 bg-slate-900 rounded p-1 flex items-center justify-center shrink-0">
                <QrCode className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 min-w-0 text-[10px] text-slate-600 space-y-0.5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-800">Dynamic Counter QR</p>
                  <span className="font-mono text-xs font-bold text-blue-700">₹{actualPaidAmount.toFixed(2)}</span>
                </div>
                <p className="text-slate-500">Scan via GPay, PhonePe, Paytm</p>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Reconciled automatically
                </span>
              </div>
            </div>
          )}

          {/* Khata Credit Memo Prompt */}
          {settlementMode === 'credit' && (
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <User className="w-4 h-4 text-amber-600" />
                <span>Store Credit / Khata Memo</span>
              </div>
              <p className="text-[11px] text-amber-700">
                Full amount of ₹{netPayable.toFixed(2)} will be debited to {customerName || 'customer'} Khata ledger.
              </p>
            </div>
          )}

          {/* Dual Checkout Action Buttons */}
          <div className="pt-1 space-y-1.5">
            <div className="grid grid-cols-2 gap-2">
              {/* Button 1: Thermal Slip (F2) */}
              <button
                type="button"
                disabled={cartItems.length === 0 || isSubmitting}
                onClick={() => handleCheckout('thermal-80mm')}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Thermal Slip (F2)</span>
              </button>

              {/* Button 2: Formal A4 GST Invoice (Ctrl+P) */}
              <button
                type="button"
                disabled={cartItems.length === 0 || isSubmitting}
                onClick={() => handleCheckout('a4-tax-invoice')}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>A4 GST Invoice</span>
              </button>
            </div>

            {/* Silent Save */}
            <button
              type="button"
              disabled={cartItems.length === 0 || isSubmitting}
              onClick={() => handleCheckout(null)}
              className="w-full py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-50 text-slate-600 font-semibold text-[11px] transition-colors cursor-pointer text-center"
            >
              Charge & Save Only (Silent)
            </button>
          </div>
        </div>
      </div>

      {/* Printable Receipt & Tax Invoice Modal */}
      <PrintReceiptModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        invoice={lastInvoiceForPrint}
        defaultMode={printFormatMode}
      />

      {/* Quick Custom Item / Service Modal Dialog */}
      {isCustomItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-sm">Add Custom Item / Service</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomItemModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Item / Service Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Screen Protector Installation, Delivery Charge"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Rate (₹) *</label>
                  <input
                    type="number"
                    value={customItemRate || ''}
                    onChange={(e) => setCustomItemRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={customItemQty || 1}
                    onChange={(e) => setCustomItemQty(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">HSN/SAC</label>
                  <input
                    type="text"
                    value={customItemHsn}
                    onChange={(e) => setCustomItemHsn(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCustomItemModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomItem}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
              >
                Add to Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Register Confirmation Modal */}
      {isClearRegisterConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Clear Active Register?</h4>
                <p className="text-xs text-slate-500">All current line items in the active bill will be removed.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsClearRegisterConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Keep Items
              </button>
              <button
                type="button"
                onClick={confirmClearRegister}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
