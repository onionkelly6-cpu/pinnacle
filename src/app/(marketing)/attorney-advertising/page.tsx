export const metadata = {
  title: "Attorney Advertising Disclaimer",
  description: "Required attorney advertising disclosures for Fairmont Law Agency.",
};

export default function AttorneyAdvertisingPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-display text-4xl">Attorney Advertising Disclaimer</h1>
      <p className="mt-6 text-muted-foreground">
        This website is attorney advertising. Prior results do not guarantee
        a similar outcome. Placeholder copy: the real disclaimer must be
        reviewed against the advertising rules of every jurisdiction Fairmont
        Law Agency is licensed in before this site goes live with real
        content.
      </p>
    </div>
  );
}
