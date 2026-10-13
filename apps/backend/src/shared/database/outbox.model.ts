import mongoose, { Document, Model, Schema } from 'mongoose';

export type OutboxStatus = 'PENDING' | 'PROCESSING' | 'PUBLISHED' | 'FAILED';

export interface IOutboxEvent {
  eventId: string;
  eventType: string;
  schemaVersion: number;
  aggregateType: string;
  aggregateId: string;
  correlationId?: string;
  payload: Record<string, unknown>;
  status: OutboxStatus;
  attempts: number;
  availableAt: Date;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOutboxDocument extends Omit<IOutboxEvent, 'createdAt' | 'updatedAt'>, Document {}

const outboxSchema = new Schema<IOutboxDocument>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true, index: true },
    schemaVersion: { type: Number, required: true, default: 1 },
    aggregateType: { type: String, required: true, index: true },
    aggregateId: { type: String, required: true, index: true },
    correlationId: { type: String, index: true },
    payload: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    attempts: { type: Number, default: 0 },
    availableAt: { type: Date, default: Date.now, index: true },
    lastError: { type: String },
  },
  {
    timestamps: true,
  },
);

outboxSchema.index({ status: 1, availableAt: 1, createdAt: 1 });

export const OutboxModel: Model<IOutboxDocument> =
  (mongoose.models.Outbox as Model<IOutboxDocument>) ||
  mongoose.model<IOutboxDocument>('Outbox', outboxSchema);
