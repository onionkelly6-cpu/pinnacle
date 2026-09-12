"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";

const VISIBLE_MS = 1300;
const FADE_MS = 550;

/**
 * One-time intro shown on a fresh document load. Lives in the root layout,
 * which persists across client-side navigation, so it never replays on
 * in-app route changes, only on a hard refresh / first visit.
 */
export function SplashScreen() {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"visible" | "fading" | "gone">("visible");

  useEffect(() => {
    if (reducedMotion) return;

    const fadeTimer = setTimeout(() => setPhase("fading"), VISIBLE_MS);
    const removeTimer = setTimeout(() => setPhase("gone"), VISIBLE_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [reducedMotion]);

  if (reducedMotion || phase === "gone") return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-999 flex items-center justify-center bg-[#f7f3ea] transition-all duration-500 ease-out"
      style={{
        opacity: phase === "fading" ? 0 : 1,
        transform: phase === "fading" ? "scale(1.05)" : "scale(1)",
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/logo.jpg"
          alt="Pinnacle Legal & Business Law"
          width={1455}
          height={1081}
          priority
          className="splash-icon-in h-28 w-auto rounded-sm"
        />
        <span className="splash-rule-in h-px w-16 bg-[#b8863a]" />
      </div>
    </div>
  );
}
