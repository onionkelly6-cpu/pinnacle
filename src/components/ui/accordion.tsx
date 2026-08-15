"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => {
        const isOpen = item.id === openId;
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-medium">{item.question}</span>
              <span
                aria-hidden
                className={cn(
                  "shrink-0 text-primary transition-transform",
                  isOpen && "rotate-45"
                )}
              >
                +
              </span>
            </button>
            {isOpen && (
              <p className="pb-5 text-sm text-muted-foreground">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
