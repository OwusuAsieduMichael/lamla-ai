import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { CapabilityNote } from "@/components/workspace/capability-note";
import { ResourceList } from "@/components/workspace/resource-list";
import { getAuthSession } from "@/lib/auth";
import { loadOwnSavedItems } from "@/lib/workspace/persist";

export default async function SavedPage() {
  const session = await getAuthSession();

  if (session.configured && !session.email) {
    redirect("/login?next=/saved");
  }

  const items = await loadOwnSavedItems();

  return (
    <PageShell
      title="Saved"
      description="Responses and resources you bookmark. Nothing is stored until you sign in and save."
    >
      {!session.configured ? (
        <CapabilityNote
          title="Auth is not connected"
          description="Set the public Supabase values before saved items can persist."
        />
      ) : items.length === 0 ? (
        <CapabilityNote
          title="Nothing saved yet"
          description="Use Save response in the workspace after a grounded answer exists."
        />
      ) : (
        <ResourceList
          items={items.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.body,
          }))}
        />
      )}
    </PageShell>
  );
}
