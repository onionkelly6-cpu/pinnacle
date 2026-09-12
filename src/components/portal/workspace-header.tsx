"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/auth-actions";
import { WorkspaceNav } from "./workspace-nav";
import { UserBadge } from "./user-badge";
import { Button } from "@/components/ui/button";

export function WorkspaceHeader({
  homeHref,
  subtitle,
  navLinks,
  userName,
  userRole,
}: {
  homeHref: string;
  subtitle?: string;
  navLinks: { href: string; label: string }[];
  userName?: string;
  userRole?: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card/60 shadow-(--shadow-card) backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href={homeHref}
          className="flex items-center gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo.jpg"
            alt="Pinnacle Legal & Business Law"
            width={1455}
            height={1081}
            className="h-11 w-auto shrink-0 rounded-sm"
          />
          {subtitle && (
            <span className="hidden font-sans text-xs text-muted-foreground sm:inline">
              {subtitle}
            </span>
          )}
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <WorkspaceNav links={navLinks} />
          {userName && <UserBadge name={userName} role={userRole ?? "Unknown"} />}
          <form action={signOutAction}>
            <Button type="submit" variant="secondary">
              Sign Out
            </Button>
          </form>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-background px-6 py-4 lg:hidden">
          {userName && (
            <div className="mb-4">
              <UserBadge name={userName} role={userRole ?? "Unknown"} />
            </div>
          )}
          <nav aria-label="Workspace mobile" className="flex flex-col gap-1 text-sm">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-sm px-3 py-2.5",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <form action={signOutAction} className="mt-4 border-t border-border pt-4">
            <Button type="submit" variant="secondary" className="w-full">
              Sign Out
            </Button>
          </form>
        </div>
      )}
    </header>
  );
}
