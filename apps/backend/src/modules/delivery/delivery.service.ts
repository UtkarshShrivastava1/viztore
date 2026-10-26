import {
  DeliveryStatus,
  type IDeliveryRepository,
  type IDeliveryService,
  type CreateDeliveryParams,
  type DeliveryResponseDto,
  type AssignRiderDto,
  type BroadcastDeliveryDto,
  type ClaimDeliveryDto,
  type OpenPoolQueryDto,
  type DeliveryPoolTeaserDto,
  type ClaimResultDto,
  type UpdateDeliveryStatusDto,
  type PilotRider,
  PILOT_RIDERS,
  type RiderRunDetailsDto,
} from './delivery.types.js';
import { IEventBus } from '../../shared/events/eventBus.js';
import { EVENTS } from '../../shared/events/eventTypes.js';
import { AppError } from '../../shared/utils/AppError.js';
import { logger } from '../../shared/utils/logger.js';
import type { IOrderFacade } from '../orders/index.js';
import { findStoreById } from '../stores/store.service.js';

const allowedTransitions: Record<DeliveryStatus, DeliveryStatus[]> = {
  [DeliveryStatus.PENDING_ASSIGNMENT]: [DeliveryStatus.ASSIGNED, DeliveryStatus.CANCELLED],
  [DeliveryStatus.ASSIGNED]: [DeliveryStatus.PICKED_UP, DeliveryStatus.CANCELLED],
  [DeliveryStatus.PICKED_UP]: [DeliveryStatus.IN_TRANSIT, DeliveryStatus.CANCELLED],
  [DeliveryStatus.IN_TRANSIT]: [DeliveryStatus.ARRIVED, DeliveryStatus.FAILED],
  [DeliveryStatus.ARRIVED]: [DeliveryStatus.DELIVERED, DeliveryStatus.FAILED],
  [DeliveryStatus.DELIVERED]: [],
  [DeliveryStatus.CANCELLED]: [],
  [DeliveryStatus.FAILED]: [DeliveryStatus.PENDING_ASSIGNMENT],
};

/**
 * Calculates straight-line distance using the Haversine formula (km)
 */
function calculateDistanceKm(
  coord1: [number, number], // [lng, lat]
  coord2: [number, number], // [lng, lat]
): number {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100;
}

/**
 * Constructs WhatsApp dispatch message and Google Maps routing link
 */
function constructDispatchMessage(
  orderNumber: string,
  riderName: string,
  pickup: { coordinates: [number, number]; addressText: string },
  dropoff: { coordinates: [number, number]; addressText: string },
): string {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${pickup.coordinates[1]},${pickup.coordinates[0]}&destination=${dropoff.coordinates[1]},${dropoff.coordinates[0]}&travelmode=two-wheeler`;

  return [
    `🛵 *NEW DELIVERY ASSIGNMENT*`,
    `Order #${orderNumber}`,
    `Assigned Rider: ${riderName}`,
    `--------------------------------`,
    `📍 *Pickup:* ${pickup.addressText}`,
    `🏠 *Dropoff:* ${dropoff.addressText}`,
    `🗺️ *Navigation Route:* ${mapsUrl}`,
    `--------------------------------`,
    `Please verify the 4-digit OTP from customer upon delivery handoff.`,
  ].join('\n');
}

/**
 * Sanitizes address strings for public rider pool teaser (privacy preservation)
 */
function extractArea(addressText: string): string {
  if (!addressText) return 'Local Area';
  const parts = addressText.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const last = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2];
    if (last && secondLast && last.toLowerCase() === secondLast.toLowerCase()) {
      return last;
    }
    return parts.slice(-2).join(', ');
  }
  return parts[0] || 'Local Area';
}

/**
 * Redacts exact customer address and phone number for open pool listing
 */
