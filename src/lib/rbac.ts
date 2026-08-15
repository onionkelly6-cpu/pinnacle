/**
 * Placeholder (Milestone 1). Real implementation lands in Milestone 3 once
 * the `User`/`Client`/`Attorney` models exist.
 *
 * The rule these functions must enforce everywhere a matter is read or
 * mutated: a role check alone is never sufficient — every access needs an
 * ownership check (client owns this matter / attorney is assigned to this
 * matter) so a client can't fetch another client's matter by guessing an id.
 */

export type Role = "client" | "attorney" | "staff" | "admin";

export async function assertRole(_userId: string, _allowed: Role[]): Promise<void> {
  throw new Error("assertRole is not implemented until Milestone 3");
}

export async function assertMatterAccess(
  _userId: string,
  _matterId: string
): Promise<void> {
  throw new Error("assertMatterAccess is not implemented until Milestone 3");
}
