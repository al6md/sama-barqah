/**
 * Client-side high-performance image compression and optimization utility.
 * Resizes large smartphone/camera photos down to web-optimized dimensions & quality
 * to guarantee instant upload, low latency, and zero payload size errors.
 */

export async function compressImageFile(
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's not a standard raster image or SVG, fallback to direct reader
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        let { width, height } = img;

        // Calculate proportional scale down
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback if canvas context is unavailable
          const fallbackReader = new FileReader();
          fallbackReader.onload = (e) => resolve((e.target?.result as string) || '');
          fallbackReader.readAsDataURL(file);
          return;
        }

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export as optimized JPEG
        const outputType = file.type === 'image/png' && hasTransparency(ctx, width, height)
          ? 'image/png'
          : 'image/jpeg';

        const compressedDataUrl = canvas.toDataURL(outputType, quality);
        resolve(compressedDataUrl);
      } catch (err) {
        // Fallback
        const fallbackReader = new FileReader();
        fallbackReader.onload = (e) => resolve((e.target?.result as string) || '');
        fallbackReader.readAsDataURL(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const fallbackReader = new FileReader();
      fallbackReader.onload = (e) => resolve((e.target?.result as string) || '');
      fallbackReader.onerror = (e) => reject(e);
      fallbackReader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}

function hasTransparency(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  try {
    // Fast sample of border pixels to check for alpha channel
    const step = Math.max(1, Math.floor(Math.min(width, height) / 20));
    const imgData = ctx.getImageData(0, 0, width, height).data;
    for (let i = 3; i < imgData.length; i += 4 * step) {
      if (imgData[i] < 250) {
        return true;
      }
    }
  } catch {
    // If security blocks getImageData (e.g. cross-origin), default to false
  }
  return false;
}
