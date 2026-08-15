import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { practiceAreas } from "@/lib/content/practice-areas";
import { attorneys } from "@/lib/content/attorneys";
import { caseResults } from "@/lib/content/case-results";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { PracticeAreaIcon } from "@/components/marketing/practice-area-icon";
import { AttorneyAvatar } from "@/components/marketing/attorney-avatar";
import { jsonLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return practiceAreas.map((area) => ({ slug: area.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = practiceAreas.find((a) => a.slug === slug);
  if (!area) return { title: "Practice Area" };
  return {
    title: area.name,
    description: area.blurb,
    openGraph: {
      title: `${area.name} | Fairmont Law Agency`,
      description: area.blurb,
    },
  };
}

export default async function PracticeAreaPage({ params }: Props) {
  const { slug } = await params;
  const area = practiceAreas.find((a) => a.slug === slug);
  if (!area) notFound();

  const relatedAttorneys = attorneys.filter((attorney) =>
    (attorney.practiceAreas as readonly string[]).includes(area.slug)
  );

  const relatedResults = caseResults.filter((result) => result.practiceArea === area.slug);

  const otherAreas = practiceAreas.filter((a) => a.slug !== area.slug);

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: area.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqPageSchema) }}
      />
      <section className="mx-auto max-w-4xl px-6 py-20">
        <PracticeAreaIcon slug={area.slug} className="h-10 w-10 text-primary" />
        <p className="mt-4 font-mono text-sm text-primary">{area.code}</p>
        <h1 className="mt-2 font-display text-4xl">{area.name}</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          {area.blurb}
        </p>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          {area.longDescription}
        </p>
        <Link href="/contact" className="mt-8 inline-block" transitionTypes={["nav-forward"]}>
          <Button variant="primary">Discuss a {area.name} Matter</Button>
        </Link>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-display text-2xl">
            Why Fairmont Law Agency for {area.name}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {area.whyUs.map((reason, i) => (
              <Reveal key={reason} delay={i * 80}>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="text-sm text-muted-foreground">{reason}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-display text-2xl">Services</h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {area.services.map((service) => (
              <li
                key={service}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1 text-primary" aria-hidden>
                  •
                </span>
                {service}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-display text-2xl">Our Approach</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {area.processSteps.map((step, i) => (
              <div key={step.title}>
                <p className="font-mono text-sm text-primary">0{i + 1}</p>
                <h3 className="mt-2 font-display text-lg">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {relatedResults.length > 0 && (
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <h2 className="font-display text-2xl">
              {area.name} Results
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {relatedResults.map((result, i) => (
                <Reveal key={result.slug} delay={i * 80}>
                  <Card className="lift h-full">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-display text-3xl text-primary">{result.figure}</p>
                      <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                        {result.year}
                      </span>
                    </div>
                    <p className="mt-2 font-medium text-foreground">{result.summary}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
            <Link
              href="/case-results"
              className="mt-6 inline-block text-sm text-primary hover:underline"
            >
              See all case results
            </Link>
          </div>
        </section>
      )}

      {relatedAttorneys.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <h2 className="font-display text-2xl">Attorneys in this Area</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {relatedAttorneys.map((attorney) => (
                <Link key={attorney.slug} href={`/attorneys/${attorney.slug}`}>
                  <Card className="lift flex h-full items-center gap-4 transition-colors hover:border-primary">
                    <AttorneyAvatar name={attorney.name} image={attorney.image} size="sm" />
                    <div>
                      <h3 className="font-display text-lg">{attorney.name}</h3>
                      <p className="mt-1 text-sm text-primary">{attorney.title}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl border-t border-border px-6 py-16">
        <h2 className="font-display text-2xl">Frequently Asked Questions</h2>
        <div className="mt-8">
          <Accordion
            items={area.faqs.map((faq, i) => ({
              id: `${area.slug}-faq-${i}`,
              question: faq.q,
              answer: faq.a,
            }))}
          />
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-display text-2xl">Other Practice Areas</h2>
          <ul className="mt-6 flex flex-wrap gap-4">
            {otherAreas.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/practice-areas/${other.slug}`}
                  className="rounded-sm border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary"
                >
                  {other.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
