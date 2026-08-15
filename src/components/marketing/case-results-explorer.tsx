"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { caseResults } from "@/lib/content/case-results";
import { practiceAreas } from "@/lib/content/practice-areas";
import { cn } from "@/lib/utils";

const filters = [
  { slug: "all", name: "All Results" },
  ...practiceAreas.map((area) => ({ slug: area.slug, name: area.name })),
];

export function CaseResultsExplorer() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? caseResults
        : caseResults.filter((result) => result.practiceArea === activeFilter),
    [activeFilter]
  );

  return (
    <div>
      <div role="tablist" aria-label="Filter by practice area" className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = filter.slug === activeFilter;
          return (
            <button
              key={filter.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(filter.slug)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
              )}
            >
              {filter.name}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {filtered.map((result, i) => {
          const area = practiceAreas.find((a) => a.slug === result.practiceArea);
          return (
            <Reveal key={result.slug} delay={(i % 4) * 60}>
              <Card className="lift h-full">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-display text-3xl text-primary">{result.figure}</p>
                  <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    {result.year}
                  </span>
                </div>
                <p className="mt-3 font-mono text-xs uppercase tracking-wide text-primary">
                  {area?.name ?? result.practiceArea}
                </p>
                <p className="mt-2 font-medium text-foreground">{result.summary}</p>
                <p className="mt-3 text-sm text-muted-foreground">{result.detail}</p>
              </Card>
            </Reveal>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-sm text-muted-foreground">
          No published results for this practice area yet. Contact us to discuss your matter.
        </p>
      )}
    </div>
  );
}
