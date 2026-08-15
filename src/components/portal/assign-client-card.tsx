"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AssignClientCard({
  matterId,
  clientName,
  title,
  caseNumber,
  practiceArea,
}: {
  matterId: string;
  clientName: string;
  title: string;
  caseNumber: string;
  practiceArea: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAssign() {
    setPending(true);
    setError(null);

    try {
      const res = await fetch(`/api/matters/${matterId}/assign`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not assign this matter");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not assign this matter");
      setPending(false);
    }
  }

  return (
    <Card className="lift flex h-full flex-col justify-between">
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-primary">
          {practiceArea} &middot; {caseNumber}
        </p>
        <h3 className="mt-2 font-display text-lg">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">Client: {clientName}</p>
      </div>
      <Button
        variant="secondary"
        onClick={handleAssign}
        disabled={pending}
        className="mt-4 w-full"
      >
        <UserPlus className="mr-1.5 h-4 w-4" aria-hidden />
        {pending ? "Assigning…" : "Assign to Me"}
      </Button>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </Card>
  );
}
