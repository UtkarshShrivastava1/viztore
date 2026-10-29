import { SettlementModel, BankAccountModel, ISettlementDoc, IBankAccountDoc } from './settlement.model.js';
import { OrderModel } from '../orders/order.model.js';
import { AppError } from '../../shared/utils/AppError.js';
import { logger } from '../../shared/utils/logger.js';
import type { ISettlement, ISettlementOverview, ISettlementBankAccount } from '@repo/shared-types';

export class SettlementService {
  /**
   * Get comprehensive settlement and payout overview for a store
   */
  static async getStoreSettlementOverview(storeId: string): Promise<ISettlementOverview> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // 1. Fetch settled totals
    const settledStats = await SettlementModel.aggregate([
      { $match: { storeId } },
      {
        $group: {
          _id: null,
          totalSettledAllTime: {
            $sum: { $cond: [{ $eq: ['$status', 'Settled'] }, '$netPayoutAmount', 0] },
          },
          totalPayoutsMonth: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', 'Settled'] },
                    { $gte: ['$settledAt', startOfMonth] },
                  ],
                },
                '$netPayoutAmount',
                0,
              ],
            },
          },
          pendingBalance: {
            $sum: {
              $cond: [
                { $in: ['$status', ['Pending', 'Processing', 'In Transit']] },
                '$netPayoutAmount',
                0,
              ],
            },
          },
        },
      },
    ]);

    const stats = settledStats[0] || {
      totalSettledAllTime: 0,
      totalPayoutsMonth: 0,
      pendingBalance: 0,
    };

    // 2. Compute current active cycle earnings from delivered store orders
    const deliveredOrders = await OrderModel.find({
      storeId,
      status: 'DELIVERED',
    })
      .sort({ createdAt: -1 })
      .lean();

    const orderCount = deliveredOrders.length;
    const grossAmount = deliveredOrders.reduce((sum, o: any) => sum + (o.pricing?.totalAmount || 0), 0);
    const commissionFee = Math.round(grossAmount * 0.05 * 100) / 100; // 5% platform commission
    const deliveryFees = Math.round(deliveredOrders.reduce((sum, o: any) => sum + (o.pricing?.deliveryFee || 0), 0) * 100) / 100;
    const taxes = Math.round(grossAmount * 0.01 * 100) / 100; // 1% Indian TDS section 194-O
    const netPayoutAmount = Math.max(0, grossAmount - commissionFee - taxes);

    const periodStr = `${new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;

    // 3. Fetch recent settlements
    const recentPayouts = await SettlementModel.find({ storeId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return {
      availableForPayout: netPayoutAmount,
      pendingBalance: stats.pendingBalance,
      onHold: 0,
      totalSettledAllTime: stats.totalSettledAllTime,
      totalPayoutsMonth: stats.totalPayoutsMonth,
      currentCycle: {
        period: periodStr,
        grossAmount,
        commissionFee,
        deliveryFees,
        taxes,
        netPayoutAmount,
      },
      recentPayouts: recentPayouts as unknown as ISettlement[],
    };
  }

  /**
   * Get store settlements history with pagination
   */
  static async getStoreSettlements(
    storeId: string,
    params: {
      page?: number;
      limit?: number;
      status?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<{
    settlements: ISettlementDoc[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 20));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = { storeId };
    if (params.status && params.status !== 'All') {
      query.status = params.status;
    }

    const [settlements, total] = await Promise.all([
      SettlementModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      SettlementModel.countDocuments(query),
    ]);

    return {
      settlements: settlements as unknown as ISettlementDoc[],
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Get single settlement by ID
   */
  static async getSettlementById(id: string, storeId?: string): Promise<ISettlementDoc> {
    const query: Record<string, any> = { _id: id };
    if (storeId) query.storeId = storeId;

    const settlement = await SettlementModel.findOne(query);
    if (!settlement) {
      const bySettlementId = await SettlementModel.findOne({
        settlementId: id,
        ...(storeId ? { storeId } : {}),
      });
      if (!bySettlementId) {
        throw new AppError(404, 'SETTLEMENT_NOT_FOUND', `Settlement ${id} not found`);
      }
      return bySettlementId;
    }
    return settlement;
  }

  /**
   * Generate settlement for delivered orders
   */
  static async generateSettlement(
    storeId: string,
    data: {
      grossAmount: number;
      commissionFee?: number;
      deliveryFees?: number;
      orderCount: number;
      bankAccount: string;
      period?: string;
    }
  ): Promise<ISettlementDoc> {
    const count = await SettlementModel.countDocuments();
    const settlementId = `#SETTLE-${1000 + count + 1}`;
    const now = new Date();
    const settlementDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const period = data.period || `${settlementDate} Cycle`;

    const commissionFee = data.commissionFee ?? Math.round(data.grossAmount * 0.05 * 100) / 100;
    const deliveryFeeSplit = data.deliveryFees ?? 0;
    const tdsAmount = Math.round(data.grossAmount * 0.01 * 100) / 100;
    const deductions = commissionFee + tdsAmount;
    const netPayoutAmount = Math.max(0, data.grossAmount - deductions);

    const utrNumber = `AXIS${Date.now().toString().slice(-12)}`;

    const settlement = await SettlementModel.create({
      settlementId,
      storeId,
      settlementDate,
      period,
      orderCount: data.orderCount,
      grossAmount: data.grossAmount,
      commissionFee,
      deliveryFeeSplit,
      tdsAmount,
      deductions,
      netPayoutAmount,
      status: 'Settled',
      bankAccount: data.bankAccount,
      utrNumber,
      settledAt: now.toISOString(),
      remarks: 'Automated weekly reconciliation',
    });

    logger.info(`[SettlementService] Generated settlement ${settlement.settlementId} for store ${storeId} (Net: ₹${settlement.netPayoutAmount})`);
    return settlement;
  }

  /**
   * Save verified merchant bank account for payouts
   */
  static async saveBankAccount(storeId: string, data: any): Promise<IBankAccountDoc> {
    const account = await BankAccountModel.findOneAndUpdate(
      { storeId },
      { ...data, storeId, isVerified: true },
      { new: true, upsert: true, runValidators: true }
    );
    logger.info(`[SettlementService] Saved bank account for store ${storeId}: ${account.bankName} - ${account.accountNumber.slice(-4)}`);
    return account;
  }

  /**
   * Get store payout bank account
   */
  static async getBankAccount(storeId: string): Promise<IBankAccountDoc | null> {
    return BankAccountModel.findOne({ storeId });
  }

  /**
   * Create manual payout request
   */
  static async requestPayout(
    storeId: string,
    amount: number,
    remarks?: string
  ): Promise<ISettlementDoc> {
    const bank = await this.getBankAccount(storeId);
    const bankAccountStr = bank
      ? `${bank.bankName} ••••${bank.accountNumber.slice(-4)}`
      : 'Primary Bank Account';

    const count = await SettlementModel.countDocuments();
    const settlementId = `#REQ-${1000 + count + 1}`;
    const now = new Date();
    const settlementDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const settlement = await SettlementModel.create({
      settlementId,
      storeId,
      settlementDate,
      period: 'On-Demand Withdrawal',
      orderCount: 1,
      grossAmount: amount,
      commissionFee: 0,
      deliveryFeeSplit: 0,
      tdsAmount: 0,
      deductions: 0,
      netPayoutAmount: amount,
      status: 'Pending',
      bankAccount: bankAccountStr,
      remarks: remarks || 'Merchant requested payout',
    });

    logger.info(`[SettlementService] Payout request ${settlement.settlementId} created for store ${storeId} (Amount: ₹${amount})`);
    return settlement;
  }
}

