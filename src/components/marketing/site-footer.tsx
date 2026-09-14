import Image from "next/image";
import Link from "next/link";
import { practiceAreas } from "@/lib/content/practice-areas";
import { offices } from "@/lib/content/offices";
import { SITE_NAME } from "@/lib/site-config";

const firmLinks = [
  { href: "/about", label: "About the Firm" },
  { href: "/attorneys", label: "Our Attorneys" },
  { href: "/case-results", label: "Case Results" },
  { href: "/faq", label: "FAQ" },
  { href: "/locations", label: "Locations" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/attorney-advertising", label: "Attorney Advertising Disclaimer" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="accent-rule" aria-hidden />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.jpg"
                alt="Pinnacle Legal & Business Law"
                width={1455}
                height={1081}
                className="h-12 w-auto rounded-sm"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Built for people and companies who want legal strategy without
              fog. You get practical guidance and a portal that keeps every
              deadline, document, and update in view.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-wide text-primary">
              Practice Areas
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {practiceAreas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/practice-areas/${area.slug}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-wide text-primary">
              Firm
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {firmLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-wide text-primary">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-3 text-xs text-muted-foreground">
              {offices.map((office) => (
                <li key={office.name}>
                  <p className="font-medium text-foreground">{office.name}</p>
                  <p>{office.address}</p>
                  {office.phones.map((phone) => (
                    <p key={phone.number} className="font-mono">
                      {phone.number}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-8 text-sm text-muted-foreground">
          <p className="max-w-2xl">
            Attorney Advertising. Prior results do not guarantee a similar
            outcome. This site is for general information only and does not
            constitute legal advice.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="mt-6">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
