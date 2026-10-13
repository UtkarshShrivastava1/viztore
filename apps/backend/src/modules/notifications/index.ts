/**
 * NOTIFICATIONS MODULE — Public Facade
 * ONLY file other modules and app.ts may import from notifications/
 */
import { createNotificationModule } from './notification.module.js';
import type {
  INotificationFacade,
  INotification,
  NotificationUnreadSummary,
  CreateNotificationDto,
} from './notification.types.js';

const defaultModule = createNotificationModule();

export const notificationRouter = defaultModule.router;
export const notificationService = defaultModule.service;
export const notificationRepository = defaultModule.repository;

export const notificationModule: INotificationFacade = {
  create: async (dto: CreateNotificationDto): Promise<INotification> => {
    return notificationService.createNotification(dto);
  },
  getUnreadSummary: async (recipientId: string): Promise<NotificationUnreadSummary> => {
    return notificationService.getUnreadSummary(recipientId);
  },
};

export { createNotificationModule };
export * from './notification.types.js';
export * from './notification.validator.js';
export * from './whatsapp.service.js';
export { NotificationModel } from './notification.model.js';
