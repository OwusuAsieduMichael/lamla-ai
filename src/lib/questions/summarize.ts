export type PastQuestionSummary = {
  title: string;
  academicYear: string | null;
  itemCount: number;
  sourceAttribution: string;
};

export function summarizePastQuestions<T extends PastQuestionSummary>(
  papers: T[],
): T[] {
  return papers.filter((paper) => paper.sourceAttribution.trim().length > 0);
}
