import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getMatterById, getMatterVersion } from "@/lib/demo-matters";
import { getClientByEmail } from "@/lib/demo-clients";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Polled every few seconds by `LiveMatterUpdates` instead of a persistent
 * SSE connection — see `bumpMatterVersion` in `src/lib/demo-matters.ts`
 * for why. Same auth + ownership check as the old events stream.
 */
export async function GET(request: NextRequest, { params }: Props) {
  const { id: matterId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const matter = await getMatterById(matterId);
  if (!matter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const role = session.user.role;
  const isAssignedAttorney = role === "attorney" && matter.attorney === session.user.name;
  const isOwningClient =
    role === "client" &&
    !!session.user.email &&
    getClientByEmail(session.user.email)?.id === matter.clientId;

  if (!isAssignedAttorney && !isOwningClient) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const version = await getMatterVersion(matterId);
  return NextResponse.json({ version });
}
