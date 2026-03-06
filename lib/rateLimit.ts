/**
 * Simple in-memory rate limiter
 * Prevents spam without external services
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitStore {
  [key: string]: RateLimitEntry;
}

const store: RateLimitStore = {};

// Cleanup old entries every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const key in store) {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    }
  }, 5 * 60 * 1000);
}

export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; resetTime?: number } {
  const now = Date.now();
  const key = identifier;

  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { success: true };
  }

  if (store[key].count >= limit) {
    return {
      success: false,
      resetTime: store[key].resetTime,
    };
  }

  store[key].count++;
  return { success: true };
}

export function getRateLimitInfo(identifier: string): {
  limit: number;
  remaining: number;
  resetAt: number;
} {
  const entry = store[identifier];
  if (!entry) {
    return {
      limit: 5,
      remaining: 5,
      resetAt: Date.now() + 60000,
    };
  }

  return {
    limit: 5,
    remaining: Math.max(0, 5 - entry.count),
    resetAt: entry.resetTime,
  };
}
