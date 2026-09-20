import type { Model } from 'mongoose';
import {
  calculateGrandTotal,
  calculateShippingFee,
  calculateSubtotal,
  calculateTax,
  generateDeliveryOtp,
  generateOrderNumber,
  isValidObjectId,
} from './order.utils.js';
import {
  OrderStatus,
  type CreateOrderDTO,
  type IOrderRepository,
  type OrderDocument,
  type OrderResponse,
  type Page,
} from './order.types.js';

export function createOrderRepository(
  model: Model<OrderDocument>,
): IOrderRepository {
  function toResponse(order: OrderDocument | (OrderDocument & { _id: unknown })): OrderResponse {
    const raw = typeof (order as OrderDocument).toObject === 'function' ? (order as OrderDocument).toObject() : order;
    return {
      id: raw._id ? String(raw._id) : (raw as unknown as { id: string }).id,
      orderNumber: raw.orderNumber,
      userId: raw.userId,
      storeId: raw.storeId,
      items: raw.items,
      shippingAddress: raw.shippingAddress,
      subtotal: raw.subtotal,
      tax: raw.tax,
      shippingFee: raw.shippingFee,
      grandTotal: raw.grandTotal,
      status: raw.status,
      deliveryOtp: raw.deliveryOtp,
      deliveredAt: raw.deliveredAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  async function create(
    dto: CreateOrderDTO & { userId: string },
  ): Promise<OrderResponse> {
    const subtotal = calculateSubtotal(dto.items);
    const tax = calculateTax(subtotal);
    const shippingFee = calculateShippingFee(subtotal);
    const grandTotal = calculateGrandTotal(subtotal, tax, shippingFee);

    const order = await model.create({
      ...dto,
      orderNumber: generateOrderNumber(),
      deliveryOtp: generateDeliveryOtp(),
      subtotal,
      tax,
      shippingFee,
      grandTotal,
      status: OrderStatus.PENDING,
    });

    return toResponse(order);
  }

  async function findById(id: string): Promise<OrderResponse | null> {
    if (isValidObjectId(id)) {
      const order = await model.findById(id).read('secondaryPreferred');
      if (order) return toResponse(order);
    }
    return findByOrderNumber(id);
  }

  async function findByOrderNumber(orderNumber: string): Promise<OrderResponse | null> {
    const cleanNumber = orderNumber.replace(/^#+/, '');
    const order = await model
      .findOne({
        $or: [{ orderNumber: cleanNumber }, { orderNumber: `#${cleanNumber}` }],
      })
      .read('secondaryPreferred');
    return order ? toResponse(order) : null;
  }

  async function findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Page<OrderResponse>> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));

    const [rows, total] = await Promise.all([
      model
        .find({ userId })
        .read('secondaryPreferred')
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit),
      model.countDocuments({ userId }),
    ]);

    return {
      data: rows.map(toResponse),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        hasNext: safePage * safeLimit < total,
      },
    };
  }

  async function findByStoreId(
    storeId: string,
    page: number,
    limit: number,
  ): Promise<Page<OrderResponse>> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));

    const [rows, total] = await Promise.all([
      model
        .find({ storeId })
        .read('secondaryPreferred')
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit),
      model.countDocuments({ storeId }),
    ]);

    return {
      data: rows.map(toResponse),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        hasNext: safePage * safeLimit < total,
      },
    };
  }

  async function findAll(
    page: number,
    limit: number,
  ): Promise<Page<OrderResponse>> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));

    const [rows, total] = await Promise.all([
      model
        .find()
        .read('secondaryPreferred')
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit),

      model.countDocuments(),
    ]);

    return {
      data: rows.map(toResponse),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        hasNext: safePage * safeLimit < total,
      },
    };
  }

  async function updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<OrderResponse | null> {
    if (!isValidObjectId(id)) return null;
    const update: Partial<OrderDocument> = { status };
    if (status === OrderStatus.DELIVERED) {
      update.deliveredAt = new Date();
    }
    const order = await model.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true },
    );
    return order ? toResponse(order) : null;
  }

  return {
    create,
    findById,
    findByOrderNumber,
    findByUserId,
    findByStoreId,
    findAll,
    updateStatus,
  };
}
