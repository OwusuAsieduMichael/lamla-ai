import type { ResourceManifest } from "@/lib/dataset/schemas";

import { chunkText, type TextChunk } from "./chunk";
import type { IngestionJobStatus, IngestionSkipReason } from "./enums";
import { extractDocumentText } from "./extract";
import { decideIngestion, type IncomingFileMeta } from "./gate";

export type IngestionFileInput = IncomingFileMeta & {
  text: string | null;
};

export type IngestionResult = {
  manifestId: string;
  status: IngestionJobStatus;
  skipReason: IngestionSkipReason | null;
  errorMessage: string | null;
  extractedCharCount: number;
  chunks: TextChunk[];
};

export function runIngestionPipeline(
  manifest: ResourceManifest,
  file: IngestionFileInput,
): IngestionResult {
  const decision = decideIngestion(manifest, file);

  if (!decision.ok) {
    return {
      manifestId: manifest.id,
      status: "skipped",
      skipReason: decision.reason,
      errorMessage: null,
      extractedCharCount: 0,
      chunks: [],
    };
  }

  try {
    const extracted = extractDocumentText(decision.mimeType, file.text ?? "");
    const chunks = chunkText(extracted.text);

    if (chunks.length === 0) {
      return {
        manifestId: manifest.id,
        status: "failed",
        skipReason: null,
        errorMessage: "Extractor produced no text chunks.",
        extractedCharCount: extracted.text.length,
        chunks: [],
      };
    }

    return {
      manifestId: manifest.id,
      status: "succeeded",
      skipReason: null,
      errorMessage: null,
      extractedCharCount: extracted.text.length,
      chunks,
    };
  } catch (error) {
    return {
      manifestId: manifest.id,
      status: "failed",
      skipReason: null,
      errorMessage:
        error instanceof Error ? error.message : "Ingestion failed.",
      extractedCharCount: 0,
      chunks: [],
    };
  }
}
