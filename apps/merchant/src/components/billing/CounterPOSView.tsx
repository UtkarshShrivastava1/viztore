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
} from 'lucide-react';
import { useCatalogStore, ProductItem } from '../../stores/catalogStore.js';
import { useInventoryStore } from '../../stores/inventoryStore.js';
import { useBillingStore, IInvoice, IInvoiceItem } from '../../stores/billingStore.js';
import { useCustomerStore } from '../../stores/customerStore.js';
import { billingApi } from '../../lib/api.js';
import { PrintReceiptModal } from './PrintReceiptModal.js';
import { DEFAULT_INDIAN_STATE } from '@repo/shared-types';

interface CounterPOSViewProps {
  onBack?: () => void;
}

export const CounterPOSView: React.FC<CounterPOSViewProps> = ({ onBack }) => {
  const { products: catalogProducts } = useCatalogStore();
  const { items: inventoryItems } = useInventoryStore();
  const { completePOSSale, createInvoice } = useBillingStore();
  const { customers } = useCustomerStore();

  // Unified available POS items (prefers catalog products with pricing, merges inventory)
  const posProducts = useMemo(() => {
    if (catalogProducts && catalogProducts.length > 0) {
      return catalogProducts;
    }
    // Fallback: derive products from inventoryStore
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

  // Customer Context
  const [isWalkIn, setIsWalkIn] = useState<boolean>(true);
  const [customerName, setCustomerName] = useState<string>('Walk-in Retail Customer');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerGstin, setCustomerGstin] = useState<string>('');

  // Settlement Context
  const [settlementMode, setSettlementMode] = useState<'cash' | 'upi' | 'card' | 'bank_transfer'>('cash');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Print Dialog State
  const [lastInvoiceForPrint, setLastInvoiceForPrint] = useState<IInvoice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isClearRegisterConfirmOpen, setIsClearRegisterConfirmOpen] = useState<boolean>(false);

  // Search input ref
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Audio Beep Generator for Barcode / Scan events
  const playScanChime = (freq = 880, duration = 0.08) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // AudioContext not allowed or not supported; fail silently
    }
  };

  // Barcode Scanner Keystroke Wedge Listener
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // F2 hotkey: Quick Charge & Print
      if (e.key === 'F2') {
        e.preventDefault();
        handleCheckout(true);
        return;
      }

      // F3 or Ctrl+K: Focus search
      if (e.key === 'F3' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Barcode Scanner Listener:
      // Barcode scanners enter characters rapidly (< 40ms interval) ending with 'Enter'
      const now = Date.now();
      const diff = now - lastKeyTime;
      lastKeyTime = now;

      // Ignore normal typing in active text inputs if slower than scanner speed
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if (e.key === 'Enter') {
        if (buffer.length >= 3 && (diff < 60 || !isInput)) {
          // Detected barcode scan string
          e.preventDefault();
          const scannedCode = buffer.trim();
          handleBarcodeScanned(scannedCode);
        }
        buffer = '';
        return;
      }

      if (e.key.length === 1) {
        if (diff > 120 && isInput) {
          // Normal human typing, reset scanner buffer
          buffer = e.key;
        } else {
          buffer += e.key;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartItems, posProducts]);

  const handleBarcodeScanned = (code: string) => {
    const clean = code.toLowerCase().trim();
    const matched = posProducts.find(
      (p) =>
        (p.barcode && p.barcode.toLowerCase() === clean) ||
        (p.sku && p.sku.toLowerCase() === clean) ||
        p.id.toLowerCase() === clean
    );

    if (matched) {
      playScanChime(1046, 0.1); // High C beep
      addToCart(matched);
      showNotification(`Scanned: ${matched.name} (+1)`, 'success');
    } else {
      playScanChime(300, 0.2); // Low buzz
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
          sku: product.sku,
          name: product.name,
          hsnSac: '6205',
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

  // Indian GST Calculation Math
  const subTotal = cartItems.reduce((sum, it) => sum + it.quantity * it.rate, 0);
  const discountAmount = Math.round(((subTotal * discountPercent) / 100) * 100) / 100;
  const taxableAmount = Math.max(0, subTotal - discountAmount);
  // Standard Indian GST (intra-state: 9% CGST + 9% SGST)
  const cgstAmount = Math.round(taxableAmount * 0.09 * 100) / 100;
  const sgstAmount = Math.round(taxableAmount * 0.09 * 100) / 100;
  const taxTotal = Math.round((cgstAmount + sgstAmount) * 100) / 100;
  const exactGrandTotal = taxableAmount + taxTotal;
  const netPayable = Math.round(exactGrandTotal);
  const roundOff = Number((netPayable - exactGrandTotal).toFixed(2));

  // Change Return Calculation
  const changeDue = settlementMode === 'cash' && cashTendered > netPayable ? cashTendered - netPayable : 0;

  // Checkout Handler
  const handleCheckout = async (openPrint = true) => {
    if (cartItems.length === 0) {
      showNotification('Bill is empty. Please add items to proceed.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const customerFinalName = isWalkIn ? 'Walk-in Retail Customer' : customerName.trim() || 'Retail Customer';

      const result = await completePOSSale({
        customerName: customerFinalName,
        customerPhone: isWalkIn ? '' : customerPhone,
        customerGstin: customerGstin || undefined,
        items: cartItems,
        settlementMode,
        tenderedCashAmount: settlementMode === 'cash' ? (cashTendered || netPayable) : undefined,
        changeReturnAmount: changeDue,
        paperSize: '80mm',
        discountPercent,
      });

      playScanChime(1318, 0.15); // Celebration E beep
      showNotification(`Invoice ${result.invoice.invoiceNo} Charged Successfully!`, 'success');

      // Reset Bill
      setCartItems([]);
      setCashTendered(0);
      setDiscountPercent(0);

      // Open Thermal Slip Print Dialog
      if (openPrint) {
        setLastInvoiceForPrint(result.invoice);
        setIsPrintModalOpen(true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error processing counter transaction', 'error');
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
          {notification.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
          {notification.type === 'error' && <AlertCircle className="w-4 h-4" />}
          {notification.type === 'info' && <Sparkles className="w-4 h-4" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* LEFT COLUMN: ITEM CATALOG & QUICK SCAN STATION              */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Top Header / Search Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>In-House Counter POS</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" /> Live Register
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Scan barcode with handheld scanner or click items to add to bill.
                </p>
              </div>
            </div>

            {/* Barcode status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Barcode className="w-4 h-4 text-blue-600" />
              <span>Scanner Ready</span>
            </div>
          </div>

          {/* Search Box */}
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
                        : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md active:scale-98'
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
      {/* RIGHT COLUMN: CASHIER REGISTER & INSTANT SETTLEMENT         */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[420px] bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden shrink-0">
        {/* Register Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Active Bill Register ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </h3>
          </div>
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={clearRegister}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Customer Header Selector */}
        <div className="p-3 bg-slate-100/60 border-b border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Customer Mode:</span>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setIsWalkIn(true)}
                className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  isWalkIn ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Walk-in
              </button>
              <button
                type="button"
                onClick={() => setIsWalkIn(false)}
                className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  !isWalkIn ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Regular
              </button>
            </div>
          </div>

          {!isWalkIn && (
            <div className="grid grid-cols-2 gap-2 pt-1 animate-in fade-in duration-150">
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName === 'Walk-in Retail Customer' ? '' : customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
              />
              <input
                type="text"
                placeholder="Phone (10 digits)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono"
              />
            </div>
          )}
        </div>

        {/* Item Rows in Cart */}
        <div className="flex-1 p-3 overflow-y-auto divide-y divide-slate-100 min-h-[220px] max-h-[340px]">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShoppingCart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">Register is empty</p>
              <p className="text-[11px] text-slate-400">Click items on the left or scan a barcode</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0 pr-1">
                  <h5 className="text-xs font-bold text-slate-900 truncate">{item.name}</h5>
                  <p className="text-[10px] text-slate-500 font-mono">
                    ₹{item.rate.toFixed(2)} × {item.quantity} = ₹{item.amount.toFixed(2)}
                  </p>
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
                  <span className="w-6 text-center font-bold text-xs text-slate-900 font-mono">
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
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-3">
          {/* Discount Pill */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-blue-600" />
              <span>Bill Discount:</span>
            </span>
            <div className="flex items-center gap-1.5">
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

          {/* Pricing Math */}
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
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>CGST (9%):</span>
              <span className="font-mono">₹{cgstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>SGST (9%):</span>
              <span className="font-mono">₹{sgstAmount.toFixed(2)}</span>
            </div>
            {roundOff !== 0 && (
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Round Off:</span>
                <span className="font-mono">{roundOff > 0 ? `+₹${roundOff.toFixed(2)}` : `-₹${Math.abs(roundOff).toFixed(2)}`}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-200">
              <span>Net Payable:</span>
              <span className="font-mono text-blue-700">₹{netPayable.toFixed(2)}</span>
            </div>
          </div>

          {/* Settlement Mode Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700">Payment Mode:</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'cash', label: 'Cash', icon: Banknote },
                { id: 'upi', label: 'UPI / QR', icon: QrCode },
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'bank_transfer', label: 'Credit', icon: User },
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

          {/* Quick Cash Presets if Mode is Cash */}
          {settlementMode === 'cash' && (
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-2">
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
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs font-bold">
                  <span>Change to Return:</span>
                  <span className="font-mono text-sm">₹{changeDue.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {/* Dynamic Counter UPI QR */}
          {settlementMode === 'upi' && (
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                <span className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span>Dynamic Counter UPI QR</span>
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                  ₹{netPayable.toFixed(2)}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex items-center gap-3">
                <div className="w-16 h-16 bg-slate-900 rounded p-1 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                    <rect x="5" y="5" width="28" height="28" fill="white" />
                    <rect x="9" y="9" width="20" height="20" fill="black" />
                    <rect x="13" y="13" width="12" height="12" fill="white" />
                    <rect x="67" y="5" width="28" height="28" fill="white" />
                    <rect x="71" y="9" width="20" height="20" fill="black" />
                    <rect x="75" y="13" width="12" height="12" fill="white" />
                    <rect x="5" y="67" width="28" height="28" fill="white" />
                    <rect x="9" y="71" width="20" height="20" fill="black" />
                    <rect x="13" y="75" width="12" height="12" fill="white" />
                    <rect x="42" y="10" width="16" height="8" fill="white" />
                    <rect x="40" y="40" width="20" height="20" fill="white" />
                    <rect x="46" y="46" width="8" height="8" fill="black" />
                    <rect x="15" y="42" width="15" height="10" fill="white" />
                    <rect x="72" y="42" width="18" height="15" fill="white" />
                    <rect x="42" y="75" width="15" height="15" fill="white" />
                    <rect x="70" y="70" width="22" height="22" fill="white" />
                    <rect x="76" y="76" width="10" height="10" fill="black" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0 text-[10px] text-slate-600 space-y-0.5">
                  <p className="font-bold text-slate-800">Scan & Pay Any UPI App</p>
                  <p className="text-slate-500">GPay • PhonePe • Paytm • BHIM</p>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Reconciled automatically on charge
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Card Swipe Machine Prompt */}
          {settlementMode === 'card' && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Swipe / Tap POS Terminal</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Collect ₹{netPayable.toFixed(2)} on swipe machine, then click Charge & Print.
              </p>
            </div>
          )}

          {/* Khata Credit Memo Prompt */}
          {settlementMode === 'bank_transfer' && (
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <User className="w-4 h-4 text-amber-600" />
                <span>Store Credit / Khata Memo</span>
              </div>
              <p className="text-[11px] text-amber-700">
                Bill of ₹{netPayable.toFixed(2)} will be recorded in customer Khata ledger.
              </p>
            </div>
          )}

          {/* Action Checkout Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              disabled={cartItems.length === 0 || isSubmitting}
              onClick={() => handleCheckout(true)}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>Charge & Print Thermal Slip (F2)</span>
            </button>

            <button
              type="button"
              disabled={cartItems.length === 0 || isSubmitting}
              onClick={() => handleCheckout(false)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-50 text-slate-700 font-bold text-xs transition-colors"
            >
              Charge & Save Only
            </button>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <PrintReceiptModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        invoice={lastInvoiceForPrint}
        defaultMode="thermal-80mm"
      />

      {/* Clear Register In-App Confirmation Modal */}
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
