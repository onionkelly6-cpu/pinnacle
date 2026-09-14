import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getClientAccountById } from "@/lib/client-accounts";
import { createClient } from "@/lib/demo-clients";
import { createMatter, generateCaseNumber } from "@/lib/demo-matters";
import { practiceAreas } from "@/lib/content/practice-areas";

type Props = {
  params: Promise<{ id: string }>;
};

const createSchema = z.object({
  title: z.string().trim().min(1, "Case title is required"),
  practiceArea: z.string().trim().min(1, "Practice area is required"),
});

/**
 * Lets an attorney open a matter directly for a client who already has
 * portal access, without routing them through a Lead first. Mirrors
 * `/api/leads/[id]/convert`: creates (or reuses, by email) the underlying
 * `DemoClient` record and assigns the new matter straight to the creating
 * attorney.
 */
export async function POST(request: NextRequest, { params }: Props) {
  const { id: clientAccountId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (session.user.role !== "attorney") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const account = await getClientAccountById(clientAccountId);
  if (!account) {
    return NextResponse.json({ error: "Client account not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const areaMeta = practiceAreas.find((area) => area.slug === parsed.data.practiceArea);

  const client = await createClient({ name: account.name, email: account.email });
  const matter = await createMatter({
    caseNumber: generateCaseNumber(areaMeta?.code ?? "GN"),
    title: parsed.data.title,
    practiceArea: areaMeta?.name ?? parsed.data.practiceArea,
    clientId: client.id,
    attorney: session.user.name ?? "Unknown",
  });

  return NextResponse.json({ matter }, { status: 201 });
}
