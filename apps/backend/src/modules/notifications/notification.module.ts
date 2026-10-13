import type { Router } from 'express';
import { NotificationModel } from './notification.model.js';
import { createNotificationRepository } from './notification.repository.js';
import { createNotificationService } from './notification.service.js';
import { createNotificationController } from './notification.controller.js';
import { createNotificationRouter } from './notification.routes.js';
import { eventBus, type IEventBus } from '../../shared/events/eventBus.js';
import { EVENTS } from '../../shared/events/eventTypes.js';
import type { INotificationRepository, INotificationService } from './notification.types.js';
import { createWhatsAppService, type IWhatsAppService } from './whatsapp.service.js';
import { logger } from '../../shared/utils/logger.js';

export interface NotificationModule {
  router: Router;
  service: INotificationService;
  repository: INotificationRepository;
  whatsapp: IWhatsAppService;
}

export function createNotificationModule(events: IEventBus = eventBus): NotificationModule {
  const repository = createNotificationRepository(NotificationModel);
  const service = createNotificationService(repository, events);
  const controller = createNotificationController(service);
  const router = createNotificationRouter(controller);
  const whatsapp = createWhatsAppService();

  // Wire asynchronous domain event listeners to generate persistent notifications
  events.on(EVENTS.ORDER_PLACED, async (payload) => {
    try {
      // 1. Merchant Notification
      await service.createNotification({
        recipientId: payload.storeId,
        recipientRole: 'merchant',
        category: 'order',
        title: 'New Order Received',
        message: `Order #${payload.orderNumber} placed for ₹${payload.grandTotal} (${payload.itemsCount} items).`,
        data: { orderId: payload.orderId, orderNumber: payload.orderNumber },
      });

      // 2. Customer In-App Notification
      await service.createNotification({
        recipientId: payload.userId,
        recipientRole: 'customer',
        category: 'order',
        title: 'Order Placed Successfully',
        message: `Your order #${payload.orderNumber} has been received and is awaiting store confirmation.`,
        data: { orderId: payload.orderId, orderNumber: payload.orderNumber },
      });

      // 3. Outbound Meta WhatsApp Notification to Customer
      if (payload.customerPhone) {
        await whatsapp.sendOrderConfirmation(payload.customerPhone, {
          orderNumber: payload.orderNumber,
          grandTotal: payload.grandTotal,
          itemsCount: payload.itemsCount,
          deliveryOtp: payload.deliveryOtp,
        });
      }
    } catch (err) {
      logger.warn(`[NotificationModule] Failed to generate notification on ORDER_PLACED: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  events.on(EVENTS.ORDER_CONFIRMED, async (payload) => {
    try {
      await service.createNotification({
        recipientId: payload.orderId, // Target order room or resolved customer
        recipientRole: 'customer',
        category: 'order',
        title: 'Order Confirmed',
        message: `Your order #${payload.orderNumber} is confirmed and is being packed.`,
        data: { orderId: payload.orderId, orderNumber: payload.orderNumber },
      });
    } catch (err) {
      logger.warn(`[NotificationModule] Failed to generate notification on ORDER_CONFIRMED: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  events.on(EVENTS.ORDER_CANCELLED, async (payload) => {
    try {
      await service.createNotification({
        recipientId: payload.orderId,
        recipientRole: 'customer',
        category: 'order',
        title: 'Order Cancelled',
        message: `Order #${payload.orderNumber} was cancelled.`,
        data: { orderId: payload.orderId, orderNumber: payload.orderNumber },
      });
    } catch (err) {
      logger.warn(`[NotificationModule] Failed to generate notification on ORDER_CANCELLED: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  events.on(EVENTS.DELIVERY_ASSIGNED, async (payload) => {
    try {
      // 1. In-app customer notification
      await service.createNotification({
        recipientId: payload.orderId,
        recipientRole: 'customer',
        category: 'order',
        title: 'Delivery Partner Assigned',
        message: `Rider ${payload.riderId} assigned. Estimated arrival in ${payload.estimatedMinutes} mins.`,
        data: { orderId: payload.orderId, riderId: payload.riderId },
      });

      // 2. Outbound WhatsApp to Assigned Rider with dispatch instructions & map link
      if (payload.riderPhone && payload.dispatchMessage) {
        await whatsapp.sendTextMessage(payload.riderPhone, payload.dispatchMessage);
      }

      // 3. Outbound WhatsApp to Customer (Out for Delivery + Delivery OTP)
      if (payload.customerPhone && payload.deliveryOtp) {
        await whatsapp.sendOutForDelivery(payload.customerPhone, {
          orderNumber: payload.orderId,
          riderName: payload.riderName || 'Assigned Partner',
          deliveryOtp: payload.deliveryOtp,
          etaMinutes: payload.estimatedMinutes,
        });
      }
    } catch (err) {
      logger.warn(`[NotificationModule] Failed to generate notification on DELIVERY_ASSIGNED: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  events.on(EVENTS.DELIVERY_COMPLETED, async (payload) => {
    try {
      // 1. In-app customer notification
      await service.createNotification({
        recipientId: payload.orderId,
        recipientRole: 'customer',
        category: 'order',
        title: 'Order Delivered',
        message: `Your order #${payload.orderNumber} was successfully delivered.`,
        data: { orderId: payload.orderId, orderNumber: payload.orderNumber },
      });

      // 2. Outbound WhatsApp delivery completion receipt
      if (payload.customerPhone) {
        await whatsapp.sendDeliveryCompleted(payload.customerPhone, {
          orderNumber: payload.orderNumber,
        });
      }
    } catch (err) {
      logger.warn(`[NotificationModule] Failed to generate notification on DELIVERY_COMPLETED: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  events.on(EVENTS.PRODUCT_OUT_OF_STOCK, async (payload) => {
    try {
      await service.createNotification({
        recipientId: payload.storeId,
        recipientRole: 'merchant',
        category: 'inventory',
        title: 'Out of Stock Alert',
        message: `Product SKU ${payload.sku} is out of stock in your store inventory.`,
        data: { productId: payload.productId, sku: payload.sku },
      });
    } catch (err) {
      logger.warn(`[NotificationModule] Failed to generate notification on PRODUCT_OUT_OF_STOCK: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  return { router, service, repository, whatsapp };
}
