import { z } from "zod";

import {
  authorizationStatuses,
  resourceKinds,
  resourceStatuses,
  semesters,
  userRoles,
} from "./enums";

const slugSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, or hyphens.");

const nonEmptyTextSchema = z.string().trim().min(1);

export const userRoleSchema = z.enum(userRoles);
export const semesterSchema = z.enum(semesters);
export const resourceKindSchema = z.enum(resourceKinds);
export const resourceStatusSchema = z.enum(resourceStatuses);
export const authorizationStatusSchema = z.enum(authorizationStatuses);

export const institutionSchema = z.object({
  id: z.uuid(),
  slug: slugSchema,
  name: nonEmptyTextSchema,
});

export const collegeSchema = institutionSchema.extend({
  institutionId: z.uuid(),
});

export const facultySchema = institutionSchema.extend({
  collegeId: z.uuid(),
});

export const departmentSchema = institutionSchema.extend({
  facultyId: z.uuid(),
});

export const programmeSchema = institutionSchema.extend({
  departmentId: z.uuid(),
});

export const profileSchema = z.object({
  id: z.uuid(),
  displayName: z.string().trim().min(1).nullable(),
  role: userRoleSchema,
  programmeId: z.uuid().nullable(),
});

export const courseSchema = z.object({
  id: z.uuid(),
  programmeId: z.uuid(),
  code: nonEmptyTextSchema,
  title: nonEmptyTextSchema,
  yearLevel: z.number().int().min(100).max(999),
  semester: semesterSchema,
  credits: z.number().nonnegative().nullable(),
  description: z.string().nullable(),
});

export const topicSchema = z.object({
  id: z.uuid(),
  courseId: z.uuid(),
  parentId: z.uuid().nullable(),
  title: nonEmptyTextSchema,
  sortOrder: z.number().int(),
});

export const conceptSchema = z.object({
  id: z.uuid(),
  courseId: z.uuid(),
  topicId: z.uuid(),
  title: nonEmptyTextSchema,
  description: z.string().nullable(),
  sortOrder: z.number().int(),
});

export const academicResourceSchema = z.object({
  id: z.uuid(),
  courseId: z.uuid(),
  topicId: z.uuid().nullable(),
  conceptId: z.uuid().nullable(),
  kind: resourceKindSchema,
  status: resourceStatusSchema,
  title: nonEmptyTextSchema,
  description: z.string().nullable(),
  sourceAttribution: nonEmptyTextSchema,
  academicYear: z.string().nullable(),
  storageBucket: nonEmptyTextSchema,
  storagePath: z.string().nullable(),
  mimeType: z.string().nullable(),
  byteSize: z.number().int().nonnegative().nullable(),
  checksumSha256: z.string().nullable(),
  createdBy: z.uuid().nullable(),
  license: z.string().nullable(),
  authorizationStatus: authorizationStatusSchema,
  authorizedBy: z.string().nullable(),
  authorizedAt: z.string().nullable(),
  authorizationNote: z.string().nullable(),
  manifestId: z.string().nullable(),
});

export const pastQuestionSchema = z.object({
  id: z.uuid(),
  courseId: z.uuid(),
  resourceId: z.uuid().nullable(),
  status: resourceStatusSchema,
  title: nonEmptyTextSchema,
  academicYear: z.string().nullable(),
  semester: semesterSchema.nullable(),
  sourceAttribution: nonEmptyTextSchema,
});

export const pastQuestionItemSchema = z.object({
  id: z.uuid(),
  pastQuestionId: z.uuid(),
  courseId: z.uuid(),
  topicId: z.uuid().nullable(),
  conceptId: z.uuid().nullable(),
  promptText: z.string().nullable(),
  marks: z.number().nonnegative().nullable(),
  sortOrder: z.number().int(),
});

export const resourceChunkSchema = z.object({
  id: z.uuid(),
  jobId: z.uuid(),
  resourceId: z.uuid().nullable(),
  chunkIndex: z.number().int().nonnegative(),
  content: nonEmptyTextSchema,
  tokenCount: z.number().int().positive().nullable(),
  importanceScore: z.number().min(0).max(1).nullable(),
});

export const learningEventSchema = z.object({
  id: z.uuid(),
  profileId: z.uuid().nullable(),
  resourceId: z.uuid().nullable(),
  kind: nonEmptyTextSchema,
});

export type InstitutionInput = z.infer<typeof institutionSchema>;
export type CollegeInput = z.infer<typeof collegeSchema>;
export type FacultyInput = z.infer<typeof facultySchema>;
export type DepartmentInput = z.infer<typeof departmentSchema>;
export type ProgrammeInput = z.infer<typeof programmeSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type TopicInput = z.infer<typeof topicSchema>;
export type ConceptInput = z.infer<typeof conceptSchema>;
export type AcademicResourceInput = z.infer<typeof academicResourceSchema>;
export type PastQuestionInput = z.infer<typeof pastQuestionSchema>;
export type PastQuestionItemInput = z.infer<typeof pastQuestionItemSchema>;
export type ResourceChunkInput = z.infer<typeof resourceChunkSchema>;
export type LearningEventInput = z.infer<typeof learningEventSchema>;
