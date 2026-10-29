import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFeedbackDocument extends Document {
  userId?: mongoose.Types.ObjectId;
  experience: number;
  topic: string;
  text?: string;
  nps?: number;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedbackDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: false,
    },
    experience: {
      type: Number,
      required: [true, 'Experience rating is required'],
      min: 1,
      max: 5,
    },
    topic: {
      type: String,
      required: [true, 'Feedback topic is required'],
      trim: true,
      maxlength: 50,
      default: 'overall',
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    nps: {
      type: Number,
      min: 0,
      max: 10,
      default: 10,
    },
  },
  {
    timestamps: true,
  },
);

export const FeedbackModel: Model<IFeedbackDocument> =
  mongoose.models.Feedback || mongoose.model<IFeedbackDocument>('Feedback', feedbackSchema);
