import { PageShell } from "@/components/layout/page-shell";
import { VisionForm } from "@/components/vision/vision-form";
import { inspectAcademicImage } from "@/lib/vision";
import { loadAuthorizedResources } from "@/lib/retrieval/load";

export default async function VisionPage() {
  const resources = await loadAuthorizedResources();
  const authorizedImages = resources.filter(
    (resource) =>
      resource.kind === "slide" ||
      resource.kind === "lecture_note" ||
      resource.kind === "other",
  );
  const gate = inspectAcademicImage(authorizedImages.length);

  return (
    <PageShell
      title="Computer vision"
      description="Images feed the same academic engine as text. The reader will not invent a lecture from an empty corpus."
    >
      <p className="text-sm text-muted-foreground">{gate.text}</p>
      <VisionForm />
    </PageShell>
  );
}
