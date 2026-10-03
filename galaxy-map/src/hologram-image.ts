const hologramCache = new Map<string, Promise<string | null>>();
const MAX_CACHE_ENTRIES = 40;
const MAX_WORKING_SIZE = 192;

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image unavailable"));
    image.src = source;
  });
}

async function processHologram(source: string) {
  if (!source) return null;
  try {
    const image = await loadImage(source);
    const scale = Math.min(1, MAX_WORKING_SIZE / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
    const width = Math.max(2, Math.round((image.naturalWidth || image.width) * scale));
    const height = Math.max(2, Math.round((image.naturalHeight || image.height) * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return null;
    context.drawImage(image, 0, 0, width, height);
    const sourcePixels = context.getImageData(0, 0, width, height);
    const output = context.createImageData(width, height);
    const grayscale = new Float32Array(width * height);
    for (let index = 0; index < grayscale.length; index++) {
      const offset = index * 4;
      grayscale[index] = sourcePixels.data[offset] * 0.299 + sourcePixels.data[offset + 1] * 0.587 + sourcePixels.data[offset + 2] * 0.114;
    }
    const at = (x: number, y: number) => grayscale[y * width + x];
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const gx = -at(x - 1, y - 1) + at(x + 1, y - 1) - 2 * at(x - 1, y) + 2 * at(x + 1, y) - at(x - 1, y + 1) + at(x + 1, y + 1);
        const gy = -at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1) + at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1);
        const strength = Math.hypot(gx, gy);
        const alpha = Math.max(0, Math.min(235, (strength - 34) * 2.1));
        const offset = (y * width + x) * 4;
        output.data[offset] = 104;
        output.data[offset + 1] = 241;
        output.data[offset + 2] = 255;
        output.data[offset + 3] = alpha;
      }
    }
    context.clearRect(0, 0, width, height);
    context.putImageData(output, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

/** Generate once per bounty/image pair; the bounded cache prevents repeated hover work. */
export function getHologramPortrait(source: string, identity = "") {
  const key = `${identity}\u0000${source}`;
  const cached = hologramCache.get(key);
  if (cached) {
    hologramCache.delete(key);
    hologramCache.set(key, cached);
    return cached;
  }
  while (hologramCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = hologramCache.keys().next().value;
    if (oldestKey === undefined) break;
    hologramCache.delete(oldestKey);
  }
  const result = processHologram(source);
  hologramCache.set(key, result);
  return result;
}
