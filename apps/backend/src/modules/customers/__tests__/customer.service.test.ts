import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { CustomerService } from '../customer.service.js';
import { CustomerModel, CustomerTransactionModel } from '../customer.model.js';
import { CustomerType, CustomerStatus, CustomerTier } from '@repo/shared-types';

describe('CustomerService Unit Tests (AUDIT-054)', () => {
  let customerService: CustomerService;
  const storeId = new mongoose.Types.ObjectId().toString();
  const customerId = new mongoose.Types.ObjectId().toString();

  const mockCustomerDoc = {
    _id: customerId,
    id: customerId,
    storeId: new mongoose.Types.ObjectId(storeId),
    name: 'Ramesh Kumar',
    displayName: 'Ramesh Store',
    customerType: CustomerType.RETAILER,
    phone: '9876543210',
    email: 'ramesh@example.com',
    customerCode: 'CUS-1001',
    creditLimit: 25000,
    paymentTerms: '15 Days',
    creditPeriodDays: 15,
    outstandingAmount: 5000,
    totalSales: 50000,
    storeCredit: 1000,
    loyaltyPoints: 500,
    totalOrders: 5,
    status: CustomerStatus.ACTIVE,
    tier: CustomerTier.REGULAR,
    billingAddress: {
      addressLine1: 'Shop 4, Market Road',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      country: 'India',
      sameAsShipping: true,
    },
    save: vi.fn().mockResolvedValue(true),
  };

  const mockTransactionDoc = {
    _id: new mongoose.Types.ObjectId().toString(),
    storeId: new mongoose.Types.ObjectId(storeId),
    customerId: new mongoose.Types.ObjectId(customerId),
    type: 'Invoice',
    referenceNo: 'INV-1001',
    amount: 5000,
    balanceAfter: 5000,
    date: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    customerService = new CustomerService();
  });

  describe('createCustomer', () => {
    it('should create customer and assign sequential customer code', async () => {
      vi.spyOn(CustomerModel, 'countDocuments').mockResolvedValue(0 as any);
      vi.spyOn(CustomerModel, 'create').mockResolvedValue({
        ...mockCustomerDoc,
        customerCode: 'CUS-1001',
      } as any);
      vi.spyOn(CustomerTransactionModel, 'create').mockResolvedValue(mockTransactionDoc as any);

      const result = await customerService.createCustomer(storeId, {
        name: 'Ramesh Kumar',
        phone: '9876543210',
        customerType: CustomerType.RETAILER,
        creditLimit: 25000,
        paymentTerms: '15 Days',
        creditPeriodDays: 15,
        openingBalance: 5000,
        status: CustomerStatus.ACTIVE,
      });

      expect(CustomerModel.countDocuments).toHaveBeenCalledWith({ storeId });
      expect(CustomerModel.create).toHaveBeenCalled();
      expect(CustomerTransactionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Invoice',
          referenceNo: 'OPENING_BAL',
          amount: 5000,
        }),
      );
      expect(result.customerCode).toBe('CUS-1001');
    });
  });

  describe('getCustomers', () => {
    it('should query customers with pagination and live KPI aggregations', async () => {
      const mockQuery = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([mockCustomerDoc]),
      };
      vi.spyOn(CustomerModel, 'find').mockReturnValue(mockQuery as any);
      vi.spyOn(CustomerModel, 'countDocuments').mockResolvedValue(1 as any);
      vi.spyOn(CustomerModel, 'aggregate').mockResolvedValue([
        { totalCustomers: 1, totalSales: 50000, totalOutstanding: 5000 },
      ] as any);

      const res = await customerService.getCustomers(storeId, {
        page: 1,
        limit: 10,
        search: 'Ramesh',
      });

      expect(res.customers).toHaveLength(1);
      expect(res.pagination.total).toBe(1);
      expect(res.kpis.totalCustomers).toBe(1);
      expect(res.kpis.totalSales).toBe(50000);
      expect(res.kpis.totalOutstanding).toBe(5000);
    });
  });

  describe('getCustomerById', () => {
    it('should return customer profile with Khata transactions', async () => {
      vi.spyOn(CustomerModel, 'findOne').mockResolvedValue(mockCustomerDoc as any);
      const mockTxQuery = {
        sort: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockTransactionDoc]),
      };
      vi.spyOn(CustomerTransactionModel, 'find').mockReturnValue(mockTxQuery as any);

      const res = await customerService.getCustomerById(storeId, customerId);

      expect(res.customer.name).toBe('Ramesh Kumar');
      expect(res.statementTransactions).toHaveLength(1);
      expect(res.statementTransactions[0].referenceNo).toBe('INV-1001');
    });

    it('should throw not found error for non-existent customer', async () => {
      vi.spyOn(CustomerModel, 'findOne').mockResolvedValue(null);

      await expect(
        customerService.getCustomerById(storeId, 'non-existent-id'),
      ).rejects.toThrow('Customer not found');
    });
  });

  describe('adjustStoreCredit', () => {
    it('should adjust store credit balance and record transaction', async () => {
      const customer = { ...mockCustomerDoc, storeCredit: 1000, save: vi.fn().mockResolvedValue(true) };
      vi.spyOn(CustomerModel, 'findOne').mockResolvedValue(customer as any);
      vi.spyOn(CustomerTransactionModel, 'create').mockResolvedValue(mockTransactionDoc as any);

      await customerService.adjustStoreCredit(storeId, customerId, {
        amount: 500,
        type: 'add',
        reason: 'Courtesy adjustment for delivery delay',
      });

      expect(customer.storeCredit).toBe(1500);
      expect(customer.save).toHaveBeenCalled();
      expect(CustomerTransactionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Credit_Adjustment',
          amount: 500,
        }),
      );
    });
  });

  describe('recordPayment', () => {
    it('should decrement customer outstanding Khata balance and log Payment transaction', async () => {
      const customer = { ...mockCustomerDoc, outstandingAmount: 5000, save: vi.fn().mockResolvedValue(true) };
      vi.spyOn(CustomerModel, 'findOne').mockResolvedValue(customer as any);
      vi.spyOn(CustomerTransactionModel, 'create').mockResolvedValue(mockTransactionDoc as any);

      await customerService.recordPayment(storeId, customerId, {
        amount: 2000,
        paymentMethod: 'upi',
        notes: 'UPI payment at counter',
      });

      expect(customer.outstandingAmount).toBe(3000);
      expect(customer.save).toHaveBeenCalled();
      expect(CustomerTransactionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Payment',
          amount: -2000,
          balanceAfter: 3000,
        }),
      );
    });
  });

  describe('upsertFromOrderOrInvoice', () => {
    it('should update existing customer and log sale transaction on order creation', async () => {
      const customer = {
        ...mockCustomerDoc,
        totalSales: 50000,
        outstandingAmount: 5000,
        totalOrders: 5,
        save: vi.fn().mockResolvedValue(true),
      };
      vi.spyOn(CustomerModel, 'findOne').mockResolvedValue(customer as any);
      vi.spyOn(CustomerTransactionModel, 'create').mockResolvedValue(mockTransactionDoc as any);

      await customerService.upsertFromOrderOrInvoice(storeId, {
        name: 'Ramesh Kumar',
        phone: '9876543210',
        totalAmount: 1500,
        dueAmount: 0,
        referenceNo: 'ORD-98124',
      });

      expect(customer.totalSales).toBe(51500);
      expect(customer.totalOrders).toBe(6);
      expect(customer.save).toHaveBeenCalled();
      expect(CustomerTransactionModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Invoice',
          referenceNo: 'ORD-98124',
          amount: 1500,
        }),
      );
    });
  });
});

