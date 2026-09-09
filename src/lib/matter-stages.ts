// Split out from `demo-matters.ts` so client components can read the
// stage list/type without pulling in that module's top-level Redis import.
// `demo-matters.ts` re-exports these for existing server-side consumers.
export const MATTER_STAGES = ["Filed", "Discovery", "Hearing Scheduled", "Resolved"] as const;
export type MatterStage = (typeof MATTER_STAGES)[number];
