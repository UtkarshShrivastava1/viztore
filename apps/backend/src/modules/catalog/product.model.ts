import mongoose, { Document, Model, Schema } from 'mongoose';
import {
  IProduct,
  IProductVariant,
  IProductAttribute,
  ProductCategory,
  ProductSubType,
} from '@repo/shared-types';

// ── Document Interfaces ────────────────────────────────────────────────

export interface IProductDocument extends Omit<IProduct, '_id'>, Document {
  version: number;
}

// ── Sub-Schemas ────────────────────────────────────────────────────────

const productAttributeSchema = new Schema<IProductAttribute>(
  {
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const productVariantSchema = new Schema<IProductVariant>(
  {
    sku: {
      type: String,
      required: [true, 'Variant SKU is required'],
      trim: true,
      uppercase: true,
    },
    size: { type: String, trim: true },
    color: { type: String, trim: true },
    colorHex: { type: String, trim: true },
    price: {
      type: Number,
      required: [true, 'Variant price is required'],
      min: 0,
    },
    mrp: {
      type: Number,
      required: [true, 'Variant MRP is required'],
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

// ── Main Product Schema ────────────────────────────────────────────────

const productSchema = new Schema<IProductDocument>(
  {
    storeId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Store',
      required: [true, 'Store ID is required'],
      index: true,
    },
    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },
    category: {
      type: String,
      enum: Object.values(ProductCategory),
      required: [true, 'Product category is required'],
      index: true,
    },
    subCategory: {
      type: String,
      trim: true,
      index: true,
    },
    subType: {
      type: String,
      enum: Object.values(ProductSubType),
      index: true,
    },
    brand: {
      type: String,
      trim: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    attributes: {
      type: [productAttributeSchema],
      default: [],
    },
    variants: {
      type: [productVariantSchema],
      required: true,
      validate: {
        validator: (v: IProductVariant[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one variant is required',
      },
    },
    basePrice: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    baseMrp: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    version: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// ── Pre-Save Hook: Compute Derived Fields ──────────────────────────────

productSchema.pre('save', function (next) {
  if (this.variants && this.variants.length > 0) {
    // Compute totalStock from active variants
    this.totalStock = this.variants
      .filter((v: IProductVariant) => v.isActive)
      .reduce((sum: number, v: IProductVariant) => sum + (v.stock ?? 0), 0);

    // Base price/mrp from first active variant
    const firstActive = this.variants.find((v: IProductVariant) => v.isActive) ?? this.variants[0];
    if (firstActive) {
      this.basePrice = firstActive.price;
      this.baseMrp = firstActive.mrp;
    }

    // Max discount across all active variants
    this.maxDiscount = this.variants
      .filter((v: IProductVariant) => v.isActive && v.mrp > 0)
      .reduce((max: number, v: IProductVariant) => {
        const discount = Math.round(((v.mrp - v.price) / v.mrp) * 100);
        return discount > max ? discount : max;
      }, 0);
  }
  next();
});

// ── Indexes ────────────────────────────────────────────────────────────

// Compound index for filtered catalog queries (Strict ESR Rule: Equality, Sort, Range)
productSchema.index({ storeId: 1, isActive: 1, createdAt: -1 });
productSchema.index({ isActive: 1, category: 1, storeId: 1 });


// Full-text search index
productSchema.index(
  { name: 'text', description: 'text', tags: 'text', brand: 'text' },
  { weights: { name: 10, brand: 5, tags: 3, description: 1 }, name: 'product_text_search' },
);

// Price range and sort queries
productSchema.index({ isActive: 1, basePrice: 1 });
productSchema.index({ isActive: 1, rating: -1, createdAt: -1 });
productSchema.index({ isActive: 1, maxDiscount: -1 });
productSchema.index({ isActive: 1, isFeatured: 1, rating: -1 });

// Variant-level queries (sizes, colors)
productSchema.index({ 'variants.size': 1 });
productSchema.index({ 'variants.color': 1 });

export const ProductModel: Model<IProductDocument> = mongoose.model<IProductDocument>('Product', productSchema);
