import type { DemoMessage } from "@/lib/demo-messages";
import { cn } from "@/lib/utils";

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MessageThread({
  messages,
  currentUserName,
}: {
  messages: DemoMessage[];
  currentUserName?: string | null;
}) {
  if (messages.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-border p-10 text-center text-muted-foreground">
        No messages yet. Send one below to start the conversation.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {messages.map((message) => {
        const isOwn = message.senderName === currentUserName;
        return (
          <li
            key={message.id}
            className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-sm border px-4 py-2.5 shadow-(--shadow-card) sm:max-w-[70%]",
                isOwn
                  ? "border-primary/20 bg-primary/10 text-foreground"
                  : "border-border bg-card text-foreground"
              )}
            >
              <p className="whitespace-pre-wrap text-sm">{message.body}</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {message.senderName} &middot; {formatTimestamp(message.sentAt)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
