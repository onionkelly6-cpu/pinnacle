import { DocketBoard, type DocketRow } from "@/components/portal/docket-board";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { auth } from "@/lib/auth";
import { getMattersForClient } from "@/lib/demo-matters";
import { getClientByEmail } from "@/lib/demo-clients";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const client = session?.user?.email ? getClientByEmail(session.user.email) : undefined;
  const matters = client ? await getMattersForClient(client.id) : [];

  const rows: DocketRow[] = matters.map((matter) => ({
    id: matter.id,
    caseNumber: matter.caseNumber,
    matter: matter.title,
    status: matter.status,
    nextDate: matter.nextDate,
    practiceArea: matter.practiceArea,
  }));

  const upcomingDates = matters
    .filter((matter) => matter.nextDate)
    .map((matter) => ({
      date: matter.nextDate!,
      label: matter.title,
      caseNumber: matter.caseNumber,
    }));

  const stats = [
    { label: "Open Matters", value: rows.filter((r) => r.status !== "Resolved").length },
    { label: "Upcoming Dates", value: upcomingDates.length },
    { label: "Unread Messages", value: 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Your Matters</h1>
      <p className="mt-2 text-muted-foreground">
        Every matter Fairmont Law Agency is handling on your behalf, with its
        current stage and next key date.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 60}>
            <Card>
              <p className="font-display text-3xl text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="font-display text-xl">Docket Board</h2>
          <div className="mt-4">
            <DocketBoard
              rows={rows}
              getHref={(row) => `/matters/${row.id}`}
            />
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl">Upcoming Dates</h2>
          <Card className="mt-4">
            {upcomingDates.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing upcoming.</p>
            ) : (
              <ul className="space-y-4">
                {upcomingDates.map((item) => (
                  <li key={item.caseNumber} className="text-sm">
                    <p className="font-mono text-xs text-primary">{item.date}</p>
                    <p className="mt-1">{item.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.caseNumber}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
