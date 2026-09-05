import { unassignedCourseSegment } from "./constants";

const unsafePathPattern = /(^|[\\/])\.\.([\\/]|$)/;

function sanitizeSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Suggested private-storage path for an authorized file.
 * Course codes stay `_unassigned` until an authorized catalog row exists.
 */
export function buildSuggestedStoragePath({
  programmeSlug,
  courseCode,
  kind,
  filename,
}: {
  programmeSlug: string;
  courseCode: string | null;
  kind: string;
  filename: string;
}): string {
  const programme = sanitizeSegment(programmeSlug);
  const course = courseCode
    ? sanitizeSegment(courseCode)
    : unassignedCourseSegment;
  const resourceKind = sanitizeSegment(kind);
  const safeName = sanitizeSegment(filename);

  if (!programme || !resourceKind || !safeName) {
    throw new Error("Storage path segments cannot be empty.");
  }

  const relativePath = `${programme}/${course}/${resourceKind}/${safeName}`;

  if (unsafePathPattern.test(relativePath)) {
    throw new Error("Storage path must not contain parent-directory segments.");
  }

  return relativePath;
}

export function assertSafeRelativePath(path: string): string {
  const trimmed = path.trim();

  if (!trimmed || trimmed.startsWith("/") || trimmed.includes("\\")) {
    throw new Error("Storage path must be a relative POSIX path.");
  }

  if (unsafePathPattern.test(trimmed)) {
    throw new Error("Storage path must not contain parent-directory segments.");
  }

  return trimmed;
}
