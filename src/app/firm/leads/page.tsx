import { auth } from "@/lib/auth";
import { getAllLeads } from "@/lib/demo-leads";
import { practiceAreas } from "@/lib/content/practice-areas";
import { LeadActions } from "@/components/portal/lead-actions";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Leads | Firm Workspace" };

function practiceAreaName(slug: string): string {
  return practiceAreas.find((area) => area.slug === slug)?.name ?? slug;
}

function formatSubmittedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function LeadsPage() {
  const session = await auth();
  const leads = await getAllLeads();
  const canConvert = session?.user?.role === "attorney";

  return (
    <div>
      <h1 className="font-display text-3xl">Lead Inbox</h1>
      <p className="mt-2 text-muted-foreground">
        Intake submissions from the public contact form. Converting a
        qualified lead into a matter creates the client record and case in
        one step.
      </p>

      {leads.length === 0 ? (
        <Card className="mt-8 text-center text-muted-foreground">
          No leads submitted yet.
        </Card>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-sm border border-border">
          <table className="w-full min-w-160 border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-card text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-medium">Name</th>
                <th scope="col" className="px-4 py-3 font-medium">Practice Area</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 font-medium">Submitted</th>
                <th scope="col" className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-card">
                  <td className="px-4 py-3">
                    <p>{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                    {lead.phone && <p className="text-xs text-muted-foreground">{lead.phone}</p>}
                  </td>
                  <td className="px-4 py-3">{practiceAreaName(lead.practiceArea)}</td>
                  <td className="px-4 py-3">{lead.status}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatSubmittedAt(lead.submittedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <LeadActions
                      leadId={lead.id}
                      status={lead.status}
                      canConvert={canConvert}
                      convertedMatterId={lead.convertedMatterId}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
