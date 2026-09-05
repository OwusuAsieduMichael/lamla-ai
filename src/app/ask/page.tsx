import { AskForm } from "@/components/ask/ask-form";
import { PageShell } from "@/components/layout/page-shell";

export default function AskPage() {
  return (
    <PageShell
      title="Text workspace"
      description="Ask a question in academic context. LAMLA retrieves authorized chunks first and refuses when none exist."
    >
      <AskForm />
    </PageShell>
  );
}
