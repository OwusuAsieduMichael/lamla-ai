import type { AllowedResourceMimeType } from "@/lib/dataset/constants";

import { normalizeExtractedText } from "./chunk";

export type ExtractedDocument = {
  mimeType: AllowedResourceMimeType;
  text: string;
};

export function extractPlainText(raw: string): string {
  return normalizeExtractedText(raw);
}

export function extractDocumentText(
  mimeType: AllowedResourceMimeType,
  rawText: string,
): ExtractedDocument {
  if (mimeType !== "text/plain") {
    throw new Error(`No text extractor is wired for ${mimeType}.`);
  }

  return {
    mimeType,
    text: extractPlainText(rawText),
  };
}
