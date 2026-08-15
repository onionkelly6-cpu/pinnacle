"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClientAccountRow({
  id,
  name,
  email,
  createdAt,
  hasMatters,
}: {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  hasMatters: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleRevoke() {
    if (!confirm(`Revoke portal access for ${name}?`)) return;
    setPending(true);
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not revoke access");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <li className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-muted/30">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {email} &middot; created {createdAt}
        </p>
      </div>
      <span
        className={
          "hidden shrink-0 rounded-full px-2.5 py-1 text-xs sm:inline-flex " +
          (hasMatters ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")
        }
      >
        {hasMatters ? "Linked to matters" : "No matters yet"}
      </span>
      <Button
        variant="secondary"
        onClick={handleRevoke}
        disabled={pending}
        className="shrink-0"
      >
        <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
        Revoke
      </Button>
    </li>
  );
}
