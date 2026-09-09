// General, firm-wide FAQ shown on the home page. Practice-area-specific
// FAQs live alongside each area in practice-areas.ts.
export const generalFaqs = [
  {
    id: "consultation",
    question: "Do you offer a free initial consultation?",
    answer:
      "Yes, for most new matters. Submit the contact form and our intake team will confirm details and schedule a time.",
  },
  {
    id: "areas-served",
    question: "What areas do you serve?",
    answer:
      "Our attorneys are licensed in England and Wales. If your matter is outside that jurisdiction, we can often refer you to trusted co-counsel.",
  },
  {
    id: "billing",
    question: "How does billing work?",
    answer:
      "It depends on the matter. Personal injury cases are handled on contingency; most other matters are billed hourly or with a flat fee agreed to in advance, in writing, before we start.",
  },
  {
    id: "portal",
    question: "What is the client portal?",
    answer:
      "Once we open your matter, you get secure access to your case's status, key dates, shared documents, and direct messaging with your legal team, so there's no more guessing where things stand.",
  },
  {
    id: "timeline",
    question: "How long will my matter take?",
    answer:
      "It varies enormously by practice area and complexity. We give every client a realistic estimate after reviewing the specifics, and we update it if circumstances change.",
  },
  {
    id: "first-meeting",
    question: "What should I bring to my first meeting?",
    answer:
      "Any documents related to your matter (contracts, correspondence, police or medical reports, prior court filings) plus a photo ID. If you're not sure something's relevant, bring it anyway and we'll sort through it together.",
  },
  {
    id: "virtual-consultations",
    question: "Do you offer virtual or phone consultations?",
    answer:
      "Yes. Most initial consultations can be done by phone or video, and many clients handle their entire matter with us without ever needing to visit an office in person.",
  },
  {
    id: "portal-access",
    question: "How do I access my client portal?",
    answer:
      "Once your matter is opened, we'll email you an invitation to set up your portal login. From there you can check status, view documents, and message your legal team from any device.",
  },
] as const;
