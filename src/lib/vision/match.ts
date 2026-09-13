import { rankChunks, type RetrievableChunk } from "@/lib/retrieval";

export type VisionMatchTier = "exact" | "likely" | "none";

export type VisionMatch = {
  tier: VisionMatchTier;
  confidence: "none" | "low" | "medium" | "high";
  note: string;
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function classifyVisionMatch({
  extractedText,
  chunks,
}: {
  extractedText: string | null;
  chunks: RetrievableChunk[];
}): VisionMatch {
  const text = extractedText?.trim() ?? "";

  if (!text) {
    return {
      tier: "none",
      confidence: "none",
      note: "No readable text was extracted, so LAMLA cannot claim a source match.",
    };
  }

  if (chunks.length === 0) {
    return {
      tier: "none",
      confidence: "none",
      note: "No authorized academic chunks are available to compare against this image.",
    };
  }

  const normalized = normalize(text);

  for (const chunk of chunks) {
    const chunkText = normalize(chunk.content);

    if (
      normalized.length >= 24 &&
      chunkText.includes(normalized)
    ) {
      return {
        tier: "exact",
        confidence: "high",
        note: `Exact text overlap with ${chunk.sourceTitle}.`,
      };
    }
  }

  const ranked = rankChunks(text, chunks, 1);

  if (ranked[0] && ranked[0].score >= 0.45) {
    return {
      tier: "likely",
      confidence: "medium",
      note: `Likely related to ${ranked[0].sourceTitle}. This is not an exact source claim.`,
    };
  }

  return {
    tier: "none",
    confidence: "low",
    note: "No confident match to an authorized academic resource.",
  };
}
