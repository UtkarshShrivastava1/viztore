import {
  DeliveryStatus,
  type IDeliveryRepository,
  type IDeliveryService,
  type CreateDeliveryParams,
  type DeliveryResponseDto,
  type AssignRiderDto,
  type UpdateDeliveryStatusDto,
} from './delivery.types.js';
import { IEventBus } from '../../shared/events/eventBus.js';
import { EVENTS } from '../../shared/events/eventTypes.js';
import { AppError } from '../../shared/utils/AppError.js';
import { logger } from '../../shared/utils/logger.js';
import type { IOrderFacade } from '../orders/index.js';

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
    if (orderFacade) {
      const order = await orderFacade.markAsDelivered(orderId, otp);
      if (!order) {
        throw AppError.badRequest('Invalid 4-digit Delivery OTP or order could not be confirmed', 'INVALID_DELIVERY_OTP');
      }
    }

    const updated = await repo.updateStatus(orderId, DeliveryStatus.DELIVERED, 'Customer verified 4-digit OTP. Delivery complete.');

    if (updated && bus) {
      bus.emit(EVENTS.DELIVERY_COMPLETED, {
        orderId,
        orderNumber: updated.orderNumber,
        previousStatus: DeliveryStatus.ARRIVED,
        newStatus: DeliveryStatus.DELIVERED,
      });
      logger.info(`[DeliveryService] Emitted DELIVERY_COMPLETED for order ${orderId}`);
    }

    return updated;
  }

  return {
    initializeDelivery,
    getTracking,
    assignRider,
    updateStatus,
    verifyOtpAndComplete,
    calculateEta,
  };
}
