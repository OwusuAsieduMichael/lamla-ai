export const defaultChunkOptions = {
  maxChars: 800,
  overlapChars: 120,
} as const;

export type ChunkOptions = {
  maxChars: number;
  overlapChars: number;
};

export type TextChunk = {
  index: number;
  content: string;
  tokenCount: number;
};

export function estimateTokenCount(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

export function normalizeExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function chunkText(
  text: string,
  options: ChunkOptions = defaultChunkOptions,
): TextChunk[] {
  const normalized = normalizeExtractedText(text);

  if (!normalized) {
    return [];
  }

  const maxChars = Math.max(1, options.maxChars);
  const overlapChars = Math.min(Math.max(0, options.overlapChars), maxChars - 1);
  const chunks: TextChunk[] = [];
  let start = 0;
  let index = 0;

  while (start < normalized.length) {
    const end = Math.min(start + maxChars, normalized.length);
    const content = normalized.slice(start, end).trim();

    if (content.length > 0) {
      chunks.push({
        index,
        content,
        tokenCount: estimateTokenCount(content),
      });
      index += 1;
    }

    if (end >= normalized.length) {
      break;
    }

    start = end - overlapChars;
  }

  return chunks;
}
