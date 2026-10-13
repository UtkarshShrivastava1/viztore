import React, { useState } from 'react';
import { Modal } from '../ui/Modal.js';
import { Button } from '../ui/Button.js';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';
import { useCatalogStore } from '../../stores/catalogStore.js';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkSuccess?: (count: number) => void;
}

interface ParsedProductRow {
  name: string;
  category: string;
  subCategory?: string;
  sku: string;
  price: number;
  mrp: number;
  stock: number;
  size?: string;
  description?: string;
}

const demoBatchItems: ParsedProductRow[] = [
  {
    name: 'Classic Pique Polo T-Shirt',
    category: 'fashion',
    subCategory: 'Apparel',
    sku: `PRD-POLO-${Math.floor(1000 + Math.random() * 9000)}`,
    price: 899,
    mrp: 1499,
    stock: 45,
    size: 'L',
    description: '100% Organic combed cotton polo with ribbed collar.',
  },
  {
    name: 'Premium Slim Fit Denim Jeans',
    category: 'fashion',
    subCategory: 'Apparel',
    sku: `PRD-DENIM-${Math.floor(1000 + Math.random() * 9000)}`,
    price: 1899,
    mrp: 2999,
    stock: 30,
    size: '32',
    description: 'Stretch denim with dark indigo wash.',
  },
  {
    name: 'Breathable Lightweight Running Shoes',
    category: 'footwear',
    subCategory: 'Shoes',
    sku: `PRD-SHOE-${Math.floor(1000 + Math.random() * 9000)}`,
    price: 2499,
    mrp: 3999,
    stock: 25,
    size: 'UK 9',
    description: 'Air cushion soles for daily running and workouts.',
  },
  {
    name: 'Stainless Steel Insulated Water Bottle',
    category: 'home_living',
    subCategory: 'Kitchen',
    sku: `PRD-BTL-${Math.floor(1000 + Math.random() * 9000)}`,
    price: 699,
    mrp: 999,
    stock: 60,
    size: '750ml',
    description: 'Double walled vacuum insulated 24hr cold / 12hr hot.',
  },
];

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onBulkSuccess,
}) => {
  const { bulkImportProducts } = useCatalogStore();
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedProductRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const parseCsvText = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length < 2 || !lines[0]) {
      setErrorMessage('CSV file must have at least a header row and 1 product row.');
      return;
    }

    const firstLine = lines[0];
    const headers = firstLine.split(',').map((h) => h.trim().toLowerCase().replace(/["']/g, ''));
    const nameIdx = headers.findIndex((h) => h.includes('name') || h.includes('title'));
    const catIdx = headers.findIndex((h) => h.includes('cat'));
    const skuIdx = headers.findIndex((h) => h.includes('sku') || h.includes('code'));
    const priceIdx = headers.findIndex((h) => h.includes('price') && !h.includes('mrp'));
    const mrpIdx = headers.findIndex((h) => h.includes('mrp'));
    const stockIdx = headers.findIndex((h) => h.includes('stock') || h.includes('qty'));
    const descIdx = headers.findIndex((h) => h.includes('desc'));

    const items: ParsedProductRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i];
      if (!currentLine) continue;
      // Regex CSV splitter accounting for quotes
      const match = currentLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      const cols = match ? match.map((c) => c.replace(/^"|"$/g, '').trim()) : currentLine.split(',').map((c) => c.trim());

      const name = nameIdx >= 0 && cols[nameIdx] ? cols[nameIdx] : `Imported Product ${i}`;
      const sku = skuIdx >= 0 && cols[skuIdx] ? cols[skuIdx] : `PRD-CSV-${Date.now()}-${i}`;
      const category = catIdx >= 0 && cols[catIdx] ? cols[catIdx] : 'fashion';
      const price = priceIdx >= 0 && !isNaN(Number(cols[priceIdx])) ? Number(cols[priceIdx]) : 499;
      const mrp = mrpIdx >= 0 && !isNaN(Number(cols[mrpIdx])) ? Number(cols[mrpIdx]) : Math.round(price * 1.3);
      const stock = stockIdx >= 0 && !isNaN(Number(cols[stockIdx])) ? Number(cols[stockIdx]) : 20;
      const description = descIdx >= 0 && cols[descIdx] ? cols[descIdx] : '';

      items.push({ name, category, sku, price, mrp, stock, description });
    }

    if (items.length === 0) {
      setErrorMessage('Could not find valid product rows in CSV.');
    } else {
      setParsedRows(items);
      setErrorMessage(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setUploadSuccess(null);
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          parseCsvText(content);
        }
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read file from disk.');
      };
      reader.readAsText(file);
    }
  };

  const handleLoadDemoBatch = () => {
    setErrorMessage(null);
    setUploadSuccess(null);
    setFileSelected('demo_retail_catalog_sample.csv');
    setParsedRows(demoBatchItems);
  };

  const handleStartUpload = async () => {
    if (parsedRows.length === 0) return;
    setIsUploading(true);
    setErrorMessage(null);
    setUploadSuccess(null);

    try {
      const res = await bulkImportProducts(parsedRows);
      const createdCount = res?.created ?? parsedRows.length;
      setUploadSuccess(`Successfully imported ${createdCount} products into your catalog!`);
      setTimeout(() => {
        onBulkSuccess?.(createdCount);
        onClose();
        setUploadSuccess(null);
        setFileSelected(null);
        setParsedRows([]);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Bulk upload failed. Please check your network or CSV structure.');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Name,Category,SKU,Price,MRP,Stock,Sizes,Description\n' +
      'Polo T-Shirt,fashion,PRD-TSH-001,899,1499,50,M,100% Organic Pique Cotton\n' +
      'Leather Chelsea Boots,footwear,PRD-BOT-002,3499,4999,15,UK 9,Genuine Full Grain Leather\n' +
      'Wireless Bluetooth Earbuds,electronics,PRD-AUD-003,1299,2499,40,Standard,Deep bass with ENC mic\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'catalog_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Product Catalog Upload" maxWidth="lg">
      <div className="space-y-4 text-xs">
        <p className="text-slate-500 leading-relaxed">
          Upload your product inventory in bulk via CSV or Excel sheets. Our system auto-creates SKUs, registers tax codes, and publishes items directly to your live storefront.
        </p>

        {/* Actions Row: Template Download & Demo Quick Load */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block text-xs">CSV Template</span>
                <span className="text-[11px] text-slate-500">Includes headers &amp; samples</span>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={downloadSampleCsv}>
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Download</span>
            </Button>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="font-semibold text-blue-900 block text-xs">Quick Demo Batch</span>
                <span className="text-[11px] text-blue-700/80">Load 4 test products in 1 click</span>
              </div>
            </div>
            <Button size="sm" variant="primary" onClick={handleLoadDemoBatch}>
              <span>Load Batch</span>
            </Button>
          </div>
        </div>

        {/* Drag and Drop Box */}
        <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer transition-all">
          <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          <Upload className="w-8 h-8 text-blue-600 mb-2" />
          <span className="font-semibold text-slate-800 text-sm">
            {fileSelected ? fileSelected : 'Click to Browse or Drag & Drop CSV'}
          </span>
          <span className="text-[11px] text-slate-500 mt-1">Accepts standard .CSV files up to 10 MB</span>
        </label>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Success Feedback */}
        {uploadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium">{uploadSuccess}</span>
          </div>
        )}

        {/* Parsed Rows Preview */}
        {parsedRows.length > 0 && (
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Parsed Products Preview ({parsedRows.length} items ready to import)
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Ready for sync</span>
            </div>
            <div className="max-h-44 overflow-y-auto divide-y divide-slate-100">
              {parsedRows.slice(0, 6).map((item, idx) => (
                <div key={idx} className="px-3.5 py-2 flex items-center justify-between text-xs">
                  <div className="truncate pr-3">
                    <span className="font-semibold text-slate-800 block truncate">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.sku} • {item.category}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-800 block">₹{item.price}</span>
                    <span className="text-[10px] text-slate-400">Stock: {item.stock}</span>
                  </div>
                </div>
              ))}
              {parsedRows.length > 6 && (
                <div className="px-3.5 py-1.5 text-center text-[11px] text-slate-400 bg-slate-50">
                  + {parsedRows.length - 6} more rows in this file
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            variant="primary"
            disabled={parsedRows.length === 0 || isUploading}
            isLoading={isUploading}
            onClick={handleStartUpload}
          >
            <span>Import {parsedRows.length > 0 ? `(${parsedRows.length}) Products` : 'to Catalog'}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
