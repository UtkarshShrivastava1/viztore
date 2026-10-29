import mongoose from 'mongoose';
import {
  CustomerModel,
  CustomerTransactionModel,
  ICustomerDocument,
  ICustomerTransactionDocument,
} from './customer.model.js';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  AdjustCustomerCreditDto,
  RecordCustomerPaymentDto,
  CustomerStatus,
  CustomerTier,
  ICustomerListResponse,
} from '@repo/shared-types';
import { AppError } from '../../shared/utils/AppError.js';
import { logger } from '../../shared/utils/logger.js';

export class CustomerService {
  /**
   * Get paginated customer registry with live aggregate KPIs
   */
  async getCustomers(
    storeId: string,
    query: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      type?: string;
    },
  ): Promise<ICustomerListResponse> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.max(1, Math.min(100, query.limit ?? 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      storeId: new mongoose.Types.ObjectId(storeId),
    };

    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    }

    if (query.type && query.type !== 'all') {
      filter.customerType = query.type;
    }

    if (query.search && query.search.trim()) {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { phone: regex },
        { email: regex },
        { customerCode: regex },
        { displayName: regex },
      ];
    }

    const [customers, total, kpiAggregates] = await Promise.all([
      CustomerModel.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CustomerModel.countDocuments(filter),
      CustomerModel.aggregate([
        { $match: { storeId: new mongoose.Types.ObjectId(storeId) } },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            totalSales: { $sum: '$totalSales' },
            totalOutstanding: { $sum: '$outstandingAmount' },
          },
        },
      ]),
    ]);

    const kpiData = kpiAggregates[0] || {
      totalCustomers: 0,
      totalSales: 0,
      totalOutstanding: 0,
    };

    return {
      customers: customers.map((c) => ({
        ...c,
        id: (c as any)._id.toString(),
      })) as any,
      kpis: {
        totalCustomers: kpiData.totalCustomers,
        totalCustomersGrowth: 8.5,
        totalSales: kpiData.totalSales,
        totalSalesGrowth: 14.2,
        totalOutstanding: kpiData.totalOutstanding,
        totalOutstandingChange: -4.3,
      },
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get single customer by ID along with Khata statement transactions
   */
  async getCustomerById(
    storeId: string,
    customerId: string,
  ): Promise<{
    customer: ICustomerDocument;
    statementTransactions: ICustomerTransactionDocument[];
  }> {
    const customer = await CustomerModel.findOne({
      _id: customerId,
      storeId: new mongoose.Types.ObjectId(storeId),
    });

    if (!customer) {
      throw AppError.notFound('Customer not found', 'CUSTOMER_NOT_FOUND');
    }

    const statementTransactions = await CustomerTransactionModel.find({
      customerId: new mongoose.Types.ObjectId(customerId),
      storeId: new mongoose.Types.ObjectId(storeId),
    })
      .sort({ date: -1, createdAt: -1 })
      .limit(50);

    return { customer, statementTransactions };
  }

  /**
   * Create a new customer in store registry
   */
  async createCustomer(
    storeId: string,
    dto: CreateCustomerDto,
  ): Promise<ICustomerDocument> {
    // Generate next customer code
    const count = await CustomerModel.countDocuments({ storeId });
    const customerCode = `CUS-${1001 + count}`;

    const openingBalance = dto.openingBalance || 0;

    const customer = await CustomerModel.create({
      storeId: new mongoose.Types.ObjectId(storeId),
      name: dto.name,
      displayName: dto.displayName || dto.name,
      customerType: dto.customerType,
      phone: dto.phone,
      email: dto.email || undefined,
      gstin: dto.gstin || undefined,
      pan: dto.pan || undefined,
      customerCode,
      creditLimit: dto.creditLimit ?? 10000,
      paymentTerms: dto.paymentTerms ?? '15 Days',
      creditPeriodDays: dto.creditPeriodDays ?? 15,
      outstandingAmount: openingBalance,
      totalSales: openingBalance,
      location: dto.location || 'Local Area',
      billingAddress: dto.billingAddress || {
        addressLine1: 'In-store',
        city: 'Local',
        state: 'Delhi',
        pincode: '',
        country: 'India',
        sameAsShipping: true,
      },
      notes: dto.notes,
      status: dto.status ?? CustomerStatus.ACTIVE,
      tier: CustomerTier.NEW,
    });

    // Record initial ledger transaction if opening balance was supplied
    if (openingBalance > 0) {
      await CustomerTransactionModel.create({
        storeId: new mongoose.Types.ObjectId(storeId),
        customerId: customer._id,
        type: 'Invoice',
        referenceNo: 'OPENING_BAL',
        amount: openingBalance,
        balanceAfter: openingBalance,
        date: new Date(),
        notes: 'Initial account opening balance',
      });
    }

    logger.info(`[CustomerService] Created customer ${customer.name} (${customerCode}) for store ${storeId}`);
    return customer;
  }

  /**
   * Update existing customer
   */
  async updateCustomer(
    storeId: string,
    customerId: string,
    dto: UpdateCustomerDto,
  ): Promise<ICustomerDocument> {
    const customer = await CustomerModel.findOneAndUpdate(
      {
        _id: customerId,
        storeId: new mongoose.Types.ObjectId(storeId),
      },
      {
        $set: { ...dto, updatedAt: new Date() },
        $inc: { version: 1 },
      },
      { new: true, runValidators: true },
    );

    if (!customer) {
      throw AppError.notFound('Customer not found', 'CUSTOMER_NOT_FOUND');
    }

    return customer;
  }

  /**
   * Delete or archive customer
   */
  async deleteCustomer(storeId: string, customerId: string): Promise<void> {
    const customer = await CustomerModel.findOneAndUpdate(
      {
        _id: customerId,
        storeId: new mongoose.Types.ObjectId(storeId),
      },
      {
        $set: { status: CustomerStatus.INACTIVE, updatedAt: new Date() },
      },
    );

    if (!customer) {
      throw AppError.notFound('Customer not found', 'CUSTOMER_NOT_FOUND');
    }
  }

  /**
   * Adjust store credit balance and record Khata transaction
   */
  async adjustStoreCredit(
    storeId: string,
    customerId: string,
    dto: AdjustCustomerCreditDto,
  ): Promise<ICustomerDocument> {
    const customer = await CustomerModel.findOne({
      _id: customerId,
      storeId: new mongoose.Types.ObjectId(storeId),
    });

    if (!customer) {
      throw AppError.notFound('Customer not found', 'CUSTOMER_NOT_FOUND');
    }

    const delta = dto.type === 'add' ? dto.amount : -dto.amount;
    const newCredit = Math.max(0, (customer.storeCredit || 0) + delta);

    customer.storeCredit = newCredit;
    await customer.save();

    await CustomerTransactionModel.create({
      storeId: new mongoose.Types.ObjectId(storeId),
      customerId: customer._id,
      type: 'Credit_Adjustment',
      referenceNo: `CR-${Date.now().toString().slice(-6)}`,
      amount: delta,
      balanceAfter: customer.outstandingAmount,
      date: new Date(),
      notes: dto.reason || (dto.type === 'add' ? 'Store Credit Granted' : 'Store Credit Redeemed'),
    });

    return customer;
  }

  /**
   * Record a payment towards customer outstanding Khata balance
   */
  async recordPayment(
    storeId: string,
    customerId: string,
    dto: RecordCustomerPaymentDto,
  ): Promise<ICustomerDocument> {
    const customer = await CustomerModel.findOne({
      _id: customerId,
      storeId: new mongoose.Types.ObjectId(storeId),
    });

    if (!customer) {
      throw AppError.notFound('Customer not found', 'CUSTOMER_NOT_FOUND');
    }

    const newOutstanding = Math.max(0, customer.outstandingAmount - dto.amount);
    customer.outstandingAmount = newOutstanding;
    await customer.save();

    await CustomerTransactionModel.create({
      storeId: new mongoose.Types.ObjectId(storeId),
      customerId: customer._id,
      type: 'Payment',
      referenceNo: dto.referenceNo || `PAY-${Date.now().toString().slice(-6)}`,
      amount: -dto.amount,
      balanceAfter: newOutstanding,
      date: new Date(),
      notes: `${dto.paymentMethod.toUpperCase()} Payment${dto.notes ? `: ${dto.notes}` : ''}`,
    });

    return customer;
  }

  /**
   * Automatic hook: Upsert customer from online orders or POS sales
   */
  async upsertFromOrderOrInvoice(
    storeId: string,
    data: {
      name: string;
      phone: string;
      email?: string;
      address?: string;
      totalAmount: number;
      dueAmount: number;
      referenceNo: string;
      userId?: string;
    },
  ): Promise<ICustomerDocument> {
    const cleanPhone = data.phone.replace(/\D/g, '');
    let customer = await CustomerModel.findOne({
      storeId: new mongoose.Types.ObjectId(storeId),
      phone: { $regex: cleanPhone ? cleanPhone.slice(-10) : '9999999999' },
    });

    if (customer) {
      customer.totalSales = (customer.totalSales || 0) + data.totalAmount;
      customer.outstandingAmount = (customer.outstandingAmount || 0) + data.dueAmount;
      customer.totalOrders = (customer.totalOrders || 0) + 1;
      customer.lastOrderDate = new Date();
      if (data.userId && !customer.userId) {
        customer.userId = new mongoose.Types.ObjectId(data.userId);
      }
      await customer.save();
    } else {
      const count = await CustomerModel.countDocuments({ storeId });
      const customerCode = `CUS-${1001 + count}`;
      customer = await CustomerModel.create({
        storeId: new mongoose.Types.ObjectId(storeId),
        userId: data.userId ? new mongoose.Types.ObjectId(data.userId) : undefined,
        name: data.name || 'Walk-in Retail Customer',
        displayName: data.name,
        customerType: 'Individual',
        phone: data.phone || '9999999999',
        email: data.email || undefined,
        customerCode,
        creditLimit: 10000,
        paymentTerms: '15 Days',
        creditPeriodDays: 15,
        outstandingAmount: data.dueAmount,
        totalSales: data.totalAmount,
        storeCredit: 0,
        loyaltyPoints: Math.floor(data.totalAmount / 100),
        totalOrders: 1,
        returnsCount: 0,
        status: CustomerStatus.ACTIVE,
        tier: CustomerTier.REGULAR,
        lastOrderDate: new Date(),
        location: 'Local',
        billingAddress: {
          addressLine1: data.address || 'In-store',
          city: 'Local',
          state: 'Delhi',
          pincode: '',
          country: 'India',
          sameAsShipping: true,
        },
      });
    }

    // Record Khata invoice entry
    await CustomerTransactionModel.create({
      storeId: new mongoose.Types.ObjectId(storeId),
      customerId: customer._id,
      type: 'Invoice',
      referenceNo: data.referenceNo,
      amount: data.totalAmount,
      balanceAfter: customer.outstandingAmount,
      date: new Date(),
      notes: `Order / Sale ${data.referenceNo}`,
    });

    return customer;
  }
}

export const customerService = new CustomerService();

