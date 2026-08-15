"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocumentUploadForm({ matterId }: { matterId: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!(formData.get("file") as File)?.name) {
      setStatus("error");
      setError("Choose a file to upload.");
      return;
    }

    setStatus("uploading");
    setError(null);

    try {
      const res = await fetch(`/api/matters/${matterId}/documents`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Upload failed");
      }

      form.reset();
      setStatus("idle");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-sm border border-dashed border-border p-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="flex-1">
        <label htmlFor="file" className="block text-sm font-medium">
          Upload a document
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="mt-2 w-full text-sm text-muted-foreground file:mr-3 file:rounded-sm file:border file:border-border file:bg-card file:px-3 file:py-1.5 file:text-sm file:text-foreground hover:file:border-primary"
        />
        <p className="mt-1 text-xs text-muted-foreground">PDF or Word documents, up to 10 MB.</p>
      </div>

      <div>
        <label htmlFor="visibility" className="block text-sm font-medium">
          Visibility
        </label>
        <select
          id="visibility"
          name="visibility"
          defaultValue="internal"
          className="mt-2 w-full rounded-sm border border-border bg-card px-3 py-2 text-sm text-foreground sm:w-auto"
        >
          <option value="internal">Internal only</option>
          <option value="client">Client-visible</option>
        </select>
      </div>

      <Button type="submit" variant="primary" disabled={status === "uploading"}>
        <UploadCloud className="mr-1.5 h-4 w-4" aria-hidden />
        {status === "uploading" ? "Uploading…" : "Upload"}
      </Button>

      {status === "error" && (
        <p role="alert" className="w-full text-sm text-destructive sm:w-auto">
          {error}
        </p>
      )}
    </form>
  );
}
