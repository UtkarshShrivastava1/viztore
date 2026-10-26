import { z } from 'zod';

/**
 * Delivery Domain Status Enum
 */
export enum DeliveryStatus {
  PENDING_ASSIGNMENT = 'PENDING_ASSIGNMENT',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  ARRIVED = 'ARRIVED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

/**
 * Rider Vehicle Type
 */
export enum VehicleType {
  BICYCLE = 'BICYCLE',
  MOTORCYCLE = 'MOTORCYCLE',
  SCOOTER = 'SCOOTER',
  ELECTRIC_VEHICLE = 'ELECTRIC_VEHICLE',
}

// ── Zod Validation Schemas ──────────────────────────────────────────────

export const riderInfoSchema = z.object({
  id: z.string().min(1, 'Rider ID is required'),
  name: z.string().min(2, 'Rider name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  vehicleType: z.nativeEnum(VehicleType).default(VehicleType.MOTORCYCLE),
  vehicleNumber: z.string().optional(),
});

export const assignRiderSchema = z.object({
  rider: riderInfoSchema,
  estimatedMinutes: z.number().int().positive().max(180).default(30),
});

export const updateDeliveryStatusSchema = z.object({
  status: z.nativeEnum(DeliveryStatus),
  note: z.string().max(300).optional(),
  deliveryOtp: z.string().length(4, 'Delivery OTP must be 4 digits').optional(),
});

export const verifyDeliveryOtpSchema = z.object({
  otp: z.string().length(4, 'OTP must be 4 digits'),
});

export const deliveryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.nativeEnum(DeliveryStatus).optional(),
});

export const broadcastDeliverySchema = z.object({
  radiusKm: z.number().positive().max(25).default(5),
  estimatedPayout: z.number().positive().optional(),
  notes: z.string().max(200).optional(),
});

export const claimDeliverySchema = z.object({
  rider: riderInfoSchema,
  estimatedMinutes: z.number().int().positive().max(180).default(30),
});

export const openPoolQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().positive().max(50).default(10),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

// ── Inferred DTO Types ─────────────────────────────────────────────────

export type RiderInfoDto = z.infer<typeof riderInfoSchema>;
export type AssignRiderDto = z.infer<typeof assignRiderSchema>;
export type BroadcastDeliveryDto = z.infer<typeof broadcastDeliverySchema>;
export type ClaimDeliveryDto = z.infer<typeof claimDeliverySchema>;
export type OpenPoolQueryDto = z.infer<typeof openPoolQuerySchema>;
export type UpdateDeliveryStatusDto = z.infer<typeof updateDeliveryStatusSchema>;
export type VerifyDeliveryOtpDto = z.infer<typeof verifyDeliveryOtpSchema>;
export type DeliveryQueryDto = z.infer<typeof deliveryQuerySchema>;

export interface DeliveryTimelineEntry {
  status: DeliveryStatus;
  timestamp: string;
  note?: string;
}

export interface DeliveryPoolTeaserDto {
  deliveryId: string;
  orderId: string;
  orderNumber: string;
  storeId: string;
  storeName?: string;
  pickupArea: string;
  dropoffArea: string;
  distanceKm: number;
  estimatedMinutes: number;
  estimatedPayout: number;
  claimUrl: string;
  broadcastedAt: string;
  teaserWhatsAppText: string;
}

export interface ClaimResultDto {
  success: boolean;
  message: string;
  delivery: DeliveryResponseDto;
  navigationUrl?: string;
  customerContact?: {
    name: string;
    phone: string;
    dropoffAddress: string;
  };
  pickupContact?: {
    storeName: string;
    pickupAddress: string;
  };
  instructions?: string;
}

export interface DeliveryResponseDto {
  id: string;
  orderId: string;
  orderNumber: string;
  storeId: string;
  customerId: string;
  rider?: RiderInfoDto;
  pickupLocation: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
    addressText: string;
  };
  dropoffLocation: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
    addressText: string;
  };
  distanceKm: number;
  estimatedMinutes: number;
  status: DeliveryStatus;
  dispatchMessage?: string;
  timeline: DeliveryTimelineEntry[];
  estimatedPayout?: number;
  broadcastedAt?: string;
  claimedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Pilot Rider Roster & Run Details ───────────────────────────────────

export interface PilotRider {
  id: string;
  name: string;
  phone: string;
  zone: string;
  vehicleType?: VehicleType;
}

export const PILOT_RIDERS: PilotRider[] = [
  { id: 'RDR-001', name: 'Raju Sharma', phone: '9876543210', zone: 'Nehru Nagar / Smriti Nagar', vehicleType: VehicleType.MOTORCYCLE },
  { id: 'RDR-002', name: 'Vikram Patel', phone: '9876543211', zone: 'Supela / Vaishali Nagar', vehicleType: VehicleType.MOTORCYCLE },
  { id: 'RDR-003', name: 'Amit Verma', phone: '9876543212', zone: 'Durg Station / Market', vehicleType: VehicleType.MOTORCYCLE },
  { id: 'RDR-004', name: 'Sunil Sahu', phone: '9876543213', zone: 'Risali / Bhilai-3', vehicleType: VehicleType.MOTORCYCLE },
  { id: 'RDR-005', name: 'Pankaj Kumar', phone: '9876543214', zone: 'Sector 6 / Civic Center', vehicleType: VehicleType.MOTORCYCLE },
];

export interface RiderRunDetailsDto {
  orderId: string;
  orderNumber: string;
  status: DeliveryStatus;
  distanceKm: number;
  estimatedMinutes: number;
  estimatedPayout: number;
  pickupArea: string;
  dropoffArea: string;
  paymentMethod: string;
  totalAmount: number;
  isClaimed: boolean;
  isClaimedByCaller: boolean;
  claimedByRider?: {
    id: string;
    name: string;
  };
  pickupDetails?: {
    storeName: string;
    storePhone: string;
    pickupAddress: string;
    navigationUrl: string;
    pickupCode: string;
  };
  dropoffDetails?: {
    customerName: string;
    customerPhone: string;
    dropoffAddress: string;
    navigationUrl: string;
  };
}
