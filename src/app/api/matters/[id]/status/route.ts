import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getMatterById, updateMatterStatus, MATTER_STAGES } from "@/lib/demo-matters";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: Props) {
  const { id: matterId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const matter = await getMatterById(matterId);
  if (!matter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Case tracking is the assigned attorney's action only — not staff/admin.
  if (session.user.role !== "attorney" || matter.attorney !== session.user.name) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const status = body?.status;

  if (typeof status !== "string" || !(MATTER_STAGES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const stage = status as (typeof MATTER_STAGES)[number];
  const updated = await updateMatterStatus(matterId, stage);

  return NextResponse.json({ matter: updated });
}
