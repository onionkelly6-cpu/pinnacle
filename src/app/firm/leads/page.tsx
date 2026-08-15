import { Button } from "@/components/ui/button";

export const metadata = { title: "Leads | Firm Workspace" };

const placeholderLeads = [
  {
    id: "1",
    name: "Jordan Alvarez",
    email: "jordan.alvarez@example.com",
    practiceArea: "Family Law",
    status: "New",
    submittedAt: "Jul 21, 2026",
  },
  {
    id: "2",
    name: "Sam Whitfield",
    email: "sam.whitfield@example.com",
    practiceArea: "Real Estate",
    status: "Contacted",
    submittedAt: "Jul 18, 2026",
  },
];

export default function LeadsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl">Lead Inbox</h1>
      <p className="mt-2 text-muted-foreground">
        Intake submissions from the public contact form. Converting a
        qualified lead into a matter (creating the client account and case
        record) is wired up in Milestone 7.
      </p>
      <div className="mt-8 overflow-x-auto rounded-sm border border-border">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
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
            {placeholderLeads.map((lead) => (
              <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-card">
                <td className="px-4 py-3">
                  <p>{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                </td>
                <td className="px-4 py-3">{lead.practiceArea}</td>
                <td className="px-4 py-3">{lead.status}</td>
                <td className="px-4 py-3 text-muted-foreground">{lead.submittedAt}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="secondary" disabled>
                    Convert to Matter
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
