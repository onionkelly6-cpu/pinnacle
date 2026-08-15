import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listClientAccounts } from "@/lib/client-accounts";
import { getClientByEmail } from "@/lib/demo-clients";
import { getMattersForClient } from "@/lib/demo-matters";
import { CreateClientAccountForm } from "@/components/portal/create-client-account-form";
import { ClientAccountRow } from "@/components/portal/client-account-row";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export const metadata = { title: "Client Access | Firm Workspace" };

export default async function FirmClientsPage() {
  const session = await auth();

  // Belt-and-suspenders on top of proxy.ts: this page grants portal
  // access, so it's attorney-only just like /firm/matters.
  if (session?.user?.role !== "attorney") {
    redirect("/firm/leads");
  }

  const accounts = await listClientAccounts();
  const accountsWithMatterInfo = await Promise.all(
    accounts.map(async (account) => {
      const linkedClient = getClientByEmail(account.email);
      const hasMatters = linkedClient
        ? (await getMattersForClient(linkedClient.id)).length > 0
        : false;
      return { account, hasMatters };
    })
  );

  return (
    <div>
      <h1 className="font-display text-3xl">Client Access</h1>
      <p className="mt-2 text-muted-foreground">
        Create portal logins for clients yourself, stored in Upstash Redis,
        not a local file or a relational database. A client can sign in
        with the email and password you set here right away.
      </p>

      <div className="mt-8">
        <Reveal>
          <CreateClientAccountForm />
        </Reveal>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl">Existing Client Accounts</h2>
        <div className="mt-4">
          {accounts.length === 0 ? (
            <Card className="text-center text-muted-foreground">
              No client accounts created yet.
            </Card>
          ) : (
            <ul className="divide-y divide-border rounded-sm border border-border bg-card shadow-(--shadow-card)">
              {accountsWithMatterInfo.map(({ account, hasMatters }) => (
                <ClientAccountRow
                  key={account.id}
                  id={account.id}
                  name={account.name}
                  email={account.email}
                  createdAt={new Date(account.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  hasMatters={hasMatters}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
