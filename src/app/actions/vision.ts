"use server";

import type { GroundedAnswer } from "@/lib/ai";
import { loadAuthorizedResources } from "@/lib/retrieval/load";
import { allowRequest } from "@/lib/security";
import { inspectAcademicImage } from "@/lib/vision";

const imageKinds = new Set(["slide", "lecture_note", "other"]);

export async function inspectImageAction(): Promise<
  GroundedAnswer | { error: string }
> {
  if (!allowRequest("vision:anonymous", 10, 60_000)) {
    return { error: "Too many vision checks. Wait a moment and try again." };
  }

  const resources = await loadAuthorizedResources();
  const authorizedImages = resources.filter((resource) =>
    imageKinds.has(resource.kind),
  );

  return inspectAcademicImage(authorizedImages.length);
}