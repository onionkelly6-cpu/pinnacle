import { notFound } from "next/navigation";
import { User } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { CaseTimeline } from "@/components/portal/case-timeline";
import { DocumentList } from "@/components/portal/document-list";
import { DocumentUploadForm } from "@/components/portal/document-upload-form";
import { MatterStatusControl } from "@/components/portal/matter-status-control";
import { LiveMatterUpdates } from "@/components/portal/live-matter-updates";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { auth } from "@/lib/auth";
import { getDocumentsForMatter, getSignedDownloadHref } from "@/lib/demo-documents";
import { getMatterById, MATTER_STAGES } from "@/lib/demo-matters";
import { getClientById } from "@/lib/demo-clients";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FirmMatterDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const matter = await getMatterById(id);

  // Belt-and-suspenders on top of proxy.ts: this page is only meaningful
  // for the specific attorney assigned to this matter.
  if (!matter || matter.attorney !== session?.user?.name) {
    notFound();
  }

  const client = getClientById(matter.clientId);
  const documents = await getDocumentsForMatter(id);

  return (
    <div>
      <Reveal>
        <Card className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-primary">
              {matter.caseNumber}
            </p>
            <h1 className="mt-1 font-display text-3xl">{matter.title}</h1>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 py-1 pl-1 pr-3 text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                <User className="h-3.5 w-3.5" aria-hidden />
              </span>
              {client?.name ?? "Unknown"}
            </span>
          </div>
          <div className="flex flex-col items-end gap-3">
            <LiveMatterUpdates matterId={id} />
            <MatterStatusControl matterId={id} currentStatus={matter.status} />
          </div>
        </Card>
      </Reveal>
      <p className="mt-4 text-sm text-muted-foreground">
        Status changes and shared documents update this client&apos;s
        dashboard live, no refresh needed.
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
                <div className="space-y-6">
                  <DocumentUploadForm matterId={id} />
                  <DocumentList
                    documents={documents}
                    getDownloadHref={(doc) => getSignedDownloadHref(doc.id)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Documents metadata is stored now. Uploads don&apos;t persist
                    real file bytes yet, downloads serve placeholder content
                    for anything not seeded, but they still go through the
                    same short-lived signed URLs production will use against
                    real object storage (Milestone 6).
                  </p>
                </div>
              ),
            },
            {
              id: "messages",
              label: "Messages",
              content: (
                <Card className="text-center text-muted-foreground">
                  No messages yet. Case-scoped messaging lands in Milestone 6.
                </Card>
              ),
            },
            {
              id: "client",
              label: "Client Info",
              content: (
                <Card className="text-muted-foreground">
                  <p className="text-foreground">{client?.name}</p>
                  <p className="mt-1 text-sm">{client?.email}</p>
                  <p className="mt-4 text-xs">
                    Full client contact/history renders here once matters are
                    backed by real `Client` records in Milestone 5.
                  </p>
                </Card>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
