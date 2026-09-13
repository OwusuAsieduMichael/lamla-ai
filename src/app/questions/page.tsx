import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { CapabilityNote } from "@/components/workspace/capability-note";
import { ResourceList } from "@/components/workspace/resource-list";
import { loadAuthorizedPastQuestions } from "@/lib/questions";

type QuestionsPageProps = {
  searchParams: Promise<{
    course?: string;
    year?: string;
    topic?: string;
    concept?: string;
  }>;
};

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
  const filters = await searchParams;
  const papers = await loadAuthorizedPastQuestions({
    courseCode: filters.course,
    academicYear: filters.year,
    topic: filters.topic,
    concept: filters.concept,
  });

  return (
    <PageShell
      title="Past questions"
      description="Past papers must be authorized and attributed. Filters stay empty until those records exist."
    >
      <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" method="get">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Course code</span>
          <input
            name="course"
            defaultValue={filters.course ?? ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Only if on file"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Year</span>
          <input
            name="year"
            defaultValue={filters.year ?? ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Academic year"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Topic</span>
          <input
            name="topic"
            defaultValue={filters.topic ?? ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Authorized topic"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Concept</span>
          <input
            name="concept"
            defaultValue={filters.concept ?? ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Authorized concept"
          />
        </label>
        <div className="sm:col-span-2 lg:col-span-4">
          <Button type="submit" variant="outline" size="sm">
            Apply filters
          </Button>
        </div>
      </form>

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
            description: `${paper.sourceAttribution}${
              paper.academicYear ? ` · ${paper.academicYear}` : ""
            }${paper.courseCode ? ` · ${paper.courseCode}` : ""}${
              paper.itemCount ? ` · ${paper.itemCount} items` : ""
            }`,
          }))}
        />
      )}
    </PageShell>
  );
}
