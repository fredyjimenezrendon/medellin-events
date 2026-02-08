import { Redis } from "@upstash/redis";

function createRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.error("❌ Redis configuration missing!");
    console.error("Please configure:");
    console.error("  - UPSTASH_REDIS_REST_URL");
    console.error("  - UPSTASH_REDIS_REST_TOKEN");
    console.error("\nGet your Redis credentials from: https://console.upstash.com/");
    throw new Error("Redis configuration missing");
  }

  // Validate URL format
  if (!url.startsWith("https://")) {
    console.error("❌ Invalid UPSTASH_REDIS_REST_URL format");
    console.error(`Got: ${url.substring(0, 30)}...`);
    throw new Error("Invalid Redis URL format");
  }

  console.log("✅ Redis client configured");
  console.log(`   URL: ${url.substring(0, 40)}...`);

  return new Redis({
    url,
    token,
  });
}

export const redis = createRedisClient();
