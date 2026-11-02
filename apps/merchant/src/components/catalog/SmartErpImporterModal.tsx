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
  ArrowRight,
  Database,
  Check,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import {
  parseErpSpreadsheet,
  detectErpFormat,
  ErpFormatPreset,
  ParsedErpResult,
  SAMPLE_ERP_TEMPLATES,
} from '../../lib/erpCatalogParser.js';
import { useCatalogStore } from '../../stores/catalogStore.js';

interface SmartErpImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (count: number) => void;
}

export const SmartErpImporterModal: React.FC<SmartErpImporterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { bulkImportProducts } = useCatalogStore();
  const [selectedFormat, setSelectedFormat] = useState<ErpFormatPreset>('auto');
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedErpResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setErrorMsg(null);
    setImportSuccessMsg(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        try {
          const res = parseErpSpreadsheet(text, selectedFormat);
          if (res.rows.length === 0) {
            setErrorMsg('No valid product rows found in this file.');
            setParsedData(null);
          } else {
            setParsedData(res);
          }
        } catch (err: any) {
          setErrorMsg(err?.message || 'Failed to parse CSV file.');
          setParsedData(null);
        }
      }
    };
    reader.onerror = () => setErrorMsg('Error reading file from disk.');
    reader.readAsText(file);
  };

  const handleLoadSample = (key: 'vyapar' | 'tally' | 'marg' | 'universal') => {
    setErrorMsg(null);
    setImportSuccessMsg(null);
    const sample = SAMPLE_ERP_TEMPLATES[key];
    setFileName(sample.filename);
    setSelectedFormat(key);
    const res = parseErpSpreadsheet(sample.csv, key);
    setParsedData(res);
  };

  const handleDownloadTemplate = (key: 'vyapar' | 'tally' | 'marg' | 'universal') => {
    const sample = SAMPLE_ERP_TEMPLATES[key];
    const encoded = encodeURI(`data:text/csv;charset=utf-8,${sample.csv}`);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', sample.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const executeBulkImport = async () => {
    if (!parsedData || parsedData.rows.length === 0) return;
    setIsImporting(true);
    setErrorMsg(null);

    try {
      // Map to catalog format
      const catalogRows = parsedData.rows.map((r) => ({
        name: r.name,
        category: r.category,
        subCategory: r.subCategory || 'General',
        sku: r.sku,
        barcode: r.barcode,
        price: r.price,
        costPrice: r.costPrice,
        mrp: r.mrp,
        stock: r.stock,
        hsnCode: r.hsnCode,
        description: r.description,
        brand: r.brand,
      }));

      const res = await bulkImportProducts(catalogRows);
      const count = res?.created ?? catalogRows.length;
      setImportSuccessMsg(`Successfully imported ${count} items into your store catalog!`);

      setTimeout(() => {
        onSuccess?.(count);
        onClose();
        setParsedData(null);
        setFileName(null);
        setImportSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Bulk import failed. Please verify your connection.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="1-Click ERP / POS Catalog Importer" maxWidth="2xl">
      <div className="space-y-4">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-4 text-white border border-blue-800/40 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Smart Inventory &amp; Price Ingestion</h4>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                  Zero Re-typing
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Directly import items from Vyapar, Tally Prime, Marg, Busy, or any CSV file in seconds.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Load instant test batch or download sample formats:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {(['vyapar', 'tally', 'marg', 'universal'] as const).map((key) => (
              <div key={key} className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleLoadSample(key)}
                  className="px-2.5 py-1 text-xs font-bold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-l-lg transition-colors cursor-pointer"
                >
                  Load {key === 'vyapar' ? 'Vyapar' : key === 'tally' ? 'Tally' : key === 'marg' ? 'Marg' : 'CSV'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate(key)}
                  className="p-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border-y border-r border-slate-200 rounded-r-lg transition-colors cursor-pointer"
                  title={`Download ${SAMPLE_ERP_TEMPLATES[key].label} template`}
                >
                  <Download className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Zone */}
        {!parsedData && (
          <label className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white hover:bg-blue-50/20 group">
            <input
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-800">
              Click to browse or drop your inventory CSV export here
            </span>
            <span className="text-xs text-slate-500 mt-1">
              Supports .csv files exported from Vyapar, Tally Prime, Marg ERP, Busy, or Excel
            </span>
          </label>
        )}

        {/* Feedback / Error */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {importSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{importSuccessMsg}</span>
          </div>
        )}

        {/* Review & Mapping Grid */}
        {parsedData && (
          <div className="space-y-3">
            {/* Summary Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[11px] text-slate-500 block font-medium">Detected ERP</span>
                <span className="text-xs font-bold text-blue-600">{parsedData.formatLabel}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[11px] text-slate-500 block font-medium">Total Items</span>
                <span className="text-sm font-black text-slate-800">{parsedData.totalRows} Products</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[11px] text-slate-500 block font-medium">Total Units</span>
                <span className="text-sm font-black text-slate-800">{parsedData.totalInventoryCount} Qty</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[11px] text-slate-500 block font-medium">Catalog Value</span>
                <span className="text-sm font-black text-emerald-600">
                  ₹{parsedData.totalCatalogValue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Preview Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200 z-10">
                    <tr>
                      <th className="p-2.5">Item Name</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">SKU / Code</th>
                      <th className="p-2.5 text-right">Price</th>
                      <th className="p-2.5 text-right">MRP</th>
                      <th className="p-2.5 text-right">Stock</th>
                      <th className="p-2.5">HSN &amp; GST</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {parsedData.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-2.5 font-semibold text-slate-800 max-w-[200px] truncate">
                          {row.name}
                        </td>
                        <td className="p-2.5 text-slate-600">{row.category}</td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-500">{row.sku}</td>
                        <td className="p-2.5 text-right font-bold text-slate-800">₹{row.price}</td>
                        <td className="p-2.5 text-right text-slate-400 font-mono">₹{row.mrp}</td>
                        <td className="p-2.5 text-right font-bold text-emerald-600">
                          {row.stock} {row.unit}
                        </td>
                        <td className="p-2.5 text-[11px] text-slate-500 font-mono">
                          {row.hsnCode || 'N/A'} ({row.gstRate}%)
                        </td>
                        <td className="p-2.5 text-center">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-0.5 text-emerald-600 text-[11px] font-bold">
                              <Check className="w-3 h-3" /> Valid
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-0.5 text-amber-600 text-[11px] font-bold"
                              title={row.validationIssues.join(', ')}
                            >
                              <AlertTriangle className="w-3 h-3" /> Warning
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setParsedData(null);
                  setFileName(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                ← Choose Another File
              </button>

              <Button
                variant="primary"
                onClick={executeBulkImport}
                disabled={isImporting || parsedData.rows.length === 0}
                className="gap-2"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Importing Items...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>Import {parsedData.rows.length} Items to Catalog</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

