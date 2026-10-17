import { Router } from 'express';
import multer from 'multer';
import { authGuard } from '../../shared/middlewares/authGuard.js';
import { AppError } from '../../shared/utils/AppError.js';
import * as mediaController from './media.controller.js';

const mediaRouter = Router();

// Configure in-memory multer storage
const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      AppError.badRequest(
        `Invalid file type '${file.mimetype}'. Only JPEG, PNG, WebP, GIF, and AVIF images are permitted.`,
        'INVALID_FILE_TYPE',
      ),
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max per file
    files: 10,
  },
  fileFilter,
});

/**
 * @swagger
 * /api/v1/media/upload:
 *   post:
 *     summary: Upload a single image to Cloudinary CDN
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *                 default: products
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 */
mediaRouter.post('/upload', authGuard, upload.single('file'), mediaController.uploadSingle);

/**
 * @swagger
 * /api/v1/media/upload-multiple:
 *   post:
 *     summary: Upload up to 10 images in parallel to Cloudinary CDN
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               folder:
 *                 type: string
 *                 default: products
 *     responses:
 *       201:
 *         description: Images uploaded successfully
 */
mediaRouter.post(
  '/upload-multiple',
  authGuard,
  upload.array('files', 10),
  mediaController.uploadMultiple,
);

export { mediaRouter };
