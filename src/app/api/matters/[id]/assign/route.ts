import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getMatterById, assignMatterToAttorney } from "@/lib/demo-matters";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: Props) {
  const { id: matterId } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (session.user.role !== "attorney") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const matter = await getMatterById(matterId);
  if (!matter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (matter.attorney !== null) {
    return NextResponse.json(
      { error: "This matter is already assigned to an attorney" },
      { status: 409 }
    );
  }

  const updated = await assignMatterToAttorney(matterId, session.user.name ?? "Unknown");
  return NextResponse.json({ matter: updated }, { status: 200 });
}
