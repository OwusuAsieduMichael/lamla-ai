import { hasPublicSupabaseConfig } from "@/lib/env/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import {
  filterPastQuestions,
  type FilterablePastQuestion,
  type PastQuestionFilters,
} from "./filter";
import { summarizePastQuestions } from "./summarize";

export async function loadAuthorizedPastQuestions(
  filters: PastQuestionFilters = {},
): Promise<FilterablePastQuestion[]> {
  const papers = await loadFilterablePastQuestions();
  return summarizePastQuestions(filterPastQuestions(papers, filters));
}

export async function loadFilterablePastQuestions(): Promise<
  FilterablePastQuestion[]
> {
  if (!hasPublicSupabaseConfig()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: papers, error } = await supabase
      .from("past_questions")
      .select("id, title, academic_year, source_attribution, course_id")
      .eq("status", "approved");

    if (error || !papers) {
      return [];
    }

    const courseIds = [...new Set(papers.map((paper) => paper.course_id))];
    const { data: courses } = courseIds.length
      ? await supabase.from("courses").select("id, code").in("id", courseIds)
      : { data: [] };

    const courseCodes = new Map(
      (courses ?? []).map((course) => [course.id, course.code]),
    );

    const paperIds = papers.map((paper) => paper.id);
    const { data: items } = paperIds.length
      ? await supabase
          .from("past_question_items")
          .select("past_question_id, topic_id, concept_id")
          .in("past_question_id", paperIds)
      : { data: [] };

    const topicIds = [
      ...new Set(
        (items ?? [])
          .map((item) => item.topic_id)
          .filter((id): id is string => Boolean(id)),
      ),
    ];
    const conceptIds = [
      ...new Set(
        (items ?? [])
          .map((item) => item.concept_id)
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    const { data: topics } = topicIds.length
      ? await supabase.from("topics").select("id, title").in("id", topicIds)
      : { data: [] };
    const { data: concepts } = conceptIds.length
      ? await supabase.from("concepts").select("id, title").in("id", conceptIds)
      : { data: [] };

    const topicTitles = new Map(
      (topics ?? []).map((topic) => [topic.id, topic.title]),
    );
    const conceptTitles = new Map(
      (concepts ?? []).map((concept) => [concept.id, concept.title]),
    );

    const itemMeta = new Map<
      string,
      { count: number; topics: Set<string>; concepts: Set<string> }
    >();

    for (const item of items ?? []) {
      const current = itemMeta.get(item.past_question_id) ?? {
        count: 0,
        topics: new Set<string>(),
        concepts: new Set<string>(),
      };
      current.count += 1;

      if (item.topic_id) {
        const title = topicTitles.get(item.topic_id);
        if (title) {
          current.topics.add(title);
        }
      }

      if (item.concept_id) {
        const title = conceptTitles.get(item.concept_id);
        if (title) {
          current.concepts.add(title);
        }
      }

      itemMeta.set(item.past_question_id, current);
    }

    return papers.map((paper) => {
      const meta = itemMeta.get(paper.id);

      return {
        title: paper.title,
        academicYear: paper.academic_year,
        sourceAttribution: paper.source_attribution,
        courseCode: courseCodes.get(paper.course_id) ?? null,
        topicTitle: meta ? [...meta.topics].join(", ") : null,
        conceptTitle: meta ? [...meta.concepts].join(", ") : null,
        itemCount: meta?.count ?? 0,
      };
    });
  } catch {
    return [];
  }
}
