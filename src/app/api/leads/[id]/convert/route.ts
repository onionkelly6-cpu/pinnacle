import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getLeadById, markLeadConverted } from "@/lib/demo-leads";
import { createClient } from "@/lib/demo-clients";
import { createMatter, generateCaseNumber } from "@/lib/demo-matters";
import { practiceAreas } from "@/lib/content/practice-areas";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Converting a lead creates the client record and case in one step — the
 * matter is assigned straight to the converting attorney (they're the one
 * who reviewed the lead and chose to take it on), same as everywhere else
 * matters/clients are attorney-gated (`/firm/matters`, `/firm/clients`).
 * This only creates the `DemoClient` record so the matter has someone to
 * point at; granting the client an actual portal login is still the
 * separate, deliberate step at `/firm/clients`.
 */
export async function POST(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (session.user.role !== "attorney") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const lead = await getLeadById(id);
  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (lead.status === "Converted") {
    return NextResponse.json({ error: "Lead has already been converted" }, { status: 409 });
  }

  const areaMeta = practiceAreas.find((area) => area.slug === lead.practiceArea);

  const client = await createClient({ name: lead.name, email: lead.email });
  const matter = await createMatter({
    caseNumber: generateCaseNumber(areaMeta?.code ?? "GN"),
    title: `${areaMeta?.name ?? "New Matter"} — ${lead.name}`,
    practiceArea: areaMeta?.name ?? lead.practiceArea,
    clientId: client.id,
    attorney: session.user.name ?? "Unknown",
  });
  await markLeadConverted(id, matter.id);

  return NextResponse.json({ matter }, { status: 201 });
}
