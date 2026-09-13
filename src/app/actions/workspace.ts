"use server";

import { z } from "zod";

import {
  isLearningMode,
  isWorkspaceChannel,
  type LearningMode,
  type WorkspaceChannel,
} from "@/config/workspace";
import { answerAcademicQuestion } from "@/lib/ai";
import type { RelatedEvidence } from "@/lib/ai";
import { getAuthSession } from "@/lib/auth";
import { recordLearningEvent } from "@/lib/learning";
import { loadAuthorizedChunks } from "@/lib/retrieval/load";
import { allowRequest } from "@/lib/security";
import { parseInput } from "@/lib/validation/parse";
import { persistWorkspaceTurn } from "@/lib/workspace/persist";
import type { VisionMatch } from "@/lib/vision";
import { inspectAcademicImage } from "@/lib/vision";
import { loadAuthorizedResources } from "@/lib/retrieval/load";

const workspaceSchema = z.object({
  question: z.string().trim().min(3).max(2000),
  conversationId: z.string().uuid().optional(),
  channel: z.string(),
  mode: z.string(),
});

export type WorkspaceSource = {
  id: string;
  sourceTitle: string;
  sourceAttribution: string;
};

export type WorkspaceActionResult =
  | {
      conversationId: string | null;
      messageId: string | null;
      signedIn: boolean;
      refused: boolean;
      reason: string;
      text: string;
      sources: WorkspaceSource[];
      related: RelatedEvidence;
      match?: VisionMatch;
    }
  | { error: string };

const imageKinds = new Set(["slide", "lecture_note", "other"]);

export async function submitWorkspaceTurn(
  input: {
    question: string;
    conversationId?: string | null;
    channel?: string;
    mode?: string;
  },
): Promise<WorkspaceActionResult> {
  const parsed = parseInput(workspaceSchema, {
    question: input.question,
    conversationId: input.conversationId ?? undefined,
    channel: input.channel ?? "text",
    mode: input.mode ?? "ask",
  });

  if (!parsed.success) {
    return { error: "Ask a specific academic question." };
  }

  if (
    !isWorkspaceChannel(parsed.data.channel) ||
    !isLearningMode(parsed.data.mode)
  ) {
    return { error: "That workspace mode is not available." };
  }

  const session = await getAuthSession();
  const rateKey = session.profile
    ? `ask:${session.profile.id}`
    : "ask:anonymous";

  if (!allowRequest(rateKey, 20, 60_000)) {
    return { error: "Too many questions. Wait a moment and try again." };
  }

  const channel = parsed.data.channel as WorkspaceChannel;
  const mode = parsed.data.mode as LearningMode;

  if (channel === "image") {
    const resources = await loadAuthorizedResources();
    const authorizedImages = resources.filter((resource) =>
      imageKinds.has(resource.kind),
    );
    const inspection = inspectAcademicImage(authorizedImages.length);

    return {
      conversationId: null,
      messageId: null,
      signedIn: Boolean(session.profile),
      refused: inspection.refused,
      reason: inspection.reason,
      text: inspection.text,
      sources: [],
      related: { resources: [] },
      match: inspection.match,
    };
  }

  const answer = await answerAcademicQuestion({
    question: parsed.data.question,
    chunks: await loadAuthorizedChunks(),
    mode,
  });

  await recordLearningEvent(mode);

  const persisted = session.profile
    ? await persistWorkspaceTurn({
        conversationId: parsed.data.conversationId,
        question: parsed.data.question,
        answer: answer.text,
        refused: answer.refused,
        reason: answer.reason,
        channel,
        mode,
        sources: answer.sources,
      })
    : null;

  return {
    conversationId: persisted?.conversationId ?? null,
    messageId: persisted?.assistantMessageId ?? null,
    signedIn: Boolean(session.profile),
    refused: answer.refused,
    reason: answer.reason,
    text: answer.text,
    sources: answer.sources.map((source) => ({
      id: source.id,
      sourceTitle: source.sourceTitle,
      sourceAttribution: source.sourceAttribution,
    })),
    related: answer.related,
  };
}
