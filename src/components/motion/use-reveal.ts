"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";

type RevealOptions = {
  /** Only fire once (default true). */
  once?: boolean;
  /** Root margin / trigger threshold tuning. */
  rootMargin?: string;
  /** Fraction of the element visible before firing (0–1). */
  threshold?: number;
};

/**
 * IntersectionObserver-based visibility hook. Returns a ref to attach and an
 * `inView` flag. For reduced-motion users `inView` is always true so content
 * is never left hidden (the CSS `.reveal` rule also force-shows it).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {}
) {
  const { once = true, rootMargin = "0px 0px -10% 0px", threshold = 0.12 } =
    options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Reduced-motion: show immediately, no observer needed.
    if (reducedMotion) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold, reducedMotion]);

  return { ref, inView: inView || reducedMotion } as const;
}
