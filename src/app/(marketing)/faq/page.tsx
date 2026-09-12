import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import { generalFaqs } from "@/lib/content/faqs";
import { jsonLd } from "@/lib/structured-data";

export const metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to the questions we hear most often about consultations, billing, jurisdictions, and the Pinnacle Legal & Business Law client portal.",
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: generalFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqPageSchema) }}
      />
      <h1 className="font-display text-4xl">Frequently Asked Questions</h1>
      <p className="mt-4 text-muted-foreground">
        General questions about working with us. Practice-area-specific
        questions live on each{" "}
        <Link href="/#practice-areas" className="text-primary underline underline-offset-4 hover:no-underline">
          practice area page
        </Link>
        .
      </p>
      <div className="mt-10">
        <Accordion
          items={generalFaqs.map((faq) => ({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
          }))}
        />
      </div>
    </div>
  );
}
