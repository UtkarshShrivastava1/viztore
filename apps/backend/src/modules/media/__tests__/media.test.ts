import { describe, it, expect, vi, beforeEach } from 'vitest';
import { v2 as cloudinary } from 'cloudinary';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../media.service.js';
import { AppError } from '../../../shared/utils/AppError.js';

vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      upload_stream: vi.fn(),
      destroy: vi.fn(),
    },
  },
}));

describe('Media Service — Cloudinary Upload & Storage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadBufferToCloudinary', () => {
    it('successfully uploads buffer and returns image metadata and secure CDN URL', async () => {
      const mockResult = {
        url: 'http://res.cloudinary.com/dovysyg6n/image/upload/v1234/products/sample.jpg',
        secure_url: 'https://res.cloudinary.com/dovysyg6n/image/upload/v1234/products/sample.jpg',
        public_id: 'products/sample',
        format: 'jpg',
        width: 800,
        height: 600,
        bytes: 102400,
      };

      const mockUploadStream = {
        end: vi.fn((buffer: Buffer) => {
          // Trigger the callback registered in upload_stream
          const callback = (cloudinary.uploader.upload_stream as any).mock.calls[0][1];
          callback(null, mockResult);
        }),
      };

      (cloudinary.uploader.upload_stream as any).mockReturnValue(mockUploadStream);

      const buffer = Buffer.from('fake-image-bytes');
      const result = await uploadBufferToCloudinary(buffer, { folder: 'products' });

      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        expect.objectContaining({ folder: 'products', resource_type: 'image' }),
        expect.any(Function),
      );
      expect(mockUploadStream.end).toHaveBeenCalledWith(buffer);
      expect(result.secureUrl).toBe(mockResult.secure_url);
      expect(result.publicId).toBe('products/sample');
      expect(result.width).toBe(800);
      expect(result.height).toBe(600);
    });

    it('rejects with AppError when Cloudinary stream yields an error', async () => {
      const mockUploadStream = {
        end: vi.fn(() => {
          const callback = (cloudinary.uploader.upload_stream as any).mock.calls[0][1];
          callback(new Error('Cloudinary socket timeout'), null);
        }),
      };

      (cloudinary.uploader.upload_stream as any).mockReturnValue(mockUploadStream);

      const buffer = Buffer.from('fake-image-bytes');
      await expect(uploadBufferToCloudinary(buffer)).rejects.toThrow(
        /Failed to upload image to Cloudinary storage/,
      );
    });
  });

  describe('deleteFromCloudinary', () => {
    it('successfully destroys asset and returns true on ok result', async () => {
      (cloudinary.uploader.destroy as any).mockResolvedValue({ result: 'ok' });

      const success = await deleteFromCloudinary('products/sample_123');
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('products/sample_123');
      expect(success).toBe(true);
    });

    it('returns false when Cloudinary destroy result is not ok', async () => {
      (cloudinary.uploader.destroy as any).mockResolvedValue({ result: 'not found' });

      const success = await deleteFromCloudinary('products/invalid_id');
      expect(success).toBe(false);
    });

    it('returns false when destroy call throws', async () => {
      (cloudinary.uploader.destroy as any).mockRejectedValue(new Error('Network error'));

      const success = await deleteFromCloudinary('products/error_id');
      expect(success).toBe(false);
    });
  });
});
