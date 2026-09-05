export const userRoles = ["student", "maintainer", "admin"] as const;
export const semesters = ["first", "second"] as const;
export const resourceKinds = [
  "lecture_note",
  "slide",
  "textbook_extract",
  "past_question_paper",
  "marking_scheme",
  "lab_manual",
  "assignment",
  "other",
] as const;
export const resourceStatuses = ["draft", "approved", "archived"] as const;
export const authorizationStatuses = ["pending", "granted", "denied"] as const;

export type UserRole = (typeof userRoles)[number];
export type Semester = (typeof semesters)[number];
export type ResourceKind = (typeof resourceKinds)[number];
export type ResourceStatus = (typeof resourceStatuses)[number];
export type AuthorizationStatus = (typeof authorizationStatuses)[number];
