import { StoreCategory, StoreApprovalStatus, type IStore, branding } from "@repo/shared-types";

const DUMMY_JSON_URL = "https://dummyjson.com";

interface DummyProduct {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  rating: number;
}

interface DummyProductsResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

const DEFAULT_FEATURED_STORES: IStore[] = [
  {
    _id: "store-fashion-hub",
    ownerId: "owner-fashion-hub",
    slug: "fashion-hub",
    name: "Fashion Hub",
    description: "Clothing, Accessories, Footwear & more",
    category: StoreCategory.FASHION,
    bannerUrl: "/stores/store_fashion_hub.png",
    logoUrl: "/stores/store_fashion_hub.png",
    rating: 4.5,
    reviewCount: 1200,
    location: {
      type: "Point",
      coordinates: [77.209, 28.6139],
    },
    address: {
      street: "Sector - 2, Market Complex",
      city: "Bhilai",
      state: "Chhattisgarh",
      pincode: "490001",
    },
    deliveryRadiusKm: 5,
    distanceKm: 1.2,
    isActive: true,
    approvalStatus: StoreApprovalStatus.APPROVED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "store-sharma-electronics",
    ownerId: "owner-sharma-electronics",
    slug: "sharma-electronics",
    name: "Sharma Electronics",
    description: "Mobiles, Accessories, Gadgets & more",
    category: StoreCategory.ELECTRONICS,
    bannerUrl: "/stores/store_sharma_electronics.png",
    logoUrl: "/stores/store_sharma_electronics.png",
    rating: 4.3,
    reviewCount: 890,
    location: {
      type: "Point",
      coordinates: [77.21, 28.6145],
    },
    address: {
      street: "Main Commercial Road, Sector - 4",
      city: "Bhilai",
      state: "Chhattisgarh",
      pincode: "490001",
    },
    deliveryRadiusKm: 5,
    distanceKm: 2.1,
    isActive: true,
    approvalStatus: StoreApprovalStatus.APPROVED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function fetchNearbyStores(
  lng: number,
  lat: number,
  radiusKm = 4,
  category?: StoreCategory,
): Promise<IStore[]> {
  try {
    const response = await fetch(`${DUMMY_JSON_URL}/products/category/mens-shirts?limit=20`);

    if (!response.ok) {
      return filterStores(DEFAULT_FEATURED_STORES, category);
    }

    const data: DummyProductsResponse = await response.json();
    let products = data.products || [];

    if (category) {
      products = products.filter(
        (product) =>
          product.category.toLowerCase() === String(category).toLowerCase(),
      );
    }

    const dynamicStores: IStore[] = products.slice(0, 8).map((product, index) => {
      const storeId = `dummy-store-${product.id}`;

      return {
        _id: storeId,
        ownerId: `dummy-owner-${product.id}`,
        slug: `store-${product.id}-${product.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")}`,
        name: `${product.title} Store`,
        description: `Local ${product.category} store available on ${branding.appName}.`,
        bannerUrl: product.thumbnail,
        logoUrl: product.thumbnail,
        category: (product.category as StoreCategory) || StoreCategory.OTHER,
        rating: Number(product.rating.toFixed(1)),
        reviewCount: Math.floor(product.rating * 100),
        location: {
          type: "Point",
          coordinates: [lng + index * 0.001, lat + index * 0.001],
        },
        address: {
          street: "High Street",
          city: "Bhilai",
          state: "Chhattisgarh",
          pincode: "490001",
        },
        deliveryRadiusKm: radiusKm,
        distanceKm: Number((0.5 + index * 0.4).toFixed(1)),
        isActive: true,
        approvalStatus: StoreApprovalStatus.APPROVED,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    const combined = [
      ...filterStores(DEFAULT_FEATURED_STORES, category),
      ...dynamicStores,
    ];

    return combined;
  } catch (err) {
    return filterStores(DEFAULT_FEATURED_STORES, category);
  }
}

export async function fetchStoreBySlug(slug: string): Promise<IStore> {
  const stores = await fetchNearbyStores(77.209, 28.6139, 10);
  const found = stores.find((s) => s.slug === slug || s._id === slug);
  if (found) return found;
  return DEFAULT_FEATURED_STORES[0];
}

export async function fetchStoreById(id: string): Promise<IStore> {
  const stores = await fetchNearbyStores(77.209, 28.6139, 10);
  const found = stores.find((s) => s._id === id || s.slug === id);
  if (found) return found;
  return DEFAULT_FEATURED_STORES[0];
}

export async function fetchAllStores(params?: {
  page?: number;
  limit?: number;
  category?: StoreCategory;
  search?: string;
  city?: string;
}): Promise<{
  stores: IStore[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> {
  const stores = await fetchNearbyStores(77.209, 28.6139, 10, params?.category);
  return {
    stores,
    meta: {
      page: 1,
      limit: stores.length,
      total: stores.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };
}

function filterStores(stores: IStore[], category?: StoreCategory) {
  if (!category) return stores;
  return stores.filter((s) => s.category === category);
}
