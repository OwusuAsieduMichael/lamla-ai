export type PastQuestionSummary = {
  title: string;
  academicYear: string | null;
  itemCount: number;
  sourceAttribution: string;
};

export function summarizePastQuestions(
  papers: PastQuestionSummary[],
): PastQuestionSummary[] {
  return papers.filter((paper) => paper.sourceAttribution.trim().length > 0);
}
