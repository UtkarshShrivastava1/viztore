import mongoose, { Document, Model, Schema } from 'mongoose';
import { ISupportTicket, ISupportMessage, ISupportAttachment } from '@repo/shared-types';

export interface ISupportTicketDocument extends Omit<ISupportTicket, '_id' | 'id'>, Document {}

const attachmentSchema = new Schema<ISupportAttachment>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    fileType: { type: String },
    sizeBytes: { type: Number },
  },
  { _id: false },
);

const messageSchema = new Schema<ISupportMessage>(
  {
    id: { type: String, required: true },
    senderType: {
      type: String,
      enum: ['merchant', 'customer', 'support'],
      required: true,
      default: 'merchant',
    },
    senderId: { type: String },
    senderName: { type: String, required: true },
    text: { type: String, required: true, maxlength: 3000 },
    attachments: [attachmentSchema],
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const supportTicketSchema = new Schema<ISupportTicketDocument>(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    initiatorType: {
      type: String,
      enum: ['Merchant', 'Customer'],
      required: true,
      default: 'Merchant',
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      required: true,
      default: 'open',
      index: true,
    },
    orderRef: {
      type: String,
      trim: true,
    },
    messages: [messageSchema],
    attachments: [attachmentSchema],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const SupportTicketModel: Model<ISupportTicketDocument> =
  mongoose.models.SupportTicket || mongoose.model<ISupportTicketDocument>('SupportTicket', supportTicketSchema);

// Callback Request Model
export interface ICallbackRequestDocument extends Document {
  name: string;
  phone: string;
  topic: string;
  preferredTime: string;
  notes?: string;
  status: 'pending' | 'called' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const callbackRequestSchema = new Schema<ICallbackRequestDocument>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true },
    preferredTime: { type: String, default: 'Anytime' },
    notes: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'called', 'closed'], default: 'pending', index: true },
  },
  { timestamps: true },
);

export const CallbackRequestModel: Model<ICallbackRequestDocument> =
  mongoose.models.CallbackRequest || mongoose.model<ICallbackRequestDocument>('CallbackRequest', callbackRequestSchema);

