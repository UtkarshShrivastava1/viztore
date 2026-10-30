export type ErpFormatPreset = 'auto' | 'vyapar' | 'tally' | 'marg' | 'busy' | 'universal';

export interface ErpProductRow {
  name: string;
  category: string;
  subCategory?: string;
  sku: string;
  barcode?: string;
  price: number;
  costPrice?: number;
  mrp: number;
  stock: number;
  unit?: string;
  hsnCode?: string;
  gstRate?: number;
  description?: string;
  brand?: string;
  isValid: boolean;
  validationIssues: string[];
}

export interface ParsedErpResult {
  detectedFormat: ErpFormatPreset;
  formatLabel: string;
  headers: string[];
  rows: ErpProductRow[];
  totalRows: number;
  validRowsCount: number;
  totalInventoryCount: number;
  totalCatalogValue: number;
}

/**
 * Standard CSV parser handling quotes, multiline values, and separators
 */
export function parseCsvRows(csvText: string): { headers: string[]; rawRows: string[][] } {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return { headers: [], rawRows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        result.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
  };

  const rawHeaders = parseLine(lines[0] || '');
  const rawRows: string[][] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseLine(lines[i] || '');
    if (row.some((cell) => cell.length > 0)) {
      rawRows.push(row);
    }
  }

  return { headers: rawHeaders, rawRows };
}

/**
 * Intelligently detect ERP origin based on header signatures
 */
export function detectErpFormat(headers: string[]): ErpFormatPreset {
  const normalized = headers.map((h) => h.toLowerCase().trim().replace(/[^a-z0-9]/g, ''));

  // Vyapar: "itemname", "saleprice", "purchaseprice", "currentstock", "hsnsac"
  if (
    normalized.some((h) => h.includes('saleprice') || h.includes('purchaseprice') || h.includes('currentstock'))
  ) {
    return 'vyapar';
  }

  // Tally: "particulars", "stockitem", "rate", "units", "closingbalance"
  if (
    normalized.some((h) => h.includes('particulars') || h.includes('stockitem') || (h.includes('rate') && h.includes('units')))
  ) {
    return 'tally';
  }

  // Marg: "itemdescription", "salerate", "closingstock", "mrp"
  if (
    normalized.some((h) => h.includes('salerate') || h.includes('itemdescription') || h.includes('closingstock'))
  ) {
    return 'marg';
  }

  // Busy: "itemname", "opqty", "clqty", "taxrate"
  if (
    normalized.some((h) => h.includes('opqty') || h.includes('clqty') || h.includes('taxrate'))
  ) {
    return 'busy';
  }

  return 'universal';
}

