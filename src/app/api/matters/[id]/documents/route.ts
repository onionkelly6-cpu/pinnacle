import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import {
  addDocument,
  ALLOWED_UPLOAD_MIME_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
} from "@/lib/demo-documents";
import { getMatterById } from "@/lib/demo-matters";

type Props = {
  params: Promise<{ id: string }>;
};

function sanitizeFilename(name: string): string {
  const trimmed = name.trim().slice(0, 150);
  return trimmed.replace(/[^\w.\- ()&]/g, "_") || "document";
}

export async function POST(request: NextRequest, { params }: Props) {
  const { id: matterId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const matter = await getMatterById(matterId);
  if (!matter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Sharing a resource on a matter is the assigned attorney's action only —
  // not staff/admin, and not a client uploading to their own case.
  if (session.user.role !== "attorney" || matter.attorney !== session.user.name) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const visibilityRaw = formData.get("visibility");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_UPLOAD_MIME_TYPES[file.type]) {
    return NextResponse.json(
      { error: "Only PDF and Word documents (.pdf, .doc, .docx) are accepted" },
      { status: 400 }
    );
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File exceeds the 10 MB upload limit" },
      { status: 400 }
    );
  }

  const visibility = visibilityRaw === "client" ? "client" : "internal";

  // No file bytes are stored anywhere — see the module comment in
  // demo-documents/data.ts. Downloads of this document will serve
  // generated placeholder content instead of the real upload.
  const document = await addDocument({
    matterId,
    filename: sanitizeFilename(file.name),
    mimeType: file.type,
    visibility,
    sizeBytes: file.size,
    uploadedBy: session.user.name ?? "Unknown",
  });

  return NextResponse.json({ document }, { status: 201 });
}
