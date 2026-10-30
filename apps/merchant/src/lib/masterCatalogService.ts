import masterProductsData from '../data/masterProducts.json';

export interface MasterCatalogProduct {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  productType: string;
  mrp: number;
  suggestedPrice: number;
  costPrice: number;
  hsnCode: string;
  gstRate: number;
  images: string[];
  description: string;
  keyFeatures: string[];
  unit: string;
}

const masterProducts: MasterCatalogProduct[] = masterProductsData as MasterCatalogProduct[];

/**
 * Web Audio synthetic POS/Barcode scan beep
 */
export function playScanBeep(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, ctx.currentTime); // High pitch crisp beep (A6)
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // Ignore audio failures if browser blocks autoplay
  }
}

/**
 * Fast exact lookup by barcode or SKU
 */
export function lookupMasterProduct(barcodeOrQuery: string): MasterCatalogProduct | null {
  const clean = barcodeOrQuery.trim().toLowerCase();
  if (!clean) return null;

  const exact = masterProducts.find(
    (p) => p.barcode.toLowerCase() === clean,
  );
  if (exact) {
    playScanBeep();
    return exact;
  }

  // Fallback: match if barcode ends with or contains query (e.g. last 6 digits of barcode)
  if (clean.length >= 6 && /^\d+$/.test(clean)) {
    const partial = masterProducts.find((p) => p.barcode.includes(clean));
    if (partial) {
      playScanBeep();
      return partial;
    }
  }

  return null;
}

/**
 * Search master catalog by query string (name, brand, category, barcode)
 */
export function searchMasterProducts(query: string, limit = 6): MasterCatalogProduct[] {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 2) return [];

  return masterProducts
    .filter(
      (p) =>
        p.barcode.includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.productType.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    )
    .slice(0, limit);
}

