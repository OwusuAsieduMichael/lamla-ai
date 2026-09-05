import { EnvConfigError, formatMissingEnvMessage } from "./errors";
import {
  collectInvalidFields,
  publicEnvSchema,
  type PublicEnv,
} from "./schemas";

export function readPublicEnvSource(): Record<string, string | undefined> {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

export function readPublicEnv(
  source: Record<string, string | undefined> = readPublicEnvSource(),
): PublicEnv {
  const result = publicEnvSchema.safeParse(source);

  if (!result.success) {
    throw new EnvConfigError(
      formatMissingEnvMessage(collectInvalidFields(result.error)),
    );
  }

  return result.data;
}

export function hasPublicSupabaseConfig(
  source: Record<string, string | undefined> = readPublicEnvSource(),
): boolean {
  return publicEnvSchema.safeParse(source).success;
}
