// Placeholder demo content — swap for the real firm's practice area copy
// when it's available. Mirrors the eventual `PracticeArea` table (M2).
export const practiceAreas = [
  {
    slug: "family-law",
    name: "Family Law",
    code: "FL",
    blurb:
      "Divorce, custody, and support matters handled with steady, practical counsel.",
    longDescription:
      "Family law matters are rarely just legal problems: they're personal ones, often unfolding during one of the hardest periods of someone's life. We handle everything from straightforward uncontested divorces to complex custody disputes spanning multiple states, always with an eye toward resolving things without unnecessary conflict where possible, and full trial preparation when it isn't.",
    whyUs: [
      "Attorneys who've clerked in family court and know how judges actually rule",
      "Mediation-first approach that keeps costs and conflict down when appropriate",
      "Direct attorney access through the client portal, no waiting on hold",
    ],
    services: [
      "Divorce & dissolution",
      "Child custody & parenting plans",
      "Child & spousal support",
      "Prenuptial & postnuptial agreements",
      "Adoption",
      "Domestic violence protective orders",
    ],
    processSteps: [
      {
        title: "Initial Consultation",
        body: "We review your situation, goals, and any immediate safety or financial concerns.",
      },
      {
        title: "Filing & Response",
        body: "We prepare and file the necessary petitions, or respond to a filing against you.",
      },
      {
        title: "Discovery & Negotiation",
        body: "We gather financial and custody information and pursue a fair settlement where possible.",
      },
      {
        title: "Resolution",
        body: "Through settlement or trial, we bring the matter to a conclusion and help you plan for what's next.",
      },
    ],
    faqs: [
      {
        q: "How is child custody decided?",
        a: "Courts weigh the best interests of the child, including stability, each parent's involvement, and the child's own preferences depending on age. We help you build a parenting plan that reflects your family's real schedule, not a generic template.",
      },
      {
        q: "Do I have to go to court to get divorced?",
        a: "Not always. Many cases resolve through negotiation or mediation. We prepare every case as if it will be tried, which tends to produce better settlements.",
      },
      {
        q: "How long does a divorce take?",
        a: "Uncontested matters can resolve in a few months; contested matters involving custody or complex assets can take a year or more. We'll give you a realistic estimate after an initial review.",
      },
    ],
  },
  {
    slug: "business-corporate",
    name: "Business & Corporate",
    code: "BC",
    blurb:
      "Formation, contracts, and governance support for growing companies.",
    longDescription:
      "From the first LLC filing to a company's eventual sale, we act as outside counsel for businesses that need a lawyer who understands both the legal risk and the commercial reality. We've represented first-time founders raising a seed round and multi-generational family businesses navigating succession, often in the same week.",
    whyUs: [
      "Founder-friendly deal terms without slowing down your raise",
      "Flat-fee options for routine contract work, not just hourly billing",
      "A single point of contact who already knows your business",
    ],
    services: [
      "Entity formation & structuring",
      "Contract drafting & negotiation",
      "Founder & shareholder agreements",
      "Mergers & acquisitions",
      "Employment agreements & policies",
      "General outside counsel",
    ],
    processSteps: [
      {
        title: "Discovery Call",
        body: "We learn about your business, structure, and immediate legal needs.",
      },
      {
        title: "Documentation",
        body: "We draft or review the governing documents and contracts specific to your situation.",
      },
      {
        title: "Negotiation",
        body: "We represent your interests directly with counterparties, investors, or partners.",
      },
      {
        title: "Ongoing Support",
        body: "Many clients keep us on for periodic review as the business grows.",
      },
    ],
    faqs: [
      {
        q: "What entity type should I form?",
        a: "It depends on your liability exposure, tax situation, and plans for investment. We walk founders through LLC, S-corp, and C-corp tradeoffs before you file anything.",
      },
      {
        q: "Can you serve as our ongoing outside counsel?",
        a: "Yes, many of our business clients retain us for recurring contract review, employment questions, and general legal checkups rather than calling only when there's a crisis.",
      },
      {
        q: "Do you handle disputes between business partners?",
        a: "We do, starting with your governing documents. Most partner disputes are resolved faster and cheaper by enforcing what's already in your operating agreement than by going straight to litigation.",
      },
    ],
  },
  {
    slug: "personal-injury",
    name: "Personal Injury",
    code: "PI",
    blurb:
      "Representation for clients injured by the negligence of others.",
    longDescription:
      "Insurance companies have teams of adjusters working to minimize what they pay. We built our personal injury practice to counter that: investigating thoroughly, documenting damages completely, and preparing every case as if it's going to trial, because that posture is exactly what gets fair settlements.",
    whyUs: [
      "No fee unless we recover for you",
      "We handle all insurer communication so you can focus on recovery",
      "Trial-ready preparation on every case, not just the ones that go to court",
    ],
    services: [
      "Auto & motorcycle accidents",
      "Slip and fall claims",
      "Product liability",
      "Wrongful death",
      "Insurance claim disputes",
      "Medical malpractice referrals",
    ],
    processSteps: [
      {
        title: "Free Case Review",
        body: "We assess what happened, your injuries, and whether you have a viable claim.",
      },
      {
        title: "Investigation",
        body: "We gather records, accident reports, and speak with witnesses.",
      },
      {
        title: "Negotiation with Insurers",
        body: "We handle all communication with insurance companies on your behalf.",
      },
      {
        title: "Trial if Necessary",
        body: "If a fair settlement isn't offered, we're prepared to take your case to trial.",
      },
    ],
    faqs: [
      {
        q: "Do I pay anything up front?",
        a: "No. Personal injury matters are handled on contingency, and we only get paid if you recover.",
      },
      {
        q: "How much is my case worth?",
        a: "It depends on medical costs, lost income, and the severity of your injury. We give a realistic range after reviewing your records, not before.",
      },
      {
        q: "How long do I have to file a claim?",
        a: "Statutes of limitations vary by state and claim type, and some deadlines are much shorter than people expect. Contact us as soon as possible after an injury.",
      },
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    code: "RE",
    blurb:
      "Residential and commercial transactions, leases, and disputes.",
    longDescription:
      "Real estate deals fail at the details: a missed easement, an unreviewed lease clause, a title issue surfacing days before closing. We review, draft, and negotiate the paperwork so those details get caught before they become expensive, on both residential and commercial transactions.",
    whyUs: [
      "A streak of on-time closings even when title issues surface late",
      "Experience on both sides of landlord-tenant disputes",
      "Direct coordination with your lender and title company, not just document review",
    ],
    services: [
      "Residential purchase & sale agreements",
      "Commercial leasing",
      "Title review & disputes",
      "Landlord-tenant matters",
      "Zoning & land use",
      "1031 exchanges",
    ],
    processSteps: [
      {
        title: "Contract Review",
        body: "We review or draft your purchase agreement or lease before you sign.",
      },
      {
        title: "Due Diligence",
        body: "We examine title, survey, and any zoning or use restrictions.",
      },
      {
        title: "Closing",
        body: "We coordinate with the other side and title company to get to a clean closing.",
      },
      {
        title: "Post-Closing Support",
        body: "We're available if disputes or issues surface after the transaction.",
      },
    ],
    faqs: [
      {
        q: "Do I need a lawyer to buy a house?",
        a: "It's not always required, but a review of your purchase agreement and title before closing catches problems most buyers never see until it's too late.",
      },
      {
        q: "Can you help with a lease dispute?",
        a: "Yes, on both the landlord and tenant side, commercial and residential.",
      },
      {
        q: "What's involved in a title dispute?",
        a: "We investigate the chain of title, resolve competing claims, and can pursue or defend a quiet title action if necessary.",
      },
    ],
  },
  {
    slug: "estate-planning",
    name: "Estate Planning",
    code: "EP",
    blurb:
      "Wills, trusts, and probate guidance for individuals and families.",
    longDescription:
      "A good estate plan is written for the people left behind, not just the person signing it. We build wills, trusts, and succession plans that hold up under family pressure and actually reflect what you want, then we're there to guide your executor or trustee through probate or administration when the time comes.",
    whyUs: [
      "Plans built to minimize probate and estate tax exposure",
      "Support for your executor or trustee, not just document drafting",
      "Honest guidance on whether you need a trust or if a will is enough",
    ],
    services: [
      "Wills",
      "Revocable & irrevocable trusts",
      "Powers of attorney & healthcare directives",
      "Probate & trust administration",
      "Estate tax planning",
      "Business succession planning",
    ],
    processSteps: [
      {
        title: "Planning Session",
        body: "We discuss your family, assets, and goals for your estate.",
      },
      {
        title: "Document Drafting",
        body: "We prepare the wills, trusts, and directives that fit your situation.",
      },
      {
        title: "Execution",
        body: "We guide you through signing everything correctly under state law.",
      },
      {
        title: "Administration Support",
        body: "When the time comes, we guide your executor or trustee through probate or trust administration.",
      },
    ],
    faqs: [
      {
        q: "Do I need a trust if I already have a will?",
        a: "Not everyone does. It depends on your assets, family situation, and whether you want to avoid probate. We'll tell you honestly if a will alone is enough.",
      },
      {
        q: "What happens if I die without a will?",
        a: "State intestacy law decides who inherits, which rarely matches what people actually want. We can usually put a basic plan in place quickly.",
      },
      {
        q: "How often should I update my estate plan?",
        a: "After any major life event (marriage, divorce, a new child, a significant change in assets) and at minimum every few years.",
      },
    ],
  },
  {
    slug: "criminal-defense",
    name: "Criminal Defense",
    code: "CD",
    blurb: "Defense counsel across misdemeanor and felony matters.",
    longDescription:
      "The period between an arrest and a resolution is when the most damage can be done or avoided. We move quickly to protect your rights, challenge the state's evidence where it's vulnerable, and negotiate from a position informed by genuine trial preparation, because prosecutors offer better deals to defendants who are actually prepared to go to trial.",
    whyUs: [
      "Immediate response when you've been arrested or charged",
      "A track record of dismissals and acquittals, not just plea deals",
      "We prepare every case for trial, which changes the negotiation from day one",
    ],
    services: [
      "Misdemeanor & felony defense",
      "DUI/DWI defense",
      "Drug charges",
      "Expungement & record sealing",
      "Juvenile defense",
      "Post-conviction relief",
    ],
    processSteps: [
      {
        title: "Immediate Consultation",
        body: "We move quickly to understand the charges and any deadlines.",
      },
      {
        title: "Investigation",
        body: "We review evidence, police conduct, and any procedural issues.",
      },
      {
        title: "Negotiation",
        body: "We pursue reduced charges or dismissal where the facts support it.",
      },
      {
        title: "Trial",
        body: "If a fair resolution isn't offered, we're prepared to defend you at trial.",
      },
    ],
    faqs: [
      {
        q: "Should I talk to the police without a lawyer?",
        a: "Generally, no. Politely decline to answer questions beyond identifying yourself and ask for an attorney immediately.",
      },
      {
        q: "Can my record be expunged?",
        a: "It depends on the charge, the outcome, and your state's rules. We can review your record and tell you what's realistically possible.",
      },
      {
        q: "What happens at an arraignment?",
        a: "You'll hear the charges against you and enter a plea. We prepare you for exactly what to expect beforehand so there are no surprises.",
      },
    ],
  },
  {
    slug: "employment-law",
    name: "Employment Law",
    code: "EL",
    blurb:
      "Workplace rights and employer compliance, from wrongful termination to policy drafting.",
    longDescription:
      "Workplace disputes are rarely simple. They involve ongoing relationships, sensitive documentation, and often a real power imbalance between employee and employer. We represent individuals navigating termination, discrimination, and severance negotiations, as well as employers who want policies that hold up before a dispute ever starts.",
    whyUs: [
      "We negotiate severance as a starting point, not a final offer",
      "Experience on both the employee and employer side of a dispute",
      "Fast response when a termination or notice has a filing deadline attached",
    ],
    services: [
      "Wrongful termination claims",
      "Workplace discrimination & harassment",
      "Wage & hour disputes",
      "Non-compete & non-solicit agreements",
      "Severance negotiation",
      "Employee handbook & policy drafting",
    ],
    processSteps: [
      {
        title: "Initial Consultation",
        body: "We review your employment history, the conduct at issue, and any documentation you have.",
      },
      {
        title: "Investigation & Demand",
        body: "We gather records and, where appropriate, send a demand letter to the employer or their counsel.",
      },
      {
        title: "Negotiation",
        body: "Most matters resolve through negotiated severance or settlement without litigation.",
      },
      {
        title: "Litigation if Necessary",
        body: "If a fair resolution isn't offered, we're prepared to file and litigate.",
      },
    ],
    faqs: [
      {
        q: "Is my termination illegal?",
        a: "Most employment is at-will, so termination itself often isn't illegal, but termination motivated by discrimination, retaliation, or breach of contract can be. We review the facts before giving you a straight answer.",
      },
      {
        q: "Can I negotiate my severance package?",
        a: "Yes, severance offers are usually a starting point, not a final offer. We routinely negotiate better terms, including extended pay and neutral references.",
      },
      {
        q: "What should I do before signing a non-compete?",
        a: "Have it reviewed before you sign, not after you leave. Enforceability varies significantly by state and by how narrowly the agreement is written.",
      },
    ],
  },
  {
    slug: "immigration-law",
    name: "Immigration Law",
    code: "IM",
    blurb:
      "Visas, green cards, and citizenship guidance for individuals, families, and employers.",
    longDescription:
      "Immigration cases live and die on paperwork accuracy and timing. We prepare every filing to withstand scrutiny the first time, whether that's a family petition, an employment-based visa, or a defense against removal, because a single avoidable error can cost a client years.",
    whyUs: [
      "Complete, error-checked filings that avoid unnecessary Requests for Evidence",
      "Experience across family, employment, and removal defense matters",
      "Realistic timelines given up front, not optimistic guesses",
    ],
    services: [
      "Family-based green cards",
      "Employment-based visas (H-1B, L-1, O-1)",
      "Naturalization & citizenship",
      "Deportation & removal defense",
      "Asylum applications",
      "Employer compliance (I-9, E-Verify)",
    ],
    processSteps: [
      {
        title: "Case Assessment",
        body: "We review your immigration history and goals to identify the right pathway.",
      },
      {
        title: "Filing",
        body: "We prepare and file petitions with complete, accurate documentation.",
      },
      {
        title: "Response to Requests for Evidence",
        body: "If the government requests more evidence, we respond quickly and thoroughly.",
      },
      {
        title: "Approval & Next Steps",
        body: "We help you plan for what comes next, from consular processing to citizenship.",
      },
    ],
    faqs: [
      {
        q: "How long does a green card take?",
        a: "It depends heavily on the category and your country of origin: some family categories take under a year, others many years due to backlogs. We give you a realistic timeline up front.",
      },
      {
        q: "Can I work while my green card is pending?",
        a: "Often yes, with the right interim work authorization. We make sure that paperwork is filed alongside your primary petition.",
      },
      {
        q: "What happens if I receive a Notice to Appear?",
        a: "Contact us immediately. Deadlines in removal proceedings are strict, and missing one can result in an in-absentia deportation order.",
      },
    ],
  },
  {
    slug: "bankruptcy",
    name: "Bankruptcy",
    code: "BK",
    blurb: "Debt relief and reorganization for individuals and small businesses.",
    longDescription:
      "Bankruptcy isn't the end of a financial story. For most clients, it's the tool that stops the bleeding and lets them rebuild. We help individuals and small businesses choose the right chapter, protect what exemptions allow, and come out the other side with a plan instead of a stack of collection calls.",
    whyUs: [
      "Clear guidance on what you'll keep before you ever file",
      "Small business reorganization experience, not just consumer filings",
      "The automatic stay is filed fast enough to actually stop a pending action",
    ],
    services: [
      "Chapter 7 liquidation",
      "Chapter 13 repayment plans",
      "Small business Chapter 11",
      "Creditor negotiation",
      "Foreclosure defense",
      "Student loan discharge review",
    ],
    processSteps: [
      {
        title: "Financial Review",
        body: "We review your debts, assets, and income to identify the right chapter and strategy.",
      },
      {
        title: "Filing",
        body: "We prepare and file your petition and schedules, triggering the automatic stay that halts collection.",
      },
      {
        title: "Meeting of Creditors",
        body: "We prepare you for and attend the required creditor meeting.",
      },
      {
        title: "Discharge or Plan Confirmation",
        body: "We carry the case through to discharge or a confirmed repayment plan.",
      },
    ],
    faqs: [
      {
        q: "Will I lose my house or car?",
        a: "Not necessarily. Exemptions protect a meaningful amount of equity, and Chapter 13 in particular is often used specifically to catch up on a mortgage while keeping the home.",
      },
      {
        q: "How long does bankruptcy stay on my credit report?",
        a: "Chapter 7 stays up to 10 years, Chapter 13 up to 7, but many clients see their score begin recovering within a couple of years as they rebuild.",
      },
      {
        q: "Can bankruptcy stop a foreclosure?",
        a: "Filing triggers an automatic stay that halts a foreclosure sale immediately, giving you time to catch up or negotiate.",
      },
    ],
  },
  {
    slug: "intellectual-property",
    name: "Intellectual Property",
    code: "IP",
    blurb:
      "Trademark, copyright, and trade secret protection for growing businesses.",
    longDescription:
      "Your brand and your ideas are assets, and like any asset, they need to be protected before someone else claims them. We handle trademark and copyright registration, licensing, and enforcement for businesses that are growing fast enough that their IP is starting to matter.",
    whyUs: [
      "Clearance searches before you file or launch, not after a conflict surfaces",
      "Enforcement that starts with a cease-and-desist, not an expensive lawsuit",
      "IP due diligence support when you're raising money or getting acquired",
    ],
    services: [
      "Trademark search & registration",
      "Copyright registration",
      "Trade secret protection",
      "Licensing agreements",
      "Cease-and-desist enforcement",
      "IP due diligence for transactions",
    ],
    processSteps: [
      {
        title: "Clearance Search",
        body: "We search existing marks and filings to assess your risk before you file or launch.",
      },
      {
        title: "Filing",
        body: "We prepare and file your application with the appropriate office.",
      },
      {
        title: "Office Actions",
        body: "We respond to any examiner objections to keep your application moving.",
      },
      {
        title: "Registration & Enforcement",
        body: "Once registered, we help you monitor and enforce your rights against infringers.",
      },
    ],
    faqs: [
      {
        q: "Do I need a trademark if I already have an LLC?",
        a: "Yes, forming an LLC protects your business name in your state for entity purposes only; it does not stop someone else from using a similar brand name elsewhere or registering it federally.",
      },
      {
        q: "How long does trademark registration take?",
        a: "Typically eight months to over a year depending on the trademark office's backlog and whether the examiner raises objections.",
      },
      {
        q: "What's the difference between a copyright and a trademark?",
        a: "Copyright protects creative works like writing, code, and designs; trademark protects brand identifiers like names and logos. Many businesses need both.",
      },
    ],
  },
] as const;

export type PracticeAreaSlug = (typeof practiceAreas)[number]["slug"];
