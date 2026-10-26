import type { Router } from 'express';
import { DeliveryModel } from './delivery.model.js';
import { createDeliveryRepository } from './delivery.repository.js';
import { createDeliveryService } from './delivery.service.js';
import { createDeliveryController } from './delivery.controller.js';
import { createDeliveryRouter } from './delivery.routes.js';
import { eventBus, type IEventBus } from '../../shared/events/eventBus.js';
import { EVENTS } from '../../shared/events/eventTypes.js';
import { orderModule, type IOrderFacade } from '../orders/index.js';
import type { IDeliveryRepository, IDeliveryService } from './delivery.types.js';
import { logger } from '../../shared/utils/logger.js';

import { findStoreById } from '../stores/store.service.js';

export interface DeliveryModule {
  router: Router;
  service: IDeliveryService;
  repository: IDeliveryRepository;
}

export function createDeliveryModule(
  events: IEventBus = eventBus,
  orders: IOrderFacade = orderModule,
): DeliveryModule {
  const repository = createDeliveryRepository(DeliveryModel);
  const service = createDeliveryService(repository, events, orders);
  const controller = createDeliveryController(service);
  const router = createDeliveryRouter(controller);

  // Asynchronous event reaction: When order is confirmed, initialize delivery record
  events.on(EVENTS.ORDER_CONFIRMED, async ({ orderId, orderNumber }) => {
    try {
      logger.info(`[DeliveryModule] Order #${orderNumber} confirmed. Initializing dispatch...`);
      const order = await orders.getOrderById(orderId);
      let storeName = 'Store Partner';
      let storeAddress = 'Local Depot';
      let storeCoords: [number, number] = [72.8777, 19.076];

      if (order?.storeId) {
        try {
          const store = await findStoreById(order.storeId);
          if (store) {
            storeName = store.name;
            const parts = [store.address?.street, store.address?.city, store.address?.state].filter(Boolean);
            storeAddress = parts.join(', ') || store.name;
            if (store.location?.coordinates && store.location.coordinates.length === 2) {
              storeCoords = store.location.coordinates as [number, number];
            }
          }
        } catch {
          // ignore
        }
      }

      let dropAddress = 'Customer Delivery Address';
      let dropCoords: [number, number] = [storeCoords[0] + 0.01, storeCoords[1] + 0.01];
      if (order?.shippingAddress) {
        const parts = [order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.state].filter(Boolean);
        dropAddress = parts.join(', ');
      }

      await service.initializeDelivery({
        orderId,
        orderNumber,
        storeId: order?.storeId || 'store-dispatch-placeholder',
        customerId: order?.userId || 'customer-placeholder',
        pickupLocation: {
          coordinates: storeCoords,
          addressText: `${storeName}, ${storeAddress}`,
        },
        dropoffLocation: {
          coordinates: dropCoords,
          addressText: dropAddress,
        },
        estimatedPayout: 40,
      });
    } catch (err) {
      logger.warn(`[DeliveryModule] Failed to auto-initialize delivery on order confirmation: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  return { router, service, repository };
}
