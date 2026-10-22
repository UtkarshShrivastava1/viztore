import mongoose from 'mongoose';
import { UserModel } from '../modules/auth/auth.model.js';
import { StoreModel } from '../modules/stores/store.model.js';
import { ProductModel } from '../modules/catalog/product.model.js';
import { OrderModel } from '../modules/orders/order.model.js';
import { DeliveryModel } from '../modules/delivery/delivery.model.js';
import { NotificationModel } from '../modules/notifications/notification.model.js';
import { env } from '../shared/config/env.config.js';
import { logger } from '../shared/utils/logger.js';
import {
  UserRole,
  StoreCategory,
  StoreApprovalStatus,
} from '@repo/shared-types';
import { OrderStatus } from '../modules/orders/order.types.js';
import {
  MerchantSeedDefinition,
  FASHION_PRODUCTS,
  ELECTRONICS_PRODUCTS,
  GROCERY_ORGANICS_PRODUCTS,
  PHARMACY_WELLNESS_PRODUCTS,
  PROVISIONS_FMCG_PRODUCTS,
  PRODUCE_PRODUCTS,
  PATEL_ELECTRONICS_PRODUCTS,
} from './seed-dataset.js';

const ADMIN_USER = {
  fullName: 'Super Administrator',
  email: 'admin@example.com',
  phone: '9876500000',
  password: 'Password@123',
  role: UserRole.ADMIN,
  isVerified: true,
  isActive: true,
};

const TEST_CUSTOMERS = [
  {
    fullName: 'Arjun Mehta',
    email: 'arjun.customer@example.com',
    phone: '9876543299',
    password: 'Password@123',
    role: UserRole.CUSTOMER,
    isVerified: true,
    isActive: true,
    addresses: [
      {
        label: 'Home',
        recipientName: 'Arjun Mehta',
        phone: '9876543299',
        street: 'Plot 14, Nehru Nagar West',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        pincode: '490020',
        isDefault: true,
        coordinates: [81.3410, 21.2180],
      },
      {
        label: 'Office',
        recipientName: 'Arjun Mehta',
        phone: '9876543299',
        street: 'Shop 4, Civic Centre Commercial Complex, Sector 6',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        pincode: '490006',
        isDefault: false,
        coordinates: [81.3780, 21.1960],
      },
    ],
  },
  {
    fullName: 'Sneha Verma',
    email: 'sneha.customer@example.com',
    phone: '9876543288',
    password: 'Password@123',
    role: UserRole.CUSTOMER,
    isVerified: true,
    isActive: true,
    addresses: [
      {
        label: 'Home',
        recipientName: 'Sneha Verma',
        phone: '9876543288',
        street: 'Flat 202, Surya Vihar, Malviya Nagar',
        city: 'Durg',
        state: 'Chhattisgarh',
        pincode: '491001',
        isDefault: true,
        coordinates: [81.2820, 21.1950],
      },
      {
        label: 'Office',
        recipientName: 'Sneha Verma',
        phone: '9876543288',
        street: 'Ganj Para Commercial Belt, Station Road',
        city: 'Durg',
        state: 'Chhattisgarh',
        pincode: '491001',
        isDefault: false,
        coordinates: [81.2790, 21.1880],
      },
    ],
  },
];

