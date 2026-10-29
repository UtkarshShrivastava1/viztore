import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { ReturnService } from '../return.service.js';
import { ReturnModel } from '../return.model.js';

describe('ReturnService Unit Tests (AUDIT-053)', () => {
  const storeId = new mongoose.Types.ObjectId().toString();
  const returnId = new mongoose.Types.ObjectId().toString();

  const mockReturnDoc = {
    _id: returnId,
    id: returnId,
    returnNumber: 'RTN-10025',
    orderId: 'ORD-1234',
    orderNumber: '#ORD10045',
    storeId,
    customer: {
      name: 'Rohan Verma',
      phone: '9876543210',
      email: 'rohan@example.com',
      address: '12 Green Park, Delhi',
    },
    product: {
      productId: 'prd-1',
      name: 'Men Cotton Shirt',
      variant: 'Blue, M',
      sku: 'MCS-001',
      price: 1049,
      quantity: 1,
      returnQuantity: 1,
    },
    returnType: 'Return',
    reason: 'Size too large',
    amount: 1049,
    status: 'Pending',
    returnDate: '18 May 2024',
    returnTime: '10:30 AM',
    refundMethod: 'Original Payment',
    refundAmount: 1049,
    pickupDate: '',
    pickupTime: '',
    rejectionReason: '',
    comments: 'Need one size down',
    save: vi.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createReturn', () => {
    it('should create a new return request with status Pending and generated returnNumber', async () => {
      vi.spyOn(ReturnModel, 'countDocuments').mockResolvedValue(24 as any);
      vi.spyOn(ReturnModel, 'create').mockResolvedValue(mockReturnDoc as any);

      const payload = {
        orderId: 'ORD-1234',
        orderNumber: '#ORD10045',
        customer: mockReturnDoc.customer,
        product: mockReturnDoc.product,
        returnType: 'Return',
        reason: 'Size too large',
        amount: 1049,
      };

      const result = await ReturnService.createReturn(payload, storeId);

      expect(ReturnModel.create).toHaveBeenCalled();
      expect(result.returnNumber).toBe('RTN-10025');
      expect(result.status).toBe('Pending');
    });

    it('should throw error when storeId is missing', async () => {
      await expect(
        ReturnService.createReturn({ orderId: 'ORD-1', orderNumber: '#ORD1' })
      ).rejects.toThrow('Store ID is required to initiate a return');
    });
  });

  describe('getStoreReturns', () => {
    it('should return paginated return items and summary KPIs', async () => {
      vi.spyOn(ReturnModel, 'find').mockReturnValue({
        sort: vi.fn().mockReturnValue({
          skip: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              lean: vi.fn().mockResolvedValue([mockReturnDoc]),
            }),
          }),
        }),
      } as any);

      vi.spyOn(ReturnModel, 'countDocuments').mockResolvedValue(1 as any);
      vi.spyOn(ReturnModel, 'aggregate').mockResolvedValue([
        {
          _id: null,
          totalReturns: 1,
          pendingReturns: 1,
          approvedReturns: 0,
          refundedCount: 0,
          rejectedCount: 0,
          totalRefundAmount: 0,
          pendingRefundAmount: 1049,
        },
      ] as any);

      const result = await ReturnService.getStoreReturns(storeId, { page: 1, limit: 10 });

      expect(result.returns).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.summary.totalReturns).toBe(1);
      expect(result.summary.pendingRefundAmount).toBe(1049);
    });
  });

  describe('approveReturn', () => {
    it('should transition status to Approved and store pickup schedule', async () => {
      const returnCopy = { ...mockReturnDoc, save: vi.fn().mockResolvedValue(true) };
      vi.spyOn(ReturnModel, 'findOne').mockResolvedValue(returnCopy as any);

      const result = await ReturnService.approveReturn(returnId, storeId, {
        pickupDate: '20 May 2024',
        pickupTime: '11:00 AM',
      });

      expect(result.status).toBe('Approved');
      expect(result.pickupDate).toBe('20 May 2024');
      expect(returnCopy.save).toHaveBeenCalled();
    });

    it('should reject transition if already Refunded', async () => {
      const refundedCopy = { ...mockReturnDoc, status: 'Refunded' };
      vi.spyOn(ReturnModel, 'findOne').mockResolvedValue(refundedCopy as any);

      await expect(
        ReturnService.approveReturn(returnId, storeId)
      ).rejects.toThrow('Cannot re-approve an already refunded return');
    });
  });

  describe('rejectReturn', () => {
    it('should transition status to Rejected and store rejection reason', async () => {
      const returnCopy = { ...mockReturnDoc, save: vi.fn().mockResolvedValue(true) };
      vi.spyOn(ReturnModel, 'findOne').mockResolvedValue(returnCopy as any);

      const result = await ReturnService.rejectReturn(returnId, storeId, 'Security tag broken');

      expect(result.status).toBe('Rejected');
      expect(result.rejectionReason).toBe('Security tag broken');
      expect(returnCopy.save).toHaveBeenCalled();
    });
  });

  describe('processRefund', () => {
    it('should transition status to Refunded and record refund amount', async () => {
      const returnCopy = { ...mockReturnDoc, save: vi.fn().mockResolvedValue(true) };
      vi.spyOn(ReturnModel, 'findOne').mockResolvedValue(returnCopy as any);

      const result = await ReturnService.processRefund(returnId, storeId, {
        refundAmount: 1049,
        refundMethod: 'UPI',
      });

      expect(result.status).toBe('Refunded');
      expect(result.refundAmount).toBe(1049);
      expect(result.refundMethod).toBe('UPI');
      expect(returnCopy.save).toHaveBeenCalled();
    });

    it('should throw error if return is already refunded', async () => {
      const refundedCopy = { ...mockReturnDoc, status: 'Refunded' };
      vi.spyOn(ReturnModel, 'findOne').mockResolvedValue(refundedCopy as any);

      await expect(
        ReturnService.processRefund(returnId, storeId)
      ).rejects.toThrow('Return is already refunded');
    });
  });

  describe('getMyReturns', () => {
    it('should return returns for customer phone number', async () => {
      vi.spyOn(ReturnModel, 'find').mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([mockReturnDoc]),
        }),
      } as any);

      const result = await ReturnService.getMyReturns('9876543210');
      expect(result).toHaveLength(1);
      expect(result[0].customer.phone).toBe('9876543210');
    });
  });
});

