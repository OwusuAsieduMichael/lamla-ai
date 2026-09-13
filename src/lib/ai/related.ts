import { rankChunks, type RetrievableChunk } from "@/lib/retrieval";

export type RelatedEvidence = {
  resources: Array<{
    title: string;
    sourceAttribution: string;
  }>;
};

export function collectRelatedEvidence(
  query: string,
  chunks: RetrievableChunk[],
): RelatedEvidence {
  const ranked = rankChunks(query, chunks, 5);
  const seen = new Set<string>();
  const resources: RelatedEvidence["resources"] = [];

  for (const chunk of ranked) {
    const key = `${chunk.sourceTitle}::${chunk.sourceAttribution}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    resources.push({
      title: chunk.sourceTitle,
      sourceAttribution: chunk.sourceAttribution,
    });
  }

  return { resources };
}
