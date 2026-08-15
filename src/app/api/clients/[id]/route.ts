import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { deleteClientAccount } from "@/lib/client-accounts";

type Props = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (session.user.role !== "attorney") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteClientAccount(id);
  return NextResponse.json({ ok: true }, { status: 200 });
}
