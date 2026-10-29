export * from './customer.model.js';
export * from './customer.service.js';
export * from './customer.controller.js';
export * from './customer.routes.js';
export * from './customer.validation.js';

import { customerService } from './customer.service.js';

export const customerModule = {
  upsertFromOrderOrInvoice: (
    storeId: string,
    data: {
      name: string;
      phone: string;
      email?: string;
      address?: string;
      totalAmount: number;
      dueAmount: number;
      referenceNo: string;
      userId?: string;
    },
  ) => customerService.upsertFromOrderOrInvoice(storeId, data),
};

