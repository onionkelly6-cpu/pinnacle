"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_MESSAGE_LENGTH } from "@/lib/message-constants";

export function MessageComposer({ matterId }: { matterId: string }) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage() {
    const body = textareaRef.current?.value.trim() ?? "";
    if (!body) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch(`/api/matters/${matterId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });

      if (!res.ok) {
        const responseBody = await res.json().catch(() => ({}));
        throw new Error(responseBody.error ?? "Message failed to send");
      }

      if (textareaRef.current) textareaRef.current.value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Message failed to send");
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          name="body"
          rows={2}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="Write a message…"
          onKeyDown={handleKeyDown}
          disabled={sending}
          className="min-h-11 flex-1 resize-y rounded-sm border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <Button type="submit" variant="primary" disabled={sending}>
          <Send className="mr-1.5 h-4 w-4" aria-hidden />
          {sending ? "Sending…" : "Send"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
