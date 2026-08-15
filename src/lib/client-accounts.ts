import bcrypt from "bcryptjs";
import { redis } from "@/lib/redis";

/**
 * Client accounts, backed by Upstash Redis instead of a local file or an
 * in-memory array. That's a deliberate change from the original
 * `data/client-accounts.json` approach: this app can be deployed to
 * Vercel, whose serverless functions have no writable disk outside `/tmp`
 * and no memory shared across instances, so a local JSON file would
 * either crash on write or silently disagree with itself from one
 * request to the next. Upstash's REST API is plain HTTPS, so it works
 * the same from any serverless instance, and it's still not a heavyweight
 * relational database with migrations, just key/value storage.
 *
 * Created through two paths: public self-registration (`/signup`, no
 * verification) and attorney-issued creation (`/firm/clients`). Both call
 * `createClientAccount` below.
 */
export interface ClientAccount {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

const ACCOUNT_KEY = (id: string) => `client-account:${id}`;
const EMAIL_KEY = (email: string) => `client-account:email:${email.toLowerCase()}`;
const INDEX_KEY = "client-accounts:ids";

export async function listClientAccounts(): Promise<ClientAccount[]> {
  const ids = await redis.smembers(INDEX_KEY);
  if (ids.length === 0) return [];
  const accounts = await Promise.all(
    ids.map((id) => redis.get<ClientAccount>(ACCOUNT_KEY(id)))
  );
  return accounts.filter((account): account is ClientAccount => account !== null);
}

export async function getClientAccountByEmail(
  email: string
): Promise<ClientAccount | undefined> {
  const id = await redis.get<string>(EMAIL_KEY(email));
  if (!id) return undefined;
  const account = await redis.get<ClientAccount>(ACCOUNT_KEY(id));
  return account ?? undefined;
}

export async function createClientAccount(params: {
  email: string;
  password: string;
  name: string;
}): Promise<ClientAccount> {
  const existingId = await redis.get<string>(EMAIL_KEY(params.email));
  if (existingId) {
    throw new Error("An account with this email already exists.");
  }

  const account: ClientAccount = {
    id: `client-account-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    email: params.email,
    passwordHash: bcrypt.hashSync(params.password, 10),
    name: params.name,
    createdAt: new Date().toISOString(),
  };

  await redis.set(ACCOUNT_KEY(account.id), account);
  await redis.set(EMAIL_KEY(account.email), account.id);
  await redis.sadd(INDEX_KEY, account.id);

  return account;
}

export async function deleteClientAccount(id: string): Promise<void> {
  const account = await redis.get<ClientAccount>(ACCOUNT_KEY(id));
  await redis.del(ACCOUNT_KEY(id));
  await redis.srem(INDEX_KEY, id);
  if (account) {
    await redis.del(EMAIL_KEY(account.email));
  }
}
