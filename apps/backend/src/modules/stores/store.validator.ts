import { z } from 'zod';
import { StoreCategory } from './store.types.js';

export const createStoreSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  category: z.nativeEnum(StoreCategory),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Invalid store email'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().default('IN'),
  }),
  location: z.object({
    type: z.literal('Point').default('Point'),
    coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
  }),
  operatingHours: z.array(
    z.object({
      day: z.number().min(0).max(6),
      open: z.string(),
      close: z.string(),
      isClosed: z.boolean().default(false),
    }),
  ).optional(),
  customTaxonomy: z
    .object({
      categories: z.array(z.string()).optional(),
      subCategories: z.record(z.array(z.string())).optional(),
      productTypes: z.record(z.array(z.string())).optional(),
      brands: z.array(z.string()).optional(),
    })
    .optional(),
});

export const updateStoreSchema = createStoreSchema.partial();

export const nearbyStoresQuerySchema = z.object({
  lng: z.coerce.number().min(-180).max(180),
  lat: z.coerce.number().min(-90).max(90),
  radiusKm: z.coerce.number().positive().max(50).default(4),
  category: z.nativeEnum(StoreCategory).optional(),
  search: z.string().optional(),
  limit: z.coerce.number().positive().max(100).default(20),
});
