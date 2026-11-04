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

  // -------------------------------------------------------------------------
  // Event: ORDER_PLACED
  // -------------------------------------------------------------------------
  events.on(EVENTS.ORDER_PLACED, async (payload) => {
    try {
      // 1. Merchant In-App Notification
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

      // 3. Outbound WhatsApp to Customer (Interactive Order Confirmation)
      if (payload.customerPhone) {
        await whatsapp.sendOrderConfirmation(payload.customerPhone, {
          orderId: payload.orderId,
          orderNumber: payload.orderNumber,
          grandTotal: payload.grandTotal,
          itemsCount: payload.itemsCount,
          deliveryOtp: payload.deliveryOtp,
          storeName: payload.storeName,
          paymentMethod: payload.paymentMethod,
          customerName: payload.customerName,
        });
      }

      // 4. Outbound WhatsApp to Store Owner (Interactive New Order Alert)
      if (payload.storePhone) {
        await whatsapp.sendMerchantNewOrderAlert(payload.storePhone, {
          orderId: payload.orderId,
          orderNumber: payload.orderNumber,
          storeName: payload.storeName,
          customerName: payload.customerName,
          itemsCount: payload.itemsCount,
          grandTotal: payload.grandTotal,
          paymentMethod: payload.paymentMethod,
        });
      }
    } catch (err) {
      logger.warn(`[NotificationModule] Failed to process ORDER_PLACED notifications: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  // -------------------------------------------------------------------------
  // Event: ORDER_CONFIRMED
  // -------------------------------------------------------------------------
  events.on(EVENTS.ORDER_CONFIRMED, async (payload) => {
    try {
      await service.createNotification({
        recipientId: payload.userId || payload.orderId,
        recipientRole: 'customer',
        category: 'order',
        title: 'Order Confirmed',
        message: `Your order #${payload.orderNumber} is confirmed and is being packed.`,
        data: { orderId: payload.orderId, orderNumber: payload.orderNumber },
      });
    } catch (err) {
      logger.warn(`[NotificationModule] Failed to process ORDER_CONFIRMED notifications: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  // -------------------------------------------------------------------------
  // Event: ORDER_CANCELLED
  // -------------------------------------------------------------------------
  events.on(EVENTS.ORDER_CANCELLED, async (payload) => {
    try {
      // 1. In-App notification
      await service.createNotification({
        recipientId: payload.userId || payload.orderId,
        recipientRole: 'customer',
        category: 'order',
        title: 'Order Cancelled',
        message: `Order #${payload.orderNumber} was cancelled.`,
        data: { orderId: payload.orderId, orderNumber: payload.orderNumber },
      });

      // 2. Outbound WhatsApp to Customer
      if (payload.customerPhone) {
        await whatsapp.sendOrderCancelled(payload.customerPhone, {
          orderId: payload.orderId,
          orderNumber: payload.orderNumber,
          customerName: payload.customerName,
          reason: payload.reason,
        });
      }
    } catch (err) {
      logger.warn(`[NotificationModule] Failed to process ORDER_CANCELLED notifications: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  // -------------------------------------------------------------------------
  // Event: DELIVERY_ASSIGNED
  // -------------------------------------------------------------------------
  events.on(EVENTS.DELIVERY_ASSIGNED, async (payload) => {
    try {
      // 1. Customer In-App notification
      await service.createNotification({
        recipientId: payload.userId || payload.orderId,
        recipientRole: 'customer',
        category: 'order',
        title: 'Delivery Partner Assigned',
        message: `Rider ${payload.riderName || payload.riderId} assigned. Estimated arrival in ${payload.estimatedMinutes} mins.`,
        data: { orderId: payload.orderId, riderId: payload.riderId },
      });

      // 2. Outbound WhatsApp to Assigned Rider (Interactive Dispatch Cockpit)
      if (payload.riderPhone) {
        await whatsapp.sendRiderDispatch(payload.riderPhone, {
          orderId: payload.orderId,
          orderNumber: payload.orderNumber || payload.orderId,
          riderName: payload.riderName || 'Partner',
          riderPhone: payload.riderPhone,
          pickupAddress: payload.pickupAddress || 'Store Pickup',
          dropoffAddress: payload.dropoffAddress || 'Customer Dropoff',
          pickupOtp: payload.pickupOtp,
          storeName: payload.storeName,
          estimatedPayout: payload.estimatedPayout,
        });
      }

      // 3. Outbound WhatsApp to Customer (Interactive Rider Assigned notification)
      if (payload.customerPhone) {
        await whatsapp.sendCustomerRiderAssigned(payload.customerPhone, {
          orderId: payload.orderId,
          orderNumber: payload.orderNumber || payload.orderId,
          riderName: payload.riderName || 'Assigned Partner',
          riderPhone: payload.riderPhone,
          etaMinutes: payload.estimatedMinutes,
          storeName: payload.storeName,
          deliveryOtp: payload.deliveryOtp,
        });
      }

      // 4. Outbound WhatsApp to Store Owner (Rider Arriving for Pickup)
      if (payload.storePhone) {
        await whatsapp.sendMerchantRiderArriving(payload.storePhone, {
          orderId: payload.orderId,
          orderNumber: payload.orderNumber || payload.orderId,
          riderName: payload.riderName || 'Assigned Partner',
          riderPhone: payload.riderPhone,
          storeName: payload.storeName,
        });
      }
    } catch (err) {
      logger.warn(`[NotificationModule] Failed to process DELIVERY_ASSIGNED notifications: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  // -------------------------------------------------------------------------
  // Event: delivery.pickup_verified (Store Clerk Verifies Leg 1 Pickup OTP)
  // -------------------------------------------------------------------------
  events.on('delivery.pickup_verified', async (payload: any) => {
    try {
      // 1. Outbound WhatsApp to Customer: Parcel picked up, Out for Delivery with Leg 2 OTP
      if (payload.customerPhone && payload.deliveryOtp) {
        await whatsapp.sendOutForDelivery(payload.customerPhone, {
          orderId: payload.orderId,
          orderNumber: payload.orderNumber || payload.orderId,
          riderName: payload.riderName || 'Delivery Partner',
          deliveryOtp: payload.deliveryOtp,
          etaMinutes: payload.etaMinutes || 20,
          storeName: payload.storeName,
        });
      }

      // 2. Outbound WhatsApp to Rider: Pickup Confirmed, Proceed to Dropoff
      if (payload.riderPhone && payload.dropoffAddress) {
        await whatsapp.sendRiderPickupConfirmed(payload.riderPhone, {
          orderId: payload.orderId,
          orderNumber: payload.orderNumber || payload.orderId,
          riderName: payload.riderName || 'Delivery Partner',
          dropoffAddress: payload.dropoffAddress,
          storeName: payload.storeName,
        });
      }
    } catch (err) {
      logger.warn(`[NotificationModule] Failed to process delivery.pickup_verified notifications: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  // -------------------------------------------------------------------------
  // Events: DELIVERY_COMPLETED & ORDER_DELIVERED (Customer Handshake Complete)
  // -------------------------------------------------------------------------
  const handleOrderDelivered = async (payload: any) => {
    try {
      // 1. Customer In-App Notification
      await service.createNotification({
        recipientId: payload.userId || payload.orderId,
        recipientRole: 'customer',
        category: 'order',
        title: 'Order Delivered',
        message: `Your order #${payload.orderNumber} was successfully delivered.`,
        data: { orderId: payload.orderId, orderNumber: payload.orderNumber },
      });

      // 2. Outbound WhatsApp to Customer with A4 Tax Invoice Link
      if (payload.customerPhone) {
        await whatsapp.sendDeliveryCompleted(payload.customerPhone, {
          orderId: payload.orderId,
          orderNumber: payload.orderNumber,
          customerName: payload.customerName,
          riderName: payload.riderName,
        });
      }

      // 3. Outbound WhatsApp to Store Owner (Order Fulfilled)
      if (payload.storePhone) {
        await whatsapp.sendMerchantDeliveryCompleted(payload.storePhone, {
          orderId: payload.orderId,
          orderNumber: payload.orderNumber,
          riderName: payload.riderName,
          customerName: payload.customerName,
          grandTotal: payload.grandTotal,
        });
      }
    } catch (err) {
      logger.warn(`[NotificationModule] Failed to process DELIVERY_COMPLETED notifications: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  events.on(EVENTS.DELIVERY_COMPLETED, handleOrderDelivered);
  events.on(EVENTS.ORDER_DELIVERED, handleOrderDelivered);

  // -------------------------------------------------------------------------
  // Event: PRODUCT_OUT_OF_STOCK
  // -------------------------------------------------------------------------
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
