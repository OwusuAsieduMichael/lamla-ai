import { hasProviderKey, resolveModelProvider } from "./providers";

export type GenerateModelInput = {
  prompt: string;
  system: string;
  env?: Record<string, string | undefined>;
};

export async function generateModelText({
  prompt,
  system,
  env = process.env,
}: GenerateModelInput): Promise<string> {
  const provider = resolveModelProvider(env.AI_PROVIDER);

  if (!hasProviderKey(provider, env)) {
    throw new Error("provider_not_configured");
  }

  if (provider === "gemini") {
    return generateGeminiText(prompt, system, env.GEMINI_API_KEY as string);
  }

  return generateOpenAiText(prompt, system, env.OPENAI_API_KEY as string);
}

export function createConfiguredGenerator(
  env: Record<string, string | undefined> = process.env,
): ((prompt: string, system: string) => Promise<string>) | undefined {
  const provider = resolveModelProvider(env.AI_PROVIDER);
  return hasProviderKey(provider, env)
    ? (prompt, system) => generateModelText({ prompt, system, env })
    : undefined;
}

async function generateOpenAiText(
  prompt: string,
  system: string,
  apiKey: string,
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("provider_request_failed");
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = payload.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("provider_empty_response");
  }

  return text;
}

async function generateGeminiText(
  prompt: string,
  system: string,
  apiKey: string,
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0 },
      }),
    },
  );

  if (!response.ok) {
    throw new Error("provider_request_failed");
  }

  const payload = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("provider_empty_response");
  }

  return text;
}
