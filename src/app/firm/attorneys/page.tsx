import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listAttorneyAccounts } from "@/lib/attorney-accounts";
import { getMattersForAttorney } from "@/lib/demo-matters";
import { CreateAttorneyAccountForm } from "@/components/portal/create-attorney-account-form";
import { AttorneyAccountRow } from "@/components/portal/attorney-account-row";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export const metadata = { title: "Attorney Access | Firm Workspace" };

export default async function FirmAttorneysPage() {
  const session = await auth();

  // Belt-and-suspenders on top of proxy.ts: inviting another attorney is
  // an attorney-level action, same restriction as /firm/matters and
  // /firm/clients.
  if (session?.user?.role !== "attorney") {
    redirect("/firm/leads");
  }

  const accounts = await listAttorneyAccounts();
  const accountsWithMatterCounts = await Promise.all(
    accounts.map(async (account) => ({
      account,
      matterCount: (await getMattersForAttorney(account.name)).length,
    }))
  );

  return (
    <div>
      <h1 className="font-display text-3xl">Attorney Access</h1>
      <p className="mt-2 text-muted-foreground">
        Bring on other attorneys yourself, stored in Upstash Redis, not a
        local file or a relational database. A new attorney signs in at{" "}
        <code className="text-xs">/login</code> with the email and password
        you set here, then can self-assign to any unclaimed matter from{" "}
        <code className="text-xs">/firm/matters</code>.
      </p>

      <div className="mt-8">
        <Reveal>
          <CreateAttorneyAccountForm />
        </Reveal>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl">Existing Attorney Accounts</h2>
        <div className="mt-4">
          {accounts.length === 0 ? (
            <Card className="text-center text-muted-foreground">
              No attorney accounts created yet.
            </Card>
          ) : (
            <ul className="divide-y divide-border rounded-sm border border-border bg-card shadow-(--shadow-card)">
              {accountsWithMatterCounts.map(({ account, matterCount }) => (
                <AttorneyAccountRow
                  key={account.id}
                  id={account.id}
                  name={account.name}
                  email={account.email}
                  createdAt={new Date(account.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  matterCount={matterCount}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
