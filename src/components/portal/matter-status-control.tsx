"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MATTER_STAGES, type MatterStage } from "@/lib/demo-matters";

export function MatterStatusControl({
  matterId,
  currentStatus,
}: {
  matterId: string;
  currentStatus: MatterStage;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<MatterStage>(currentStatus);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdate() {
    if (status === currentStatus) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/matters/${matterId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Update failed");
      }

      router.refresh();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="inline-flex flex-wrap justify-end gap-1.5 rounded-full border border-border bg-muted/40 p-1.5">
        {MATTER_STAGES.map((stage) => {
          const isSelected = status === stage;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => setStatus(stage)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-out",
                isSelected
                  ? "scale-100 bg-primary text-primary-foreground shadow-sm"
                  : "scale-95 text-muted-foreground hover:scale-100 hover:bg-card hover:text-foreground"
              )}
            >
              {stage}
            </button>
          );
        })}
      </div>
      <Button
        variant="secondary"
        onClick={handleUpdate}
        disabled={saving || status === currentStatus}
        className="min-w-36 justify-center"
      >
        {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden />}
        {!saving && justSaved && <Check className="mr-1.5 h-4 w-4 text-success" aria-hidden />}
        {saving ? "Updating…" : justSaved ? "Updated" : "Update Status"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
