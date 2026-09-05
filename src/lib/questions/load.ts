import { hasPublicSupabaseConfig } from "@/lib/env/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { summarizePastQuestions, type PastQuestionSummary } from "./summarize";

export async function loadAuthorizedPastQuestions(): Promise<
  PastQuestionSummary[]
> {
  if (!hasPublicSupabaseConfig()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("past_questions")
      .select("title, academic_year, source_attribution")
      .eq("status", "approved");

    if (error || !data) {
      return [];
    }

    return summarizePastQuestions(
      data.map((paper) => ({
        title: paper.title,
        academicYear: paper.academic_year,
        itemCount: 0,
        sourceAttribution: paper.source_attribution,
      })),
    );
  } catch {
    return [];
  }
}
