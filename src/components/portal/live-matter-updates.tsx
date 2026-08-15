"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const POLL_MS = 3000;

/**
 * Polls `/api/matters/[id]/version` and refreshes the current route's
 * server-rendered data whenever the version changes (the attorney shared
 * a document, changed status, or claimed the matter). This used to be a
 * persistent SSE connection backed by an in-memory `EventEmitter`, which
 * only worked within a single server process — Vercel's serverless
 * functions can't hold a connection open indefinitely and don't share
 * that memory across instances, so short-interval polling against the
 * Upstash-backed version counter is what actually survives a real
 * deployment. Renders the same "Live" indicator so the UI doesn't change.
 */
export function LiveMatterUpdates({ matterId }: { matterId: string }) {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const lastVersion = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/matters/${matterId}/version`, { cache: "no-store" });
        if (!res.ok) throw new Error("poll failed");
        const { version } = (await res.json()) as { version: number };
        if (cancelled) return;

        setConnected(true);
        if (lastVersion.current !== null && version !== lastVersion.current) {
          router.refresh();
        }
        lastVersion.current = version;
      } catch {
        if (!cancelled) setConnected(false);
      }
    }

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [matterId, router]);

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span
        aria-hidden
        className={cn(
          "h-2 w-2 rounded-full",
          connected ? "pulse-ring bg-success" : "bg-muted-foreground/40"
        )}
      />
      {connected ? "Live" : "Connecting…"}
    </span>
  );
}
