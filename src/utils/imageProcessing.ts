import { FilterMode } from '../types';

/**
 * Cache for processed filter images to avoid re-running expensive pixel manipulation
 */
const filterCache = new Map<string, string>();

/**
 * Process an image through HTML5 Canvas to apply Edge Detection (Contour/Outline),
 * Inversion, Monochrome, or Color Tints.
 */
export async function applyImageFilter(
  imgSource: HTMLImageElement | string,
  filterMode: FilterMode,
  edgeThreshold: number = 28
): Promise<string> {
  const cacheKey = typeof imgSource === 'string' 
    ? `${imgSource}_${filterMode}_${edgeThreshold}` 
    : `${imgSource.src}_${filterMode}_${edgeThreshold}`;

  if (filterCache.has(cacheKey)) {
    return filterCache.get(cacheKey)!;
  }

  const img = await resolveImage(imgSource);
  
  if (filterMode === 'normal') {
    return img.src;
  }

  const canvas = document.createElement('canvas');
  // Limit max dimensions for snappy real-time performance
  const maxDim = 1000;
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

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
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return img.src;

  ctx.drawImage(img, 0, 0, width, height);

  try {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const len = data.length;

    if (filterMode === 'outline') {
      // Sobel Edge Detection
      const gray = new Uint8ClampedArray(width * height);
      for (let i = 0, j = 0; i < len; i += 4, j++) {
        // Luminance formula
        gray[j] = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      }

      const outputData = ctx.createImageData(width, height);
      const out = outputData.data;

      // Sobel Kernels
      // Gx = [-1 0 1; -2 0 2; -1 0 1]
      // Gy = [-1 -2 -1; 0 0 0; 1 2 1]
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x;
          const outIdx = idx * 4;

          const p00 = gray[(y - 1) * width + (x - 1)];
          const p01 = gray[(y - 1) * width + x];
          const p02 = gray[(y - 1) * width + (x + 1)];
          const p10 = gray[y * width + (x - 1)];
          const p12 = gray[y * width + (x + 1)];
          const p20 = gray[(y + 1) * width + (x - 1)];
          const p21 = gray[(y + 1) * width + x];
          const p22 = gray[(y + 1) * width + (x + 1)];

          const gx = -p00 + p02 - 2 * p10 + 2 * p12 - p20 + p22;
          const gy = -p00 - 2 * p01 - p02 + p20 + 2 * p21 + p22;
          const mag = Math.sqrt(gx * gx + gy * gy);

          // If magnitude exceeds threshold, draw dark line (or bright line on transparent)
          if (mag > edgeThreshold) {
            // Crisp dark outline
            out[outIdx] = 10;
            out[outIdx + 1] = 10;
            out[outIdx + 2] = 10;
            out[outIdx + 3] = 255;
          } else {
            // White / semi-transparent background
            out[outIdx] = 255;
            out[outIdx + 1] = 255;
            out[outIdx + 2] = 255;
            out[outIdx + 3] = 20; // very light background so sketch lines pop
          }
        }
      }
      ctx.putImageData(outputData, 0, 0);

    } else if (filterMode === 'monochrome') {
      for (let i = 0; i < len; i += 4) {
        const v = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
      }
      ctx.putImageData(imageData, 0, 0);

    } else if (filterMode === 'invert') {
      for (let i = 0; i < len; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
      ctx.putImageData(imageData, 0, 0);

    } else if (filterMode === 'high-contrast') {
      for (let i = 0; i < len; i += 4) {
        const v = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const binary = v > 128 ? 255 : 0;
        data[i] = binary;
        data[i + 1] = binary;
        data[i + 2] = binary;
      }
      ctx.putImageData(imageData, 0, 0);

    } else if (filterMode === 'tint-red') {
      for (let i = 0; i < len; i += 4) {
        const v = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = 255; // bright red channel
        data[i + 1] = Math.round(v * 0.2);
        data[i + 2] = Math.round(v * 0.2);
      }
      ctx.putImageData(imageData, 0, 0);

    } else if (filterMode === 'tint-cyan') {
      for (let i = 0; i < len; i += 4) {
        const v = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = Math.round(v * 0.1);
        data[i + 1] = 230; // bright teal/cyan
        data[i + 2] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    }

    const resultDataUrl = canvas.toDataURL('image/png');
    filterCache.set(cacheKey, resultDataUrl);
    return resultDataUrl;
  } catch (err) {
    console.warn('Canvas filter processing failed (CORS or canvas tainted), falling back to original image:', err);
    return img.src;
  }
}

function resolveImage(imgSource: HTMLImageElement | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (typeof imgSource !== 'string') {
      if (imgSource.complete && imgSource.naturalWidth !== 0) {
        resolve(imgSource);
        return;
      }
      imgSource.onload = () => resolve(imgSource);
      imgSource.onerror = reject;
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imgSource;
  });
}
