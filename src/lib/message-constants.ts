// Split out from `demo-messages.ts` so client components can read this
// limit without pulling in that module's top-level Redis import (see
// `matter-stages.ts` for the same pattern, added after the client bundle
// crash fixed in d480d85). `demo-messages.ts` re-exports this for existing
// server-side consumers.
export const MAX_MESSAGE_LENGTH = 4000;
