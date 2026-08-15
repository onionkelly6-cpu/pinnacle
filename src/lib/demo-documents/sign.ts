import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Short-lived signed download tokens for demo documents. Real object
 * storage (Milestone 6) will use provider-native presigned URLs via
 * `src/lib/storage` instead — this exists so local demo files follow the
 * same "never a permanent public link" rule in the meantime.
 */
function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET must be set to sign document download tokens");
  }
  return secret;
}

function hmac(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function signDocumentToken(documentId: string, expiresInSeconds = 300): string {
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  const signature = hmac(`${documentId}.${expiresAt}`);
  return `${expiresAt}.${signature}`;
}

export function verifyDocumentToken(documentId: string, token: string): boolean {
  const [expiresAtRaw, signature] = token.split(".");
  if (!expiresAtRaw || !signature) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const expected = hmac(`${documentId}.${expiresAt}`);
  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== actualBuf.length) return false;

  return timingSafeEqual(expectedBuf, actualBuf);
}
