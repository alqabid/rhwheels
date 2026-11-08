export interface LocalImageResult {
  id: string;
  name: string;
  url: string;
  sizeKb: number;
}

/**
 * Reads and optimizes an image file directly from the user's local device
 * using FileReader + HTML5 Canvas so it can be applied directly to a vehicle,
 * gallery item, or banner without any external storage bucket.
 */
async function readAndCompressLocalImage(
  file: File,
  maxWidth = 1280,
  quality = 0.82
): Promise<{ dataUrl: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const sizeKb = Math.max(1, Math.round((dataUrl.length * 0.75) / 1024));
        resolve({ dataUrl, sizeKb });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Reads an image directly from the local device and returns its data URL.
 */
export async function uploadAdminImageFile(
  file: File,
  _category?: string
): Promise<LocalImageResult> {
  const { dataUrl, sizeKb } = await readAndCompressLocalImage(file);
  return {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: file.name,
    url: dataUrl,
    sizeKb,
  };
}
