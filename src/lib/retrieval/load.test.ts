import { describe, expect, it } from "vitest";

import { hasPublicSupabaseConfig } from "@/lib/env/public";

describe("authorized retrieval gate", () => {
  it("does not treat a missing Supabase project as a corpus", () => {
    expect(hasPublicSupabaseConfig({})).toBe(false);
  });
});
