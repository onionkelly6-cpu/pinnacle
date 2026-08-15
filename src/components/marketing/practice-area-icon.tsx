import {
  HeartHandshake,
  Building2,
  ShieldAlert,
  Home,
  ScrollText,
  Gavel,
  Briefcase,
  Globe,
  Banknote,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import type { PracticeAreaSlug } from "@/lib/content/practice-areas";
import { cn } from "@/lib/utils";

const iconBySlug: Record<PracticeAreaSlug, LucideIcon> = {
  "family-law": HeartHandshake,
  "business-corporate": Building2,
  "personal-injury": ShieldAlert,
  "real-estate": Home,
  "estate-planning": ScrollText,
  "criminal-defense": Gavel,
  "employment-law": Briefcase,
  "immigration-law": Globe,
  bankruptcy: Banknote,
  "intellectual-property": Lightbulb,
};

export function PracticeAreaIcon({
  slug,
  className,
}: {
  slug: PracticeAreaSlug;
  className?: string;
}) {
  const Icon = iconBySlug[slug];
  return <Icon aria-hidden className={cn("h-6 w-6", className)} />;
}
