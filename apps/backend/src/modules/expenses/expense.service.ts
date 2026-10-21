import mongoose from 'mongoose';
import {
  CreateExpenseDto,
  CreateVendorDto,
  CreatePurchaseBillDto,
  CreateCreditNoteDto,
  CreateEWayBillDto,
  IExpenseOverviewKPIs,
  IPurchaseTransaction,
} from '@repo/shared-types';
import {
  ExpenseModel,
  VendorModel,
  PurchaseBillModel,
  CreditNoteModel,
  EWayBillModel,
} from './expense.model.js';
import { AppError } from '../../shared/utils/AppError.js';

export const expenseService = {
  /**
   * Get Overview KPIs for Store
   */
  async getOverviewKPIs(storeId: string): Promise<IExpenseOverviewKPIs> {
    const sId = new mongoose.Types.ObjectId(storeId);

    const [purchaseAgg, expenseAgg, creditNoteAgg, openPOAgg, ewayCount] = await Promise.all([
      PurchaseBillModel.aggregate([
        { $match: { storeId: sId } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      ExpenseModel.aggregate([
        { $match: { storeId: sId } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      CreditNoteModel.aggregate([
        { $match: { storeId: sId } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      PurchaseBillModel.aggregate([
        { $match: { storeId: sId, type: 'Purchase Order', paymentStatus: 'Unpaid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      ]),
      EWayBillModel.countDocuments({ storeId: sId, status: { $ne: 'Cancelled' } }),
    ]);

    return {
      totalPurchase: purchaseAgg[0]?.total || 0,
      totalExpense: expenseAgg[0]?.total || 0,
      totalCreditNote: creditNoteAgg[0]?.total || 0,
      openPurchaseOrders: openPOAgg[0]?.total || 0,
      openPOCount: openPOAgg[0]?.count || 0,
      eWayBillsCount: ewayCount || 0,
    };
  },

  /**
   * Unified Chronological Transactions Feed
   */
  async getAllTransactions(storeId: string): Promise<IPurchaseTransaction[]> {
    const sId = new mongoose.Types.ObjectId(storeId);

    const [purchases, expenses, creditNotes, ewayBills] = await Promise.all([
      PurchaseBillModel.find({ storeId: sId }).sort({ createdAt: -1 }).limit(50).lean(),
      ExpenseModel.find({ storeId: sId }).sort({ createdAt: -1 }).limit(50).lean(),
      CreditNoteModel.find({ storeId: sId }).sort({ createdAt: -1 }).limit(50).lean(),
      EWayBillModel.find({ storeId: sId }).sort({ createdAt: -1 }).limit(50).lean(),
    ]);

    const txns: IPurchaseTransaction[] = [];

    purchases.forEach((p) => {
      txns.push({
        id: p._id.toString(),
        date: p.date,
        time: p.time,
        referenceNo: p.billNumber,
        type: p.type === 'Purchase Order' ? 'Purchase Order' : 'Purchase',
        vendorOrPaidTo: p.vendor,
        category: 'Inventory',
        amount: p.type === 'Purchase Order' ? p.totalAmount : -p.totalAmount,
        status: (p.paymentStatus === 'Paid' ? 'Paid' : 'Open') as any,
      });
    });

    expenses.forEach((e) => {
      txns.push({
        id: e._id.toString(),
        date: e.date,
        time: e.time,
        referenceNo: e.expenseNo,
        type: 'Expense',
        vendorOrPaidTo: e.description,
        category: e.category,
        amount: -e.amount,
        status: (e.status === 'Paid' ? 'Paid' : 'Pending') as any,
      });
    });

    creditNotes.forEach((c) => {
      txns.push({
        id: c._id.toString(),
        date: c.date,
        time: c.time,
        referenceNo: c.creditNoteNo,
        type: 'Credit Note',
        vendorOrPaidTo: c.vendor,
        category: 'Returns / Credit',
        amount: c.amount,
        status: (c.status === 'Processed' ? 'Processed' : 'Open') as any,
      });
    });

    ewayBills.forEach((ew) => {
      txns.push({
        id: ew._id.toString(),
        date: ew.date,
        time: ew.time,
        referenceNo: ew.eWayBillNo,
        type: 'E-Way Bill',
        vendorOrPaidTo: ew.vendor,
        category: 'Logistics',
        amount: 0,
        status: 'Generated' as any,
      });
    });

    return txns;
  },

  /**
   * Expenses
   */
  async getExpenses(storeId: string) {
    return ExpenseModel.find({ storeId }).sort({ createdAt: -1 }).lean();
  },

  async createExpense(storeId: string, dto: CreateExpenseDto) {
    const count = await ExpenseModel.countDocuments({ storeId });
    const now = new Date();
    const dateStr = dto.date || now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = dto.time || now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const expenseNo = `EXP-${now.getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    return ExpenseModel.create({
      storeId: new mongoose.Types.ObjectId(storeId),
      expenseNo,
      date: dateStr,
      time: timeStr,
      category: dto.category,
      description: dto.description,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      status: dto.status,
      notes: dto.notes,
    });
  },

  async deleteExpense(storeId: string, expenseId: string) {
    const deleted = await ExpenseModel.findOneAndDelete({ _id: expenseId, storeId });
    if (!deleted) throw AppError.notFound('Expense not found');
    return { success: true };
  },

  /**
   * Vendors
   */
  async getVendors(storeId: string) {
    return VendorModel.find({ storeId }).sort({ vendorName: 1 }).lean();
  },

  async createVendor(storeId: string, dto: CreateVendorDto) {
    const count = await VendorModel.countDocuments({ storeId });
    const vendorCode = `VND-${String(count + 1).padStart(3, '0')}`;

    return VendorModel.create({
      storeId: new mongoose.Types.ObjectId(storeId),
      vendorCode,
      vendorName: dto.vendorName,
      contactPerson: dto.contactPerson,
      phone: dto.phone,
      email: dto.email || '',
      city: dto.city,
      totalPurchases: 0,
      status: dto.status,
    });
  },

  /**
   * Purchase Bills & Purchase Orders
   */
  async getPurchaseBills(storeId: string, type?: string) {
    const filter: Record<string, any> = { storeId };
    if (type) filter.type = type;
    return PurchaseBillModel.find(filter).sort({ createdAt: -1 }).lean();
  },

  async createPurchaseBill(storeId: string, dto: CreatePurchaseBillDto) {
    const count = await PurchaseBillModel.countDocuments({ storeId });
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const prefix = dto.type === 'Purchase Order' ? 'PO' : 'BILL';
    const billNumber = `${prefix}-${now.getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    const created = await PurchaseBillModel.create({
      storeId: new mongoose.Types.ObjectId(storeId),
      billNumber,
      date: dateStr,
      time: timeStr,
      vendor: dto.vendor,
      itemsCount: dto.itemsCount,
      totalAmount: dto.totalAmount,
      paymentStatus: dto.paymentStatus,
      dueDate: dto.dueDate || '',
      type: dto.type,
    });

    // Update vendor totalPurchases
    await VendorModel.updateOne(
      { storeId, vendorName: dto.vendor },
      { $inc: { totalPurchases: dto.totalAmount } },
    );

    return created;
  },

  /**
   * Credit Notes
   */
  async getCreditNotes(storeId: string) {
    return CreditNoteModel.find({ storeId }).sort({ createdAt: -1 }).lean();
  },

  async createCreditNote(storeId: string, dto: CreateCreditNoteDto) {
    const count = await CreditNoteModel.countDocuments({ storeId });
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const creditNoteNo = `CN-${now.getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    return CreditNoteModel.create({
      storeId: new mongoose.Types.ObjectId(storeId),
      creditNoteNo,
      date: dateStr,
      time: timeStr,
      referencePurchase: dto.referencePurchase,
      vendor: dto.vendor,
      reasonType: dto.reasonType,
      amount: dto.amount,
      status: 'Pending',
    });
  },

  /**
   * E-Way Bills
   */
  async getEWayBills(storeId: string) {
    return EWayBillModel.find({ storeId }).sort({ createdAt: -1 }).lean();
  },

  async createEWayBill(storeId: string, dto: CreateEWayBillDto) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const random12 = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
    const eWayBillNo = `${random12.slice(0, 4)} ${random12.slice(4, 8)} ${random12.slice(8, 12)}`;

    return EWayBillModel.create({
      storeId: new mongoose.Types.ObjectId(storeId),
      eWayBillNo,
      date: dateStr,
      time: timeStr,
      invoiceBillNo: dto.invoiceBillNo,
      vendor: dto.vendor,
      fromTo: dto.fromTo,
      distanceKm: dto.distanceKm,
      validTill: dto.validTill || '',
      status: 'Active',
    });
  },
};
