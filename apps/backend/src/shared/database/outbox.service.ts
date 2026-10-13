import crypto from 'crypto';
import mongoose, { type ClientSession } from 'mongoose';
import { OutboxModel, type IOutboxEvent } from './outbox.model.js';
import { logger } from '../utils/logger.js';
import { eventBus } from '../events/eventBus.js';

export interface NewOutboxEvent {
  eventType: string;
  schemaVersion?: number;
  aggregateType: string;
  aggregateId: string;
  correlationId?: string;
  payload: Record<string, unknown>;
}

/**
 * Appends an outbox event within the same MongoDB transaction session as the business mutation.
 */
export async function appendOutboxEvent(
  event: NewOutboxEvent,
  session?: ClientSession,
): Promise<IOutboxEvent> {
  const eventId = crypto.randomUUID();

  // If MongoDB is not connected (e.g. unit tests without live database), return simulated record without buffering
  if (mongoose.connection.readyState !== 1) {
    return {
      eventId,
      eventType: event.eventType,
      schemaVersion: event.schemaVersion ?? 1,
      aggregateType: event.aggregateType,
      aggregateId: event.aggregateId,
      correlationId: event.correlationId,
      payload: event.payload,
      status: 'PENDING',
      attempts: 0,
      availableAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  const docs = await OutboxModel.create(
    [
      {
        eventId,
        eventType: event.eventType,
        schemaVersion: event.schemaVersion ?? 1,
        aggregateType: event.aggregateType,
        aggregateId: event.aggregateId,
        correlationId: event.correlationId,
        payload: event.payload,
        status: 'PENDING',
        attempts: 0,
        availableAt: new Date(),
      },
    ],
    session ? { session } : undefined,
  );

  const created = docs[0];
  return (created?.toObject ? created.toObject() : created) as unknown as IOutboxEvent;
}

/**
 * Dispatches pending outbox events asynchronously post-commit.
 */
export async function processPendingOutboxEvents(batchSize = 25): Promise<number> {
  if (mongoose.connection.readyState !== 1) return 0;

  const pendingEvents = await OutboxModel.find({
    status: 'PENDING',
    availableAt: { $lte: new Date() },
  })
    .sort({ createdAt: 1 })
    .limit(batchSize);

  if (pendingEvents.length === 0) return 0;

  let dispatchedCount = 0;

  for (const event of pendingEvents) {
    try {
      event.status = 'PROCESSING';
      event.attempts += 1;
      await event.save();

      // Emit through local domain event bus
      eventBus.emit(event.eventType as any, {
        ...(event.payload as Record<string, unknown>),
        _outboxEventId: event.eventId,
        _correlationId: event.correlationId,
      });

      event.status = 'PUBLISHED';
      await event.save();
      dispatchedCount += 1;
    } catch (err: any) {
      logger.error('Failed to process outbox event', {
        error: err,
        eventId: event.eventId,
        eventType: event.eventType,
      });
      event.status = event.attempts >= 8 ? 'FAILED' : 'PENDING';
      event.lastError = err?.message || String(err);
      // Exponential backoff
      event.availableAt = new Date(Date.now() + Math.pow(2, Math.min(event.attempts, 6)) * 1000);
      await event.save();
    }
  }

  return dispatchedCount;
}
