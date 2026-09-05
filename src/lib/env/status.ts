import "server-only";

import { hasProviderKey, resolveModelProvider } from "@/lib/ai/providers";

import { hasPublicSupabaseConfig } from "./public";
import { hasServiceRoleKey } from "./server";

export type EnvStatus = {
  supabasePublicConfigured: boolean;
  supabaseServiceRoleConfigured: boolean;
  aiProviderConfigured: boolean;
};

export function getEnvStatus(): EnvStatus {
  return {
    supabasePublicConfigured: hasPublicSupabaseConfig(),
    supabaseServiceRoleConfigured: hasServiceRoleKey(),
    aiProviderConfigured: hasProviderKey(resolveModelProvider()),
  };
}