export function parseErpSpreadsheet(
  csvText: string,
  chosenPreset: ErpFormatPreset = 'auto',
  customColumnMap?: Record<string, number>,
): ParsedErpResult {
  const { headers, rawRows } = parseCsvRows(csvText);
  const detected = chosenPreset === 'auto' ? detectErpFormat(headers) : chosenPreset;

  const getFormatLabel = (fmt: ErpFormatPreset): string => {
    switch (fmt) {
      case 'vyapar':
        return 'Vyapar Accounting App';
      case 'tally':
        return 'Tally Prime / ERP 9';
      case 'marg':
        return 'Marg ERP 9+';
      case 'busy':
        return 'Busy Business Accounting';
      default:
        return 'Universal E-Commerce Catalog';
    }
  };

  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

  // Find column index helper
  const findCol = (targetField: string, keywords: string[]): number => {
    if (customColumnMap && customColumnMap[targetField] !== undefined) {
      return customColumnMap[targetField];
    }
    return lowerHeaders.findIndex((h) => keywords.some((k) => h.includes(k)));
  };

  const nameIdx = findCol('name', ['item name', 'product name', 'particulars', 'item description', 'description', 'title', 'name']);
  const skuIdx = findCol('sku', ['item code', 'part no', 'sku', 'code', 'product code', 'item no']);
  const barcodeIdx = findCol('barcode', ['barcode', 'ean', 'upc', 'gtin', 'serial']);
  const categoryIdx = findCol('category', ['category', 'group', 'parent group', 'item group']);
  const priceIdx = findCol('price', ['sale price', 'sales price', 'selling price', 'sale rate', 'rate', 'price']);
  const costIdx = findCol('costPrice', ['purchase price', 'cost price', 'cost rate', 'buy price', 'cost']);
  const mrpIdx = findCol('mrp', ['mrp', 'maximum retail price', 'list price']);
  const stockIdx = findCol('stock', ['current stock', 'closing stock', 'quantity', 'qty', 'stock', 'closing balance', 'cl qty']);
  const unitIdx = findCol('unit', ['unit', 'units', 'uom', 'measuring unit']);
  const hsnIdx = findCol('hsnCode', ['hsn/sac', 'hsn code', 'hsn', 'sac']);
  const gstIdx = findCol('gstRate', ['gst rate', 'tax rate', 'tax %', 'gst %', 'gst']);
  const brandIdx = findCol('brand', ['brand', 'manufacturer', 'make']);

  const rows: ErpProductRow[] = [];
  let totalInventoryCount = 0;
  let totalCatalogValue = 0;

  rawRows.forEach((cols, idx) => {
    const issues: string[] = [];
    const rawName = nameIdx >= 0 ? cols[nameIdx]?.trim() || '' : '';
    const name = rawName || `Imported Item ${idx + 1}`;
    if (!rawName) issues.push('Missing product name — defaulted');

    const sku = skuIdx >= 0 && cols[skuIdx]?.trim() ? cols[skuIdx].trim() : `SKU-ERP-${Date.now().toString().slice(-6)}-${idx + 1}`;
    const barcode = barcodeIdx >= 0 && cols[barcodeIdx]?.trim() ? cols[barcodeIdx].trim() : undefined;
    const category = categoryIdx >= 0 && cols[categoryIdx]?.trim() ? cols[categoryIdx].trim() : 'Food Essentials';

    // Parse Prices
    const rawPrice = priceIdx >= 0 ? cols[priceIdx]?.replace(/[^0-9.]/g, '') : '';
    const price = rawPrice && !isNaN(Number(rawPrice)) && Number(rawPrice) > 0 ? Number(rawPrice) : 99;
    if (!rawPrice || Number(rawPrice) <= 0) issues.push('Invalid or missing selling price — defaulted to ₹99');

    const rawMrp = mrpIdx >= 0 ? cols[mrpIdx]?.replace(/[^0-9.]/g, '') : '';
    const mrp = rawMrp && !isNaN(Number(rawMrp)) ? Number(rawMrp) : Math.max(price, Math.round(price * 1.25));

    const rawCost = costIdx >= 0 ? cols[costIdx]?.replace(/[^0-9.]/g, '') : '';
    const costPrice = rawCost && !isNaN(Number(rawCost)) ? Number(rawCost) : Math.round(price * 0.75);

    // Parse Stock
    const rawStock = stockIdx >= 0 ? cols[stockIdx]?.replace(/[^0-9.-]/g, '') : '';
    const stockNum = rawStock && !isNaN(Number(rawStock)) ? Math.max(0, Math.round(Number(rawStock))) : 10;
    if (rawStock && Number(rawStock) < 0) issues.push('Negative stock reset to 0');

    // Parse Compliance
    const hsnCode = hsnIdx >= 0 && cols[hsnIdx]?.trim() ? cols[hsnIdx].trim() : undefined;
    const rawGst = gstIdx >= 0 ? cols[gstIdx]?.replace(/[^0-9.]/g, '') : '';
    const gstRate = rawGst && !isNaN(Number(rawGst)) ? Number(rawGst) : 18;
    const brand = brandIdx >= 0 && cols[brandIdx]?.trim() ? cols[brandIdx].trim() : 'Generic / Unbranded';
    const unit = unitIdx >= 0 && cols[unitIdx]?.trim() ? cols[unitIdx].trim() : 'Piece';

    totalInventoryCount += stockNum;
    totalCatalogValue += price * stockNum;

    rows.push({
      name,
      category,
      sku,
      barcode,
      price,
      costPrice,
      mrp,
      stock: stockNum,
      unit,
      hsnCode,
      gstRate,
      brand,
      description: `Imported via ${getFormatLabel(detected)} • Unit: ${unit}`,
      isValid: issues.length === 0,
      validationIssues: issues,
    });
  });

  return {
    detectedFormat: detected,
    formatLabel: getFormatLabel(detected),
    headers,
    rows,
    totalRows: rows.length,
    validRowsCount: rows.filter((r) => r.isValid).length,
    totalInventoryCount,
    totalCatalogValue,
  };
}

