import { Router } from 'express';
import {
  createSupportTicketSchema,
  addSupportMessageSchema,
  updateSupportStatusSchema,
  createCallbackRequestSchema,
} from '@repo/shared-types';
import { validateRequest } from '../../shared/middlewares/validateRequest.js';
import { optionalAuthGuard, authGuard } from '../../shared/middlewares/authGuard.js';
import * as supportController from './support.controller.js';

const router = Router();

// Create Ticket (Authenticated or Guest Inquiry with optional token)
router.post(
  '/tickets',
  optionalAuthGuard,
  validateRequest({ body: createSupportTicketSchema }),
  supportController.createTicket,
);

// Get Tickets
router.get(
  '/tickets',
  optionalAuthGuard,
  supportController.getTickets,
);

// Get Ticket by ID or Ticket Number
router.get(
  '/tickets/:id',
  optionalAuthGuard,
  supportController.getTicketById,
);

// Add Message to Ticket Conversation
router.post(
  '/tickets/:id/messages',
  optionalAuthGuard,
  validateRequest({ body: addSupportMessageSchema }),
  supportController.addMessage,
);

// Update Status
router.patch(
  '/tickets/:id/status',
  optionalAuthGuard,
  validateRequest({ body: updateSupportStatusSchema }),
  supportController.updateStatus,
);

// Callback Request
router.post(
  '/callback-requests',
  validateRequest({ body: createCallbackRequestSchema }),
  supportController.createCallbackRequest,
);

export const supportRouter = router;

