import { describe, expect, it } from "vitest";

import { EnvConfigError } from "./errors";
import { requireServiceRoleKey } from "./service-role";

describe("requireServiceRoleKey", () => {
  it("returns the key when present", () => {
    expect(
      requireServiceRoleKey({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-key",
        SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
      }),
    ).toBe("service-role-key");
  });

  it("fails clearly when the service-role key is missing", () => {
    expect(() =>
      requireServiceRoleKey({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-key",
      }),
    ).toThrow(EnvConfigError);
  });
});
