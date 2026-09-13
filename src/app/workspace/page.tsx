import { Suspense } from "react";

import { PageShell } from "@/components/layout/page-shell";
import { WorkspacePanel } from "@/components/workspace/workspace-panel";
import { getAuthSession } from "@/lib/auth";

export default async function WorkspacePage() {
  const session = await getAuthSession();

  return (
    <PageShell
      title="AI workspace"
      description="Ask, inspect, or speak. LAMLA retrieves authorized chunks first and refuses when none exist."
    >
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading workspace…</p>}>
        <WorkspacePanel signedIn={Boolean(session.profile)} />
      </Suspense>
    </PageShell>
  );
}
