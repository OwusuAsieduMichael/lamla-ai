import type { GroundedAnswer } from "@/lib/ai";

export function inspectAcademicImage(
  authorizedImageCount = 0,
): GroundedAnswer {
  if (authorizedImageCount <= 0) {
    return {
      refused: true,
      reason: "no_authorized_sources",
      text: "Vision can only read authorized academic images after they are collected and ingested. No such image is available yet, and the pipeline will not invent a reading.",
      sources: [],
    };
  }

  return {
    refused: true,
    reason: "provider_not_configured",
    text: "An authorized image exists, but the vision reader is not wired yet. LAMLA will not guess a lecture from the file.",
    sources: [],
  };
}
