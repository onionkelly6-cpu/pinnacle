import "dotenv/config";

import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  console.error(
    "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN in your .env file.",
  );
  process.exit(1);
}

const redis = Redis.fromEnv();

async function main() {
  await redis.get("healthcheck:upstash:ping");
  console.log("Upstash Redis is configured and reachable.");
}

main().catch((error) => {
  console.error("Upstash Redis check failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});