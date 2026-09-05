import { retrieveAuthorizedChunks } from "@/lib/retrieval";
import type { RetrievableChunk } from "@/lib/retrieval";

import { createConfiguredGenerator } from "./generate";
import {
  buildGroundedPrompt,
  groundedSystemInstruction,
  refuseWithoutProvider,
  refuseWithoutSources,
  type GroundedAnswer,
} from "./ground";

export type AnswerQuestionInput = {
  question: string;
  chunks: RetrievableChunk[];
  env?: Record<string, string | undefined>;
  generate?: (prompt: string, system: string) => Promise<string>;
};

export async function answerAcademicQuestion({
  question,
  chunks,
  env = process.env,
  generate,
}: AnswerQuestionInput): Promise<GroundedAnswer> {
  const sources = retrieveAuthorizedChunks({ query: question, chunks });

  if (sources.length === 0) {
    return refuseWithoutSources();
  }

  const generateAnswer = generate ?? createConfiguredGenerator(env);

  if (!generateAnswer) {
    return refuseWithoutProvider(sources);
  }

  try {
    const text = await generateAnswer(
      buildGroundedPrompt(question, sources),
      groundedSystemInstruction,
    );

    if (!text.trim()) {
      return refuseWithoutProvider(sources);
    }

    return {
      refused: false,
      reason: "answered",
      text,
      sources,
    };
  } catch {
    return refuseWithoutProvider(sources);
  }
}