export const SEED_DATA: MerchantSeedDefinition[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. Fashion & Apparel: Urban Vogue Studio (Civic Centre, Bhilai)
  // ──────────────────────────────────────────────────────────────────────────
  {
    user: {
      fullName: 'Rahul Sharma',
      email: 'rahul.merchant@example.com',
      phone: '9876543210',
      password: 'Password@123',
      role: UserRole.MERCHANT,
      isVerified: true,
      isActive: true,
    },
    store: {
      name: 'Urban Vogue Studio',
      slug: 'urban-vogue-studio',
      description: 'Premium curated men and women ethnic & contemporary fashion collection from local artisans.',
      category: StoreCategory.FASHION,
      logoUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop',
      location: {
        type: 'Point',
        coordinates: [81.3780, 21.1960], // Civic Centre, Bhilai
      },
      address: {
        street: 'Shop 18, Commercial Complex, Civic Centre',
        landmark: 'Opposite Kala Mandir, Civic Centre',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        pincode: '490006',
      },
      operatingHours: {
        monday: { open: '10:00', close: '22:00', isOpen: true },
        tuesday: { open: '10:00', close: '22:00', isOpen: true },
        wednesday: { open: '10:00', close: '22:00', isOpen: true },
        thursday: { open: '10:00', close: '22:00', isOpen: true },
        friday: { open: '10:00', close: '22:30', isOpen: true },
        saturday: { open: '10:00', close: '23:00', isOpen: true },
        sunday: { open: '11:00', close: '22:00', isOpen: true },
      },
      deliveryRadiusKm: 4.5,
      approvalStatus: StoreApprovalStatus.APPROVED,
      isActive: true,
      rating: 4.8,
      reviewCount: 42,
      legalDetails: {
        gstin: '22AABCS1429B1ZB',
        pan: 'AABCS1429B',
        legalBusinessName: 'Urban Vogue Studio Retail LLP',
        isGstVerified: true,
      },
      bankDetails: {
        accountNumber: '91820038472910',
        ifscCode: 'HDFC0000240',
        accountHolderName: 'Urban Vogue Studio Retail LLP',
        bankName: 'HDFC Bank Ltd',
        isVerified: true,
      },
    },
    products: FASHION_PRODUCTS,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Electronics: NexGen Gadget Hub (Akash Ganga / Supela, Bhilai)
  // ──────────────────────────────────────────────────────────────────────────
  {
    user: {
      fullName: 'Vikram Joshi',
      email: 'vikram.electronics@example.com',
      phone: '9876543222',
      password: 'Password@123',
      role: UserRole.MERCHANT,
      isVerified: true,
      isActive: true,
    },
    store: {
      name: 'NexGen Gadget Hub',
      slug: 'nexgen-gadget-hub',
      description: 'Your authorized neighborhood consumer electronics, smartphone accessories, audio gear & smart wearables showroom.',
      category: StoreCategory.ELECTRONICS,
      logoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&auto=format&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop',
      location: {
        type: 'Point',
        coordinates: [81.3540, 21.2050], // Akash Ganga / Supela, Bhilai
      },
      address: {
        street: 'Shop 45, G.E. Road, Akash Ganga Market, Supela',
        landmark: 'Near Supela Clock Tower',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        pincode: '490023',
      },
      operatingHours: {
        monday: { open: '09:30', close: '21:30', isOpen: true },
        tuesday: { open: '09:30', close: '21:30', isOpen: true },
        wednesday: { open: '09:30', close: '21:30', isOpen: true },
        thursday: { open: '09:30', close: '21:30', isOpen: true },
        friday: { open: '09:30', close: '22:00', isOpen: true },
        saturday: { open: '09:30', close: '22:00', isOpen: true },
        sunday: { open: '10:30', close: '21:00', isOpen: true },
      },
      deliveryRadiusKm: 5.0,
      approvalStatus: StoreApprovalStatus.APPROVED,
      isActive: true,
      rating: 4.9,
      reviewCount: 68,
      legalDetails: {
        gstin: '22AAECN4892K1Z8',
        pan: 'AAECN4892K',
        legalBusinessName: 'NexGen Gadget Hub Pvt Ltd',
        isGstVerified: true,
      },
      bankDetails: {
        accountNumber: '50200049182741',
        ifscCode: 'ICIC0000035',
        accountHolderName: 'NexGen Gadget Hub Pvt Ltd',
        bankName: 'ICICI Bank Ltd',
        isVerified: true,
      },
    },
    products: ELECTRONICS_PRODUCTS,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Grocery & Organics: GreenValley Organics (Nehru Nagar East, Bhilai)
  // ──────────────────────────────────────────────────────────────────────────
  {
    user: {
      fullName: 'Anita Gupta',
      email: 'anita.organics@example.com',
      phone: '9876543233',
      password: 'Password@123',
      role: UserRole.MERCHANT,
      isVerified: true,
      isActive: true,
    },
    store: {
      name: 'GreenValley Organics',
      slug: 'greenvalley-organics',
      description: 'Pure certified organic farm-fresh staples, stone-ground flours, cold-pressed oils, and artisanal spices.',
      category: StoreCategory.GROCERY_STAPLES,
      logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&auto=format&fit=crop',
      location: {
        type: 'Point',
        coordinates: [81.3460, 21.2150], // Nehru Nagar East, Bhilai
      },
      address: {
        street: 'Plot 12, Commercial Belt, Nehru Nagar East',
        landmark: 'Near Bhilai Hotel Square',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        pincode: '490020',
      },
      operatingHours: {
        monday: { open: '08:00', close: '22:00', isOpen: true },
        tuesday: { open: '08:00', close: '22:00', isOpen: true },
        wednesday: { open: '08:00', close: '22:00', isOpen: true },
        thursday: { open: '08:00', close: '22:00', isOpen: true },
        friday: { open: '08:00', close: '22:00', isOpen: true },
        saturday: { open: '08:00', close: '22:30', isOpen: true },
        sunday: { open: '08:00', close: '22:00', isOpen: true },
      },
      deliveryRadiusKm: 4.0,
      approvalStatus: StoreApprovalStatus.APPROVED,
      isActive: true,
      rating: 4.7,
      reviewCount: 54,
      legalDetails: {
        gstin: '22AABCG3190L1ZU',
        pan: 'AABCG3190L',
        legalBusinessName: 'GreenValley Agro Organics Retail LLP',
        isGstVerified: true,
      },
      bankDetails: {
        accountNumber: '38192004817291',
        ifscCode: 'SBIN0000330',
        accountHolderName: 'GreenValley Agro Organics Retail LLP',
        bankName: 'State Bank of India',
        isVerified: true,
      },
    },
    products: GROCERY_ORGANICS_PRODUCTS,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Pharmacy & Wellness: Aura Medico & Wellness (Malviya Nagar, Durg)
  // ──────────────────────────────────────────────────────────────────────────
  {
    user: {
      fullName: 'Dr. Priya Sen',
      email: 'priya.pharmacy@example.com',
      phone: '9876543244',
      password: 'Password@123',
      role: UserRole.MERCHANT,
      isVerified: true,
      isActive: true,
    },
    store: {
      name: 'Aura Medico & Wellness',
      slug: 'aura-medico-and-wellness',
      description: 'Trusted neighborhood pharmacy providing authentic prescription medicines, wellness supplements, and personal care.',
      category: StoreCategory.BEAUTY_CARE,
      logoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&auto=format&fit=crop',
      location: {
        type: 'Point',
        coordinates: [81.2820, 21.1950], // Station Road / Malviya Nagar, Durg
      },
      address: {
        street: 'Shop 6, Station Road, Malviya Nagar',
        landmark: 'Near Durg Railway Station Gate 1',
        city: 'Durg',
        state: 'Chhattisgarh',
        pincode: '491001',
      },
      operatingHours: {
        monday: { open: '08:00', close: '23:00', isOpen: true },
        tuesday: { open: '08:00', close: '23:00', isOpen: true },
        wednesday: { open: '08:00', close: '23:00', isOpen: true },
        thursday: { open: '08:00', close: '23:00', isOpen: true },
        friday: { open: '08:00', close: '23:00', isOpen: true },
        saturday: { open: '08:00', close: '23:30', isOpen: true },
        sunday: { open: '09:00', close: '23:00', isOpen: true },
      },
      deliveryRadiusKm: 6.0,
      approvalStatus: StoreApprovalStatus.APPROVED,
      isActive: true,
      rating: 4.9,
      reviewCount: 89,
      legalDetails: {
        gstin: '22AAPCA9012J1ZR',
        pan: 'AAPCA9012J',
        legalBusinessName: 'Aura Healthcare & Pharmaceuticals',
        isGstVerified: true,
      },
      bankDetails: {
        accountNumber: '10920038192039',
        ifscCode: 'PUNB0024000',
        accountHolderName: 'Aura Healthcare & Pharmaceuticals',
        bankName: 'Punjab National Bank',
        isVerified: true,
      },
    },
    products: PHARMACY_WELLNESS_PRODUCTS,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 5. Daily FMCG & Provisions: Verma Daily Provisions (Sector 7, Bhilai)
  // ──────────────────────────────────────────────────────────────────────────
  {
    user: {
      fullName: 'Amit Verma',
      email: 'amit.merchant@example.com',
      phone: '9876543212',
      password: 'Password@123',
      role: UserRole.MERCHANT,
      isVerified: true,
      isActive: true,
    },
    store: {
      name: 'Verma Daily Provisions',
      slug: 'verma-daily-provisions',
      description: 'Daily fresh staples, grains, pulses, dairy, and grocery essentials directly sourced from trusted mandis.',
      category: StoreCategory.GROCERY_STAPLES,
      logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&auto=format&fit=crop',
      location: {
        type: 'Point',
        coordinates: [81.3650, 21.1920], // Sector 7, Bhilai
      },
      address: {
        street: 'Shop 14, Main Market, Sector 7',
        landmark: 'Near Central Park, Sector 7, Bhilai',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        pincode: '490006',
      },
      operatingHours: {
        monday: { open: '08:00', close: '22:00', isOpen: true },
        tuesday: { open: '08:00', close: '22:00', isOpen: true },
        wednesday: { open: '08:00', close: '22:00', isOpen: true },
        thursday: { open: '08:00', close: '22:00', isOpen: true },
        friday: { open: '08:00', close: '22:00', isOpen: true },
        saturday: { open: '08:00', close: '22:30', isOpen: true },
        sunday: { open: '08:00', close: '22:00', isOpen: true },
      },
      deliveryRadiusKm: 4.0,
      approvalStatus: StoreApprovalStatus.APPROVED,
      isActive: true,
      rating: 4.8,
      reviewCount: 46,
      legalDetails: {
        gstin: '22AABCV5512N1Z4',
        pan: 'AABCV5512N',
        legalBusinessName: 'Verma Daily Provisions Mart',
        isGstVerified: true,
      },
      bankDetails: {
        accountNumber: '91802004819231',
        ifscCode: 'SBIN0000330',
        accountHolderName: 'Verma Daily Provisions Mart',
        bankName: 'State Bank of India',
        isVerified: true,
      },
    },
    products: PROVISIONS_FMCG_PRODUCTS,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 6. Fresh Produce: Karan Fresh Mart (Ganj Para, Durg)
  // ──────────────────────────────────────────────────────────────────────────
  {
    user: {
      fullName: 'Karan Malhotra',
      email: 'karan.retail@example.com',
      phone: '9876543255',
      password: 'Password@123',
      role: UserRole.MERCHANT,
      isVerified: true,
      isActive: true,
    },
    store: {
      name: 'Karan Fresh Mart',
      slug: 'karan-fresh-mart',
      description: 'Neighborhood daily farm-fresh fruits, crisp vegetables, and dairy with express doorstep fulfillment.',
      category: StoreCategory.GROCERY_STAPLES,
      logoUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=300&auto=format&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&auto=format&fit=crop',
      location: {
        type: 'Point',
        coordinates: [81.2790, 21.1880], // Ganj Para, Durg
      },
      address: {
        street: 'Shop 8, Ganj Para Main Market',
        landmark: 'Near Indira Market, Durg',
        city: 'Durg',
        state: 'Chhattisgarh',
        pincode: '491001',
      },
      operatingHours: {
        monday: { open: '07:00', close: '22:00', isOpen: true },
        tuesday: { open: '07:00', close: '22:00', isOpen: true },
        wednesday: { open: '07:00', close: '22:00', isOpen: true },
        thursday: { open: '07:00', close: '22:00', isOpen: true },
        friday: { open: '07:00', close: '22:00', isOpen: true },
        saturday: { open: '07:00', close: '22:30', isOpen: true },
        sunday: { open: '07:00', close: '22:00', isOpen: true },
      },
      deliveryRadiusKm: 3.5,
      approvalStatus: StoreApprovalStatus.APPROVED,
      isActive: true,
      rating: 4.6,
      reviewCount: 31,
      legalDetails: {
        gstin: '22AABCK9901M1Z5',
        pan: 'AABCK9901M',
        legalBusinessName: 'Karan Fresh Mart Retail LLP',
        isGstVerified: true,
      },
      bankDetails: {
        accountNumber: '92102003817265',
        ifscCode: 'UTIB0000138',
        accountHolderName: 'Karan Fresh Mart Retail LLP',
        bankName: 'Axis Bank Ltd',
        isVerified: true,
      },
    },
    products: PRODUCE_PRODUCTS,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 7. Gadgets & Audio: Patel Electronics (Dakshin Gangotri, Supela)
  // ──────────────────────────────────────────────────────────────────────────
  {
    user: {
      fullName: 'Priya Patel',
      email: 'priya.merchant@example.com',
      phone: '9876543211',
      password: 'Password@123',
      role: UserRole.MERCHANT,
      isVerified: true,
      isActive: true,
    },
    store: {
      name: 'Patel Electronics & Smart Gadgets',
      slug: 'patel-electronics-and-smart-gadgets',
      description: 'Authorized smart accessories, power banks, chargers, wireless audio, and device accessories in Supela.',
      category: StoreCategory.ELECTRONICS,
      logoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&auto=format&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop',
      location: {
        type: 'Point',
        coordinates: [81.3590, 21.2020], // Supela, Bhilai
      },
      address: {
        street: 'Shop 22, Dakshin Gangotri Commercial Complex',
        landmark: 'Near Supela Clock Tower, Bhilai',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        pincode: '490023',
      },
      operatingHours: {
        monday: { open: '10:00', close: '21:30', isOpen: true },
        tuesday: { open: '10:00', close: '21:30', isOpen: true },
        wednesday: { open: '10:00', close: '21:30', isOpen: true },
        thursday: { open: '10:00', close: '21:30', isOpen: true },
        friday: { open: '10:00', close: '21:30', isOpen: true },
        saturday: { open: '10:00', close: '22:00', isOpen: true },
        sunday: { open: '11:00', close: '20:00', isOpen: true },
      },
      deliveryRadiusKm: 4.5,
      approvalStatus: StoreApprovalStatus.APPROVED,
      isActive: true,
      rating: 4.9,
      reviewCount: 38,
      legalDetails: {
        gstin: '22AAACP1029K1ZX',
        pan: 'AAACP1029K',
        legalBusinessName: 'Patel Electronics Retail LLP',
        isGstVerified: true,
      },
      bankDetails: {
        accountNumber: '92102008471921',
        ifscCode: 'ICIC0000102',
        accountHolderName: 'Patel Electronics Retail LLP',
        bankName: 'ICICI Bank Ltd',
        isVerified: true,
      },
    },
    products: PATEL_ELECTRONICS_PRODUCTS,
  },
];

/**
 * Master Seed Database Function
 */
export async function seedMerchantsAndData(): Promise<void> {
  logger.info('═══════════════════════════════════════════════════════════════');
  logger.info('🚀 COMMENCING MASTER DATABASE SEEDING ROUTINE');
  logger.info('═══════════════════════════════════════════════════════════════');

  if (mongoose.connection.readyState !== 1) {
    logger.info(`🔌 Connecting to MongoDB: ${env.MONGODB_URI.split('@')[1] || 'localhost'}...`);
    await mongoose.connect(env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB.');
  }

  // 1. PURGE EXISTING COLLECTIONS SAFELY
  logger.info('🧹 Purging prior collections for clean seed baseline...');
  await UserModel.deleteMany({});
  await StoreModel.deleteMany({});
  await ProductModel.deleteMany({});
  await OrderModel.deleteMany({});
  await DeliveryModel.deleteMany({});
  await NotificationModel.deleteMany({});
  logger.info('✨ All database collections successfully purged.');

  // 2. SEED ADMIN USER
  const admin = await UserModel.create(ADMIN_USER);
  logger.info(`👑 Created Super Admin: ${admin.email} (Password@123)`);

  // 3. SEED TEST CUSTOMERS
  const seededCustomers: any[] = [];
  for (const custData of TEST_CUSTOMERS) {
    const customer = await UserModel.create(custData);
    seededCustomers.push(customer);
    logger.info(`👤 Created Test Customer: ${customer.fullName} (${customer.email})`);
  }

  const primaryCustomer = seededCustomers[0]; // Arjun Mehta
  const secondaryCustomer = seededCustomers[1]; // Sneha Verma

  // 4. SEED MERCHANTS, STORES & PRODUCTS
  const seededApprovedStores: any[] = [];
  const seededAllProducts: any[] = [];

  for (const item of SEED_DATA) {
    // Create Merchant User
    const merchantUser = await UserModel.create(item.user);
    logger.info(`🏪 Created Merchant User: ${item.user.fullName} (${item.user.email})`);

    // Create Store
    const store = await StoreModel.create({
      ...item.store,
      ownerId: merchantUser._id,
    });
    logger.info(`   📍 Created Store: "${store.name}" [${store.category}] - Approval: ${store.approvalStatus}`);

    if (store.approvalStatus === StoreApprovalStatus.APPROVED) {
      seededApprovedStores.push(store);
    }

    // Create Products for Approved Stores
    if (item.products && item.products.length > 0) {
      for (const prodData of item.products) {
        const product = new ProductModel({
          ...prodData,
          storeId: store._id,
          storeName: store.name,
        });
        await product.save();
        seededAllProducts.push(product);
      }
      logger.info(`   📦 Seeded ${item.products.length} products for store "${store.name}"`);
    }
  }

  logger.info(`✨ Successfully seeded ${seededAllProducts.length} total products across ${seededApprovedStores.length} stores.`);

  // 5. SEED REALISTIC LIFECYCLE ORDERS
  logger.info('🛒 Generating active lifecycle orders across store pipelines...');

  const fashionStore = seededApprovedStores.find((s) => s.category === StoreCategory.FASHION);
  const electronicsStore = seededApprovedStores.find((s) => s.category === StoreCategory.ELECTRONICS);
  const groceryStore = seededApprovedStores.find((s) => s.category === StoreCategory.GROCERY_STAPLES);

  const fashionProducts = seededAllProducts.filter((p) => p.storeId.toString() === fashionStore?._id.toString());
  const electronicsProducts = seededAllProducts.filter((p) => p.storeId.toString() === electronicsStore?._id.toString());
  const groceryProducts = seededAllProducts.filter((p) => p.storeId.toString() === groceryStore?._id.toString());

  const sampleOrders: any[] = [];

  // Order 1: New / Pending (Fashion Store)
  if (fashionStore && fashionProducts.length >= 2) {
    const p1 = fashionProducts[0];
    const p2 = fashionProducts[1];
    const v1 = p1.variants[0];
    const v2 = p2.variants[0];
    const subtotal = v1.price * 1 + v2.price * 1;
    const tax = Math.round(subtotal * 0.05);

    sampleOrders.push({
      userId: primaryCustomer._id.toString(),
      storeId: fashionStore._id.toString(),
      orderNumber: '#ORD-10321',
      items: [
        {
          productId: p1._id.toString(),
          sku: v1.sku,
          name: p1.name,
          quantity: 1,
          unitPrice: v1.price,
          storeId: fashionStore._id.toString(),
        },
        {
          productId: p2._id.toString(),
          sku: v2.sku,
          name: p2.name,
          quantity: 1,
          unitPrice: v2.price,
          storeId: fashionStore._id.toString(),
        },
      ],
      shippingAddress: {
        fullName: primaryCustomer.fullName,
        street: 'Plot 14, Nehru Nagar West',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        postalCode: '490020',
        country: 'IN',
        phone: primaryCustomer.phone,
      },
      subtotal,
      tax,
      shippingFee: 0,
      grandTotal: subtotal + tax,
      status: OrderStatus.PENDING,
      deliveryOtp: '4821',
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
    });
  }

  // Order 2: Confirmed / Accepted (Fashion Store)
  if (fashionStore && fashionProducts.length >= 1) {
    const p = fashionProducts[2] || fashionProducts[0];
    const v = p.variants[0];
    const subtotal = v.price * 2;
    const tax = Math.round(subtotal * 0.05);

    sampleOrders.push({
      userId: primaryCustomer._id.toString(),
      storeId: fashionStore._id.toString(),
      orderNumber: '#ORD-10322',
      items: [
        {
          productId: p._id.toString(),
          sku: v.sku,
          name: p.name,
          quantity: 2,
          unitPrice: v.price,
          storeId: fashionStore._id.toString(),
        },
      ],
      shippingAddress: {
        fullName: primaryCustomer.fullName,
        street: 'Shop 4, Civic Centre Commercial Complex, Sector 6',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        postalCode: '490006',
        country: 'IN',
        phone: primaryCustomer.phone,
      },
      subtotal,
      tax,
      shippingFee: 49,
      grandTotal: subtotal + tax + 49,
      status: OrderStatus.PACKED,
      deliveryOtp: '7192',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000), // 2 hours ago
    });
  }

  // Order 3: Ready to Ship / Packed (Electronics Store)
  if (electronicsStore && electronicsProducts.length >= 2) {
    const p = electronicsProducts[0];
    const v = p.variants[0];
    const subtotal = v.price * 1;
    const tax = Math.round(subtotal * 0.18);

    sampleOrders.push({
      userId: secondaryCustomer._id.toString(),
      storeId: electronicsStore._id.toString(),
      orderNumber: '#ORD-10323',
      items: [
        {
          productId: p._id.toString(),
          sku: v.sku,
          name: p.name,
          quantity: 1,
          unitPrice: v.price,
          storeId: electronicsStore._id.toString(),
        },
      ],
      shippingAddress: {
        fullName: secondaryCustomer.fullName,
        street: 'Flat 202, Surya Vihar, Malviya Nagar',
        city: 'Durg',
        state: 'Chhattisgarh',
        postalCode: '491001',
        country: 'IN',
        phone: secondaryCustomer.phone,
      },
      subtotal,
      tax,
      shippingFee: 0,
      grandTotal: subtotal + tax,
      status: OrderStatus.PACKED,
      deliveryOtp: '3941',
      createdAt: new Date(Date.now() - 4 * 3600 * 1000),
    });
  }

  // Order 4: Shipped / Out for Delivery (Grocery Store)
  if (groceryStore && groceryProducts.length >= 2) {
    const p1 = groceryProducts[0];
    const p2 = groceryProducts[1];
    const v1 = p1.variants[0];
    const v2 = p2.variants[0];
    const subtotal = v1.price * 2 + v2.price * 1;
    const tax = Math.round(subtotal * 0.05);

    sampleOrders.push({
      userId: primaryCustomer._id.toString(),
      storeId: groceryStore._id.toString(),
      orderNumber: '#ORD-10324',
      items: [
        {
          productId: p1._id.toString(),
          sku: v1.sku,
          name: p1.name,
          quantity: 2,
          unitPrice: v1.price,
          storeId: groceryStore._id.toString(),
        },
        {
          productId: p2._id.toString(),
          sku: v2.sku,
          name: p2.name,
          quantity: 1,
          unitPrice: v2.price,
          storeId: groceryStore._id.toString(),
        },
      ],
      shippingAddress: {
        fullName: primaryCustomer.fullName,
        street: 'Plot 14, Nehru Nagar West',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        postalCode: '490020',
        country: 'IN',
        phone: primaryCustomer.phone,
      },
      subtotal,
      tax,
      shippingFee: 0,
      grandTotal: subtotal + tax,
      status: OrderStatus.OUT_FOR_DELIVERY,
      deliveryOtp: '8910',
      createdAt: new Date(Date.now() - 12 * 3600 * 1000),
    });
  }

  // Order 5: Completed / Delivered (Fashion Store)
  if (fashionStore && fashionProducts.length >= 1) {
    const p = fashionProducts[0];
    const v = p.variants[0];
    const subtotal = v.price * 1;
    const tax = Math.round(subtotal * 0.05);

    sampleOrders.push({
      userId: primaryCustomer._id.toString(),
      storeId: fashionStore._id.toString(),
      orderNumber: '#ORD-10325',
      items: [
        {
          productId: p._id.toString(),
          sku: v.sku,
          name: p.name,
          quantity: 1,
          unitPrice: v.price,
          storeId: fashionStore._id.toString(),
        },
      ],
      shippingAddress: {
        fullName: primaryCustomer.fullName,
        street: 'Plot 14, Nehru Nagar West',
        city: 'Bhilai',
        state: 'Chhattisgarh',
        postalCode: '490020',
        country: 'IN',
        phone: primaryCustomer.phone,
      },
      subtotal,
      tax,
      shippingFee: 0,
      grandTotal: subtotal + tax,
      status: OrderStatus.DELIVERED,
      deliveryOtp: '5120',
      deliveredAt: new Date(Date.now() - 24 * 3600 * 1000),
      createdAt: new Date(Date.now() - 26 * 3600 * 1000),
    });
  }

  const createdOrders = await OrderModel.insertMany(sampleOrders);
  logger.info(`✅ Created ${createdOrders.length} realistic lifecycle orders across stores.`);

  // 6. SEED NOTIFICATIONS FOR MERCHANTS
  for (const store of seededApprovedStores) {
    await NotificationModel.create({
      recipientId: store.ownerId.toString(),
      recipientRole: 'merchant',
      category: 'order',
      title: 'New Online Order Received',
      message: `You have received a new online order for store ${store.name}.`,
      data: { storeId: store._id.toString() },
      isRead: false,
    });
  }
  logger.info(`🔔 Seeded merchant notifications for ${seededApprovedStores.length} stores.`);

  logger.info('═══════════════════════════════════════════════════════════════');
  logger.info('🎉 MASTER DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  logger.info('═══════════════════════════════════════════════════════════════');
  logger.info('🔑 Super Admin:        admin@example.com          / Password@123');
  logger.info('🛍️ Customer 1:         arjun.customer@example.com / Password@123');
  logger.info('🛍️ Customer 2:         sneha.customer@example.com / Password@123');
  logger.info('👔 Merchant (Fashion): rahul.merchant@example.com / Password@123');
  logger.info('📱 Merchant (Gadgets): vikram.electronics@example.com / Password@123');
  logger.info('🌾 Merchant (Grocery): anita.organics@example.com / Password@123');
  logger.info('💊 Merchant (Pharma):  priya.pharmacy@example.com / Password@123');
  logger.info('🛒 Merchant (FMCG):    amit.merchant@example.com  / Password@123');
  logger.info('🍏 Merchant (Produce): karan.retail@example.com   / Password@123');
  logger.info('═══════════════════════════════════════════════════════════════');
}

// Direct execution guard
if (process.argv[1]?.endsWith('seed-merchants.ts') || process.argv[1]?.endsWith('seed-merchants.js')) {
  seedMerchantsAndData()
    .then(async () => {
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch(async (err) => {
      logger.error('❌ Seed execution failed:', err);
      await mongoose.disconnect();
      process.exit(1);
    });
}
