"use client";

import { ViewTransition } from "react";
import type { ReactNode } from "react";

/**
 * Wraps route content so Next's navigation transitions (enabled via
 * `experimental.viewTransition` in next.config.ts) animate the outgoing page
 * out and the incoming page in.
 *
 * Plain link clicks get a subtle crossfade (`.page-enter` / `.page-exit`).
 * Links tagged `transitionTypes={["nav-forward"]}` — the primary CTA buttons
 * (Request a Consultation, Discuss Your Case, etc.) — get a more noticeable
 * directional slide (`.nav-forward`) so clicking a button reads as "going
 * somewhere". Styling for both lives in globals.css.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", default: "page-enter" }}
      exit={{ "nav-forward": "nav-forward", default: "page-exit" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
