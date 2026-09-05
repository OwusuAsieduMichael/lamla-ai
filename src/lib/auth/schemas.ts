import { z } from "zod";

export const authEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email());

export const authPasswordSchema = z.string().min(8).max(72);

export const displayNameInputSchema = z
  .string()
  .trim()
  .max(80)
  .transform((value) => (value.length > 0 ? value : null));

export const signInSchema = z.object({
  email: authEmailSchema,
  password: authPasswordSchema,
  next: z.string().optional(),
});

export const signUpSchema = signInSchema.extend({
  displayName: displayNameInputSchema,
});

export const updateDisplayNameSchema = z.object({
  displayName: displayNameInputSchema,
});

export function safeNextPath(value: string | undefined): string {
  if (!value) {
    return "/";
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) {
    return "/";
  }

  return value;
}
