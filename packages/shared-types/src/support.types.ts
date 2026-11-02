import { z } from 'zod';

export type SupportTicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type SupportTicketPriority = 'low' | 'medium' | 'high';
export type SupportInitiatorType = 'Merchant' | 'Customer';

export const supportTicketStatusSchema = z.enum(['open', 'in_progress', 'resolved', 'closed']);
export const supportTicketPrioritySchema = z.enum(['low', 'medium', 'high']);
export const supportInitiatorTypeSchema = z.enum(['Merchant', 'Customer']);

export interface ISupportAttachment {
  name: string;
  url: string;
  fileType?: string;
  sizeBytes?: number;
}

export interface ISupportMessage {
  id: string;
  senderType: 'merchant' | 'customer' | 'support';
  senderId?: string;
  senderName: string;
  text: string;
  attachments?: ISupportAttachment[];
  timestamp: string | Date;
}

export interface ISupportTicket {
  _id: string;
  id?: string;
  ticketNumber: string;
  storeId?: string;
  customerId?: string;
  initiatorType: SupportInitiatorType;
  subject: string;
  category: string;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  orderRef?: string;
  messages: ISupportMessage[];
  attachments?: ISupportAttachment[];
  lastUpdated: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export const createSupportTicketSchema = z.object({
  subject: z.string().min(3).max(200),
  category: z.string().min(2).max(100),
  priority: supportTicketPrioritySchema.default('medium'),
  initiatorType: supportInitiatorTypeSchema.default('Merchant'),
  orderRef: z.string().optional(),
  initialMessage: z.string().min(5).max(3000),
  storeId: z.string().optional(),
  attachments: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      fileType: z.string().optional(),
      sizeBytes: z.number().optional(),
    }),
  ).optional().default([]),
});

export const addSupportMessageSchema = z.object({
  text: z.string().min(1).max(3000),
  senderType: z.enum(['merchant', 'customer', 'support']).default('merchant'),
  senderName: z.string().min(2).max(100).optional(),
  attachments: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      fileType: z.string().optional(),
      sizeBytes: z.number().optional(),
    }),
  ).optional().default([]),
});

export const updateSupportStatusSchema = z.object({
  status: supportTicketStatusSchema,
});

export const createCallbackRequestSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid 10-digit mobile number'),
  topic: z.string().min(2).max(100),
  preferredTime: z.string().optional().default('Anytime'),
  notes: z.string().max(1000).optional(),
});

export type CreateSupportTicketDto = z.infer<typeof createSupportTicketSchema>;
export type AddSupportMessageDto = z.infer<typeof addSupportMessageSchema>;
export type UpdateSupportStatusDto = z.infer<typeof updateSupportStatusSchema>;
export type CreateCallbackRequestDto = z.infer<typeof createCallbackRequestSchema>;

