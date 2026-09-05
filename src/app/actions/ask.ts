"use server";

import { answerAcademicQuestion } from "@/lib/ai";
import type { GroundedAnswer } from "@/lib/ai";
import { loadAuthorizedChunks } from "@/lib/retrieval/load";
import { allowRequest } from "@/lib/security";
import { parseInput } from "@/lib/validation/parse";
import { z } from "zod";

const questionSchema = z.object({
  question: z.string().trim().min(3).max(2000),
});

export async function askQuestionAction(
  rawQuestion: string,
): Promise<GroundedAnswer | { error: string }> {
  const parsed = parseInput(questionSchema, { question: rawQuestion });

  if (!parsed.success) {
    return { error: "Ask a specific academic question." };
  }

  if (!allowRequest("ask:anonymous", 20, 60_000)) {
    return { error: "Too many questions. Wait a moment and try again." };
  }

  return answerAcademicQuestion({
    question: parsed.data.question,
    chunks: await loadAuthorizedChunks(),
  });
}
