import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { PracticeAreaIcon } from "@/components/marketing/practice-area-icon";
import { SITE_NAME } from "@/lib/site-config";
import { AttorneyAvatar } from "@/components/marketing/attorney-avatar";
import { practiceAreas } from "@/lib/content/practice-areas";
import { attorneys } from "@/lib/content/attorneys";
import { caseResults } from "@/lib/content/case-results";

const stats = [
  { label: "Years serving clients", value: "25+" },
  { label: "Matters opened", value: "5,100+" },
  { label: "Practice areas", value: `${practiceAreas.length}` },
  { label: "Client portal uptime", value: "99.98%" },
];

const barAdmissions = ["England and Wales"];

const portalSteps = [
  {
    title: "We open your matter",
    body: "Once your intake is reviewed and accepted, we create your secure case file and portal access.",
  },
  {
    title: "Track it in real time",
    body: "See your case status, next key date, and stage on your personal Docket Board, no phone tag required.",
  },
  {
    title: "Stay in the loop",
    body: "Documents, messages, and status changes all land in one place, with email notifications you control.",
  },
];

const learnMore = [
  { href: "/about", title: "About the Firm", body: "Our story, our values, and what clients say." },
  { href: "/case-results", title: "Case Results", body: "A sample of outcomes we've secured for clients." },
  { href: "/faq", title: "FAQ", body: "Answers to the questions we hear most often." },
  { href: "/locations", title: "Locations", body: "Office addresses, hours, and how to reach us." },
];

const featuredSlugs = [
  "multi-vehicle-collision-settlement",
  "series-a-financing",
  "unlawful-search-dismissal",
] as const;

const featuredResults = featuredSlugs.map(
  (slug) => caseResults.find((r) => r.slug === slug)!
);

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1589391886645-d51941baf7fb"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/95 to-background/50" />
          <div className="pointer-events-none absolute -top-20 -left-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24">
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-primary">
            {SITE_NAME}
          </p>
          <h1 className="max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
            Steady counsel, clearly communicated.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Fairmont Law Agency helps families and founders move through
            legal complexity with a practical plan, honest timelines, and a
            portal built to keep you informed at every step.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/contact" transitionTypes={["nav-forward"]}>
              <Button variant="primary">Request a Consultation</Button>
            </Link>
            <Link href="/login" transitionTypes={["nav-forward"]}>
              <Button variant="secondary">Client Portal Login</Button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-8 text-xs uppercase tracking-wide text-muted-foreground">
            <span>Licensed in:</span>
            {barAdmissions.map((state) => (
              <span key={state} className="font-mono">{state}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-16 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 60}>
              <div>
                <p className="font-display text-4xl text-primary">{stat.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="practice-areas" className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="font-display text-3xl">Practice Areas</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.map((area, i) => (
            <Reveal key={area.slug} delay={(i % 3) * 80}>
              <Link href={`/practice-areas/${area.slug}`} className="block h-full">
                <Card className="lift h-full transition-colors hover:border-primary">
                  <PracticeAreaIcon slug={area.slug} className="text-primary" />
                  <h3 className="mt-3 font-display text-xl">{area.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {area.blurb}
                  </p>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl">Cases We&apos;ve Won</h2>
              <Link
                href="/case-results"
                className="inline-flex items-center gap-1 text-sm text-primary"
              >
                See all results <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {featuredResults.map((result, i) => (
              <Reveal key={result.slug} delay={i * 80}>
                <Card className="lift h-full">
                  <p className="font-display text-3xl text-primary">{result.figure}</p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-wide text-primary">
                    {practiceAreas.find((a) => a.slug === result.practiceArea)?.name}
                  </p>
                  <p className="mt-2 font-medium text-foreground">{result.summary}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Prior results do not guarantee a similar outcome in your matter.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="font-display text-3xl">How the Client Portal Works</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {portalSteps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <div>
                <p className="font-mono text-sm text-primary">0{i + 1}</p>
                <h3 className="mt-2 font-display text-xl">{step.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <h2 className="font-display text-3xl">Our Attorneys</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {attorneys.map((attorney, i) => (
              <Reveal key={attorney.slug} delay={i * 80}>
                <Link href={`/attorneys/${attorney.slug}`} className="block h-full">
                  <Card className="lift h-full transition-colors hover:border-primary">
                    <AttorneyAvatar name={attorney.name} image={attorney.image} />
                    <h3 className="mt-4 font-display text-xl">{attorney.name}</h3>
                    <p className="mt-1 text-sm text-primary">{attorney.title}</p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {attorney.bio}
                    </p>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <h2 className="font-display text-3xl">Learn More</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {learnMore.map((item, i) => (
              <Reveal key={item.href} delay={(i % 4) * 60}>
                <Link href={item.href} className="block h-full">
                  <Card className="lift h-full transition-colors hover:border-primary">
                    <h3 className="font-display text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                      Learn more <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl">
          Ready to talk about your matter?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Tell us what&apos;s going on and our intake team will follow up to
          schedule a consultation.
        </p>
        <Link href="/contact" className="mt-8 inline-block" transitionTypes={["nav-forward"]}>
          <Button variant="primary">Contact Us</Button>
        </Link>

        <div className="mx-auto mt-16 max-w-md border-t border-border pt-10">
          <h3 className="font-display text-lg">Legal Insights, Occasionally</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No spam, just the occasional note when the law changes in a way
            that affects our clients.
          </p>
          <form className="mt-4 flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              disabled
              aria-label="Email address"
              className="w-full rounded-sm border border-border bg-background px-4 py-2.5 disabled:opacity-60"
            />
            <Button type="submit" variant="secondary" disabled>
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
