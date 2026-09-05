import type { z } from "zod";

export type ParseSuccess<T> = {
  success: true;
  data: T;
};

export type ParseFailure = {
  success: false;
  error: z.ZodError;
};

export type ParseResult<T> = ParseSuccess<T> | ParseFailure;

/**
 * Shared input-validation helper.
 * All user-facing and external input should pass through a Zod schema
 * before it reaches application logic or the database.
 */
export function parseInput<T>(
  schema: z.ZodType<T>,
  data: unknown,
): ParseResult<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data };
}
