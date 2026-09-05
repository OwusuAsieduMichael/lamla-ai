import "server-only";

import { EnvConfigError, formatMissingEnvMessage } from "./errors";
import { readPublicEnvSource } from "./public";
import { isServiceRoleKeyPresent } from "./service-role";
import {
  collectInvalidFields,
  serverEnvSchema,
  type ServerEnv,
} from "./schemas";

export { requireServiceRoleKey } from "./service-role";

export function readServerEnvSource(): Record<string, string | undefined> {
  return {
    ...readPublicEnvSource(),
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    AI_PROVIDER: process.env.AI_PROVIDER,
  };
}

export function readServerEnv(
  source: Record<string, string | undefined> = readServerEnvSource(),
): ServerEnv {
  const result = serverEnvSchema.safeParse(source);

  if (!result.success) {
    throw new EnvConfigError(
      formatMissingEnvMessage(collectInvalidFields(result.error)),
    );
  }

  return result.data;
}

export function hasServiceRoleKey(
  source: Record<string, string | undefined> = readServerEnvSource(),
): boolean {
  return isServiceRoleKeyPresent(source.SUPABASE_SERVICE_ROLE_KEY);
}
