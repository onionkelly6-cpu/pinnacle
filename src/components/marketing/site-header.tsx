"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/attorneys", label: "Attorneys" },
  { href: "/case-results", label: "Case Results" },
  { href: "/locations", label: "Locations" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo.jpg"
            alt="Pinnacle Legal & Business Law"
            width={1455}
            height={1081}
            priority
            className="h-14 w-auto rounded-sm"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 text-sm lg:flex">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                transitionTypes={["nav-forward"]}
                className={cn(
                  "rounded-full px-4 py-2 transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-full border border-primary px-4 py-2 text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Client Portal
          </Link>
          <Link href="/contact" transitionTypes={["nav-forward"]}>
            <Button variant="primary" className="rounded-full">
              Request a Consultation
            </Button>
          </Link>
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
        <nav
          aria-label="Primary mobile"
          className="border-t border-border bg-background px-6 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1 text-sm">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    transitionTypes={["nav-forward"]}
                    className={cn(
                      "block rounded-sm px-3 py-2.5",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-primary px-4 py-2.5 text-center text-sm text-primary"
            >
              Client Portal
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              transitionTypes={["nav-forward"]}
            >
              <Button variant="primary" className="w-full rounded-full">
                Request a Consultation
              </Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
