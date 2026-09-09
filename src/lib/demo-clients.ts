import { redis } from "@/lib/redis";

/**
 * DEMO-ONLY client records, backed by Upstash Redis instead of a static
 * array — same pattern as `demo-matters.ts`. Originally a fixed, read-only
 * list; made mutable so Lead → Convert to Matter (`/firm/leads`) can create
 * a real client record instead of only being able to reference the six
 * seeded ones. Replaced by a real `Client` model in Milestone 5.
 */
export interface DemoClient {
  id: string;
  name: string;
  email: string;
}

const CLIENT_KEY = (id: string) => `client:${id}`;
const EMAIL_KEY = (email: string) => `client:email:${email.toLowerCase()}`;
const INDEX_KEY = "clients:ids";

const seedClients: DemoClient[] = [
  { id: "client-1", name: "Jordan Alvarez", email: "client@demo.fairmontlawagency.example" },
  { id: "client-2", name: "Morgan Reyes", email: "morgan.reyes@example.com" },
  { id: "client-3", name: "Sam Okafor", email: "sam.okafor@example.com" },
  { id: "client-4", name: "Alex Rivera", email: "alex.rivera@example.com" },
  { id: "client-5", name: "Casey Fumero", email: "casey.fumero@example.com" },
  { id: "client-6", name: "Priya Chandrasekaran", email: "priya.chandra@example.com" },
];

async function ensureSeeded(): Promise<void> {
  const count = await redis.scard(INDEX_KEY);
  if (count > 0) return;

  await Promise.all(seedClients.map((client) => redis.set(CLIENT_KEY(client.id), client)));
  await Promise.all(seedClients.map((client) => redis.set(EMAIL_KEY(client.email), client.id)));
  await redis.sadd(INDEX_KEY, seedClients[0].id, ...seedClients.slice(1).map((c) => c.id));
}

export async function getClientById(id: string): Promise<DemoClient | undefined> {
  await ensureSeeded();
  const client = await redis.get<DemoClient>(CLIENT_KEY(id));
  return client ?? undefined;
}

export async function getClientByEmail(email: string): Promise<DemoClient | undefined> {
  await ensureSeeded();
  const id = await redis.get<string>(EMAIL_KEY(email));
  if (!id) return undefined;
  return getClientById(id);
}

/**
 * Creates a client record, or returns the existing one if the email
 * already matches one — a lead converting to a matter may well be a
 * returning client, and this keeps `getClientByEmail` a stable 1:1 lookup
 * instead of accumulating duplicate records for the same email.
 */
export async function createClient(params: { name: string; email: string }): Promise<DemoClient> {
  const existing = await getClientByEmail(params.email);
  if (existing) return existing;

  const client: DemoClient = {
    id: `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: params.name,
    email: params.email,
  };

  await redis.set(CLIENT_KEY(client.id), client);
  await redis.set(EMAIL_KEY(client.email), client.id);
  await redis.sadd(INDEX_KEY, client.id);

  return client;
}
