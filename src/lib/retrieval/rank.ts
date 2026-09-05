export type RetrievableChunk = {
  id: string;
  content: string;
  sourceTitle: string;
  sourceAttribution: string;
  importanceScore: number;
};

export type RankedChunk = RetrievableChunk & {
  score: number;
};

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1);
}

export function rankChunks(
  query: string,
  chunks: RetrievableChunk[],
  limit = 5,
): RankedChunk[] {
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0 || chunks.length === 0) {
    return [];
  }

  return chunks
    .map((chunk) => {
      const contentTokens = tokenize(chunk.content);
      const overlap = queryTokens.filter((token) =>
        contentTokens.includes(token),
      ).length;
      const lexical = overlap / queryTokens.length;
      const score = lexical * 0.7 + chunk.importanceScore * 0.3;

      return { ...chunk, score };
    })
    .filter((chunk) => chunk.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}