/**
 * Pre-packaged Sample CSVs for Merchant Testing
 */
export const SAMPLE_ERP_TEMPLATES: Record<
  'vyapar' | 'tally' | 'marg' | 'universal',
  { filename: string; label: string; csv: string }
> = {
  vyapar: {
    filename: 'vyapar_inventory_sample.csv',
    label: 'Vyapar Accounting App',
    csv: `Item Name,Item Code,Category,Sale Price,Purchase Price,MRP,Current Stock,Min Stock,HSN/SAC,Tax Rate
Aashirvaad Sharbati Atta 5kg,ATT-001,Food Essentials,275,245,295,40,10,11010000,0%
Tata Salt 1kg,SLT-002,Food Essentials,25,22,28,120,25,25010010,0%
Amul Butter 500g,BTR-003,Food Essentials,265,240,275,30,5,04051000,12%
Maggi Masala Noodles 70g,MAG-004,Food Essentials,14,11.5,14,150,30,19023010,12%
Fortune Sunflower Oil 1L,OIL-005,Food Essentials,142,128,155,60,15,15121910,5%
Britannia Good Day 200g,BIS-006,Food Essentials,45,38,50,85,20,19053100,18%
Surf Excel Easy Wash 1kg,SRF-007,Food Essentials,135,118,145,50,10,34029011,18%
Dettol Bath Soap 125g,DET-008,Food Essentials,55,46,60,90,15,34011110,18%`,
  },
  tally: {
    filename: 'tally_prime_stock_sample.csv',
    label: 'Tally Prime / ERP 9',
    csv: `Particulars,Part No,Parent Group,Rate,Units,Quantity,GST Rate,HSN Code
boAt Rockerz 450 Headphone,EAR-450,Electronics,1499,Nos,25,18%,85183000
boAt Airdopes 141 Earbuds,AIR-141,Electronics,1299,Pairs,30,18%,85183000
Apple 20W USB-C Adapter,APL-20W,Electronics,1799,Pcs,15,18%,85044030
Portronics Power Plate 7,POR-PP7,Electronics,999,Pcs,20,18%,85366990
Portronics Kronos Y1 Smartwatch,POR-Y1,Electronics,1899,Pcs,12,18%,85176290`,
  },
  marg: {
    filename: 'marg_erp_catalog_sample.csv',
    label: 'Marg ERP 9+',
    csv: `Item Description,Item Code,Group,Sale Rate,Cost,MRP,Closing Stock,HSN Code
Peter England Slim Fit Cotton Shirt,PES-101,Men's Fashion,1299,850,1699,35,62052000
Allen Solly Pique Polo T-Shirt,ASP-202,Men's Fashion,999,620,1299,50,61091000
Sparx Mesh Running Shoes UK 8,SPX-303,Men's Fashion,1199,790,1499,22,64041190
Campus OXYFIT Memory Foam Shoes,CMP-404,Men's Fashion,1399,920,1799,18,64041190`,
  },
  universal: {
    filename: 'universal_store_catalog.csv',
    label: 'Universal E-Commerce Template',
    csv: `Name,Category,SKU,Barcode,Price,MRP,Stock,Brand,HSN,GST
Everyday Combed Cotton T-Shirt,Men's Fashion,TSH-WHT-L,8901234567890,499,699,40,In-House,61091000,5
Slim Fit Stretch Denim Jeans,Men's Fashion,JNS-BLU-32,8907861009012,1499,1999,25,Peter England,62034200,5
Stainless Steel Thermal Flask 1L,Home & Furniture,FLK-SS-1L,8904325410021,799,1099,30,Milton,73239390,18`,
  },
};

