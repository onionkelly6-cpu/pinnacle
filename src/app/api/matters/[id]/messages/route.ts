import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getMatterById } from "@/lib/demo-matters";
import { getClientByEmail } from "@/lib/demo-clients";
import { addMessage, getMessagesForMatter } from "@/lib/demo-messages";
import { MAX_MESSAGE_LENGTH } from "@/lib/message-constants";
import type { DemoMatter } from "@/lib/demo-matters";
import type { Session } from "next-auth";

type Props = {
  params: Promise<{ id: string }>;
};

const messageSchema = z.object({
  body: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
});

/**
 * Same auth + ownership check as `/api/matters/[id]/version` and
 * `/api/matters/[id]/status`: only the assigned attorney or the owning
 * client may read or post to a matter's thread.
 */
async function authorize(
  matter: DemoMatter,
  session: Session | null
): Promise<{ role: "attorney" | "client"; name: string } | null> {
  if (!session?.user) return null;

  const role = session.user.role;
  if (role === "attorney" && matter.attorney === session.user.name) {
    return { role: "attorney", name: session.user.name ?? "Unknown" };
  }
  if (role === "client" && session.user.email) {
    const client = await getClientByEmail(session.user.email);
    if (client?.id === matter.clientId) {
      return { role: "client", name: session.user.name ?? "Client" };
    }
  }
  return null;
}

export async function GET(request: NextRequest, { params }: Props) {
  const { id: matterId } = await params;
  const session = await auth();

  const matter = await getMatterById(matterId);
  if (!matter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const access = await authorize(matter, session);
  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await getMessagesForMatter(matterId);
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest, { params }: Props) {
  const { id: matterId } = await params;
  const session = await auth();

  const matter = await getMatterById(matterId);
  if (!matter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const access = await authorize(matter, session);
  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Message can't be empty" }, { status: 400 });
  }

  const message = await addMessage({
    matterId,
    senderName: access.name,
    senderRole: access.role,
    body: parsed.data.body,
  });

  return NextResponse.json({ message }, { status: 201 });
}