function sanitizeTeaser(delivery: DeliveryResponseDto): DeliveryPoolTeaserDto {
  const payout = delivery.estimatedPayout ?? 40;
  return {
    deliveryId: delivery.id,
    orderId: delivery.orderId,
    orderNumber: delivery.orderNumber,
    storeId: delivery.storeId,
    pickupArea: extractArea(delivery.pickupLocation.addressText),
    dropoffArea: extractArea(delivery.dropoffLocation.addressText),
    distanceKm: delivery.distanceKm,
    estimatedMinutes: delivery.estimatedMinutes,
    estimatedPayout: payout,
    claimUrl: `/api/v1/delivery/${delivery.orderId}/claim`,
    broadcastedAt: delivery.broadcastedAt || new Date().toISOString(),
    teaserWhatsAppText: `🛵 Hyperlocal Delivery Run: Order #${delivery.orderNumber} (${delivery.distanceKm}km, ~${delivery.estimatedMinutes}m) Payout: ₹${payout}. Claim run: /api/v1/delivery/${delivery.orderId}/claim`,
  };
}

export function createDeliveryService(
  repo: IDeliveryRepository,
  bus?: IEventBus,
  orderFacade?: IOrderFacade,
): IDeliveryService {
  function calculateEta(
    pickup: [number, number],
    dropoff: [number, number],
  ): { distanceKm: number; estimatedMinutes: number } {
    const distanceKm = calculateDistanceKm(pickup, dropoff);
    // Typical hyperlocal urban speed: 15 km/h + 8 minutes buffer for pickup/parking
    const estimatedMinutes = Math.max(15, Math.ceil((distanceKm / 15) * 60 + 8));
    return { distanceKm, estimatedMinutes };
  }

  async function initializeDelivery(params: CreateDeliveryParams): Promise<DeliveryResponseDto> {
    const existing = await repo.findByOrderId(params.orderId);
    if (existing) {
      return existing;
    }

    const { distanceKm, estimatedMinutes } = calculateEta(
      params.pickupLocation.coordinates,
      params.dropoffLocation.coordinates,
    );

    const delivery = await repo.create({
      ...params,
    });

    logger.info(`[DeliveryService] Initialized delivery for order #${params.orderNumber} (Distance: ${distanceKm}km, ETA: ${estimatedMinutes}m)`);
    return delivery;
  }

  async function getTracking(orderId: string): Promise<DeliveryResponseDto | null> {
    return repo.findByOrderId(orderId);
  }

  async function assignRider(
    orderId: string,
    dto: AssignRiderDto,
  ): Promise<DeliveryResponseDto | null> {
    const delivery = await repo.findByOrderId(orderId);
    if (!delivery) {
      throw AppError.notFound('Delivery record for this order not found', 'DELIVERY_NOT_FOUND');
    }

    const dispatchMessage = constructDispatchMessage(
      delivery.orderNumber,
      dto.rider.name,
      delivery.pickupLocation,
      delivery.dropoffLocation,
    );

    const updated = await repo.assignRider(
      orderId,
      dto.rider,
      dto.estimatedMinutes,
      dispatchMessage,
    );

    if (updated && bus) {
      bus.emit(EVENTS.DELIVERY_ASSIGNED, {
        orderId,
        riderId: dto.rider.id,
        estimatedMinutes: dto.estimatedMinutes,
        riderPhone: dto.rider.phone,
        riderName: dto.rider.name,
        dispatchMessage,
      });
      logger.info(`[DeliveryService] Emitted DELIVERY_ASSIGNED for order ${orderId} to rider ${dto.rider.id}`);
    }

    return updated;
  }

  async function broadcastJob(
    orderId: string,
    dto?: BroadcastDeliveryDto,
  ): Promise<DeliveryPoolTeaserDto> {
    const delivery = await repo.findByOrderId(orderId);
    if (!delivery) {
      throw AppError.notFound('Delivery record for this order not found', 'DELIVERY_NOT_FOUND');
    }

    if (delivery.status !== DeliveryStatus.PENDING_ASSIGNMENT || (delivery.rider && delivery.rider.id)) {
      throw AppError.badRequest(
        'Cannot broadcast job: delivery is already assigned or inactive',
        'JOB_NOT_AVAILABLE',
      );
    }

    const payout = dto?.estimatedPayout ?? delivery.estimatedPayout ?? 45;
    const updated = await repo.recordBroadcast(orderId, payout);
    const target = updated || delivery;
    const teaser = sanitizeTeaser(target);

    if (bus) {
      bus.emit(EVENTS.DELIVERY_BROADCAST, {
        orderId,
        orderNumber: teaser.orderNumber,
        storeId: teaser.storeId,
        pickupArea: teaser.pickupArea,
        dropoffArea: teaser.dropoffArea,
        distanceKm: teaser.distanceKm,
        estimatedMinutes: teaser.estimatedMinutes,
        estimatedPayout: teaser.estimatedPayout,
        claimUrl: teaser.claimUrl,
        broadcastedAt: new Date().toISOString(),
      });
      logger.info(`[DeliveryService] Broadcasted order ${orderId} to rider pool (Payout: ₹${payout})`);
    }

    return teaser;
  }

  async function getAvailableJobs(
    query: OpenPoolQueryDto,
  ): Promise<{ data: DeliveryPoolTeaserDto[]; total: number; page: number; limit: number }> {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;

    const result = await repo.findAvailablePoolJobs({
      lat: query.lat,
      lng: query.lng,
      radiusKm: query.radiusKm,
      page,
      limit,
    });

    return {
      data: result.data.map(sanitizeTeaser),
      total: result.total,
      page,
      limit,
    };
  }

  async function claimJob(orderId: string, dto: ClaimDeliveryDto): Promise<ClaimResultDto> {
    const delivery = await repo.findByOrderId(orderId);
    if (!delivery) {
      throw AppError.notFound('Delivery record for this order not found', 'DELIVERY_NOT_FOUND');
    }

    if (delivery.status !== DeliveryStatus.PENDING_ASSIGNMENT || (delivery.rider && delivery.rider.id)) {
      throw AppError.conflict(
        'This delivery job has already been claimed by another delivery partner.',
        'DELIVERY_ALREADY_CLAIMED',
      );
    }

    const estimatedMinutes = dto.estimatedMinutes || delivery.estimatedMinutes || 25;
    const dispatchMessage = constructDispatchMessage(
      delivery.orderNumber,
      dto.rider.name,
      delivery.pickupLocation,
      delivery.dropoffLocation,
    );

    const updated = await repo.claimRiderMutex(
      orderId,
      dto.rider,
      estimatedMinutes,
      dispatchMessage,
    );

    if (!updated) {
      throw AppError.conflict(
        'Race condition detected: this delivery was claimed by another partner moments ago.',
        'DELIVERY_ALREADY_CLAIMED',
      );
    }

    if (bus) {
      bus.emit(EVENTS.DELIVERY_CLAIMED, {
        orderId,
        orderNumber: updated.orderNumber,
        riderId: dto.rider.id,
        riderName: dto.rider.name,
        riderPhone: dto.rider.phone,
        claimedAt: new Date().toISOString(),
      });
      bus.emit(EVENTS.DELIVERY_ASSIGNED, {
        orderId,
        riderId: dto.rider.id,
        estimatedMinutes,
        riderPhone: dto.rider.phone,
        riderName: dto.rider.name,
        dispatchMessage,
      });
      logger.info(`[DeliveryService] Order ${orderId} successfully claimed by rider ${dto.rider.id} (${dto.rider.name}) via open pool mutex`);
    }

    const navigationUrl = `https://www.google.com/maps/dir/?api=1&origin=${updated.pickupLocation.coordinates[1]},${updated.pickupLocation.coordinates[0]}&destination=${updated.dropoffLocation.coordinates[1]},${updated.dropoffLocation.coordinates[0]}&travelmode=two-wheeler`;

    return {
      success: true,
      message: 'Delivery job claimed successfully',
      delivery: updated,
      navigationUrl,
      customerContact: {
        name: 'Customer',
        phone: '',
        dropoffAddress: updated.dropoffLocation.addressText,
      },
      pickupContact: {
        storeName: 'Local Partner Store',
        pickupAddress: updated.pickupLocation.addressText,
      },
      instructions: 'Head to merchant shop, confirm order number, collect package, and verify OTP at customer doorstep.',
    };
  }

  async function updateStatus(
    orderId: string,
    dto: UpdateDeliveryStatusDto,
    actorRole?: string,
  ): Promise<DeliveryResponseDto | null> {
    const current = await repo.findByOrderId(orderId);
    if (!current) {
      throw AppError.notFound('Delivery record not found', 'DELIVERY_NOT_FOUND');
    }

    // State machine check
    const allowed = allowedTransitions[current.status] || [];
    if (!allowed.includes(dto.status)) {
      throw AppError.badRequest(
        `Invalid delivery transition: ${current.status} -> ${dto.status}`,
        'INVALID_DELIVERY_TRANSITION',
      );
    }

    // If moving to DELIVERED, verify OTP
    if (dto.status === DeliveryStatus.DELIVERED) {
      if (!dto.deliveryOtp) {
        throw AppError.badRequest('4-digit Delivery OTP is required to mark delivery as completed', 'OTP_REQUIRED');
      }
      return verifyOtpAndComplete(orderId, dto.deliveryOtp);
    }

    const updated = await repo.updateStatus(orderId, dto.status, dto.note);
    logger.info(`[DeliveryService] Order ${orderId} delivery status changed: ${current.status} -> ${dto.status} by ${actorRole || 'system'}`);
    return updated;
  }

  async function verifyOtpAndComplete(
    orderId: string,
    otp: string,
  ): Promise<DeliveryResponseDto | null> {
    const delivery = await repo.findByOrderId(orderId);
    if (!delivery) {
      throw AppError.notFound('Delivery record for this order not found', 'DELIVERY_NOT_FOUND');
    }

    const targetOrderId = delivery.orderId || delivery.orderNumber || orderId;

    if (orderFacade) {
      const order = await orderFacade.markAsDelivered(targetOrderId, otp);
      if (!order) {
        throw AppError.badRequest('Invalid 4-digit Delivery OTP or order could not be confirmed', 'INVALID_DELIVERY_OTP');
      }
    }

    const updated = await repo.updateStatus(orderId, DeliveryStatus.DELIVERED, 'Customer verified 4-digit OTP. Delivery complete.');

    if (updated && bus) {
      bus.emit(EVENTS.DELIVERY_COMPLETED, {
        orderId: updated.orderId,
        orderNumber: updated.orderNumber,
        previousStatus: DeliveryStatus.ARRIVED,
        newStatus: DeliveryStatus.DELIVERED,
      });
      logger.info(`[DeliveryService] Emitted DELIVERY_COMPLETED for order ${updated.orderId}`);
    }

    return updated;
  }

  function getPilotRoster(): PilotRider[] {
    return PILOT_RIDERS;
  }

  async function getRunDetails(orderId: string, callerRiderId?: string): Promise<RiderRunDetailsDto | null> {
    const delivery = await repo.findByOrderId(orderId);
    if (!delivery) {
      return null;
    }

    const targetOrderId = delivery.orderId || delivery.orderNumber || orderId;
    let orderInfo: {
      totalAmount: number;
      paymentMethod: string;
      customerName: string;
      customerPhone: string;
      dropoffAddress?: string;
      pickupStoreName?: string;
      pickupAddress?: string;
      pickupPhone?: string;
    } | null = null;

    if (orderFacade) {
      try {
        const order = await orderFacade.getOrderById(targetOrderId);
        if (order) {
          const isCod = Boolean(
            (order as any).payment?.paymentMethod === 'Cash on Delivery' ||
            (order as any).paymentMethod === 'cod' ||
            (order as any).paymentMethod === 'COD' ||
            (order as any).paymentMethod === 'CASH_ON_DELIVERY'
          );

          let storeName = '';
          let storeAddress = '';
          let storePhone = '';
          if (order.storeId) {
            try {
              const store = await findStoreById(order.storeId);
              if (store) {
                storeName = store.name;
                storePhone = store.phone || '';
                const parts = [store.address?.street, store.address?.city, store.address?.state].filter(Boolean);
                storeAddress = parts.join(', ') || store.name;
              }
            } catch {
              // fallback
            }
          }

          const dropAddress = order.shippingAddress
            ? [order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.state].filter(Boolean).join(', ')
            : undefined;

          orderInfo = {
            totalAmount: order.grandTotal ?? 0,
            paymentMethod: isCod ? 'CASH_ON_DELIVERY' : 'PREPAID',
            customerName: order.shippingAddress?.fullName ?? 'Customer',
            customerPhone: order.shippingAddress?.phone ?? '',
            dropoffAddress: dropAddress,
            pickupStoreName: storeName,
            pickupAddress: storeAddress,
            pickupPhone: storePhone,
          };
        }
      } catch (err) {
        logger.warn(`[DeliveryService] Could not fetch order ${orderId} details: ${err}`);
      }
    }

    const isClaimed = Boolean(delivery.rider?.id && delivery.status !== DeliveryStatus.PENDING_ASSIGNMENT);
    const isClaimedByCaller = Boolean(isClaimed && callerRiderId && delivery.rider?.id === callerRiderId);

    const pickupNavigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${delivery.pickupLocation.coordinates[1]},${delivery.pickupLocation.coordinates[0]}&travelmode=two-wheeler`;
    const dropoffNavigationUrl = `https://www.google.com/maps/dir/?api=1&origin=${delivery.pickupLocation.coordinates[1]},${delivery.pickupLocation.coordinates[0]}&destination=${delivery.dropoffLocation.coordinates[1]},${delivery.dropoffLocation.coordinates[0]}&travelmode=two-wheeler`;

    const pickupAddressText: string = orderInfo?.pickupAddress || (delivery.pickupLocation.addressText !== 'Store Local Depot' ? delivery.pickupLocation.addressText : 'Store Partner');
    const storeDisplayName: string = orderInfo?.pickupStoreName || (delivery.pickupLocation.addressText !== 'Store Local Depot' ? (delivery.pickupLocation.addressText.split(',')[0] || 'Store Partner') : 'Store Partner');
    const dropAddressText: string = orderInfo?.dropoffAddress || (delivery.dropoffLocation.addressText !== 'Customer Delivery Address' ? delivery.dropoffLocation.addressText : 'Customer Address');

    const result: RiderRunDetailsDto = {
      orderId: delivery.orderId,
      orderNumber: delivery.orderNumber,
      status: delivery.status,
      distanceKm: delivery.distanceKm,
      estimatedMinutes: delivery.estimatedMinutes,
      estimatedPayout: delivery.estimatedPayout ?? 40,
      pickupArea: storeDisplayName,
      dropoffArea: extractArea(dropAddressText),
      paymentMethod: orderInfo?.paymentMethod || 'PREPAID',
      totalAmount: orderInfo?.totalAmount || 0,
      isClaimed,
      isClaimedByCaller,
      claimedByRider: delivery.rider ? { id: delivery.rider.id, name: delivery.rider.name } : undefined,
    };

    if (isClaimedByCaller) {
      result.pickupDetails = {
        storeName: storeDisplayName,
        storePhone: orderInfo?.pickupPhone || '',
        pickupAddress: pickupAddressText,
        navigationUrl: pickupNavigationUrl,
        pickupCode: `#${delivery.orderNumber.slice(-4).toUpperCase()}`,
      };
      result.dropoffDetails = {
        customerName: orderInfo?.customerName || 'Customer',
        customerPhone: orderInfo?.customerPhone || '',
        dropoffAddress: dropAddressText,
        navigationUrl: dropoffNavigationUrl,
      };
    }

    return result;
  }

  return {
    initializeDelivery,
    getTracking,
    assignRider,
    broadcastJob,
    getAvailableJobs,
    claimJob,
    updateStatus,
    verifyOtpAndComplete,
    calculateEta,
    getPilotRoster,
    getRunDetails,
  };
}

