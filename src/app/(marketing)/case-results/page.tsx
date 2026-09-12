import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CaseResultsExplorer } from "@/components/marketing/case-results-explorer";
import { caseResultStats } from "@/lib/content/case-results";

export const metadata = {
  title: "Case Results",
  description:
    "A sample of case results Pinnacle Legal & Business Law has secured for clients: settlements, dismissals, and closed deals across every practice area.",
};

export default function CaseResultsPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background/40" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 py-24">
          <p className="font-mono text-sm uppercase tracking-widest text-primary">
            Track Record
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">
            Cases We&apos;ve Won
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            A sample of outcomes we&apos;ve secured for clients across every
            practice area, from seven-figure settlements to dismissed
            charges to deals closed on deadline.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            Prior results do not guarantee a similar outcome in your matter.
            Every case depends on its own facts.
          </p>
          <Link href="/contact" className="mt-8 inline-block" transitionTypes={["nav-forward"]}>
            <Button variant="primary">Discuss Your Case</Button>
          </Link>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-16 sm:grid-cols-4">
          {caseResultStats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl text-primary">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <CaseResultsExplorer />
      </section>
    </div>
  );
}
