import { practiceAreas } from "@/lib/content/practice-areas";

// Placeholder demo content. Prior results do not guarantee a similar
// outcome, and every jurisdiction has its own rules on how results can be
// advertised — real figures need counsel sign-off before publishing.
export const caseResults = [
  {
    slug: "multi-vehicle-collision-settlement",
    practiceArea: "personal-injury",
    figure: "£2.4M",
    year: "2024",
    summary: "Seven-figure settlement for a client injured in a multi-vehicle collision.",
    detail:
      "Our client was rear-ended on the motorway by a commercial vehicle and left with a permanent spinal injury. After the insurer's first offer came in low, we built a full liability and damages case for trial, and the carrier settled two weeks before jury selection.",
  },
  {
    slug: "retail-slip-and-fall",
    practiceArea: "personal-injury",
    figure: "£650K",
    year: "2023",
    summary: "Settlement secured against a national retailer after a slip-and-fall injury.",
    detail:
      "Surveillance footage showed a known spill left unaddressed for over 40 minutes. We preserved the evidence before it could be overwritten and used it to force a settlement without filing suit.",
  },
  {
    slug: "series-a-financing",
    practiceArea: "business-corporate",
    figure: "£12M",
    year: "2024",
    summary: "Structured and closed a Series A financing for a first-time founder.",
    detail:
      "We negotiated founder-friendly terms on liquidation preference and board composition, then ran the closing process end to end so our client could stay focused on the business through diligence.",
  },
  {
    slug: "logistics-company-sale",
    practiceArea: "business-corporate",
    figure: "3 Entities",
    year: "2022",
    summary: "Negotiated the sale of a regional logistics company to a national acquirer.",
    detail:
      "The deal spanned three affiliated entities with overlapping ownership. We untangled the cap table, resolved a shareholder dispute that had stalled talks for a year, and closed within the buyer's deadline.",
  },
  {
    slug: "unlawful-search-dismissal",
    practiceArea: "criminal-defense",
    figure: "Dismissed",
    year: "2023",
    summary: "Criminal charges dismissed after successfully challenging an unlawful search.",
    detail:
      "We filed a motion to suppress after identifying that the search exceeded the scope of the warrant. The court agreed, the evidence was excluded, and prosecutors dropped all charges.",
  },
  {
    slug: "aggravated-assault-acquittal",
    practiceArea: "criminal-defense",
    figure: "Acquitted",
    year: "2021",
    summary: "Full acquittal at trial on aggravated assault charges.",
    detail:
      "The prosecution's case rested almost entirely on a single eyewitness. Cross-examination exposed inconsistencies with the initial police report, and the jury returned a not-guilty verdict on all counts.",
  },
  {
    slug: "title-dispute-refinancing",
    practiceArea: "real-estate",
    figure: "£4.1M",
    year: "2023",
    summary: "Resolved a multi-party title dispute ahead of a commercial refinancing deadline.",
    detail:
      "A decades-old easement dispute threatened to sink a refinancing with a hard deadline. We negotiated a settlement with the competing claimant and cleared title with four days to spare.",
  },
  {
    slug: "residential-closings-streak",
    practiceArea: "real-estate",
    figure: "60+",
    year: "Ongoing",
    summary: "Residential purchase and sale transactions closed on schedule.",
    detail:
      "Every closing our real estate team has handled in the last three years has closed on or ahead of its original target date, including several where title issues surfaced late in diligence.",
  },
  {
    slug: "contested-probate-resolution",
    practiceArea: "estate-planning",
    figure: "18 Months",
    year: "2022",
    summary: "Contested probate matter resolved without going to trial.",
    detail:
      "Siblings disputed the validity of a late amendment to their mother's trust. We negotiated a mediated settlement that preserved the family relationship and avoided a public trial over the estate.",
  },
  {
    slug: "family-succession-plan",
    practiceArea: "estate-planning",
    figure: "3 Generations",
    year: "2024",
    summary: "Structured a multi-entity succession plan for a family business.",
    detail:
      "We designed a succession structure spanning three generations of ownership, minimizing inheritance tax exposure while giving the founder's grandchildren a clear, conflict-free path into the business.",
  },
  {
    slug: "cross-border-custody-relocation",
    practiceArea: "family-law",
    figure: "Joint Custody",
    year: "2023",
    summary: "Negotiated a parenting plan preserving joint custody across a cross-border relocation.",
    detail:
      "When our client's co-parent relocated for a new job, we negotiated a revised parenting plan and holiday schedule that kept both parents meaningfully involved, without a contested court battle.",
  },
  {
    slug: "mediated-divorce-timeline",
    practiceArea: "family-law",
    figure: "40% Faster",
    year: "Ongoing",
    summary: "Average case timeline reduction for clients who start with mediation.",
    detail:
      "Clients who begin with structured mediation resolve their divorce, on average, in well under half the time of a fully contested filing, with lower legal fees and fewer surprises along the way.",
  },
  {
    slug: "wrongful-termination-severance",
    practiceArea: "employment-law",
    figure: "3x Severance",
    year: "2024",
    summary: "Negotiated severance nearly triple the employer's initial offer.",
    detail:
      "Our client was let go days before a bonus vested. We identified the timing as evidence of bad faith and used it as leverage to negotiate a severance package worth nearly three times the original offer, without filing suit.",
  },
  {
    slug: "family-green-card-approval",
    practiceArea: "immigration-law",
    figure: "9 Months",
    year: "2024",
    summary: "Family-based green card approved well ahead of the average processing time.",
    detail:
      "A thorough, error-free initial filing avoided the Request for Evidence that typically adds months to family-based cases, getting our client's green card approved in under nine months.",
  },
  {
    slug: "small-business-chapter-11",
    practiceArea: "bankruptcy",
    figure: "Reorganized",
    year: "2023",
    summary: "Guided a small business through Chapter 11 reorganization instead of liquidation.",
    detail:
      "Facing pressure from multiple creditors, our client considered shutting down entirely. We negotiated a confirmed reorganization plan that kept the business operating and its employees paid.",
  },
  {
    slug: "trademark-infringement-enforcement",
    practiceArea: "intellectual-property",
    figure: "Cease & Desist",
    year: "2024",
    summary: "Stopped a competitor from using a confusingly similar brand name within weeks.",
    detail:
      "A regional competitor launched under a name nearly identical to our client's registered mark. A cease-and-desist backed by the registration got a full rebrand commitment within three weeks, no litigation required.",
  },
] as const;

export const caseResultStats = [
  { label: "Recovered for clients (5 yrs)", value: "£19M+" },
  { label: "Matters resolved", value: "230+" },
  { label: "Cases taken to trial-ready posture", value: "100%" },
  { label: "Practice areas represented", value: `${practiceAreas.length}` },
];
