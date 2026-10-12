/**
 * Universal CSV Export Utility for client-side downloads using Blob and URL.createObjectURL.
 * Handles comma escaping, quotes, UTF-8 BOM, and cross-browser download triggers.
 */

export function downloadCSV(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
): void {
  const sanitizeCell = (cell: string | number | boolean | null | undefined): string => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell);
    // If the value contains quotes, commas, or newlines, escape internal quotes and wrap in quotes
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const headerLine = headers.map(sanitizeCell).join(',');
  const rowLines = rows.map((row) => row.map(sanitizeCell).join(','));
  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const safeFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.setAttribute('download', safeFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Free allocated object URL
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
