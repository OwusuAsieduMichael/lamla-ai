import "server-only";

import { getAuthSession } from "@/lib/auth";
import { hasPublicSupabaseConfig } from "@/lib/env/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function recordLearningEvent(kind: string): Promise<void> {
  if (!hasPublicSupabaseConfig()) {
    return;
  }

  const session = await getAuthSession();

  if (!session.profile) {
    return;
  }

  try {
    const supabase = await createSupabaseServerClient();
    await supabase.from("learning_events").insert({
      profile_id: session.profile.id,
      kind,
    });
  } catch {
    // Learning telemetry must not block a grounded answer.
  }
}
