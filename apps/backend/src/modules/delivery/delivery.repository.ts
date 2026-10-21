import type { Model } from 'mongoose';
import {
  DeliveryStatus,
  type IDeliveryDocument,
  type IDeliveryRepository,
  type CreateDeliveryParams,
  type DeliveryResponseDto,
  type RiderInfoDto,
} from './delivery.types.js';

function toResponse(doc: any): DeliveryResponseDto {
  return {
    id: doc._id ? String(doc._id) : String(doc.id),
    orderId: doc.orderId,
    orderNumber: doc.orderNumber,
    storeId: doc.storeId,
    customerId: doc.customerId,
    rider: doc.rider,
    pickupLocation: doc.pickupLocation,
    dropoffLocation: doc.dropoffLocation,
    distanceKm: doc.distanceKm,
    estimatedMinutes: doc.estimatedMinutes,
    status: doc.status,
    dispatchMessage: doc.dispatchMessage,
    timeline: doc.timeline || [],
    estimatedPayout: doc.estimatedPayout ?? 45,
    broadcastedAt: doc.broadcastedAt ? new Date(doc.broadcastedAt).toISOString() : undefined,
    claimedAt: doc.claimedAt ? new Date(doc.claimedAt).toISOString() : undefined,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export function createDeliveryRepository(
  model: Model<IDeliveryDocument>,
): IDeliveryRepository {
  async function create(params: CreateDeliveryParams): Promise<DeliveryResponseDto> {
    const delivery = new model({
      ...params,
      estimatedPayout: params.estimatedPayout ?? 45,
      status: DeliveryStatus.PENDING_ASSIGNMENT,
      timeline: [
        {
          status: DeliveryStatus.PENDING_ASSIGNMENT,
          timestamp: new Date().toISOString(),
          note: 'Delivery initiated, awaiting partner assignment',
        },
      ],
    });
    const saved = await delivery.save();
    return toResponse(saved);
  }

  async function findByOrderId(orderId: string): Promise<DeliveryResponseDto | null> {
    const doc = await model.findOne({ orderId }).read('secondaryPreferred');
    return doc ? toResponse(doc) : null;
  }

  async function findById(id: string): Promise<DeliveryResponseDto | null> {
    const doc = await model.findById(id).read('secondaryPreferred');
    return doc ? toResponse(doc) : null;
  }

  async function findByStoreId(
    storeId: string,
    page: number,
    limit: number,
  ): Promise<{ data: DeliveryResponseDto[]; total: number }> {
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
      total,
    };
  }

  async function findByRiderId(
    riderId: string,
    page: number,
    limit: number,
  ): Promise<{ data: DeliveryResponseDto[]; total: number }> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));

    const [rows, total] = await Promise.all([
      model
        .find({ 'rider.id': riderId })
        .read('secondaryPreferred')
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit),
      model.countDocuments({ 'rider.id': riderId }),
    ]);

    return {
      data: rows.map(toResponse),
      total,
    };
  }

  async function assignRider(
    orderId: string,
    rider: RiderInfoDto,
    estimatedMinutes: number,
    dispatchMessage?: string,
  ): Promise<DeliveryResponseDto | null> {
    const doc = await model.findOneAndUpdate(
      { orderId },
      {
        $set: {
          rider,
          estimatedMinutes,
          status: DeliveryStatus.ASSIGNED,
          dispatchMessage,
          claimedAt: new Date(),
        },
        $push: {
          timeline: {
            status: DeliveryStatus.ASSIGNED,
            timestamp: new Date().toISOString(),
            note: `Rider ${rider.name} assigned. Estimated arrival: ${estimatedMinutes} mins`,
          },
        },
      },
      { new: true },
    );
    return doc ? toResponse(doc) : null;
  }

  async function claimRiderMutex(
    orderId: string,
    rider: RiderInfoDto,
    estimatedMinutes: number,
    dispatchMessage?: string,
  ): Promise<DeliveryResponseDto | null> {
    // Atomic mutex claim: only succeeds if orderId is in PENDING_ASSIGNMENT AND rider is unset
    const doc = await model.findOneAndUpdate(
      {
        orderId,
        status: DeliveryStatus.PENDING_ASSIGNMENT,
        $or: [
          { rider: { $exists: false } },
          { 'rider.id': { $exists: false } },
          { rider: null },
        ],
      },
      {
        $set: {
          rider,
          estimatedMinutes,
          status: DeliveryStatus.ASSIGNED,
          dispatchMessage,
          claimedAt: new Date(),
        },
        $push: {
          timeline: {
            status: DeliveryStatus.ASSIGNED,
            timestamp: new Date().toISOString(),
            note: `Rider ${rider.name} (${rider.phone}) claimed job via open pool. ETA: ${estimatedMinutes} mins`,
          },
        },
      },
      { new: true },
    );
    return doc ? toResponse(doc) : null;
  }

  async function recordBroadcast(
    orderId: string,
    estimatedPayout?: number,
  ): Promise<DeliveryResponseDto | null> {
    const updateSet: Record<string, unknown> = {
      broadcastedAt: new Date(),
    };
    if (typeof estimatedPayout === 'number') {
      updateSet.estimatedPayout = estimatedPayout;
    }

    const doc = await model.findOneAndUpdate(
      { orderId },
      {
        $set: updateSet,
        $push: {
          timeline: {
            status: DeliveryStatus.PENDING_ASSIGNMENT,
            timestamp: new Date().toISOString(),
            note: `Broadcasted to hyperlocal rider pool (Payout: ₹${estimatedPayout ?? 45})`,
          },
        },
      },
      { new: true },
    );
    return doc ? toResponse(doc) : null;
  }

  async function findAvailablePoolJobs(params: {
    lat?: number;
    lng?: number;
    radiusKm?: number;
    page: number;
    limit: number;
  }): Promise<{ data: DeliveryResponseDto[]; total: number }> {
    const safePage = Math.max(1, params.page);
    const safeLimit = Math.min(50, Math.max(1, params.limit));

    const filter: Record<string, unknown> = {
      status: DeliveryStatus.PENDING_ASSIGNMENT,
      $or: [
        { rider: { $exists: false } },
        { 'rider.id': { $exists: false } },
        { rider: null },
      ],
    };

    if (typeof params.lat === 'number' && typeof params.lng === 'number') {
      const maxMeters = (params.radiusKm || 10) * 1000;
      filter['pickupLocation.coordinates'] = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [params.lng, params.lat],
          },
          $maxDistance: maxMeters,
        },
      };
    }

    let findQuery = model.find(filter).read('secondaryPreferred');
    if (!filter['pickupLocation.coordinates']) {
      findQuery = findQuery.sort({ createdAt: -1 });
    }

    const [rows, total] = await Promise.all([
      findQuery.skip((safePage - 1) * safeLimit).limit(safeLimit),
      model.countDocuments({
        status: DeliveryStatus.PENDING_ASSIGNMENT,
        $or: [
          { rider: { $exists: false } },
          { 'rider.id': { $exists: false } },
          { rider: null },
        ],
      }),
    ]);

    return {
      data: rows.map(toResponse),
      total,
    };
  }

  async function updateStatus(
    orderId: string,
    status: DeliveryStatus,
    note?: string,
  ): Promise<DeliveryResponseDto | null> {
    const doc = await model.findOneAndUpdate(
      { orderId },
      {
        $set: { status },
        $push: {
          timeline: {
            status,
            timestamp: new Date().toISOString(),
            note: note || `Status transitioned to ${status}`,
          },
        },
      },
      { new: true },
    );
    return doc ? toResponse(doc) : null;
  }

  return {
    create,
    findByOrderId,
    findById,
    findByStoreId,
    findByRiderId,
    assignRider,
    claimRiderMutex,
    recordBroadcast,
    findAvailablePoolJobs,
    updateStatus,
  };
}

