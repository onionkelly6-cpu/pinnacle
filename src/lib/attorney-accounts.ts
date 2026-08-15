import bcrypt from "bcryptjs";
import { redis } from "@/lib/redis";

/**
 * Attorney accounts, backed by Upstash Redis, same reasoning and same
 * shape as `client-accounts.ts` (see that file for why: Vercel's
 * serverless functions have no writable disk outside `/tmp` and no shared
 * memory across instances, so this can't be a local JSON file anymore).
 *
 * Unlike client signup (public, self-service, see `/signup`), attorney
 * accounts are invite-only: only an already-signed-in attorney can create
 * one (`/firm/attorneys`), matching "attorneys have full admin access to
 * bring on other attorneys" rather than open registration for firm staff.
 */
export interface AttorneyAccount {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

const ACCOUNT_KEY = (id: string) => `attorney-account:${id}`;
const EMAIL_KEY = (email: string) => `attorney-account:email:${email.toLowerCase()}`;
const INDEX_KEY = "attorney-accounts:ids";

export async function listAttorneyAccounts(): Promise<AttorneyAccount[]> {
  const ids = await redis.smembers(INDEX_KEY);
  if (ids.length === 0) return [];
  const accounts = await Promise.all(
    ids.map((id) => redis.get<AttorneyAccount>(ACCOUNT_KEY(id)))
  );
  return accounts.filter((account): account is AttorneyAccount => account !== null);
}

export async function getAttorneyAccountByEmail(
  email: string
): Promise<AttorneyAccount | undefined> {
  const id = await redis.get<string>(EMAIL_KEY(email));
  if (!id) return undefined;
  const account = await redis.get<AttorneyAccount>(ACCOUNT_KEY(id));
  return account ?? undefined;
}

export async function createAttorneyAccount(params: {
  email: string;
  password: string;
  name: string;
}): Promise<AttorneyAccount> {
  const existingId = await redis.get<string>(EMAIL_KEY(params.email));
  if (existingId) {
    throw new Error("An account with this email already exists.");
  }

  const account: AttorneyAccount = {
    id: `attorney-account-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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

export async function deleteAttorneyAccount(id: string): Promise<void> {
  const account = await redis.get<AttorneyAccount>(ACCOUNT_KEY(id));
  await redis.del(ACCOUNT_KEY(id));
  await redis.srem(INDEX_KEY, id);
  if (account) {
    await redis.del(EMAIL_KEY(account.email));
  }
}
