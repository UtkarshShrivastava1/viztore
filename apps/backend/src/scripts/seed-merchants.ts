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
  ProductCategory,
  ProductSubType,
} from '@repo/shared-types';
import { OrderStatus } from '../modules/orders/order.types.js';

interface MerchantSeedDefinition {
  user: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    isVerified: boolean;
    isActive: boolean;
  };
  store: {
    name: string;
    slug: string;
    description: string;
    category: StoreCategory;
    logoUrl: string;
    bannerUrl: string;
    location: {
      type: 'Point';
      coordinates: [number, number]; // [lng, lat]
    };
    address: {
      street: string;
      landmark: string;
      city: string;
      state: string;
      pincode: string;
    };
    operatingHours: any;
    deliveryRadiusKm: number;
    approvalStatus: StoreApprovalStatus;
    isActive: boolean;
    rating: number;
    reviewCount: number;
    legalDetails: {
      gstin: string;
      pan: string;
      legalBusinessName: string;
      isGstVerified: boolean;
    };
    bankDetails: {
      accountNumber: string;
      ifscCode: string;
      accountHolderName: string;
      bankName: string;
      isVerified: boolean;
    };
  };
  products?: Array<{
    name: string;
    slug: string;
    description: string;
    category: ProductCategory;
    subCategory: string;
    subType: ProductSubType;
    brand: string;
    tags: string[];
    isFeatured: boolean;
    variants: Array<{
      sku: string;
      size?: string;
      color?: string;
      colorHex?: string;
      price: number;
      mrp: number;
      stock: number;
      images: string[];
      isActive: boolean;
    }>;
  }>;
}

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

