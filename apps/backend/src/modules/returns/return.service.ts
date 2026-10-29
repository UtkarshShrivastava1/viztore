import { ReturnModel, IReturnDoc } from './return.model.js';
import { AppError } from '../../shared/utils/AppError.js';
import { logger } from '../../shared/utils/logger.js';
import type { IReturn, IReturnsSummary } from '@repo/shared-types';

export class ReturnService {
  /**
   * Generate sequential return number e.g. RTN-10026
   */
  private static async generateReturnNumber(): Promise<string> {
    const count = await ReturnModel.countDocuments();
    const seq = 10000 + count + 1;
    return `RTN-${seq}`;
  }

  /**
   * Create new return or exchange request
   */
  static async createReturn(data: any, storeId?: string): Promise<IReturnDoc> {
    const resolvedStoreId = data.storeId || storeId;
    if (!resolvedStoreId) {
      throw new AppError(400, 'STORE_ID_REQUIRED', 'Store ID is required to initiate a return');
    }

    const returnNumber = await this.generateReturnNumber();
    const now = new Date();
    const returnDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const returnTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newReturn = await ReturnModel.create({
      ...data,
      returnNumber,
      storeId: resolvedStoreId,
      status: 'Pending',
      returnDate,
      returnTime,
      refundAmount: data.amount || 0,
      refundMethod: data.refundMethod || 'Original Payment',
    });

    logger.info(`[ReturnService] Created return ${newReturn.returnNumber} for order ${newReturn.orderNumber}`);
    return newReturn;
  }

  /**
   * Get store returns with search, filters and pagination
   */
  static async getStoreReturns(
    storeId: string,
    params: {
      page?: number;
      limit?: number;
      status?: string;
      type?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<{
    returns: IReturnDoc[];
    summary: IReturnsSummary;
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 20));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = { storeId };

    if (params.status && params.status !== 'All' && params.status !== 'All Returns' && params.status !== 'All Statuses') {
      query.status = params.status;
    }

    if (params.type && params.type !== 'All' && params.type !== 'All Types') {
      query.returnType = params.type;
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      query.$or = [
        { returnNumber: { $regex: q, $options: 'i' } },
        { orderNumber: { $regex: q, $options: 'i' } },
        { 'customer.name': { $regex: q, $options: 'i' } },
        { 'customer.phone': { $regex: q, $options: 'i' } },
        { 'product.name': { $regex: q, $options: 'i' } },
      ];
    }

    const [returns, total, summary] = await Promise.all([
      ReturnModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ReturnModel.countDocuments(query),
      this.getReturnsSummary(storeId),
    ]);

    return {
      returns: returns as unknown as IReturnDoc[],
      summary,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Get aggregated KPI summary for a merchant's returns
   */
  static async getReturnsSummary(storeId: string): Promise<IReturnsSummary> {
    const pipeline = [
      { $match: { storeId } },
      {
        $group: {
          _id: null,
          totalReturns: { $sum: 1 },
          pendingReturns: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] },
          },
          approvedReturns: {
            $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] },
          },
          refundedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Refunded'] }, 1, 0] },
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] },
          },
          totalRefundAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Refunded'] }, '$refundAmount', 0] },
          },
          pendingRefundAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, '$amount', 0] },
          },
        },
      },
    ];

    const result = await ReturnModel.aggregate(pipeline);
    if (!result || result.length === 0) {
      return {
        totalReturns: 0,
        pendingReturns: 0,
        approvedReturns: 0,
        refundedCount: 0,
        rejectedCount: 0,
        totalRefundAmount: 0,
        pendingRefundAmount: 0,
      };
    }

    const row = result[0];
    return {
      totalReturns: row.totalReturns || 0,
      pendingReturns: row.pendingReturns || 0,
      approvedReturns: row.approvedReturns || 0,
      refundedCount: row.refundedCount || 0,
      rejectedCount: row.rejectedCount || 0,
      totalRefundAmount: row.totalRefundAmount || 0,
      pendingRefundAmount: row.pendingRefundAmount || 0,
    };
  }

  /**
   * Get single return by ID
   */
  static async getReturnById(id: string, storeId?: string): Promise<IReturnDoc> {
    const query: Record<string, any> = { _id: id };
    if (storeId) query.storeId = storeId;

    const returnItem = await ReturnModel.findOne(query);
    if (!returnItem) {
      // Also fallback by returnNumber
      const byNumber = await ReturnModel.findOne({ returnNumber: id, ...(storeId ? { storeId } : {}) });
      if (!byNumber) {
        throw new AppError(404, 'RETURN_NOT_FOUND', `Return record not found for ID ${id}`);
      }
      return byNumber;
    }
    return returnItem;
  }

  /**
   * Approve return request and assign pickup task
   */
  static async approveReturn(
    id: string,
    storeId: string,
    data: { pickupDate?: string; pickupTime?: string; internalNote?: string } = {}
  ): Promise<IReturnDoc> {
    const returnItem = await this.getReturnById(id, storeId);
    if (returnItem.status === 'Refunded') {
      throw new AppError(400, 'INVALID_STATUS_TRANSITION', 'Cannot re-approve an already refunded return');
    }

    returnItem.status = 'Approved';
    if (data.pickupDate) returnItem.pickupDate = data.pickupDate;
    if (data.pickupTime) returnItem.pickupTime = data.pickupTime;
    if (data.internalNote) returnItem.internalNote = data.internalNote;

    await returnItem.save();
    logger.info(`[ReturnService] Return ${returnItem.returnNumber} approved by merchant ${storeId}`);
    return returnItem;
  }

  /**
   * Reject return request with reason
   */
  static async rejectReturn(id: string, storeId: string, reason: string): Promise<IReturnDoc> {
    const returnItem = await this.getReturnById(id, storeId);
    if (returnItem.status === 'Refunded') {
      throw new AppError(400, 'INVALID_STATUS_TRANSITION', 'Cannot reject an already refunded return');
    }

    returnItem.status = 'Rejected';
    returnItem.rejectionReason = reason;

    await returnItem.save();
    logger.info(`[ReturnService] Return ${returnItem.returnNumber} rejected by merchant ${storeId}. Reason: ${reason}`);
    return returnItem;
  }

  /**
   * Process refund for an approved return
   */
  static async processRefund(
    id: string,
    storeId: string,
    data: { refundAmount?: number; refundMethod?: string; internalNote?: string } = {}
  ): Promise<IReturnDoc> {
    const returnItem = await this.getReturnById(id, storeId);
    if (returnItem.status === 'Refunded') {
      throw new AppError(400, 'ALREADY_REFUNDED', 'Return is already refunded');
    }

    returnItem.status = 'Refunded';
    returnItem.refundAmount = data.refundAmount !== undefined ? data.refundAmount : returnItem.amount;
    if (data.refundMethod) returnItem.refundMethod = data.refundMethod;
    if (data.internalNote) returnItem.internalNote = data.internalNote;

    await returnItem.save();
    logger.info(`[ReturnService] Refund processed for return ${returnItem.returnNumber} (Amount: ₹${returnItem.refundAmount})`);
    return returnItem;
  }

  /**
   * Get customer returns by customer phone or user id
   */
  static async getMyReturns(customerPhone: string): Promise<IReturnDoc[]> {
    if (!customerPhone) return [];
    const cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);
    return ReturnModel.find({
      'customer.phone': { $regex: cleanPhone },
    })
      .sort({ createdAt: -1 })
      .lean() as unknown as IReturnDoc[];
  }
}
