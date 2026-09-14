"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, FilePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { practiceAreas } from "@/lib/content/practice-areas";

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
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdMatterId, setCreatedMatterId] = useState<string | null>(null);

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

  async function handleCreateMatter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setPending(true);
    setError(null);

    try {
      const res = await fetch(`/api/clients/${id}/matters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          practiceArea: formData.get("practiceArea"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not create matter");
      }

      const { matter } = await res.json();
      form.reset();
      setFormOpen(false);
      setCreatedMatterId(matter.id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create matter");
    } finally {
      setPending(false);
    }
  }

  return (
    <li className="px-4 py-3.5 transition-colors hover:bg-muted/30">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {email} &middot; created {createdAt}
          </p>
        </div>
        {createdMatterId ? (
          <Link
            href={`/firm/matters/${createdMatterId}`}
            className="hidden shrink-0 rounded-full bg-success/15 px-2.5 py-1 text-xs text-success sm:inline-flex"
          >
            Matter created
          </Link>
        ) : (
          <span
            className={
              "hidden shrink-0 rounded-full px-2.5 py-1 text-xs sm:inline-flex " +
              (hasMatters ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")
            }
          >
            {hasMatters ? "Linked to matters" : "No matters yet"}
          </span>
        )}
        <Button
          variant="secondary"
          onClick={() => setFormOpen((open) => !open)}
          disabled={pending}
          className="shrink-0 px-3 py-1.5 text-xs"
        >
          <FilePlus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          New Matter
        </Button>
        <Button
          variant="secondary"
          onClick={handleRevoke}
          disabled={pending}
          className="shrink-0"
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          Revoke
        </Button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleCreateMatter}
          className="mt-3 grid gap-3 rounded-sm border border-border bg-background p-4 sm:grid-cols-[2fr_1fr_auto]"
        >
          <div>
            <label htmlFor={`title-${id}`} className="block text-xs font-medium">
              Case title
            </label>
            <input
              id={`title-${id}`}
              name="title"
              type="text"
              required
              placeholder="e.g. Revocable Living Trust"
              className="mt-1.5 w-full rounded-sm border border-border bg-card px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor={`practiceArea-${id}`} className="block text-xs font-medium">
              Practice area
            </label>
            <select
              id={`practiceArea-${id}`}
              name="practiceArea"
              required
              defaultValue=""
              className="mt-1.5 w-full rounded-sm border border-border bg-card px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Select…
              </option>
              {practiceAreas.map((area) => (
                <option key={area.slug} value={area.slug}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button type="submit" variant="primary" disabled={pending} className="w-full">
              {pending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden />}
              Create
            </Button>
          </div>
          {error && (
            <p role="alert" className="text-xs text-destructive sm:col-span-3">
              {error}
            </p>
          )}
        </form>
      )}
    </li>
  );
}
