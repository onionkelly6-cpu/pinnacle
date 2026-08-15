import { redis } from "@/lib/redis";
import { bumpMatterVersion } from "@/lib/demo-matters";

/**
 * DEMO-ONLY document metadata, backed by Upstash Redis instead of an
 * in-memory array. The four seed documents still reference real files
 * committed under `data/demo-documents/` (read-only static assets are
 * fine to ship inside the deployed bundle, even on Vercel) — but anything
 * uploaded through the app (`addDocument`) is a placeholder: no file
 * bytes are written anywhere. Vercel's serverless functions have no
 * writable disk outside `/tmp`, so persisting a real uploaded file isn't
 * an option without real object storage (`src/lib/storage`, Milestone 6).
 * The upload/download flow still works end to end, it just serves
 * generated placeholder content for anything that wasn't seeded.
 */
export type DemoDocumentVisibility = "internal" | "client";

// Upload is scoped to PDF and Word documents only, per the intake
// requirement — images/other types can still be seeded as demo data but
// aren't accepted through the upload endpoint.
export const ALLOWED_UPLOAD_MIME_TYPES: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export interface DemoDocument {
  id: string;
  matterId: string;
  filename: string;
  // Only meaningful when `isPlaceholder` is false: the filename under
  // `data/demo-documents/` this seed document's real bytes live at.
  storedAs: string;
  mimeType: string;
  visibility: DemoDocumentVisibility;
  sizeLabel: string;
  uploadedBy: string;
  uploadedAt: string;
  // true for anything uploaded through the app — no real file was ever
  // written, downloads serve generated placeholder content instead.
  isPlaceholder: boolean;
}

const DOCUMENT_KEY = (id: string) => `document:${id}`;
const MATTER_INDEX_KEY = (matterId: string) => `documents:by-matter:${matterId}`;
const ALL_INDEX_KEY = "documents:ids";

const seedDocuments: DemoDocument[] = [
  {
    id: "doc-1",
    matterId: "1",
    filename: "Engagement Letter.docx",
    storedAs: "engagement-letter.docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    visibility: "client",
    sizeLabel: "2.3 KB",
    uploadedBy: "Richard Worsfold",
    uploadedAt: "Jul 2, 2026",
    isPlaceholder: false,
  },
  {
    id: "doc-2",
    matterId: "1",
    filename: "Attorney Case Notes.pdf",
    storedAs: "case-notes.pdf",
    mimeType: "application/pdf",
    visibility: "internal",
    sizeLabel: "1.0 KB",
    uploadedBy: "Richard Worsfold",
    uploadedAt: "Jul 15, 2026",
    isPlaceholder: false,
  },
  {
    id: "doc-3",
    matterId: "3",
    filename: "Property Photo.png",
    storedAs: "property-photo.png",
    mimeType: "image/png",
    visibility: "client",
    sizeLabel: "1.6 KB",
    uploadedBy: "Richard Worsfold",
    uploadedAt: "Jul 10, 2026",
    isPlaceholder: false,
  },
  {
    id: "doc-4",
    matterId: "4",
    filename: "Arrest Report.pdf",
    storedAs: "case-notes.pdf",
    mimeType: "application/pdf",
    visibility: "internal",
    sizeLabel: "1.0 KB",
    uploadedBy: "Richard Worsfold",
    uploadedAt: "Jul 18, 2026",
    isPlaceholder: false,
  },
];

async function ensureSeeded(): Promise<void> {
  const count = await redis.scard(ALL_INDEX_KEY);
  if (count > 0) return;

  await Promise.all(seedDocuments.map((doc) => redis.set(DOCUMENT_KEY(doc.id), doc)));
  await redis.sadd(ALL_INDEX_KEY, seedDocuments[0].id, ...seedDocuments.slice(1).map((d) => d.id));

  const idsByMatter = new Map<string, string[]>();
  for (const doc of seedDocuments) {
    const ids = idsByMatter.get(doc.matterId) ?? [];
    ids.push(doc.id);
    idsByMatter.set(doc.matterId, ids);
  }
  await Promise.all(
    Array.from(idsByMatter.entries()).map(([matterId, ids]) =>
      redis.sadd(MATTER_INDEX_KEY(matterId), ids[0], ...ids.slice(1))
    )
  );
}

export async function getDocumentsForMatter(matterId: string): Promise<DemoDocument[]> {
  await ensureSeeded();
  const ids = await redis.smembers(MATTER_INDEX_KEY(matterId));
  if (ids.length === 0) return [];
  const docs = await Promise.all(ids.map((id) => redis.get<DemoDocument>(DOCUMENT_KEY(id))));
  return docs.filter((doc): doc is DemoDocument => doc !== null);
}

export async function getDocumentById(id: string): Promise<DemoDocument | undefined> {
  await ensureSeeded();
  const doc = await redis.get<DemoDocument>(DOCUMENT_KEY(id));
  return doc ?? undefined;
}

function formatSizeLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Records a newly "uploaded" document. No file bytes are stored anywhere
 * — see the module comment above — just the metadata needed to render it
 * in the document list and generate a placeholder on download. Also
 * bumps the matter's version counter so `LiveMatterUpdates` polling
 * picks up the change (see `bumpMatterVersion` in demo-matters.ts).
 */
export async function addDocument(params: {
  matterId: string;
  filename: string;
  mimeType: string;
  visibility: DemoDocumentVisibility;
  sizeBytes: number;
  uploadedBy: string;
}): Promise<DemoDocument> {
  const doc: DemoDocument = {
    id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    matterId: params.matterId,
    filename: params.filename,
    storedAs: "",
    mimeType: params.mimeType,
    visibility: params.visibility,
    sizeLabel: formatSizeLabel(params.sizeBytes),
    uploadedBy: params.uploadedBy,
    uploadedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    isPlaceholder: true,
  };

  await redis.set(DOCUMENT_KEY(doc.id), doc);
  await redis.sadd(ALL_INDEX_KEY, doc.id);
  await redis.sadd(MATTER_INDEX_KEY(doc.matterId), doc.id);
  await bumpMatterVersion(doc.matterId);

  return doc;
}
