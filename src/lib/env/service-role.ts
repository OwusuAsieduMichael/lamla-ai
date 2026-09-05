import { EnvConfigError } from "./errors";
import type { ServerEnv } from "./schemas";

export function requireServiceRoleKey(env: ServerEnv): string {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new EnvConfigError(
      "SUPABASE_SERVICE_ROLE_KEY is required for this server-only operation and must never be exposed to the browser.",
    );
  }

  return env.SUPABASE_SERVICE_ROLE_KEY;
}

export function isServiceRoleKeyPresent(key: string | undefined): boolean {
  return typeof key === "string" && key.length > 0;
}
