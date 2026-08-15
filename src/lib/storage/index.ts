import { S3StorageProvider } from "./s3";

/**
 * Storage is accessed only through this interface so the underlying
 * provider (AWS S3, Cloudflare R2, MinIO for local dev, ...) can be swapped
 * without touching call sites. Downloads must always go through
 * `getSignedDownloadUrl` — callers should never construct or store a
 * permanent public URL.
 */
export interface StorageProvider {
  upload(params: {
    key: string;
    body: Buffer | Uint8Array;
    contentType: string;
  }): Promise<{ key: string }>;

  getSignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;

  delete(key: string): Promise<void>;
}

export const storage: StorageProvider = new S3StorageProvider();
