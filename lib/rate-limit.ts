/**
 * Rate Limiting Utility
 *
 * Implements in-memory rate limiting for API routes to prevent abuse and DoS attacks.
 * Uses a sliding window algorithm with automatic cleanup of expired entries.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry>;
  private cleanupInterval: NodeJS.Timeout | null;

  constructor() {
    this.requests = new Map();
    this.cleanupInterval = null;
    this.startCleanup();
  }

  /**
   * Start periodic cleanup of expired entries to prevent memory leaks
   */
  private startCleanup(): void {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.requests.entries()) {
        if (now >= entry.resetTime) {
          this.requests.delete(key);
        }
      }
    }, 5 * 60 * 1000);

    // Prevent the interval from keeping the process alive
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  /**
   * Check if a request should be rate limited
   *
   * @param identifier - Unique identifier (e.g., IP address)
   * @param limit - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Object containing whether the request is allowed and reset time
   */
  check(
    identifier: string,
    limit: number,
    windowMs: number
  ): { allowed: boolean; resetTime: number; remaining: number } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    // If no entry exists or the window has expired, create a new entry
    if (!entry || now >= entry.resetTime) {
      const resetTime = now + windowMs;
      this.requests.set(identifier, {
        count: 1,
        resetTime,
      });
      return {
        allowed: true,
        resetTime,
        remaining: limit - 1,
      };
    }

    // Check if limit has been exceeded
    if (entry.count >= limit) {
      return {
        allowed: false,
        resetTime: entry.resetTime,
        remaining: 0,
      };
    }

    // Increment the count
    entry.count += 1;
    this.requests.set(identifier, entry);

    return {
      allowed: true,
      resetTime: entry.resetTime,
      remaining: limit - entry.count,
    };
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Clear all rate limit entries
   */
  clearAll(): void {
    this.requests.clear();
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clearAll();
  }
}

// Create a singleton instance
const rateLimiter = new RateLimiter();

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT_CONFIG = {
  MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'),
  WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '600000'), // Default: 10 minutes in milliseconds
} as const;

/**
 * Extract IP address from request
 *
 * @param request - Next.js request object
 * @returns IP address or 'unknown' if not found
 */
export function getClientIp(request: Request): string {
  // Check various headers for the real IP address
  const headers = request.headers;

  // Common headers set by proxies and load balancers
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // Fallback to a generic identifier if IP cannot be determined
  return 'unknown';
}

/**
 * Apply rate limiting to a request
 *
 * @param request - Next.js request object
 * @returns Object containing whether the request is allowed and response headers
 */
export function applyRateLimit(request: Request): {
  allowed: boolean;
  resetTime: number;
  remaining: number;
  retryAfter: number;
} {
  const ip = getClientIp(request);
  const { allowed, resetTime, remaining } = rateLimiter.check(
    ip,
    RATE_LIMIT_CONFIG.MAX_REQUESTS,
    RATE_LIMIT_CONFIG.WINDOW_MS
  );

  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

  return {
    allowed,
    resetTime,
    remaining,
    retryAfter,
  };
}

/**
 * Reset rate limit for a specific IP (useful for testing)
 */
export function resetRateLimit(ip: string): void {
  rateLimiter.reset(ip);
}

/**
 * Clear all rate limits (useful for testing)
 */
export function clearAllRateLimits(): void {
  rateLimiter.clearAll();
}

export default rateLimiter;
