import { PageShell } from "@/components/layout/page-shell";
import { CapabilityNote } from "@/components/workspace/capability-note";
import { ResourceList } from "@/components/workspace/resource-list";
import { recommendNextStudy } from "@/lib/learning";
import { loadAuthorizedChunks } from "@/lib/retrieval/load";

export default async function LearnPage() {
  const recommendations = recommendNextStudy(await loadAuthorizedChunks());

  return (
    <PageShell
      title="Learning engine"
      description="Recommendations come from authorized source importance, not from a guessed KNUST syllabus."
    >
      {recommendations.length === 0 ? (
        <CapabilityNote
          title="Nothing to recommend"
          description="Study guidance appears after authorized sources exist and can be ranked."
        />
      ) : (
        <ResourceList
          items={recommendations.map((item) => ({
            id: item.sourceTitle,
            title: item.title,
            description: item.reason,
          }))}
        />
      )}
    </PageShell>
  );
}
