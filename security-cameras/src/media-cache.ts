interface MediaEntry {
  promise: Promise<any>;
  media: any;
  bytes: number;
  usedAt: number;
  pins: number;
  video: boolean;
}

export function webPAnimationFlag(bytes: Uint8Array): boolean | null {
  const text = (offset: number) => String.fromCharCode(...bytes.slice(offset, offset + 4));
  if (bytes.length < 21 || text(0) !== "RIFF" || text(8) !== "WEBP") return null;
  if (text(12) === "VP8X") return Boolean(bytes[20] & 2);
  return text(12) === "VP8 " || text(12) === "VP8L" ? false : null;
}

async function animatedImage(path: string) {
  if (/\.(gif|apng)(?:[?#]|$)/i.test(path)) return true;
  if (!/\.webp(?:[?#]|$)|^data:image\/webp[;,]/i.test(path)) return false;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 3000);
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  try {
    const response = await fetch(path, { headers: { Range: "bytes=0-31" }, signal: controller.signal });
    if (!response.ok || !response.body) return true;
    reader = response.body.getReader();
    const prefix = new Uint8Array(32);
    let length = 0;
    while (length < prefix.length) {
      const chunk = await reader.read();
      if (chunk.done) break;
      const count = Math.min(chunk.value.length, prefix.length - length);
      prefix.set(chunk.value.subarray(0, count), length);
      length += count;
    }
    return webPAnimationFlag(prefix.subarray(0, length)) ?? true;
  } catch { return true; }
  finally {
    void reader?.cancel().catch(() => {});
    window.clearTimeout(timeout);
  }
}

/** Limit decoded media by estimated pixel memory, not just file count. */
export function createMediaCache(budgetBytes = 64 * 1024 * 1024, idleMs = 3000) {
  const entries = new Map<string, MediaEntry>();
  const animation = new WeakMap<object, boolean>();
  const owners = new Map<string, Set<MediaEntry>>();
  let activeOwners = new Set<string>();
  let cleanupTimer: number | null = null;

  function remove(path: string, entry: MediaEntry) {
    if (entry.pins) return;
    entries.delete(path);
    if (entry.video) {
      entry.media.pause();
      entry.media.removeAttribute("src");
      entry.media.load();
    } else entry.media.src = "";
  }

  function trim() {
    const retained = new Set([...owners.values()].flatMap(entries => [...entries]));
    let bytes = [...entries.values()].reduce((sum, entry) => sum + entry.bytes, 0);
    for (const [path, entry] of [...entries].sort((a, b) => a[1].usedAt - b[1].usedAt)) {
      if (entry.pins || retained.has(entry)) continue;
      const idle = Date.now() - entry.usedAt >= idleMs;
      if (idle && entry.video) entry.media.pause();
      if (bytes > budgetBytes || entries.size > 48 || idle) {
        bytes -= entry.bytes;
        remove(path, entry);
      }
    }
    if (cleanupTimer !== null) window.clearTimeout(cleanupTimer);
    cleanupTimer = entries.size ? window.setTimeout(trim, idleMs) : null;
  }

  function load(path: string) {
    let entry = entries.get(path);
    if (entry) { entry.usedAt = Date.now(); return entry; }
    const video = /\.(webm|mp4|m4v|ogv|ogg)(?:[?#]|$)/i.test(path);
    const media: any = video ? document.createElement("video") : new Image();
    entry = { media, video, bytes: 0, usedAt: Date.now(), pins: 0, promise: null };
    const current = entry;
    current.promise = new Promise<any>((resolve) => {
      let settled = false;
      const finish = async (result: any) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        media.onload = media.onloadeddata = media.onerror = null;
        if (result) current.bytes = (media.naturalWidth || media.videoWidth || 0) * (media.naturalHeight || media.videoHeight || 0) * 4;
        else entries.delete(path);
        if (!result && video) { media.pause(); media.removeAttribute("src"); media.load(); }
        if (result && !video) animation.set(media, await animatedImage(path));
        resolve(result);
      };
      const timeout = window.setTimeout(() => finish(null), 8000);
      media.crossOrigin = "anonymous";
      media.onerror = () => finish(null);
      if (video) {
        media.muted = true;
        media.loop = true;
        media.playsInline = true;
        media.preload = "auto";
        media.onloadeddata = () => finish(media);
      } else media.onload = () => finish(media);
      media.src = path;
    });
    entries.set(path, current);
    return current;
  }

  return {
    beginFrame(owner?: string) {
      const pinned = new Set<MediaEntry>();
      return {
        async load(path: string) {
          if (!path) return null;
          const entry = load(path);
          if (!pinned.has(entry)) { pinned.add(entry); entry.pins++; }
          return entry.promise;
        },
        finish() {
          if (owner && activeOwners.has(owner)) owners.set(owner, new Set(pinned));
          for (const entry of pinned) { entry.pins--; entry.usedAt = Date.now(); }
          pinned.clear();
          trim();
        }
      };
    },
    pauseVideos() {
      for (const entry of entries.values()) if (entry.video) entry.media.pause();
    },
    isAnimated(media: object) { return animation.get(media) === true; },
    retainOwners(ids: Set<string>) {
      activeOwners = ids;
      for (const owner of owners.keys()) if (!ids.has(owner)) owners.delete(owner);
      const retained = new Set([...owners.values()].flatMap(entries => [...entries]));
      for (const entry of entries.values()) if (entry.video && !entry.pins && !retained.has(entry)) entry.media.pause();
    },
    clear() {
      owners.clear();
      for (const [path, entry] of entries) remove(path, entry);
      if (cleanupTimer !== null) window.clearTimeout(cleanupTimer);
      cleanupTimer = null;
    }
  };
}
