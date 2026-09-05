export const modelProviders = ["openai", "gemini"] as const;

export type ModelProvider = (typeof modelProviders)[number];

export function resolveModelProvider(
  value: string | undefined = process.env.AI_PROVIDER,
): ModelProvider {
  if (value === "gemini") {
    return "gemini";
  }

  return "openai";
}

export function hasProviderKey(
  provider: ModelProvider,
  source: Record<string, string | undefined> = process.env,
): boolean {
  if (provider === "gemini") {
    return Boolean(source.GEMINI_API_KEY);
  }

  return Boolean(source.OPENAI_API_KEY);
}
