import { PageShell } from "@/components/layout/page-shell";
import { CapabilityNote } from "@/components/workspace/capability-note";
import { ResourceList } from "@/components/workspace/resource-list";
import { loadAuthorizedResources } from "@/lib/retrieval/load";

export default async function ResourcesPage() {
  const resources = await loadAuthorizedResources();

  return (
    <PageShell
      title="Resources"
      description="Only granted, attributed academic materials appear here. Course catalogs and files are not invented."
    >
      {resources.length === 0 ? (
        <CapabilityNote
          title="No authorized sources yet"
          description="Add a granted manifest and incoming file before this library can list anything."
        />
      ) : (
        <ResourceList
          items={resources.map((resource) => ({
            id: resource.id,
            title: resource.title,
            description: `${resource.kind} · ${resource.sourceAttribution}${
              resource.academicYear ? ` · ${resource.academicYear}` : ""
            }`,
          }))}
        />
      )}
    </PageShell>
  );
}
