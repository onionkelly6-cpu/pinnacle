import { notFound } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import { CaseTimeline } from "@/components/portal/case-timeline";
import { DocumentList } from "@/components/portal/document-list";
import { LiveMatterUpdates } from "@/components/portal/live-matter-updates";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { auth } from "@/lib/auth";
import { getDocumentsForMatter, getSignedDownloadHref } from "@/lib/demo-documents";
import { getMatterById, MATTER_STAGES } from "@/lib/demo-matters";
import { getClientByEmail } from "@/lib/demo-clients";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MatterDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const matter = await getMatterById(id);
  const client = session?.user?.email ? getClientByEmail(session.user.email) : undefined;

  if (!matter || !client || matter.clientId !== client.id) {
    notFound();
  }

  // Clients only ever see documents the attorney explicitly shared with
  // them — internal-only documents never appear here.
  const allDocuments = await getDocumentsForMatter(id);
  const documents = allDocuments.filter((doc) => doc.visibility === "client");

  return (
    <div>
      <Reveal>
        <Card className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-primary">
              {matter.caseNumber}
            </p>
            <h1 className="mt-1 font-display text-3xl">{matter.title}</h1>
          </div>
          <LiveMatterUpdates matterId={id} />
        </Card>
      </Reveal>
      <p className="mt-4 text-muted-foreground">
        Status changes and shared documents appear here as soon as your
        attorney updates them, no need to refresh.
      </p>

      <div className="mt-10">
        <Tabs
          tabs={[
            {
              id: "timeline",
              label: "Timeline",
              content: (
                <div className="py-4">
                  <CaseTimeline stages={[...MATTER_STAGES]} currentStage={matter.status} />
                </div>
              ),
            },
            {
              id: "documents",
              label: "Documents",
              content: (
                <DocumentList
                  documents={documents}
                  getDownloadHref={(doc) => getSignedDownloadHref(doc.id)}
                />
              ),
            },
            {
              id: "messages",
              label: "Messages",
              content: (
                <Card className="text-center text-muted-foreground">
                  No messages yet. Threaded, case-scoped messaging with your
                  attorney is built in Milestone 6.
                </Card>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
