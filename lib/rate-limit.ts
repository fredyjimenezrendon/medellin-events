import { redis } from "./redis";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

export async function rateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 900 // 15 minutes
): Promise<RateLimitResult> {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  try {
    // Add current request
    await redis.zadd(key, { score: now, member: `${now}` });

    // Remove old entries outside the window
    await redis.zremrangebyscore(key, 0, windowStart);

    // Set expiry on the key
    await redis.expire(key, windowSeconds);

    // Count requests in current window
    const count = await redis.zcount(key, windowStart, now);

    const remaining = Math.max(0, limit - count);
    const resetTime = now + windowSeconds * 1000;

    return {
      success: count <= limit,
      remaining,
      resetTime,
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    // On error, allow the request but log it
    return {
      success: true,
      remaining: limit,
      resetTime: now + windowSeconds * 1000,
    };
  }
}
