"use server";

import { z } from "zod";

import { allowRequest } from "@/lib/security";
import { parseInput } from "@/lib/validation/parse";
import { saveOwnedItem } from "@/lib/workspace/persist";
import { getAuthSession } from "@/lib/auth";

const saveSchema = z.object({
  title: z.string().trim().min(1).max(160),
  body: z.string().trim().min(1).max(8000),
  messageId: z.string().uuid().optional(),
});

export async function saveResponseAction(input: {
  title: string;
  body: string;
  messageId?: string | null;
}): Promise<{ ok: true } | { error: string }> {
  const parsed = parseInput(saveSchema, {
    title: input.title,
    body: input.body,
    messageId: input.messageId ?? undefined,
  });

  if (!parsed.success) {
    return { error: "Nothing to save." };
  }

  const session = await getAuthSession();
  const rateKey = session.profile
    ? `save:${session.profile.id}`
    : "save:anonymous";

  if (!allowRequest(rateKey, 20, 60_000)) {
    return { error: "Too many saves. Wait a moment and try again." };
  }

  const result = await saveOwnedItem({
    title: parsed.data.title,
    body: parsed.data.body,
    messageId: parsed.data.messageId,
  });

  if ("error" in result) {
    return result;
  }

  return { ok: true };
}
