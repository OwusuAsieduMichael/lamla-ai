import "server-only";

import { createClient } from "@supabase/supabase-js";

import { readServerEnv } from "@/lib/env/server";
import { requireServiceRoleKey } from "@/lib/env/service-role";
import type { Database } from "@/types/database";

/**
 * Service-role client. Server-only.
 * Do not import this module from Client Components.
 * Do not use this client to bypass Row Level Security from user requests.
 */
export function createSupabaseAdminClient() {
  const env = readServerEnv();
  const serviceRoleKey = requireServiceRoleKey(env);

  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
