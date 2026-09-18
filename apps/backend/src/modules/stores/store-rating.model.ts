import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStoreRatingDocument extends Document {
  storeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  rating: number; // 1 to 5
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const storeRatingSchema = new Schema<IStoreRatingDocument>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store ID is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID is required'],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: [500, 'Feedback must not exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate ratings for the same order
storeRatingSchema.index({ storeId: 1, orderId: 1 }, { unique: true });

export const StoreRatingModel: Model<IStoreRatingDocument> =
  mongoose.model<IStoreRatingDocument>('StoreRating', storeRatingSchema);
