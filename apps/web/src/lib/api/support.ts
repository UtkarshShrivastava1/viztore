import { api } from './client.js';

export interface CreateSupportTicketPayload {
  subject: string;
  category: string;
  initialMessage: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  orderRef?: string;
  attachments?: string[];
}

export const supportApi = {
  createTicket: (data: CreateSupportTicketPayload) =>
    api.post<any>('/support/tickets', data),
  getTickets: (params?: Record<string, string | number>) =>
    api.get<{ tickets: any[]; total: number }>('/support/tickets', params),
  getTicketById: (id: string) =>
    api.get<any>(`/support/tickets/${id}`),
  addMessage: (id: string, data: { text: string; attachments?: string[] }) =>
    api.post<any>(`/support/tickets/${id}/messages`, data),
  requestCallback: (data: { contactName: string; phoneNumber: string; preferredTime?: string; topic?: string; notes?: string }) =>
    api.post<any>('/support/callback-requests', data),
};
