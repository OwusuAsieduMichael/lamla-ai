import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { CapabilityNote } from "@/components/workspace/capability-note";
import { ResourceList } from "@/components/workspace/resource-list";
import { learningModeCopy, learningModes } from "@/config/workspace";
import { recommendNextStudy } from "@/lib/learning";
import { loadAuthorizedChunks } from "@/lib/retrieval/load";

export default async function LearnPage() {
  const recommendations = recommendNextStudy(await loadAuthorizedChunks());

  return (
    <PageShell
      title="Learning"
      description="Study actions use the same grounded engine. Recommendations come from authorized source importance, not a guessed syllabus."
    >
      <div className="flex flex-wrap gap-2">
        {learningModes
          .filter((mode) => mode !== "ask")
          .map((mode) => (
            <Link
              key={mode}
              href={`/workspace?channel=text`}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {learningModeCopy[mode].label}
            </Link>
          ))}
      </div>

      {recommendations.length === 0 ? (
        <CapabilityNote
          title="Nothing to recommend"
          description="Study guidance appears after authorized sources exist and can be ranked. LAMLA will not invent student ability scores."
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
