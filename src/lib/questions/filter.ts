export type PastQuestionFilters = {
  courseCode?: string;
  academicYear?: string;
  topic?: string;
  concept?: string;
};

export type FilterablePastQuestion = {
  title: string;
  academicYear: string | null;
  sourceAttribution: string;
  courseCode: string | null;
  topicTitle: string | null;
  conceptTitle: string | null;
  itemCount: number;
};

export function filterPastQuestions(
  papers: FilterablePastQuestion[],
  filters: PastQuestionFilters,
): FilterablePastQuestion[] {
  const courseCode = filters.courseCode?.trim().toLowerCase();
  const academicYear = filters.academicYear?.trim().toLowerCase();
  const topic = filters.topic?.trim().toLowerCase();
  const concept = filters.concept?.trim().toLowerCase();

  return papers.filter((paper) => {
    if (courseCode && (paper.courseCode ?? "").toLowerCase() !== courseCode) {
      return false;
    }

    if (
      academicYear &&
      (paper.academicYear ?? "").toLowerCase() !== academicYear
    ) {
      return false;
    }

    if (topic && !(paper.topicTitle ?? "").toLowerCase().includes(topic)) {
      return false;
    }

    if (
      concept &&
      !(paper.conceptTitle ?? "").toLowerCase().includes(concept)
    ) {
      return false;
    }

    return paper.sourceAttribution.trim().length > 0;
  });
}
