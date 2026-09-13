import { hasPublicSupabaseConfig } from "@/lib/env/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthorizedCourse = {
  id: string;
  code: string;
  title: string;
  yearLevel: number;
  semester: string;
  description: string | null;
};

export async function loadAuthorizedCourses(): Promise<AuthorizedCourse[]> {
  if (!hasPublicSupabaseConfig()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("courses")
      .select("id, code, title, year_level, semester, description")
      .order("year_level", { ascending: true })
      .order("code", { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.map((course) => ({
      id: course.id,
      code: course.code,
      title: course.title,
      yearLevel: course.year_level,
      semester: course.semester,
      description: course.description,
    }));
  } catch {
    return [];
  }
}
