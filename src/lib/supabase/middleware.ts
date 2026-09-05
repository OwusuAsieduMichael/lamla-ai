import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

import { hasPublicSupabaseConfig, readPublicEnv } from "@/lib/env/public";
import type { Database } from "@/types/database";

/**
 * Session-refresh helper used by root middleware.ts.
 * Safe when public Supabase values are unset.
 */
export async function updateSupabaseSession(request: NextRequest): Promise<{
  response: NextResponse;
  user: User | null;
}> {
  const response = NextResponse.next({
    request,
  });

  if (!hasPublicSupabaseConfig()) {
    return { response, user: null };
  }

  const env = readPublicEnv();

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }

          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
