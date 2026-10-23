import React from 'react';
import { useExpenseStore } from '../../stores/expenseStore.js';
import { CsvDropzoneModal } from '../common/CsvDropzoneModal.js';

export const ImportProcurementModal: React.FC = () => {
  const { isImportModalOpen, importType, closeImportModal, importCsvData } = useExpenseStore();

  if (!isImportModalOpen || !importType) return null;

  const getModalConfig = () => {
    switch (importType) {
      case 'vendors':
        return {
          title: 'Import Vendors Directory',
          subtitle: 'Upload a CSV file containing your suppliers, contact info, and tax credentials.',
          sampleFilename: 'sample_vendors_template.csv',
          sampleHeaders: [
            'Vendor Code',
            'Vendor Name',
            'Contact Person',
            'Phone',
            'Email',
            'City',
            'Category',
            'GSTIN',
            'Payment Terms',
            'Credit Limit',
            'Opening Balance',
          ],
          sampleRows: [
            [
              'VND-029',
              'Surya Textiles',
              'Ramesh Kumar',
              '9827011223',
              'ramesh@suryatex.com',
              'Raipur',
              'Inventory (Apparel)',
              '22ABCDE1234F1Z5',
              'Net 30',
              '100000',
              '0',
            ],
            [
              'VND-030',
              'Kailash Footwear',
              'Kailash Chand',
              '9425233445',
              'kailash@kailashfootwear.in',
              'Bhilai',
              'Inventory (Footwear)',
              '22FGHIJ5678K1Z9',
              'Net 15',
              '75000',
              '2500',
            ],
          ],
        };
      case 'purchases':
        return {
          title: 'Import Purchases & Bills',
          subtitle: 'Bulk upload purchase invoices and inventory procurement receipts.',
          sampleFilename: 'sample_purchases_template.csv',
          sampleHeaders: ['Reference No', 'Date', 'Vendor', 'Category', 'Amount', 'Status'],
          sampleRows: [
            ['BILL-2024-000130', '12 May 2024', 'Sharma Enterprises', 'Inventory (Apparel)', '35000', 'Paid'],
            ['BILL-2024-000131', '14 May 2024', 'Gupta Traders', 'Inventory (Footwear)', '18500', 'Paid'],
          ],
        };
      case 'expenses':
        return {
          title: 'Import Operational Expenses',
          subtitle: 'Bulk ingest recurring store expenses, maintenance bills, and utility slips.',
          sampleFilename: 'sample_expenses_template.csv',
          sampleHeaders: ['Reference No', 'Date', 'Category', 'Description', 'Amount', 'Payment Method'],
          sampleRows: [
            ['EXP-2024-000150', '12 May 2024', 'Office Supplies', 'Thermal Receipt Paper Rolls', '3200', 'UPI'],
            ['EXP-2024-000151', '14 May 2024', 'Logistics', 'Inter-branch Dispatch Van', '1800', 'Cash'],
          ],
        };
      default:
        return {
          title: 'Import CSV',
          subtitle: 'Upload a CSV document.',
          sampleFilename: 'sample.csv',
          sampleHeaders: [],
          sampleRows: [],
        };
    }
  };

  const config = getModalConfig();

  return (
    <CsvDropzoneModal
      isOpen={isImportModalOpen}
      onClose={closeImportModal}
      title={config.title}
      subtitle={config.subtitle}
      sampleHeaders={config.sampleHeaders}
      sampleRows={config.sampleRows}
      sampleFilename={config.sampleFilename}
      onImport={(rows) => {
        importCsvData(importType, rows);
      }}
    />
  );
};
