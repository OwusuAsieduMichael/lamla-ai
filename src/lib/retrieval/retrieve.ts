import { rankChunks, type RankedChunk, type RetrievableChunk } from "./rank";

export type RetrievalInput = {
  query: string;
  chunks: RetrievableChunk[];
  limit?: number;
};

export function retrieveAuthorizedChunks({
  query,
  chunks,
  limit = 5,
}: RetrievalInput): RankedChunk[] {
  return rankChunks(query, chunks, limit);
}
