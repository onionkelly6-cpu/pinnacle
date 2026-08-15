import Link from "next/link";
import { cn } from "@/lib/utils";

export interface DocketRow {
  id: string;
  caseNumber: string;
  matter: string;
  status: string;
  nextDate?: string;
  attorney?: string;
  client?: string;
  practiceArea?: string;
}

const statusTone: Record<string, string> = {
  Filed: "bg-muted text-muted-foreground",
  Discovery: "bg-warning/15 text-warning",
  "Hearing Scheduled": "bg-accent/15 text-accent",
  Resolved: "bg-success/15 text-success",
};

const statusDot: Record<string, string> = {
  Filed: "bg-muted-foreground",
  Discovery: "bg-warning",
  "Hearing Scheduled": "bg-accent",
  Resolved: "bg-success",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        statusTone[status] ?? "bg-muted text-muted-foreground"
      )}
    >
      <span
        aria-hidden
        className={cn("h-1.5 w-1.5 rounded-full", statusDot[status] ?? "bg-muted-foreground")}
      />
      {status}
    </span>
  );
}

export function DocketBoard({
  rows,
  getHref,
}: {
  rows: DocketRow[];
  getHref: (row: DocketRow) => string;
}) {
  const showAttorney = rows.some((row) => row.attorney);
  const showClient = rows.some((row) => row.client);
  const showPracticeArea = rows.some((row) => row.practiceArea);

  if (rows.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-border p-10 text-center text-muted-foreground">
        No matters to show yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-border shadow-(--shadow-card)">
      <table className="w-full min-w-160 border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="px-4 py-3 font-medium">Case No.</th>
            <th scope="col" className="px-4 py-3 font-medium">Matter</th>
            {showPracticeArea && (
              <th scope="col" className="px-4 py-3 font-medium">Practice Area</th>
            )}
            {showAttorney && (
              <th scope="col" className="px-4 py-3 font-medium">Attorney</th>
            )}
            {showClient && (
              <th scope="col" className="px-4 py-3 font-medium">Client</th>
            )}
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
            <th scope="col" className="px-4 py-3 font-medium">Next Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border bg-card last:border-0 transition-colors hover:bg-muted/40"
            >
              <td className="px-4 py-3 font-mono text-xs">
                <Link href={getHref(row)} className="text-primary underline-offset-4 hover:underline">
                  {row.caseNumber}
                </Link>
              </td>
              <td className="px-4 py-3">
                <Link href={getHref(row)} className="font-medium hover:underline">
                  {row.matter}
                </Link>
              </td>
              {showPracticeArea && (
                <td className="px-4 py-3 text-muted-foreground">{row.practiceArea ?? "N/A"}</td>
              )}
              {showAttorney && (
                <td className="px-4 py-3 text-muted-foreground">{row.attorney ?? "N/A"}</td>
              )}
              {showClient && (
                <td className="px-4 py-3 text-muted-foreground">{row.client ?? "N/A"}</td>
              )}
              <td className="px-4 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {row.nextDate ?? "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
