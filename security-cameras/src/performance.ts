export const CAMERA_QUALITY = {
  low: { maxDimension: 480, interval: 2500, quality: .65 },
  balanced: { maxDimension: 640, interval: 1500, quality: .7 },
  high: { maxDimension: 960, interval: 1250, quality: .72 }
};

export type CameraPerformance = typeof CAMERA_QUALITY.high & { animateVideo: boolean };

export function getCameraPerformance(quality: unknown = "balanced", animateVideo = true): CameraPerformance {
  return { ...(CAMERA_QUALITY[String(quality)] ?? CAMERA_QUALITY.balanced), animateVideo };
}
