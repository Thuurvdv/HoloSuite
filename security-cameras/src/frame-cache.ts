/** Share in-flight work and short-lived encoded frames across preview, broadcast and requests. */
export function createFrameCache(ttl = 1000, capacity = 32) {
  const entries = new Map<string, { time: number; pending: boolean; promise: Promise<string> }>();
  return {
    clear() { entries.clear(); },
    invalidate(matches: (key: string) => boolean) {
      for (const key of entries.keys()) if (matches(key)) entries.delete(key);
    },
    get(key: string, produce: () => Promise<string>, maxAge = ttl) {
      const existing = entries.get(key);
      if (existing && (existing.pending || Date.now() - existing.time < maxAge)) return existing.promise;
      const entry = { time: Date.now(), pending: true, promise: null as unknown as Promise<string> };
      entry.promise = Promise.resolve().then(produce).then(frame => {
        entry.pending = false;
        entry.time = Date.now();
        if (!frame && entries.get(key) === entry) entries.delete(key);
        return frame;
      }, error => {
        if (entries.get(key) === entry) entries.delete(key);
        throw error;
      });
      entries.set(key, entry);
      while (entries.size > capacity) entries.delete(entries.keys().next().value!);
      return entry.promise;
    }
  };
}
