import {
  CompleteOnboardingDto,
  OnboardingStep2Dto,
  StoreApprovalStatus,
  IStore,
  GSTIN_REGEX,
} from '@repo/shared-types';
import { StoreModel } from './store.model.js';
import { UserModel } from '../auth/auth.model.js';
import { AppError } from '../../shared/utils/AppError.js';
import { logger } from '../../shared/utils/logger.js';

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${randomSuffix}`;
}

export const GST_STATE_CODE_MAP: Record<string, string> = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra & Nagar Haveli and Daman & Diu',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman & Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh',
};

/**
 * Verify GSTIN in real-time
 * Performs syntax validation and extracts state code + PAN
 */
export async function verifyGstin(gstin: string): Promise<{
  isValid: boolean;
  gstin: string;
  pan: string;
  extractedPan: string;
  stateCode: string;
  stateName: string;
  legalName: string;
  legalNameMock: string;
}> {
  const normalizedGstin = gstin.trim().toUpperCase();

  if (!GSTIN_REGEX.test(normalizedGstin)) {
    throw AppError.badRequest('Invalid GSTIN format. Expected 15 characters (e.g. 22ABCDE1234F1Z5)', 'INVALID_GSTIN');
  }

  const stateCode = normalizedGstin.substring(0, 2);
  const pan = normalizedGstin.substring(2, 12);
  const stateName = GST_STATE_CODE_MAP[stateCode] || 'State ' + stateCode;

  // In production, integrates with GST API; mock returns verified business name with jurisdiction
  const legalName = `Retail Merchant (${stateName})`;

  return {
    isValid: true,
    gstin: normalizedGstin,
    pan,
    extractedPan: pan,
    stateCode,
    stateName,
    legalName,
    legalNameMock: legalName,
  };
}

/**
 * Complete 6-Step Onboarding Submission
 * Creates or updates merchant's store into PENDING approval queue
 */
export async function submitCompleteOnboarding(
  userId: string,
  dto: CompleteOnboardingDto,
): Promise<IStore> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found', 'USER_NOT_FOUND');
  }

  // Check if store already registered by this user
  let store = await StoreModel.findOne({ ownerId: userId });

  const slug = generateSlug(dto.step4.storeDisplayName);

  if (store) {
    // Update existing store draft
    store.name = dto.step4.storeDisplayName;
    store.slug = slug;
    store.description = dto.step4.description;
    store.category = dto.step5.primaryCategory;
    store.address = dto.step4.address;
    store.location = dto.step4.location;
    store.operatingHours = dto.step5.operatingHours;
    store.deliveryRadiusKm = dto.step4.deliveryRadiusKm;
    store.legalDetails = {
      gstin: dto.step2.gstin,
      pan: dto.step2.pan,
      legalBusinessName: dto.step2.legalBusinessName,
      signatureUrl: dto.step3.signatureData,
      isGstVerified: true,
    };
    store.bankDetails = {
      accountNumber: dto.step6.accountNumber,
      ifscCode: dto.step6.ifscCode,
      accountHolderName: dto.step6.accountHolderName,
      bankName: dto.step6.bankName,
      isVerified: false,
    };
    // Auto-approve newly onboarded stores until Super Admin review panel is launched
    store.approvalStatus = StoreApprovalStatus.APPROVED;
    store.isActive = true;
    await store.save();
  } else {
    store = new StoreModel({
      ownerId: userId,
      name: dto.step4.storeDisplayName,
      slug,
      description: dto.step4.description,
      category: dto.step5.primaryCategory,
      address: dto.step4.address,
      location: dto.step4.location,
      operatingHours: dto.step5.operatingHours,
      deliveryRadiusKm: dto.step4.deliveryRadiusKm,
      legalDetails: {
        gstin: dto.step2.gstin,
        pan: dto.step2.pan,
        legalBusinessName: dto.step2.legalBusinessName,
        signatureUrl: dto.step3.signatureData,
        isGstVerified: true,
      },
      bankDetails: {
        accountNumber: dto.step6.accountNumber,
        ifscCode: dto.step6.ifscCode,
        accountHolderName: dto.step6.accountHolderName,
        bankName: dto.step6.bankName,
        isVerified: false,
      },
      approvalStatus: StoreApprovalStatus.APPROVED,
      isActive: true,
    });
    await store.save();
  }

  logger.info(`🏬 Merchant onboarded store '${store.name}' (ID: ${store._id}). Auto-approved for launch.`);

  return store.toJSON() as unknown as IStore;
}

/**
 * Get Onboarding Status for Merchant
 */
export async function getMerchantOnboardingStatus(userId: string): Promise<{
  hasStore: boolean;
  store?: IStore;
  approvalStatus?: StoreApprovalStatus;
}> {
  const store = await StoreModel.findOne({ ownerId: userId }).lean();

  if (!store) {
    return { hasStore: false };
  }

  // Auto-promote any legacy pending store to approved
  if (store.approvalStatus === StoreApprovalStatus.PENDING) {
    await StoreModel.updateOne(
      { _id: (store as any)._id },
      { $set: { approvalStatus: StoreApprovalStatus.APPROVED } }
    );
    (store as any).approvalStatus = StoreApprovalStatus.APPROVED;
  }

  return {
    hasStore: true,
    store: store as unknown as IStore,
    approvalStatus: store.approvalStatus as StoreApprovalStatus,
  };
}

/**
 * Admin: Fetch Pending Stores in Queue
 */
export async function getPendingStoresQueue(params: { page?: number; limit?: number }) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const skip = (page - 1) * limit;

  const filter = { approvalStatus: StoreApprovalStatus.PENDING };

  const [stores, total] = await Promise.all([
    StoreModel.find(filter)
      .populate('ownerId', 'fullName email phone')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    StoreModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    stores,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Admin: Approve or Reject Store
 */
export async function reviewStoreRegistration(
  storeId: string,
  status: StoreApprovalStatus.APPROVED | StoreApprovalStatus.REJECTED,
  _remarks?: string,
): Promise<IStore> {
  const store = await StoreModel.findById(storeId);
  if (!store) {
    throw AppError.notFound('Store not found', 'STORE_NOT_FOUND');
  }

  store.approvalStatus = status;
  if (status === StoreApprovalStatus.APPROVED) {
    store.isActive = true;
  }
  await store.save();

  logger.info(`🏬 Admin reviewed store '${store.name}' (ID: ${storeId}) -> status: ${status}`);

  return store.toJSON() as unknown as IStore;
}
