import type { GroundedAnswer } from "@/lib/ai";

import { classifyVisionMatch, type VisionMatch } from "./match";

export type VisionInspection = GroundedAnswer & {
  match: VisionMatch;
};

export function inspectAcademicImage(
  authorizedImageCount = 0,
): VisionInspection {
  const match = classifyVisionMatch({
    extractedText: null,
    chunks: [],
  });

  if (authorizedImageCount <= 0) {
    return {
      refused: true,
      reason: "no_authorized_sources",
      text: "Vision can only read authorized academic images after they are collected and ingested. No such image is available yet, and the pipeline will not invent a reading.",
      sources: [],
      match: {
        ...match,
        note: "No authorized academic image is available. LAMLA will not invent a source match.",
      },
    };
  }

  return {
    refused: true,
    reason: "provider_not_configured",
    text: "An authorized image exists, but the vision reader is not wired yet. LAMLA will not guess a lecture from the file.",
    sources: [],
    match: {
      tier: "none",
      confidence: "none",
      note: "OCR is not configured, so this is not an exact or likely source match.",
    },
  };
}
