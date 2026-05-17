import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { logger } from "@/lib/observability/logger";

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

const globalForRedis = globalThis as unknown as {
  redisClient: Redis | null | undefined;
  ratelimitCache: Map<string, Ratelimit>;
  redisErrorCount: number;
  redisDisabledUntil: number;
};

if (!globalForRedis.ratelimitCache) {
  globalForRedis.ratelimitCache = new Map();
}

if (!globalForRedis.redisErrorCount) {
  globalForRedis.redisErrorCount = 0;
}

if (!globalForRedis.redisDisabledUntil) {
  globalForRedis.redisDisabledUntil = 0;
}

function getRedisClient(): Redis | null {
  if (globalForRedis.redisClient !== undefined) {
    return globalForRedis.redisClient;
  }

  const hasUpstashConfig = Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() && process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );

  if (!hasUpstashConfig && process.env.NODE_ENV === "production") {
    throw new Error("Upstash Redis config is required in production for rate limiting.");
  }

  globalForRedis.redisClient = hasUpstashConfig ? Redis.fromEnv() : null;
  return globalForRedis.redisClient;
}

function getUpstashRatelimit(redis: Redis, limit: number, windowMs: number): Ratelimit {
  const cacheKey = `${limit}:${windowMs}`;
  let ratelimit = globalForRedis.ratelimitCache.get(cacheKey);

  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      analytics: true
    });
    globalForRedis.ratelimitCache.set(cacheKey, ratelimit);
  }

  return ratelimit;
}

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

function consumeInMemoryRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
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

async function consumeRedisRateLimit(
  redis: Redis,
  key: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const ratelimit = getUpstashRatelimit(redis, options.limit, options.windowMs);
  const { success, remaining, reset } = await ratelimit.limit(`rate-limit:${key}`);

  return {
    allowed: success,
    remaining,
    resetAt: reset
  };
}

export async function consumeRateLimit(
  key: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const now = Date.now();
  if (globalForRedis.redisDisabledUntil > now) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Redis rate limit temporarily disabled after repeated failures.");
    }
    return consumeInMemoryRateLimit(key, options);
  }

  const redis = getRedisClient();
  if (!redis) {
    return consumeInMemoryRateLimit(key, options);
  }

  try {
    const result = await consumeRedisRateLimit(redis, key, options);
    globalForRedis.redisErrorCount = 0;
    return result;
  } catch (error) {
    logger.warn("rate-limit:redis_failed", {
      error: error instanceof Error ? error.message : "Unknown Redis error"
    });
    globalForRedis.redisErrorCount += 1;
    if (globalForRedis.redisErrorCount >= 3) {
      globalForRedis.redisDisabledUntil = Date.now() + 30_000;
      globalForRedis.redisErrorCount = 0;
    }
    if (process.env.NODE_ENV === "production") {
      throw error instanceof Error ? error : new Error("Redis rate limit failed.");
    }
    return consumeInMemoryRateLimit(key, options);
  }
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
