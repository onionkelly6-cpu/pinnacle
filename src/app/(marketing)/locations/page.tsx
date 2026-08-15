import Image from "next/image";
import { Clock, Phone, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { offices } from "@/lib/content/offices";

export const metadata = {
  title: "Locations",
  description:
    "Fairmont Law Agency office locations, hours, and phone lines. Walk-ins accepted by appointment; portal clients can message their attorney directly.",
};

const officeImages = [
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
];

export default function LocationsPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background/45" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 py-24">
          <p className="font-mono text-sm uppercase tracking-widest text-primary">
            Visit Us
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">Our Offices</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Both offices accept walk-ins by appointment. Portal clients can
            also message their attorney directly instead of calling.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {offices.map((office, i) => (
            <Reveal key={office.name} delay={i * 100}>
              <Card className="lift h-full overflow-hidden p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={officeImages[i % officeImages.length]}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-display text-xl">{office.name}</h2>
                  <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                      {office.hours}
                    </p>
                    {office.phones.map((phone) => (
                      <p key={phone.number} className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                        <span className="font-mono">{phone.number}</span>
                        <span className="text-xs">({phone.label})</span>
                      </p>
                    ))}
                  </div>
                  <a
                    href={`tel:${office.phones[0].number.replace(/[^\d+]/g, "")}`}
                    className="lift mt-6 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    Call {office.name}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
