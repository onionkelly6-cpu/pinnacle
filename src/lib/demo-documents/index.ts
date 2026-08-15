import { signDocumentToken } from "./sign";

export {
  getDocumentsForMatter,
  getDocumentById,
  addDocument,
  ALLOWED_UPLOAD_MIME_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
} from "./data";
export type { DemoDocument, DemoDocumentVisibility } from "./data";
export { verifyDocumentToken } from "./sign";

export function getSignedDownloadHref(documentId: string, expiresInSeconds = 300): string {
  const token = signDocumentToken(documentId, expiresInSeconds);
  return `/api/documents/${documentId}/download?token=${encodeURIComponent(token)}`;
}
