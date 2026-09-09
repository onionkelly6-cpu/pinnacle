import { redis } from "@/lib/redis";
import { MATTER_STAGES, type MatterStage } from "@/lib/matter-stages";

/**
 * DEMO-ONLY matter records, backed by Upstash Redis instead of a local
 * in-memory array. The array + `globalThis` pinning approach this used to
 * use only survives within a single Node process; Vercel's serverless
 * functions don't guarantee that a self-assign or status update lands on
 * the same instance as the next page load that reads it. Redis (reachable
 * over plain HTTPS from any instance) is what makes that consistent.
 * Replaced by a real `Matter` model in Milestone 2.
 */
// Re-exported for existing server-side consumers that import these from
// this module. `matter-stages.ts` is the source of truth so client
// components can use them without pulling in the Redis import above.
export { MATTER_STAGES, type MatterStage };

export interface DemoMatter {
  id: string;
  caseNumber: string;
  title: string;
  status: MatterStage;
  nextDate?: string;
  // `null` = not yet claimed by an attorney. Any signed-in attorney can
  // self-assign to one of these (see `assignMatterToAttorney`) — this is
  // the "attorney picks a client themselves" workflow.
  attorney: string | null;
  practiceArea: string;
  clientId: string;
}

const MATTER_KEY = (id: string) => `matter:${id}`;
const INDEX_KEY = "matters:ids";
const VERSION_KEY = (id: string) => `matter:${id}:version`;

const seedMatters: DemoMatter[] = [
  {
    id: "1",
    caseNumber: "FL-2026-00182",
    title: "Dissolution of Marriage",
    status: "Discovery",
    nextDate: "Aug 14, 2026",
    attorney: "Richard Worsfold",
    practiceArea: "Family Law",
    clientId: "client-2",
  },
  {
    id: "2",
    caseNumber: "RE-2025-00937",
    title: "Purchase Agreement Review — 214 Birch St.",
    status: "Resolved",
    attorney: "Richard Worsfold",
    practiceArea: "Real Estate",
    clientId: "client-3",
  },
  {
    id: "3",
    caseNumber: "EP-2026-00041",
    title: "Revocable Living Trust",
    status: "Filed",
    nextDate: "Aug 3, 2026",
    attorney: "Richard Worsfold",
    practiceArea: "Estate Planning",
    clientId: "client-1",
  },
  {
    id: "4",
    caseNumber: "CD-2026-00019",
    title: "R v Placeholder",
    status: "Hearing Scheduled",
    nextDate: "Jul 30, 2026",
    attorney: "Richard Worsfold",
    practiceArea: "Criminal Defense",
    clientId: "client-4",
  },
  {
    id: "5",
    caseNumber: "BC-2026-00204",
    title: "LLC Formation & Operating Agreement",
    status: "Filed",
    attorney: null,
    practiceArea: "Business & Corporate",
    clientId: "client-5",
  },
  {
    id: "6",
    caseNumber: "IM-2026-00077",
    title: "H-1B Petition",
    status: "Filed",
    nextDate: "Aug 20, 2026",
    attorney: null,
    practiceArea: "Immigration Law",
    clientId: "client-6",
  },
];

/**
 * Seeds the six demo matters into Redis the first time anything reads
 * them (empty index = never seeded on this database). Safe to call from
 * every read: cheap no-op once seeded, and harmless if two cold starts
 * race to seed at once since it writes the same fixed data either way.
 */
async function ensureSeeded(): Promise<void> {
  const count = await redis.scard(INDEX_KEY);
  if (count > 0) return;

  await Promise.all(seedMatters.map((matter) => redis.set(MATTER_KEY(matter.id), matter)));
  await redis.sadd(INDEX_KEY, seedMatters[0].id, ...seedMatters.slice(1).map((m) => m.id));
}

async function getAllMatters(): Promise<DemoMatter[]> {
  await ensureSeeded();
  const ids = await redis.smembers(INDEX_KEY);
  if (ids.length === 0) return [];
  const matters = await Promise.all(ids.map((id) => redis.get<DemoMatter>(MATTER_KEY(id))));
  return matters.filter((matter): matter is DemoMatter => matter !== null);
}

export async function getMatterById(id: string): Promise<DemoMatter | undefined> {
  await ensureSeeded();
  const matter = await redis.get<DemoMatter>(MATTER_KEY(id));
  return matter ?? undefined;
}

/**
 * A per-matter counter, bumped by every mutation below (and by
 * `addDocument` in `demo-documents/data.ts`). `LiveMatterUpdates` polls
 * `getMatterVersion` every few seconds and only refreshes the page when
 * it changes — this is what "live" case tracking is built on now instead
 * of a persistent SSE connection, specifically because Vercel's
 * serverless functions can't hold one open indefinitely and don't share
 * the in-memory pub/sub that used to back it (see SECURITY.md).
 */
export async function getMatterVersion(id: string): Promise<number> {
  const version = await redis.get<number>(VERSION_KEY(id));
  return version ?? 0;
}

export async function bumpMatterVersion(id: string): Promise<number> {
  return redis.incr(VERSION_KEY(id));
}

export async function getMattersForAttorney(attorneyName: string): Promise<DemoMatter[]> {
  const matters = await getAllMatters();
  return matters.filter((m) => m.attorney === attorneyName);
}

export async function getMattersForClient(clientId: string): Promise<DemoMatter[]> {
  const matters = await getAllMatters();
  return matters.filter((m) => m.clientId === clientId);
}

export async function getUnassignedMatters(): Promise<DemoMatter[]> {
  const matters = await getAllMatters();
  return matters.filter((m) => m.attorney === null);
}

export async function updateMatterStatus(
  id: string,
  status: MatterStage
): Promise<DemoMatter | undefined> {
  const matter = await getMatterById(id);
  if (matter) {
    matter.status = status;
    await redis.set(MATTER_KEY(id), matter);
    await bumpMatterVersion(id);
  }
  return matter;
}

/**
 * The attorney self-assignment action: claims an unassigned matter. Only
 * works while `attorney` is still `null` — this isn't a general
 * "reassign any matter to anyone" tool (that's real admin territory and
 * needs an audit trail this demo doesn't have), just "pick up a new
 * client that isn't anyone's yet."
 */
export async function assignMatterToAttorney(
  id: string,
  attorneyName: string
): Promise<DemoMatter | undefined> {
  const matter = await getMatterById(id);
  if (matter && matter.attorney === null) {
    matter.attorney = attorneyName;
    await redis.set(MATTER_KEY(id), matter);
    await bumpMatterVersion(id);
  }
  return matter;
}
