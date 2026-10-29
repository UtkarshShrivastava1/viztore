import { api } from './client.js';
import type { IReturn } from '@repo/shared-types';

export const returnsApi = {
  /**
   * Request a return or exchange against a delivered order
   */
  requestReturn: async (payload: any): Promise<IReturn> => {
    const res = await api.post<IReturn>('/returns', payload);
    return res.data;
  },

  /**
   * Fetch customer's own returns
   */
  getMyReturns: async (): Promise<IReturn[]> => {
    const res = await api.get<IReturn[]>('/returns/my-returns');
    return res.data;
  },
};

