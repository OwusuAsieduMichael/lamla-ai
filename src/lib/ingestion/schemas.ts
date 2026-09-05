import { z } from "zod";

import { ingestionJobStatuses, ingestionSkipReasons } from "./enums";

export const ingestionJobStatusSchema = z.enum(ingestionJobStatuses);
export const ingestionSkipReasonSchema = z.enum(ingestionSkipReasons);

export const textChunkSchema = z.object({
  index: z.number().int().nonnegative(),
  content: z.string().trim().min(1),
  tokenCount: z.number().int().positive(),
});

export const ingestionJobSchema = z.object({
  id: z.uuid(),
  manifestId: z.string().trim().min(1).nullable(),
  resourceId: z.uuid().nullable(),
  status: ingestionJobStatusSchema,
  skipReason: ingestionSkipReasonSchema.nullable(),
  errorMessage: z.string().nullable(),
  mimeType: z.string().nullable(),
  extractedCharCount: z.number().int().nonnegative().nullable(),
  chunkCount: z.number().int().nonnegative().nullable(),
});
