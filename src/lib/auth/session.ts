import "server-only";

import { hasPublicSupabaseConfig } from "@/lib/env/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/academic";

export type AuthProfile = {
  id: string;
  displayName: string | null;
  role: UserRole;
  programmeId: string | null;
  programmeName: string | null;
};

export type AuthSession = {
  configured: boolean;
  email: string | null;
  profile: AuthProfile | null;
};

export async function getAuthSession(): Promise<AuthSession> {
  if (!hasPublicSupabaseConfig()) {
    return { configured: false, email: null, profile: null };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { configured: true, email: null, profile: null };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, display_name, role, programme_id")
      .eq("id", user.id)
      .maybeSingle();

    let programmeName: string | null = null;

    if (profile?.programme_id) {
      const { data: programme } = await supabase
        .from("programmes")
        .select("name")
        .eq("id", profile.programme_id)
        .maybeSingle();

      programmeName = programme?.name ?? null;
    }

    return {
      configured: true,
      email: user.email ?? null,
      profile: profile
        ? {
            id: profile.id,
            displayName: profile.display_name,
            role: profile.role,
            programmeId: profile.programme_id,
            programmeName,
          }
        : null,
    };
  } catch {
    return { configured: false, email: null, profile: null };
  }
}
