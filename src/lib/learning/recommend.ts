import { scoreAcademicImportance } from "@/lib/importance";
import type { RetrievableChunk } from "@/lib/retrieval";

export type LearningRecommendation = {
  title: string;
  reason: string;
  sourceTitle: string;
};

export function recommendNextStudy(
  chunks: RetrievableChunk[],
): LearningRecommendation[] {
  return [...chunks]
    .map((chunk) => ({
      chunk,
      score: scoreAcademicImportance({
        pastQuestionOverlap: chunk.importanceScore,
        recency: 0.5,
        sourceWeight: 0.5,
      }),
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((item) => ({
      title: item.chunk.sourceTitle,
      reason: "Ranked from authorized source importance, not invented course advice.",
      sourceTitle: item.chunk.sourceTitle,
    }));
}
