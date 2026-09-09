import { redis } from "@/lib/redis";
import { bumpMatterVersion } from "@/lib/demo-matters";
import { MAX_MESSAGE_LENGTH } from "@/lib/message-constants";

/**
 * DEMO-ONLY case messages, backed by Upstash Redis — same pattern as
 * `demo-matters.ts` and `demo-documents/data.ts`. A Redis list (not a set)
 * keeps chronological order without needing a separate sort step. Replaced
 * by a real `Message` model in Milestone 2.
 */
export type MessageSenderRole = "attorney" | "client";

export interface DemoMessage {
  id: string;
  matterId: string;
  senderName: string;
  senderRole: MessageSenderRole;
  body: string;
  sentAt: string;
}

// Re-exported for existing server-side consumers that import this from
// this module. `message-constants.ts` is the source of truth so client
// components can use it without pulling in the Redis import above.
export { MAX_MESSAGE_LENGTH };

const THREAD_KEY = (matterId: string) => `messages:by-matter:${matterId}`;

export async function getMessagesForMatter(matterId: string): Promise<DemoMessage[]> {
  return redis.lrange<DemoMessage>(THREAD_KEY(matterId), 0, -1);
}

/**
 * Appends a message and bumps the matter's version counter so
 * `LiveMatterUpdates` polling picks it up the same way it already does for
 * status changes and shared documents (see `bumpMatterVersion` in
 * `demo-matters.ts`) — no separate polling loop needed for messages.
 */
export async function addMessage(params: {
  matterId: string;
  senderName: string;
  senderRole: MessageSenderRole;
  body: string;
}): Promise<DemoMessage> {
  const message: DemoMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    matterId: params.matterId,
    senderName: params.senderName,
    senderRole: params.senderRole,
    body: params.body,
    sentAt: new Date().toISOString(),
  };

  await redis.rpush(THREAD_KEY(params.matterId), message);
  await bumpMatterVersion(params.matterId);

  return message;
}
