import { NextResponse, type NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { auth } from "@/lib/auth";
import { getDocumentById, verifyDocumentToken } from "@/lib/demo-documents";
import { getMatterById } from "@/lib/demo-matters";
import { getClientByEmail } from "@/lib/demo-clients";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const token = request.nextUrl.searchParams.get("token");
  if (!token || !verifyDocumentToken(id, token)) {
    return NextResponse.json(
      { error: "Invalid or expired download link" },
      { status: 403 }
    );
  }

  const doc = await getDocumentById(id);
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const matter = await getMatterById(doc.matterId);
  if (!matter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Case data is attorney + client only now — staff/admin lost access to
  // matters/documents entirely, not just this download. A client may only
  // download their own matter's client-visible documents; an attorney may
  // only download documents on matters assigned to them.
  const role = session.user.role;
  const isAssignedAttorney = role === "attorney" && matter.attorney === session.user.name;
  const isOwningClient =
    role === "client" &&
    !!session.user.email &&
    getClientByEmail(session.user.email)?.id === matter.clientId &&
    doc.visibility === "client";

  if (!isAssignedAttorney && !isOwningClient) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (doc.isPlaceholder) {
    // Nothing was ever written to disk for this document — see the module
    // comment in demo-documents/data.ts. Generate stand-in content on the
    // fly instead of reading a file that doesn't exist.
    const placeholderText =
      `This is placeholder content for "${doc.filename}".\n\n` +
      "Fairmont Law Agency's current build doesn't persist real uploaded " +
      "files (no object storage is wired up yet, see Milestone 6) — " +
      "only the filename, uploader, and visibility you set are real.\n";

    return new NextResponse(placeholderText, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${doc.filename}.placeholder.txt"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  const filePath = path.join(process.cwd(), "data", "demo-documents", doc.storedAs);
  const fileBuffer = await readFile(filePath);

  return new NextResponse(new Uint8Array(fileBuffer), {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Disposition": `attachment; filename="${doc.filename}"`,
      "Content-Length": String(fileBuffer.length),
      "Cache-Control": "private, no-store",
    },
  });
}
