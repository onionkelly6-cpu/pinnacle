import Image from "next/image";
import { Clock, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { practiceAreas } from "@/lib/content/practice-areas";
import { offices } from "@/lib/content/offices";
import { SITE_CONTACT_EMAIL } from "@/lib/site-config";
import { submitLeadAction } from "./actions";

export const metadata = {
  title: "Contact",
  description:
    "Contact Fairmont Law Agency to schedule a consultation. Two offices, direct attorney access, and a response within one business day.",
};

type Props = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="font-mono text-sm uppercase tracking-widest text-primary">
          Let&apos;s Talk
        </p>
        <h1 className="mt-4 font-display text-4xl">Contact Us</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Tell us about your matter and our intake team will follow up. This
          form does not open a case directly. Every submission is reviewed
          by a person first.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
        <Reveal direction="left">
          <Card>
            {params.success && (
              <p
                role="status"
                className="mb-6 rounded-sm border border-success/40 bg-success/10 px-4 py-3 text-sm text-success"
              >
                Thanks — your message is in. Our intake team will follow up within one business day.
              </p>
            )}
            {params.error && (
              <p
                role="alert"
                className="mb-6 rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {params.error}
              </p>
            )}
            <form action={submitLeadAction} className="space-y-6" aria-describedby="intake-form-note">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-2.5 text-foreground transition-colors focus-visible:outline-none focus-visible:border-primary"
                />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-2.5 text-foreground transition-colors focus-visible:outline-none focus-visible:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-2.5 text-foreground transition-colors focus-visible:outline-none focus-visible:border-primary"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="practiceArea" className="block text-sm font-medium">
                  Practice area
                </label>
                <select
                  id="practiceArea"
                  name="practiceArea"
                  className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-2.5 text-foreground transition-colors focus-visible:outline-none focus-visible:border-primary"
                >
                  {practiceAreas.map((area) => (
                    <option key={area.slug} value={area.slug}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium">
                  What&apos;s going on?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-2.5 text-foreground transition-colors focus-visible:outline-none focus-visible:border-primary"
                />
              </div>
              <Button type="submit" variant="primary">
                Submit Inquiry
              </Button>
              <p id="intake-form-note" className="text-xs text-muted-foreground">
                This creates a Lead record our intake team reviews. Email
                notifications land in Milestone 8.
              </p>
            </form>
          </Card>
        </Reveal>

        <Reveal direction="right" delay={80}>
          <div className="flex h-full flex-col overflow-hidden rounded-sm border border-border">
            <div className="relative h-48 w-full">
              <Image
                src="https://images.unsplash.com/photo-1521791055366-0d553872125f"
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex-1 bg-card p-6">
              <h2 className="font-display text-lg">Prefer to reach out directly?</h2>
              <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span className="font-mono">{SITE_CONTACT_EMAIL}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  We typically respond within one business day.
                </li>
              </ul>

              <div className="mt-6 space-y-4 border-t border-border pt-6">
                {offices.map((office) => (
                  <div key={office.name} className="text-sm">
                    <p className="font-medium text-foreground">{office.name}</p>
                    <div className="mt-2 space-y-1.5 pl-0">
                      {office.phones.map((phone) => (
                        <p
                          key={phone.number}
                          className="flex items-center gap-2.5 text-muted-foreground"
                        >
                          <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                          <span className="font-mono">{phone.number}</span>
                          <span className="text-xs">({phone.label})</span>
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
