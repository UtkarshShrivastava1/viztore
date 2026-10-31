import { z } from 'zod';

export type PurchaseSubTab =
  | 'all'
  | 'orders'
  | 'bills'
  | 'expenses'
  | 'credit_notes'
  | 'eway_bills'
  | 'vendors';

export interface IPurchaseTransaction {
  id: string;
  date: string;
  time: string;
  referenceNo: string;
  type: 'Purchase' | 'Expense' | 'Purchase Order' | 'Credit Note' | 'E-Way Bill';
  vendorOrPaidTo: string;
  category: string;
  amount: number;
  status: 'Paid' | 'Open' | 'Processed' | 'Generated' | 'Partially Received' | 'Pending';
}

export interface IPurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  time: string;
  vendor: string;
  itemsCount: string;
  totalAmount: number;
  expectedDate: string;
  status: 'Pending' | 'Partially Received' | 'Received' | 'Cancelled';
}

export interface IPurchaseItem {
  productId?: string;
  name?: string;
  sku?: string;
  quantity: number;
  unitPrice?: number;
}

export interface IPurchaseBill {
  id: string;
  billNumber: string;
  date: string;
  time: string;
  vendor: string;
  itemsCount: string;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid';
  dueDate: string;
  type?: string;
  status?: 'Pending' | 'Partially Received' | 'Received' | 'Cancelled';
  items?: IPurchaseItem[];
}

export interface IExpenseItem {
  id: string;
  expenseNo: string;
  date: string;
  time: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  status: 'Paid' | 'Pending' | 'Partially Paid';
}

export interface ICreditNoteItem {
  id: string;
  creditNoteNo: string;
  date: string;
  time: string;
  referencePurchase: string;
  vendor: string;
  reasonType: string;
  amount: number;
  status: 'Pending' | 'Processed' | 'Cancelled';
}

export interface IEWayBillItem {
  id: string;
  eWayBillNo: string;
  date: string;
  time: string;
  invoiceBillNo: string;
  vendor: string;
  fromTo: string;
  distanceKm: number;
  validTill: string;
  status: 'Active' | 'In Transit' | 'Expired' | 'Cancelled';
}

export interface IVendorItem {
  id: string;
  vendorCode: string;
  vendorName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  totalPurchases: number;
  status: 'Active' | 'Inactive' | 'Blocked';
}

export interface IExpenseOverviewKPIs {
  totalPurchase: number;
  totalExpense: number;
  totalCreditNote: number;
  openPurchaseOrders: number;
  openPOCount: number;
  eWayBillsCount: number;
}

// Zod Validation Schemas
export const createExpenseSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be greater than zero'),
  paymentMethod: z.string().default('Cash'),
  status: z.enum(['Paid', 'Pending', 'Partially Paid']).default('Paid'),
  date: z.string().optional(),
  time: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const createVendorSchema = z.object({
  vendorName: z.string().min(2, 'Vendor name is required'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  phone: z.string().min(8, 'Valid phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  city: z.string().min(2, 'City is required'),
  status: z.enum(['Active', 'Inactive', 'Blocked']).default('Active'),
});

export const purchaseItemSchema = z.object({
  productId: z.string().optional(),
  name: z.string().optional(),
  sku: z.string().optional(),
  quantity: z.number().positive().default(1),
  unitPrice: z.number().nonnegative().optional(),
}).passthrough();

export const createPurchaseBillSchema = z.object({
  vendor: z.string().optional(),
  vendorName: z.string().optional(),
  itemsCount: z.string().default('1 item'),
  totalAmount: z.number().positive('Total amount must be greater than zero'),
  paymentStatus: z.string().default('Unpaid'),
  status: z.enum(['Pending', 'Partially Received', 'Received', 'Cancelled']).optional(),
  dueDate: z.string().optional(),
  type: z.enum(['Purchase', 'Purchase Order', 'Direct Purchase']).default('Purchase'),
  items: z.array(purchaseItemSchema).optional(),
}).passthrough().transform((d) => ({
  ...d,
  vendor: d.vendor || d.vendorName || 'Unknown Vendor',
  paymentStatus: (d.paymentStatus?.toLowerCase() === 'paid' ? 'Paid' : d.paymentStatus?.toLowerCase() === 'partial' || d.paymentStatus === 'Partially Paid' ? 'Partially Paid' : 'Unpaid') as 'Paid' | 'Partially Paid' | 'Unpaid',
}));

export const createCreditNoteSchema = z.object({
  referencePurchase: z.string().min(1, 'Reference purchase is required'),
  vendor: z.string().min(1, 'Vendor is required'),
  reasonType: z.string().min(1, 'Reason is required'),
  amount: z.number().positive('Amount must be positive'),
});

export const createEWayBillSchema = z.object({
  invoiceBillNo: z.string().min(1, 'Invoice/Bill number is required'),
  vendor: z.string().min(1, 'Vendor is required'),
  fromTo: z.string().min(1, 'Route (From -> To) is required'),
  distanceKm: z.number().positive('Distance must be positive'),
  validTill: z.string().optional(),
});

export type PurchaseItemDto = z.infer<typeof purchaseItemSchema>;
export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
export type CreateVendorDto = z.infer<typeof createVendorSchema>;
export type CreatePurchaseBillDto = z.infer<typeof createPurchaseBillSchema>;
export type CreateCreditNoteDto = z.infer<typeof createCreditNoteSchema>;
export type CreateEWayBillDto = z.infer<typeof createEWayBillSchema>;
