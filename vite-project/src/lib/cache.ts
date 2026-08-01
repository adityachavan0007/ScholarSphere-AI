interface CacheEntry {
  data: any;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();

export const getFromCache = (key: string, ttlSeconds: number = 300) => {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttlSeconds * 1000) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data;
};

export const setInCache = (key: string, data: any) => {
  memoryCache.set(key, { data, timestamp: Date.now() });
};
