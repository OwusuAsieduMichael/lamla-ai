import { learningModeCopy, type LearningMode } from "@/config/workspace";

import { buildGroundedPrompt } from "./ground";
import type { RankedChunk } from "@/lib/retrieval";

export function applyLearningMode(
  question: string,
  mode: LearningMode,
): string {
  const instruction = learningModeCopy[mode].instruction;

  if (mode === "ask") {
    return question;
  }

  return `${instruction}\n\nStudent question:\n${question}`;
}

export function buildModePrompt(
  question: string,
  sources: RankedChunk[],
  mode: LearningMode,
): string {
  return buildGroundedPrompt(applyLearningMode(question, mode), sources);
}
