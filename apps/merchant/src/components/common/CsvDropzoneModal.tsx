import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, UploadCloud, FileSpreadsheet, Download, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { downloadCSV } from '../../utils/csvExport.js';

export interface CsvDropzoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  sampleHeaders: string[];
  sampleRows: (string | number)[][];
  sampleFilename: string;
  onImport: (rows: Record<string, string>[]) => void;
}

export const CsvDropzoneModal: React.FC<CsvDropzoneModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  sampleHeaders,
  sampleRows,
  sampleFilename,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownloadSample = () => {
    downloadCSV(sampleFilename, sampleHeaders, sampleRows);
  };

  const processCsvFile = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please select a valid .csv file.');
      return;
    }
    setError(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        setError('The uploaded CSV file is empty.');
        return;
      }

      // Simple CSV parsing handling lines and quotes
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length < 2) {
        setError('CSV must contain a header row and at least one data row.');
        return;
      }

      const parseLine = (line: string): string[] => {
        const result: string[] = [];
        let cur = '';
        let insideQuote = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            insideQuote = !insideQuote;
          } else if (char === ',' && !insideQuote) {
            result.push(cur.trim());
            cur = '';
          } else {
            cur += char;
          }
        }
        result.push(cur.trim());
        return result.map((c) => c.replace(/^["']|["']$/g, ''));
      };

      const parsedHeaders = parseLine(lines[0] || '');
      setHeaders(parsedHeaders);

      const parsedRows: Record<string, string>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = parseLine(lines[i] || '');
        const rowObj: Record<string, string> = {};
        parsedHeaders.forEach((h, idx) => {
          rowObj[h] = values[idx] || '';
        });
        parsedRows.push(rowObj);
      }

      setParsedData(parsedRows);
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processCsvFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (parsedData.length === 0) {
      setError('No data rows found to import.');
      return;
    }
    onImport(parsedData);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setFile(null);
      setParsedData([]);
      onClose();
    }, 1200);
  };

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Download Sample Banner */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-blue-900 font-medium">Need the correct column format?</span>
            </div>
            <button
              type="button"
              onClick={handleDownloadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded-lg text-xs shadow-2xs transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample Template</span>
            </button>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
                : file
                ? 'border-emerald-400 bg-emerald-50/20'
                : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processCsvFile(e.target.files[0]);
                }
              }}
            />

            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="font-bold text-slate-800 text-sm">{file.name}</p>
                <p className="text-[11px] text-slate-500">
                  {(file.size / 1024).toFixed(1)} KB · {parsedData.length} records ready to import
                </p>
                <span className="text-[11px] text-blue-600 hover:underline mt-1 font-semibold">
                  Click to choose a different CSV file
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">
                    Drop your CSV file here, or <span className="text-blue-600">Browse</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Supports CSV UTF-8 up to 10MB</p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedData.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <span>Preview (First {Math.min(parsedData.length, 3)} rows):</span>
                <span>{parsedData.length} Total Rows</span>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-36 bg-slate-50/50">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      {headers.slice(0, 5).map((h, i) => (
                        <th key={i} className="py-1.5 px-2.5 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {parsedData.slice(0, 3).map((row, rIdx) => (
                      <tr key={rIdx}>
                        {headers.slice(0, 5).map((h, cIdx) => (
                          <td key={cIdx} className="py-1.5 px-2.5 whitespace-nowrap">
                            {row[h] || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!file || parsedData.length === 0 || isSuccess}
            onClick={handleConfirmImport}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            {isSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Imported Successfully!</span>
              </>
            ) : (
              <>
                <span>Import {parsedData.length > 0 ? `(${parsedData.length} Rows)` : ''}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
