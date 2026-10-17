import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { env } from '../../shared/config/env.config.js';
import { logger } from '../../shared/utils/logger.js';
import { AppError } from '../../shared/utils/AppError.js';

// Configure Cloudinary with environment variables
if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  logger.info(`☁️ Cloudinary SDK initialized for cloud: '${env.CLOUDINARY_CLOUD_NAME}'`);
} else {
  logger.warn('⚠️ Cloudinary credentials missing from environment. Media uploads will require fallback.');
}

export interface UploadOptions {
  folder?: string;
  publicId?: string;
  transformation?: Array<Record<string, unknown>>;
  tags?: string[];
}

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Upload a binary Buffer directly to Cloudinary via upload_stream
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadOptions = {},
): Promise<UploadResult> {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw AppError.internal(
      'Cloudinary media storage is not configured on this server',
      'CLOUDINARY_NOT_CONFIGURED',
    );
  }

  const folder = options.folder || 'products';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options.publicId,
        resource_type: 'image',
        transformation: options.transformation,
        tags: options.tags,
      },
      (error: unknown, result?: UploadApiResponse) => {
        if (error || !result) {
          logger.error('Cloudinary upload_stream error:', error);
          return reject(
            AppError.internal(
              'Failed to upload image to Cloudinary storage',
              'MEDIA_UPLOAD_FAILED',
            ),
          );
        }

        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        });
      },
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete an image asset from Cloudinary by its public ID
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!env.CLOUDINARY_CLOUD_NAME) return false;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (err) {
    logger.error(`Failed to delete Cloudinary asset ${publicId}:`, err);
    return false;
  }
}
