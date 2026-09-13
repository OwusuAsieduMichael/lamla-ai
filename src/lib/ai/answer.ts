import type { LearningMode } from "@/config/workspace";
import { retrieveAuthorizedChunks } from "@/lib/retrieval";
import type { RetrievableChunk } from "@/lib/retrieval";

import { createConfiguredGenerator } from "./generate";
import {
  groundedSystemInstruction,
  refuseWithoutProvider,
  refuseWithoutSources,
  type GroundedAnswer,
} from "./ground";
import { buildModePrompt } from "./modes";
import { collectRelatedEvidence, type RelatedEvidence } from "./related";

export type AnswerQuestionInput = {
  question: string;
  chunks: RetrievableChunk[];
  mode?: LearningMode;
  env?: Record<string, string | undefined>;
  generate?: (prompt: string, system: string) => Promise<string>;
};

export type WorkspaceAnswer = GroundedAnswer & {
  related: RelatedEvidence;
};

export async function answerAcademicQuestion({
  question,
  chunks,
  mode = "ask",
  env = process.env,
  generate,
}: AnswerQuestionInput): Promise<WorkspaceAnswer> {
  const sources = retrieveAuthorizedChunks({ query: question, chunks });
  const related = collectRelatedEvidence(question, chunks);

  if (sources.length === 0) {
    return { ...refuseWithoutSources(), related };
  }

  const generateAnswer = generate ?? createConfiguredGenerator(env);

  if (!generateAnswer) {
    return { ...refuseWithoutProvider(sources), related };
  }

  try {
    const text = await generateAnswer(
      buildModePrompt(question, sources, mode),
      groundedSystemInstruction,
    );

    if (!text.trim()) {
      return { ...refuseWithoutProvider(sources), related };
    }

    return {
      refused: false,
      reason: "answered",
      text,
      sources,
      related,
    };
  } catch {
    return { ...refuseWithoutProvider(sources), related };
  }
}
