/**
 * DEMO-ONLY credentials, not backed by a database. This exists so the
 * portal/firm workspace can be clicked through end to end before
 * Milestone 2 (real Prisma models) and Milestone 3 (real bcrypt+DB auth)
 * land. `src/lib/auth.ts` hashes these at module load and checks against
 * them; this same list drives the quick-fill buttons on the login page.
 * Replace entirely once real user accounts exist.
 */
export const DEMO_ACCOUNTS = [
  {
    id: "demo-client-1",
    email: "client@demo.pinnaclelegal.example",
    password: "ClientDemo123!",
    name: "Jordan Alvarez",
    role: "client" as const,
  },
  {
    id: "demo-attorney-1",
    email: "attorney@demo.pinnaclelegal.example",
    password: "AttorneyDemo123!",
    name: "Richard Worsfold",
    role: "attorney" as const,
  },
  {
    id: "demo-staff-1",
    email: "staff@demo.pinnaclelegal.example",
    password: "StaffDemo123!",
    name: "Demo Staff",
    role: "staff" as const,
  },
  {
    id: "demo-admin-1",
    email: "admin@demo.pinnaclelegal.example",
    password: "AdminDemo123!",
    name: "Demo Admin",
    role: "admin" as const,
  },
] as const;

export type DemoRole = (typeof DEMO_ACCOUNTS)[number]["role"];
