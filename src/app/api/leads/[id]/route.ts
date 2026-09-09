import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getLeadById, markLeadContacted } from "@/lib/demo-leads";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Triage only — any signed-in firm role (attorney/staff/admin) can mark a
 * lead contacted, matching the roadmap split where leads/account admin
 * stay open to staff while case data (matters, documents) is attorney-only.
 * Converting to a matter is a separate, attorney-only endpoint (see
 * `[id]/convert/route.ts`).
 */
export async function PATCH(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (session.user.role === "client") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (body?.status !== "Contacted") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const lead = await getLeadById(id);
  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (lead.status !== "New") {
    return NextResponse.json({ error: "Lead is not in New status" }, { status: 409 });
  }

  const updated = await markLeadContacted(id);
  return NextResponse.json({ lead: updated });
}
