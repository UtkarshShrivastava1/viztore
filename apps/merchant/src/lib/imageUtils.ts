import { mediaApi } from './api.js';

/**
 * Uploads a file to mediaApi (Cloudinary CDN).
 * If CDN upload fails or is offline, falls back to a compressed base64 Data URL
 * so that assets are 100% transferable across origins (web, merchant, mobile)
 * without blob: URL cross-origin security restrictions.
 */
export async function getOptimizedImageUrl(file: File, folder = 'stores'): Promise<string> {
  try {
    const res = await mediaApi.uploadImage(file, folder);
    if (res?.url && !res.url.startsWith('blob:')) {
      return res.url;
    }
  } catch (err) {
    console.warn('CDN media upload failed, generating transferable base64 Data URL:', err);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve((event.target?.result as string) || '');
        }
      };
      img.onerror = () => resolve((event.target?.result as string) || '');
      img.src = event.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

