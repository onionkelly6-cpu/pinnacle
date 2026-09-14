import { Redis } from "@upstash/redis";

// Vercel's Upstash-for-Redis marketplace integration names these
// KV_REST_API_URL / KV_REST_API_TOKEN (legacy Vercel KV naming) instead of
// Upstash's own UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN — accept
// either so a marketplace-connected store works without renaming vars.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

if (!redisUrl || !redisToken) {
	throw new Error(
		"Missing Upstash Redis env vars. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL / KV_REST_API_TOKEN) in .env.",
	);
}

/**
 * Shared Upstash Redis client. Upstash's REST protocol (plain HTTPS calls,
 * no persistent connection) is what makes it usable from Vercel's
 * serverless functions in the first place — a normal Redis client would
 * need a long-lived TCP connection those functions don't give you.
 *
 * This is the actual data store for this app now: client/attorney
 * accounts (`client-accounts.ts`, `attorney-accounts.ts`) and matters/
 * documents (`demo-matters.ts`, `demo-documents/data.ts`) all read and
 * write through this client instead of local disk or in-memory arrays, so
 * state survives across the many separate instances Vercel may route
 * requests to. It also backs the per-matter version counter that
 * `LiveMatterUpdates` polls instead of the old SSE/`EventEmitter` setup,
 * which only worked within a single process.
 */
export const redis = new Redis({ url: redisUrl, token: redisToken });
