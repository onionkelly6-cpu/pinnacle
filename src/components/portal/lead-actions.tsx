"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LeadStatus } from "@/lib/demo-leads";

export function LeadActions({
  leadId,
  status,
  canConvert,
  convertedMatterId,
}: {
  leadId: string;
  status: LeadStatus;
  canConvert: boolean;
  convertedMatterId?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<"contact" | "convert" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleMarkContacted() {
    setPending("contact");
    setError(null);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Contacted" }),
      });
      if (!res.ok) throw new Error("Could not update lead");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update lead");
    } finally {
      setPending(null);
    }
  }

  async function handleConvert() {
    setPending("convert");
    setError(null);
    try {
      const res = await fetch(`/api/leads/${leadId}/convert`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not convert this lead");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not convert this lead");
    } finally {
      setPending(null);
    }
  }

  if (status === "Converted") {
    return (
      <Link
        href={convertedMatterId ? `/firm/matters/${convertedMatterId}` : "/firm/matters"}
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
      >
        View Matter
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex justify-end gap-2">
        {status === "New" && (
          <Button
            variant="secondary"
            onClick={handleMarkContacted}
            disabled={pending !== null}
            className="px-3 py-1.5 text-xs"
          >
            {pending === "contact" && <Loader2 className="mr-1 h-3 w-3 animate-spin" aria-hidden />}
            Mark Contacted
          </Button>
        )}
        {canConvert ? (
          <Button
            variant="primary"
            onClick={handleConvert}
            disabled={pending !== null}
            className="px-3 py-1.5 text-xs"
          >
            {pending === "convert" && <Loader2 className="mr-1 h-3 w-3 animate-spin" aria-hidden />}
            Convert to Matter
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">Attorney can convert</span>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
