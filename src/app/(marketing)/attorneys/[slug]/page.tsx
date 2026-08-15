import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { attorneys } from "@/lib/content/attorneys";
import { practiceAreas } from "@/lib/content/practice-areas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AttorneyAvatar } from "@/components/marketing/attorney-avatar";
import { jsonLd } from "@/lib/structured-data";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

export function generateStaticParams() {
  return attorneys.map((attorney) => ({ slug: attorney.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const attorney = attorneys.find((a) => a.slug === slug);
  if (!attorney) return { title: "Attorney" };
  return {
    title: attorney.name,
    description: `${attorney.name}, ${attorney.title} at Fairmont Law Agency. ${attorney.bio}`,
    openGraph: {
      title: `${attorney.name} | Fairmont Law Agency`,
      description: attorney.bio,
      images: attorney.image ? [attorney.image] : undefined,
    },
  };
}

export default async function AttorneyPage({ params }: Props) {
  const { slug } = await params;
  const attorney = attorneys.find((a) => a.slug === slug);
  if (!attorney) notFound();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: attorney.name,
    jobTitle: attorney.title,
    description: attorney.bio,
    image: attorney.image,
    email: attorney.email,
    url: `${SITE_URL}/attorneys/${attorney.slug}`,
    worksFor: {
      "@type": "LegalService",
      name: SITE_NAME,
      url: SITE_URL,
    },
    alumniOf: attorney.education.map((edu) => ({
      "@type": "EducationalOrganization",
      name: edu.school,
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(personSchema) }}
      />
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[2fr_1fr]">
          <div>
            <AttorneyAvatar name={attorney.name} image={attorney.image} size="lg" />
            <h1 className="mt-6 font-display text-4xl">{attorney.name}</h1>
            <p className="mt-2 text-primary">{attorney.title}</p>
            <p className="mt-6 text-lg text-muted-foreground">{attorney.bio}</p>
            <p className="mt-4 text-muted-foreground">{attorney.longBio}</p>

            <div className="mt-8">
              <h2 className="font-display text-xl">Practice Areas</h2>
              <ul className="mt-4 flex flex-wrap gap-4">
                {attorney.practiceAreas.map((slug) => {
                  const area = practiceAreas.find((a) => a.slug === slug);
                  if (!area) return null;
                  return (
                    <li key={slug}>
                      <Link
                        href={`/practice-areas/${slug}`}
                        className="rounded-sm border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary"
                      >
                        {area.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-xl">Representative Experience</h2>
              <ul className="mt-4 space-y-3">
                {attorney.notableMatters.map((matter) => (
                  <li
                    key={matter}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1 text-primary" aria-hidden>•</span>
                    {matter}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Prior results do not guarantee a similar outcome in your matter.
              </p>
            </div>
          </div>

          <Card className="h-fit">
            <h2 className="font-display text-lg">Contact</h2>
            <p className="mt-3 text-sm text-muted-foreground">{attorney.email}</p>
            <Link href="/contact" className="mt-6 block" transitionTypes={["nav-forward"]}>
              <Button variant="primary" className="w-full">
                Schedule a Consultation
              </Button>
            </Link>

            <div className="mt-8 border-t border-border pt-6">
              <h3 className="font-display text-sm">Education</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {attorney.education.map((edu) => (
                  <li key={edu.school}>
                    <p>{edu.school}</p>
                    <p className="text-xs">{edu.degree}, {edu.year}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <h3 className="font-display text-sm">Bar Admissions</h3>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {attorney.barAdmissions.map((state) => (
                  <li key={state}>{state}</li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
