import { describe, expect, it } from "vitest";

import { EnvConfigError } from "./errors";
import { hasPublicSupabaseConfig, readPublicEnv } from "./public";

const validSource = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-key",
};

describe("readPublicEnv", () => {
  it("returns parsed public values when they are valid", () => {
    expect(readPublicEnv(validSource)).toEqual(validSource);
  });

  it("throws a development error that does not include secret values", () => {
    expect(() =>
      readPublicEnv({
        NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "super-secret-value",
      }),
    ).toThrow(EnvConfigError);

    try {
      readPublicEnv({
        NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "super-secret-value",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(EnvConfigError);
      expect(String(error)).not.toContain("super-secret-value");
    }
  });
});

describe("hasPublicSupabaseConfig", () => {
  it("is true only when both public Supabase values are valid", () => {
    expect(hasPublicSupabaseConfig(validSource)).toBe(true);
    expect(hasPublicSupabaseConfig({})).toBe(false);
  });
});
