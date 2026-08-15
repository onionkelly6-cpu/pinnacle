/**
 * DEMO-ONLY client records, not backed by a database — same pattern as
 * `demo-accounts.ts` and `demo-documents/`. Only `client-1` has a matching
 * login in `demo-accounts.ts` (Jordan Alvarez); the others exist so the
 * attorney-side client list/picker has realistic breadth even though only
 * one client account can actually sign in right now. Replaced by a real
 * `Client` model in Milestone 5.
 */
export interface DemoClient {
  id: string;
  name: string;
  email: string;
}

export const DEMO_CLIENTS: DemoClient[] = [
  { id: "client-1", name: "Jordan Alvarez", email: "client@demo.fairmontlawagency.example" },
  { id: "client-2", name: "Morgan Reyes", email: "morgan.reyes@example.com" },
  { id: "client-3", name: "Sam Okafor", email: "sam.okafor@example.com" },
  { id: "client-4", name: "Alex Rivera", email: "alex.rivera@example.com" },
  { id: "client-5", name: "Casey Fumero", email: "casey.fumero@example.com" },
  { id: "client-6", name: "Priya Chandrasekaran", email: "priya.chandra@example.com" },
];

export function getClientById(id: string): DemoClient | undefined {
  return DEMO_CLIENTS.find((c) => c.id === id);
}

export function getClientByEmail(email: string): DemoClient | undefined {
  return DEMO_CLIENTS.find((c) => c.email === email);
}