const SEED_DATA: MerchantSeedDefinition[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. Fashion Merchant (Approved - Civic Centre, Bhilai)
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
    products: [
      {
        name: 'Slim Fit Handloom Linen Shirt',
        slug: 'slim-fit-handloom-linen-shirt',
        description: 'Breathable, 100% natural organic handloom linen shirt with mandarin collar. Perfect for formal or semi-casual wear.',
        category: ProductCategory.MEN,
        subCategory: 'Shirts',
        subType: ProductSubType.FORMAL,
        brand: 'Urban Vogue',
        tags: ['linen', 'handloom', 'summer', 'formal', 'men'],
        isFeatured: true,
        variants: [
          {
            sku: 'UVS-SH-WHT-M',
            size: 'M',
            color: 'Crisp White',
            colorHex: '#ffffff',
            price: 1499,
            mrp: 2499,
            stock: 25,
            images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop'],
            isActive: true,
          },
          {
            sku: 'UVS-SH-BLU-L',
            size: 'L',
            color: 'Powder Blue',
            colorHex: '#93c5fd',
            price: 1599,
            mrp: 2699,
            stock: 20,
            images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Embroidered Chanderi Silk Kurta',
        slug: 'embroidered-chanderi-silk-kurta',
        description: 'Artisanal hand-embroidered Chanderi silk kurta with zari detailing. Features lightweight inner cotton lining.',
        category: ProductCategory.WOMEN,
        subCategory: 'Ethnic Wear',
        subType: ProductSubType.ETHNIC,
        brand: 'Vogue Heritage',
        tags: ['silk', 'ethnic', 'festive', 'women', 'kurta'],
        isFeatured: true,
        variants: [
          {
            sku: 'UVS-KRT-MRN-S',
            size: 'S',
            color: 'Deep Maroon',
            colorHex: '#800000',
            price: 2899,
            mrp: 4500,
            stock: 12,
            images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop'],
            isActive: true,
          },
          {
            sku: 'UVS-KRT-MRN-M',
            size: 'M',
            color: 'Deep Maroon',
            colorHex: '#800000',
            price: 2899,
            mrp: 4500,
            stock: 18,
            images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Comfort-Stretch Relaxed Fit Chinos',
        slug: 'comfort-stretch-relaxed-fit-chinos',
        description: 'Premium stretch twill cotton chinos designed for all-day comfort with deep welt pockets and tailored hem.',
        category: ProductCategory.MEN,
        subCategory: 'Trousers',
        subType: ProductSubType.CASUAL,
        brand: 'Urban Vogue',
        tags: ['chinos', 'cotton', 'casual', 'trousers'],
        isFeatured: false,
        variants: [
          {
            sku: 'UVS-CHN-OLV-32',
            size: '32',
            color: 'Olive Green',
            colorHex: '#556b2f',
            price: 1899,
            mrp: 2999,
            stock: 22,
            images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop'],
            isActive: true,
          },
          {
            sku: 'UVS-CHN-KHK-34',
            size: '34',
            color: 'Khaki Beige',
            colorHex: '#f0e68c',
            price: 1899,
            mrp: 2999,
            stock: 16,
            images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Floral Pure Cotton Midi Summer Dress',
        slug: 'floral-pure-cotton-midi-summer-dress',
        description: 'A-line breezy midi dress with hand block printed floral motifs, sweetheart neckline, and side pockets.',
        category: ProductCategory.WOMEN,
        subCategory: 'Dresses',
        subType: ProductSubType.CASUAL,
        brand: 'Vogue Heritage',
        tags: ['dress', 'cotton', 'summer', 'floral', 'women'],
        isFeatured: true,
        variants: [
          {
            sku: 'UVS-DRS-FLR-M',
            size: 'M',
            color: 'Blush Pink',
            colorHex: '#ffb6c1',
            price: 2199,
            mrp: 3299,
            stock: 14,
            images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Handwoven Tussar Silk Saree with Zari',
        slug: 'handwoven-tussar-silk-saree-with-zari',
        description: 'Authentic Vidarbha Tussar silk saree with rich antique gold zari border and matching unstitched blouse piece.',
        category: ProductCategory.WOMEN,
        subCategory: 'Sarees',
        subType: ProductSubType.ETHNIC,
        brand: 'Vogue Heritage',
        tags: ['saree', 'silk', 'tussar', 'festive', 'traditional'],
        isFeatured: true,
        variants: [
          {
            sku: 'UVS-SAR-GLD-FREE',
            size: 'Free Size',
            color: 'Emerald Gold',
            colorHex: '#d4af37',
            price: 4999,
            mrp: 7500,
            stock: 8,
            images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Classic Vintage Washed Denim Trucker Jacket',
        slug: 'classic-vintage-washed-denim-trucker-jacket',
        description: 'Heavyweight 13.5 oz denim jacket with metal shank buttons, chest flap pockets, and tailored modern fit.',
        category: ProductCategory.MEN,
        subCategory: 'Jackets',
        subType: ProductSubType.CASUAL,
        brand: 'Urban Vogue',
        tags: ['denim', 'jacket', 'winter', 'men', 'casual'],
        isFeatured: false,
        variants: [
          {
            sku: 'UVS-JKT-DNM-L',
            size: 'L',
            color: 'Washed Indigo',
            colorHex: '#3b82f6',
            price: 2799,
            mrp: 4299,
            stock: 19,
            images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Electronics Merchant (Approved - Supela, Bhilai)
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
        sunday: { open: '10:00', close: '21:00', isOpen: true },
      },
      deliveryRadiusKm: 5.0,
      approvalStatus: StoreApprovalStatus.APPROVED,
      isActive: true,
      rating: 4.9,
      reviewCount: 88,
      legalDetails: {
        gstin: '22AAACP9832K1ZR',
        pan: 'AAACP9832K',
        legalBusinessName: 'NexGen Digital Electronics Pvt Ltd',
        isGstVerified: true,
      },
      bankDetails: {
        accountNumber: '50200049281726',
        ifscCode: 'ICIC0000045',
        accountHolderName: 'NexGen Digital Electronics Pvt Ltd',
        bankName: 'ICICI Bank',
        isVerified: true,
      },
    },
    products: [
      {
        name: 'Pro ANC Wireless Earbuds (Spatial Audio)',
        slug: 'pro-anc-wireless-earbuds-spatial-audio',
        description: 'Active Noise Cancellation up to 42dB, low-latency gaming mode, 36h total battery with Qi wireless charging case.',
        category: ProductCategory.ELECTRONICS,
        subCategory: 'Audio',
        subType: ProductSubType.OTHER,
        brand: 'SoundPulse',
        tags: ['earbuds', 'audio', 'bluetooth', 'anc', 'wireless'],
        isFeatured: true,
        variants: [
          {
            sku: 'NXG-TWS-BLK',
            size: 'Standard',
            color: 'Matte Graphite',
            colorHex: '#1f2937',
            price: 2999,
            mrp: 4999,
            stock: 35,
            images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop'],
            isActive: true,
          },
          {
            sku: 'NXG-TWS-WHT',
            size: 'Standard',
            color: 'Ceramic White',
            colorHex: '#f9fafb',
            price: 2999,
            mrp: 4999,
            stock: 25,
            images: ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'AMOLED Ultra Smartwatch (Health Suite)',
        slug: 'amoled-ultra-smartwatch-health-suite',
        description: '1.96-inch high-definition AMOLED curved display, continuous SpO2/HR heart rate monitor, Bluetooth phone calls and IP68 waterproof rating.',
        category: ProductCategory.ELECTRONICS,
        subCategory: 'Wearables',
        subType: ProductSubType.SPORTS,
        brand: 'AeroTrack',
        tags: ['smartwatch', 'amoled', 'fitness', 'wearables', 'bluetooth'],
        isFeatured: true,
        variants: [
          {
            sku: 'NXG-WCH-SLV',
            size: '45mm',
            color: 'Titanium Silver',
            colorHex: '#9ca3af',
            price: 3499,
            mrp: 6999,
            stock: 20,
            images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop'],
            isActive: true,
          },
          {
            sku: 'NXG-WCH-BLK',
            size: '45mm',
            color: 'Midnight Black',
            colorHex: '#111827',
            price: 3499,
            mrp: 6999,
            stock: 30,
            images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Fast-Charging 65W GaN Dual-Port Wall Charger',
        slug: 'fast-charging-65w-gan-dual-port-wall-charger',
        description: 'Next-gen Gallium Nitride (GaN) fast charger with 1x USB-C PD 65W and 1x USB-A QC 3.0. Charges laptops, tablets, and phones.',
        category: ProductCategory.ELECTRONICS,
        subCategory: 'Power & Accessories',
        subType: ProductSubType.OTHER,
        brand: 'PowerNova',
        tags: ['charger', 'gan', 'fast-charging', 'usbc', 'power'],
        isFeatured: false,
        variants: [
          {
            sku: 'NXG-GAN-65W',
            size: 'Standard',
            color: 'Matte White',
            colorHex: '#ffffff',
            price: 1499,
            mrp: 2499,
            stock: 40,
            images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Magnetic Wireless Power Bank 10000mAh',
        slug: 'magnetic-wireless-power-bank-10000mah',
        description: 'Snap-on MagSafe compatible power bank with 15W wireless output, 20W wired fast charging, and foldable kickstand.',
        category: ProductCategory.ELECTRONICS,
        subCategory: 'Power & Accessories',
        subType: ProductSubType.OTHER,
        brand: 'PowerNova',
        tags: ['powerbank', 'magsafe', 'wireless', 'battery'],
        isFeatured: true,
        variants: [
          {
            sku: 'NXG-PB-10K-BLU',
            size: '10000mAh',
            color: 'Space Grey',
            colorHex: '#4b5563',
            price: 1999,
            mrp: 3499,
            stock: 25,
            images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Studio-Grade USB-C Podcast Condenser Microphone',
        slug: 'studio-grade-usb-c-podcast-condenser-microphone',
        description: 'Cardioid polar pattern, zero-latency headphone monitoring, tap-to-mute sensor with RGB LED indicator. Plug & play.',
        category: ProductCategory.ELECTRONICS,
        subCategory: 'Audio',
        subType: ProductSubType.OTHER,
        brand: 'SoundPulse',
        tags: ['microphone', 'podcast', 'audio', 'streaming', 'usbc'],
        isFeatured: false,
        variants: [
          {
            sku: 'NXG-MIC-USB',
            size: 'Standard',
            color: 'Matte Black',
            colorHex: '#000000',
            price: 3299,
            mrp: 5499,
            stock: 15,
            images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Ergonomic Aluminum Laptop Stand (360 Swivel)',
        slug: 'ergonomic-aluminum-laptop-stand-360-swivel',
        description: 'Aerospace-grade aluminum foldable riser with rotating base, anti-slip silicone pads, and heat dissipation cutouts.',
        category: ProductCategory.ELECTRONICS,
        subCategory: 'Computer Accessories',
        subType: ProductSubType.OTHER,
        brand: 'AeroTrack',
        tags: ['stand', 'laptop', 'ergonomic', 'aluminum', 'desk'],
        isFeatured: false,
        variants: [
          {
            sku: 'NXG-STD-ALU',
            size: 'Up to 17 inch',
            color: 'Metallic Silver',
            colorHex: '#d1d5db',
            price: 1299,
            mrp: 2199,
            stock: 30,
            images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Grocery & Staples Merchant (Approved - Nehru Nagar, Bhilai)
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
      reviewCount: 65,
      legalDetails: {
        gstin: '22AAACV4120M1ZQ',
        pan: 'AAACV4120M',
        legalBusinessName: 'GreenValley Agro Naturals LLP',
        isGstVerified: true,
      },
      bankDetails: {
        accountNumber: '00210200039485',
        ifscCode: 'SBIN0000691',
        accountHolderName: 'GreenValley Agro Naturals LLP',
        bankName: 'State Bank of India',
        isVerified: true,
      },
    },
    products: [
      {
        name: 'Cold-Pressed Extra Virgin Mustard Oil 1L',
        slug: 'cold-pressed-extra-virgin-mustard-oil-1l',
        description: 'Traditional wood-pressed (Kachi Ghani) golden mustard oil from certified organic seeds. Rich in natural Omega-3.',
        category: ProductCategory.GROCERY_STAPLES,
        subCategory: 'Edible Oils',
        subType: ProductSubType.OTHER,
        brand: 'GreenValley',
        tags: ['oil', 'mustard', 'cold-pressed', 'organic', 'cooking'],
        isFeatured: true,
        variants: [
          {
            sku: 'GVO-OIL-1L',
            size: '1 Litre',
            color: 'Rich Mustard',
            colorHex: '#eab308',
            price: 279,
            mrp: 350,
            stock: 60,
            images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop'],
            isActive: true,
          },
          {
            sku: 'GVO-OIL-2L',
            size: '2 Litres',
            color: 'Rich Mustard',
            colorHex: '#eab308',
            price: 529,
            mrp: 680,
            stock: 35,
            images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Wild Forest Raw Organic Honey 500g',
        slug: 'wild-forest-raw-organic-honey-500g',
        description: 'Unpasteurized, unprocessed multi-floral forest honey sustainably harvested by tribal beekeepers.',
        category: ProductCategory.GROCERY_STAPLES,
        subCategory: 'Honey & Preserves',
        subType: ProductSubType.OTHER,
        brand: 'GreenValley',
        tags: ['organic', 'raw', 'honey', 'natural', 'grocery'],
        isFeatured: true,
        variants: [
          {
            sku: 'GVO-HNY-500G',
            size: '500g',
            color: 'Golden Amber',
            colorHex: '#d97706',
            price: 449,
            mrp: 599,
            stock: 45,
            images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Single-Origin Stone-Ground Whole Wheat Atta 5kg',
        slug: 'single-origin-stone-ground-whole-wheat-atta-5kg',
        description: '100% whole grain Sharbati wheat flour milled slowly in stone chakki to retain natural bran and germ nutrients.',
        category: ProductCategory.GROCERY_STAPLES,
        subCategory: 'Flours & Grains',
        subType: ProductSubType.OTHER,
        brand: 'GreenValley',
        tags: ['flour', 'atta', 'wheat', 'organic', 'staples'],
        isFeatured: true,
        variants: [
          {
            sku: 'GVO-ATA-5KG',
            size: '5kg',
            color: 'Natural Grain',
            colorHex: '#fef3c7',
            price: 349,
            mrp: 420,
            stock: 80,
            images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Himalayan Pink Rock Salt Crystals 1kg',
        slug: 'himalayan-pink-rock-salt-crystals-1kg',
        description: 'Unrefined, mineral-rich natural pink rock salt containing 84+ trace minerals. Non-iodized and chemical free.',
        category: ProductCategory.GROCERY_STAPLES,
        subCategory: 'Spices & Salt',
        subType: ProductSubType.OTHER,
        brand: 'GreenValley',
        tags: ['salt', 'himalayan', 'pink-salt', 'organic', 'cooking'],
        isFeatured: false,
        variants: [
          {
            sku: 'GVO-SLT-1KG',
            size: '1kg',
            color: 'Rose Pink',
            colorHex: '#f43f5e',
            price: 129,
            mrp: 180,
            stock: 100,
            images: ['https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'A2 Desi Gir Cow Bilona Cultured Ghee 500ml',
        slug: 'a2-desi-gir-cow-bilona-cultured-ghee-500ml',
        description: 'Traditional curd-churned (Vedic Bilona method) pure A2 golden ghee from free-grazing indigenous Gir cows.',
        category: ProductCategory.GROCERY_STAPLES,
        subCategory: 'Dairy & Ghee',
        subType: ProductSubType.OTHER,
        brand: 'GreenValley',
        tags: ['ghee', 'a2', 'cow-ghee', 'bilona', 'ayurvedic'],
        isFeatured: true,
        variants: [
          {
            sku: 'GVO-GHE-500ML',
            size: '500ml',
            color: 'Golden Yellow',
            colorHex: '#fbbf24',
            price: 899,
            mrp: 1199,
            stock: 30,
            images: ['https://images.unsplash.com/photo-1627916607164-7b20241db935?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Whole Aromatic Malabar Black Peppercorns 200g',
        slug: 'whole-aromatic-malabar-black-peppercorns-200g',
        description: 'Sun-dried premium Tellicherry garbled black pepper with high piperine content and intense aromatic kick.',
        category: ProductCategory.GROCERY_STAPLES,
        subCategory: 'Spices & Seasonings',
        subType: ProductSubType.OTHER,
        brand: 'GreenValley',
        tags: ['spices', 'pepper', 'black-pepper', 'organic', 'condiments'],
        isFeatured: false,
        variants: [
          {
            sku: 'GVO-PEP-200G',
            size: '200g',
            color: 'Dark Peppercorn',
            colorHex: '#18181b',
            price: 219,
            mrp: 299,
            stock: 50,
            images: ['https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Pharmacy & Wellness Merchant (Approved - Malviya Nagar, Durg)
  // ──────────────────────────────────────────────────────────────────────────
  {
    user: {
      fullName: 'Dr. Priya Nair',
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
        sunday: { open: '09:00', close: '22:00', isOpen: true },
      },
      deliveryRadiusKm: 4.0,
      approvalStatus: StoreApprovalStatus.APPROVED,
      isActive: true,
      rating: 4.9,
      reviewCount: 94,
      legalDetails: {
        gstin: '22AABCA7712C1ZX',
        pan: 'AABCA7712C',
        legalBusinessName: 'Aura Medico Healthcare LLP',
        isGstVerified: true,
      },
      bankDetails: {
        accountNumber: '02341020002938',
        ifscCode: 'KKBK0000654',
        accountHolderName: 'Aura Medico Healthcare LLP',
        bankName: 'Kotak Mahindra Bank',
        isVerified: true,
      },
    },
    products: [
      {
        name: 'Ayurvedic Pure Ashwagandha Root Extract 60s',
        slug: 'ayurvedic-pure-ashwagandha-root-extract-60s',
        description: 'Standardized with 5% Withanolides. Supports natural stress relief, cognitive clarity, and vitality.',
        category: ProductCategory.BEAUTY,
        subCategory: 'Supplements',
        subType: ProductSubType.OTHER,
        brand: 'Aura Veda',
        tags: ['ayurveda', 'ashwagandha', 'supplements', 'stress-relief', 'wellness'],
        isFeatured: true,
        variants: [
          {
            sku: 'AUR-ASH-60CAP',
            size: 'Pack of 60',
            color: 'Amber Bottle',
            colorHex: '#78350f',
            price: 499,
            mrp: 699,
            stock: 50,
            images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Natural Botanical Aloe Vera & Vitamin E Gel 250ml',
        slug: 'natural-botanical-aloe-vera-and-vitamin-e-gel-250ml',
        description: '99% pure soothing cold-extracted aloe vera gel enriched with Vitamin E. Multi-purpose skin and hair hydrator.',
        category: ProductCategory.BEAUTY,
        subCategory: 'Personal Care',
        subType: ProductSubType.OTHER,
        brand: 'Aura Botanics',
        tags: ['aloe-vera', 'skincare', 'gel', 'natural', 'hydration'],
        isFeatured: true,
        variants: [
          {
            sku: 'AUR-ALO-250ML',
            size: '250ml',
            color: 'Crystal Clear',
            colorHex: '#10b981',
            price: 249,
            mrp: 349,
            stock: 65,
            images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Effervescent Vitamin C + Zinc Immunity Boost 20s',
        slug: 'effervescent-vitamin-c-plus-zinc-immunity-boost-20s',
        description: 'Quick-absorbing sparkling fizzy tablets with 1000mg Amla Vitamin C and 10mg Zinc. Refreshing natural orange taste.',
        category: ProductCategory.BEAUTY,
        subCategory: 'Immunity & Nutrition',
        subType: ProductSubType.OTHER,
        brand: 'Aura Veda',
        tags: ['vitamin-c', 'immunity', 'zinc', 'effervescent', 'nutrition'],
        isFeatured: false,
        variants: [
          {
            sku: 'AUR-VITC-20TAB',
            size: 'Tube of 20',
            color: 'Zesty Orange',
            colorHex: '#ea580c',
            price: 299,
            mrp: 399,
            stock: 80,
            images: ['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Cold-Pressed Virgin Coconut Hair & Body Elixir 200ml',
        slug: 'cold-pressed-virgin-coconut-hair-and-body-elixir-200ml',
        description: 'Raw, unrefined extra-virgin coconut oil extracted from fresh coconut milk. Deep conditioning for scalp and dry skin.',
        category: ProductCategory.BEAUTY,
        subCategory: 'Hair Care',
        subType: ProductSubType.OTHER,
        brand: 'Aura Botanics',
        tags: ['coconut-oil', 'hair-care', 'cold-pressed', 'organic', 'wellness'],
        isFeatured: false,
        variants: [
          {
            sku: 'AUR-COC-200ML',
            size: '200ml',
            color: 'Pure White',
            colorHex: '#ffffff',
            price: 220,
            mrp: 295,
            stock: 40,
            images: ['https://images.unsplash.com/photo-1608248597359-009765548682?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Non-Contact Infrared Digital Forehead Thermometer',
        slug: 'non-contact-infrared-digital-forehead-thermometer',
        description: 'Medical precision 1-second body & surface reading with 3-color backlit fever alert and 32-reading memory recall.',
        category: ProductCategory.BEAUTY,
        subCategory: 'Medical Devices',
        subType: ProductSubType.OTHER,
        brand: 'Aura Medico',
        tags: ['thermometer', 'medical', 'digital', 'infrared', 'healthcare'],
        isFeatured: false,
        variants: [
          {
            sku: 'AUR-THM-IR',
            size: 'Standard',
            color: 'Medical White',
            colorHex: '#f3f4f6',
            price: 999,
            mrp: 1799,
            stock: 25,
            images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Herbal Pain Relief Balm for Muscles & Joints 50g',
        slug: 'herbal-pain-relief-balm-for-muscles-and-joints-50g',
        description: 'Fast-acting Ayurvedic formulation with Nilgiri oil, Wintergreen, and Camphor for soothing backache, sprains, and joint stiffness.',
        category: ProductCategory.BEAUTY,
        subCategory: 'Pain Relief',
        subType: ProductSubType.OTHER,
        brand: 'Aura Veda',
        tags: ['pain-relief', 'balm', 'ayurvedic', 'joint-care', 'herbal'],
        isFeatured: false,
        variants: [
          {
            sku: 'AUR-BLM-50G',
            size: '50g',
            color: 'Herbal Amber',
            colorHex: '#b45309',
            price: 135,
            mrp: 175,
            stock: 70,
            images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 5. Pending Merchant (For Super Admin Onboarding & Review testing)
  // ──────────────────────────────────────────────────────────────────────────
  {
    user: {
      fullName: 'Karan Malhotra',
      email: 'karan.retail@example.com',
      phone: '9876543255',
      password: 'Password@123',
      role: UserRole.MERCHANT,
      isVerified: false,
      isActive: true,
    },
    store: {
      name: 'Karan Fresh Mart',
      slug: 'karan-fresh-mart',
      description: 'Neighborhood daily dairy, bakery & confectionary mart with express doorstep fulfillment.',
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
      deliveryRadiusKm: 3.0,
      approvalStatus: StoreApprovalStatus.PENDING,
      isActive: true,
      rating: 5.0,
      reviewCount: 0,
      legalDetails: {
        gstin: '22AABCK9901M1Z5',
        pan: 'AABCK9901M',
        legalBusinessName: 'Karan Fresh Mart Retail LLP',
        isGstVerified: false,
      },
      bankDetails: {
        accountNumber: '92102003817265',
        ifscCode: 'UTIB0000138',
        accountHolderName: 'Karan Fresh Mart Retail LLP',
        bankName: 'Axis Bank Ltd',
        isVerified: false,
      },
    },
  },
  // ──────────────────────────────────────────────────────────────────────────
  // 6. Grocery Provisions Merchant (Amit Verma - Sector 7, Bhilai)
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
      description: 'Daily fresh staples, grains, pulses, and organic spices directly sourced from local mandis.',
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
        saturday: { open: '08:00', close: '22:00', isOpen: true },
        sunday: { open: '08:00', close: '21:00', isOpen: true },
      },
      deliveryRadiusKm: 4.0,
      approvalStatus: StoreApprovalStatus.APPROVED,
      isActive: true,
      rating: 4.7,
      reviewCount: 22,
      legalDetails: {
        gstin: '22AABCV1029C1ZZ',
        pan: 'AABCV1029C',
        legalBusinessName: 'Verma Daily Provisions Retail LLP',
        isGstVerified: true,
      },
      bankDetails: {
        accountNumber: '92102008471920',
        ifscCode: 'SBIN0000332',
        accountHolderName: 'Verma Daily Provisions Retail LLP',
        bankName: 'State Bank of India',
        isVerified: true,
      },
    },
    products: [
      {
        name: 'Whole Sharbati Wheat Flour (Chakki Fresh Atta)',
        slug: 'whole-sharbati-wheat-flour-5kg',
        description: '100% whole grain stone-milled MP Sharbati wheat flour with zero maida and natural dietary fiber.',
        category: ProductCategory.GROCERY_STAPLES,
        subCategory: 'Flours & Grains',
        subType: ProductSubType.OTHER,
        brand: 'Verma Farm',
        tags: ['atta', 'sharbati', 'wheat', 'flour', 'staples'],
        isFeatured: true,
        variants: [
          {
            sku: 'VDP-WHT-5KG',
            size: '5 kg',
            price: 265,
            mrp: 320,
            stock: 45,
            images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
      {
        name: 'Kachi Ghani Mustard Oil (Cold-Pressed)',
        slug: 'kachi-ghani-mustard-oil-1l',
        description: 'Traditional wood-pressed unfiltered mustard oil with high pungency and rich aroma.',
        category: ProductCategory.GROCERY_STAPLES,
        subCategory: 'Oils & Ghee',
        subType: ProductSubType.OTHER,
        brand: 'Verma Farm',
        tags: ['mustard oil', 'cold-pressed', 'kachi ghani', 'cooking oil'],
        isFeatured: true,
        variants: [
          {
            sku: 'VDP-MST-1L',
            size: '1 Litre',
            price: 185,
            mrp: 230,
            stock: 60,
            images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // 7. Electronics & Accessories Merchant (Priya Patel - Supela, Bhilai)
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
      description: 'Authorized smart accessories, chargers, wireless audio, and device accessories in Supela.',
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
    products: [
      {
        name: 'Fast Wireless Magnetic Power Bank 10000mAh',
        slug: 'fast-wireless-magnetic-power-bank-10000mah',
        description: 'Compact 20W magnetic snap-on wireless power bank with bidirectional USB-C PD fast charging.',
        category: ProductCategory.ELECTRONICS,
        subCategory: 'Power Banks',
        subType: ProductSubType.OTHER,
        brand: 'VoltCharge',
        tags: ['powerbank', 'wireless', 'magnetic', 'fast charge', 'battery'],
        isFeatured: true,
        variants: [
          {
            sku: 'PE-MAG-PB-BLK',
            color: 'Midnight Black',
            colorHex: '#1e293b',
            price: 1899,
            mrp: 3299,
            stock: 35,
            images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop'],
            isActive: true,
          },
        ],
      },
    ],
  },
];

export async function seedMerchantsAndData(): Promise<void> {
  logger.info('🚀 Starting Master Database Purge & Re-Seeding...');

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(env.MONGODB_URI);
    logger.info(`📦 Connected to MongoDB: ${env.MONGODB_URI}`);
  }

  // 1. COMPLETE DATABASE PURGE
  logger.info('🧹 Purging all existing collections (users, stores, products, orders, deliveries, notifications)...');
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
  const secondaryCustomer = seededCustomers[1]; // Sneha Rao

  // 4. SEED MERCHANTS, STORES, PRODUCTS & ORDERS
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
  if (groceryStore && groceryProducts.length >= 3) {
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
      deliveryOtp: '8834',
      createdAt: new Date(Date.now() - 6 * 3600 * 1000),
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
  logger.info('⏳ Pending Merchant:   karan.retail@example.com   / Password@123');
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
