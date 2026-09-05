/**
 * Public academic table names.
 * Query modules should import these instead of repeating strings.
 */
export const academicTables = [
  "institutions",
  "colleges",
  "faculties",
  "departments",
  "programmes",
  "profiles",
  "courses",
  "topics",
  "concepts",
  "academic_resources",
  "past_questions",
  "past_question_items",
  "ingestion_jobs",
  "resource_chunks",
  "learning_events",
] as const;

export type AcademicTable = (typeof academicTables)[number];

export const academicStorageBucket = "academic-resources";
