import { redis } from "@/lib/redis";

/**
 * DEMO-ONLY intake leads, backed by Upstash Redis — same pattern as
 * `demo-matters.ts` and `demo-messages.ts`. A Redis list (not a set) keeps
 * submission order without a separate sort step; `getAllLeads` reverses it
 * so the inbox reads newest-first. Replaced by a real `Lead` model in
 * Milestone 2.
 */
export type LeadStatus = "New" | "Contacted" | "Converted";

export interface DemoLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  practiceArea: string;
  message: string;
  status: LeadStatus;
  submittedAt: string;
  convertedMatterId?: string;
}

const LEAD_KEY = (id: string) => `lead:${id}`;
const INDEX_KEY = "leads:ids";

export async function getAllLeads(): Promise<DemoLead[]> {
  const ids = await redis.lrange<string>(INDEX_KEY, 0, -1);
  if (ids.length === 0) return [];
  const leads = await Promise.all(ids.map((id) => redis.get<DemoLead>(LEAD_KEY(id))));
  return leads.filter((lead): lead is DemoLead => lead !== null).reverse();
}

export async function getLeadById(id: string): Promise<DemoLead | undefined> {
  const lead = await redis.get<DemoLead>(LEAD_KEY(id));
  return lead ?? undefined;
}

export async function createLead(params: {
  name: string;
  email: string;
  phone: string;
  practiceArea: string;
  message: string;
}): Promise<DemoLead> {
  const lead: DemoLead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...params,
    status: "New",
    submittedAt: new Date().toISOString(),
  };

  await redis.set(LEAD_KEY(lead.id), lead);
  await redis.rpush(INDEX_KEY, lead.id);

  return lead;
}

export async function markLeadContacted(id: string): Promise<DemoLead | undefined> {
  const lead = await getLeadById(id);
  if (!lead || lead.status !== "New") return lead ?? undefined;

  const updated: DemoLead = { ...lead, status: "Contacted" };
  await redis.set(LEAD_KEY(id), updated);
  return updated;
}

export async function markLeadConverted(
  id: string,
  matterId: string
): Promise<DemoLead | undefined> {
  const lead = await getLeadById(id);
  if (!lead) return undefined;

  const updated: DemoLead = { ...lead, status: "Converted", convertedMatterId: matterId };
  await redis.set(LEAD_KEY(id), updated);
  return updated;
}
