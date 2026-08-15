import { DocketBoard, type DocketRow } from "@/components/portal/docket-board";
import { AssignClientCard } from "@/components/portal/assign-client-card";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { auth } from "@/lib/auth";
import { MATTER_STAGES, getMattersForAttorney, getUnassignedMatters } from "@/lib/demo-matters";
import { getClientById } from "@/lib/demo-clients";

export const metadata = { title: "Matters | Firm Workspace" };

export default async function FirmMattersPage() {
  const session = await auth();
  const matters = await getMattersForAttorney(session?.user?.name ?? "");
  const unassigned = await getUnassignedMatters();

  const rows: DocketRow[] = matters.map((matter) => ({
    id: matter.id,
    caseNumber: matter.caseNumber,
    matter: matter.title,
    status: matter.status,
    nextDate: matter.nextDate,
    practiceArea: matter.practiceArea,
    client: getClientById(matter.clientId)?.name,
  }));

  const statCounts = MATTER_STAGES.map((status) => ({
    status,
    count: rows.filter((row) => row.status === status).length,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl">Your Matters</h1>
      <p className="mt-2 text-muted-foreground">
        Select a client below to review their case and share documents.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Reveal>
          <Card>
            <p className="font-display text-3xl text-primary">{rows.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Total</p>
          </Card>
        </Reveal>
        {statCounts.map((s, i) => (
          <Reveal key={s.status} delay={(i + 1) * 60}>
            <Card>
              <p className="font-display text-3xl text-primary">{s.count}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.status}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-6">
        <DocketBoard
          rows={rows}
          getHref={(row) => `/firm/matters/${row.id}`}
        />
      </div>

      {unassigned.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-xl">Available Clients</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Not yet assigned to an attorney. Claim one to add it to your
            docket.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {unassigned.map((matter, i) => (
              <Reveal key={matter.id} delay={i * 80}>
                <AssignClientCard
                  matterId={matter.id}
                  clientName={getClientById(matter.clientId)?.name ?? "Unknown"}
                  title={matter.title}
                  caseNumber={matter.caseNumber}
                  practiceArea={matter.practiceArea}
                />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
