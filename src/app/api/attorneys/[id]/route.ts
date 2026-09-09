import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { deleteAttorneyAccount, getAttorneyAccountById } from "@/lib/attorney-accounts";
import { unassignMattersForAttorney } from "@/lib/demo-matters";

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

  // Revoking the login doesn't touch matters that name self-assigned to —
  // release them back to the unclaimed pool first, or they'd be stuck
  // pointing at a login that no longer exists (see `unassignMattersForAttorney`).
  const account = await getAttorneyAccountById(id);
  await deleteAttorneyAccount(id);
  if (account) {
    await unassignMattersForAttorney(account.name);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
