import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { SettlementService } from '../settlement.service.js';
import { SettlementModel, BankAccountModel } from '../settlement.model.js';
import { OrderModel } from '../../orders/order.model.js';

describe('SettlementService Unit Tests (AUDIT-056)', () => {
  const storeId = new mongoose.Types.ObjectId().toString();
  const settlementId = new mongoose.Types.ObjectId().toString();

  const mockSettlementDoc = {
    _id: settlementId,
    id: settlementId,
    settlementId: '#SETTLE-1001',
    storeId,
    settlementDate: '29 Oct 2026',
    period: '22 Oct - 29 Oct 2026',
    orderCount: 5,
    grossAmount: 10000,
    commissionFee: 500,
    deliveryFeeSplit: 150,
    tdsAmount: 100,
    deductions: 600,
    netPayoutAmount: 9400,
    status: 'Settled',
    bankAccount: 'HDFC Bank ••••5678',
    utrNumber: 'AXIS123456789012',
    settledAt: new Date().toISOString(),
  };

  const mockBankAccountDoc = {
    _id: new mongoose.Types.ObjectId().toString(),
    storeId,
    accountName: 'National Store Pvt Ltd',
    bankName: 'HDFC Bank',
    accountNumber: '50200012345678',
    ifscCode: 'HDFC0001234',
    accountType: 'Current Account',
    branch: 'Bhilai',
    isVerified: true,
    payoutMode: 'NEFT / RTGS',
    payoutFrequency: 'Weekly',
    payoutDay: 'Wednesday',
    enableThreshold: false,
    thresholdAmount: 5000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStoreSettlementOverview', () => {
    it('should aggregate delivered orders and compute net payout and fees', async () => {
      vi.spyOn(SettlementModel, 'aggregate').mockResolvedValue([
        {
          totalSettledAllTime: 50000,
          totalPayoutsMonth: 20000,
          pendingBalance: 5000,
        },
      ] as any);

      vi.spyOn(OrderModel, 'find').mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([
            { pricing: { totalAmount: 2000, deliveryFee: 40 } },
            { pricing: { totalAmount: 3000, deliveryFee: 60 } },
          ]),
        }),
      } as any);

      vi.spyOn(SettlementModel, 'find').mockReturnValue({
        sort: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue([mockSettlementDoc]),
          }),
        }),
      } as any);

      const overview = await SettlementService.getStoreSettlementOverview(storeId);

      expect(overview.totalSettledAllTime).toBe(50000);
      expect(overview.totalPayoutsMonth).toBe(20000);
      expect(overview.pendingBalance).toBe(5000);
      expect(overview.currentCycle.grossAmount).toBe(5000);
      expect(overview.currentCycle.commissionFee).toBe(250); // 5% of 5000
      expect(overview.currentCycle.taxes).toBe(50); // 1% TDS
      expect(overview.availableForPayout).toBe(4700); // 5000 - 250 - 50
    });
  });

  describe('generateSettlement', () => {
    it('should generate settlement record with unique ID and UTR', async () => {
      vi.spyOn(SettlementModel, 'countDocuments').mockResolvedValue(0 as any);
      vi.spyOn(SettlementModel, 'create').mockResolvedValue(mockSettlementDoc as any);

      const result = await SettlementService.generateSettlement(storeId, {
        grossAmount: 10000,
        orderCount: 5,
        bankAccount: 'HDFC Bank ••••5678',
      });

      expect(SettlementModel.create).toHaveBeenCalled();
      expect(result.settlementId).toBe('#SETTLE-1001');
      expect(result.status).toBe('Settled');
    });
  });

  describe('saveBankAccount & getBankAccount', () => {
    it('should upsert and return verified bank account for merchant store', async () => {
      vi.spyOn(BankAccountModel, 'findOneAndUpdate').mockResolvedValue(mockBankAccountDoc as any);
      vi.spyOn(BankAccountModel, 'findOne').mockResolvedValue(mockBankAccountDoc as any);

      const saved = await SettlementService.saveBankAccount(storeId, {
        accountName: 'National Store Pvt Ltd',
        bankName: 'HDFC Bank',
        accountNumber: '50200012345678',
        ifscCode: 'HDFC0001234',
      });

      expect(saved.isVerified).toBe(true);

      const fetched = await SettlementService.getBankAccount(storeId);
      expect(fetched?.bankName).toBe('HDFC Bank');
    });
  });

  describe('requestPayout', () => {
    it('should create an on-demand pending payout request', async () => {
      vi.spyOn(BankAccountModel, 'findOne').mockResolvedValue(mockBankAccountDoc as any);
      vi.spyOn(SettlementModel, 'countDocuments').mockResolvedValue(10 as any);

      const mockRequestDoc = {
        ...mockSettlementDoc,
        settlementId: '#REQ-1011',
        status: 'Pending',
        netPayoutAmount: 2500,
        grossAmount: 2500,
      };
      vi.spyOn(SettlementModel, 'create').mockResolvedValue(mockRequestDoc as any);

      const res = await SettlementService.requestPayout(storeId, 2500, 'Urgent store withdrawal');
      expect(res.status).toBe('Pending');
      expect(res.settlementId).toBe('#REQ-1011');
      expect(res.netPayoutAmount).toBe(2500);
    });
  });
});

