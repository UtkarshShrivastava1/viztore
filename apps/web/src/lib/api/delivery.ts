import { api } from './client';
import type {
  PilotRider,
  RiderRunDetailsDto,
  DeliveryStatus,
  ClaimResultDto,
  DeliveryResponseDto,
} from '@repo/shared-types';

export const deliveryApi = {
  getPilotRoster: async (): Promise<PilotRider[]> => {
    const res = await api.get<PilotRider[]>('/delivery/riders/pilot-roster');
    return res.data;
  },

  getRunDetails: async (orderId: string, riderId?: string): Promise<RiderRunDetailsDto> => {
    const res = await api.get<RiderRunDetailsDto>(`/delivery/orders/${orderId}/run-details`, {
      riderId,
    });
    return res.data;
  },

  claimRun: async (
    orderId: string,
    rider: PilotRider,
    estimatedMinutes = 25,
  ): Promise<ClaimResultDto> => {
    const res = await api.post<DeliveryResponseDto>(`/delivery/orders/${orderId}/claim`, {
      rider: {
        id: rider.id,
        name: rider.name,
        phone: rider.phone,
        vehicleType: rider.vehicleType || 'MOTORCYCLE',
      },
      estimatedMinutes,
    });
    return {
      success: true,
      message: 'Run claimed successfully',
      delivery: res.data,
    };
  },

  updateStatus: async (
    orderId: string,
    status: DeliveryStatus,
    note?: string,
  ): Promise<DeliveryResponseDto> => {
    const res = await api.patch<DeliveryResponseDto>(`/delivery/orders/${orderId}/status`, {
      status,
      note,
    });
    return res.data;
  },

  verifyOtp: async (orderId: string, otp: string): Promise<DeliveryResponseDto> => {
    const res = await api.post<DeliveryResponseDto>(`/delivery/orders/${orderId}/verify-otp`, {
      otp,
    });
    return res.data;
  },
};
