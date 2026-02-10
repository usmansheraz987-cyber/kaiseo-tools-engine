const cacheStore = new Map();

const DEFAULT_TTL =
  (Number(process.env.ELIGIBILITY_CACHE_TTL) || 600) * 1000;

export function getCached(url) {
  const entry = cacheStore.get(url);

  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    cacheStore.delete(url);
    return null;
  }

  return entry.data;
}

export function setCache(url, data, ttl = DEFAULT_TTL) {
  cacheStore.set(url, {
    data,
    expiry: Date.now() + ttl
  });
}
