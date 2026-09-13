import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { CapabilityNote } from "@/components/workspace/capability-note";
import { ResourceList } from "@/components/workspace/resource-list";
import { getAuthSession } from "@/lib/auth";
import { loadOwnHistory } from "@/lib/workspace/persist";

export default async function HistoryPage() {
  const session = await getAuthSession();

  if (session.configured && !session.email) {
    redirect("/login?next=/history");
  }

  const items = await loadOwnHistory();

  return (
    <PageShell
      title="History"
      description="Your recent questions. Unsigned sessions are not stored."
    >
      {!session.configured ? (
        <CapabilityNote
          title="Auth is not connected"
          description="Set the public Supabase values before query history can persist."
        />
      ) : items.length === 0 ? (
        <CapabilityNote
          title="No questions yet"
          description="Ask from the workspace while signed in to see a history here."
        />
      ) : (
        <ResourceList
          items={items.map((item) => ({
            id: item.id,
            title: item.query,
            description: `${item.channel} · ${item.mode}${
              item.refused ? " · refused" : ""
            }`,
          }))}
        />
      )}
    </PageShell>
  );
}
