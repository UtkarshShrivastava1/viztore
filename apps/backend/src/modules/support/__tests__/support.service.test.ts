import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import * as supportService from '../support.service.js';
import { SupportTicketModel, CallbackRequestModel } from '../support.model.js';

describe('SupportService Unit Tests (AUDIT-059)', () => {
  const mockStoreId = new mongoose.Types.ObjectId().toString();
  const mockUserId = new mongoose.Types.ObjectId().toString();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTicket', () => {
    it('should create a support ticket with generated ticketNumber and initial message', async () => {
      vi.spyOn(SupportTicketModel, 'countDocuments').mockResolvedValueOnce(5 as any);
      const mockCreated = {
        _id: new mongoose.Types.ObjectId(),
        ticketNumber: 'TKT-1255',
        subject: 'Barcode scanner offline',
        category: 'Products & Inventory',
        priority: 'high',
        status: 'open',
        messages: [{ text: 'Please help' }],
      };
      vi.spyOn(SupportTicketModel, 'create').mockResolvedValueOnce(mockCreated as any);

      const ticket = await supportService.createTicket(
        {
          subject: 'Barcode scanner offline',
          category: 'Products & Inventory',
          priority: 'high',
          initiatorType: 'Merchant',
          initialMessage: 'Please help',
          storeId: mockStoreId,
        },
        { userId: mockUserId, storeId: mockStoreId, role: 'merchant' },
      );

      expect(ticket.ticketNumber).toBe('TKT-1255');
      expect(ticket.subject).toBe('Barcode scanner offline');
    });
  });

  describe('getTickets', () => {
    it('should query tickets scoped by storeId for merchant actor', async () => {
      const mockFind = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ ticketNumber: 'TKT-1250' }]),
      };
      vi.spyOn(SupportTicketModel, 'find').mockReturnValue(mockFind as any);
      vi.spyOn(SupportTicketModel, 'countDocuments').mockResolvedValue(1 as any);

      const result = await supportService.getTickets(
        { status: 'open' },
        { userId: mockUserId, role: 'merchant', storeId: mockStoreId },
      );

      expect(result.tickets.length).toBe(1);
      expect(result.total).toBe(1);
    });
  });

  describe('addTicketMessage', () => {
    it('should push a new message and transition status to in_progress if resolved', async () => {
      const mockTicket = {
        _id: new mongoose.Types.ObjectId(),
        ticketNumber: 'TKT-1250',
        status: 'resolved',
        messages: [],
        lastUpdated: new Date(),
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(SupportTicketModel, 'findById').mockResolvedValue(mockTicket as any);

      await supportService.addTicketMessage(
        mockTicket._id.toString(),
        { text: 'Still having issues with the barcode', senderType: 'merchant' },
        { userId: mockUserId, role: 'merchant', name: 'Store Manager' },
      );

      expect(mockTicket.messages.length).toBe(1);
      expect(mockTicket.status).toBe('in_progress');
      expect(mockTicket.save).toHaveBeenCalled();
    });
  });

  describe('updateTicketStatus', () => {
    it('should update ticket status', async () => {
      const mockTicket = {
        _id: new mongoose.Types.ObjectId(),
        ticketNumber: 'TKT-1250',
        status: 'open',
        lastUpdated: new Date(),
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(SupportTicketModel, 'findById').mockResolvedValue(mockTicket as any);

      const updated = await supportService.updateTicketStatus(mockTicket._id.toString(), {
        status: 'resolved',
      });

      expect(updated.status).toBe('resolved');
      expect(mockTicket.save).toHaveBeenCalled();
    });
  });

  describe('createCallbackRequest', () => {
    it('should record a customer callback request', async () => {
      const mockCreated = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Rahul Sharma',
        phone: '9876543210',
        topic: 'Damaged item delivery',
        status: 'pending',
      };
      vi.spyOn(CallbackRequestModel, 'create').mockResolvedValueOnce(mockCreated as any);

      const res = await supportService.createCallbackRequest({
        name: 'Rahul Sharma',
        phone: '9876543210',
        topic: 'Damaged item delivery',
        preferredTime: 'Evening (5-7 PM)',
      });

      expect(res.phone).toBe('9876543210');
      expect(res.status).toBe('pending');
    });
  });
});

