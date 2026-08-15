import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

// Wired into the sign-in/magic-link routes in Milestone 3.
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "ratelimit:auth",
});

// Wired into the public intake form in Milestone 7.
export const intakeRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "60 s"),
  prefix: "ratelimit:intake",
});
