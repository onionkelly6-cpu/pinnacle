import { Card } from "@/components/ui/card";

export const metadata = { title: "Admin | Firm Workspace" };

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Firm Admin</h1>
        <p className="mt-2 text-muted-foreground">
          Manage attorney/staff accounts and practice areas. Wired up in
          Milestone 6, restricted to the `admin` role.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl">Attorney &amp; Staff Accounts</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Invite, deactivate, and manage roles for attorney, staff, and
            admin users.
          </p>
        </Card>
        <Card>
          <h2 className="font-display text-xl">Practice Areas</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add, rename, or retire the practice areas matters and leads are
            categorized under.
          </p>
        </Card>
      </div>
    </div>
  );
}
