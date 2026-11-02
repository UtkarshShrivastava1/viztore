import {
  CreateSupportTicketDto,
  AddSupportMessageDto,
  UpdateSupportStatusDto,
  CreateCallbackRequestDto,
  ISupportTicket,
} from '@repo/shared-types';
import { SupportTicketModel, CallbackRequestModel, ISupportTicketDocument } from './support.model.js';
import { AppError } from '../../shared/utils/AppError.js';
import { logger } from '../../shared/utils/logger.js';

export async function createTicket(
  dto: CreateSupportTicketDto,
  actor?: { userId?: string; role?: string; storeId?: string; name?: string },
): Promise<ISupportTicketDocument> {
  const count = await SupportTicketModel.countDocuments();
  const ticketNumber = `TKT-${1250 + count}`;

  const initialMsg = {
    id: `msg-${Date.now()}`,
    senderType: dto.initiatorType === 'Merchant' ? 'merchant' : 'customer',
    senderId: actor?.userId,
    senderName: actor?.name || (dto.initiatorType === 'Merchant' ? 'Merchant Admin' : 'Customer'),
    text: dto.initialMessage,
    attachments: dto.attachments || [],
    timestamp: new Date(),
  };

  const ticket = await SupportTicketModel.create({
    ticketNumber,
    storeId: dto.storeId || actor?.storeId || undefined,
    customerId: actor?.userId || undefined,
    initiatorType: dto.initiatorType,
    subject: dto.subject,
    category: dto.category,
    priority: dto.priority || 'medium',
    status: 'open',
    orderRef: dto.orderRef,
    attachments: dto.attachments || [],
    messages: [initialMsg],
    lastUpdated: new Date(),
  });

  logger.info(`[SupportService] Created ticket ${ticketNumber} by ${dto.initiatorType}`);
  return ticket;
}

export async function getTickets(
  filter: {
    status?: string;
    category?: string;
    priority?: string;
    storeId?: string;
    customerId?: string;
    initiatorType?: string;
    search?: string;
    page?: number;
    limit?: number;
  },
  actor?: { userId?: string; role?: string; storeId?: string },
): Promise<{ tickets: ISupportTicketDocument[]; total: number; page: number; totalPages: number }> {
  const query: Record<string, any> = {};

  if (filter.status && filter.status !== 'all') {
    query.status = filter.status;
  }
  if (filter.category && filter.category !== 'all') {
    query.category = filter.category;
  }
  if (filter.priority && filter.priority !== 'all') {
    query.priority = filter.priority;
  }
  if (filter.initiatorType) {
    query.initiatorType = filter.initiatorType;
  }

  // Scoping rules based on actor role
  if (actor?.role === 'merchant') {
    if (actor.storeId) {
      query.storeId = actor.storeId;
    }
  } else if (actor?.role === 'customer') {
    query.customerId = actor.userId;
  } else {
    // Admin or specific filter
    if (filter.storeId) query.storeId = filter.storeId;
    if (filter.customerId) query.customerId = filter.customerId;
  }

  if (filter.search) {
    query.$or = [
      { ticketNumber: { $regex: filter.search, $options: 'i' } },
      { subject: { $regex: filter.search, $options: 'i' } },
      { orderRef: { $regex: filter.search, $options: 'i' } },
    ];
  }

  const page = Math.max(1, Number(filter.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(filter.limit) || 20));
  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    SupportTicketModel.find(query).sort({ lastUpdated: -1 }).skip(skip).limit(limit),
    SupportTicketModel.countDocuments(query),
  ]);

  return {
    tickets,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getTicketById(
  ticketIdOrNumber: string,
): Promise<ISupportTicketDocument> {
  let ticket: ISupportTicketDocument | null = null;
  if (ticketIdOrNumber.match(/^[0-9a-fA-F]{24}$/)) {
    ticket = await SupportTicketModel.findById(ticketIdOrNumber);
  }
  if (!ticket) {
    ticket = await SupportTicketModel.findOne({ ticketNumber: ticketIdOrNumber });
  }

  if (!ticket) {
    throw AppError.notFound('Support ticket not found', 'TICKET_NOT_FOUND');
  }

  return ticket;
}

export async function addTicketMessage(
  ticketId: string,
  dto: AddSupportMessageDto,
  actor?: { userId?: string; role?: string; name?: string },
): Promise<ISupportTicketDocument> {
  const ticket = await getTicketById(ticketId);

  const senderType = dto.senderType || (actor?.role === 'merchant' ? 'merchant' : actor?.role === 'customer' ? 'customer' : 'support');
  const senderName = dto.senderName || actor?.name || (senderType === 'merchant' ? 'Merchant Admin' : senderType === 'customer' ? 'Customer' : 'Support Specialist');

  const newMsg = {
    id: `msg-${Date.now()}`,
    senderType,
    senderId: actor?.userId,
    senderName,
    text: dto.text,
    attachments: dto.attachments || [],
    timestamp: new Date(),
  };

  ticket.messages.push(newMsg as any);
  ticket.lastUpdated = new Date();

  // If user replies to a resolved ticket, reopen as in_progress
  if (ticket.status === 'resolved' && senderType !== 'support') {
    ticket.status = 'in_progress';
  }

  await ticket.save();
  return ticket;
}

export async function updateTicketStatus(
  ticketId: string,
  dto: UpdateSupportStatusDto,
): Promise<ISupportTicketDocument> {
  const ticket = await getTicketById(ticketId);
  ticket.status = dto.status;
  ticket.lastUpdated = new Date();
  await ticket.save();
  return ticket;
}

export async function createCallbackRequest(
  dto: CreateCallbackRequestDto,
) {
  const callback = await CallbackRequestModel.create({
    name: dto.name,
    phone: dto.phone,
    topic: dto.topic,
    preferredTime: dto.preferredTime || 'Anytime',
    notes: dto.notes,
    status: 'pending',
  });

  logger.info(`[SupportService] Registered callback request for ${dto.phone} (${dto.topic})`);
  return callback;
}

