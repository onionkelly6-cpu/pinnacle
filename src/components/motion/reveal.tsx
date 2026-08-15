"use client";

import { createElement, type ElementType, type ReactNode } from "react";
import { useReveal } from "@/components/motion/use-reveal";
import { cn } from "@/lib/utils";

type Direction = "up" | "left" | "right" | "scale";

const directionClass: Record<Direction, string> = {
  up: "",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
};

type RevealProps = {
  children: ReactNode;
  /** Render as a different element (default div). */
  as?: ElementType;
  /** Entrance direction. */
  direction?: Direction;
  /** Delay in ms before the transition starts (stagger). */
  delay?: number;
  className?: string;
};

/**
 * Wraps children in a scroll-triggered reveal. Server-rendered content stays in
 * place (the `.reveal` opacity/transform is applied after hydration, then
 * removed once visible), so this is safe for SSR and SEO.
 */
export function Reveal({
  children,
  as = "div",
  direction = "up",
  delay = 0,
  className,
}: RevealProps) {
  const { ref, inView } = useReveal<HTMLElement>();
  const transitionDelay = delay > 0 ? `${delay}ms` : undefined;

  return createElement(
    as,
    {
      ref,
      className: cn(
        "reveal",
        directionClass[direction],
        inView && "is-visible",
        className
      ),
      style: { transitionDelay },
    },
    children
  );
}
