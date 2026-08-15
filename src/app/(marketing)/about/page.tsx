import Image from "next/image";
import { testimonials } from "@/lib/content/testimonials";
import { practiceAreas } from "@/lib/content/practice-areas";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "About",
  description:
    "Fairmont Law Agency has served clients for over 30 years across family law, business, personal injury, real estate, estate planning, and more, with a client portal that always shows you where your matter stands.",
};

const stats = [
  { label: "Years serving clients", value: "30+" },
  { label: "Matters opened", value: "4,200+" },
  { label: "Practice areas", value: `${practiceAreas.length}` },
  { label: "Client portal uptime", value: "99.9%" },
];

const values = [
  {
    title: "Responsive Communication",
    body: "You will never wonder if your call was received. Every attorney and staff member commits to a same-business-day response.",
  },
  {
    title: "Transparent Billing",
    body: "Fee arrangements are agreed to in writing before work begins, whether that's hourly, flat-fee, or contingency.",
  },
  {
    title: "Real Trial Experience",
    body: "Our attorneys prepare every matter as though it could go to trial, which tends to produce better settlements too.",
  },
  {
    title: "A Portal That Keeps You Informed",
    body: "Status changes, documents, and messages all land in one secure place, not scattered across email and voicemail.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/95 to-background/55" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 py-24">
          <h1 className="font-display text-4xl">About Fairmont Law Agency</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Fairmont Law Agency was founded on a simple premise: clients deserve
            a straight answer and to always know where their matter stands.
            Three decades later, that&apos;s still what sets us apart: steady
            counsel, clearly communicated, backed by a portal that keeps you
            informed without having to ask.
          </p>
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

      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="font-display text-3xl">Why Fairmont Law Agency</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={(i % 4) * 80}>
              <div>
                <h3 className="font-display text-lg">{value.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{value.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <h2 className="font-display text-3xl">What Clients Say</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <Reveal key={testimonial.quote} delay={i * 80}>
                <div className="lift h-full rounded-sm border border-border bg-background p-6">
                  <p className="text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {testimonial.context}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Testimonials reflect individual experiences and do not guarantee
            a similar outcome for your matter.
          </p>
        </div>
      </section>
    </div>
  );
}
