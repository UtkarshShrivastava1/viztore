import mongoose, { Document, Model, Schema } from 'mongoose';
import { ITaxonomyNode, ITaxonomyAttributeDefinition } from '@repo/shared-types';

export interface ITaxonomyDocument extends Omit<ITaxonomyNode, '_id'>, Document {}

const taxonomyAttributeSchema = new Schema<ITaxonomyAttributeDefinition>(
  {
    name: { type: String, required: true, trim: true },
    values: { type: [String], default: [] },
    isMultiSelect: { type: Boolean, default: false },
    isRequired: { type: Boolean, default: false },
  },
  { _id: false },
);

const taxonomySchema = new Schema<ITaxonomyDocument>(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    subcategory: {
      type: String,
      required: [true, 'Subcategory is required'],
      trim: true,
      index: true,
    },
    productType: {
      type: String,
      required: [true, 'Product Type is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    hsnCode: {
      type: String,
      trim: true,
      default: '',
    },
    gstRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 18,
    },
    attributes: {
      type: [taxonomyAttributeSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'catalog_taxonomies',
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Compound unique index per hierarchy node
taxonomySchema.index(
  { category: 1, subcategory: 1, productType: 1 },
  { unique: true, name: 'taxonomy_hierarchy_unique' },
);

// Full-text search index for instant product type search in wizard
taxonomySchema.index(
  { productType: 'text', subcategory: 'text', category: 'text' },
  { weights: { productType: 10, subcategory: 5, category: 2 }, name: 'taxonomy_text_search' },
);

export const TaxonomyModel: Model<ITaxonomyDocument> = mongoose.model<ITaxonomyDocument>(
  'Taxonomy',
  taxonomySchema,
);
