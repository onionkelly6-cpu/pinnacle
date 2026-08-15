"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CreateClientAccountForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not create account");
      }

      form.reset();
      setStatus("idle");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not create account");
    }
  }

  return (
    <Card>
      <h2 className="font-display text-xl">Create Client Access</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Set an email and password for a client. No email verification, the
        password alone is enough to sign in. If the email matches an
        existing client record, their matters appear on the dashboard right
        away.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Client name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-2.5"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-2.5"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="text"
            required
            minLength={6}
            className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-2.5"
          />
        </div>
        <div className="sm:col-span-3">
          <Button type="submit" variant="primary" disabled={status === "submitting"}>
            <UserPlus className="mr-1.5 h-4 w-4" aria-hidden />
            {status === "submitting" ? "Creating…" : "Create Access"}
          </Button>
          {status === "error" && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
      </form>
    </Card>
  );
}
