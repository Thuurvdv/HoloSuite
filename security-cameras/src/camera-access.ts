export function canUserAccessCamera(user: any, camera: any) {
  if (!user || !camera) return false;
  return Boolean(user.isGM || (camera.status !== "offline" && camera.status !== "restricted"));
}

export function cameraRevision(camera: any) {
  // Normalized camera records have a stable field order on each client.
  return JSON.stringify(camera);
}
