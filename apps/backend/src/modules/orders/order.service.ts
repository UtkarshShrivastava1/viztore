import {
  OrderStatus,
  type CreateOrderDTO,
  type IOrderRepository,
  type IOrderService,
  type IOrderStatusHistoryEntry,
  type OrderItemDTO,
  type OrderResponse,
  type OrderInvoiceData,
  type Page,
} from './order.types.js';
import { normalizeAddress } from './order.utils.js';
import { IEventBus } from '../../shared/events/eventBus.js';
import { EVENTS } from '../../shared/events/eventTypes.js';
import { AppError } from '../../shared/utils/AppError.js';
import { logger } from '../../shared/utils/logger.js';
import { withTransaction } from '../../shared/database/transaction.js';
import { appendOutboxEvent, processPendingOutboxEvents } from '../../shared/database/outbox.service.js';
import type { IStoreFacade } from '../stores/index.js';
import type { ICatalogFacade } from '../catalog/index.js';

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PACKED, OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.PACKED, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.PACKED, OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.PACKED]: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.READY_FOR_PICKUP, OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED],
  [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

export function createOrderService(
  repo: IOrderRepository,
  bus?: IEventBus,
  storeFacade?: IStoreFacade,
  catalogFacade?: ICatalogFacade,
): IOrderService {
  async function createOrder(
    userId: string,
    dto: CreateOrderDTO,
    correlationId?: string,
  ): Promise<OrderResponse> {
    // 1. Validate items presence
    if (!dto.items || dto.items.length === 0) {
      throw AppError.badRequest('Order must contain at least one item', 'EMPTY_ORDER_ITEMS');
    }

    // 2. Validate single-store invariant
    const targetStoreId = dto.storeId;
    const hasForeignStoreItem = dto.items.some((item) => item.storeId !== targetStoreId);
    if (hasForeignStoreItem) {
      throw AppError.badRequest(
        'All order items must belong to the specified store',
        'CART_STORE_MISMATCH',
      );
    }

    // 3. Verify store existence & active status via Store facade
    if (storeFacade) {
      const store = await storeFacade.getStoreById(targetStoreId);
      if (!store || !store.isActive) {
        throw AppError.badRequest('Store not found or is currently inactive', 'STORE_INACTIVE');
      }
    }

    // 4. Resolve authoritative product and price snapshots via Catalog Facade
    const authoritativeItems: OrderItemDTO[] = [];
    if (catalogFacade) {
      for (const item of dto.items) {
        const productSnapshot = await catalogFacade.getProductById(item.productId);
        if (!productSnapshot || !productSnapshot.isActive) {
          throw AppError.badRequest(
            `Product ${item.productId} is not available or inactive`,
            'PRODUCT_NOT_AVAILABLE',
          );
        }
        if (productSnapshot.storeId && productSnapshot.storeId !== targetStoreId) {
          throw AppError.badRequest(
            `Product ${productSnapshot.name} does not belong to store ${targetStoreId}`,
            'CART_STORE_MISMATCH',
          );
        }

        authoritativeItems.push({
          productId: item.productId,
          sku: item.sku,
          name: productSnapshot.name,
          quantity: item.quantity,
          unitPrice: productSnapshot.price, // Authoritative price snapshot
          storeId: targetStoreId,
        });
      }

      // Fast stock pre-check (advisory)
      const stockCheck = await catalogFacade.checkStock(
        authoritativeItems.map((i) => ({ productId: i.productId, sku: i.sku, quantity: i.quantity })),
      );
      if (!stockCheck.available) {
        throw AppError.badRequest(
          'One or more items in your order are out of stock',
          'INSUFFICIENT_STOCK',
          stockCheck.unavailableItems,
        );
      }
    } else {
      authoritativeItems.push(...dto.items);
    }

    // 5. ACID Transaction: Atomic stock deduction + Order creation + Outbox event insertion
    const normalizedShippingAddress = normalizeAddress(dto.shippingAddress);

    const order = await withTransaction(async (session) => {
      // Final inventory authority: sorted atomic deduction
      if (catalogFacade) {
        await catalogFacade.deductStock(
          authoritativeItems.map((i) => ({ productId: i.productId, sku: i.sku, quantity: i.quantity })),
          session,
        );
      }

      const createPayload = {
        ...dto,
        items: authoritativeItems,
        userId,
        shippingAddress: normalizedShippingAddress,
      };

      const created = session
        ? await repo.create(createPayload, { session })
        : await repo.create(createPayload);

      // Transactional Outbox insertion
      await appendOutboxEvent(
        {
          eventType: EVENTS.ORDER_PLACED,
          schemaVersion: 1,
          aggregateType: 'Order',
          aggregateId: created.id,
          correlationId,
          payload: {
            orderId: created.id,
            orderNumber: created.orderNumber,
            userId: created.userId,
            storeId: created.storeId,
            grandTotal: created.grandTotal,
            itemsCount: created.items.length,
            customerPhone: created.shippingAddress?.phone,
            deliveryOtp: created.deliveryOtp,
          },
        },
        session,
      );

      return created;
    });

    // 6. Post-commit asynchronous dispatch triggers
    void processPendingOutboxEvents().catch((error) => {
      logger.warn('Outbox dispatch failed', { error, correlationId });
    });

    // 7. Emit local domain event for in-process subscribers
    if (bus) {
      bus.emit(EVENTS.ORDER_PLACED, {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: order.userId,
        storeId: order.storeId,
        grandTotal: order.grandTotal,
        itemsCount: order.items.length,
        customerPhone: order.shippingAddress?.phone,
        deliveryOtp: order.deliveryOtp,
        correlationId,
      });
    }

    return order;
  }

  async function getOrderInvoice(
    id: string,
    userId: string,
    isAdminOrMerchant: boolean,
  ): Promise<OrderInvoiceData> {
    const order = await getOrderById(id, userId, isAdminOrMerchant);
    if (!order) {
      throw AppError.notFound('Order not found', 'ORDER_NOT_FOUND');
    }

    let storeName = 'Local Partner Store';
    let storeAddress = '123, Commercial Market, Indore, MP - 452001';
    let storePhone = '+91 98765 43210';
    let storeGstin = '23AAAAA0000A1Z5';

    if (storeFacade) {
      const store = await storeFacade.getStoreById(order.storeId).catch(() => null);
      if (store) {
        storeName = store.name || storeName;
        if (store.city) {
          storeAddress = `Commercial Center, ${store.city} - 452001`;
        }
      }
    }

    const items = order.items.map((item) => {
      const lineTotal = Number((item.quantity * item.unitPrice).toFixed(2));
      const taxableAmount = Number((lineTotal / 1.05).toFixed(2));
      return {
        name: item.name,
        sku: item.sku || 'N/A',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxableAmount,
        lineTotal,
      };
    });

    const subtotal = order.subtotal;
    const tax = order.tax;
    const halfTax = Number((tax / 2).toFixed(2));

    return {
      invoiceNumber: `INV-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      orderId: order.id,
      date: new Date(order.createdAt).toISOString(),
      status: order.status,
      seller: {
        name: storeName,
        address: storeAddress,
        phone: storePhone,
        gstin: storeGstin,
      },
      customer: {
        name: order.shippingAddress.fullName,
        phone: order.shippingAddress.phone,
        address: `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}`,
      },
      items,
      pricing: {
        subtotal,
        tax,
        cgst: halfTax,
        sgst: Number((tax - halfTax).toFixed(2)),
        shippingFee: order.shippingFee,
        grandTotal: order.grandTotal,
      },
      deliveryOtp: order.deliveryOtp || '****',
    };
  }

  async function getOrderById(
    id: string,
    userId: string,
    isAdminOrMerchant: boolean,
  ): Promise<OrderResponse | null> {
    const order = await repo.findById(id);
    if (!order) return null;

    if (!isAdminOrMerchant && order.userId !== userId) {
      throw AppError.forbidden('You do not have access to this order', 'ORDER_ACCESS_DENIED');
    }

    return order;
  }

  async function getOrdersByUserId(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<Page<OrderResponse>> {
    return repo.findByUserId(userId, page, limit);
  }

  async function getOrdersByStoreId(
    storeId: string,
    page = 1,
    limit = 10,
  ): Promise<Page<OrderResponse>> {
    return repo.findByStoreId(storeId, page, limit);
  }

  async function getAllOrders(
    page = 1,
    limit = 10,
  ): Promise<Page<OrderResponse>> {
    return repo.findAll(page, limit);
  }

  async function updateOrderStatus(
    id: string,
    status: OrderStatus,
    actorUserId: string,
    otp?: string,
    expectedVersion?: number,
  ): Promise<OrderResponse | null> {
    const current = await repo.findById(id);
    if (!current) {
      throw AppError.notFound('Order not found', 'ORDER_NOT_FOUND');
    }

    // Defensive State machine guard: safely fallback to empty array if status is unmapped
    const validTargets = allowedTransitions[current.status] ?? [];
    if (!validTargets.includes(status)) {
      throw AppError.badRequest(
        `Invalid order status transition: ${current.status} -> ${status}`,
        'INVALID_STATUS_TRANSITION',
      );
    }

    // Defensive physical delivery OTP verification guard
    if (status === OrderStatus.DELIVERED) {
      const cleanOtp = typeof otp === 'string' ? otp.trim() : '';
      if (!cleanOtp || current.deliveryOtp !== cleanOtp) {
        throw AppError.badRequest('Invalid or missing 4-digit delivery OTP', 'INVALID_DELIVERY_OTP');
      }
    }

    const auditEntry: IOrderStatusHistoryEntry = {
      status,
      changedBy: actorUserId,
      reason: `Status transitioned to ${status}`,
      timestamp: new Date(),
    };

    let updated: OrderResponse | null;
    if (typeof expectedVersion === 'number') {
      updated = await repo.updateStatusWithVersion(
        id,
        expectedVersion,
        current.status,
        status,
        auditEntry,
      );
      if (!updated) {
        throw AppError.conflict(
          'Order was concurrently updated by another transaction',
          'ORDER_CONCURRENT_MODIFICATION',
        );
      }
    } else {
      updated = await repo.updateStatus(id, status);
    }

    // Emit domain events
    if (bus && updated) {
      const payload = {
        orderId: updated.id,
        orderNumber: updated.orderNumber,
        previousStatus: current.status,
        newStatus: status,
        actorUserId,
      };

      if (status === OrderStatus.CONFIRMED || status === OrderStatus.PACKED) bus.emit(EVENTS.ORDER_CONFIRMED, payload);
      if (status === OrderStatus.CANCELLED) bus.emit(EVENTS.ORDER_CANCELLED, payload);
      if (status === OrderStatus.DELIVERED) bus.emit(EVENTS.ORDER_DELIVERED, payload);
    }

    return updated;
  }

  async function verifyDeliveryOtp(id: string, otp: string): Promise<boolean> {
    const order = await repo.findById(id);
    if (!order) return false;
    const cleanOtp = typeof otp === 'string' ? otp.trim() : '';
    return Boolean(cleanOtp && order.deliveryOtp === cleanOtp);
  }

  async function cancelOrder(
    id: string,
    userId: string,
    isAdmin: boolean,
    expectedVersion?: number,
  ): Promise<OrderResponse | null> {
    const current = await getOrderById(id, userId, isAdmin);
    if (!current) return null;

    if (
      current.status !== OrderStatus.PENDING &&
      current.status !== OrderStatus.CONFIRMED
    ) {
      throw AppError.badRequest('Order cannot be cancelled at its current status', 'CANNOT_CANCEL_ORDER');
    }

    // Enterprise OCC cancellation with atomic inventory restoration and Outbox event
    const cancelled = await withTransaction(async (session) => {
      let updated: OrderResponse | null = null;
      if (typeof repo.cancelIfVersionMatches === 'function') {
        updated = await repo.cancelIfVersionMatches(
          {
            orderId: id,
            expectedVersion: expectedVersion ?? current.version,
            expectedStatus: current.status,
            reason: 'Cancelled by customer or store manager',
            actorUserId: userId,
          },
          session,
        );
      } else {
        updated = session
          ? await repo.updateStatus(id, OrderStatus.CANCELLED, { session })
          : await repo.updateStatus(id, OrderStatus.CANCELLED);
      }

      if (!updated) {
        throw AppError.conflict(
          'Order was concurrently modified by another transaction',
          'ORDER_CONCURRENT_MODIFICATION',
        );
      }

      // Restore inventory in catalog inside the same ACID session
      if (catalogFacade) {
        await catalogFacade.restoreStock(
          current.items.map((i) => ({ productId: i.productId, sku: i.sku, quantity: i.quantity })),
          session,
        );
      }

      // Append Outbox event inside the same transaction
      await appendOutboxEvent(
        {
          eventType: EVENTS.ORDER_CANCELLED,
          schemaVersion: 1,
          aggregateType: 'Order',
          aggregateId: updated.id,
          payload: {
            orderId: updated.id,
            orderNumber: updated.orderNumber,
            userId: updated.userId,
            storeId: updated.storeId,
          },
        },
        session,
      );

      return updated;
    });

    // Post-commit outbox trigger & local event emission
    void processPendingOutboxEvents().catch((err) => {
      logger.warn('Outbox dispatch failed for order cancellation', { error: err });
    });

    if (bus) {
      bus.emit(EVENTS.ORDER_CANCELLED, {
        orderId: cancelled.id,
        orderNumber: cancelled.orderNumber,
        previousStatus: current.status,
        newStatus: OrderStatus.CANCELLED,
        actorUserId: userId,
      });
    }

    return cancelled;
  }

  return {
    createOrder,
    getOrderById,
    getOrderInvoice,
    getOrdersByUserId,
    getOrdersByStoreId,
    getAllOrders,
    updateOrderStatus,
    verifyDeliveryOtp,
    cancelOrder,
  };
}
