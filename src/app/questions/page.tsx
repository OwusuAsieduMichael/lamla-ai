import { PageShell } from "@/components/layout/page-shell";
import { CapabilityNote } from "@/components/workspace/capability-note";
import { ResourceList } from "@/components/workspace/resource-list";
import { loadAuthorizedPastQuestions } from "@/lib/questions";

export default async function QuestionsPage() {
  const papers = await loadAuthorizedPastQuestions();

  return (
    <PageShell
      title="Past question intelligence"
      description="Past papers must be authorized and attributed. This view stays empty until those records exist."
    >
      {papers.length === 0 ? (
        <CapabilityNote
          title="No past questions on file"
          description="LAMLA will not invent exam papers or marking schemes for KNUST Computer Science."
        />
      ) : (
        <ResourceList
          items={papers.map((paper) => ({
            id: `${paper.title}-${paper.academicYear ?? "undated"}`,
            title: paper.title,
            description: `${paper.sourceAttribution}${paper.academicYear ? ` · ${paper.academicYear}` : ""}`,
          }))}
        />
      )}
    </PageShell>
  );
}
