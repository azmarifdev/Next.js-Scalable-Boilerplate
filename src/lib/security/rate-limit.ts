export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

interface Entry {
  count: number;
  resetAt: number;
}

const inMemoryStore = new Map<string, Entry>();
const MAX_STORE_KEYS = 5000;

function currentWindow(now: number, windowMs: number): number {
  return now - (now % windowMs) + windowMs;
}

function pruneExpiredEntries(now: number): void {
  for (const [key, entry] of inMemoryStore.entries()) {
    if (entry.resetAt <= now) {
      inMemoryStore.delete(key);
    }
  }
}

function enforceStoreCap(): void {
  if (inMemoryStore.size <= MAX_STORE_KEYS) {
    return;
  }

  const keys = inMemoryStore.keys();
  while (inMemoryStore.size > MAX_STORE_KEYS) {
    const next = keys.next();
    if (next.done) {
      break;
    }
    inMemoryStore.delete(next.value);
  }
}

export function consumeRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  pruneExpiredEntries(now);
  enforceStoreCap();

  const resetAt = currentWindow(now, options.windowMs);
  const existing = inMemoryStore.get(key);

  if (!existing || existing.resetAt <= now) {
    inMemoryStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: Math.max(options.limit - 1, 0), resetAt };
  }

  if (existing.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  inMemoryStore.set(key, existing);
  return {
    allowed: true,
    remaining: Math.max(options.limit - existing.count, 0),
    resetAt: existing.resetAt
  };
}

export function attachRateLimitHeaders(
  response: Response,
  result: RateLimitResult,
  limit: number
): void {
  response.headers.set("x-ratelimit-limit", String(limit));
  response.headers.set("x-ratelimit-remaining", String(result.remaining));
  response.headers.set("x-ratelimit-reset", String(Math.floor(result.resetAt / 1000)));
}
