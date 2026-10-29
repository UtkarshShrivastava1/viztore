import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { expenseService } from '../expense.service.js';
import {
  ExpenseModel,
  VendorModel,
  PurchaseBillModel,
  CreditNoteModel,
  EWayBillModel,
} from '../expense.model.js';
import { catalogModule } from '../../catalog/index.js';
import { ProductModel } from '../../catalog/product.model.js';

describe('ExpenseService Unit Tests (AUDIT-058)', () => {
  const storeId = new mongoose.Types.ObjectId().toString();
  const poId = new mongoose.Types.ObjectId().toString();
  const productId = new mongoose.Types.ObjectId().toString();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOverviewKPIs', () => {
    it('should aggregate purchase, expense, credit note, open POs, and eway bills', async () => {
      vi.spyOn(PurchaseBillModel, 'aggregate')
        .mockResolvedValueOnce([{ _id: null, total: 150000 }])
        .mockResolvedValueOnce([{ _id: null, total: 45000, count: 2 }]);
      vi.spyOn(ExpenseModel, 'aggregate').mockResolvedValueOnce([{ _id: null, total: 25000 }]);
      vi.spyOn(CreditNoteModel, 'aggregate').mockResolvedValueOnce([{ _id: null, total: 5000 }]);
      vi.spyOn(EWayBillModel, 'countDocuments').mockResolvedValueOnce(8 as any);

      const kpis = await expenseService.getOverviewKPIs(storeId);

      expect(kpis.totalPurchase).toBe(150000);
      expect(kpis.totalExpense).toBe(25000);
      expect(kpis.totalCreditNote).toBe(5000);
      expect(kpis.openPurchaseOrders).toBe(45000);
      expect(kpis.openPOCount).toBe(2);
      expect(kpis.eWayBillsCount).toBe(8);
    });
  });

  describe('createExpense & deleteExpense', () => {
    it('should record an operating expense and generate expenseNo', async () => {
      vi.spyOn(ExpenseModel, 'countDocuments').mockResolvedValueOnce(3 as any);
      vi.spyOn(ExpenseModel, 'create').mockResolvedValueOnce({
        _id: new mongoose.Types.ObjectId(),
        expenseNo: 'EXP-2026-000004',
        category: 'Utilities',
        amount: 2500,
        status: 'Paid',
      } as any);

      const result = await expenseService.createExpense(storeId, {
        category: 'Utilities',
        description: 'Electricity Bill',
        amount: 2500,
        paymentMethod: 'UPI',
        status: 'Paid',
      });

      expect(result.expenseNo).toBe('EXP-2026-000004');
      expect(result.amount).toBe(2500);
    });

    it('should delete an expense record by ID', async () => {
      const expId = new mongoose.Types.ObjectId().toString();
      vi.spyOn(ExpenseModel, 'findOneAndDelete').mockResolvedValueOnce({ _id: expId } as any);

      const res = await expenseService.deleteExpense(storeId, expId);
      expect(res.success).toBe(true);
    });
  });

  describe('createVendor', () => {
    it('should register a new vendor and assign vendorCode', async () => {
      vi.spyOn(VendorModel, 'countDocuments').mockResolvedValueOnce(5 as any);
      vi.spyOn(VendorModel, 'create').mockResolvedValueOnce({
        _id: new mongoose.Types.ObjectId(),
        vendorCode: 'VND-006',
        vendorName: 'Apex Textiles Ltd',
        status: 'Active',
      } as any);

      const vendor = await expenseService.createVendor(storeId, {
        vendorName: 'Apex Textiles Ltd',
        contactPerson: 'Rahul Verma',
        phone: '9876543210',
        city: 'Surat',
        status: 'Active',
      });

      expect(vendor.vendorCode).toBe('VND-006');
      expect(vendor.vendorName).toBe('Apex Textiles Ltd');
    });
  });

  describe('createPurchaseBill & receivePurchaseOrder', () => {
    it('should create a purchase order and update vendor totalPurchases', async () => {
      vi.spyOn(PurchaseBillModel, 'countDocuments').mockResolvedValueOnce(10 as any);
      vi.spyOn(PurchaseBillModel, 'create').mockResolvedValueOnce({
        _id: poId,
        billNumber: 'PO-2026-000011',
        vendor: 'Apex Textiles Ltd',
        totalAmount: 35000,
        paymentStatus: 'Unpaid',
        status: 'Pending',
        type: 'Purchase Order',
      } as any);
      const updateVendorSpy = vi.spyOn(VendorModel, 'updateOne').mockResolvedValueOnce({} as any);

      const created = await expenseService.createPurchaseBill(storeId, {
        vendor: 'Apex Textiles Ltd',
        itemsCount: '10 items',
        totalAmount: 35000,
        paymentStatus: 'Unpaid',
        type: 'Purchase Order',
      });

      expect(created.billNumber).toBe('PO-2026-000011');
      expect(updateVendorSpy).toHaveBeenCalledWith(
        { storeId, vendorName: 'Apex Textiles Ltd' },
        { $inc: { totalPurchases: 35000 } },
      );
    });

    it('should receive a purchase order, mark as Paid and Received, and increment catalog stock', async () => {
      const mockPo = {
        _id: poId,
        storeId,
        billNumber: 'PO-2026-000011',
        paymentStatus: 'Unpaid',
        status: 'Pending',
        itemsCount: '5 items',
        items: [
          {
            productId,
            name: 'Cotton Shirt',
            quantity: 5,
          },
        ],
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(PurchaseBillModel, 'findOne').mockResolvedValueOnce(mockPo as any);
      const restoreStockSpy = vi.spyOn(catalogModule, 'restoreStock').mockResolvedValueOnce(undefined);

      const received = await expenseService.receivePurchaseOrder(storeId, poId);

      expect(mockPo.paymentStatus).toBe('Paid');
      expect(mockPo.status).toBe('Received');
      expect(mockPo.save).toHaveBeenCalled();
      expect(restoreStockSpy).toHaveBeenCalledWith([
        {
          productId,
          sku: undefined,
          quantity: 5,
        },
      ]);
      expect(received).toBe(mockPo);
    });

    it('should fallback to active store product when PO items list is empty on receive', async () => {
      const mockPo = {
        _id: poId,
        storeId,
        billNumber: 'PO-2026-000012',
        paymentStatus: 'Unpaid',
        status: 'Pending',
        itemsCount: '12 items',
        items: [],
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(PurchaseBillModel, 'findOne').mockResolvedValueOnce(mockPo as any);
      vi.spyOn(ProductModel, 'findOne').mockResolvedValueOnce({
        _id: new mongoose.Types.ObjectId(productId),
      } as any);
      const restoreStockSpy = vi.spyOn(catalogModule, 'restoreStock').mockResolvedValueOnce(undefined);

      await expenseService.receivePurchaseOrder(storeId, poId);

      expect(restoreStockSpy).toHaveBeenCalledWith([
        {
          productId,
          quantity: 12,
        },
      ]);
    });
  });
});
