import { Request, Response, RequestHandler } from 'express';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import { ApiResponse } from '../../shared/utils/ApiResponse.js';
import { AppError } from '../../shared/utils/AppError.js';
import * as mediaService from './media.service.js';

/**
 * Upload single image to Cloudinary
 * POST /api/v1/media/upload
 */
export const uploadSingle: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw AppError.badRequest('No image file provided in request', 'FILE_REQUIRED');
  }

  const folder = typeof req.body.folder === 'string' && /^[a-zA-Z0-9_-]+$/.test(req.body.folder)
    ? req.body.folder
    : 'products';

  const result = await mediaService.uploadBufferToCloudinary(req.file.buffer, {
    folder,
  });

  return ApiResponse.created(
    res,
    {
      url: result.secureUrl,
      publicId: result.publicId,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    },
    'Image uploaded successfully to Cloudinary',
  );
});

/**
 * Upload multiple images in parallel to Cloudinary
 * POST /api/v1/media/upload-multiple
 */
export const uploadMultiple: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || !Array.isArray(files) || files.length === 0) {
    throw AppError.badRequest('No files provided in request', 'FILES_REQUIRED');
  }

  const folder = typeof req.body.folder === 'string' && /^[a-zA-Z0-9_-]+$/.test(req.body.folder)
    ? req.body.folder
    : 'products';

  const uploadPromises = files.map((file) =>
    mediaService.uploadBufferToCloudinary(file.buffer, { folder }),
  );

  const results = await Promise.all(uploadPromises);

  const payload = results.map((r) => ({
    url: r.secureUrl,
    publicId: r.publicId,
    format: r.format,
    width: r.width,
    height: r.height,
    bytes: r.bytes,
  }));

  return ApiResponse.created(res, payload, `${results.length} images uploaded successfully to Cloudinary`);
});
