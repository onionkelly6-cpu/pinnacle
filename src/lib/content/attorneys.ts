// Placeholder demo content — swap for real attorney bios when available.
// Mirrors the eventual `Attorney` table (M2).
export const attorneys = [
  {
    slug: "margaret-wills",
    name: "Margaret Wills",
    title: "Founding Partner",
    image: undefined as string | undefined,
    practiceAreas: ["family-law", "immigration-law"],
    bio: "Margaret co-founded the firm on the idea that clients deserve a straight answer, not a runaround.",
    longBio:
      "Margaret has spent over two decades advising families through divorce, custody, and immigration matters, from straightforward uncontested filings to complex cross-border cases. She's known for translating dense legal language into a decision clients can actually make.",
    email: "margaret.wills@pinnaclelegal.example",
    education: [
      { school: "University College London", degree: "JD", year: "2001" },
      { school: "London School of Economics", degree: "B.A., Political Science", year: "1998" },
    ],
    barAdmissions: ["Germany"],
    notableMatters: [
      "Negotiated a parenting plan preserving joint custody across a cross-border relocation",
      "Represented a family through a complex sponsorship and permanent residency application",
    ],
  },
  {
    slug: "daniel-weiner",
    name: "Daniel Weiner",
    title: "Founding Partner",
    image: undefined as string | undefined,
    practiceAreas: ["business-corporate", "employment-law"],
    bio: "Daniel advises founders and employers on the legal decisions that shape a growing business.",
    longBio:
      "Daniel has spent two decades advising business owners on formation, contracts, and workplace policy, helping clients avoid disputes before they start and resolve them efficiently when they can't.",
    email: "daniel.weiner@pinnaclelegal.example",
    education: [
      { school: "King's College London", degree: "JD", year: "2002" },
      { school: "University of Warwick", degree: "B.A., Economics", year: "1999" },
    ],
    barAdmissions: ["Germany"],
    notableMatters: [
      "Advised a founding team through a Series A financing",
      "Negotiated the sale of a regional logistics company to a national acquirer",
    ],
  },
  {
    slug: "richard-worsfold",
    name: "Richard Worsfold",
    title: "Attorney at Law, Head of Wills, Estates and Trusts",
    image: undefined as string | undefined,
    practiceAreas: ["estate-planning"],
    bio: "Richard leads the Wills, Estates and Trusts practice at Pinnacle Legal & Business Law, advising clients across Germany on wills, estate planning, and trust administration.",
    longBio:
      "Richard Worsfold, Esq. heads the Wills, Estates and Trusts group at Pinnacle Legal & Business Law, based in Berlin. He advises individuals and families on wills, estate planning, and trust administration.",
    email: "richard.worsfold.esq@outlook.com",
    education: [] as { school: string; degree: string; year: string }[],
    barAdmissions: ["Germany"],
    notableMatters: [] as string[],
  },
] as const;

export type AttorneySlug = (typeof attorneys)[number]["slug"];
